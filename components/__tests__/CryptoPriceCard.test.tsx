import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { CryptoPriceCard } from '../CryptoPriceCard';
import { renderWithProviders } from '../../utils/test-utils';

describe('CryptoPriceCard', () => {
  const defaultProps = {
    symbol: 'BTC',
    name: 'Bitcoin',
    price: '65,000.00',
    currency: '$',
    percentageChange: 2.5,
    testID: 'crypto-price',
  };

  it('renders basic crypto price card correctly', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <CryptoPriceCard {...defaultProps} />
    );

    expect(getByTestId('crypto-price-symbol')).toHaveTextContent('BTC');
    expect(getByTestId('crypto-price-name')).toHaveTextContent('Bitcoin');
    expect(getByTestId('crypto-price-price')).toHaveTextContent('$ 65,000.00');
    expect(getByTestId('crypto-price-change')).toHaveTextContent('+2.50%');
    expect(getByTestId('crypto-price-timeframe')).toHaveTextContent('24h');
  });

  it('shows positive trend with green color', () => {
    const props = {
      ...defaultProps,
      percentageChange: 3.75,
    };

    const { getByTestId } = renderWithProviders(
      <CryptoPriceCard {...props} />
    );

    const changeText = getByTestId('crypto-price-change');
    expect(changeText).toHaveTextContent('+3.75%');
    expect(changeText.props.style).toContainEqual({
      color: 'success.500',
    });

    const trendIcon = getByTestId('crypto-price-trend-icon');
    expect(trendIcon.props.name).toBe('trending-up');
  });

  it('shows negative trend with red color', () => {
    const props = {
      ...defaultProps,
      percentageChange: -2.30,
    };

    const { getByTestId } = renderWithProviders(
      <CryptoPriceCard {...props} />
    );

    const changeText = getByTestId('crypto-price-change');
    expect(changeText).toHaveTextContent('-2.30%');
    expect(changeText.props.style).toContainEqual({
      color: 'error.500',
    });

    const trendIcon = getByTestId('crypto-price-trend-icon');
    expect(trendIcon.props.name).toBe('trending-down');
  });

  it('shows zero change correctly', () => {
    const props = {
      ...defaultProps,
      percentageChange: 0,
    };

    const { getByTestId } = renderWithProviders(
      <CryptoPriceCard {...props} />
    );

    const changeText = getByTestId('crypto-price-change');
    expect(changeText).toHaveTextContent('+0.00%');
    expect(changeText.props.style).toContainEqual({
      color: 'success.500',
    });
  });

  it('shows custom timeframe when provided', () => {
    const props = {
      ...defaultProps,
      timeframe: '1h' as const,
    };

    const { getByTestId } = renderWithProviders(
      <CryptoPriceCard {...props} />
    );

    expect(getByTestId('crypto-price-timeframe')).toHaveTextContent('1h');
  });

  it('calls onPress handler when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderWithProviders(
      <CryptoPriceCard {...defaultProps} onPress={onPress} />
    );

    fireEvent.press(getByTestId('crypto-price'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('formats price with currency symbol', () => {
    const props = {
      ...defaultProps,
      currency: '€',
      price: '55,000.00',
    };

    const { getByTestId } = renderWithProviders(
      <CryptoPriceCard {...props} />
    );

    expect(getByTestId('crypto-price-price')).toHaveTextContent('€ 55,000.00');
  });

  it('shows different cryptocurrencies correctly', () => {
    const currencies = [
      { symbol: 'ETH', name: 'Ethereum', price: '3,500.00' },
      { symbol: 'SOL', name: 'Solana', price: '120.00' },
      { symbol: 'DOT', name: 'Polkadot', price: '25.00' },
    ];

    currencies.forEach(({ symbol, name, price }) => {
      const props = {
        ...defaultProps,
        symbol,
        name,
        price,
      };

      const { getByTestId } = renderWithProviders(
        <CryptoPriceCard {...props} />
      );

      expect(getByTestId('crypto-price-symbol')).toHaveTextContent(symbol);
      expect(getByTestId('crypto-price-name')).toHaveTextContent(name);
      expect(getByTestId('crypto-price-price')).toHaveTextContent(`$ ${price}`);
    });
  });
}); 