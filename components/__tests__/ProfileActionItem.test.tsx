import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { ProfileActionItem } from '../ProfileActionItem';
import { renderWithProviders } from '../../utils/test-utils';

describe('ProfileActionItem', () => {
  const defaultProps = {
    icon: 'person-outline' as const,
    label: 'profile.my_profile',
    onPress: jest.fn(),
    testID: 'profile-action',
  };

  it('renders correctly with basic props', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <ProfileActionItem {...defaultProps} />
    );

    expect(getByText('profile.my_profile')).toBeTruthy();
    expect(getByTestId('profile-action-icon')).toBeTruthy();
  });

  it('renders badge when provided', () => {
    const props = {
      ...defaultProps,
      badge: {
        text: 'New',
        colorScheme: 'success',
      },
    };

    const { getByText, getByTestId } = renderWithProviders(
      <ProfileActionItem {...props} />
    );

    const badge = getByTestId('profile-action-badge');
    expect(badge).toBeTruthy();
    expect(getByText('New')).toBeTruthy();
    expect(badge.props.style).toContainEqual({
      backgroundColor: expect.stringContaining('success'),
    });
  });

  it('renders right text when provided', () => {
    const props = {
      ...defaultProps,
      rightText: 'Details',
    };

    const { getByText, getByTestId } = renderWithProviders(
      <ProfileActionItem {...props} />
    );

    const rightText = getByTestId('profile-action-right-text');
    expect(rightText).toBeTruthy();
    expect(getByText('Details')).toBeTruthy();
  });

  it('calls onPress handler when pressed', () => {
    const { getByTestId } = renderWithProviders(
      <ProfileActionItem {...defaultProps} />
    );

    fireEvent.press(getByTestId('profile-action'));
    expect(defaultProps.onPress).toHaveBeenCalledTimes(1);
  });

  it('renders with both badge and right text', () => {
    const props = {
      ...defaultProps,
      badge: {
        text: 'New',
        colorScheme: 'success',
      },
      rightText: 'Details',
    };

    const { getByTestId, getByText } = renderWithProviders(
      <ProfileActionItem {...props} />
    );

    expect(getByTestId('profile-action-badge')).toBeTruthy();
    expect(getByTestId('profile-action-right-text')).toBeTruthy();
    expect(getByText('New')).toBeTruthy();
    expect(getByText('Details')).toBeTruthy();
  });

  it('uses default primary colorScheme when not specified for badge', () => {
    const props = {
      ...defaultProps,
      badge: {
        text: 'New',
      },
    };

    const { getByTestId } = renderWithProviders(
      <ProfileActionItem {...props} />
    );

    const badge = getByTestId('profile-action-badge');
    expect(badge.props.style).toContainEqual({
      backgroundColor: expect.stringContaining('primary'),
    });
  });
}); 