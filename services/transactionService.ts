import { Transaction, TransactionFilter } from '../types';
import { handleError } from '../utils/apiUtils';
import { transactionsAPI } from './apiService';

/**
 * Fetch transactions based on filter criteria
 * @param filter Filter criteria
 * @returns Array of transactions
 */
export const fetchTransactions = async (filter: TransactionFilter): Promise<Transaction[]> => {
  try {
    // Convert filter to query params format
    const queryParams: Record<string, string> = {};
    
    if (filter.dateRange) {
      queryParams.startDate = filter.dateRange.startDate;
      queryParams.endDate = filter.dateRange.endDate;
    }
    
    if (filter.types && filter.types.length > 0) {
      queryParams.type = filter.types.join(',');
    }
    
    if (filter.statuses && filter.statuses.length > 0) {
      queryParams.status = filter.statuses.join(',');
    }
    
    if (filter.amountRange) {
      queryParams.minAmount = filter.amountRange.min.toString();
      queryParams.maxAmount = filter.amountRange.max.toString();
    }
    
    if (filter.search) {
      queryParams.search = filter.search;
    }
    
    if (filter.categories && filter.categories.length > 0) {
      queryParams.categories = filter.categories.join(',');
    }
    
    // Call the real API
    const response = await transactionsAPI.getTransactions(queryParams);
    
    // Process transactions to ensure they have categories
    const transactions = response.transactions.map(tx => {
      // If transaction doesn't have a category but has metadata with category
      if (!tx.category && tx.metadata?.category) {
        return {
          ...tx,
          category: tx.metadata.category
        };
      }
      return tx;
    });
    
    return transactions;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Get transaction by ID
 * @param id Transaction ID
 * @returns Transaction or null if not found
 */
export const getTransactionById = async (id: string): Promise<Transaction | null> => {
  try {
    const transaction = await transactionsAPI.getTransactionById(id);
    
    // Ensure category is set from metadata if needed
    if (!transaction.category && transaction.metadata?.category) {
      return {
        ...transaction,
        category: transaction.metadata.category
      };
    }
    
    return transaction;
  } catch (error) {
    if (error instanceof Error && error.message.includes('404')) {
      return null;
    }
    throw handleError(error);
  }
};

/**
 * Export transaction service
 */
export const transactionService = {
  fetchTransactions,
  getTransactionById
}; 