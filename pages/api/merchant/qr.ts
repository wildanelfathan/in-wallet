import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import QRCode from 'qrcode';

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
  const { amount, currency, description, expiresIn } = req.body;

  if (!amount || !currency) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      message: 'amount and currency are required'
    });
  }

  try {
    // Verify the user is a merchant
    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .select('id, name, business_type')
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

    // Generate a unique payment code
    const paymentCode = `PAY-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    
    // Calculate expiry time (default to 30 minutes if not specified)
    const expiryMinutes = expiresIn || 30;
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + expiryMinutes);

    // Create payment request in database
    const { data: paymentRequest, error: paymentError } = await supabase
      .from('merchant_payment_requests')
      .insert({
        merchant_id: merchant.id,
        amount,
        currency,
        description: description || `Payment to ${merchant.name}`,
        payment_code: paymentCode,
        status: 'pending',
        expires_at: expiresAt.toISOString()
      })
      .select()
      .single();

    if (paymentError) {
      console.error('Error creating payment request:', paymentError);
      return res.status(500).json({ 
        error: 'Failed to create payment request',
        message: paymentError.message
      });
    }

    // Create QR code payload
    const qrPayload = JSON.stringify({
      type: 'merchant_payment',
      paymentCode,
      merchantId: merchant.id,
      merchantName: merchant.name,
      amount,
      currency,
      description: description || `Payment to ${merchant.name}`,
      expiresAt: expiresAt.toISOString()
    });

    // Generate QR code
    const qrCodeDataUrl = await QRCode.toDataURL(qrPayload);

    // Return the payment request and QR code
    return res.status(200).json({
      success: true,
      paymentRequest: {
        id: paymentRequest.id,
        paymentCode,
        amount,
        currency,
        description: paymentRequest.description,
        expiresAt: expiresAt.toISOString(),
        merchantName: merchant.name
      },
      qrCode: qrCodeDataUrl
    });

  } catch (error) {
    console.error('QR code generation error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to generate QR code. Please try again.'
    });
  }
} 