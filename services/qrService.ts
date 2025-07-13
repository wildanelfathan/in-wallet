import { handleError } from '../utils/apiUtils';
import { qrAPI } from './apiService';

export interface QRScanResult {
  success: boolean;
  type: 'payment' | 'transfer' | 'topup' | 'merchant' | 'unknown';
  data?: {
    merchantId?: string;
    amount?: number;
    currency?: string;
    description?: string;
    reference?: string;
    expiresAt?: string;
    walletAddress?: string;
    userId?: string;
    paymentId?: string;
  };
  error?: string;
  message?: string;
}

/**
 * Scan and process a QR code
 * @param qrData The data from the scanned QR code
 * @returns QR scan result with parsed data
 */
export async function scanQR(qrData: string): Promise<QRScanResult> {
  try {
    const response = await qrAPI.scanQR(qrData) as QRScanResult;
    return response;
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        type: 'unknown',
        error: error.message,
        message: 'Failed to process QR code'
      };
    }
    return {
      success: false,
      type: 'unknown',
      error: 'Unknown error',
      message: 'Failed to process QR code'
    };
  }
}

// Export as a service object for consistency
export const qrService = {
  scanQR
}; 