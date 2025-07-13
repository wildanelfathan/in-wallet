import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { WalletCard } from '../WalletCard';
import { renderWithProviders } from '../../utils/test-utils';

describe('WalletCard', () => {
  const defaultProps = {
    wallet: {
      id: 'wallet-123',
      userId: 'user-123',
      currency: 'USD',
      balance: 1000.00,
      isActive: true,
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    testID: 'wallet-card',
  };

  it('renders correctly with initial props', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <WalletCard {...defaultProps} />
    );

    expect(getByText('wallet.available_balance')).toBeTruthy();
    expect(getByText('$')).toBeTruthy();
    expect(getByText('1000.00')).toBeTruthy();
    expect(getByTestId('wallet-card')).toBeTruthy();
  });

  it('toggles balance visibility when eye icon is pressed', () => {
    const { getByText, queryByText, getByTestId } = renderWithProviders(
      <WalletCard {...defaultProps} />
    );

    // Initially balance is visible
    expect(getByText('1000.00')).toBeTruthy();

    // Press the toggle button
    fireEvent.press(getByTestId('wallet-card-toggle-visibility'));

    // Balance should be hidden
    expect(queryByText('1000.00')).toBeNull();
    expect(getByText('•••••')).toBeTruthy();

    // Press again to show balance
    fireEvent.press(getByTestId('wallet-card-toggle-visibility'));

    // Balance should be visible again
    expect(getByText('1000.00')).toBeTruthy();
  });

  it('renders wallet information correctly', () => {
    const { getByText } = renderWithProviders(
      <WalletCard {...defaultProps} />
    );

    expect(getByText('Total Balance')).toBeTruthy();
    expect(getByText('$1,000.00')).toBeTruthy();
  });
}); 