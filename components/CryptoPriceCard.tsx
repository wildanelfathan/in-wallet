import React from 'react';
import { Box, HStack, Text, Icon, Pressable } from 'native-base';
import { Ionicons } from '@expo/vector-icons';

export interface CryptoPriceCardProps {
  symbol: string;
  name: string;
  price: string;
  currency: string;
  percentageChange: number;
  timeframe?: '1h' | '24h' | '7d';
  onPress?: () => void;
  testID?: string;
}

export const CryptoPriceCard: React.FC<CryptoPriceCardProps> = ({
  symbol,
  name,
  price,
  currency,
  percentageChange,
  timeframe = '24h',
  onPress,
  testID,
}) => {
  const isPositive = percentageChange >= 0;
  const changeColor = isPositive ? 'success.500' : 'error.500';
  const changeIcon = isPositive ? 'trending-up' : 'trending-down';

  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      _pressed={{ opacity: 0.8 }}
    >
      <Box
        bg="white"
        p={4}
        rounded="xl"
        shadow={2}
        borderWidth={1}
        borderColor="gray.100"
      >
        <HStack space={4} alignItems="center" justifyContent="space-between">
          <Box>
            <HStack space={2} alignItems="center">
              <Text
                fontSize="lg"
                fontWeight="bold"
                testID={`${testID}-symbol`}
              >
                {symbol}
              </Text>
              <Text
                fontSize="sm"
                color="gray.500"
                testID={`${testID}-name`}
              >
                {name}
              </Text>
            </HStack>
            <Text
              fontSize="2xl"
              fontWeight="bold"
              testID={`${testID}-price`}
            >
              {currency} {price}
            </Text>
          </Box>

          <Box>
            <HStack
              space={1}
              alignItems="center"
              bg={`${changeColor}:alpha.10`}
              px={3}
              py={2}
              rounded="full"
            >
              <Icon
                as={Ionicons}
                name={changeIcon}
                size="sm"
                color={changeColor}
                testID={`${testID}-trend-icon`}
              />
              <Text
                fontSize="md"
                fontWeight="bold"
                color={changeColor}
                testID={`${testID}-change`}
              >
                {isPositive ? '+' : ''}{percentageChange.toFixed(2)}%
              </Text>
              <Text
                fontSize="xs"
                color="gray.500"
                testID={`${testID}-timeframe`}
              >
                {timeframe}
              </Text>
            </HStack>
          </Box>
        </HStack>
      </Box>
    </Pressable>
  );
}; 