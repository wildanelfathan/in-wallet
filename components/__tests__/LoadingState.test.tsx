import React from 'react';
import { LoadingState } from '../LoadingState';
import { render } from '../../utils/test-utils';

describe('LoadingState', () => {
  it('renders correctly with default props', () => {
    const { getByText, getByTestId } = render(<LoadingState />);

    expect(getByTestId('loading-spinner')).toBeTruthy();
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('renders correctly with custom message', () => {
    const { getByText } = render(
      <LoadingState message="Custom loading message" />
    );

    expect(getByText('Custom loading message')).toBeTruthy();
  });

  it('renders correctly with custom size', () => {
    const { getByTestId } = render(
      <LoadingState size="lg" />
    );

    const spinner = getByTestId('loading-spinner');
    expect(spinner.props.size).toBe('lg');
  });

  it('renders correctly with custom color', () => {
    const { getByTestId } = render(
      <LoadingState color="blue.500" />
    );

    const spinner = getByTestId('loading-spinner');
    expect(spinner.props.color).toBe('blue.500');
  });

  it('renders with custom styles', () => {
    const tree = render(
      <LoadingState
        containerStyle={{ backgroundColor: 'red' }}
        messageStyle={{ color: 'blue' }}
      />
    ).toJSON();

    expect(tree).toHaveStyle({ backgroundColor: 'red' });
  });

  it('renders without message when hideMessage is true', () => {
    const { queryByText } = render(
      <LoadingState hideMessage />
    );

    expect(queryByText('Loading...')).toBeNull();
  });
}); 