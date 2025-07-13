import React, { useState, useEffect } from 'react';
import { 
  Box, 
  VStack, 
  HStack, 
  Text, 
  Input, 
  Button, 
  Spinner, 
  useToast, 
  Pressable, 
  Icon, 
  Center, 
  Image,
  FormControl,
  ScrollView,
  KeyboardAvoidingView,
  Divider,
  Avatar
} from 'native-base';
import { Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { userService } from '../services/supabaseService';
import { User } from '../types';
import { useTranslation } from 'react-i18next';

const PROFILE_API = '/api/user/profile';

const EditProfileScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const toast = useToast();

  const [profile, setProfile] = useState<User | null>(null);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [newAvatar, setNewAvatar] = useState<string | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isKycVerified, setIsKycVerified] = useState(false);
  
  // Form validation
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });

  // Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    setFetchLoading(true);
    setError(null);
    try {
      // Get user ID (replace with real auth/user context)
      const userId = 'user_test_123'; // TODO: Replace with real user ID from auth
      
      // Use userService to get profile
      const userProfile = await userService.getUserProfile(userId);
      
      if (userProfile) {
        setProfile(userProfile);
        setFullName(userProfile.full_name || '');
        setEmail(userProfile.email || '');
        setPhoneNumber(userProfile.phone_number || '');
        setAvatarUrl(userProfile.avatar_url || null);
        setIsKycVerified(userProfile.is_kyc_verified || false);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch user profile');
      toast.show({
        title: "Error",
        description: "Failed to load profile data",
        variant: "solid",
        colorScheme: "error"
      });
    } finally {
      setFetchLoading(false);
    }
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      fullName: '',
      email: '',
      phoneNumber: '',
    };

    // Validate full name
    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    // Validate email
    if (!email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
      isValid = false;
    }

    // Validate phone number (optional but must be valid if provided)
    if (phoneNumber && !/^\+?[0-9]{10,15}$/.test(phoneNumber)) {
      newErrors.phoneNumber = 'Phone number is invalid';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleAvatarUpload = async () => {
    try {
      // Request permission
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (permissionResult.granted === false) {
        toast.show({
          title: "Permission Required",
          description: "Please allow access to your photos to change profile picture",
          variant: "solid",
          colorScheme: "warning"
        });
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });

      if (!result.canceled) {
        // In a real app, you would upload this to storage and get a URL
        // For now, we'll just use the local URI
        setNewAvatar(result.assets[0].uri);
        
        // TODO: In a real implementation, upload to Supabase storage
        // const uploadResult = await uploadToStorage(result.assets[0].uri);
        // setNewAvatar(uploadResult.url);
      }
    } catch (err) {
      toast.show({
        title: "Error",
        description: "Failed to upload image",
        variant: "solid",
        colorScheme: "error"
      });
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Get user ID (replace with real auth/user context)
      const userId = 'user_test_123'; // TODO: Replace with real user ID from auth
      
      const res = await fetch(PROFILE_API, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': userId,
        },
        body: JSON.stringify({
          full_name: fullName,
          email: email,
          phone_number: phoneNumber,
          avatar_url: newAvatar || avatarUrl,
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        // Special case for KYC verified users
        if (res.status === 403 && data.is_kyc_verified) {
          toast.show({
            title: "Cannot Update",
            description: "Your profile is KYC verified and cannot be edited",
            variant: "solid",
            colorScheme: "warning"
          });
          setIsKycVerified(true);
        } else {
          throw new Error(data.error || 'Failed to update profile');
        }
      } else {
        toast.show({
          title: "Success",
          description: "Profile updated successfully",
          variant: "solid",
          colorScheme: "success"
        });
        
        // Update local state with returned profile
        if (data.profile) {
          setProfile(data.profile);
        }
        
        // Navigate back to profile screen
        navigation.goBack();
      }
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
      toast.show({
        title: "Error",
        description: err.message || "Failed to update profile",
        variant: "solid",
        colorScheme: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <Center flex={1} bg="white">
        <Spinner size="lg" color="primary.500" />
        <Text mt={4} color="gray.500">Loading profile...</Text>
      </Center>
    );
  }

  return (
    <KeyboardAvoidingView
      flex={1}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Box flex={1} bg="white" safeArea>
        <HStack px={4} py={4} alignItems="center" justifyContent="space-between">
          <Pressable onPress={() => navigation.goBack()}>
            <Icon as={Ionicons} name="arrow-back" size={6} color="primary.500" />
          </Pressable>
          <Text fontSize="xl" fontWeight="bold">{t('profile.editProfile')}</Text>
          <Box w={6} />
        </HStack>
        
        <Divider />
        
        <ScrollView flex={1} px={4} py={4}>
          <VStack space={6}>
            {/* Avatar Section */}
            <Center>
              <Avatar 
                size="2xl" 
                source={
                  newAvatar 
                    ? { uri: newAvatar } 
                    : avatarUrl 
                      ? { uri: avatarUrl }
                      : undefined
                }
                bg="primary.200"
              >
                {!newAvatar && !avatarUrl && (profile?.full_name?.[0] || 'U')}
              </Avatar>
              
              <Button
                mt={4}
                variant="outline"
                leftIcon={<Icon as={Ionicons} name="camera-outline" size="sm" />}
                onPress={handleAvatarUpload}
                isDisabled={loading || isKycVerified}
              >
                Change Photo
              </Button>
              
              {isKycVerified && (
                <HStack space={1} mt={2} alignItems="center">
                  <Icon as={Ionicons} name="shield-checkmark" size="xs" color="success.500" />
                  <Text fontSize="xs" color="success.500">KYC Verified</Text>
                </HStack>
              )}
            </Center>
            
            {/* Form Fields */}
            <VStack space={4}>
              <FormControl isRequired isInvalid={!!errors.fullName}>
                <FormControl.Label>Full Name</FormControl.Label>
                <Input
                  placeholder="Enter your full name"
                  value={fullName}
                  onChangeText={setFullName}
                  isDisabled={loading || isKycVerified}
                />
                <FormControl.ErrorMessage>{errors.fullName}</FormControl.ErrorMessage>
              </FormControl>
              
              <FormControl isRequired isInvalid={!!errors.email}>
                <FormControl.Label>Email</FormControl.Label>
                <Input
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  isDisabled={loading || isKycVerified}
                />
                <FormControl.ErrorMessage>{errors.email}</FormControl.ErrorMessage>
              </FormControl>
              
              <FormControl isInvalid={!!errors.phoneNumber}>
                <FormControl.Label>Phone Number</FormControl.Label>
                <Input
                  placeholder="Enter your phone number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                  isDisabled={loading || isKycVerified}
                />
                <FormControl.ErrorMessage>{errors.phoneNumber}</FormControl.ErrorMessage>
                <FormControl.HelperText>Format: +1234567890</FormControl.HelperText>
              </FormControl>
              
              {error && (
                <Text color="error.500" mt={2}>{error}</Text>
              )}
              
              {isKycVerified && (
                <Box bg="info.100" p={3} rounded="md">
                  <Text color="info.800">
                    Your profile is KYC verified and cannot be edited. Please contact support if you need to make changes.
                  </Text>
                </Box>
              )}
              
              <Button
                mt={4}
                onPress={handleSubmit}
                isLoading={loading}
                isDisabled={loading || isKycVerified}
                colorScheme="primary"
              >
                Save Changes
              </Button>
            </VStack>
          </VStack>
        </ScrollView>
      </Box>
    </KeyboardAvoidingView>
  );
};

export default EditProfileScreen; 