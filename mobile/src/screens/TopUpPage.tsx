import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Platform,
  Linking,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Picker } from '@react-native-picker/picker';
import { usePrivy } from '@privy-io/react-auth';
import { Ionicons } from '@expo/vector-icons';

// Types
interface OnRampProvider {
  id: string;
  name: string;
  description: string;
  logo: string;
  fees: string;
  minAmount: number;
  maxAmount: number;
  supportedCurrencies: string[];
  supportedCryptos: string[];
}

interface TopUpResult {
  success: boolean;
  transactionId?: string;
  amount?: string;
  currency?: string;
  cryptoAmount?: string;
  cryptoCurrency?: string;
  error?: string;
}

interface WebViewCallbackData {
  status: 'success' | 'failed' | 'cancelled';
  transactionId?: string;
  amount?: string;
  currency?: string;
  cryptoAmount?: string;
  cryptoCurrency?: string;
  error?: string;
}

// On-ramp providers configuration
const ON_RAMP_PROVIDERS: OnRampProvider[] = [
  {
    id: 'transak',
    name: 'Transak',
    description: 'Buy crypto with credit card, debit card, or bank transfer',
    logo: '💳',
    fees: '0.99% + network fees',
    minAmount: 30,
    maxAmount: 10000,
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD'],
    supportedCryptos: ['ETH', 'BTC', 'USDC', 'USDT', 'MATIC'],
  },
  {
    id: 'moonpay',
    name: 'MoonPay',
    description: 'Fast and secure way to buy crypto',
    logo: '🌙',
    fees: '1.5% + network fees',
    minAmount: 24,
    maxAmount: 50000,
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'CAD', 'AUD'],
    supportedCryptos: ['ETH', 'BTC', 'USDC', 'USDT', 'MATIC'],
  },
  {
    id: 'ramp',
    name: 'Ramp',
    description: 'Buy crypto instantly with your bank account',
    logo: '🚀',
    fees: '2.9% + network fees',
    minAmount: 5,
    maxAmount: 20000,
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'PLN', 'CZK'],
    supportedCryptos: ['ETH', 'BTC', 'USDC', 'DAI', 'MATIC'],
  },
  {
    id: 'wyre',
    name: 'Wyre',
    description: 'Professional grade crypto on-ramp',
    logo: '⚡',
    fees: '0.75% + network fees',
    minAmount: 50,
    maxAmount: 25000,
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'AUD'],
    supportedCryptos: ['ETH', 'BTC', 'USDC', 'USDT'],
  },
];

