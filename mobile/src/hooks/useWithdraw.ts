import { useState, useCallback, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

export interface DestinationAccount {
  id: string;
  type: 'bank_account' | 'ewallet';
  name: string;
  accountNumber: string;
  routingNumber?: string;
  bankName?: string;
  ewalletType?: 'paypal' | 'venmo' | 'cashapp' | 'zelle';
  isVerified: boolean;
  isActive: boolean;
  currency: string;
  fees?: {
    fixed?: string;
    percentage?: string;
  };
}

export interface WithdrawRequest {
  amount: string;
  destinationAccountId: string;
  currency: string;
  note?: string;
}

export interface WithdrawResponse {
  success: boolean;
  transactionId?: string;
  estimatedArrival?: string;
  fee?: string;
  netAmount?: string;
  error?: string;
}

export interface WalletBalance {
  available: string;
  pending: string;
  total: string;
  currency: string;
  lastUpdated: string;
}

export interface WithdrawLimits {
  dailyLimit: string;
  weeklyLimit: string;
  monthlyLimit: string;
  dailyUsed: string;
  weeklyUsed: string;
  monthlyUsed: string;
  currency: string;
}

interface UseWithdrawReturn {
  // Data
  destinationAccounts: DestinationAccount[];
  walletBalance: WalletBalance | null;
  withdrawLimits: WithdrawLimits | null;
  
  // Loading states
  isLoading: boolean;
  isLoadingAccounts: boolean;
  isLoadingBalance: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  fetchDestinationAccounts: () => Promise<void>;
  fetchWalletBalance: () => Promise<void>;
  fetchWithdrawLimits: () => Promise<void>;
  withdraw: (request: WithdrawRequest) => Promise<WithdrawResponse>;
  addDestinationAccount: (account: Partial<DestinationAccount>) => Promise<boolean>;
  removeDestinationAccount: (accountId: string) => Promise<boolean>;
  verifyDestinationAccount: (accountId: string) => Promise<boolean>;
  
  // Validation
  validateWithdrawal: (amount: string, accountId: string) => {
    isValid: boolean;
    errors: string[];
  };
  
  // Utilities
  getAccountDisplayName: (account: DestinationAccount) => string;
  calculateFees: (amount: string, accountId: string) => {
    fee: string;
    netAmount: string;
  };
}

export const useWithdraw = (): UseWithdrawReturn => {
  const { user, authenticated } = usePrivy();
  
  // State
  const [destinationAccounts, setDestinationAccounts] = useState<DestinationAccount[]>([]);
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
  const [withdrawLimits, setWithdrawLimits] = useState<WithdrawLimits | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get auth headers
  const getAuthHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user?.id}`, // Replace with actual auth token
  }), [user?.id]);

  // Fetch destination accounts
  const fetchDestinationAccounts = useCallback(async () => {
    if (!authenticated) return;

    try {
      setIsLoadingAccounts(true);
      setError(null);

      const response = await fetch('/api/wallet/accounts', {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setDestinationAccounts(data.accounts || []);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch destination accounts');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load destination accounts';
      setError(errorMessage);
      console.error('Error fetching destination accounts:', err);
    } finally {
      setIsLoadingAccounts(false);
    }
  }, [authenticated, getAuthHeaders]);

  // Fetch wallet balance
  const fetchWalletBalance = useCallback(async () => {
    if (!authenticated) return;

    try {
      setIsLoadingBalance(true);

      const response = await fetch('/api/wallet/balance', {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.balance || null);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch wallet balance');
      }
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
      // Don't set error for balance fetch as it's not critical
    } finally {
      setIsLoadingBalance(false);
    }
  }, [authenticated, getAuthHeaders]);

  // Fetch withdraw limits
  const fetchWithdrawLimits = useCallback(async () => {
    if (!authenticated) return;

    try {
      const response = await fetch('/api/wallet/withdraw-limits', {
        method: 'GET',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        const data = await response.json();
        setWithdrawLimits(data.limits || null);
      } else {
        console.log('Failed to fetch withdraw limits');
      }
    } catch (err) {
      console.error('Error fetching withdraw limits:', err);
    }
  }, [authenticated, getAuthHeaders]);

  // Perform withdrawal
  const withdraw = useCallback(async (request: WithdrawRequest): Promise<WithdrawResponse> => {
    if (!authenticated) {
      throw new Error('Authentication required');
    }

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (response.ok) {
        // Refresh balance after successful withdrawal
        await fetchWalletBalance();
        await fetchWithdrawLimits();

        return {
          success: true,
          transactionId: data.transactionId,
          estimatedArrival: data.estimatedArrival,
          fee: data.fee,
          netAmount: data.netAmount,
        };
      } else {
        const errorResponse: WithdrawResponse = {
          success: false,
          error: data.error || 'Withdrawal failed',
        };
        setError(errorResponse.error || '');
        return errorResponse;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, getAuthHeaders, fetchWalletBalance, fetchWithdrawLimits]);

  // Add destination account
  const addDestinationAccount = useCallback(async (account: Partial<DestinationAccount>): Promise<boolean> => {
    if (!authenticated) return false;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch('/api/wallet/accounts', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(account),
      });

      if (response.ok) {
        await fetchDestinationAccounts();
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to add destination account');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add destination account';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, getAuthHeaders, fetchDestinationAccounts]);

  // Remove destination account
  const removeDestinationAccount = useCallback(async (accountId: string): Promise<boolean> => {
    if (!authenticated) return false;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/wallet/accounts/${accountId}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        await fetchDestinationAccounts();
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to remove destination account');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove destination account';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, getAuthHeaders, fetchDestinationAccounts]);

  // Verify destination account
  const verifyDestinationAccount = useCallback(async (accountId: string): Promise<boolean> => {
    if (!authenticated) return false;

    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/wallet/accounts/${accountId}/verify`, {
        method: 'POST',
        headers: getAuthHeaders(),
      });

      if (response.ok) {
        await fetchDestinationAccounts();
        return true;
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to verify destination account');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify destination account';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, getAuthHeaders, fetchDestinationAccounts]);

  // Validate withdrawal
  const validateWithdrawal = useCallback((amount: string, accountId: string) => {
    const errors: string[] = [];

    // Validate amount
    if (!amount.trim()) {
      errors.push('Amount is required');
    } else {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        errors.push('Amount must be a positive number');
      } else {
        // Check against available balance
        if (walletBalance && amountNum > parseFloat(walletBalance.available)) {
          errors.push('Amount exceeds available balance');
        }

        // Check minimum withdrawal amount
        if (amountNum < 1) {
          errors.push('Minimum withdrawal amount is $1.00');
        }

        // Check against withdraw limits
        if (withdrawLimits) {
          const dailyRemaining = parseFloat(withdrawLimits.dailyLimit) - parseFloat(withdrawLimits.dailyUsed);
          if (amountNum > dailyRemaining) {
            errors.push(`Amount exceeds daily limit. Remaining: $${dailyRemaining.toFixed(2)}`);
          }

          const weeklyRemaining = parseFloat(withdrawLimits.weeklyLimit) - parseFloat(withdrawLimits.weeklyUsed);
          if (amountNum > weeklyRemaining) {
            errors.push(`Amount exceeds weekly limit. Remaining: $${weeklyRemaining.toFixed(2)}`);
          }

          const monthlyRemaining = parseFloat(withdrawLimits.monthlyLimit) - parseFloat(withdrawLimits.monthlyUsed);
          if (amountNum > monthlyRemaining) {
            errors.push(`Amount exceeds monthly limit. Remaining: $${monthlyRemaining.toFixed(2)}`);
          }
        }
      }
    }

    // Validate destination account
    if (!accountId) {
      errors.push('Please select a destination account');
    } else {
      const account = destinationAccounts.find(acc => acc.id === accountId);
      if (!account) {
        errors.push('Invalid destination account');
      } else {
        if (!account.isVerified) {
          errors.push('Selected account is not verified');
        }
        if (!account.isActive) {
          errors.push('Selected account is not active');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [walletBalance, withdrawLimits, destinationAccounts]);

  // Get account display name
  const getAccountDisplayName = useCallback((account: DestinationAccount): string => {
    if (account.type === 'bank_account') {
      return `${account.bankName || 'Bank'} ****${account.accountNumber.slice(-4)}`;
    } else {
      return `${account.ewalletType?.toUpperCase() || 'eWallet'} - ${account.name}`;
    }
  }, []);

  // Calculate fees
  const calculateFees = useCallback((amount: string, accountId: string) => {
    const account = destinationAccounts.find(acc => acc.id === accountId);
    let fee = 0;

    if (account?.fees) {
      const amountNum = parseFloat(amount) || 0;
      
      // Add fixed fee
      if (account.fees.fixed) {
        fee += parseFloat(account.fees.fixed);
      }

      // Add percentage fee
      if (account.fees.percentage) {
        fee += amountNum * (parseFloat(account.fees.percentage) / 100);
      }
    } else {
      // Default fee structure
      const amountNum = parseFloat(amount) || 0;
      if (account?.type === 'bank_account') {
        fee = Math.max(0.25, amountNum * 0.001); // $0.25 or 0.1%, whichever is higher
      } else {
        fee = amountNum * 0.02; // 2% for eWallets
      }
    }

    const netAmount = (parseFloat(amount) || 0) - fee;

    return {
      fee: fee.toFixed(2),
      netAmount: Math.max(0, netAmount).toFixed(2),
    };
  }, [destinationAccounts]);

  // Auto-fetch data when authenticated
  useEffect(() => {
    if (authenticated) {
      fetchDestinationAccounts();
      fetchWalletBalance();
      fetchWithdrawLimits();
    }
  }, [authenticated, fetchDestinationAccounts, fetchWalletBalance, fetchWithdrawLimits]);

  return {
    // Data
    destinationAccounts,
    walletBalance,
    withdrawLimits,
    
    // Loading states
    isLoading,
    isLoadingAccounts,
    isLoadingBalance,
    
    // Error states
    error,
    
    // Actions
    fetchDestinationAccounts,
    fetchWalletBalance,
    fetchWithdrawLimits,
    withdraw,
    addDestinationAccount,
    removeDestinationAccount,
    verifyDestinationAccount,
    
    // Validation
    validateWithdrawal,
    
    // Utilities
    getAccountDisplayName,
    calculateFees,
  };
};