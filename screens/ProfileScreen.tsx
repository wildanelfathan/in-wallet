import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Icon, Pressable, ScrollView, Avatar, Input, Button, useToast } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { ProfileActionItem } from '../components/ProfileActionItem';
import { userService } from '../services/supabaseService';
import { User } from '../types';

const FAVORITES_API = '/api/user/favorites';
const NOTIFY_API = '/api/notifications/send';

const ProfileScreen = () => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const toast = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [favLoading, setFavLoading] = useState(true);
  const [favError, setFavError] = useState<string | null>(null);
  const [newFav, setNewFav] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [notifyLoading, setNotifyLoading] = useState(false);
  const [notifyError, setNotifyError] = useState<string | null>(null);
  const [notifySuccess, setNotifySuccess] = useState(false);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      setLoading(true);
      try {
        const userId = 'user_test_123'; // TODO: Replace with real user ID from auth
        const userProfile = await userService.getUserProfile(userId);
        setUser(userProfile);
      } catch (err: any) {
        toast.show({
          title: "Error",
          description: "Failed to load profile data",
          variant: "solid",
          colorScheme: "error"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  // Fetch favorites on mount
  useEffect(() => {
    const fetchFavorites = async () => {
      setFavLoading(true);
      setFavError(null);
      try {
        const userId = 'user_test_123'; // TODO: Replace with real user ID from auth
        const res = await fetch(`${FAVORITES_API}?user_id=${userId}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch favorites');
        setFavorites(data.favorites || []);
      } catch (err: any) {
        setFavError(err.message || 'Failed to fetch favorites');
      } finally {
        setFavLoading(false);
      }
    };
    fetchFavorites();
  }, []);

  // Add a new favorite
  const handleAddFavorite = async () => {
    setAddLoading(true);
    setFavError(null);
    try {
      const userId = 'user_test_123'; // TODO: Replace with real user ID from auth
      const res = await fetch(`${FAVORITES_API}?user_id=${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ address: newFav }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add favorite');
      setFavorites([data.favorite, ...favorites]);
      setNewFav('');
    } catch (err: any) {
      setFavError(err.message || 'Failed to add favorite');
    } finally {
      setAddLoading(false);
    }
  };

  // Remove a favorite
  const handleRemoveFavorite = async (id: string) => {
    setFavError(null);
    try {
      const userId = 'user_test_123'; // TODO: Replace with real user ID from auth
      const res = await fetch(`${FAVORITES_API}?user_id=${userId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to remove favorite');
      setFavorites(favorites.filter((f: any) => f.id !== id));
    } catch (err: any) {
      setFavError(err.message || 'Failed to remove favorite');
    }
  };

  // Send test notification
  const handleSendNotification = async () => {
    setNotifyLoading(true);
    setNotifyError(null);
    setNotifySuccess(false);
    try {
      const userId = 'user_test_123'; // TODO: Replace with real user ID from auth
      const res = await fetch(NOTIFY_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-user-id': userId },
        body: JSON.stringify({
          user_id: userId,
          title: 'Test Notification',
          body: 'This is a test notification from InWallet',
          data: { screen: 'Profile' }
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send notification');
      setNotifySuccess(true);
      toast.show({
        title: "Success",
        description: "Notification sent successfully",
        variant: "solid",
        colorScheme: "success"
      });
    } catch (err: any) {
      setNotifyError(err.message || 'Failed to send notification');
      toast.show({
        title: "Error",
        description: err.message || "Failed to send notification",
        variant: "solid",
        colorScheme: "error"
      });
    } finally {
      setNotifyLoading(false);
    }
  };

  // Navigate to edit profile screen
  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  return (
    <Box flex={1} bg="white" safeArea>
      {/* Header */}
      <HStack px={4} py={4} justifyContent="space-between" alignItems="center">
        <Text fontSize="xl" fontWeight="bold">{t('profile.title')}</Text>
        <Icon as={Ionicons} name="notifications-outline" size={6} color="gray.600" />
      </HStack>

      <ScrollView>
        {/* Profile Header */}
        <Box px={4} py={6} bg="primary.500">
          <VStack alignItems="center" space={3}>
            <Avatar
              size="xl"
              source={user?.avatar_url ? { uri: user.avatar_url } : undefined}
              bg="gray.300"
            >
              {!user?.avatar_url && (user?.full_name?.[0] || 'U')}
            </Avatar>
            <Text color="white" fontSize="xl" fontWeight="bold">
              {user?.full_name || 'User'}
            </Text>
            <Text color="white:alpha.80">
              {user?.email || '@username'}
            </Text>
            <Pressable
              mt={2}
              bg="white:alpha.20"
              px={4}
              py={2}
              rounded="full"
              onPress={() => navigation.navigate('QR')}
            >
              <Text color="white">{t('profile.showQRCode')}</Text>
            </Pressable>
          </VStack>
        </Box>

        {/* Profile Actions */}
        <VStack px={4} pt={6} space={4}>
          <ProfileActionItem
            icon="person-outline"
            label="profile.myProfile"
            onPress={handleEditProfile}
            badge={!user?.is_kyc_verified ? { text: t('profile.badges.verifyNow'), colorScheme: 'warning' } : undefined}
            testID="profile-edit-button"
          />
          
          <ProfileActionItem
            icon="receipt-outline"
            label="profile.myBills"
            onPress={() => navigation.navigate('BillPayment')}
            badge={{ text: t('profile.badges.freeAdmin'), colorScheme: 'success' }}
            testID="profile-bills-button"
          />
          
          <ProfileActionItem
            icon="gift-outline"
            label="profile.dailyRewards"
            onPress={() => {/* TODO: Navigate to rewards */}}
            badge={{ text: t('profile.badges.coins'), colorScheme: 'primary' }}
            testID="profile-rewards-button"
          />
          
          <ProfileActionItem
            icon="people-outline"
            label="profile.inviteFriends"
            onPress={() => navigation.navigate('Referral')}
            badge={{ text: t('profile.badges.bonus'), colorScheme: 'info' }}
            testID="profile-invite-button"
          />
          
          <ProfileActionItem
            icon="ticket-outline"
            label="profile.myVouchers"
            onPress={() => {/* TODO: Navigate to vouchers */}}
            testID="profile-vouchers-button"
          />
          
          <ProfileActionItem
            icon="shield-checkmark-outline"
            label="profile.verification"
            onPress={() => navigation.navigate('KYC')}
            rightText={user?.is_kyc_verified ? 'Verified' : 'Pending'}
            testID="profile-verification-button"
          />
          
          <ProfileActionItem
            icon="speedometer-outline"
            label="profile.walletMeter"
            onPress={() => {/* TODO: Navigate to wallet meter */}}
            badge={{ text: t('profile.badges.seeScore'), colorScheme: 'primary' }}
            testID="profile-wallet-meter-button"
          />
          
          <ProfileActionItem
            icon="card-outline"
            label="profile.paymentMethods"
            onPress={() => {/* TODO: Navigate to payment methods */}}
            testID="profile-payment-methods-button"
          />
          
          <ProfileActionItem
            icon="settings-outline"
            label="profile.settings"
            onPress={() => {/* TODO: Navigate to settings */}}
            testID="profile-settings-button"
          />
        </VStack>

        {/* Favorite Contacts Section */}
        <VStack px={4} pt={8} space={4}>
          <Text fontSize="lg" fontWeight="bold">Favorite Contacts</Text>
          <HStack space={2} alignItems="center">
            <Input
              flex={1}
              placeholder="Add wallet address"
              value={newFav}
              onChangeText={setNewFav}
              isDisabled={addLoading}
            />
            <Button onPress={handleAddFavorite} isLoading={addLoading} isDisabled={addLoading || !newFav} colorScheme="primary">Add</Button>
          </HStack>
          {favLoading ? (
            <Text>Loading...</Text>
          ) : favError ? (
            <Text color="error.500">{favError}</Text>
          ) : favorites.length === 0 ? (
            <Text color="gray.400">No favorite contacts yet.</Text>
          ) : (
            <VStack space={2}>
              {favorites.map((fav: any) => (
                <HStack key={fav.id} alignItems="center" justifyContent="space-between" bg="gray.50" p={3} rounded="md">
                  <Text flex={1}>{fav.address}</Text>
                  <Button size="sm" colorScheme="danger" variant="ghost" onPress={() => handleRemoveFavorite(fav.id)}>
                    Remove
                  </Button>
                </HStack>
              ))}
            </VStack>
          )}
        </VStack>

        {/* Push Notification Test Button */}
        <VStack px={4} pt={8} space={4}>
          <Button onPress={handleSendNotification} isLoading={notifyLoading} colorScheme="primary">
            Send Test Notification
          </Button>
          {notifyError && <Text color="error.500">{notifyError}</Text>}
          {notifySuccess && <Text color="success.500">Notification sent!</Text>}
        </VStack>
        {/* Bottom Spacing */}
        <Box h={8} />
      </ScrollView>
    </Box>
  );
};

export default ProfileScreen; 