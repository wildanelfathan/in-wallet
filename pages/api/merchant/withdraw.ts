import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

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
  const { amount, bankAccountId, description } = req.body;

  if (!amount || !bankAccountId) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      message: 'amount and bankAccountId are required'
    });
  }

  try {
    // Verify the user is a merchant
    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .select('id, balance, currency')
      .eq('user_id', userId)
      .single();

    if (merchantError) {
      console.error('Database error:', merchantError);
      return res.status(500).json({ error: 'Failed to fetch merchant data' });
    }

    if (!merchant) {
      return res.status(403).json({ 
        error: 'Not authorized',
        message: 'User is not registered as a merchant'
      });
    }

    // Check if merchant has enough balance
    if (merchant.balance < amount) {
      return res.status(400).json({
        error: 'Insufficient funds',
        message: `Your current balance is ${merchant.balance} ${merchant.currency}`
      });
    }

    // Verify bank account belongs to the merchant
    const { data: bankAccount, error: bankError } = await supabase
      .from('merchant_bank_accounts')
      .select('id, bank_name, account_number, account_holder')
      .eq('id', bankAccountId)
      .eq('merchant_id', merchant.id)
      .single();

    if (bankError || !bankAccount) {
      return res.status(400).json({
        error: 'Invalid bank account',
        message: 'The selected bank account is not valid'
      });
    }

    // Generate a reference number for the withdrawal
    const referenceNumber = `WD-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // In a real implementation, you would integrate with a payment processor
    // or banking API to initiate the bank transfer

    // For this example, we'll simulate a withdrawal by updating the merchant balance
    // and creating a withdrawal record
    
    // Start a Supabase transaction
    // Note: Supabase doesn't support true transactions yet, so we'll do this in steps
    
    // 1. Update merchant balance
    const { error: updateError } = await supabase
      .from('merchants')
      .update({
        balance: merchant.balance - amount
      })
      .eq('id', merchant.id);

    if (updateError) {
      console.error('Error updating merchant balance:', updateError);
      return res.status(500).json({
        error: 'Failed to process withdrawal',
        message: updateError.message
      });
    }

    // 2. Create withdrawal record
    const { data: withdrawal, error: withdrawalError } = await supabase
      .from('merchant_withdrawals')
      .insert({
        merchant_id: merchant.id,
        bank_account_id: bankAccountId,
        amount,
        currency: merchant.currency,
        reference_number: referenceNumber,
        status: 'processing',
        description: description || 'Merchant withdrawal to bank account',
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (withdrawalError) {
      console.error('Error creating withdrawal record:', withdrawalError);
      
      // Attempt to rollback the balance update
      await supabase
        .from('merchants')
        .update({
          balance: merchant.balance
        })
        .eq('id', merchant.id);
        
      return res.status(500).json({
        error: 'Failed to create withdrawal record',
        message: withdrawalError.message
      });
    }

    return res.status(200).json({
      success: true,
      withdrawal: {
        id: withdrawal.id,
        referenceNumber,
        amount,
        currency: merchant.currency,
        status: 'processing',
        bankAccount: {
          bankName: bankAccount.bank_name,
          accountNumber: bankAccount.account_number,
          accountHolder: bankAccount.account_holder
        },
        estimatedArrival: '1-3 business days'
      }
    });

  } catch (error) {
    console.error('Withdrawal error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to process withdrawal. Please try again.'
    });
  }
} 