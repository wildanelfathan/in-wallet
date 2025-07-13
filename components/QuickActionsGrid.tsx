import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme';

export type QuickAction = {
  id: string;
  title: string;
  icon: string;
  onPress: () => void;
  label?: string;
};

type QuickActionsGridProps = {
  actions: QuickAction[];
  testID?: string;
  columns?: number;
};

export const QuickActionsGrid: React.FC<QuickActionsGridProps> = ({ 
  actions, 
  testID = 'quick-actions-grid',
  columns = 4 
}) => {
  const theme = useTheme();

  const actionWidth = `${100 / columns}%` as any;

  return (
    <View testID={testID}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Quick Actions</Text>
      <View style={styles.grid}>
        {actions.map((action) => (
          <TouchableOpacity
            key={action.id}
            style={[
              styles.actionButton,
              {
                backgroundColor: theme.colors.surface,
                borderColor: theme.colors.border,
                width: actionWidth,
              },
            ]}
            onPress={action.onPress}
            testID={`${testID}-action-${action.id}`}
          >
            <Ionicons
              name={action.icon as any}
              size={24}
              color={theme.colors.primary}
              style={styles.icon}
            />
            <Text style={[styles.actionText, { color: theme.colors.text }]}>
              {action.label || action.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  actionButton: {
    paddingHorizontal: 8,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    margin: 8,
  },
  icon: {
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
}); 