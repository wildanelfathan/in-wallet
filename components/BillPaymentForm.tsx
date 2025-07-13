import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useWallet } from '../hooks/useWallet';
import { billService } from '../services/billService';
import { BillProvider, BillPaymentRequest } from '../types/bills';
import { WalletCard } from './WalletCard';
import { useTheme } from '../theme/ThemeProvider';

interface BillPaymentFormProps {
  providerId: string;
  onSuccess: (result: { transactionId: string; receiptUrl: string }) => void;
  onError: (error: Error | string) => void;
}

export const BillPaymentForm: React.FC<BillPaymentFormProps> = ({
  providerId,
  onSuccess,
  onError,
}) => {
  const theme = useTheme();
  const { activeWallet, refreshBalance } = useWallet();
  const [provider, setProvider] = useState<BillProvider | null>(null);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});
  const [amount, setAmount] = useState('');

  useEffect(() => {
    loadProvider();
  }, [providerId]);

  const loadProvider = async () => {
    try {
      const providerData = await billService.getProviderById(providerId);
      setProvider(providerData);
    } catch (error) {
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError('Failed to load provider');
      }
    }
  };

  const handleInputChange = (key: string, value: string) => {
    setFormValues(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    if (!provider || !activeWallet) return false;

    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Invalid amount');
      return false;
    }

    if (numAmount > activeWallet.balance) {
      Alert.alert('Error', 'Insufficient balance');
      return false;
    }

    // Validate required fields
    for (const field of provider.fields) {
      if (field.required && !formValues[field.key]) {
        Alert.alert('Error', `${field.label} is required`);
        return false;
      }

      if (field.validation) {
        const regex = new RegExp(field.validation);
        if (!regex.test(formValues[field.key])) {
          Alert.alert('Error', `Invalid ${field.label}`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !activeWallet || !provider) return;

    setLoading(true);
    try {
      const request: BillPaymentRequest = {
        userId: activeWallet.userId,
        providerId: provider.id,
        amount: parseFloat(amount),
        currency: activeWallet.currency,
        accountNumber: formValues.accountNumber || '',
        customerFields: formValues,
        walletId: activeWallet.id,
      };

      const result = await billService.processPayment(request);
      if (result.success && result.transactionId && result.receiptUrl) {
        await refreshBalance();
        onSuccess({
          transactionId: result.transactionId,
          receiptUrl: result.receiptUrl,
        });
      } else {
        onError(result.error || 'Payment failed');
      }
    } catch (error) {
      if (error instanceof Error) {
        onError(error.message);
      } else {
        onError('Payment failed');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!provider || !activeWallet) {
    return (
      <View style={styles.container}>
        <Text style={[styles.text, { color: theme.colors.text }]}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <WalletCard wallet={activeWallet} />
      
      <View style={styles.form}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Pay to {provider.name}
        </Text>

        {provider.fields.map((field) => (
          <View key={field.key} style={styles.inputContainer}>
            <Text style={[styles.label, { color: theme.colors.text }]}>
              {field.label}
              {field.required && <Text style={styles.required}> *</Text>}
            </Text>
            <TextInput
              style={[
                styles.input,
                { 
                  color: theme.colors.text,
                  borderColor: theme.colors.border,
                  backgroundColor: theme.colors.background,
                },
              ]}
              placeholder={field.placeholder}
              placeholderTextColor={theme.colors.textSecondary}
              value={formValues[field.key] || ''}
              onChangeText={(value) => handleInputChange(field.key, value)}
              keyboardType={field.type === 'number' ? 'numeric' : 'default'}
            />
          </View>
        ))}

        <View style={styles.inputContainer}>
          <Text style={[styles.label, { color: theme.colors.text }]}>
            Amount <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={[
              styles.input,
              { 
                color: theme.colors.text,
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.background,
              },
            ]}
            placeholder="Enter amount"
            placeholderTextColor={theme.colors.textSecondary}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.colors.primary },
            loading && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.buttonText}>Pay Now</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 24,
  },
  text: {
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  required: {
    color: '#FF3B30',
  },
  input: {
    height: 48,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 48,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
}); 