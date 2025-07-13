import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../test-utils';
import TransactionCard from '../TransactionCard';

describe('TransactionCard', () => {
  const mockOnPress = jest.fn();

  const defaultProps = {
    type: 'send' as const,
    status: 'completed' as const,
    amount: '100.00',
    currency: 'USD',
    recipient: 'John Doe',
    date: '2024-03-20',
    testID: 'test-transaction-card',
    onPress: mockOnPress
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <TransactionCard {...defaultProps} />
    );

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('-USD 100.00')).toBeTruthy();
    expect(getByText('transaction.type.send')).toBeTruthy();
    expect(getByText('transaction.status.completed')).toBeTruthy();
    expect(getByTestId('test-transaction-card-icon')).toBeTruthy();
  });

  it('handles press events', () => {
    const { getByTestId } = renderWithProviders(
      <TransactionCard {...defaultProps} />
    );

    fireEvent.press(getByTestId('test-transaction-card'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('displays receive transaction with positive amount', () => {
    const receiveProps = {
      ...defaultProps,
      type: 'receive' as const,
      testID: 'receive-transaction'
    };

    const { getByText } = renderWithProviders(
      <TransactionCard {...receiveProps} />
    );

    expect(getByText('+USD 100.00')).toBeTruthy();
  });

  it('shows description when provided', () => {
    const propsWithDescription = {
      ...defaultProps,
      description: 'Test transaction'
    };

    const { getByText } = renderWithProviders(
      <TransactionCard {...propsWithDescription} />
    );

    expect(getByText('Test transaction')).toBeTruthy();
  });

  it('displays different status colors', () => {
    const pendingProps = {
      ...defaultProps,
      status: 'pending' as const
    };

    const { getByText } = renderWithProviders(
      <TransactionCard {...pendingProps} />
    );

    expect(getByText('transaction.status.pending')).toBeTruthy();
  });

  it('shows different icons based on transaction type', () => {
    const types = ['send', 'receive', 'qr_payment', 'bill_payment', 'topup'] as const;
    const expectedIcons = [
      'arrow-up-circle-outline',
      'arrow-down-circle-outline',
      'qr-code-outline',
      'receipt-outline',
      'add-circle-outline',
    ];

    types.forEach((type, index) => {
      const { getByTestId } = renderWithProviders(
        <TransactionCard {...defaultProps} type={type} />
      );

      const icon = getByTestId('transaction-card-icon');
      expect(icon.props.name).toBe(expectedIcons[index]);
    });
  });

  it('shows different colors based on status', () => {
    const statuses = ['completed', 'pending', 'failed'] as const;
    const expectedColors = ['success.500', 'warning.500', 'error.500'];

    statuses.forEach((status, index) => {
      const { getByTestId } = renderWithProviders(
        <TransactionCard {...defaultProps} status={status} />
      );

      const statusText = getByTestId('transaction-card-status');
      expect(statusText.props.style).toContainEqual({
        color: expectedColors[index],
      });
    });
  });

  it('renders optional description when provided', () => {
    const props = {
      ...defaultProps,
      description: 'Payment for services',
    };

    const { getByText } = renderWithProviders(
      <TransactionCard {...props} />
    );

    expect(getByText('Payment for services')).toBeTruthy();
  });

  it('does not render description when not provided', () => {
    const { queryByText } = renderWithProviders(
      <TransactionCard {...defaultProps} />
    );

    expect(queryByText('Payment for services')).toBeNull();
  });

  it('shows correct prefix for different transaction types', () => {
    const cases = [
      { type: 'send' as const, expectedPrefix: '-' },
      { type: 'receive' as const, expectedPrefix: '+' },
      { type: 'qr_payment' as const, expectedPrefix: '-' },
      { type: 'bill_payment' as const, expectedPrefix: '-' },
      { type: 'topup' as const, expectedPrefix: '+' },
    ];

    cases.forEach(({ type, expectedPrefix }) => {
      const { getByTestId } = renderWithProviders(
        <TransactionCard {...defaultProps} type={type} />
      );

      const amountText = getByTestId('transaction-card-amount');
      expect(amountText).toHaveTextContent(`${expectedPrefix}$ 100.00`);
    });
  });
}); 