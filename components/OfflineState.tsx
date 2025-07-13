import React from 'react';
import { Box, VStack, Text, Button, Icon } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { ViewStyle, TextStyle } from 'react-native';

export interface OfflineStateProps {
  title?: string;
  message?: string;
  retryLabel?: string;
  icon?: keyof typeof MaterialIcons.glyphMap;
  onRetry: () => void;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
}

export const OfflineState: React.FC<OfflineStateProps> = ({
  title = 'No Internet Connection',
  message = 'Please check your connection and try again',
  retryLabel = 'Retry',
  icon = 'cloud-off',
  onRetry,
  containerStyle,
  titleStyle,
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
      <VStack space={4} alignItems="center">
        <Icon
          testID="offline-state-icon"
          as={MaterialIcons}
          name={icon}
          size={12}
          color="gray.400"
        />
        <Text
          fontSize="xl"
          fontWeight="bold"
          textAlign="center"
          color="gray.800"
          style={titleStyle}
        >
          {title}
        </Text>
        <Text
          fontSize="md"
          textAlign="center"
          color="gray.600"
          style={messageStyle}
        >
          {message}
        </Text>
        <Button
          variant="solid"
          colorScheme="primary"
          onPress={onRetry}
          leftIcon={<Icon as={MaterialIcons} name="refresh" size={5} />}
        >
          {retryLabel}
        </Button>
      </VStack>
    </Box>
  );
}; 