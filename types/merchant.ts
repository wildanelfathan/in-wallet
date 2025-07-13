export type PaymentType = 'fiat' | 'crypto';

export type MerchantQRData = {
  merchantId: string;
  amount: number;
  currency: string;
  type: PaymentType;
  reference?: string;
  description?: string;
  expiry?: number; // Unix timestamp
};

export type QRCodeResult = {
  success: boolean;
  message?: string;
  error?: string;
  qrCode?: string; // Base64 encoded QR image
  qrData?: string; // QR data string
  paymentId?: string;
}; 