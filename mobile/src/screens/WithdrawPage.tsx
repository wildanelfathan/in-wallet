import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { usePrivy } from '@privy-io/react-auth';
import { Ionicons } from '@expo/vector-icons';

// Types
interface DestinationAccount {
  id: string;
  type: 'bank_account' | 'ewallet';
  name: string;
  accountNumber: string;
  routingNumber?: string;
  bankName?: string;
  ewalletType?: 'paypal' | 'venmo' | 'cashapp' | 'zelle';
  isVerified: boolean;
  isActive: boolean;
}

interface WithdrawRequest {
  amount: string;
  destinationAccountId: string;
  currency: string;
  note?: string;
}

interface WithdrawResponse {
  success: boolean;
  transactionId?: string;
  estimatedArrival?: string;
  fee?: string;
  error?: string;
}

interface WalletBalance {
  available: string;
  pending: string;
  currency: string;
}

const WithdrawPage: React.FC = () => {
  const { user, authenticated } = usePrivy();

  // State
  const [amount, setAmount] = useState('');
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [note, setNote] = useState('');
  const [destinationAccounts, setDestinationAccounts] = useState<DestinationAccount[]>([]);
  const [walletBalance, setWalletBalance] = useState<WalletBalance>({
    available: '0.00',
    pending: '0.00',
    currency: 'USD',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [withdrawResult, setWithdrawResult] = useState<WithdrawResponse | null>(null);

  // Form validation
  const [errors, setErrors] = useState<{
    amount?: string;
    destinationAccount?: string;
  }>({});

  // Get user's wallet address
  const walletAddress = user?.wallet?.address || '';

  // Fetch destination accounts and wallet balance
  useEffect(() => {
    if (authenticated && walletAddress) {
      fetchDestinationAccounts();
      fetchWalletBalance();
    }
  }, [authenticated, walletAddress]);

  // Fetch destination accounts
  const fetchDestinationAccounts = useCallback(async () => {
    try {
      setIsLoadingAccounts(true);
      const response = await fetch('/api/wallet/accounts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`, // Replace with actual auth token
        },
      });

      if (response.ok) {
        const data = await response.json();
        setDestinationAccounts(data.accounts || []);
      } else {
        throw new Error('Failed to fetch destination accounts');
      }
    } catch (err) {
      console.error('Error fetching destination accounts:', err);
      setError('Failed to load destination accounts. Please try again.');
    } finally {
      setIsLoadingAccounts(false);
    }
  }, [user?.id]);

  // Fetch wallet balance
  const fetchWalletBalance = useCallback(async () => {
    try {
      const response = await fetch('/api/wallet/balance', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`, // Replace with actual auth token
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWalletBalance(data.balance || {
          available: '0.00',
          pending: '0.00',
          currency: 'USD',
        });
      } else {
        throw new Error('Failed to fetch wallet balance');
      }
    } catch (err) {
      console.error('Error fetching wallet balance:', err);
      // Don't show error for balance fetch as it's not critical
    }
  }, [user?.id]);

  // Validate form
  const validateForm = useCallback((): boolean => {
    const newErrors: typeof errors = {};

    // Validate amount
    if (!amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else {
      const amountNum = parseFloat(amount);
      if (isNaN(amountNum) || amountNum <= 0) {
        newErrors.amount = 'Amount must be a positive number';
      } else if (amountNum > parseFloat(walletBalance.available)) {
        newErrors.amount = 'Amount exceeds available balance';
      } else if (amountNum < 1) {
        newErrors.amount = 'Minimum withdrawal amount is $1.00';
      }
    }

    // Validate destination account
    if (!selectedAccountId) {
      newErrors.destinationAccount = 'Please select a destination account';
    } else {
      const selectedAccount = destinationAccounts.find(acc => acc.id === selectedAccountId);
      if (!selectedAccount?.isVerified) {
        newErrors.destinationAccount = 'Selected account is not verified';
      } else if (!selectedAccount?.isActive) {
        newErrors.destinationAccount = 'Selected account is not active';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [amount, selectedAccountId, walletBalance.available, destinationAccounts]);

  // Handle withdraw
  const handleWithdraw = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError(null);
    setWithdrawResult(null);

    try {
      const withdrawRequest: WithdrawRequest = {
        amount: amount.trim(),
        destinationAccountId: selectedAccountId,
        currency: walletBalance.currency,
        note: note.trim() || undefined,
      };

      const response = await fetch('/api/wallet/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.id}`, // Replace with actual auth token
        },
        body: JSON.stringify(withdrawRequest),
      });

      const data = await response.json();

      if (response.ok) {
        setWithdrawResult({
          success: true,
          transactionId: data.transactionId,
          estimatedArrival: data.estimatedArrival,
          fee: data.fee,
        });
        
        // Reset form
        setAmount('');
        setSelectedAccountId('');
        setNote('');
        
        // Refresh wallet balance
        await fetchWalletBalance();

        // Show success alert
        Alert.alert(
          'Withdrawal Successful! 🎉',
          `Your withdrawal of $${amount} has been processed.\n\nTransaction ID: ${data.transactionId}\nEstimated arrival: ${data.estimatedArrival || 'Within 1-3 business days'}`,
          [{ text: 'OK' }]
        );
      } else {
        throw new Error(data.error || 'Withdrawal failed');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
      setWithdrawResult({
        success: false,
        error: errorMessage,
      });

      Alert.alert(
        'Withdrawal Failed',
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [amount, selectedAccountId, note, walletBalance.currency, user?.id, validateForm, fetchWalletBalance]);

  // Format account display name
  const getAccountDisplayName = useCallback((account: DestinationAccount): string => {
    if (account.type === 'bank_account') {
      return `${account.bankName || 'Bank'} ****${account.accountNumber.slice(-4)}`;
    } else {
      return `${account.ewalletType?.toUpperCase() || 'eWallet'} - ${account.name}`;
    }
  }, []);

  // Handle quick amount buttons
  const handleQuickAmount = useCallback((percentage: number) => {
    const availableAmount = parseFloat(walletBalance.available);
    const quickAmount = (availableAmount * percentage / 100).toFixed(2);
    setAmount(quickAmount);
  }, [walletBalance.available]);

  if (!authenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notAuthenticatedContainer}>
          <Ionicons name="lock-closed" size={64} color="#666" />
          <Text style={styles.notAuthenticatedTitle}>Authentication Required</Text>
          <Text style={styles.notAuthenticatedText}>
            Please log in to access the withdrawal feature.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Withdraw Funds</Text>
            <Text style={styles.headerSubtitle}>Transfer money to your bank account or eWallet</Text>
          </View>

          {/* Wallet Balance */}
          <View style={styles.balanceContainer}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>
              ${walletBalance.available} {walletBalance.currency}
            </Text>
            {parseFloat(walletBalance.pending) > 0 && (
              <Text style={styles.pendingAmount}>
                ${walletBalance.pending} pending
              </Text>
            )}
          </View>

          {/* Withdraw Form */}
          <View style={styles.formContainer}>
            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Withdrawal Amount</Text>
              <View style={styles.amountInputContainer}>
                <Text style={styles.currencySymbol}>$</Text>
                <TextInput
                  style={[styles.amountInput, errors.amount && styles.inputError]}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  returnKeyType="done"
                  maxLength={10}
                />
              </View>
              {errors.amount && (
                <Text style={styles.errorText}>{errors.amount}</Text>
              )}
              
              {/* Quick Amount Buttons */}
              <View style={styles.quickAmountContainer}>
                <TouchableOpacity
                  style={styles.quickAmountButton}
                  onPress={() => handleQuickAmount(25)}
                >
                  <Text style={styles.quickAmountText}>25%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickAmountButton}
                  onPress={() => handleQuickAmount(50)}
                >
                  <Text style={styles.quickAmountText}>50%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickAmountButton}
                  onPress={() => handleQuickAmount(75)}
                >
                  <Text style={styles.quickAmountText}>75%</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.quickAmountButton}
                  onPress={() => handleQuickAmount(100)}
                >
                  <Text style={styles.quickAmountText}>Max</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Destination Account Selector */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Destination Account</Text>
              {isLoadingAccounts ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#676FFF" />
                  <Text style={styles.loadingText}>Loading accounts...</Text>
                </View>
              ) : (
                <>
                  <View style={[styles.pickerContainer, errors.destinationAccount && styles.inputError]}>
                    <Picker
                      selectedValue={selectedAccountId}
                      onValueChange={setSelectedAccountId}
                      style={styles.picker}
                    >
                      <Picker.Item label="Select destination account" value="" />
                      {destinationAccounts.map((account) => (
                        <Picker.Item
                          key={account.id}
                          label={getAccountDisplayName(account)}
                          value={account.id}
                          enabled={account.isVerified && account.isActive}
                        />
                      ))}
                    </Picker>
                  </View>
                  {errors.destinationAccount && (
                    <Text style={styles.errorText}>{errors.destinationAccount}</Text>
                  )}
                </>
              )}

              {/* Account Management */}
              {destinationAccounts.length === 0 && !isLoadingAccounts && (
                <View style={styles.noAccountsContainer}>
                  <Ionicons name="card-outline" size={32} color="#666" />
                  <Text style={styles.noAccountsText}>No destination accounts found</Text>
                  <TouchableOpacity style={styles.addAccountButton}>
                    <Text style={styles.addAccountButtonText}>Add Bank Account</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* Note (Optional) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Note (Optional)</Text>
              <TextInput
                style={styles.noteInput}
                value={note}
                onChangeText={setNote}
                placeholder="Add a note for this withdrawal"
                multiline
                numberOfLines={3}
                maxLength={200}
                returnKeyType="done"
              />
              <Text style={styles.charCount}>{note.length}/200</Text>
            </View>

            {/* Selected Account Details */}
            {selectedAccountId && (
              <View style={styles.selectedAccountContainer}>
                <Text style={styles.selectedAccountTitle}>Withdrawal Details</Text>
                {(() => {
                  const selectedAccount = destinationAccounts.find(acc => acc.id === selectedAccountId);
                  if (!selectedAccount) return null;
                  
                  return (
                    <View style={styles.selectedAccountDetails}>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Account:</Text>
                        <Text style={styles.detailValue}>{getAccountDisplayName(selectedAccount)}</Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Type:</Text>
                        <Text style={styles.detailValue}>
                          {selectedAccount.type === 'bank_account' ? 'Bank Account' : 'eWallet'}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Status:</Text>
                        <View style={styles.statusContainer}>
                          <Ionicons
                            name={selectedAccount.isVerified ? "checkmark-circle" : "warning"}
                            size={16}
                            color={selectedAccount.isVerified ? "#34C759" : "#FF9500"}
                          />
                          <Text style={[
                            styles.statusText,
                            { color: selectedAccount.isVerified ? "#34C759" : "#FF9500" }
                          ]}>
                            {selectedAccount.isVerified ? 'Verified' : 'Unverified'}
                          </Text>
                        </View>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Est. Arrival:</Text>
                        <Text style={styles.detailValue}>
                          {selectedAccount.type === 'bank_account' ? '1-3 business days' : 'Within 24 hours'}
                        </Text>
                      </View>
                    </View>
                  );
                })()}
              </View>
            )}

            {/* Error Display */}
            {error && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={20} color="#FF3B30" />
                <Text style={styles.errorMessage}>{error}</Text>
              </View>
            )}

            {/* Withdraw Button */}
            <TouchableOpacity
              style={[
                styles.withdrawButton,
                (isLoading || !amount || !selectedAccountId) && styles.withdrawButtonDisabled
              ]}
              onPress={handleWithdraw}
              disabled={isLoading || !amount || !selectedAccountId}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.withdrawButtonText}>
                  Withdraw ${amount || '0.00'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Disclaimer */}
            <View style={styles.disclaimerContainer}>
              <Text style={styles.disclaimerText}>
                • Withdrawals are processed within 1-3 business days for bank accounts
              </Text>
              <Text style={styles.disclaimerText}>
                • eWallet transfers are typically completed within 24 hours
              </Text>
              <Text style={styles.disclaimerText}>
                • Standard processing fees may apply
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  balanceContainer: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  pendingAmount: {
    fontSize: 14,
    color: '#FF9500',
  },
  formContainer: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  amountInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    marginTop: 4,
  },
  quickAmountContainer: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 8,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#676FFF',
  },
  pickerContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  picker: {
    height: 50,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 16,
    color: '#666',
  },
  noAccountsContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  noAccountsText: {
    fontSize: 16,
    color: '#666',
    marginVertical: 12,
  },
  addAccountButton: {
    backgroundColor: '#676FFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addAccountButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  noteInput: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  charCount: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
    marginTop: 4,
  },
  selectedAccountContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  selectedAccountTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  selectedAccountDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FF3B30',
    padding: 16,
    marginBottom: 20,
  },
  errorMessage: {
    fontSize: 14,
    color: '#FF3B30',
    marginLeft: 8,
    flex: 1,
  },
  withdrawButton: {
    backgroundColor: '#676FFF',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  withdrawButtonDisabled: {
    backgroundColor: '#ccc',
  },
  withdrawButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
  },
  disclaimerContainer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    gap: 4,
  },
  disclaimerText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  notAuthenticatedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  notAuthenticatedTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  notAuthenticatedText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default WithdrawPage;