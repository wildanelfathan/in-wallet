// Transaction types
export type TransactionType = 'payment' | 'deposit' | 'withdrawal' | 'transfer' | 'bill_payment';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

export interface TransactionParty {
  id?: string;
  name?: string;
  accountNumber?: string;
  type?: 'user' | 'merchant' | 'external';
}

export interface TransactionMetadata {
  fee?: number;
  exchangeRate?: number;
  notes?: string;
  qr_code_id?: string;
  bill_payment_id?: string;
  account_number?: string;
  provider_name?: string;
  category?: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  wallet_id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  date: string;
  description: string;
  reference?: string;
  recipient?: TransactionParty;
  sender?: TransactionParty;
  metadata?: TransactionMetadata;
  created_at?: string;
  updated_at?: string;
  category?: string;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface AmountRange {
  min: number;
  max: number;
}

export interface TransactionFilter {
  dateRange?: DateRange;
  types?: TransactionType[];
  statuses?: TransactionStatus[];
  amountRange?: AmountRange;
  search?: string;
  categories?: string[];
}

// Wallet types
export type WalletType = 'fiat' | 'crypto';

export interface Wallet {
  id: string;
  user_id: string;
  type: WalletType;
  balance: number;
  currency: string;
  address?: string; // For crypto wallets
  created_at: string;
  updated_at: string;
}

// User types
export interface User {
  id: string;
  email: string;
  full_name?: string;
  phone_number?: string;
  avatar_url?: string;
  is_merchant: boolean;
  is_kyc_verified?: boolean;
  is_admin?: boolean;
  created_at: string;
  updated_at: string;
}

// QR Code types
export interface QRCode {
  id: string;
  merchant_id: string;
  amount: number;
  description?: string;
  status: 'active' | 'used' | 'expired';
  expires_at: string;
  created_at: string;
}

// Bill Payment types
export interface BillCategory {
  id: string;
  name: string;
  icon: string;
}

export interface BillProvider {
  id: string;
  category_id: string;
  name: string;
  logo: string;
  country: string;
}

export interface BillPayment {
  id: string;
  user_id: string;
  provider_id: string;
  account_number: string;
  amount: number;
  status: TransactionStatus;
  created_at: string;
}

// Auth types
export interface AuthResponse {
  user: User;
  session: any;
}

// API Error type
export interface APIError {
  status: number;
  message: string;
  code?: string;
}

// Analytics event types
export interface AnalyticsEvent {
  name: string;
  params?: Record<string, any>;
  timestamp: number;
}

// Error types
export interface APIErrorOptions {
  status: number;
  code?: string;
  isRetryable?: boolean;
}

export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
}

// Firebase Analytics types
declare module '@react-native-firebase/analytics' {
  export interface FirebaseAnalyticsTypes {
    logEvent: (name: string, params?: Record<string, any>) => Promise<void>;
    setUserId: (id: string | null) => Promise<void>;
    setUserProperties: (properties: Record<string, string | null>) => Promise<void>;
    setAnalyticsCollectionEnabled: (enabled: boolean) => Promise<void>;
  }
  
  export default function analytics(): FirebaseAnalyticsTypes;
} 