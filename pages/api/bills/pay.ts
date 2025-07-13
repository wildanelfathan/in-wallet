import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { generateReceipt } from '../../../utils/receipt';
import { getEnvVarOptional } from '../../../utils/getEnvVar';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user ID from header
  const userId = req.headers['x-user-id'];
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid x-user-id header' });
  }

  // Validate request body
  const { 
    providerId, 
    amount, 
    currency, 
    accountNumber, 
    customerFields, 
    walletId 
  } = req.body;

  if (!providerId || !amount || !currency || !accountNumber || !walletId) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      message: 'providerId, amount, currency, accountNumber, and walletId are required'
    });
  }

  try {
    // Get the provider to validate fields
    const { data: provider, error: providerError } = await supabase
      .from('bill_providers')
      .select('*')
      .eq('id', providerId)
      .single();

    if (providerError || !provider) {
      return res.status(400).json({ 
        error: 'Invalid provider',
        message: 'The selected provider does not exist'
      });
    }

    // Validate required fields
    if (provider.fields && Array.isArray(provider.fields)) {
      for (const field of provider.fields) {
        if (field.required && !customerFields?.[field.key]) {
          return res.status(400).json({
            error: 'Missing required field',
            message: `${field.label} is required`
          });
        }
        if (field.validation && customerFields?.[field.key]) {
          const regex = new RegExp(field.validation);
          if (!regex.test(customerFields[field.key])) {
            return res.status(400).json({
              error: 'Invalid field value',
              message: `${field.label} has an invalid format`
            });
          }
        }
      }
    }

    // Check wallet balance
    const { data: wallet, error: walletError } = await supabase
      .from('wallets')
      .select('balance, currency')
      .eq('id', walletId)
      .eq('user_id', userId)
      .single();

    if (walletError || !wallet) {
      return res.status(400).json({ 
        error: 'Invalid wallet',
        message: 'The selected wallet does not exist or does not belong to you'
      });
    }

    // Check if wallet has enough balance
    if (wallet.balance < amount) {
      return res.status(400).json({
        error: 'Insufficient funds',
        message: `Your current balance is ${wallet.balance} ${wallet.currency}`
      });
    }

    // Check if currencies match
    if (wallet.currency !== currency) {
      return res.status(400).json({
        error: 'Currency mismatch',
        message: `Wallet currency (${wallet.currency}) does not match payment currency (${currency})`
      });
    }

    // Create payment record with initial status
    const { data: paymentRecord, error: paymentError } = await supabase
      .from('bill_payments')
      .insert({
        user_id: userId,
        provider_id: providerId,
        amount,
        currency,
        account_number: accountNumber,
        customer_fields: customerFields || {},
        wallet_id: walletId,
        status: 'processing',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (paymentError) {
      return res.status(500).json({ 
        error: 'Failed to create payment record',
        message: paymentError.message
      });
    }

    // Process payment with DigiFlazz API if available
    const digiflazzApiKey = getEnvVarOptional('DIGIFLAZZ_API_KEY');
    let providerReference = '';
    
    if (digiflazzApiKey && digiflazzApiKey !== 'your-digiflazz-api-key') {
      try {
        // In a real implementation, you would call the DigiFlazz API here
        // For this example, we'll just simulate a successful payment
        providerReference = `DF-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
      } catch (apiError) {
        console.error('Error processing payment with DigiFlazz:', apiError);
        
        // Update payment status to failed
        await supabase
          .from('bill_payments')
          .update({
            status: 'failed',
            error_message: apiError instanceof Error ? apiError.message : 'Unknown error'
          })
          .eq('id', paymentRecord.id);
          
        return res.status(500).json({
          error: 'Payment processing failed',
          message: apiError instanceof Error ? apiError.message : 'Unknown error'
        });
      }
    } else {
      // Simulate a provider reference for testing
      providerReference = `SIM-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    }

    // Update wallet balance
    const { error: updateError } = await supabase
      .from('wallets')
      .update({
        balance: wallet.balance - amount
      })
      .eq('id', walletId);

    if (updateError) {
      console.error('Error updating wallet balance:', updateError);
      
      // Update payment status to failed
      await supabase
        .from('bill_payments')
        .update({
          status: 'failed',
          error_message: 'Failed to update wallet balance'
        })
        .eq('id', paymentRecord.id);
        
      return res.status(500).json({
        error: 'Payment processing failed',
        message: 'Failed to update wallet balance'
      });
    }

    // Update payment status to completed
    const { data: updatedPayment, error: updatePaymentError } = await supabase
      .from('bill_payments')
      .update({
        status: 'completed',
        provider_reference: providerReference,
        completed_at: new Date().toISOString()
      })
      .eq('id', paymentRecord.id)
      .select()
      .single();

    if (updatePaymentError) {
      console.error('Error updating payment status:', updatePaymentError);
      // Payment was processed but failed to update status
      return res.status(207).json({
        success: true,
        warning: 'Payment was processed but status update failed',
        transactionId: paymentRecord.id,
        providerReference
      });
    }

    // Generate receipt
    let receiptUrl = '';
    try {
      receiptUrl = await generateReceipt({
        ...updatedPayment,
        provider: provider.name,
        date: new Date().toISOString()
      });
    } catch (receiptError) {
      console.error('Error generating receipt:', receiptError);
      // Continue without receipt
    }

    return res.status(200).json({
      success: true,
      transactionId: updatedPayment.id,
      providerReference,
      receiptUrl,
      amount,
      currency,
      provider: provider.name,
      accountNumber,
      date: updatedPayment.completed_at
    });

  } catch (error) {
    console.error('Bill payment error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to process bill payment. Please try again.'
    });
  }
} 