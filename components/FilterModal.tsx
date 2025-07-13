import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, TouchableOpacity } from 'react-native';
import { 
  Text, 
  Button, 
  Box, 
  VStack, 
  HStack, 
  Heading, 
  Divider, 
  Icon,
  Slider,
  Radio,
  Checkbox,
  CloseIcon,
  ScrollView,
  Badge
} from 'native-base';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import { formatCurrency, formatDate } from '../utils/formatters';
import { TransactionFilter, TransactionType, TransactionStatus } from '../types';

export interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filter: TransactionFilter) => void;
  initialFilter?: TransactionFilter;
  maxAmount?: number;
  testID?: string;
}

const DEFAULT_FILTER: TransactionFilter = {
  dateRange: {
    startDate: new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString(),
    endDate: new Date().toISOString()
  },
  types: [],
  statuses: [],
  amountRange: {
    min: 0,
    max: 1000
  },
  search: '',
  categories: []
};

const CATEGORIES = [
  { id: 'food', label: 'Food & Drinks', icon: 'fast-food-outline' },
  { id: 'shopping', label: 'Shopping', icon: 'cart-outline' },
  { id: 'transport', label: 'Transportation', icon: 'car-outline' },
  { id: 'bills', label: 'Bills & Utilities', icon: 'receipt-outline' },
  { id: 'entertainment', label: 'Entertainment', icon: 'film-outline' },
  { id: 'transfer', label: 'Transfer', icon: 'swap-horizontal-outline' },
  { id: 'topup', label: 'Top Up', icon: 'add-circle-outline' },
  { id: 'withdraw', label: 'Withdraw', icon: 'cash-outline' },
  { id: 'other', label: 'Other', icon: 'ellipsis-horizontal-circle-outline' },
];

