import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { usePrivy } from '@privy-io/react-auth';
import { Ionicons } from '@expo/vector-icons';
import FiatToCryptoWidget, { PurchaseResult } from '../components/FiatToCryptoWidget';

// Available currencies and cryptos
const FIAT_CURRENCIES = [
  { code: 'USD', name: 'US Dollar', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GBP', name: 'British Pound', symbol: '£' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
];

const CRYPTOCURRENCIES = [
  { code: 'ETH', name: 'Ethereum', emoji: '⚡' },
  { code: 'BTC', name: 'Bitcoin', emoji: '₿' },
  { code: 'USDC', name: 'USD Coin', emoji: '💰' },
  { code: 'USDT', name: 'Tether', emoji: '💵' },
  { code: 'MATIC', name: 'Polygon', emoji: '🔷' },
  { code: 'BNB', name: 'Binance Coin', emoji: '🟡' },
  { code: 'AVAX', name: 'Avalanche', emoji: '🔺' },
  { code: 'DAI', name: 'Dai', emoji: '🏦' },
];

const FiatToCryptoExample: React.FC = () => {
  const { authenticated, user } = usePrivy();

  // State for purchase configuration
  const [selectedFiat, setSelectedFiat] = useState('USD');
  const [selectedCrypto, setSelectedCrypto] = useState('ETH');
  const [fiatAmount, setFiatAmount] = useState('');
  const [purchaseHistory, setPurchaseHistory] = useState<PurchaseResult[]>([]);

  // Get selected currency info
  const selectedFiatInfo = FIAT_CURRENCIES.find(f => f.code === selectedFiat);
  const selectedCryptoInfo = CRYPTOCURRENCIES.find(c => c.code === selectedCrypto);

  // Handle successful purchase
  const handlePurchaseSuccess = useCallback((result: PurchaseResult) => {
    console.log('Purchase successful:', result);
    
    // Add to purchase history
    setPurchaseHistory(prev => [result, ...prev]);
    
    // Show success notification
    Alert.alert(
      'Purchase Successful! 🎉',
      `Your ${result.currency} purchase has been completed.\n\nOrder ID: ${result.orderId}\nAmount: ${result.amount} ${result.currency}`,
      [{ text: 'OK' }]
    );
  }, []);

  // Handle purchase error
  const handlePurchaseError = useCallback((error: string) => {
    console.error('Purchase failed:', error);
    
    // Error is already handled by the widget
    // Could add to error log or analytics here
  }, []);

  // Clear purchase history
  const clearHistory = useCallback(() => {
    setPurchaseHistory([]);
  }, []);

  if (!authenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notAuthenticatedContainer}>
          <Ionicons name="wallet" size={64} color="#676FFF" />
          <Text style={styles.notAuthenticatedTitle}>Connect Your Wallet</Text>
          <Text style={styles.notAuthenticatedText}>
            Please connect your wallet to start buying cryptocurrency with fiat currency.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Buy Cryptocurrency</Text>
          <Text style={styles.headerSubtitle}>
            Purchase crypto with fiat currency using secure payment providers
          </Text>
        </View>

        {/* Wallet Info */}
        <View style={styles.walletInfo}>
          <Text style={styles.walletLabel}>Destination Wallet</Text>
          <Text style={styles.walletAddress}>
            {user?.wallet?.address || 'No wallet connected'}
          </Text>
        </View>

        {/* Purchase Configuration */}
        <View style={styles.configSection}>
          <Text style={styles.sectionTitle}>Purchase Configuration</Text>
          
          {/* Fiat Currency Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Fiat Currency</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedFiat}
                onValueChange={setSelectedFiat}
                style={styles.picker}
              >
                {FIAT_CURRENCIES.map(currency => (
                  <Picker.Item
                    key={currency.code}
                    label={`${currency.code} - ${currency.name}`}
                    value={currency.code}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Cryptocurrency Selection */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Cryptocurrency</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedCrypto}
                onValueChange={setSelectedCrypto}
                style={styles.picker}
              >
                {CRYPTOCURRENCIES.map(crypto => (
                  <Picker.Item
                    key={crypto.code}
                    label={`${crypto.emoji} ${crypto.code} - ${crypto.name}`}
                    value={crypto.code}
                  />
                ))}
              </Picker>
            </View>
          </View>

          {/* Amount Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>
              Amount ({selectedFiatInfo?.symbol}{selectedFiat})
            </Text>
            <TextInput
              style={styles.amountInput}
              value={fiatAmount}
              onChangeText={setFiatAmount}
              placeholder="Enter amount (optional)"
              keyboardType="numeric"
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Payment Providers */}
        <View style={styles.providersSection}>
          <Text style={styles.sectionTitle}>Choose Payment Provider</Text>
          
          {/* Transak */}
          <View style={styles.providerCard}>
            <View style={styles.providerHeader}>
              <Text style={styles.providerEmoji}>💳</Text>
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>Transak</Text>
                <Text style={styles.providerDescription}>
                  Credit/debit cards, bank transfers • 0.99% fee
                </Text>
              </View>
            </View>
            <View style={styles.providerDetails}>
              <View style={styles.providerDetailRow}>
                <Text style={styles.providerDetailLabel}>Processing Time:</Text>
                <Text style={styles.providerDetailValue}>5-10 minutes</Text>
              </View>
              <View style={styles.providerDetailRow}>
                <Text style={styles.providerDetailLabel}>Min Amount:</Text>
                <Text style={styles.providerDetailValue}>
                  {selectedFiatInfo?.symbol}30
                </Text>
              </View>
              <View style={styles.providerDetailRow}>
                <Text style={styles.providerDetailLabel}>Max Amount:</Text>
                <Text style={styles.providerDetailValue}>
                  {selectedFiatInfo?.symbol}10,000
                </Text>
              </View>
            </View>
            <View style={styles.providerActions}>
              <FiatToCryptoWidget
                provider="transak"
                fiatCurrency={selectedFiat}
                cryptoCurrency={selectedCrypto}
                fiatAmount={fiatAmount}
                onSuccess={handlePurchaseSuccess}
                onError={handlePurchaseError}
                style={styles.providerButton}
              />
            </View>
          </View>

          {/* Ramp Network */}
          <View style={styles.providerCard}>
            <View style={styles.providerHeader}>
              <Text style={styles.providerEmoji}>🚀</Text>
              <View style={styles.providerInfo}>
                <Text style={styles.providerName}>Ramp Network</Text>
                <Text style={styles.providerDescription}>
                  Bank transfers, instant deposits • 2.9% fee
                </Text>
              </View>
            </View>
            <View style={styles.providerDetails}>
              <View style={styles.providerDetailRow}>
                <Text style={styles.providerDetailLabel}>Processing Time:</Text>
                <Text style={styles.providerDetailValue}>10-30 minutes</Text>
              </View>
              <View style={styles.providerDetailRow}>
                <Text style={styles.providerDetailLabel}>Min Amount:</Text>
                <Text style={styles.providerDetailValue}>
                  {selectedFiatInfo?.symbol}5
                </Text>
              </View>
              <View style={styles.providerDetailRow}>
                <Text style={styles.providerDetailLabel}>Max Amount:</Text>
                <Text style={styles.providerDetailValue}>
                  {selectedFiatInfo?.symbol}20,000
                </Text>
              </View>
            </View>
            <View style={styles.providerActions}>
              <FiatToCryptoWidget
                provider="ramp"
                fiatCurrency={selectedFiat}
                cryptoCurrency={selectedCrypto}
                fiatAmount={fiatAmount}
                onSuccess={handlePurchaseSuccess}
                onError={handlePurchaseError}
                style={styles.providerButton}
              />
            </View>
          </View>
        </View>

        {/* Quick Buy Options */}
        <View style={styles.quickBuySection}>
          <Text style={styles.sectionTitle}>Quick Buy Options</Text>
          
          <View style={styles.quickBuyGrid}>
            <View style={styles.quickBuyCard}>
              <Text style={styles.quickBuyEmoji}>⚡</Text>
              <Text style={styles.quickBuyAmount}>
                {selectedFiatInfo?.symbol}100
              </Text>
              <Text style={styles.quickBuyLabel}>ETH</Text>
              <FiatToCryptoWidget
                provider="transak"
                fiatCurrency={selectedFiat}
                cryptoCurrency="ETH"
                fiatAmount="100"
                onSuccess={handlePurchaseSuccess}
                onError={handlePurchaseError}
                style={styles.quickBuyButton}
              />
            </View>

            <View style={styles.quickBuyCard}>
              <Text style={styles.quickBuyEmoji}>₿</Text>
              <Text style={styles.quickBuyAmount}>
                {selectedFiatInfo?.symbol}250
              </Text>
              <Text style={styles.quickBuyLabel}>BTC</Text>
              <FiatToCryptoWidget
                provider="transak"
                fiatCurrency={selectedFiat}
                cryptoCurrency="BTC"
                fiatAmount="250"
                onSuccess={handlePurchaseSuccess}
                onError={handlePurchaseError}
                style={styles.quickBuyButton}
              />
            </View>

            <View style={styles.quickBuyCard}>
              <Text style={styles.quickBuyEmoji}>💰</Text>
              <Text style={styles.quickBuyAmount}>
                {selectedFiatInfo?.symbol}50
              </Text>
              <Text style={styles.quickBuyLabel}>USDC</Text>
              <FiatToCryptoWidget
                provider="ramp"
                fiatCurrency={selectedFiat}
                cryptoCurrency="USDC"
                fiatAmount="50"
                onSuccess={handlePurchaseSuccess}
                onError={handlePurchaseError}
                style={styles.quickBuyButton}
              />
            </View>

            <View style={styles.quickBuyCard}>
              <Text style={styles.quickBuyEmoji}>🔷</Text>
              <Text style={styles.quickBuyAmount}>
                {selectedFiatInfo?.symbol}25
              </Text>
              <Text style={styles.quickBuyLabel}>MATIC</Text>
              <FiatToCryptoWidget
                provider="ramp"
                fiatCurrency={selectedFiat}
                cryptoCurrency="MATIC"
                fiatAmount="25"
                onSuccess={handlePurchaseSuccess}
                onError={handlePurchaseError}
                style={styles.quickBuyButton}
              />
            </View>
          </View>
        </View>

        {/* Purchase History */}
        {purchaseHistory.length > 0 && (
          <View style={styles.historySection}>
            <View style={styles.historyHeader}>
              <Text style={styles.sectionTitle}>Purchase History</Text>
              <TouchableOpacity onPress={clearHistory} style={styles.clearButton}>
                <Text style={styles.clearButtonText}>Clear</Text>
              </TouchableOpacity>
            </View>
            
            {purchaseHistory.map((purchase, index) => (
              <View key={index} style={styles.historyItem}>
                <View style={styles.historyItemHeader}>
                  <Text style={styles.historyItemTitle}>
                    {purchase.provider?.toUpperCase()} Purchase
                  </Text>
                  <Text style={styles.historyItemAmount}>
                    {purchase.amount} {purchase.currency}
                  </Text>
                </View>
                <Text style={styles.historyItemId}>
                  Order ID: {purchase.orderId}
                </Text>
                {purchase.transactionHash && (
                  <Text style={styles.historyItemHash}>
                    TX: {purchase.transactionHash.slice(0, 10)}...
                  </Text>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Security Info */}
        <View style={styles.securitySection}>
          <Text style={styles.sectionTitle}>Security Information</Text>
          <View style={styles.securityList}>
            <View style={styles.securityItem}>
              <Ionicons name="shield-checkmark" size={20} color="#34C759" />
              <Text style={styles.securityText}>
                All transactions are processed through secure, regulated providers
              </Text>
            </View>
            <View style={styles.securityItem}>
              <Ionicons name="lock-closed" size={20} color="#34C759" />
              <Text style={styles.securityText}>
                Your wallet address is used for direct crypto delivery
              </Text>
            </View>
            <View style={styles.securityItem}>
              <Ionicons name="card" size={20} color="#34C759" />
              <Text style={styles.securityText}>
                Payment data is never stored on our servers
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
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
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  walletInfo: {
    margin: 20,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  walletLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 4,
  },
  walletAddress: {
    fontSize: 14,
    color: '#333',
    fontFamily: 'monospace',
  },
  configSection: {
    margin: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  pickerContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  picker: {
    height: 50,
  },
  amountInput: {
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e9ecef',
    padding: 16,
    fontSize: 16,
    color: '#333',
  },
  providersSection: {
    margin: 20,
  },
  providerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  providerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  providerEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  providerDescription: {
    fontSize: 14,
    color: '#666',
  },
  providerDetails: {
    marginBottom: 16,
    paddingLeft: 40,
  },
  providerDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  providerDetailLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  providerDetailValue: {
    fontSize: 12,
    color: '#333',
  },
  providerActions: {
    alignItems: 'center',
  },
  providerButton: {
    minWidth: 200,
  },
  quickBuySection: {
    margin: 20,
  },
  quickBuyGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  quickBuyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },
  quickBuyEmoji: {
    fontSize: 28,
    marginBottom: 8,
  },
  quickBuyAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  quickBuyLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  quickBuyButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 80,
  },
  historySection: {
    margin: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
  },
  clearButtonText: {
    fontSize: 12,
    color: '#666',
    fontWeight: '500',
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  historyItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  historyItemAmount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#676FFF',
  },
  historyItemId: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  historyItemHash: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
  securitySection: {
    margin: 20,
    marginBottom: 40,
  },
  securityList: {
    gap: 12,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  securityText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
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

export default FiatToCryptoExample;