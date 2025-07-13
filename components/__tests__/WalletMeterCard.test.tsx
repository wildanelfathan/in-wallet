import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { WalletMeterCard } from '../WalletMeterCard';
import { renderWithProviders } from '../../utils/test-utils';

describe('WalletMeterCard', () => {
  const defaultProps = {
    score: 85,
    totalSpent: '4,500.00',
    currency: '$',
    period: 'This Month',
    categories: [
      {
        name: 'shopping',
        amount: '2,000.00',
        percentage: 45,
        color: 'blue.500',
      },
      {
        name: 'food',
        amount: '1,500.00',
        percentage: 33,
        color: 'green.500',
      },
      {
        name: 'transport',
        amount: '1,000.00',
        percentage: 22,
        color: 'purple.500',
      },
    ],
    testID: 'wallet-meter',
  };

  it('renders wallet meter card correctly', () => {
    const { getByTestId, getByText } = renderWithProviders(
      <WalletMeterCard {...defaultProps} />
    );

    expect(getByTestId('wallet-meter-score')).toHaveTextContent('85');
    expect(getByTestId('wallet-meter-total-spent')).toHaveTextContent('$ 4,500.00');
    expect(getByText('wallet.spending_breakdown')).toBeTruthy();
  });

  it('shows correct status based on score ranges', () => {
    const scores = [
      { score: 85, expectedStatus: 'wallet.excellent', color: 'success.500' },
      { score: 65, expectedStatus: 'wallet.good', color: 'warning.500' },
      { score: 45, expectedStatus: 'wallet.needs_attention', color: 'error.500' },
    ];

    scores.forEach(({ score, expectedStatus, color }) => {
      const props = {
        ...defaultProps,
        score,
      };

      const { getByTestId } = renderWithProviders(
        <WalletMeterCard {...props} />
      );

      const statusText = getByTestId('wallet-meter-status');
      expect(statusText).toHaveTextContent(expectedStatus);
      expect(statusText.props.style).toContainEqual({
        color,
      });
    });
  });

  it('renders spending categories with correct data', () => {
    const { getByTestId } = renderWithProviders(
      <WalletMeterCard {...defaultProps} />
    );

    defaultProps.categories.forEach((category, index) => {
      expect(getByTestId(`wallet-meter-category-${index}-name`))
        .toHaveTextContent(`wallet.category.${category.name}`);
      expect(getByTestId(`wallet-meter-category-${index}-amount`))
        .toHaveTextContent(`$ ${category.amount}`);
      expect(getByTestId(`wallet-meter-category-${index}-percentage`))
        .toHaveTextContent(`${category.percentage}%`);

      const progressBar = getByTestId(`wallet-meter-category-${index}-progress`);
      expect(progressBar.props.value).toBe(category.percentage);
      expect(progressBar.props._filledTrack.bg).toBe(category.color);
    });
  });

  it('shows period in total spent section', () => {
    const props = {
      ...defaultProps,
      period: 'Last Week',
    };

    const { getByText } = renderWithProviders(
      <WalletMeterCard {...props} />
    );

    expect(getByText('wallet.total_spent', { exact: false })).toBeTruthy();
  });

  it('calls onPress handler when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderWithProviders(
      <WalletMeterCard {...defaultProps} onPress={onPress} />
    );

    fireEvent.press(getByTestId('wallet-meter'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows view details link', () => {
    const { getByText } = renderWithProviders(
      <WalletMeterCard {...defaultProps} />
    );

    expect(getByText('wallet.view_details')).toBeTruthy();
  });

  it('formats currency correctly for different currencies', () => {
    const currencies = [
      { symbol: '€', amount: '3.500,00' },
      { symbol: '¥', amount: '500,000' },
      { symbol: '£', amount: '3,200.00' },
    ];

    currencies.forEach(({ symbol, amount }) => {
      const props = {
        ...defaultProps,
        currency: symbol,
        totalSpent: amount,
      };

      const { getByTestId } = renderWithProviders(
        <WalletMeterCard {...props} />
      );

      expect(getByTestId('wallet-meter-total-spent'))
        .toHaveTextContent(`${symbol} ${amount}`);
    });
  });

  it('translates category names using i18n', () => {
    const { getByTestId } = renderWithProviders(
      <WalletMeterCard {...defaultProps} />
    );

    defaultProps.categories.forEach((category, index) => {
      expect(getByTestId(`wallet-meter-category-${index}-name`))
        .toHaveTextContent(`wallet.category.${category.name}`);
    });
  });
}); 