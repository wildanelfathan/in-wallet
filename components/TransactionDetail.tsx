import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Share } from 'react-native';
import { Text, Avatar, Button, Icon, Divider, Box } from 'native-base';
import { formatCurrency, formatDate } from '../utils/formatters';
import { Transaction } from '../types';
import { generateReceipt } from '../utils/receipt';

export interface TransactionDetailProps {
  transaction: Transaction;
  onClose?: () => void;
  onDownload?: () => void;
  onShare?: () => void;
  testID?: string;
}

export const TransactionDetail: React.FC<TransactionDetailProps> = ({
  transaction,
  onClose,
  onDownload,
  onShare,
  testID = 'transaction-detail',
}) => {
  const {
    id,
    type,
    status,
    amount,
    currency,
    date,
    description,
    recipient,
    sender,
    reference,
    category,
    metadata
  } = transaction;

  // Determine if this is an outgoing transaction
  const isOutgoing = type === 'payment' || type === 'withdrawal';
  
  // Determine which party to display (recipient for outgoing, sender for incoming)
  const displayParty = isOutgoing ? recipient : sender;
  
  // Set status color based on transaction status
  const statusColor = 
    status === 'completed' ? 'green.500' :
    status === 'pending' ? 'orange.500' : 'red.500';
  
  // Format amount with + or - prefix
  const formattedAmount = `${isOutgoing ? '-' : '+'} ${formatCurrency(amount, currency)}`;

  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }
    
    try {
      const receiptData = {
        type: transaction.type as 'transfer' | 'bill_payment' | 'merchant_payment',
        amount: transaction.amount,
        currency: transaction.currency,
        timestamp: transaction.date,
        fromAccount: transaction.sender?.accountNumber,
        toAccount: transaction.recipient?.accountNumber,
        provider: transaction.metadata?.provider_name,
        accountNumber: transaction.metadata?.account_number,
        merchantName: transaction.metadata?.notes,
      };
      const receiptText = await generateReceipt(receiptData);
      await Share.share({
        message: receiptText,
        title: `Transaction Receipt - ${id}`,
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      testID={testID}
    >
      <Box style={styles.header}>
        <Avatar
          size="lg"
          bg={isOutgoing ? 'red.100' : 'green.100'}
          testID={`${testID}-avatar`}
        >
          {displayParty && displayParty.name ? displayParty.name.charAt(0) : '?'}
        </Avatar>
        
        <Text fontSize="xl" fontWeight="bold" mt={2}>
          {displayParty ? displayParty.name : 'Unknown'}
        </Text>
        
        <Text
          fontSize="2xl"
          fontWeight="bold"
          color={isOutgoing ? 'red.500' : 'green.500'}
          mt={2}
          testID={`${testID}-amount`}
        >
          {formattedAmount}
        </Text>
        
        <Box 
          px={4} 
          py={1} 
          bg={statusColor} 
          borderRadius="full" 
          mt={2}
        >
          <Text color="white" fontWeight="medium">
            {status === 'completed' ? 'COMPLETED' : 
             status === 'pending' ? 'PENDING' : 'FAILED'}
          </Text>
        </Box>
      </Box>
      
      <Divider my={4} />
      
      <Box style={styles.detailsSection}>
        <DetailRow label="Date" value={formatDate(date, 'long')} />
        <DetailRow label="Transaction ID" value={id} />
        {reference && <DetailRow label="Reference" value={reference} />}
        {category && <DetailRow label="Category" value={category} />}
        {description && <DetailRow label="Description" value={description} />}
        
        {displayParty && displayParty.accountNumber && (
          <DetailRow 
            label={isOutgoing ? "Recipient Account" : "Sender Account"} 
            value={displayParty.accountNumber} 
          />
        )}
        
        {metadata && metadata.fee && metadata.fee > 0 && (
          <DetailRow 
            label="Fee" 
            value={formatCurrency(metadata.fee, currency)} 
          />
        )}
        
        {metadata && metadata.exchangeRate && metadata.exchangeRate !== 1 && (
          <DetailRow 
            label="Exchange Rate" 
            value={metadata.exchangeRate.toString()} 
          />
        )}
        
        {metadata && metadata.notes && (
          <DetailRow 
            label="Notes" 
            value={metadata.notes} 
          />
        )}
      </Box>
      
      <Box style={styles.actionButtons}>
        <Button 
          leftIcon={<Icon name="share" />}
          onPress={handleShare}
          testID={`${testID}-share-button`}
          mr={2}
        >
          Share
        </Button>
        
        {onDownload && (
          <Button 
            leftIcon={<Icon name="download" />}
            onPress={onDownload}
            testID={`${testID}-download-button`}
            variant="outline"
          >
            Download
          </Button>
        )}
      </Box>
    </ScrollView>
  );
};

const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Box style={styles.detailRow}>
    <Text color="gray.500" width="40%">{label}</Text>
    <Text flex={1} fontWeight="medium">{value}</Text>
  </Box>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  detailsSection: {
    marginBottom: 24,
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
});

export default TransactionDetail; 