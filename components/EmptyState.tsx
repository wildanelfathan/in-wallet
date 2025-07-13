import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle, TouchableOpacity } from 'react-native';
import { Icon } from 'native-base';

export interface EmptyStateProps {
  message: string;
  title?: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  message,
  title = 'No Results Found',
  icon = 'alert-circle',
  actionLabel,
  onAction,
  containerStyle,
  titleStyle,
  messageStyle,
}) => {
  return (
    <View style={[styles.container, containerStyle]} testID="empty-state-container">
      {icon && (
        <Icon
          name={icon}
          size="xl"
          color="gray.400"
          testID="empty-state-icon"
        />
      )}
      <Text style={[styles.title, titleStyle]}>{title}</Text>
      <Text style={[styles.message, messageStyle]}>{message}</Text>
      {actionLabel && onAction && (
        <TouchableOpacity onPress={onAction} style={styles.actionButton}>
          <Text style={styles.actionText}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  message: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  actionButton: {
    padding: 12,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  actionText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
}); 