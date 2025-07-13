import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../../lib/supabase';
import { ethers } from 'ethers';
import { getEnvVar } from '../../../utils/getEnvVar';
import { CryptoToken } from '../../../types/crypto';

// Standard ERC20 ABI for token transfers
const ERC20_ABI = [
  'function transfer(address to, uint256 amount) returns (bool)',
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)'
];

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
  const { fromAddress, toAddress, amount, token, network } = req.body;

  if (!fromAddress || !toAddress || !amount || !network) {
    return res.status(400).json({ 
      error: 'Missing required fields',
      message: 'fromAddress, toAddress, amount, and network are required'
    });
  }

  // Validate addresses
  if (!ethers.isAddress(fromAddress) || !ethers.isAddress(toAddress)) {
    return res.status(400).json({ 
      error: 'Invalid address',
      message: 'Please provide valid blockchain addresses'
    });
  }

  try {
    // Get RPC URL from environment variables
    const rpcUrl = getEnvVar('NEXT_PUBLIC_RPC_URL');
    if (!rpcUrl) {
      return res.status(500).json({ error: 'Missing RPC URL configuration' });
    }

    // Get the wallet from Supabase to verify ownership
    const { data: wallet, error: walletError } = await supabase
      .from('crypto_wallets')
      .select('private_key')
      .eq('user_id', userId)
      .eq('address', fromAddress)
      .single();

    if (walletError || !wallet) {
      return res.status(403).json({ 
        error: 'Wallet not found',
        message: 'You do not have permission to use this wallet'
      });
    }

    // Create provider and signer
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const signer = new ethers.Wallet(wallet.private_key, provider);

    let tx;
    if (token && token.address) {
      // ERC20 token transfer
      const tokenContract = new ethers.Contract(token.address, ERC20_ABI, signer);
      tx = await tokenContract.transfer(toAddress, amount);
    } else {
      // Native token transfer (ETH, MATIC, BNB)
      tx = await signer.sendTransaction({
        to: toAddress,
        value: amount
      });
    }

    // Wait for transaction confirmation
    const receipt = await tx.wait();

    // Record transaction in Supabase
    const { error: txError } = await supabase
      .from('crypto_transactions')
      .insert({
        user_id: userId,
        from_address: fromAddress,
        to_address: toAddress,
        amount: amount,
        token_symbol: token ? token.symbol : network,
        network: network,
        transaction_hash: receipt.hash,
        block_number: receipt.blockNumber,
        gas_used: receipt.gasUsed.toString(),
        status: 'completed',
        metadata: token ? {
          token_address: token.address,
          token_decimals: token.decimals
        } : {}
      });

    if (txError) {
      console.error('Error recording transaction:', txError);
      // Transaction was successful on chain but failed to record in DB
      return res.status(207).json({
        success: true,
        message: 'Transfer completed but failed to record in database',
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        gasUsed: receipt.gasUsed.toString()
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Transfer completed successfully',
      transactionHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString()
    });

  } catch (error) {
    console.error('Crypto transfer error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to complete the transfer. Please try again.'
    });
  }
} 