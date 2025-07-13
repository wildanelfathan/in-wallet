import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../lib/supabase';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get user ID from header
  const userId = req.headers['x-user-id'];
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid x-user-id header' });
  }

  try {
    // Query the wallets table for the user's fiat wallet
    const { data: wallet, error } = await supabase
      .from('wallets')
      .select('balance, currency')
      .eq('user_id', userId)
      .eq('type', 'fiat')
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch wallet data' });
    }

    if (!wallet) {
      return res.status(404).json({ error: 'Wallet not found' });
    }

    // Return the wallet balance and currency
    return res.status(200).json({
      balance: wallet.balance,
      currency: wallet.currency
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 