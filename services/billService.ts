import { BillProvider, BillPaymentRequest, BillPaymentResult } from '../types/bills';
import { handleError } from '../utils/apiUtils';
import { billsAPI } from './apiService';

interface ProvidersResponse {
  providers: BillProvider[];
  groupedProviders?: Record<string, BillProvider[]>;
  categories?: string[];
}

interface BillPaymentResponse {
  success: boolean;
  message?: string;
  error?: string;
  transactionId?: string;
  receiptUrl?: string;
  providerReference?: string;
}

export const billService = {
  /**
   * Get all available bill providers
   */
  async getProviders(category?: string, country?: string, search?: string): Promise<BillProvider[]> {
    try {
      const response = await billsAPI.getProviders(category, country, search) as ProvidersResponse;
      return response.providers;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Get a specific bill provider by ID
   */
  async getProviderById(providerId: string): Promise<BillProvider | null> {
    try {
      const providers = await this.getProviders();
      return providers.find(provider => provider.id === providerId) || null;
    } catch (error) {
      throw handleError(error);
    }
  },

  /**
   * Process a bill payment
   */
  async processPayment(payment: BillPaymentRequest): Promise<BillPaymentResult> {
    try {
      // Get the provider to validate fields
      const provider = await this.getProviderById(payment.providerId);
      if (!provider) {
        throw new Error('Invalid provider');
      }

      // Validate required fields
      for (const field of provider.fields) {
        if (field.required && !payment.customerFields[field.key]) {
          throw new Error(`Missing required field: ${field.label}`);
        }
        if (field.validation) {
          const regex = new RegExp(field.validation);
          if (!regex.test(payment.customerFields[field.key])) {
            throw new Error(`Invalid value for field: ${field.label}`);
          }
        }
      }

      // Call the API to process the payment
      const response = await billsAPI.payBill(
        payment.providerId,
        payment.amount,
        payment.currency,
        payment.accountNumber,
        payment.customerFields,
        payment.walletId
      ) as BillPaymentResponse;

      return {
        success: response.success,
        message: response.message,
        error: response.error,
        transactionId: response.transactionId,
        receiptUrl: response.receiptUrl,
        providerReference: response.providerReference
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          success: false,
          error: error.message
        };
      }
      return {
        success: false,
        error: 'An unknown error occurred'
      };
    }
  },

  /**
   * Get payment history for a user
   */
  async getPaymentHistory(userId: string): Promise<any[]> {
    try {
      // This should be implemented in the transactions API
      const response = await billsAPI.getProviders();
      // Filter the transactions to only include bill payments
      // This is a temporary solution until we have a dedicated endpoint
      return [];
    } catch (error) {
      throw handleError(error);
    }
  }
}; 