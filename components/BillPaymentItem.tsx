import React from 'react';
import { Box, HStack, VStack, Text, Image, Pressable, Badge } from 'native-base';
import { useTranslation } from 'react-i18next';

export interface BillPaymentItemProps {
  id: string;
  name: string;
  category: string;
  logoUrl: string;
  hasPromo?: boolean;
  promoText?: string;
  isPopular?: boolean;
  onPress: () => void;
  testID?: string;
}

export const BillPaymentItem: React.FC<BillPaymentItemProps> = ({
  name,
  category,
  logoUrl,
  hasPromo,
  promoText,
  isPopular,
  onPress,
  testID,
}) => {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      _pressed={{ bg: 'gray.50' }}
    >
      <Box
        p={4}
        borderBottomWidth={1}
        borderBottomColor="gray.100"
      >
        <HStack space={3} alignItems="center">
          <Box
            width={12}
            height={12}
            rounded="lg"
            overflow="hidden"
            bg="gray.100"
          >
            <Image
              source={{ uri: logoUrl }}
              alt={name}
              width="100%"
              height="100%"
              testID={`${testID}-logo`}
              fallbackElement={
                <Box
                  width="100%"
                  height="100%"
                  bg="gray.200"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize="2xl" color="gray.400">
                    {name.charAt(0)}
                  </Text>
                </Box>
              }
            />
          </Box>
          <VStack flex={1} space={1}>
            <HStack alignItems="center" space={2}>
              <Text fontSize="md" fontWeight="semibold">
                {name}
              </Text>
              {isPopular && (
                <Badge
                  colorScheme="primary"
                  variant="subtle"
                  rounded="full"
                  testID={`${testID}-popular-badge`}
                >
                  {t('bill.popular')}
                </Badge>
              )}
            </HStack>
            <Text fontSize="sm" color="gray.500">
              {t(`bill.category.${category}`)}
            </Text>
            {hasPromo && promoText && (
              <HStack space={2} alignItems="center">
                <Badge
                  colorScheme="success"
                  variant="subtle"
                  rounded="full"
                  testID={`${testID}-promo-badge`}
                >
                  {t('bill.promo')}
                </Badge>
                <Text fontSize="xs" color="success.600">
                  {promoText}
                </Text>
              </HStack>
            )}
          </VStack>
        </HStack>
      </Box>
    </Pressable>
  );
}; 