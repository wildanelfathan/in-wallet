import React from 'react';
import { Box, HStack, VStack, Text, Icon, Pressable, IconButton } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export type PaymentMethodType = 'bank' | 'card' | 'crypto' | 'ewallet';

export interface PaymentMethodCardProps {
  type: PaymentMethodType;
  name: string;
  accountNumber: string;
  isDefault?: boolean;
  isVerified?: boolean;
  icon?: string;
  balance?: string;
  currency?: string;
  onPress?: () => void;
  onDelete?: () => void;
  onSetDefault?: () => void;
  testID?: string;
}

export const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  type,
  name,
  accountNumber,
  isDefault = false,
  isVerified = false,
  icon,
  balance,
  currency,
  onPress,
  onDelete,
  onSetDefault,
  testID,
}) => {
  const { t } = useTranslation();

  const getMethodIcon = (type: PaymentMethodType): keyof typeof Ionicons.glyphMap => {
    switch (type) {
      case 'bank':
        return 'business-outline';
      case 'card':
        return 'card-outline';
      case 'crypto':
        return 'logo-bitcoin';
      case 'ewallet':
        return 'wallet-outline';
    }
  };

  const methodIcon = getMethodIcon(type);

  const maskAccountNumber = (number: string): string => {
    if (type === 'card') {
      return `•••• ${number.slice(-4)}`;
    }
    if (type === 'bank') {
      return `•••••${number.slice(-4)}`;
    }
    return number;
  };

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
        borderColor={isDefault ? 'primary.500' : 'gray.100'}
      >
        <VStack space={3}>
          <HStack justifyContent="space-between" alignItems="center">
            <HStack space={3} alignItems="center">
              <Box
                p={2}
                rounded="lg"
                bg={isDefault ? 'primary.100' : 'gray.100'}
              >
                <Icon
                  as={Ionicons}
                  name={methodIcon}
                  size="md"
                  color={isDefault ? 'primary.500' : 'gray.500'}
                  testID={`${testID}-icon`}
                />
              </Box>
              <VStack>
                <HStack space={2} alignItems="center">
                  <Text
                    fontSize="md"
                    fontWeight="semibold"
                    testID={`${testID}-name`}
                  >
                    {name}
                  </Text>
                  {isVerified && (
                    <Icon
                      as={Ionicons}
                      name="checkmark-circle"
                      size="sm"
                      color="success.500"
                      testID={`${testID}-verified`}
                    />
                  )}
                </HStack>
                <Text
                  fontSize="sm"
                  color="gray.500"
                  testID={`${testID}-number`}
                >
                  {maskAccountNumber(accountNumber)}
                </Text>
              </VStack>
            </HStack>

            {balance && (
              <VStack alignItems="flex-end">
                <Text
                  fontSize="md"
                  fontWeight="semibold"
                  testID={`${testID}-balance`}
                >
                  {currency} {balance}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {t('payment.available')}
                </Text>
              </VStack>
            )}
          </HStack>

          <HStack justifyContent="space-between" alignItems="center">
            {isDefault ? (
              <Text
                fontSize="xs"
                color="primary.500"
                testID={`${testID}-default`}
              >
                {t('payment.default_method')}
              </Text>
            ) : (
              <Pressable
                onPress={onSetDefault}
                testID={`${testID}-set-default`}
                _pressed={{ opacity: 0.8 }}
              >
                <Text fontSize="xs" color="gray.500">
                  {t('payment.set_as_default')}
                </Text>
              </Pressable>
            )}

            {onDelete && (
              <IconButton
                icon={
                  <Icon
                    as={Ionicons}
                    name="trash-outline"
                    size="sm"
                    color="gray.500"
                  />
                }
                variant="ghost"
                colorScheme="gray"
                onPress={onDelete}
                testID={`${testID}-delete`}
                _pressed={{ opacity: 0.8 }}
              />
            )}
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  );
}; 