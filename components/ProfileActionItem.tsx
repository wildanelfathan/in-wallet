import React from 'react';
import { Box, HStack, Text, Icon, Pressable, Badge } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export interface ProfileActionItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  badge?: {
    text: string;
    colorScheme?: string;
  };
  rightText?: string;
  testID?: string;
}

export const ProfileActionItem: React.FC<ProfileActionItemProps> = ({
  icon,
  label,
  onPress,
  badge,
  rightText,
  testID,
}) => {
  const { t } = useTranslation();

  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      _pressed={{ bg: 'gray.100' }}
    >
      <Box py={4} px={4}>
        <HStack space={4} alignItems="center" justifyContent="space-between">
          <HStack space={3} alignItems="center" flex={1}>
            <Icon
              as={Ionicons}
              name={icon}
              size="sm"
              color="gray.600"
              testID={`${testID}-icon`}
            />
            <Text fontSize="md" color="gray.800">
              {t(label)}
            </Text>
          </HStack>
          <HStack space={2} alignItems="center">
            {badge && (
              <Badge
                colorScheme={badge.colorScheme || 'primary'}
                variant="solid"
                rounded="full"
                testID={`${testID}-badge`}
              >
                {badge.text}
              </Badge>
            )}
            {rightText && (
              <Text
                fontSize="sm"
                color="gray.500"
                testID={`${testID}-right-text`}
              >
                {rightText}
              </Text>
            )}
            <Icon
              as={Ionicons}
              name="chevron-forward"
              size="sm"
              color="gray.400"
            />
          </HStack>
        </HStack>
      </Box>
    </Pressable>
  );
}; 