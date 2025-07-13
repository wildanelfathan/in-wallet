import { createAPIRequest } from '../utils/apiUtils';
import { supabase } from '../lib/supabase';

// Base URL for API calls
const API_BASE_URL = 'https://api.inwallet.app';

// Get the current user ID from Supabase auth
const getUserId = async (): Promise<string> => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session?.user) {
    throw new Error('User not authenticated');
  }
  return session.user.id;
};

/**
 * Generic API call function with authentication headers
 */
export const apiCall = async <T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  body?: any,
  customHeaders: Record<string, string> = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Get the current user ID for authentication
  const userId = await getUserId();
  
  const headers = {
    'Content-Type': 'application/json',
    'x-user-id': userId,
    ...customHeaders
  };

  const options: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  };

  const response = await createAPIRequest(url, options);
  
  if (method === 'DELETE' && response.status === 204) {
    return {} as T;
  }
  
  return await response.json() as T;
};

// API endpoints for wallet
export const walletAPI = {
  getFiatBalance: () => 
    apiCall<{ balance: number; currency: string }>('/api/wallet/fiat/balance'),
  
  sendFiat: (toUserId: string, amount: number, currency: string, description?: string) =>
    apiCall('/api/wallet/fiat/send', 'POST', { toUserId, amount, currency, description }),
  
  topUpFiat: (amount: number, currency: string, paymentMethod: string) =>
    apiCall('/api/fiat/topup', 'POST', { amount, currency, paymentMethod }),
  
  getCryptoBalance: () =>
    apiCall('/api/crypto/balance'),
  
  sendCrypto: (fromAddress: string, toAddress: string, amount: string, token: any, network: string) =>
    apiCall('/api/crypto/send', 'POST', { fromAddress, toAddress, amount, token, network }),
  
  topUpCrypto: (amount: number, currency: string, paymentMethod: string) =>
    apiCall('/api/crypto/topup', 'POST', { amount, currency, paymentMethod })
};

// API endpoints for transactions
export const transactionsAPI = {
  getTransactions: (filters?: any) => {
    const queryParams = filters ? new URLSearchParams(filters).toString() : '';
    return apiCall<{ transactions: any[] }>(`/api/transactions${queryParams ? '?' + queryParams : ''}`);
  },
  
  getTransactionById: (id: string) =>
    apiCall<any>(`/api/transactions/${id}`)
};

// API endpoints for merchant
export const merchantAPI = {
  generateQR: (amount: number, currency: string, description?: string, expiresIn?: number) =>
    apiCall('/api/merchant/qr', 'POST', { amount, currency, description, expiresIn }),
  
  getSales: (filters?: any) => {
    const queryParams = filters ? new URLSearchParams(filters).toString() : '';
    return apiCall(`/api/merchant/sales${queryParams ? '?' + queryParams : ''}`);
  },
  
  withdraw: (amount: number, bankAccountId: string, description?: string) =>
    apiCall('/api/merchant/withdraw', 'POST', { amount, bankAccountId, description })
};

// API endpoints for bills
export const billsAPI = {
  getProviders: (category?: string, country?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (country) params.append('country', country);
    if (search) params.append('search', search);
    
    const queryString = params.toString();
    return apiCall(`/api/bills/providers${queryString ? '?' + queryString : ''}`);
  },
  
  payBill: (providerId: string, amount: number, currency: string, accountNumber: string, customerFields: Record<string, string>, walletId: string) =>
    apiCall('/api/bills/pay', 'POST', { providerId, amount, currency, accountNumber, customerFields, walletId })
};

// API endpoints for user
export const userAPI = {
  getProfile: () =>
    apiCall('/api/user/profile')
};

// API endpoints for QR
export const qrAPI = {
  scanQR: (qrData: string) =>
    apiCall('/api/qr/scan', 'POST', { qrData })
}; 