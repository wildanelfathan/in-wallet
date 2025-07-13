import React, { useState, useRef } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import { Box, Image, Text, HStack, VStack, Pressable, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_WIDTH = SCREEN_WIDTH - 32; // 16px padding on each side

export interface PromoItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  onPress: () => void;
}

export interface PromoBannerProps {
  items: PromoItem[];
  autoPlay?: boolean;
  autoPlayInterval?: number;
  testID?: string;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
  items,
  autoPlay = true,
  autoPlayInterval = 5000,
  testID,
}) => {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Auto-play functionality
  React.useEffect(() => {
    if (!autoPlay || items.length <= 1) return;

    const interval = setInterval(() => {
      const nextIndex = (activeIndex + 1) % items.length;
      scrollViewRef.current?.scrollTo({
        x: nextIndex * BANNER_WIDTH,
        animated: true,
      });
      setActiveIndex(nextIndex);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [activeIndex, autoPlay, autoPlayInterval, items.length]);

  const handleScroll = (event: any) => {
    const contentOffset = event.nativeEvent.contentOffset;
    const index = Math.round(contentOffset.x / BANNER_WIDTH);
    setActiveIndex(index);
  };

  return (
    <Box testID={testID}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        testID={`${testID}-scroll-view`}
      >
        {items.map((item, index) => (
          <Pressable
            key={item.id}
            onPress={item.onPress}
            testID={`${testID}-item-${item.id}`}
          >
            <Box
              width={BANNER_WIDTH}
              mx={4}
              rounded="lg"
              overflow="hidden"
              bg="white"
              shadow={1}
            >
              <Image
                source={{ uri: item.imageUrl }}
                alt={item.title}
                height={160}
                width={BANNER_WIDTH}
                testID={`${testID}-image-${item.id}`}
              />
              <VStack p={4} space={1}>
                <Text fontSize="lg" fontWeight="bold">
                  {t(item.title)}
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {t(item.description)}
                </Text>
              </VStack>
            </Box>
          </Pressable>
        ))}
      </ScrollView>

      {/* Pagination dots */}
      {items.length > 1 && (
        <HStack
          space={2}
          justifyContent="center"
          mt={2}
          testID={`${testID}-pagination`}
        >
          {items.map((_, index) => (
            <Icon
              key={index}
              as={Ionicons}
              name={index === activeIndex ? 'ellipse' : 'ellipse-outline'}
              size="xs"
              color={index === activeIndex ? 'primary.500' : 'gray.300'}
              testID={`${testID}-dot-${index}`}
            />
          ))}
        </HStack>
      )}
    </Box>
  );
}; 