import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../../lib/supabase';

type TransferRequest = {
  senderId: string;
  receiverId: string;
  amount: number;
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
    const { senderId, receiverId, amount } = req.body as TransferRequest;

    // Validate required fields
    if (!senderId || typeof senderId !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing senderId' });
    }
    if (!receiverId || typeof receiverId !== 'string') {
      return res.status(400).json({ error: 'Invalid or missing receiverId' });
    }
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ error: 'Amount must be a positive number' });
    }

    // Check if sender and receiver are different
    if (senderId === receiverId) {
      return res.status(400).json({ error: 'Cannot transfer to self' });
    }

    // Check sender's balance
    const { data: senderWallet, error: balanceError } = await supabase
      .from('wallets')
      .select('balance')
      .eq('user_id', senderId)
      .eq('type', 'fiat')
      .single();

    if (balanceError) {
      console.error('Error fetching sender balance:', balanceError);
      return res.status(500).json({ error: 'Failed to fetch sender balance' });
    }

    if (!senderWallet) {
      return res.status(404).json({ error: 'Sender wallet not found' });
    }

    if (senderWallet.balance < amount) {
      return res.status(400).json({ error: 'Insufficient balance' });
    }

    // Execute transfer using Supabase RPC function
    const { data: transfer, error: transferError } = await supabase
      .rpc('transfer_fiat', {
        sender_id: senderId,
        receiver_id: receiverId,
        transfer_amount: amount
      });

    if (transferError) {
      console.error('Transfer error:', transferError);
      return res.status(500).json({ error: 'Transfer failed' });
    }

    // Return success response
    return res.status(200).json({
      success: true,
      message: 'Transfer completed successfully',
      transferId: transfer?.id // If the RPC returns a transfer ID
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 