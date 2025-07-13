import React from 'react';
import { render } from '../../utils/test-utils';
import { EmptyState } from '../EmptyState';
import '@testing-library/jest-native/extend-expect';

describe('EmptyState', () => {
  it('renders correctly with default props', () => {
    const { getByText } = render(
      <EmptyState message="No Results Found" />
    );

    expect(getByText('No Results Found')).toBeTruthy();
    expect(getByText('Try adjusting your search or filters')).toBeTruthy();
  });

  it('renders correctly with custom title and message', () => {
    const { getByText } = render(
      <EmptyState 
        title="Custom Title" 
        message="Custom message here"
      />
    );

    expect(getByText('Custom Title')).toBeTruthy();
    expect(getByText('Custom message here')).toBeTruthy();
  });

  it('renders action button when provided', () => {
    const onAction = jest.fn();
    const { getByText } = render(
      <EmptyState
        actionLabel="Try Again"
        onAction={onAction}
        message="No items found"
      />
    );

    const button = getByText('Try Again');
    expect(button).toBeTruthy();

    button.props.onPress();
    expect(onAction).toHaveBeenCalledTimes(1);
  });

  it('does not render action button when no action props provided', () => {
    const { queryByRole } = render(<EmptyState message="No items found" />);
    expect(queryByRole('button')).toBeNull();
  });

  it('renders custom icon when provided', () => {
    const { getByTestId } = render(
      <EmptyState
        icon="search"
        message="No search results"
      />
    );

    expect(getByTestId('empty-state-icon')).toBeTruthy();
  });

  it('renders with custom styles', () => {
    const { getByTestId } = render(
      <EmptyState
        containerStyle={{ backgroundColor: 'red' }}
        titleStyle={{ color: 'blue' }}
        messageStyle={{ color: 'green' }}
        message="No items found"
      />
    );

    const container = getByTestId('empty-state-container');
    expect(container).toHaveStyle({ backgroundColor: 'red' });
  });
}); 