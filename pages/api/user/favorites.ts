import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

// Favorite type
interface Favorite {
  id?: string;
  user_id: string;
  address: string;
  label?: string;
  created_at?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { user_id } = req.query;

  if (!user_id || typeof user_id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid user_id' });
  }

  if (req.method === 'GET') {
    // Get all favorites for user
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .select('*')
        .eq('user_id', user_id)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return res.status(200).json({ favorites: data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to fetch favorites' });
    }
  }

  if (req.method === 'POST') {
    // Add a new favorite
    const { address, label } = req.body as Favorite;
    if (!address) {
      return res.status(400).json({ error: 'Missing address' });
    }
    try {
      const { data, error } = await supabase
        .from('user_favorites')
        .insert({ user_id, address, label, created_at: new Date().toISOString() })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json({ favorite: data });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to add favorite' });
    }
  }

  if (req.method === 'DELETE') {
    // Remove a favorite by id
    const { id } = req.body as { id: string };
    if (!id) {
      return res.status(400).json({ error: 'Missing favorite id' });
    }
    try {
      const { error } = await supabase
        .from('user_favorites')
        .delete()
        .eq('id', id)
        .eq('user_id', user_id);
      if (error) throw error;
      return res.status(200).json({ success: true });
    } catch (err: any) {
      return res.status(500).json({ error: err.message || 'Failed to remove favorite' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

// TODO: Add support for favorite types (e.g., contacts, merchants), notes, and search 