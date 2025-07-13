import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { TransactionDetail } from '../TransactionDetail';
import { render, createMockTransaction } from '../../utils/test-utils';

describe('TransactionDetail', () => {
  const mockOnShare = jest.fn();
  const mockOnDownload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all transaction details', () => {
    const transaction = createMockTransaction();
    const { getByText } = render(
      <TransactionDetail
        transaction={transaction}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
      />
    );

    expect(getByText(transaction.recipient?.name || 'Unknown')).toBeTruthy();
    expect(getByText(transaction.description!)).toBeTruthy();
    expect(getByText(`$${transaction.amount.toFixed(2)}`)).toBeTruthy();
    expect(getByText(transaction.status)).toBeTruthy();
  });

  it('handles share button press', () => {
    const transaction = createMockTransaction();
    const { getByText } = render(
      <TransactionDetail
        transaction={transaction}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
      />
    );

    fireEvent.press(getByText('Share Receipt'));
    expect(mockOnShare).toHaveBeenCalledTimes(1);
    expect(mockOnShare).toHaveBeenCalledWith(transaction);
  });

  it('handles download button press', () => {
    const transaction = createMockTransaction();
    const { getByText } = render(
      <TransactionDetail
        transaction={transaction}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
      />
    );

    fireEvent.press(getByText('Download Receipt'));
    expect(mockOnDownload).toHaveBeenCalledTimes(1);
    expect(mockOnDownload).toHaveBeenCalledWith(transaction);
  });

  it('displays transaction fee when available', () => {
    const transaction = createMockTransaction({
      metadata: {
        fee: 2.5,
        exchangeRate: 1,
      },
    });
    const { getByText } = render(
      <TransactionDetail
        transaction={transaction}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
      />
    );

    expect(getByText('$2.50')).toBeTruthy();
  });

  it('displays exchange rate when available', () => {
    const transaction = createMockTransaction({
      metadata: {
        fee: 1,
        exchangeRate: 1.2,
      },
    });
    const { getByText } = render(
      <TransactionDetail
        transaction={transaction}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
      />
    );

    expect(getByText('1.2')).toBeTruthy();
  });

  it('displays notes when available', () => {
    const transaction = createMockTransaction({
      metadata: {
        fee: 1,
        exchangeRate: 1,
        notes: 'Test transaction notes',
      },
    });
    const { getByText } = render(
      <TransactionDetail
        transaction={transaction}
        onShare={mockOnShare}
        onDownload={mockOnDownload}
      />
    );

    expect(getByText('Test transaction notes')).toBeTruthy();
  });
}); 