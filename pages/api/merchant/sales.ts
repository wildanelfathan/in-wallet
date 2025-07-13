import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';

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

  // Parse query parameters
  const {
    startDate,
    endDate,
    status,
    limit = '20',
    offset = '0'
  } = req.query;

  try {
    // Verify the user is a merchant
    const { data: merchant, error: merchantError } = await supabase
      .from('merchants')
      .select('id')
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

    // Build the query for sales data
    let query = supabase
      .from('merchant_transactions')
      .select(`
        *,
        payment_request:payment_request_id (
          description,
          payment_code
        ),
        customer:customer_id (
          name,
          email
        )
      `)
      .eq('merchant_id', merchant.id);

    // Apply filters if provided
    if (status && typeof status === 'string') {
      query = query.eq('status', status);
    }

    if (startDate && typeof startDate === 'string') {
      query = query.gte('created_at', startDate);
    }

    if (endDate && typeof endDate === 'string') {
      query = query.lte('created_at', endDate);
    }

    // Apply pagination
    if (typeof limit === 'string' && typeof offset === 'string') {
      query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
    }

    // Order by created_at descending (newest first)
    query = query.order('created_at', { ascending: false });

    // Execute the query
    const { data: transactions, error: txError, count } = await query;

    if (txError) {
      console.error('Database error:', txError);
      return res.status(500).json({ error: 'Failed to fetch sales data' });
    }

    // Calculate summary statistics
    const summary = transactions?.reduce((acc, tx) => {
      // Only count completed transactions for the summary
      if (tx.status === 'completed') {
        acc.totalSales += tx.amount;
        acc.transactionCount += 1;
      }
      return acc;
    }, { totalSales: 0, transactionCount: 0 });

    // Get today's sales
    const today = new Date().toISOString().split('T')[0];
    const todaySales = transactions?.filter(tx => 
      tx.created_at.startsWith(today) && tx.status === 'completed'
    ).reduce((sum, tx) => sum + tx.amount, 0) || 0;

    return res.status(200).json({
      sales: transactions,
      summary: {
        ...summary,
        todaySales
      },
      pagination: {
        total: count || 0,
        limit: parseInt(limit as string),
        offset: parseInt(offset as string)
      }
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 