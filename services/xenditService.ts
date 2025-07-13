// Dummy Xendit Service Implementation
// This is a mock implementation since no API keys are available
import { getEnvVar } from '../utils/getEnvVar';

export interface XenditPaymentRequest {
  external_id: string;
  amount: number;
  description: string;
  payer_email?: string;
  should_send_email?: boolean;
  callback_url?: string;
  redirect_url?: string;
}

export interface XenditPaymentResponse {
  id: string;
  external_id: string;
  user_id: string;
  status: 'PENDING' | 'PAID' | 'EXPIRED' | 'FAILED';
  merchant_name: string;
  amount: number;
  paid_amount: number;
  currency: string;
  payment_channel: string;
  payment_destination: string;
  is_high: boolean;
  description: string;
  paid_at?: string;
  created: string;
  updated: string;
  payment_url: string;
  expires_at: string;
}

export interface XenditBankAccount {
  account_number: string;
  account_holder_name: string;
  bank_code: string;
}

export interface XenditDisbursementRequest {
  external_id: string;
  bank_code: string;
  account_holder_name: string;
  account_number: string;
  description: string;
  amount: number;
}

export interface XenditDisbursementResponse {
  id: string;
  user_id: string;
  external_id: string;
  amount: number;
  bank_code: string;
  account_holder_name: string;
  account_number: string;
  description: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  created: string;
  updated: string;
}

export interface XenditBalanceResponse {
  balance: number;
  currency: string;
}

class XenditService {
  private baseUrl = 'https://api.xendit.co';
  private apiKey = getEnvVar('XENDIT_API_KEY');

  // Create payment invoice
  async createPayment(request: XenditPaymentRequest): Promise<XenditPaymentResponse> {
    // Mock response
    const paymentId = 'inv_' + Date.now();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 hours from now
    
    return {
      id: paymentId,
      external_id: request.external_id,
      user_id: 'dummy_user_id',
      status: 'PENDING',
      merchant_name: 'InWallet',
      amount: request.amount,
      paid_amount: 0,
      currency: 'IDR',
      payment_channel: 'BCA',
      payment_destination: 'BCA',
      is_high: false,
      description: request.description,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      payment_url: `https://checkout.xendit.co/web/${paymentId}`,
      expires_at: expiresAt
    };
  }

  // Get payment status
  async getPaymentStatus(paymentId: string): Promise<XenditPaymentResponse> {
    // Mock response
    return {
      id: paymentId,
      external_id: 'ext_' + Date.now(),
      user_id: 'dummy_user_id',
      status: 'PAID',
      merchant_name: 'InWallet',
      amount: 100000,
      paid_amount: 100000,
      currency: 'IDR',
      payment_channel: 'BCA',
      payment_destination: 'BCA',
      is_high: false,
      description: 'Payment for services',
      paid_at: new Date().toISOString(),
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      payment_url: `https://checkout.xendit.co/web/${paymentId}`,
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    };
  }

  // Create disbursement (bank transfer)
  async createDisbursement(request: XenditDisbursementRequest): Promise<XenditDisbursementResponse> {
    // Mock response
    const disbursementId = 'disb_' + Date.now();
    
    return {
      id: disbursementId,
      user_id: 'dummy_user_id',
      external_id: request.external_id,
      amount: request.amount,
      bank_code: request.bank_code,
      account_holder_name: request.account_holder_name,
      account_number: request.account_number,
      description: request.description,
      status: 'PENDING',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
  }

  // Get disbursement status
  async getDisbursementStatus(disbursementId: string): Promise<XenditDisbursementResponse> {
    // Mock response
    return {
      id: disbursementId,
      user_id: 'dummy_user_id',
      external_id: 'ext_' + Date.now(),
      amount: 100000,
      bank_code: 'BCA',
      account_holder_name: 'John Doe',
      account_number: '1234567890',
      description: 'Transfer to bank account',
      status: 'COMPLETED',
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
  }

  // Get account balance
  async getBalance(): Promise<XenditBalanceResponse> {
    return {
      balance: 5000000, // Mock balance
      currency: 'IDR'
    };
  }

  // Validate bank account
  async validateBankAccount(bankCode: string, accountNumber: string): Promise<XenditBankAccount> {
    return {
      account_number: accountNumber,
      account_holder_name: 'John Doe',
      bank_code: bankCode
    };
  }

  // Get available banks
  async getAvailableBanks(): Promise<Array<{ code: string; name: string }>> {
    return [
      { code: 'BCA', name: 'Bank Central Asia' },
      { code: 'BNI', name: 'Bank Negara Indonesia' },
      { code: 'BRI', name: 'Bank Rakyat Indonesia' },
      { code: 'MANDIRI', name: 'Bank Mandiri' },
      { code: 'CIMB', name: 'CIMB Niaga' }
    ];
  }
}

export const xenditService = new XenditService();
export default xenditService; 