import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import { PromoBanner } from '../PromoBanner';
import { renderWithProviders } from '../../utils/test-utils';

jest.useFakeTimers();

describe('PromoBanner', () => {
  const mockItems = [
    {
      id: '1',
      title: 'promo.first_title',
      description: 'promo.first_description',
      imageUrl: 'https://example.com/promo1.jpg',
      onPress: jest.fn(),
    },
    {
      id: '2',
      title: 'promo.second_title',
      description: 'promo.second_description',
      imageUrl: 'https://example.com/promo2.jpg',
      onPress: jest.fn(),
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with multiple items', () => {
    const { getByText, getByTestId, getAllByTestId } = renderWithProviders(
      <PromoBanner items={mockItems} testID="promo-banner" />
    );

    // Check if all items are rendered
    expect(getByText('promo.first_title')).toBeTruthy();
    expect(getByText('promo.first_description')).toBeTruthy();
    expect(getByText('promo.second_title')).toBeTruthy();
    expect(getByText('promo.second_description')).toBeTruthy();

    // Check if pagination dots are rendered
    const dots = getAllByTestId(/promo-banner-dot-/);
    expect(dots).toHaveLength(2);

    // First dot should be filled, second should be outline
    expect(dots[0].props.name).toBe('ellipse');
    expect(dots[1].props.name).toBe('ellipse-outline');
  });

  it('renders without pagination for single item', () => {
    const { queryByTestId } = renderWithProviders(
      <PromoBanner
        items={[mockItems[0]]}
        testID="promo-banner"
      />
    );

    expect(queryByTestId('promo-banner-pagination')).toBeNull();
  });

  it('calls onPress handler when item is pressed', () => {
    const { getByTestId } = renderWithProviders(
      <PromoBanner items={mockItems} testID="promo-banner" />
    );

    fireEvent.press(getByTestId('promo-banner-item-1'));
    expect(mockItems[0].onPress).toHaveBeenCalledTimes(1);
  });

  it('auto-plays when enabled', () => {
    const { getAllByTestId } = renderWithProviders(
      <PromoBanner
        items={mockItems}
        autoPlay={true}
        autoPlayInterval={1000}
        testID="promo-banner"
      />
    );

    const dots = getAllByTestId(/promo-banner-dot-/);
    
    // Initially first dot is active
    expect(dots[0].props.name).toBe('ellipse');
    expect(dots[1].props.name).toBe('ellipse-outline');

    // After interval, second dot should be active
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(dots[0].props.name).toBe('ellipse-outline');
    expect(dots[1].props.name).toBe('ellipse');
  });

  it('does not auto-play when disabled', () => {
    const { getAllByTestId } = renderWithProviders(
      <PromoBanner
        items={mockItems}
        autoPlay={false}
        autoPlayInterval={1000}
        testID="promo-banner"
      />
    );

    const dots = getAllByTestId(/promo-banner-dot-/);

    // Initially first dot is active
    expect(dots[0].props.name).toBe('ellipse');
    expect(dots[1].props.name).toBe('ellipse-outline');

    // After interval, first dot should still be active
    act(() => {
      jest.advanceTimersByTime(1000);
    });

    expect(dots[0].props.name).toBe('ellipse');
    expect(dots[1].props.name).toBe('ellipse-outline');
  });

  it('updates active index on scroll', () => {
    const { getByTestId, getAllByTestId } = renderWithProviders(
      <PromoBanner items={mockItems} testID="promo-banner" />
    );

    const scrollView = getByTestId('promo-banner-scroll-view');
    const dots = getAllByTestId(/promo-banner-dot-/);

    // Simulate scroll to second item
    fireEvent.scroll(scrollView, {
      nativeEvent: {
        contentOffset: { x: 343 }, // BANNER_WIDTH
        layoutMeasurement: { width: 375 },
        contentSize: { width: 750 },
      },
    });

    expect(dots[0].props.name).toBe('ellipse-outline');
    expect(dots[1].props.name).toBe('ellipse');
  });
}); 