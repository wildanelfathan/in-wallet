import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
      return res.status(500).json({ error: 'Failed to fetch transactions' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 