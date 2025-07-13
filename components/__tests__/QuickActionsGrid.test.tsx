import React from 'react';
import { fireEvent } from '@testing-library/react-native';
import { QuickActionsGrid, QuickAction } from '../QuickActionsGrid';
import { renderWithProviders } from '../../utils/test-utils';

describe('QuickActionsGrid', () => {
  const mockActions: QuickAction[] = [
    {
      id: 'topup',
      title: 'Top Up',
      label: 'actions.topup',
      icon: 'add-circle-outline' as const,
      onPress: jest.fn(),
    },
    {
      id: 'send',
      title: 'Send',
      label: 'actions.send',
      icon: 'send-outline' as const,
      onPress: jest.fn(),
    },
    {
      id: 'receive',
      title: 'Receive',
      label: 'actions.receive',
      icon: 'download-outline' as const,
      onPress: jest.fn(),
    },
  ];

  it('renders all actions correctly', () => {
    const { getByText, getByTestId } = renderWithProviders(
      <QuickActionsGrid actions={mockActions} testID="quick-actions" />
    );

    // Check if all action labels are rendered
    expect(getByText('actions.topup')).toBeTruthy();
    expect(getByText('actions.send')).toBeTruthy();
    expect(getByText('actions.receive')).toBeTruthy();

    // Check if all actions are rendered with correct testIDs
    expect(getByTestId('quick-actions-action-topup')).toBeTruthy();
    expect(getByTestId('quick-actions-action-send')).toBeTruthy();
    expect(getByTestId('quick-actions-action-receive')).toBeTruthy();
  });

  it('calls onPress handler when action is pressed', () => {
    const { getByTestId } = renderWithProviders(
      <QuickActionsGrid actions={mockActions} testID="quick-actions" />
    );

    // Press each action and verify its onPress handler is called
    fireEvent.press(getByTestId('quick-actions-action-topup'));
    expect(mockActions[0].onPress).toHaveBeenCalledTimes(1);

    fireEvent.press(getByTestId('quick-actions-action-send'));
    expect(mockActions[1].onPress).toHaveBeenCalledTimes(1);

    fireEvent.press(getByTestId('quick-actions-action-receive'));
    expect(mockActions[2].onPress).toHaveBeenCalledTimes(1);
  });

  it('respects custom column count', () => {
    const { getByTestId } = renderWithProviders(
      <QuickActionsGrid
        actions={mockActions}
        columns={2}
        testID="quick-actions"
      />
    );

    // With 3 actions and 2 columns, we should have 2 rows
    const container = getByTestId('quick-actions');
    expect(container.props.children).toHaveLength(2);
  });

  it('maintains grid layout with empty spaces', () => {
    const { getByTestId } = renderWithProviders(
      <QuickActionsGrid
        actions={mockActions}
        columns={4}
        testID="quick-actions"
      />
    );

    // With 3 actions and 4 columns, we should have 1 row with 1 empty space
    const container = getByTestId('quick-actions');
    const firstRow = container.props.children[0];
    expect(firstRow.props.children).toHaveLength(4); // 3 actions + 1 empty space
  });
}); 