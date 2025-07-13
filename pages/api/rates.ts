import type { NextApiRequest, NextApiResponse } from 'next';

const COINGECKO_API = 'https://api.coingecko.com/api/v3/simple/price';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Parse query params
  const { base = 'usd', symbols = 'btc,eth,eur,idr' } = req.query;
  const symbolList = typeof symbols === 'string' ? symbols.split(',') : ['btc', 'eth', 'eur', 'idr'];

  try {
    // Build CoinGecko API URL
    const url = `${COINGECKO_API}?ids=${symbolList.join(',')}&vs_currencies=${base}`;
    const cgRes = await fetch(url);
    if (!cgRes.ok) {
      throw new Error('Failed to fetch rates from CoinGecko');
    }
    const data = await cgRes.json();
    return res.status(200).json({ rates: data });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch rates' });
  }
}

// TODO: Add support for Xendit or other providers using .env EXCHANGE_API_KEY
// TODO: Add caching for performance and rate limits
// TODO: Add provider selection and more advanced query options 