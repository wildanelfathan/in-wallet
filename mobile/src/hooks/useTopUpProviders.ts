import { useCallback, useMemo } from 'react';
import { usePrivy } from '@privy-io/react-auth';

export interface OnRampProvider {
  id: string;
  name: string;
  description: string;
  logo: string;
  fees: string;
  minAmount: number;
  maxAmount: number;
  supportedCurrencies: string[];
  supportedCryptos: string[];
  testMode: boolean;
}

export interface ProviderConfig {
  apiKey?: string;
  accountId?: string;
  authToken?: string;
  environment?: 'STAGING' | 'PRODUCTION';
  [key: string]: any;
}

// Default provider configurations
const DEFAULT_PROVIDERS: OnRampProvider[] = [
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
    testMode: true,
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
    testMode: true,
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
    testMode: true,
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
    testMode: true,
  },
];

export const useTopUpProviders = () => {
  const { user } = usePrivy();
  
  const walletAddress = user?.wallet?.address || '';
  const userEmail = user?.email?.address || '';

  // Provider configurations - Replace with your actual API keys
  const providerConfigs: Record<string, ProviderConfig> = useMemo(() => ({
    transak: {
      apiKey: process.env.EXPO_PUBLIC_TRANSAK_API_KEY || 'your-transak-api-key',
      environment: 'STAGING', // Change to 'PRODUCTION' for live
    },
    moonpay: {
      apiKey: process.env.EXPO_PUBLIC_MOONPAY_API_KEY || 'your-moonpay-api-key',
    },
    ramp: {
      hostApiKey: process.env.EXPO_PUBLIC_RAMP_API_KEY || 'your-ramp-api-key',
    },
    wyre: {
      accountId: process.env.EXPO_PUBLIC_WYRE_ACCOUNT_ID || 'your-wyre-account-id',
      authToken: process.env.EXPO_PUBLIC_WYRE_AUTH_TOKEN || 'your-wyre-auth-token',
    },
  }), []);

  // Generate provider URL
  const generateProviderUrl = useCallback((
    providerId: string,
    options: {
      amount?: string;
      currency?: string;
      cryptoCurrency?: string;
      redirectUrl?: string;
    } = {}
  ): string => {
    const {
      amount = '100',
      currency = 'USD',
      cryptoCurrency = 'ETH',
      redirectUrl = 'inwallet://topup-callback',
    } = options;

    const config = providerConfigs[providerId];
    if (!config) {
      console.error(`No configuration found for provider: ${providerId}`);
      return '';
    }

    const baseUrls: Record<string, string> = {
      transak: 'https://global.transak.com',
      moonpay: 'https://buy.moonpay.com',
      ramp: 'https://app.ramp.network',
      wyre: 'https://pay.sendwyre.com',
    };

    const baseUrl = baseUrls[providerId];
    if (!baseUrl) {
      console.error(`No base URL found for provider: ${providerId}`);
      return '';
    }

    // Common parameters
    const commonParams = {
      walletAddress,
      defaultCryptoCurrency: cryptoCurrency,
      defaultFiatCurrency: currency,
      defaultFiatAmount: amount,
      redirectURL: redirectUrl,
    };

    // Provider-specific parameters
    let providerParams = {};
    
    switch (providerId) {
      case 'transak':
        providerParams = {
          apiKey: config.apiKey,
          environment: config.environment,
          themeColor: '676FFF',
          email: userEmail,
          exchangeScreenTitle: 'Top Up Wallet',
          disableWalletAddressForm: true,
        };
        break;
      
      case 'moonpay':
        providerParams = {
          apiKey: config.apiKey,
          colorCode: '%23676FFF',
          email: userEmail,
          showWalletAddressForm: false,
        };
        break;
      
      case 'ramp':
        providerParams = {
          hostApiKey: config.hostApiKey,
          variant: 'embedded',
          userEmailAddress: userEmail,
          finalUrl: redirectUrl,
        };
        break;
      
      case 'wyre':
        providerParams = {
          accountId: config.accountId,
          auth: config.authToken,
          email: userEmail,
        };
        break;
    }

    const allParams = { ...commonParams, ...providerParams };
    const params = new URLSearchParams(allParams);

    return `${baseUrl}?${params.toString()}`;
  }, [walletAddress, userEmail, providerConfigs]);

  // Get provider by ID
  const getProvider = useCallback((providerId: string): OnRampProvider | undefined => {
    return DEFAULT_PROVIDERS.find(provider => provider.id === providerId);
  }, []);

  // Get available providers
  const getAvailableProviders = useCallback((): OnRampProvider[] => {
    return DEFAULT_PROVIDERS.filter(provider => {
      const config = providerConfigs[provider.id];
      return config && config.apiKey && config.apiKey !== `your-${provider.id}-api-key`;
    });
  }, [providerConfigs]);

  // Check if provider is configured
  const isProviderConfigured = useCallback((providerId: string): boolean => {
    const config = providerConfigs[providerId];
    return !!(config && config.apiKey && config.apiKey !== `your-${providerId}-api-key`);
  }, [providerConfigs]);

  // Validate provider requirements
  const validateProvider = useCallback((providerId: string): {
    isValid: boolean;
    errors: string[];
  } => {
    const provider = getProvider(providerId);
    const errors: string[] = [];

    if (!provider) {
      errors.push('Provider not found');
      return { isValid: false, errors };
    }

    if (!walletAddress) {
      errors.push('Wallet address is required');
    }

    if (!isProviderConfigured(providerId)) {
      errors.push('Provider API key is not configured');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }, [walletAddress, getProvider, isProviderConfigured]);

  return {
    providers: DEFAULT_PROVIDERS,
    availableProviders: getAvailableProviders(),
    generateProviderUrl,
    getProvider,
    isProviderConfigured,
    validateProvider,
    walletAddress,
    userEmail,
  };
};