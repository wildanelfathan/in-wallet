import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Share,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { billService } from '../services/billService';
import { useTheme } from '../theme/ThemeProvider';

type ReceiptScreenParams = {
  transactionId: string;
  receiptUrl: string;
};

export const ReceiptScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();
  const { transactionId, receiptUrl } = route.params as ReceiptScreenParams;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<any>(null);

  useEffect(() => {
    loadReceipt();
  }, [transactionId]);

  const loadReceipt = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await billService.getPaymentHistory(transactionId);
      const payment = data.find(p => p.id === transactionId);
      if (!payment) {
        throw new Error('Receipt not found');
      }
      setReceipt(payment);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to load receipt');
    } finally {
      setLoading(false);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        url: receiptUrl,
        message: `Payment receipt for ${receipt?.provider?.name || 'bill payment'}`,
      });
    } catch (error) {
      console.error('Error sharing receipt:', error);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.error, { color: theme.colors.error }]}>{error}</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={loadReceipt}
        >
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!receipt) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={[styles.error, { color: theme.colors.error }]}>
          Receipt not found
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView style={styles.content}>
        <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            Payment Receipt
          </Text>

          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Provider
            </Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>
              {receipt.bill_providers.name}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Amount
            </Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>
              {receipt.amount} {receipt.currency}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Account Number
            </Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>
              {receipt.account_number}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Date
            </Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>
              {new Date(receipt.created_at).toLocaleString()}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Status
            </Text>
            <Text
              style={[
                styles.value,
                {
                  color:
                    receipt.status === 'completed'
                      ? theme.colors.success
                      : theme.colors.error,
                },
              ]}
            >
              {receipt.status.charAt(0).toUpperCase() + receipt.status.slice(1)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
              Reference
            </Text>
            <Text style={[styles.value, { color: theme.colors.text }]}>
              {receipt.provider_reference}
            </Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={handleShare}
        >
          <Text style={styles.buttonText}>Share Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: 'transparent', marginTop: 8 },
          ]}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.buttonText, { color: theme.colors.primary }]}>
            Done
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  card: {
    margin: 16,
    padding: 16,
    borderRadius: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: '500',
  },
  error: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  footer: {
    padding: 16,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 