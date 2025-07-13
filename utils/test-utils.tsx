import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react-native';
import { NativeBaseProvider } from 'native-base';
import { Transaction, TransactionFilter, TransactionType, TransactionStatus } from '../types';

const inset = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
};

// Add providers here
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
  return (
    <NativeBaseProvider>
      {children}
    </NativeBaseProvider>
  );
};

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react-native';

// override render method
export { customRender as render, customRender as renderWithProviders };

// Helper functions for creating mock data
export const createMockTransaction = (overrides: Partial<Transaction> = {}): Transaction => ({
  id: 'transaction-123',
  user_id: 'user-123',
  wallet_id: 'wallet-123',
  type: 'payment',
  status: 'completed',
  amount: 100,
  currency: 'USD',
  date: '2023-05-15T10:30:00Z',
  recipient: {
    name: 'John Doe',
    accountNumber: '1234567890'
  },
  sender: {
    name: 'Jane Smith',
    accountNumber: '0987654321'
  },
  description: 'Payment for services',
  category: 'Services',
  reference: 'REF123456',
  metadata: {
    fee: 2.5,
    exchangeRate: 1,
    notes: 'Regular payment'
  },
  ...overrides
});

export const createMockTransactionFilter = (overrides: Partial<TransactionFilter> = {}): TransactionFilter => ({
  dateRange: {
    startDate: '2023-01-01T00:00:00Z',
    endDate: '2023-12-31T23:59:59Z'
  },
  types: ['payment', 'deposit'],
  statuses: ['completed'],
  amountRange: {
    min: 0,
    max: 1000
  },
  search: '',
  ...overrides
}); 