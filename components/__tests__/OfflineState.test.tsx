import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { OfflineState } from '../OfflineState';
import { render } from '../../utils/test-utils';

describe('OfflineState', () => {
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText } = render(
      <OfflineState onRetry={mockOnRetry} />
    );

    expect(getByText('No Internet Connection')).toBeTruthy();
    expect(getByText('Please check your connection and try again')).toBeTruthy();
    expect(getByText('Retry')).toBeTruthy();
  });

  it('renders correctly with custom title and message', () => {
    const { getByText } = render(
      <OfflineState
        title="Custom Offline Title"
        message="Custom offline message"
        onRetry={mockOnRetry}
      />
    );

    expect(getByText('Custom Offline Title')).toBeTruthy();
    expect(getByText('Custom offline message')).toBeTruthy();
  });

  it('handles retry button press', () => {
    const { getByText } = render(
      <OfflineState onRetry={mockOnRetry} />
    );

    fireEvent.press(getByText('Retry'));
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('renders with custom retry button label', () => {
    const { getByText } = render(
      <OfflineState
        retryLabel="Try Again"
        onRetry={mockOnRetry}
      />
    );

    expect(getByText('Try Again')).toBeTruthy();
  });

  it('renders with custom styles', () => {
    const tree = render(
      <OfflineState
        onRetry={mockOnRetry}
        containerStyle={{ backgroundColor: 'red' }}
        titleStyle={{ color: 'blue' }}
        messageStyle={{ color: 'green' }}
      />
    ).toJSON();

    expect(tree).toHaveStyle({ backgroundColor: 'red' });
  });

  it('renders with custom icon', () => {
    const { getByTestId } = render(
      <OfflineState
        icon="wifi-off"
        onRetry={mockOnRetry}
      />
    );

    expect(getByTestId('offline-state-icon')).toBeTruthy();
  });
}); 