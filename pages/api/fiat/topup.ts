import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

type TopUpRequest = {
  userId: string;
  amount: number;
  currency: string;
  paymentMethod: 'bank_transfer' | 'card' | 'ewallet';
  paymentReference?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { userId, amount, currency, paymentMethod, paymentReference } = req.body as TopUpRequest;

    // Validate required fields
    if (!userId || typeof userId !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing userId' });
    }
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }
    if (!currency || typeof currency !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing currency' });
    }
    if (!paymentMethod) {
      return res.status(400).json({ error: 'Invalid or missing payment method' });
    }

    // Call Supabase RPC function to handle top-up
    const { data: topup, error: topupError } = await supabase
      .rpc('process_wallet_topup', {
        user_id: userId,
        topup_amount: amount,
        payment_method: paymentMethod,
        payment_reference: paymentReference || null,
        wallet_currency: currency
      });

    if (topupError) {
      console.error('Top-up error:', topupError);
      return res.status(500).json({ error: 'Failed to process top-up' });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Top-up completed successfully',
      topupId: topup?.id,
      newBalance: topup?.new_balance
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 