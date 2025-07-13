import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Input, Button, Spinner, useToast, Pressable, Icon, Center, Image } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const KYC_API = '/api/user/kyc';

const KYCScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // TODO: Implement real photo upload
  const handlePhotoUpload = async () => {
    toast.show({ description: 'Photo upload not implemented yet.' });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      if (!fullName || !idNumber || !photoUrl) {
        setError('Please fill all fields and upload a photo.');
        setLoading(false);
        return;
      }
      // Get user ID (replace with real auth/user context)
      const userId = 'user_test_123'; // TODO: Replace with real user ID from auth
      const res = await fetch(KYC_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          user_id: userId,
          full_name: fullName,
          id_number: idNumber,
          photo_url: photoUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to submit KYC');
      setSuccess(true);
      toast.show({ description: 'KYC submitted successfully!' });
    } catch (err: any) {
      setError(err.message || 'Failed to submit KYC');
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
        <Text fontSize="xl" fontWeight="bold">Verification</Text>
        <Box w={6} />
      </HStack>
      <VStack flex={1} px={4} py={2} space={4}>
        {success ? (
          <Center flex={1}>
            <Icon as={Ionicons} name="checkmark-circle" size={16} color="success.500" />
            <Text fontSize="lg" fontWeight="bold" mt={4}>KYC Submitted!</Text>
            <Text fontSize="sm" color="gray.500" mt={2}>Your verification is under review.</Text>
            <Button mt={8} onPress={() => navigation.goBack()} colorScheme="primary">Back to Profile</Button>
          </Center>
        ) : (
          <VStack space={4}>
            <Text fontSize="md" fontWeight="semibold">Full Name</Text>
            <Input
              placeholder="Enter your full name"
              value={fullName}
              onChangeText={setFullName}
              isDisabled={loading}
            />
            <Text fontSize="md" fontWeight="semibold">ID Number</Text>
            <Input
              placeholder="Enter your ID number"
              value={idNumber}
              onChangeText={setIdNumber}
              isDisabled={loading}
            />
            <Text fontSize="md" fontWeight="semibold">Photo</Text>
            {photoUrl ? (
              <Image source={{ uri: photoUrl }} alt="KYC Photo" size="xl" rounded="lg" mb={2} />
            ) : null}
            <Button onPress={handlePhotoUpload} isDisabled={loading} leftIcon={<Icon as={Ionicons} name="camera" size={5} />}>Upload Photo</Button>
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

export default KYCScreen; 