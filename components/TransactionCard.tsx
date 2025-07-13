import React from 'react';
import { Box, Text, VStack, HStack, Icon } from 'native-base';
import { TouchableOpacity } from 'react-native';
import { formatCurrency } from '../utils/formatters';

export type TransactionType = 'send' | 'receive' | 'qr_payment' | 'bill_payment' | 'topup';
export type TransactionStatus = 'completed' | 'pending' | 'failed';

interface TransactionCardProps {
  type: TransactionType;
  status: TransactionStatus;
  amount: string;
  currency: string;
  recipient: string;
  date: string;
  description?: string;
  testID?: string;
  onPress?: () => void;
}

const TransactionCard: React.FC<TransactionCardProps> = ({
  type,
  status,
  amount,
  currency,
  recipient,
  date,
  description,
  testID,
  onPress
}) => {
  const isIncome = type === 'receive' || type === 'topup';
  
  const getIconName = () => {
    switch (type) {
      case 'send': return 'arrow-up-circle-outline';
      case 'receive': return 'arrow-down-circle-outline';
      case 'qr_payment': return 'qr-code-outline';
      case 'bill_payment': return 'receipt-outline';
      case 'topup': return 'add-circle-outline';
      default: return 'help-circle-outline';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'completed': return 'success.500';
      case 'pending': return 'warning.500';
      case 'failed': return 'error.500';
      default: return 'gray.500';
    }
  };

  const getAmountPrefix = () => {
    return isIncome ? '+' : '-';
  };

  return (
    <TouchableOpacity onPress={onPress} testID={testID}>
      <Box 
        bg="white" 
        p={3} 
        borderRadius="md" 
        mb={2} 
        shadow={1}
      >
        <HStack justifyContent="space-between" alignItems="center">
          <HStack space={2} alignItems="center" flex={1}>
            <Icon 
              name={getIconName()} 
              size="sm" 
              color="gray.500"
              testID="transaction-card-icon"
            />
            <VStack flex={1}>
              <Text fontWeight="bold">{recipient}</Text>
              <Text color="gray.500" fontSize="xs">
                {`transaction.type.${type}`}
              </Text>
              {description && <Text color="gray.500" fontSize="xs">{description}</Text>}
              <Text color="gray.500" fontSize="xs">{date}</Text>
            </VStack>
          </HStack>
          <VStack alignItems="flex-end">
            <Text 
              color={isIncome ? 'green.500' : 'red.500'} 
              fontWeight="bold"
              testID="transaction-card-amount"
            >
              {getAmountPrefix()}{currency} {amount}
            </Text>
            <Text 
              color={getStatusColor()} 
              fontSize="xs"
              testID="transaction-card-status"
            >
              {`transaction.status.${status}`}
            </Text>
          </VStack>
        </HStack>
      </Box>
    </TouchableOpacity>
  );
};

export default TransactionCard; 