export const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
  initialFilter,
  maxAmount = 10000,
  testID = 'filter-modal'
}) => {
  const [filter, setFilter] = useState<TransactionFilter>(
    initialFilter || DEFAULT_FILTER
  );
  
  // Parse ISO string dates into Date objects for the date picker
  const [startDate, setStartDate] = useState<Date>(
    new Date(filter.dateRange?.startDate || new Date().toISOString())
  );
  const [endDate, setEndDate] = useState<Date>(
    new Date(filter.dateRange?.endDate || new Date().toISOString())
  );
  
  // Track which date picker is currently active
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  
  // Reset filter when modal opens with initialFilter
  useEffect(() => {
    if (isOpen && initialFilter) {
      setFilter(initialFilter);
      setStartDate(new Date(initialFilter.dateRange?.startDate || new Date().toISOString()));
      setEndDate(new Date(initialFilter.dateRange?.endDate || new Date().toISOString()));
    }
  }, [isOpen, initialFilter]);
  
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      setFilter(prev => ({
        ...prev,
        dateRange: {
          startDate: selectedDate.toISOString(),
          endDate: prev.dateRange?.endDate || selectedDate.toISOString()
        }
      }));
    }
  };
  
  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
      setFilter(prev => ({
        ...prev,
        dateRange: {
          startDate: prev.dateRange?.startDate || selectedDate.toISOString(),
          endDate: selectedDate.toISOString()
        }
      }));
    }
  };
  
  const handleTypeToggle = (type: TransactionType) => {
    setFilter(prev => {
      const types = [...(prev.types || [])];
      const index = types.indexOf(type);
      
      if (index >= 0) {
        types.splice(index, 1);
      } else {
        types.push(type);
      }
      
      return {
        ...prev,
        types
      };
    });
  };
  
  const handleStatusToggle = (status: TransactionStatus) => {
    setFilter(prev => {
      const statuses = [...(prev.statuses || [])];
      const index = statuses.indexOf(status);
      
      if (index >= 0) {
        statuses.splice(index, 1);
      } else {
        statuses.push(status);
      }
      
      return {
        ...prev,
        statuses
      };
    });
  };
  
  const handleCategoryToggle = (category: string) => {
    setFilter(prev => {
      const categories = [...(prev.categories || [])];
      const index = categories.indexOf(category);
      
      if (index >= 0) {
        categories.splice(index, 1);
      } else {
        categories.push(category);
      }
      
      return {
        ...prev,
        categories
      };
    });
  };
  

  
  const handleReset = () => {
    setFilter(DEFAULT_FILTER);
    setStartDate(new Date(DEFAULT_FILTER.dateRange?.startDate || new Date().toISOString()));
    setEndDate(new Date(DEFAULT_FILTER.dateRange?.endDate || new Date().toISOString()));
  };
  
  const handleApply = () => {
    onApply(filter);
    onClose();
  };
  
  return (
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
      testID={testID}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Box p={4} height="100%">
            <HStack justifyContent="space-between" alignItems="center" mb={4}>
              <Heading size="md">Filter Transactions</Heading>
              <TouchableOpacity onPress={onClose} testID={`${testID}-close-button`}>
                <CloseIcon size="sm" />
              </TouchableOpacity>
            </HStack>
            
            <Divider mb={4} />
            
            <ScrollView showsVerticalScrollIndicator={false}>
              <VStack space={6}>
                {/* Date Range */}
                <Box>
                  <Heading size="sm" mb={2}>Date Range</Heading>
                  <HStack space={4} justifyContent="space-between">
                    <Button 
                      flex={1}
                      variant="outline"
                      onPress={() => setShowStartDatePicker(true)}
                      testID={`${testID}-start-date-button`}
                    >
                      {formatDate(startDate, 'short')}
                    </Button>
                    <Text alignSelf="center">to</Text>
                    <Button 
                      flex={1}
                      variant="outline"
                      onPress={() => setShowEndDatePicker(true)}
                      testID={`${testID}-end-date-button`}
                    >
                      {formatDate(endDate, 'short')}
                    </Button>
                  </HStack>
                  
                  {showStartDatePicker && (
                    <DateTimePicker
                      value={startDate}
                      mode="date"
                      display="default"
                      onChange={handleStartDateChange}
                      maximumDate={endDate}
                    />
                  )}
                  
                  {showEndDatePicker && (
                    <DateTimePicker
                      value={endDate}
                      mode="date"
                      display="default"
                      onChange={handleEndDateChange}
                      minimumDate={startDate}
                      maximumDate={new Date()}
                    />
                  )}
                </Box>
                
                {/* Transaction Types */}
                <Box>
                  <Heading size="sm" mb={2}>Transaction Type</Heading>
                  <VStack space={2}>
                    <Checkbox
                      value="payment"
                      isChecked={filter.types?.includes('payment')}
                      onChange={() => handleTypeToggle('payment')}
                      testID={`${testID}-type-payment`}
                    >
                      Payment
                    </Checkbox>
                    <Checkbox
                      value="deposit"
                      isChecked={filter.types?.includes('deposit')}
                      onChange={() => handleTypeToggle('deposit')}
                      testID={`${testID}-type-deposit`}
                    >
                      Deposit
                    </Checkbox>
                    <Checkbox
                      value="withdrawal"
                      isChecked={filter.types?.includes('withdrawal')}
                      onChange={() => handleTypeToggle('withdrawal')}
                      testID={`${testID}-type-withdrawal`}
                    >
                      Withdrawal
                    </Checkbox>
                    <Checkbox
                      value="transfer"
                      isChecked={filter.types?.includes('transfer')}
                      onChange={() => handleTypeToggle('transfer')}
                      testID={`${testID}-type-transfer`}
                    >
                      Transfer
                    </Checkbox>
                    <Checkbox
                      value="bill_payment"
                      isChecked={filter.types?.includes('bill_payment')}
                      onChange={() => handleTypeToggle('bill_payment')}
                      testID={`${testID}-type-bill-payment`}
                    >
                      Bill Payment
                    </Checkbox>
                  </VStack>
                </Box>
                
                {/* Status */}
                <Box>
                  <Heading size="sm" mb={2}>Status</Heading>
                  <VStack space={2}>
                    <Checkbox
                      value="completed"
                      isChecked={filter.statuses?.includes('completed')}
                      onChange={() => handleStatusToggle('completed')}
                      testID={`${testID}-status-completed`}
                    >
                      Completed
                    </Checkbox>
                    <Checkbox
                      value="pending"
                      isChecked={filter.statuses?.includes('pending')}
                      onChange={() => handleStatusToggle('pending')}
                      testID={`${testID}-status-pending`}
                    >
                      Pending
                    </Checkbox>
                    <Checkbox
                      value="failed"
                      isChecked={filter.statuses?.includes('failed')}
                      onChange={() => handleStatusToggle('failed')}
                      testID={`${testID}-status-failed`}
                    >
                      Failed
                    </Checkbox>
                  </VStack>
                </Box>
                
                {/* Categories */}
                <Box>
                  <Heading size="sm" mb={2}>Categories</Heading>
                  <HStack flexWrap="wrap" space={2}>
                    {CATEGORIES.map(category => (
                      <TouchableOpacity 
                        key={category.id} 
                        onPress={() => handleCategoryToggle(category.id)}
                        testID={`${testID}-category-${category.id}`}
                      >
                        <Badge 
                          colorScheme={filter.categories?.includes(category.id) ? "primary" : "gray"}
                          variant={filter.categories?.includes(category.id) ? "solid" : "outline"}
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
                
                {/* Amount Range */}
                <Box>
                  <Heading size="sm" mb={2}>Amount Range</Heading>
                  <VStack space={4}>
                    <Box>
                      <Text fontSize="sm" mb={2}>Minimum Amount</Text>
                      <Slider
                        minValue={0}
                        maxValue={maxAmount}
                        step={100}
                        value={filter.amountRange?.min || 0}
                        onChange={(value) => setFilter(prev => ({
                          ...prev,
                          amountRange: {
                            min: value,
                            max: prev.amountRange?.max || maxAmount
                          }
                        }))}
                        testID={`${testID}-min-amount-slider`}
                      >
                        <Slider.Track>
                          <Slider.FilledTrack />
                        </Slider.Track>
                        <Slider.Thumb />
                      </Slider>
                      <Text fontSize="sm" mt={1}>
                        {formatCurrency(filter.amountRange?.min || 0, 'USD')}
                      </Text>
                    </Box>
                    
                    <Box>
                      <Text fontSize="sm" mb={2}>Maximum Amount</Text>
                      <Slider
                        minValue={0}
                        maxValue={maxAmount}
                        step={100}
                        value={filter.amountRange?.max || maxAmount}
                        onChange={(value) => setFilter(prev => ({
                          ...prev,
                          amountRange: {
                            min: prev.amountRange?.min || 0,
                            max: value
                          }
                        }))}
                        testID={`${testID}-max-amount-slider`}
                      >
                        <Slider.Track>
                          <Slider.FilledTrack />
                        </Slider.Track>
                        <Slider.Thumb />
                      </Slider>
                      <Text fontSize="sm" mt={1}>
                        {formatCurrency(filter.amountRange?.max || maxAmount, 'USD')}
                      </Text>
                    </Box>
                  </VStack>
                </Box>
              </VStack>
            </ScrollView>
            
            <Divider my={4} />
            
            <HStack space={4} justifyContent="space-between">
              <Button
                flex={1}
                variant="outline"
                onPress={handleReset}
                testID={`${testID}-reset-button`}
              >
                Reset
              </Button>
              <Button
                flex={1}
                onPress={handleApply}
                testID={`${testID}-apply-button`}
              >
                Apply
              </Button>
            </HStack>
          </Box>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: '90%',
  },
});

export default FilterModal; 