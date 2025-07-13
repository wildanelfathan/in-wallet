import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method === 'PUT') {
    try {
      const { 
        name, 
        email, 
        phone_number 
      } = req.body;

      const { data, error } = await supabase
        .from('users')
        .update({ 
          name, 
          email, 
          phone_number 
        })
        .eq('id', req.body.user_id)
        .select();

      if (error) throw error;

      return res.status(200).json(data[0]);
    } catch (err) {
      console.error('Error updating profile:', err);
      return res.status(500).json({ error: 'Failed to update profile' });
    }
  } else {
    res.setHeader('Allow', ['PUT']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 