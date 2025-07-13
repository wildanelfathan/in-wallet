import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

interface ReferralPayload {
  user_id: string;
  referral_code: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, referral_code } = req.body as ReferralPayload;

  if (!user_id || !referral_code) {
    return res.status(400).json({ error: 'Missing user_id or referral_code' });
  }

  try {
    // Check if referral code is valid (exists in profiles or referrals table)
    const { data: referrer, error: referrerError } = await supabase
      .from('profiles')
      .select('id')
      .eq('referral_code', referral_code)
      .single();
    if (referrerError || !referrer) {
      return res.status(404).json({ error: 'Invalid referral code' });
    }

    // Prevent self-referral
    if (referrer.id === user_id) {
      return res.status(400).json({ error: 'Cannot refer yourself' });
    }

    // Check if user already referred
    const { data: existing, error: existingError } = await supabase
      .from('referrals')
      .select('id')
      .eq('user_id', user_id)
      .maybeSingle();
    if (existingError) throw existingError;
    if (existing) {
      return res.status(409).json({ error: 'User already referred' });
    }

    // Store referral
    const { data, error } = await supabase
      .from('referrals')
      .insert({
        user_id,
        referral_code,
        referrer_id: referrer.id,
        referred_at: new Date().toISOString(),
        reward_status: 'pending',
      })
      .select()
      .single();
    if (error) throw error;

    // TODO: Add reward logic (e.g., credit bonus, analytics)

    return res.status(200).json({ success: true, referral: data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to process referral' });
  }
}

// TODO: Add advanced reward logic, referral analytics, and admin review 