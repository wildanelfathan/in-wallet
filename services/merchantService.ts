import { handleError } from '../utils/apiUtils';
import { merchantAPI } from './apiService';
import { MerchantQRData, QRCodeResult, PaymentType } from '../types/merchant';

interface MerchantQRResponse {
  success: boolean;
  paymentRequest?: {
    id: string;
    paymentCode: string;
    amount: number;
    currency: string;
    description?: string;
    expiresAt: string;
    merchantName: string;
  };
  qrCode?: string;
  message?: string;
  error?: string;
}

interface ProcessPaymentResponse {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Generates a payment QR code for a merchant
 */
export async function generatePaymentQR(data: MerchantQRData): Promise<QRCodeResult> {
  try {
    const { amount, currency, description, expiry } = data;

    // Validate amount
    if (!amount || amount <= 0) {
      return {
        success: false,
        error: 'Invalid amount',
        message: 'Please provide a valid positive amount'
      };
    }

    // Call the API to generate QR code
    const response = await merchantAPI.generateQR(
      amount, 
      currency, 
      description, 
      expiry ? Math.floor((new Date(expiry).getTime() - Date.now()) / 60000) : undefined
    ) as MerchantQRResponse;

    if (!response.success) {
      return {
        success: false,
        error: response.error || 'Failed to generate QR code',
        message: response.message || 'Unable to generate payment QR code'
      };
    }

    return {
      success: true,
      message: 'Payment QR code generated successfully',
      qrCode: response.qrCode,
      qrData: response.paymentRequest?.paymentCode,
      paymentId: response.paymentRequest?.id
    };

  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to generate payment QR code'
    };
  }
}

/**
 * Get merchant sales history
 */
export async function getMerchantSales(filters?: {
  startDate?: string;
  endDate?: string;
  status?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    return await merchantAPI.getSales(filters);
  } catch (error) {
    throw handleError(error);
  }
}

/**
 * Withdraw merchant funds to bank account
 */
export async function withdrawFunds(amount: number, bankAccountId: string, description?: string) {
  try {
    return await merchantAPI.withdraw(amount, bankAccountId, description);
  } catch (error) {
    throw handleError(error);
  }
}

/**
 * Process a payment when customer scans QR code
 * This is a client-side function that should be replaced with a direct API call
 */
export async function processQRPayment(
  qrData: string,
  customerId: string,
  transactionId: string,
  type: PaymentType
): Promise<{ success: boolean; message?: string; error?: string }> {
  try {
    // In a real implementation, this would be handled by the backend
    // The frontend would just scan the QR and send the data to the backend
    return {
      success: true,
      message: 'Payment processed successfully'
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Failed to process payment'
    };
  }
} 