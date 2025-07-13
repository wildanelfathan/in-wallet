import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Input, Button, Spinner, useToast, Pressable, Icon, Center } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const REFERRAL_API = '/api/user/refer';

const ReferralScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      if (!referralCode) {
        setError('Please enter a referral code.');
        setLoading(false);
        return;
      }
      // Get user ID (replace with real auth/user context)
      const userId = 'user_test_123'; // TODO: Replace with real user ID from auth
      const res = await fetch(REFERRAL_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          user_id: userId,
          referral_code: referralCode,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit referral');
      setSuccess(true);
      toast.show({ description: 'Referral submitted successfully!' });
    } catch (err: any) {
      setError(err.message || 'Failed to submit referral');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} bg="white" safeArea>
      <HStack px={4} py={4} alignItems="center" justifyContent="space-between">
        <Pressable onPress={() => navigation.goBack()}>
          <Icon as={Ionicons} name="arrow-back" size={6} color="primary.500" />
        </Pressable>
        <Text fontSize="xl" fontWeight="bold">Referral</Text>
        <Box w={6} />
      </HStack>
      <VStack flex={1} px={4} py={2} space={4}>
        {success ? (
          <Center flex={1}>
            <Icon as={Ionicons} name="checkmark-circle" size={16} color="success.500" />
            <Text fontSize="lg" fontWeight="bold" mt={4}>Referral Submitted!</Text>
            <Text fontSize="sm" color="gray.500" mt={2}>Thank you for joining via referral.</Text>
            <Button mt={8} onPress={() => navigation.goBack()} colorScheme="primary">Back to Profile</Button>
          </Center>
        ) : (
          <VStack space={4}>
            <Text fontSize="md" fontWeight="semibold">Referral Code</Text>
            <Input
              placeholder="Enter referral code"
              value={referralCode}
              onChangeText={setReferralCode}
              isDisabled={loading}
            />
            {error && <Text color="error.500">{error}</Text>}
            <Button
              mt={4}
              onPress={handleSubmit}
              isLoading={loading}
              isDisabled={loading}
              colorScheme="primary"
            >
              Submit
            </Button>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default ReferralScreen; 