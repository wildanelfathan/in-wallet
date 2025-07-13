import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { ethers } from 'ethers';

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
  const { amount, currency, paymentMethod } = req.body;

  if (!amount || !currency || !paymentMethod) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      message: 'amount, currency, and paymentMethod are required'
    });
  }

  try {
    // Get user's crypto wallet
    let { data: wallet, error: walletError } = await supabase
      .from('crypto_wallets')
      .select('address, network')
      .eq('user_id', userId)
      .single();

    if (walletError) {
      console.error('Database error:', walletError);
      return res.status(500).json({ error: 'Failed to fetch wallet data' });
    }

    if (!wallet) {
      // Create a new wallet for the user if one doesn't exist
      const privateKey = ethers.Wallet.createRandom().privateKey;
      const newWallet = new ethers.Wallet(privateKey);
      
      const { data: createdWallet, error: createError } = await supabase
        .from('crypto_wallets')
        .insert({
          user_id: userId,
          address: newWallet.address,
          private_key: privateKey,
          network: 'polygon', // Default network
          created_at: new Date().toISOString()
        })
        .select('address, network')
        .single();
      
      if (createError) {
        console.error('Error creating wallet:', createError);
        return res.status(500).json({ error: 'Failed to create wallet' });
      }
      
      wallet = createdWallet;
    }

    // In a real implementation, you would integrate with a payment processor
    // like Stripe, Coinbase Commerce, etc. to handle the actual payment
    
    // For this example, we'll simulate a successful payment and record it
    const transactionId = `TOP-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    // Record the topup transaction
    const { error: txError } = await supabase
      .from('crypto_transactions')
      .insert({
        user_id: userId,
        to_address: wallet.address,
        amount: amount,
        token_symbol: currency,
        network: wallet.network,
        transaction_hash: transactionId,
        status: 'completed',
        type: 'topup',
        payment_method: paymentMethod,
        created_at: new Date().toISOString()
      });

    if (txError) {
      console.error('Error recording transaction:', txError);
      return res.status(500).json({ 
        error: 'Failed to record transaction',
        message: txError.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Top-up completed successfully',
      transactionId,
      address: wallet.address,
      amount,
      currency
    });

  } catch (error) {
    console.error('Crypto top-up error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to complete the top-up. Please try again.'
    });
  }
} 