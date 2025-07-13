import { createClient } from '@supabase/supabase-js';
import { storage } from '../utils/storage';
import { handleError } from '../utils/apiUtils';
import { getEnvVar } from '../utils/getEnvVar';
import { Transaction, TransactionFilter, User, Wallet } from '../types';

// Initialize Supabase client
const supabaseUrl = getEnvVar('EXPO_PUBLIC_SUPABASE_URL');
const supabaseKey = getEnvVar('EXPO_PUBLIC_SUPABASE_ANON_KEY');

export const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Authentication services
 */
export const authService = {
  /**
   * Sign in with email and password
   */
  signIn: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Sign up with email and password
   */
  signUp: async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Sign out current user
   */
  signOut: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get current user
   */
  getCurrentUser: async () => {
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      return data.user;
    } catch (error) {
      throw handleError(error);
    }
  }
};

/**
 * Wallet services
 */
export const walletService = {
  /**
   * Get user's fiat wallet
   */
  getFiatWallet: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .eq('type', 'fiat')
        .single();
      
      if (error) throw error;
      return data as Wallet;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get user's crypto wallet
   */
  getCryptoWallet: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', userId)
        .eq('type', 'crypto')
        .single();
      
      if (error) throw error;
      return data as Wallet;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Top up fiat wallet
   */
  topUpFiatWallet: async (userId: string, amount: number) => {
    try {
      // First get the wallet
      const wallet = await walletService.getFiatWallet(userId);
      
      // Update the wallet balance
      const { data, error } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance + amount })
        .eq('id', wallet.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Create transaction record
      await transactionService.createTransaction({
        user_id: userId,
        type: 'deposit',
        amount,
        currency: wallet.currency,
        status: 'completed',
        description: 'Wallet top up',
        wallet_id: wallet.id
      });
      
      return data as Wallet;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Withdraw from fiat wallet
   */
  withdrawFromFiatWallet: async (userId: string, amount: number) => {
    try {
      // First get the wallet
      const wallet = await walletService.getFiatWallet(userId);
      
      // Check if enough balance
      if (wallet.balance < amount) {
        throw new Error('Insufficient funds');
      }
      
      // Update the wallet balance
      const { data, error } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance - amount })
        .eq('id', wallet.id)
        .select()
        .single();
      
      if (error) throw error;
      
      // Create transaction record
      await transactionService.createTransaction({
        user_id: userId,
        type: 'withdrawal',
        amount,
        currency: wallet.currency,
        status: 'completed',
        description: 'Wallet withdrawal',
        wallet_id: wallet.id
      });
      
      return data as Wallet;
    } catch (error) {
      throw handleError(error);
    }
  }
};

/**
 * Transaction services
 */
export const transactionService = {
  /**
   * Create a new transaction
   */
  createTransaction: async (transaction: Partial<Transaction>) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .insert(transaction)
        .select()
        .single();
      
      if (error) throw error;
      return data as Transaction;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Fetch user transactions
   */
  fetchTransactions: async (userId: string, filter?: TransactionFilter) => {
    try {
      let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', userId);
      
      // Apply filters if provided
      if (filter) {
        if (filter.types && filter.types.length > 0) {
          query = query.in('type', filter.types);
        }
        
        if (filter.statuses && filter.statuses.length > 0) {
          query = query.in('status', filter.statuses);
        }
        
        if (filter.dateRange) {
          query = query
            .gte('created_at', filter.dateRange.startDate)
            .lte('created_at', filter.dateRange.endDate);
        }
      }
      
      // Order by date, newest first
      query = query.order('created_at', { ascending: false });
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data as Transaction[];
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get transaction by ID
   */
  getTransactionById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as Transaction;
    } catch (error) {
      throw handleError(error);
    }
  }
};

/**
 * QR Payment services
 */
