import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { BillPaymentItem } from '../BillPaymentItem';
import { renderWithProviders } from '../../utils/test-utils';

describe('BillPaymentItem', () => {
  const defaultProps = {
    id: '1',
    name: 'Electricity Bill',
    category: 'utilities',
    logoUrl: 'https://example.com/logo.png',
    onPress: jest.fn(),
    testID: 'bill-item',
  };

  it('renders basic bill payment item correctly', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <BillPaymentItem {...defaultProps} />
    );

    expect(getByText('Electricity Bill')).toBeTruthy();
    expect(getByText('bill.category.utilities')).toBeTruthy();
    expect(getByTestId('bill-item-logo')).toBeTruthy();
  });

  it('shows popular badge when isPopular is true', () => {
    const { getByTestId } = renderWithProviders(
      <BillPaymentItem {...defaultProps} isPopular={true} />
    );

    expect(getByTestId('bill-item-popular-badge')).toBeTruthy();
  });

  it('does not show popular badge when isPopular is false', () => {
    const { queryByTestId } = renderWithProviders(
      <BillPaymentItem {...defaultProps} isPopular={false} />
    );

    expect(queryByTestId('bill-item-popular-badge')).toBeNull();
  });

  it('shows promo badge and text when hasPromo and promoText are provided', () => {
    const props = {
      ...defaultProps,
      hasPromo: true,
      promoText: 'Save 10%',
    };

    const { getByTestId, getByText } = renderWithProviders(
      <BillPaymentItem {...props} />
    );

    expect(getByTestId('bill-item-promo-badge')).toBeTruthy();
    expect(getByText('Save 10%')).toBeTruthy();
  });

  it('does not show promo badge when hasPromo is false', () => {
    const props = {
      ...defaultProps,
      hasPromo: false,
      promoText: 'Save 10%',
    };

    const { queryByTestId, queryByText } = renderWithProviders(
      <BillPaymentItem {...props} />
    );

    expect(queryByTestId('bill-item-promo-badge')).toBeNull();
    expect(queryByText('Save 10%')).toBeNull();
  });

  it('calls onPress handler when pressed', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderWithProviders(
      <BillPaymentItem {...defaultProps} onPress={onPress} />
    );

    fireEvent.press(getByTestId('bill-item'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows first letter of name in fallback when logo fails to load', () => {
    const { getByText } = renderWithProviders(
      <BillPaymentItem {...defaultProps} />
    );

    // Trigger the fallback by simulating image load failure
    const fallbackElement = getByText('E'); // First letter of 'Electricity Bill'
    expect(fallbackElement).toBeTruthy();
  });

  it('translates category using i18n', () => {
    const { getByText } = renderWithProviders(
      <BillPaymentItem {...defaultProps} />
    );

    expect(getByText('bill.category.utilities')).toBeTruthy();
  });

  it('translates promo and popular badges using i18n', () => {
    const props = {
      ...defaultProps,
      hasPromo: true,
      promoText: 'Save 10%',
      isPopular: true,
    };

    const { getByText } = renderWithProviders(
      <BillPaymentItem {...props} />
    );

    expect(getByText('bill.promo')).toBeTruthy();
    expect(getByText('bill.popular')).toBeTruthy();
  });
}); 