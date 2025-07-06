import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Linking,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { usePrivy } from '@privy-io/react-auth';
import { Ionicons } from '@expo/vector-icons';

// Types
export interface FiatToCryptoProvider {
  id: 'transak' | 'ramp';
  name: string;
  description: string;
  logo: string;
  supportedCurrencies: string[];
  supportedCryptos: string[];
  fees: string;
  minAmount: number;
  maxAmount: number;
}

export interface PurchaseRequest {
  provider: 'transak' | 'ramp';
  fiatCurrency: string;
  cryptoCurrency: string;
  fiatAmount?: string;
  cryptoAmount?: string;
  walletAddress: string;
  redirectUrl?: string;
}

export interface PurchaseResult {
  success: boolean;
  orderId?: string;
  transactionHash?: string;
  amount?: string;
  currency?: string;
  provider?: string;
  error?: string;
}

interface FiatToCryptoWidgetProps {
  provider: 'transak' | 'ramp';
  fiatCurrency?: string;
  cryptoCurrency?: string;
  fiatAmount?: string;
  onSuccess?: (result: PurchaseResult) => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  style?: any;
}

// Provider configurations
const PROVIDERS: Record<string, FiatToCryptoProvider> = {
  transak: {
    id: 'transak',
    name: 'Transak',
    description: 'Buy crypto with credit card, debit card, or bank transfer',
    logo: '💳',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'INR', 'CAD', 'AUD', 'JPY'],
    supportedCryptos: ['ETH', 'BTC', 'USDC', 'USDT', 'MATIC', 'BNB', 'AVAX'],
    fees: '0.99% + network fees',
    minAmount: 30,
    maxAmount: 10000,
  },
  ramp: {
    id: 'ramp',
    name: 'Ramp Network',
    description: 'Buy crypto instantly with your bank account',
    logo: '🚀',
    supportedCurrencies: ['USD', 'EUR', 'GBP', 'PLN', 'CZK'],
    supportedCryptos: ['ETH', 'BTC', 'USDC', 'DAI', 'MATIC'],
    fees: '2.9% + network fees',
    minAmount: 5,
    maxAmount: 20000,
  },
};