export const qrPaymentService = {
  /**
   * Generate QR payment code for merchant
   */
  generateMerchantQR: async (merchantId: string, amount: number, description: string) => {
    try {
      const { data, error } = await supabase
        .from('qr_codes')
        .insert({
          merchant_id: merchantId,
          amount,
          description,
          status: 'active',
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours expiry
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Process QR payment
   */
  processQRPayment: async (qrCodeId: string, userId: string) => {
    try {
      // Get QR code details
      const { data: qrCode, error: qrError } = await supabase
        .from('qr_codes')
        .select('*')
        .eq('id', qrCodeId)
        .single();
      
      if (qrError) throw qrError;
      
      // Check if QR code is valid
      if (qrCode.status !== 'active' || new Date(qrCode.expires_at) < new Date()) {
        throw new Error('QR code is expired or invalid');
      }
      
      // Get user wallet
      const wallet = await walletService.getFiatWallet(userId);
      
      // Check if enough balance
      if (wallet.balance < qrCode.amount) {
        throw new Error('Insufficient funds');
      }
      
      // Update wallet balance
      await walletService.withdrawFromFiatWallet(userId, qrCode.amount);
      
      // Create transaction
      const transaction = await transactionService.createTransaction({
        user_id: userId,
        type: 'payment',
        amount: qrCode.amount,
        currency: wallet.currency,
        status: 'completed',
        description: qrCode.description || 'QR Payment',
        wallet_id: wallet.id,
        recipient: {
          id: qrCode.merchant_id,
          type: 'merchant'
        },
        metadata: {
          qr_code_id: qrCodeId
        }
      });
      
      // Update QR code status
      await supabase
        .from('qr_codes')
        .update({ status: 'used' })
        .eq('id', qrCodeId);
      
      return transaction;
    } catch (error) {
      throw handleError(error);
    }
  }
};

/**
 * Bill Payment services
 */
export const billPaymentService = {
  /**
   * Get available bill categories
   */
  getBillCategories: async () => {
    try {
      const { data, error } = await supabase
        .from('bill_categories')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get bill providers by category
   */
  getBillProviders: async (categoryId: string) => {
    try {
      const { data, error } = await supabase
        .from('bill_providers')
        .select('*')
        .eq('category_id', categoryId);
      
      if (error) throw error;
      return data;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Pay bill
   */
  payBill: async (userId: string, providerId: string, accountNumber: string, amount: number) => {
    try {
      // Get user wallet
      const wallet = await walletService.getFiatWallet(userId);
      
      // Check if enough balance
      if (wallet.balance < amount) {
        throw new Error('Insufficient funds');
      }
      
      // Get provider details
      const { data: provider, error: providerError } = await supabase
        .from('bill_providers')
        .select('*')
        .eq('id', providerId)
        .single();
      
      if (providerError) throw providerError;
      
      // Update wallet balance
      await walletService.withdrawFromFiatWallet(userId, amount);
      
      // Create bill payment record
      const { data: billPayment, error: billError } = await supabase
        .from('bill_payments')
        .insert({
          user_id: userId,
          provider_id: providerId,
          account_number: accountNumber,
          amount,
          status: 'completed'
        })
        .select()
        .single();
      
      if (billError) throw billError;
      
      // Create transaction record
      await transactionService.createTransaction({
        user_id: userId,
        type: 'bill_payment',
        amount,
        currency: wallet.currency,
        status: 'completed',
        description: `Bill payment to ${provider.name}`,
        wallet_id: wallet.id,
        metadata: {
          bill_payment_id: billPayment.id,
          account_number: accountNumber,
          provider_name: provider.name
        }
      });
      
      return billPayment;
    } catch (error) {
      throw handleError(error);
    }
  }
};

/**
 * User Profile services
 */
export const userService = {
  /**
   * Get user profile
   */
  getUserProfile: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      return data as User;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Update user profile
   */
  updateUserProfile: async (userId: string, updates: Partial<User>) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) throw error;
      return data as User;
    } catch (error) {
      throw handleError(error);
    }
  }
}; 