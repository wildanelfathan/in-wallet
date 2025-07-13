import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import TransactionCard from '../../components/TransactionCard';
import { render } from '../../utils/test-utils';

describe('TransactionCard', () => {
  const defaultProps = {
    type: 'send' as const,
    status: 'completed' as const,
    amount: '100.00',
    currency: 'USD',
    recipient: 'John Doe',
    date: '2024-03-20',
    testID: 'test-transaction-card',
    onPress: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all props', () => {
    const { getByText } = render(
      <TransactionCard {...defaultProps} />
    );

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('-USD 100.00')).toBeTruthy();
  });

  it('handles onPress callback', () => {
    const { getByTestId } = render(
      <TransactionCard {...defaultProps} />
    );

    fireEvent.press(getByTestId('test-transaction-card'));
    expect(defaultProps.onPress).toHaveBeenCalledTimes(1);
  });

  it('displays correct amount format for send transaction', () => {
    const { getByText } = render(
      <TransactionCard {...defaultProps} type="send" />
    );

    expect(getByText('-USD 100.00')).toBeTruthy();
  });

  it('displays correct amount format for receive transaction', () => {
    const { getByText } = render(
      <TransactionCard {...defaultProps} type="receive" />
    );

    expect(getByText('+USD 100.00')).toBeTruthy();
  });

  it('shows description when provided', () => {
    const { getByText } = render(
      <TransactionCard {...defaultProps} description="Test transaction" />
    );

    expect(getByText('Test transaction')).toBeTruthy();
  });

  it('displays correct status text', () => {
    const { getByText } = render(
      <TransactionCard {...defaultProps} status="pending" />
    );

    expect(getByText('transaction.status.pending')).toBeTruthy();
  });

  it('shows different icons based on transaction type', () => {
    const types = ['send', 'receive', 'qr_payment', 'bill_payment', 'topup'] as const;
    
    types.forEach((type) => {
      const { getByTestId } = render(
        <TransactionCard {...defaultProps} type={type} />
      );

      expect(getByTestId('transaction-card-icon')).toBeTruthy();
    });
  });
}); 