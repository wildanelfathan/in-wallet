export type BillCategory = 
  | 'utility' 
  | 'mobile' 
  | 'internet' 
  | 'streaming' 
  | 'insurance' 
  | 'credit_card' 
  | 'loan' 
  | 'other';

export type BillProvider = {
  id: string;
  name: string;
  category: BillCategory;
  country: string;
  logo_url?: string;
  fields: BillField[];
};

export type BillField = {
  key: string;
  label: string;
  type: 'text' | 'number' | 'date';
  required: boolean;
  validation?: string; // Regex pattern
  placeholder?: string;
};

export type BillPaymentRequest = {
  userId: string;
  providerId: string;
  amount: number;
  currency: string;
  accountNumber: string;
  customerFields: Record<string, string>;
  walletId: string;
};

export type BillPaymentResult = {
  success: boolean;
  message?: string;
  error?: string;
  transactionId?: string;
  receiptUrl?: string;
  providerReference?: string;
}; 