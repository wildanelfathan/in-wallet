import { handleError } from '../utils/apiUtils';
import { walletAPI } from './apiService';
import { CryptoNetwork, CryptoToken, CryptoTransferParams, CryptoTransferResult } from '../types/crypto';

export async function getCryptoBalance(userId: string) {
  try {
    return await walletAPI.getCryptoBalance();
  } catch (error) {
    throw handleError(error);
  }
}

export async function sendCrypto(params: CryptoTransferParams): Promise<CryptoTransferResult> {
  try {
    const { fromAddress, toAddress, amount, token, network } = params;

    // Validate addresses
    if (!fromAddress || !toAddress) {
      return {
        success: false,
        error: 'Invalid address',
        message: 'Please provide valid blockchain addresses'
      };
    }

    // Call the API to perform the transfer
    const response = await walletAPI.sendCrypto(
      fromAddress, 
      toAddress, 
      amount.toString(), 
      token, 
      network
    ) as CryptoTransferResult;

    return {
      success: response.success,
      message: response.message,
      transactionHash: response.transactionHash,
      blockNumber: response.blockNumber,
      gasUsed: response.gasUsed,
      error: response.error
    };

  } catch (error) {
    console.error('Crypto transfer error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to complete the transfer. Please try again.'
    };
  }
}

export async function topUpCrypto(
  amount: number,
  currency: string,
  paymentMethod: string
) {
  try {
    return await walletAPI.topUpCrypto(amount, currency, paymentMethod);
  } catch (error) {
    throw handleError(error);
  }
} 