import React from 'react';
import { fireEvent, act } from '@testing-library/react-native';
import { SearchBar } from '../SearchBar';
import { render } from '../../utils/test-utils';

jest.useFakeTimers();

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const { getByPlaceholderText } = render(
      <SearchBar onSearch={mockOnSearch} />
    );

    expect(getByPlaceholderText('Search transactions...')).toBeTruthy();
  });

  it('handles text input with debounce', () => {
    const { getByPlaceholderText } = render(
      <SearchBar onSearch={mockOnSearch} />
    );

    const searchInput = getByPlaceholderText('Search transactions...');
    fireEvent.changeText(searchInput, 'test query');

    // Verify that onSearch is not called immediately
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Fast-forward timers
    act(() => {
      jest.runAllTimers();
    });

    // Verify that onSearch is called after debounce
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });

  it('handles clear button press', () => {
    const { getByPlaceholderText, getByTestId } = render(
      <SearchBar onSearch={mockOnSearch} />
    );

    const searchInput = getByPlaceholderText('Search transactions...');
    fireEvent.changeText(searchInput, 'test query');

    // Fast-forward timers
    act(() => {
      jest.runAllTimers();
    });

    const clearButton = getByTestId('clear-button');
    fireEvent.press(clearButton);

    // Fast-forward timers again
    act(() => {
      jest.runAllTimers();
    });

    expect(mockOnSearch).toHaveBeenLastCalledWith('');
  });

  it('handles initial value', () => {
    const { getByPlaceholderText } = render(
      <SearchBar onSearch={mockOnSearch} initialValue="initial query" />
    );

    const searchInput = getByPlaceholderText('Search transactions...');
    expect(searchInput.props.value).toBe('initial query');
  });

  it('handles custom placeholder', () => {
    const { getByPlaceholderText } = render(
      <SearchBar
        onSearch={mockOnSearch}
        placeholder="Custom placeholder..."
      />
    );

    expect(getByPlaceholderText('Custom placeholder...')).toBeTruthy();
  });

  it('handles custom debounce delay', () => {
    const { getByPlaceholderText } = render(
      <SearchBar onSearch={mockOnSearch} debounceDelay={1000} />
    );

    const searchInput = getByPlaceholderText('Search transactions...');
    fireEvent.changeText(searchInput, 'test query');

    // Fast-forward 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Verify that onSearch is not called after 500ms
    expect(mockOnSearch).not.toHaveBeenCalled();

    // Fast-forward remaining 500ms
    act(() => {
      jest.advanceTimersByTime(500);
    });

    // Verify that onSearch is called after full 1000ms
    expect(mockOnSearch).toHaveBeenCalledWith('test query');
  });
}); 