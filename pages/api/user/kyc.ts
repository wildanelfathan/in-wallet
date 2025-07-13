import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

// KYC data type
interface KYCSubmission {
  user_id: string;
  full_name: string;
  id_number: string;
  photo_url: string; // Assume photo is already uploaded and URL is provided
  submitted_at?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { user_id, full_name, id_number, photo_url } = req.body as KYCSubmission;

  // Basic validation
  if (!user_id || !full_name || !id_number || !photo_url) {
    return res.status(400).json({ error: 'Missing required KYC fields' });
  }

  try {
    // Store KYC submission
    const { data, error } = await supabase
      .from('kyc_submissions')
      .insert({
        user_id,
        full_name,
        id_number,
        photo_url,
        submitted_at: new Date().toISOString(),
        status: 'pending',
      });
    if (error) throw error;

    // Update user profile with KYC status
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ kyc_status: 'pending' })
      .eq('id', user_id);
    if (profileError) throw profileError;

    return res.status(200).json({ success: true, message: 'KYC submitted' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to submit KYC' });
  }
}

// TODO: Add file upload endpoint for photo if not implemented yet 