const FiatToCryptoWidget: React.FC<FiatToCryptoWidgetProps> = ({
  provider,
  fiatCurrency = 'USD',
  cryptoCurrency = 'ETH',
  fiatAmount,
  onSuccess,
  onError,
  onClose,
  style,
}) => {
  const { user, authenticated } = usePrivy();
  const webViewRef = useRef<WebView>(null);

  // State
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [widgetUrl, setWidgetUrl] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Get user's wallet address
  const walletAddress = user?.wallet?.address || '';
  const userEmail = user?.email?.address || '';

  // Generate widget URL based on provider
  const generateWidgetUrl = useCallback((providerType: 'transak' | 'ramp'): string => {
    if (!walletAddress) {
      throw new Error('Wallet address is required');
    }

    const config = PROVIDERS[providerType];
    if (!config) {
      throw new Error(`Provider ${providerType} not supported`);
    }

    let baseUrl = '';
    let params: Record<string, string> = {};

    if (providerType === 'transak') {
      baseUrl = 'https://global.transak.com/';
      params = {
        apiKey: process.env.EXPO_PUBLIC_TRANSAK_API_KEY || 'your-transak-api-key',
        environment: process.env.EXPO_PUBLIC_TRANSAK_ENV || 'STAGING',
        walletAddress,
        defaultCryptoCurrency: cryptoCurrency,
        defaultFiatCurrency: fiatCurrency,
        defaultNetwork: 'ethereum', // Can be dynamic based on crypto
        themeColor: '676FFF',
        hideMenu: 'true',
        redirectURL: 'inwallet://fiat-crypto-success',
        hostURL: 'inwallet.app',
        widgetHeight: '625px',
        widgetWidth: '100%',
        // Optional parameters
        ...(fiatAmount && { defaultFiatAmount: fiatAmount }),
        ...(userEmail && { email: userEmail }),
        disableWalletAddressForm: 'true',
        exchangeScreenTitle: 'Buy Crypto',
      };
    } else if (providerType === 'ramp') {
      baseUrl = 'https://app.ramp.network/';
      params = {
        hostApiKey: process.env.EXPO_PUBLIC_RAMP_API_KEY || 'your-ramp-api-key',
        userAddress: walletAddress,
        swapAsset: `${cryptoCurrency}_*`, // Dynamic asset selection
        fiatCurrency,
        variant: 'hosted-auto',
        finalUrl: 'inwallet://fiat-crypto-success',
        // Optional parameters
        ...(fiatAmount && { fiatValue: fiatAmount }),
        ...(userEmail && { userEmailAddress: userEmail }),
      };
    }

    const urlParams = new URLSearchParams(params);
    return `${baseUrl}?${urlParams.toString()}`;
  }, [walletAddress, userEmail, cryptoCurrency, fiatCurrency, fiatAmount]);

  // Initialize widget
  const initializeWidget = useCallback(() => {
    if (!authenticated || !walletAddress) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const url = generateWidgetUrl(provider);
      setWidgetUrl(url);
      setIsVisible(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize widget';
      setError(errorMessage);
      onError?.(errorMessage);
    }
  }, [authenticated, walletAddress, provider, generateWidgetUrl, onError]);

  // Handle WebView navigation
  const handleWebViewNavigationStateChange = useCallback((navState: any) => {
    const { url } = navState;

    // Handle success callback
    if (url.includes('inwallet://fiat-crypto-success')) {
      handlePurchaseSuccess(url);
    }

    // Handle failure callback
    if (url.includes('inwallet://fiat-crypto-failed')) {
      handlePurchaseFailure(url);
    }

    // Handle cancellation
    if (url.includes('inwallet://fiat-crypto-cancelled')) {
      handlePurchaseCancellation();
    }
  }, []);

  // Handle successful purchase
  const handlePurchaseSuccess = useCallback((url: string) => {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);

      const result: PurchaseResult = {
        success: true,
        orderId: params.get('orderId') || params.get('id') || undefined,
        transactionHash: params.get('transactionHash') || params.get('txHash') || undefined,
        amount: params.get('amount') || params.get('cryptoAmount') || undefined,
        currency: params.get('currency') || params.get('cryptoCurrency') || cryptoCurrency,
        provider,
      };

      setIsVisible(false);
      setIsLoading(false);

      Alert.alert(
        'Purchase Successful! 🎉',
        `Your crypto purchase has been completed.\n\nOrder ID: ${result.orderId || 'N/A'}\nAmount: ${result.amount || 'N/A'} ${result.currency}`,
        [
          {
            text: 'OK',
            onPress: () => onSuccess?.(result),
          },
        ]
      );

      onSuccess?.(result);
    } catch (error) {
      console.error('Error parsing success URL:', error);
      handlePurchaseFailure(url);
    }
  }, [provider, cryptoCurrency, onSuccess]);

  // Handle failed purchase
  const handlePurchaseFailure = useCallback((url: string) => {
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams(urlObj.search);

      const errorMessage = params.get('error') || 'Purchase failed';

      setIsVisible(false);
      setIsLoading(false);
      setError(errorMessage);

      Alert.alert(
        'Purchase Failed',
        errorMessage,
        [{ text: 'OK' }]
      );

      onError?.(errorMessage);
    } catch (error) {
      console.error('Error parsing failure URL:', error);
      const fallbackError = 'Purchase failed due to an unknown error';
      setError(fallbackError);
      onError?.(fallbackError);
    }
  }, [onError]);

  // Handle cancelled purchase
  const handlePurchaseCancellation = useCallback(() => {
    setIsVisible(false);
    setIsLoading(false);

    Alert.alert(
      'Purchase Cancelled',
      'The transaction was cancelled. You can try again anytime.',
      [{ text: 'OK' }]
    );

    onClose?.();
  }, [onClose]);

  // Handle WebView message
  const handleWebViewMessage = useCallback((event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      switch (data.type) {
        case 'TRANSAK_ORDER_SUCCESSFUL':
        case 'RAMP_PURCHASE_SUCCESSFUL':
          handlePurchaseSuccess(`inwallet://fiat-crypto-success?${new URLSearchParams(data).toString()}`);
          break;
        case 'TRANSAK_ORDER_FAILED':
        case 'RAMP_PURCHASE_FAILED':
          handlePurchaseFailure(`inwallet://fiat-crypto-failed?error=${data.error || 'Purchase failed'}`);
          break;
        case 'TRANSAK_ORDER_CANCELLED':
        case 'RAMP_PURCHASE_CANCELLED':
          handlePurchaseCancellation();
          break;
        case 'TRANSAK_WIDGET_CLOSE':
        case 'RAMP_WIDGET_CLOSE':
          setIsVisible(false);
          onClose?.();
          break;
        default:
          console.log('Unknown widget message:', data);
      }
    } catch (error) {
      console.error('Error parsing WebView message:', error);
    }
  }, [handlePurchaseSuccess, handlePurchaseFailure, handlePurchaseCancellation, onClose]);

  // Close widget
  const closeWidget = useCallback(() => {
    setIsVisible(false);
    setIsLoading(false);
    onClose?.();
  }, [onClose]);

  // Handle WebView load end
  const handleWebViewLoadEnd = useCallback(() => {
    setIsLoading(false);
  }, []);

  // Handle WebView error
  const handleWebViewError = useCallback((error: any) => {
    console.error('WebView error:', error);
    setIsLoading(false);
    setError('Failed to load payment widget');
    Alert.alert(
      'Loading Error',
      'Failed to load the payment widget. Please check your internet connection and try again.',
      [
        {
          text: 'Retry',
          onPress: initializeWidget,
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: closeWidget,
        },
      ]
    );
  }, [initializeWidget, closeWidget]);

  // Open widget
  const openWidget = useCallback(() => {
    initializeWidget();
  }, [initializeWidget]);

  // Auto-initialize if provider changes
  useEffect(() => {
    if (isVisible) {
      initializeWidget();
    }
  }, [provider, isVisible, initializeWidget]);

  const providerConfig = PROVIDERS[provider];

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        style={[styles.triggerButton, style]}
        onPress={openWidget}
        disabled={!authenticated || !walletAddress}
      >
        <Text style={styles.triggerButtonText}>
          Buy with {providerConfig?.name || 'Provider'}
        </Text>
        <Ionicons name="card" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Widget Modal */}
      <Modal
        visible={isVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={closeWidget}
      >
        <SafeAreaView style={styles.modalContainer}>
          {/* Modal Header */}
          <View style={styles.modalHeader}>
            <View style={styles.headerLeft}>
              <Text style={styles.providerLogo}>{providerConfig?.logo}</Text>
              <View>
                <Text style={styles.modalTitle}>{providerConfig?.name}</Text>
                <Text style={styles.modalSubtitle}>
                  Buy {cryptoCurrency} with {fiatCurrency}
                </Text>
              </View>
            </View>
            <TouchableOpacity onPress={closeWidget} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          {/* Loading Indicator */}
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#676FFF" />
              <Text style={styles.loadingText}>Loading secure payment widget...</Text>
            </View>
          )}

          {/* Error State */}
          {error && (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={48} color="#FF3B30" />
              <Text style={styles.errorTitle}>Unable to Load Widget</Text>
              <Text style={styles.errorMessage}>{error}</Text>
              <TouchableOpacity style={styles.retryButton} onPress={initializeWidget}>
                <Text style={styles.retryButtonText}>Try Again</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* WebView Widget */}
          {widgetUrl && !error && (
            <WebView
              ref={webViewRef}
              source={{ uri: widgetUrl }}
              style={styles.webView}
              onNavigationStateChange={handleWebViewNavigationStateChange}
              onMessage={handleWebViewMessage}
              onLoadEnd={handleWebViewLoadEnd}
              onError={handleWebViewError}
              startInLoadingState={false}
              javaScriptEnabled
              domStorageEnabled
              mixedContentMode="compatibility"
              allowsInlineMediaPlayback
              mediaPlaybackRequiresUserAction={false}
              onShouldStartLoadWithRequest={(request) => {
                // Allow our callback URLs
                if (request.url.startsWith('inwallet://')) {
                  return true;
                }

                // Allow provider domains
                const allowedDomains = [
                  'global.transak.com',
                  'app.ramp.network',
                  'widget.ramp.network',
                  'transak.com',
                  'ramp.network',
                ];

                try {
                  const url = new URL(request.url);
                  return allowedDomains.some(domain => 
                    url.hostname === domain || url.hostname.endsWith(`.${domain}`)
                  );
                } catch {
                  return false;
                }
              }}
            />
          )}

          {/* Widget Info */}
          <View style={styles.widgetInfo}>
            <View style={styles.infoRow}>
              <Ionicons name="shield-checkmark" size={16} color="#34C759" />
              <Text style={styles.infoText}>Secure payment processing</Text>
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="wallet" size={16} color="#676FFF" />
              <Text style={styles.infoText}>
                Funds sent to: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  triggerButton: {
    backgroundColor: '#676FFF',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  triggerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  providerLogo: {
    fontSize: 24,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  retryButton: {
    backgroundColor: '#676FFF',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  webView: {
    flex: 1,
  },
  widgetInfo: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#666',
  },
});

export default FiatToCryptoWidget;