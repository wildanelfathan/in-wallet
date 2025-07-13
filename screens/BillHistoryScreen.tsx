import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Spinner, Pressable, FlatList } from 'native-base';
import { useNavigation } from '@react-navigation/native';

const BILL_HISTORY_API = '/api/bills/history';

const BillHistoryScreen = () => {
  const navigation = useNavigation();
  const [bills, setBills] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBills = async () => {
      setLoading(true);
      setError(null);
      try {
        const userId = 'user_test_123'; // TODO: Replace with real user ID from auth
        const res = await fetch(BILL_HISTORY_API, {
          headers: { 'x-user-id': userId },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch bill history');
        setBills(data.bills || []);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch bill history');
      } finally {
        setLoading(false);
      }
    };
    fetchBills();
  }, []);

  const renderItem = ({ item }: { item: any }) => (
    <Pressable
      onPress={() => navigation.navigate('BillReceipt', { bill: item })}
      bg="white"
      rounded="lg"
      p={4}
      mb={2}
      shadow={1}
    >
      <HStack justifyContent="space-between" alignItems="center">
        <VStack>
          <Text fontWeight="bold">{item.provider_name || 'Provider'}</Text>
          <Text color="gray.500" fontSize="xs">{new Date(item.created_at).toLocaleDateString()}</Text>
        </VStack>
        <VStack alignItems="flex-end">
          <Text fontWeight="bold">{item.currency} {item.amount}</Text>
          <Text color={item.status === 'success' ? 'success.500' : item.status === 'pending' ? 'warning.500' : 'error.500'} fontSize="xs">{item.status}</Text>
        </VStack>
      </HStack>
    </Pressable>
  );

  return (
    <Box flex={1} bg="white" safeArea px={4} pt={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4}>Bill Payment History</Text>
      {loading ? (
        <Spinner color="primary.500" />
      ) : error ? (
        <Text color="error.500">{error}</Text>
      ) : bills.length === 0 ? (
        <Text color="gray.400">No bill payments found.</Text>
      ) : (
        <FlatList
          data={bills}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          showsVerticalScrollIndicator={false}
        />
      )}
    </Box>
  );
};

export default BillHistoryScreen; 