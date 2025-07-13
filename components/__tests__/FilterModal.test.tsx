import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { FilterModal } from '../FilterModal';
import { render, createMockTransactionFilter } from '../../utils/test-utils';

describe('FilterModal', () => {
  const mockOnClose = jest.fn();
  const mockOnApply = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with initial filter values', () => {
    const filter = createMockTransactionFilter();
    const { getByText, getByTestId } = render(
      <FilterModal
        isOpen={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initialFilter={filter}
      />
    );

    expect(getByText('Filter Transactions')).toBeTruthy();
    expect(getByTestId('min-amount-input').props.value).toBe('0');
    expect(getByTestId('max-amount-input').props.value).toBe('1000');
  });

  it('handles filter type selection', () => {
    const filter = createMockTransactionFilter();
    const { getByText } = render(
      <FilterModal
        isOpen={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initialFilter={filter}
      />
    );

    fireEvent.press(getByText('Receive'));
    fireEvent.press(getByText('Apply'));

    expect(mockOnApply).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'receive',
      })
    );
  });

  it('handles filter status selection', () => {
    const filter = createMockTransactionFilter();
    const { getByText } = render(
      <FilterModal
        isOpen={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initialFilter={filter}
      />
    );

    fireEvent.press(getByText('Failed'));
    fireEvent.press(getByText('Apply'));

    expect(mockOnApply).toHaveBeenCalledWith(
      expect.objectContaining({
        status: 'failed',
      })
    );
  });

  it('handles amount range input', () => {
    const filter = createMockTransactionFilter();
    const { getByTestId, getByText } = render(
      <FilterModal
        isOpen={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initialFilter={filter}
      />
    );

    fireEvent.changeText(getByTestId('min-amount-input'), '50');
    fireEvent.changeText(getByTestId('max-amount-input'), '500');
    fireEvent.press(getByText('Apply'));

    expect(mockOnApply).toHaveBeenCalledWith(
      expect.objectContaining({
        minAmount: 50,
        maxAmount: 500,
      })
    );
  });

  it('handles date range selection', () => {
    const filter = createMockTransactionFilter();
    const { getByTestId, getByText } = render(
      <FilterModal
        isOpen={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initialFilter={filter}
      />
    );

    const startDate = new Date('2024-02-01');
    const endDate = new Date('2024-02-29');

    fireEvent(getByTestId('start-date-picker'), 'onChange', null, startDate);
    fireEvent(getByTestId('end-date-picker'), 'onChange', null, endDate);
    fireEvent.press(getByText('Apply'));

    expect(mockOnApply).toHaveBeenCalledWith(
      expect.objectContaining({
        dateRange: {
          start: startDate,
          end: endDate,
        },
      })
    );
  });

  it('handles reset button press', () => {
    const filter = createMockTransactionFilter({
      types: ['payment'],
      statuses: ['completed'],
      amountRange: {
        min: 100,
        max: 1000
      },
    });

    const { getByText } = render(
      <FilterModal
        isOpen={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initialFilter={filter}
      />
    );

    fireEvent.press(getByText('Reset'));
    fireEvent.press(getByText('Apply'));

    expect(mockOnApply).toHaveBeenCalledWith(
      expect.objectContaining({
        type: undefined,
        status: undefined,
        minAmount: 0,
        maxAmount: undefined,
      })
    );
  });

  it('handles close button press', () => {
    const filter = createMockTransactionFilter();
    const { getByText } = render(
      <FilterModal
        isOpen={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initialFilter={filter}
      />
    );

    fireEvent.press(getByText('Close'));
    expect(mockOnClose).toHaveBeenCalled();
  });
}); 