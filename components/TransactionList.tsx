import React from 'react';
import { FlatList, RefreshControl } from 'react-native';
import { Box, Text, VStack } from 'native-base';
import TransactionCard, { TransactionType, TransactionStatus } from './TransactionCard';
import { Transaction } from '../types';

interface TransactionListProps {
  transactions: Transaction[];
  onRefresh?: () => void;
  refreshing?: boolean;
  onTransactionPress?: (transaction: Transaction) => void;
  limit?: number;
  testID?: string;
  isLoading?: boolean;
  ListEmptyComponent?: React.ReactElement;
}

const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onRefresh,
  refreshing = false,
  onTransactionPress,
  limit,
  testID = 'transaction-list',
  isLoading = false,
  ListEmptyComponent
}) => {
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  const renderEmptyState = () => {
    if (ListEmptyComponent) {
      return ListEmptyComponent;
    }
    return (
      <VStack alignItems="center" justifyContent="center" p={4}>
        <Text color="gray.500">No transactions found</Text>
      </VStack>
    );
  };

  const renderTransaction = ({ item }: { item: Transaction }) => {
    // Map the transaction type to the expected format
    const mapTransactionType = (type: string): TransactionType => {
      switch (type) {
        case 'payment': return 'send';
        case 'deposit': return 'receive';
        case 'withdrawal': return 'send';
        case 'transfer': return 'send';
        case 'bill_payment': return 'bill_payment';
        default: return 'send';
      }
    };

    return (
      <TransactionCard
        type={mapTransactionType(item.type)}
        status={item.status}
        amount={item.amount.toString()}
        currency={item.currency}
        recipient={item.recipient?.name || 'Unknown'}
        date={item.date}
        description={item.description}
        onPress={() => onTransactionPress && onTransactionPress(item)}
      />
    );
  };

  return (
    <Box flex={1} testID={testID}>
      <FlatList
        data={displayTransactions}
        renderItem={renderTransaction}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderEmptyState}
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          ) : undefined
        }
        contentContainerStyle={{ 
          flexGrow: 1,
          paddingHorizontal: 16,
          paddingVertical: 8 
        }}
      />
    </Box>
  );
};

export default TransactionList; 