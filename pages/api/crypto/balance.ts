import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { ethers } from 'ethers';
import { getEnvVar } from '../../../utils/getEnvVar';

// Standard ERC20 ABI for token transfers
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

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

  try {
    // Query the crypto_wallets table for the user's wallet
    const { data: wallet, error } = await supabase
      .from('crypto_wallets')
      .select('address, network, tokens')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ error: 'Failed to fetch wallet data' });
    }

    if (!wallet) {
      return res.status(404).json({ error: 'Crypto wallet not found' });
    }

    // Get RPC URL from environment variables
    const rpcUrl = getEnvVar('NEXT_PUBLIC_RPC_URL');
    if (!rpcUrl) {
      return res.status(500).json({ error: 'Missing RPC URL configuration' });
    }

    // Create provider
    const provider = new ethers.JsonRpcProvider(rpcUrl);

    // Get native token balance (ETH, MATIC, etc.)
    const nativeBalance = await provider.getBalance(wallet.address);

    // Get token balances if any tokens are configured
    const tokenBalances = [];
    
    if (wallet.tokens && Array.isArray(wallet.tokens)) {
      for (const token of wallet.tokens) {
        try {
          const tokenContract = new ethers.Contract(token.address, ERC20_ABI, provider);
          const balance = await tokenContract.balanceOf(wallet.address);
          const decimals = await tokenContract.decimals();
          const symbol = await tokenContract.symbol();
          
          tokenBalances.push({
            symbol,
            address: token.address,
            balance: balance.toString(),
            decimals: decimals,
            formattedBalance: ethers.formatUnits(balance, decimals)
          });
        } catch (tokenError) {
          console.error(`Error fetching token balance for ${token.address}:`, tokenError);
          // Continue with other tokens even if one fails
        }
      }
    }

    // Return the wallet balances
    return res.status(200).json({
      address: wallet.address,
      network: wallet.network,
      nativeBalance: {
        balance: nativeBalance.toString(),
        formattedBalance: ethers.formatEther(nativeBalance)
      },
      tokens: tokenBalances
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 