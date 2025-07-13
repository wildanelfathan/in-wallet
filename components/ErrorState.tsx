import React, { useState } from 'react';
import { Box, VStack, Text, Button, Icon, Collapse } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { ViewStyle, TextStyle } from 'react-native';

export interface ErrorStateProps {
  error: Error;
  title?: string;
  message?: string;
  retryLabel?: string;
  onRetry: () => void;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  messageStyle?: TextStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  error,
  title = 'Something went wrong',
  message = 'Please try again',
  retryLabel = 'Retry',
  onRetry,
  containerStyle,
  titleStyle,
  messageStyle,
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

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
          as={MaterialIcons}
          name="error-outline"
          size={12}
          color="error.500"
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
        <Button
          variant="ghost"
          colorScheme="gray"
          onPress={toggleDetails}
          leftIcon={
            <Icon
              as={MaterialIcons}
              name={showDetails ? 'expand-less' : 'expand-more'}
              size={5}
            />
          }
        >
          {showDetails ? 'Hide Details' : 'Show Details'}
        </Button>
        <Collapse isOpen={showDetails}>
          <Box
            bg="gray.100"
            p={4}
            rounded="md"
            maxWidth="100%"
            width="100%"
          >
            <Text fontSize="sm" fontFamily="monospace" color="gray.800">
              {error.message}
            </Text>
            {error.stack && (
              <Text
                fontSize="xs"
                fontFamily="monospace"
                color="gray.600"
                mt={2}
              >
                {error.stack}
              </Text>
            )}
          </Box>
        </Collapse>
      </VStack>
    </Box>
  );
}; 