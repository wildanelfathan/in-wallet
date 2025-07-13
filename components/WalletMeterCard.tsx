import React from 'react';
import { Box, VStack, HStack, Text, Progress, Icon, Pressable } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export interface SpendingCategory {
  name: string;
  amount: string;
  percentage: number;
  color: string;
}

export interface WalletMeterCardProps {
  score: number;
  totalSpent: string;
  currency: string;
  categories: SpendingCategory[];
  period: string;
  onPress?: () => void;
  testID?: string;
}

export const WalletMeterCard: React.FC<WalletMeterCardProps> = ({
  score,
  totalSpent,
  currency,
  categories,
  period,
  onPress,
  testID,
}) => {
  const { t } = useTranslation();

  const getScoreColor = (score: number): string => {
    if (score >= 80) return 'success.500';
    if (score >= 60) return 'warning.500';
    return 'error.500';
  };

  const scoreColor = getScoreColor(score);

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
        <VStack space={4}>
          {/* Header with Wallet Score */}
          <HStack justifyContent="space-between" alignItems="center">
            <VStack>
              <Text
                fontSize="sm"
                color="gray.500"
                testID={`${testID}-title`}
              >
                {t('wallet.health_score')}
              </Text>
              <HStack space={1} alignItems="center">
                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  color={scoreColor}
                  testID={`${testID}-score`}
                >
                  {score}
                </Text>
                <Text fontSize="lg" color="gray.500">/100</Text>
              </HStack>
            </VStack>
            <Box
              bg={`${scoreColor}:alpha.10`}
              px={3}
              py={1}
              rounded="full"
            >
              <Text
                fontSize="sm"
                fontWeight="medium"
                color={scoreColor}
                testID={`${testID}-status`}
              >
                {score >= 80 ? t('wallet.excellent') :
                  score >= 60 ? t('wallet.good') :
                  t('wallet.needs_attention')}
              </Text>
            </Box>
          </HStack>

          {/* Total Spending */}
          <VStack space={1}>
            <Text fontSize="sm" color="gray.500">
              {t('wallet.total_spent', { period })}
            </Text>
            <Text
              fontSize="xl"
              fontWeight="bold"
              testID={`${testID}-total-spent`}
            >
              {currency} {totalSpent}
            </Text>
          </VStack>

          {/* Spending Categories */}
          <VStack space={3}>
            <Text fontSize="sm" fontWeight="medium">
              {t('wallet.spending_breakdown')}
            </Text>
            {categories.map((category, index) => (
              <VStack key={category.name} space={1}>
                <HStack justifyContent="space-between" alignItems="center">
                  <Text
                    fontSize="sm"
                    color="gray.600"
                    testID={`${testID}-category-${index}-name`}
                  >
                    {t(`wallet.category.${category.name}`)}
                  </Text>
                  <HStack space={2} alignItems="center">
                    <Text
                      fontSize="sm"
                      color="gray.600"
                      testID={`${testID}-category-${index}-amount`}
                    >
                      {currency} {category.amount}
                    </Text>
                    <Text
                      fontSize="sm"
                      color="gray.500"
                      testID={`${testID}-category-${index}-percentage`}
                    >
                      {category.percentage}%
                    </Text>
                  </HStack>
                </HStack>
                <Progress
                  value={category.percentage}
                  bg="gray.100"
                  _filledTrack={{
                    bg: category.color,
                  }}
                  testID={`${testID}-category-${index}-progress`}
                />
              </VStack>
            ))}
          </VStack>

          {/* View Details Link */}
          <HStack
            space={1}
            alignItems="center"
            alignSelf="flex-end"
            opacity={0.8}
          >
            <Text fontSize="sm" color="primary.500">
              {t('wallet.view_details')}
            </Text>
            <Icon
              as={Ionicons}
              name="chevron-forward"
              size="sm"
              color="primary.500"
            />
          </HStack>
        </VStack>
      </Box>
    </Pressable>
  );
}; 