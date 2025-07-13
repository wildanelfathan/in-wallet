import React from 'react';
import { Box, Spinner, Text } from 'native-base';
import { ViewStyle, TextStyle } from 'react-native';

export interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'lg';
  color?: string;
  hideMessage?: boolean;
  containerStyle?: ViewStyle;
  messageStyle?: TextStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'lg',
  color = 'primary.500',
  hideMessage = false,
  containerStyle,
  messageStyle,
}) => {
  return (
    <Box
      flex={1}
      justifyContent="center"
      alignItems="center"
      p={8}
      style={containerStyle}
    >
      <Spinner
        testID="loading-spinner"
        size={size}
        color={color}
      />
      {!hideMessage && (
        <Text
          mt={4}
          fontSize="md"
          color="gray.600"
          textAlign="center"
          style={messageStyle}
        >
          {message}
        </Text>
      )}
    </Box>
  );
}; 