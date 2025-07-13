import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { ErrorState } from '../ErrorState';
import { render } from '../../utils/test-utils';

describe('ErrorState', () => {
  const mockOnRetry = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    const { getByText } = render(
      <ErrorState error={new Error('Test error')} onRetry={mockOnRetry} />
    );

    expect(getByText('Something went wrong')).toBeTruthy();
    expect(getByText('Please try again')).toBeTruthy();
    expect(getByText('Retry')).toBeTruthy();
  });

  it('renders correctly with custom title and message', () => {
    const { getByText } = render(
      <ErrorState
        error={new Error('Test error')}
        title="Custom Error"
        message="Custom error message"
        onRetry={mockOnRetry}
      />
    );

    expect(getByText('Custom Error')).toBeTruthy();
    expect(getByText('Custom error message')).toBeTruthy();
  });

  it('handles retry button press', () => {
    const { getByText } = render(
      <ErrorState error={new Error('Test error')} onRetry={mockOnRetry} />
    );

    fireEvent.press(getByText('Retry'));
    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('displays error details when expanded', () => {
    const error = new Error('Test error');
    const { getByText, queryByText } = render(
      <ErrorState error={error} onRetry={mockOnRetry} />
    );

    // Error details should not be visible initially
    expect(queryByText(error.message)).toBeNull();

    // Show error details
    fireEvent.press(getByText('Show Details'));
    expect(getByText(error.message)).toBeTruthy();

    // Hide error details
    fireEvent.press(getByText('Hide Details'));
    expect(queryByText(error.message)).toBeNull();
  });

  it('renders with custom retry button label', () => {
    const { getByText } = render(
      <ErrorState
        error={new Error('Test error')}
        retryLabel="Try Again"
        onRetry={mockOnRetry}
      />
    );

    expect(getByText('Try Again')).toBeTruthy();
  });

  it('renders with custom styles', () => {
    const tree = render(
      <ErrorState
        error={new Error('Test error')}
        onRetry={mockOnRetry}
        containerStyle={{ backgroundColor: 'red' }}
        titleStyle={{ color: 'blue' }}
        messageStyle={{ color: 'green' }}
      />
    ).toJSON();

    expect(tree).toHaveStyle({ backgroundColor: 'red' });
  });
}); 