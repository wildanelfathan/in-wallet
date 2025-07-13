import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { renderWithProviders } from '../../utils/test-utils';
import { PaymentMethodCard, PaymentMethodType } from '../PaymentMethodCard';

describe('PaymentMethodCard', () => {
  const mockPaymentMethod = {
    type: 'bank' as PaymentMethodType,
    name: 'Test Bank',
    accountNumber: '1234567890',
    isVerified: true,
    isDefault: true,
    testID: 'test-payment-method',
  };

  const mockOnDelete = jest.fn();
  const mockOnSetDefault = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with bank payment method', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <PaymentMethodCard
        {...mockPaymentMethod}
        onDelete={mockOnDelete}
        onSetDefault={mockOnSetDefault}
      />
    );

    expect(getByText('Test Bank')).toBeTruthy();
    expect(getByText('•••••7890')).toBeTruthy();
    expect(getByTestId('test-payment-method-verified')).toBeTruthy();
    expect(getByTestId('test-payment-method-default')).toBeTruthy();
  });

  it('calls onDelete when delete button is pressed', () => {
    const { getByTestId } = renderWithProviders(
      <PaymentMethodCard
        {...mockPaymentMethod}
        onDelete={mockOnDelete}
        onSetDefault={mockOnSetDefault}
      />
    );

    fireEvent.press(getByTestId('test-payment-method-delete'));
    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('calls onSetDefault when set default button is pressed', () => {
    const nonDefaultPaymentMethod = { ...mockPaymentMethod, isDefault: false };
    const { getByTestId } = renderWithProviders(
      <PaymentMethodCard
        {...nonDefaultPaymentMethod}
        onDelete={mockOnDelete}
        onSetDefault={mockOnSetDefault}
      />
    );

    fireEvent.press(getByTestId('test-payment-method-set-default'));
    expect(mockOnSetDefault).toHaveBeenCalled();
  });

  it('masks account number correctly', () => {
    const { getByTestId } = renderWithProviders(
      <PaymentMethodCard
        {...mockPaymentMethod}
        onDelete={mockOnDelete}
        onSetDefault={mockOnSetDefault}
      />
    );

    expect(getByTestId('test-payment-method-number')).toHaveTextContent('•••••7890');
  });

  it('shows different icon based on payment type', () => {
    const cardPaymentMethod = {
      ...mockPaymentMethod,
      type: 'card' as PaymentMethodType,
      name: 'Visa',
    };

    const { getByTestId } = renderWithProviders(
      <PaymentMethodCard
        {...cardPaymentMethod}
        onDelete={mockOnDelete}
        onSetDefault={mockOnSetDefault}
      />
    );

    expect(getByTestId('test-payment-method-icon')).toBeTruthy();
  });

  it('displays balance when provided', () => {
    const paymentMethodWithBalance = {
      ...mockPaymentMethod,
      balance: '1,000.00',
      currency: 'USD',
    };

    const { getByTestId } = renderWithProviders(
      <PaymentMethodCard
        {...paymentMethodWithBalance}
        onDelete={mockOnDelete}
        onSetDefault={mockOnSetDefault}
      />
    );

    expect(getByTestId('test-payment-method-balance')).toHaveTextContent('USD 1,000.00');
  });
}); 