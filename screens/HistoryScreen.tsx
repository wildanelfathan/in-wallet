import React, { useState, useEffect, useCallback } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { 
  Box, 
  Text, 
  Heading, 
  HStack, 
  VStack, 
  Input, 
  Icon, 
  Divider, 
  Badge,
  useToast
} from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import NetInfo from '@react-native-community/netinfo';
import { debounce } from 'lodash';

// Import components
import TransactionList from '../components/TransactionList';
import FilterModal from '../components/FilterModal';
import { EmptyState } from '../components/EmptyState';
import { ErrorState } from '../components/ErrorState';
import { OfflineState } from '../components/OfflineState';

// Import services and utilities
import { transactionService } from '../services/transactionService';
import { logEvent } from '../services/analyticsService';
import { Transaction, TransactionFilter } from '../types';
import { authService } from '../services/supabaseService';

const HistoryScreen = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [filter, setFilter] = useState<TransactionFilter>({
    dateRange: {
      startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
      endDate: new Date().toISOString()
    },
    types: [],
    statuses: [],
    amountRange: {
      min: 0,
      max: 10000
    },
    search: ''
  });
  const [refreshing, setRefreshing] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategories, setActiveCategories] = useState<string[]>([]);

  // Check network status
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOffline(!state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  // Get current user
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          setUserId(user.id);
        }
      } catch (err) {
        console.error('Failed to get current user:', err);
      }
    };

    getCurrentUser();
  }, []);

  // Fetch transactions when userId is available
  useEffect(() => {
    if (userId) {
      fetchTransactions();
    }
  }, [userId, filter, activeFilter]);

  // Log screen view
  useEffect(() => {
    logEvent('screen_view', {
      screen_name: 'History',
      screen_class: 'HistoryScreen',
    });
  }, []);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((text: string) => {
      setFilter(prev => ({ ...prev, search: text }));
    }, 500),
    []
  );

  const handleSearchChange = (text: string) => {
    setSearchQuery(text);
    debouncedSearch(text);
  };

  const fetchTransactions = async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Apply filter based on active tab
      let currentFilter = { ...filter };
      
      if (activeFilter !== 'all') {
        currentFilter.types = [activeFilter as any];
      }
      
      // Apply category filters if any
      if (activeCategories.length > 0) {
        currentFilter.categories = activeCategories;
      }
      
      const data = await transactionService.fetchTransactions(currentFilter);
      setTransactions(data);
      
      // Log analytics event
      logEvent('transactions_loaded', {
        count: data.length,
        filter_applied: Object.keys(currentFilter).length > 0,
      });
    } catch (err) {
      setError(err as Error);
      
      // Log error event
      logEvent('error', {
        error_type: 'transaction_fetch_failed',
        error_message: (err as Error).message,
      });
      
      toast.show({
        title: "Error loading transactions",
        variant: "solid",
        colorScheme: "error",
        description: (err as Error).message,
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchTransactions();
  };

  const handleFilterChange = (newFilter: TransactionFilter) => {
    setFilter(newFilter);
    setFilterModalVisible(false);
    
    // Log filter event
    logEvent('filter_applied', {
      filter_type: JSON.stringify(newFilter),
    });
  };

  const handleTabChange = (tabName: string) => {
    setActiveFilter(tabName);
    
    // Log tab change event
    logEvent('tab_change', {
      tab_name: tabName,
    });
  };

  const handleCategoryToggle = (category: string) => {
    setActiveCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const handleTransactionPress = (transaction: Transaction) => {
    // Navigate to transaction detail screen
    console.log('Transaction pressed:', transaction.id);
    
    // Log event
    logEvent('transaction_selected', {
      transaction_id: transaction.id,
      transaction_type: transaction.type,
    });
  };

  const renderFilterTabs = () => {
    const tabs = [
      { id: 'all', label: t('history.all') },
      { id: 'payment', label: t('history.sent') },
      { id: 'deposit', label: t('history.received') },
      { id: 'transfer', label: t('history.transfers') },
      { id: 'bill_payment', label: t('history.bills') },
    ];

    return (
      <HStack space={2} mb={4} px={4} overflow="scroll">
        {tabs.map((tab) => (
          <TouchableOpacity key={tab.id} onPress={() => handleTabChange(tab.id)}>
            <Box 
              px={4} 
              py={2} 
              rounded="full"
              bg={activeFilter === tab.id ? 'primary.500' : 'gray.100'}
            >
              <Text 
                color={activeFilter === tab.id ? 'white' : 'gray.600'}
                fontWeight={activeFilter === tab.id ? 'bold' : 'normal'}
              >
                {tab.label}
              </Text>
            </Box>
          </TouchableOpacity>
        ))}
      </HStack>
    );
  };

  const renderCategoryFilters = () => {
    const categories = [
      { id: 'food', label: t('categories.food'), icon: 'fast-food-outline' },
      { id: 'shopping', label: t('categories.shopping'), icon: 'cart-outline' },
      { id: 'transport', label: t('categories.transport'), icon: 'car-outline' },
      { id: 'bills', label: t('categories.bills'), icon: 'receipt-outline' },
      { id: 'entertainment', label: t('categories.entertainment'), icon: 'film-outline' },
    ];

    return (
      <Box px={4} mb={4}>
        <HStack space={2} flexWrap="wrap">
          {categories.map((category) => (
            <TouchableOpacity key={category.id} onPress={() => handleCategoryToggle(category.id)}>
              <Badge 
                colorScheme={activeCategories.includes(category.id) ? "primary" : "gray"}
                variant={activeCategories.includes(category.id) ? "solid" : "outline"}
                rounded="full"
                mb={2}
              >
                <HStack space={1} alignItems="center">
                  <Icon as={Ionicons} name={category.icon} size="xs" />
                  <Text fontSize="xs">{category.label}</Text>
                </HStack>
              </Badge>
            </TouchableOpacity>
          ))}
        </HStack>
      </Box>
    );
  };

  // Render different states
  if (isOffline) {
    return <OfflineState onRetry={fetchTransactions} />;
  }

  if (error && !refreshing && transactions.length === 0) {
    return <ErrorState error={error} onRetry={fetchTransactions} />;
  }

  return (
    <Box flex={1} safeArea bg="white">
      <VStack space={2} pb={2}>
        <HStack px={4} py={4} justifyContent="space-between" alignItems="center" bg="white">
          <Heading size="lg">{t('history.title')}</Heading>
          <TouchableOpacity onPress={() => setFilterModalVisible(true)}>
            <Icon 
              as={Ionicons} 
              name="options-outline" 
              size="md" 
              color="gray.600" 
            />
          </TouchableOpacity>
        </HStack>
        
        {/* Search Bar */}
        <Box px={4} mb={2}>
          <Input
            placeholder={t('history.search')}
            value={searchQuery}
            onChangeText={handleSearchChange}
            width="100%"
            borderRadius="full"
            py={2}
            px={4}
            InputLeftElement={
              <Icon
                as={<Ionicons name="search" />}
                size={5}
                ml={2}
                color="gray.400"
              />
            }
            InputRightElement={
              searchQuery ? (
                <TouchableOpacity onPress={() => {
                  setSearchQuery('');
                  setFilter(prev => ({ ...prev, search: '' }));
                }}>
                  <Icon
                    as={<Ionicons name="close-circle" />}
                    size={5}
                    mr={2}
                    color="gray.400"
                  />
                </TouchableOpacity>
              ) : undefined
            }
          />
        </Box>
        
        {renderFilterTabs()}
        {renderCategoryFilters()}
      </VStack>
      
      <Divider />
      
      <Box flex={1}>
        <TransactionList 
          transactions={transactions}
          onTransactionPress={handleTransactionPress}
          refreshing={refreshing}
          onRefresh={handleRefresh}
          isLoading={loading && !refreshing}
          ListEmptyComponent={
            <EmptyState 
              title={t('history.empty.title')}
              message={t('history.empty.message')}
              icon="receipt-outline"
            />
          }
          testID="history-transaction-list"
        />
      </Box>
      
      <FilterModal 
        isOpen={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        onApply={handleFilterChange}
        initialFilter={filter}
      />
    </Box>
  );
};

export default HistoryScreen; 