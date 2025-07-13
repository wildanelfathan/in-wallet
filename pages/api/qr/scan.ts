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
  const { qrData } = req.body;

  if (!qrData) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      message: 'qrData is required'
    });
  }

  try {
    // Parse QR data
    let parsedData;
    try {
      // Try to parse as JSON
      parsedData = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
    } catch (parseError) {
      // If not JSON, treat as string
      parsedData = { rawData: qrData };
    }

    // Handle different QR code types
    if (parsedData.type === 'merchant_payment') {
      // Handle merchant payment QR code
      const { paymentCode, merchantId, amount, currency } = parsedData;
      
      if (!paymentCode || !merchantId) {
        return res.status(400).json({
          error: 'Invalid QR code',
          message: 'Missing required payment information'
        });
      }

      // Verify payment request exists and is valid
      const { data: paymentRequest, error: paymentError } = await supabase
        .from('merchant_payment_requests')
        .select(`
          id,
          merchant_id,
          amount,
          currency,
          description,
          status,
          expires_at,
          merchant:merchant_id (
            name,
            business_type
          )
        `)
        .eq('payment_code', paymentCode)
        .eq('merchant_id', merchantId)
        .single();

      if (paymentError || !paymentRequest) {
        return res.status(400).json({
          error: 'Invalid payment request',
          message: 'The payment request was not found or is invalid'
        });
      }

      // Check if payment request has expired
      if (new Date(paymentRequest.expires_at) < new Date()) {
        return res.status(400).json({
          error: 'Expired payment request',
          message: 'This payment request has expired'
        });
      }

      // Check if payment request is already completed or cancelled
      if (paymentRequest.status !== 'pending') {
        return res.status(400).json({
          error: 'Invalid payment request',
          message: `This payment request is already ${paymentRequest.status}`
        });
      }

      return res.status(200).json({
        type: 'merchant_payment',
        paymentRequest: {
          id: paymentRequest.id,
          merchantId: paymentRequest.merchant_id,
          merchantName: paymentRequest.merchant?.[0]?.name,
          amount: paymentRequest.amount,
          currency: paymentRequest.currency,
          description: paymentRequest.description
        }
      });
    } else if (parsedData.type === 'wallet_address') {
      // Handle wallet address QR code
      const { address, network, amount } = parsedData;
      
      if (!address) {
        return res.status(400).json({
          error: 'Invalid QR code',
          message: 'Missing wallet address'
        });
      }

      // Optionally look up wallet owner if it's in our system
      let walletOwner = null;
      try {
        const { data: wallet, error: walletError } = await supabase
          .from('crypto_wallets')
          .select(`
            user_id,
            user:user_id (
              email
            )
          `)
          .eq('address', address)
          .single();

        if (!walletError && wallet) {
          walletOwner = {
            userId: wallet.user_id,
            email: wallet.user?.[0]?.email
          };
        }
      } catch (lookupError) {
        console.error('Error looking up wallet owner:', lookupError);
        // Continue without wallet owner info
      }

      return res.status(200).json({
        type: 'wallet_address',
        address,
        network: network || 'unknown',
        amount: amount || null,
        owner: walletOwner
      });
    } else {
      // Generic QR code
      return res.status(200).json({
        type: 'generic',
        data: parsedData
      });
    }
  } catch (error) {
    console.error('QR scan error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to process QR code. Please try again.'
    });
  }
} 