import { handleError } from '../utils/apiUtils';
import { walletAPI } from './apiService';

type TransferResult = {
  success: boolean;
  message?: string;
  transferId?: string;
  error?: string;
};

type TopUpRequest = {
  amount: number;
  currency: string;
  paymentMethod: 'bank_transfer' | 'card' | 'ewallet';
  paymentReference?: string;
};

type TopUpResult = {
  success: boolean;
  message?: string;
  topupId?: string;
  newBalance?: number;
  error?: string;
};

type FiatTransferResponse = {
  success: boolean;
  message?: string;
  transferId?: string;
  error?: string;
};

type FiatTopUpResponse = {
  success: boolean;
  message?: string;
  topupId?: string;
  newBalance?: number;
  error?: string;
};

export async function getFiatBalance(): Promise<{ balance: number; currency: string }> {
  try {
    return await walletAPI.getFiatBalance();
  } catch (error) {
    throw handleError(error);
  }
}

export async function getCryptoBalance() {
  try {
    return await walletAPI.getCryptoBalance();
  } catch (error) {
    throw handleError(error);
  }
}

export async function transferFiat(
  receiverId: string,
  amount: number,
  currency: string,
  description?: string
): Promise<TransferResult> {
  try {
    // Validate inputs
    if (!receiverId || typeof receiverId !== 'string') {
      return { 
        success: false, 
        error: 'Invalid receiver ID',
        message: 'The provided receiver ID is invalid'
      };
    }
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return { 
        success: false, 
        error: 'Amount must be a positive number',
        message: 'Please provide a valid positive amount'
      };
    }

    // Call the API to perform the transfer
    const response = await walletAPI.sendFiat(receiverId, amount, currency, description) as FiatTransferResponse;
    
    return {
      success: response.success,
      message: response.message,
      transferId: response.transferId,
      error: response.error
    };
  } catch (error) {
    console.error('Transfer error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'An unexpected error occurred while processing your transfer'
    };
  }
}

export async function topUpWallet(params: TopUpRequest): Promise<TopUpResult> {
  try {
    const { amount, currency, paymentMethod, paymentReference } = params;

    // Validate required fields
    if (!amount || typeof amount !== 'number' || amount <= 0) {
      return { 
        success: false, 
        error: 'Invalid amount',
        message: 'Please provide a valid positive amount'
      };
    }
    if (!currency || typeof currency !== 'string') {
      return { 
        success: false, 
        error: 'Invalid currency',
        message: 'Please provide a valid currency'
      };
    }
    if (!paymentMethod) {
      return { 
        success: false, 
        error: 'Invalid payment method',
        message: 'Please select a valid payment method'
      };
    }

    // Call the API to perform the top-up
    const response = await walletAPI.topUpFiat(amount, currency, paymentMethod) as FiatTopUpResponse;
    
    return {
      success: response.success,
      message: response.message,
      topupId: response.topupId,
      newBalance: response.newBalance,
      error: response.error
    };
  } catch (error) {
    console.error('Top-up error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'An unexpected error occurred. Please try again later.'
    };
  }
}

export async function sendCrypto(
  fromAddress: string,
  toAddress: string,
  amount: string,
  token: any,
  network: string
) {
  try {
    return await walletAPI.sendCrypto(fromAddress, toAddress, amount, token, network);
  } catch (error) {
    throw handleError(error);
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