const TopUpPage: React.FC = () => {
  const { user, authenticated } = usePrivy();
  const webViewRef = useRef<WebView>(null);

  // State
  const [selectedProvider, setSelectedProvider] = useState<string>('');
  const [showWebView, setShowWebView] = useState(false);
  const [webViewUrl, setWebViewUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [topUpResult, setTopUpResult] = useState<TopUpResult | null>(null);

  // Get user's wallet address
  const walletAddress = user?.wallet?.address || '';

  // Reset result when component mounts
  useEffect(() => {
    setTopUpResult(null);
  }, []);

  // Generate provider URL based on selection
  const generateProviderUrl = useCallback((providerId: string): string => {
    const baseUrls: Record<string, string> = {
      transak: 'https://global.transak.com',
      moonpay: 'https://buy.moonpay.com',
      ramp: 'https://app.ramp.network',
      wyre: 'https://pay.sendwyre.com',
    };

    const baseUrl = baseUrls[providerId];
    if (!baseUrl) return '';

    // Common parameters
    const params = new URLSearchParams({
      walletAddress,
      defaultCryptoCurrency: 'ETH',
      defaultFiatCurrency: 'USD',
      defaultFiatAmount: '100',
      redirectURL: 'inwallet://topup-success',
      // Add provider-specific parameters
      ...(providerId === 'transak' && {
        apiKey: 'your-transak-api-key', // Replace with your actual API key
        environment: 'STAGING', // Change to 'PRODUCTION' for live
        themeColor: '676FFF',
      }),
      ...(providerId === 'moonpay' && {
        apiKey: 'your-moonpay-api-key', // Replace with your actual API key
        colorCode: '%23676FFF',
      }),
      ...(providerId === 'ramp' && {
        hostApiKey: 'your-ramp-api-key', // Replace with your actual API key
        variant: 'embedded',
      }),
      ...(providerId === 'wyre' && {
        accountId: 'your-wyre-account-id', // Replace with your actual account ID
        auth: 'your-wyre-auth-token', // Replace with your actual auth token
      }),
    });

    return `${baseUrl}?${params.toString()}`;
  }, [walletAddress]);

  // Handle provider selection
  const handleProviderSelect = useCallback((providerId: string) => {
    if (!authenticated) {
      Alert.alert('Not Authenticated', 'Please log in to continue with top-up');
      return;
    }

    if (!walletAddress) {
      Alert.alert('No Wallet', 'No wallet address found. Please ensure you have a connected wallet.');
      return;
    }

    const provider = ON_RAMP_PROVIDERS.find(p => p.id === providerId);
    if (!provider) return;

    Alert.alert(
      'Confirm Top-Up',
      `You will be redirected to ${provider.name} to complete your purchase.\n\nFees: ${provider.fees}`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            setSelectedProvider(providerId);
            const url = generateProviderUrl(providerId);
            setWebViewUrl(url);
            setShowWebView(true);
          },
        },
      ]
    );
  }, [authenticated, walletAddress, generateProviderUrl]);

  // Handle WebView navigation state changes
  const handleWebViewNavigationStateChange = useCallback((navState: any) => {
    const { url } = navState;
    
    // Check for success callback
    if (url.includes('inwallet://topup-success')) {
      handleTopUpSuccess(url);
    }
    
    // Check for failure callback
    if (url.includes('inwallet://topup-failed')) {
      handleTopUpFailure(url);
    }
    
    // Check for cancellation
    if (url.includes('inwallet://topup-cancelled')) {
      handleTopUpCancellation();
    }
  }, []);

  // Handle successful top-up
  const handleTopUpSuccess = useCallback((url: string) => {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      const result: TopUpResult = {
        success: true,
        transactionId: params.get('transactionId') || undefined,
        amount: params.get('amount') || undefined,
        currency: params.get('currency') || undefined,
        cryptoAmount: params.get('cryptoAmount') || undefined,
        cryptoCurrency: params.get('cryptoCurrency') || undefined,
      };

      setTopUpResult(result);
      setShowWebView(false);
      
      Alert.alert(
        'Top-Up Successful! 🎉',
        `Your purchase has been completed successfully.\n\nTransaction ID: ${result.transactionId || 'N/A'}`,
        [{ text: 'OK', onPress: () => setTopUpResult(null) }]
      );
    } catch (error) {
      console.error('Error parsing success URL:', error);
      handleTopUpFailure(url);
    }
  }, []);

  // Handle failed top-up
  const handleTopUpFailure = useCallback((url: string) => {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);
      
      const result: TopUpResult = {
        success: false,
        error: params.get('error') || 'Transaction failed',
      };

      setTopUpResult(result);
      setShowWebView(false);
      
      Alert.alert(
        'Top-Up Failed',
        result.error || 'The transaction could not be completed. Please try again.',
        [{ text: 'OK', onPress: () => setTopUpResult(null) }]
      );
    } catch (error) {
      console.error('Error parsing failure URL:', error);
      setTopUpResult({ success: false, error: 'Unknown error occurred' });
      setShowWebView(false);
    }
  }, []);

  // Handle cancelled top-up
  const handleTopUpCancellation = useCallback(() => {
    setTopUpResult({ success: false, error: 'Transaction cancelled by user' });
    setShowWebView(false);
    
    Alert.alert(
      'Top-Up Cancelled',
      'The transaction was cancelled. You can try again anytime.',
      [{ text: 'OK', onPress: () => setTopUpResult(null) }]
    );
  }, []);

  // Handle WebView message (for additional communication)
  const handleWebViewMessage = useCallback((event: any) => {
    try {
      const data: WebViewCallbackData = JSON.parse(event.nativeEvent.data);
      
      switch (data.status) {
        case 'success':
          handleTopUpSuccess(`inwallet://topup-success?${new URLSearchParams(data as any).toString()}`);
          break;
        case 'failed':
          handleTopUpFailure(`inwallet://topup-failed?error=${data.error}`);
          break;
        case 'cancelled':
          handleTopUpCancellation();
          break;
        default:
          console.log('Unknown WebView message:', data);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  }, [handleTopUpSuccess, handleTopUpFailure, handleTopUpCancellation]);

  // Close WebView
  const closeWebView = useCallback(() => {
    setShowWebView(false);
    setSelectedProvider('');
  }, []);

  // Render provider card
  const renderProviderCard = useCallback((provider: OnRampProvider) => (
    <TouchableOpacity
      key={provider.id}
      style={styles.providerCard}
      onPress={() => handleProviderSelect(provider.id)}
    >
      <View style={styles.providerHeader}>
        <Text style={styles.providerLogo}>{provider.logo}</Text>
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{provider.name}</Text>
          <Text style={styles.providerDescription}>{provider.description}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#666" />
      </View>
      
      <View style={styles.providerDetails}>
        <View style={styles.providerDetailRow}>
          <Text style={styles.providerDetailLabel}>Fees:</Text>
          <Text style={styles.providerDetailValue}>{provider.fees}</Text>
        </View>
        <View style={styles.providerDetailRow}>
          <Text style={styles.providerDetailLabel}>Range:</Text>
          <Text style={styles.providerDetailValue}>
            ${provider.minAmount} - ${provider.maxAmount}
          </Text>
        </View>
        <View style={styles.providerDetailRow}>
          <Text style={styles.providerDetailLabel}>Currencies:</Text>
          <Text style={styles.providerDetailValue}>
            {provider.supportedCurrencies.slice(0, 3).join(', ')}
            {provider.supportedCurrencies.length > 3 && '...'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ), [handleProviderSelect]);

  if (!authenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notAuthenticatedContainer}>
          <Ionicons name="lock-closed" size={64} color="#666" />
          <Text style={styles.notAuthenticatedTitle}>Authentication Required</Text>
          <Text style={styles.notAuthenticatedText}>
            Please log in to access the top-up feature and add funds to your wallet.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Top Up Wallet</Text>
        <Text style={styles.headerSubtitle}>Choose a provider to add funds</Text>
      </View>

      {walletAddress && (
        <View style={styles.walletInfo}>
          <Text style={styles.walletLabel}>Wallet Address:</Text>
          <Text style={styles.walletAddress} numberOfLines={1}>
            {walletAddress}
          </Text>
        </View>
      )}

      <View style={styles.providersContainer}>
        <Text style={styles.providersTitle}>Select a Provider</Text>
        {ON_RAMP_PROVIDERS.map(renderProviderCard)}
      </View>

      {/* WebView Modal */}
      <Modal
        visible={showWebView}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.webViewContainer}>
          <View style={styles.webViewHeader}>
            <TouchableOpacity onPress={closeWebView} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#000" />
            </TouchableOpacity>
            <Text style={styles.webViewTitle}>
              {ON_RAMP_PROVIDERS.find(p => p.id === selectedProvider)?.name}
            </Text>
            <View style={styles.closeButton} />
          </View>

          {webViewUrl && (
            <WebView
              ref={webViewRef}
              source={{ uri: webViewUrl }}
              style={styles.webView}
              onNavigationStateChange={handleWebViewNavigationStateChange}
              onMessage={handleWebViewMessage}
              startInLoadingState
              renderLoading={() => (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#676FFF" />
                  <Text style={styles.loadingText}>Loading...</Text>
                </View>
              )}
              onError={(error) => {
                console.error('WebView error:', error);
                Alert.alert('Error', 'Failed to load the payment page. Please try again.');
              }}
              // Enable JavaScript
              javaScriptEnabled
              // Allow mixed content for HTTPS
              mixedContentMode="compatibility"
              // Handle external links
              onShouldStartLoadWithRequest={(request) => {
                // Allow our callback URLs
                if (request.url.startsWith('inwallet://')) {
                  return true;
                }
                
                // Allow provider domains
                const allowedDomains = [
                  'global.transak.com',
                  'buy.moonpay.com',
                  'app.ramp.network',
                  'pay.sendwyre.com',
                ];
                
                const url = new URL(request.url);
                return allowedDomains.some(domain => url.hostname.includes(domain));
              }}
            />
          )}
        </SafeAreaView>
      </Modal>

      {/* Success/Error Result */}
      {topUpResult && (
        <View style={[
          styles.resultContainer,
          topUpResult.success ? styles.successContainer : styles.errorContainer
        ]}>
          <Ionicons
            name={topUpResult.success ? "checkmark-circle" : "alert-circle"}
            size={24}
            color={topUpResult.success ? "#34C759" : "#FF3B30"}
          />
          <Text style={[
            styles.resultText,
            topUpResult.success ? styles.successText : styles.errorText
          ]}>
            {topUpResult.success ? 'Top-up successful!' : topUpResult.error}
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
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
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  providersContainer: {
    padding: 20,
  },
  providersTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  providerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
  providerLogo: {
    fontSize: 32,
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  providerDescription: {
    fontSize: 14,
    color: '#666',
  },
  providerDetails: {
    paddingLeft: 44,
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
  webViewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  webViewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  closeButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  webViewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#676FFF',
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
  resultContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
  },
  successContainer: {
    backgroundColor: '#f0f9f0',
    borderColor: '#34C759',
  },
  errorContainer: {
    backgroundColor: '#fff5f5',
    borderColor: '#FF3B30',
  },
  resultText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  successText: {
    color: '#34C759',
  },
  errorText: {
    color: '#FF3B30',
  },
});

export default TopUpPage;