# Fiat-to-Crypto Widget Implementation

## Overview

This implementation provides a complete fiat-to-crypto purchasing solution with iframe/popup widgets for Transak and Ramp Network integration. The solution includes automatic wallet address routing, deep linking callback handling, and comprehensive error management.

## Features

### 🎯 Core Features
- **Multi-Provider Support**: Transak and Ramp Network integration
- **Iframe/Popup Widgets**: Native mobile WebView integration
- **Automatic Wallet Routing**: Direct crypto delivery to user's wallet
- **Deep Linking Callbacks**: Handle success/failure/cancellation states
- **Real-time Purchase Tracking**: Order ID and transaction hash tracking

### 🔒 Security Features
- **Secure Provider URLs**: Validated domain allowlist
- **Encrypted Parameters**: Secure API key management
- **Wallet Address Validation**: Privy authentication integration
- **Callback URL Validation**: Protected deep linking schema

### 🎨 User Experience
- **Native Mobile UI**: React Native components with modern design
- **Loading States**: Proper loading indicators and error handling
- **Purchase History**: Track completed transactions
- **Multi-Currency Support**: 7 fiat currencies, 8+ cryptocurrencies

## Architecture

### Component Structure

```
├── components/
│   └── FiatToCryptoWidget.tsx       # Main widget component
├── screens/
│   └── TopUpPage.tsx                # Updated top-up page with widget integration
├── examples/
│   └── FiatToCryptoExample.tsx      # Complete example implementation
└── docs/
    └── FIAT_TO_CRYPTO_WIDGET_IMPLEMENTATION.md
```

## Core Components

### 1. FiatToCryptoWidget

The main widget component that handles iframe integration with payment providers.

```typescript
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
```

#### Key Features:
- **Provider Integration**: Transak and Ramp Network support
- **Dynamic URL Generation**: Automatic parameter configuration
- **WebView Management**: Native mobile browser integration
- **Callback Handling**: Deep linking and PostMessage support
- **Error Recovery**: Retry mechanisms and fallback handling

### 2. Provider Configurations

```typescript
const PROVIDERS = {
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
  }
};
```

## Integration Guide

### 1. Basic Widget Usage

```typescript
import FiatToCryptoWidget from '../components/FiatToCryptoWidget';

const MyComponent = () => {
  const handleSuccess = (result: PurchaseResult) => {
    console.log('Purchase successful:', result);
  };

  const handleError = (error: string) => {
    console.error('Purchase failed:', error);
  };

  return (
    <FiatToCryptoWidget
      provider="transak"
      fiatCurrency="USD"
      cryptoCurrency="ETH"
      fiatAmount="100"
      onSuccess={handleSuccess}
      onError={handleError}
    />
  );
};
```

### 2. Advanced Configuration

```typescript
const AdvancedExample = () => {
  const { user } = usePrivy();
  const [selectedProvider, setSelectedProvider] = useState<'transak' | 'ramp'>('transak');
  
  return (
    <View>
      {/* Provider Selection */}
      <View style={styles.providerSelector}>
        <TouchableOpacity
          style={[styles.providerOption, selectedProvider === 'transak' && styles.selected]}
          onPress={() => setSelectedProvider('transak')}
        >
          <Text>💳 Transak</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.providerOption, selectedProvider === 'ramp' && styles.selected]}
          onPress={() => setSelectedProvider('ramp')}
        >
          <Text>🚀 Ramp</Text>
        </TouchableOpacity>
      </View>

      {/* Widget */}
      <FiatToCryptoWidget
        provider={selectedProvider}
        fiatCurrency="USD"
        cryptoCurrency="ETH"
        onSuccess={(result) => {
          // Handle successful purchase
          console.log('Purchase completed:', result);
        }}
        onError={(error) => {
          // Handle error
          console.error('Purchase failed:', error);
        }}
      />
    </View>
  );
};
```

## API Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Transak Configuration
EXPO_PUBLIC_TRANSAK_API_KEY=your_transak_api_key_here
EXPO_PUBLIC_TRANSAK_ENV=STAGING # or PRODUCTION

# Ramp Network Configuration
EXPO_PUBLIC_RAMP_API_KEY=your_ramp_api_key_here
```

### Deep Linking Setup

Update your `app.json`:

```json
{
  "expo": {
    "scheme": "inwallet",
    "ios": {
      "bundleIdentifier": "com.yourcompany.inwallet"
    },
    "android": {
      "package": "com.yourcompany.inwallet",
      "intentFilters": [
        {
          "action": "VIEW",
          "data": [
            {
              "scheme": "inwallet",
              "host": "fiat-crypto-success"
            },
            {
              "scheme": "inwallet",
              "host": "fiat-crypto-failed"
            },
            {
              "scheme": "inwallet",
              "host": "fiat-crypto-cancelled"
            }
          ],
          "category": ["BROWSABLE", "DEFAULT"]
        }
      ]
    }
  }
}
```

## Provider Integration Details

### Transak Integration

#### URL Generation
```typescript
const transakUrl = `https://global.transak.com/?${new URLSearchParams({
  apiKey: process.env.EXPO_PUBLIC_TRANSAK_API_KEY,
  environment: process.env.EXPO_PUBLIC_TRANSAK_ENV || 'STAGING',
  walletAddress: user.wallet.address,
  defaultCryptoCurrency: 'ETH',
  defaultFiatCurrency: 'USD',
  defaultNetwork: 'ethereum',
  themeColor: '676FFF',
  hideMenu: 'true',
  redirectURL: 'inwallet://fiat-crypto-success',
  hostURL: 'inwallet.app',
  disableWalletAddressForm: 'true',
  exchangeScreenTitle: 'Buy Crypto',
}).toString()}`;
```

#### Callback Parameters
- `orderId`: Transak order identifier
- `transactionHash`: Blockchain transaction hash
- `cryptoAmount`: Amount of crypto purchased
- `cryptoCurrency`: Cryptocurrency symbol
- `fiatAmount`: Amount of fiat spent
- `fiatCurrency`: Fiat currency used

### Ramp Network Integration

#### URL Generation
```typescript
const rampUrl = `https://app.ramp.network/?${new URLSearchParams({
  hostApiKey: process.env.EXPO_PUBLIC_RAMP_API_KEY,
  userAddress: user.wallet.address,
  swapAsset: 'ETH_*',
  fiatCurrency: 'USD',
  variant: 'hosted-auto',
  finalUrl: 'inwallet://fiat-crypto-success',
}).toString()}`;
```

#### Callback Parameters
- `id`: Ramp purchase identifier
- `txHash`: Blockchain transaction hash
- `amount`: Amount of crypto purchased
- `currency`: Cryptocurrency symbol
- `fiatValue`: Amount of fiat spent
- `fiatCurrency`: Fiat currency used

## Error Handling

### Common Error Scenarios

1. **Authentication Required**
   ```typescript
   if (!authenticated || !walletAddress) {
     setError('Please connect your wallet first');
     return;
   }
   ```

2. **Provider Not Supported**
   ```typescript
   const config = PROVIDERS[providerType];
   if (!config) {
     throw new Error(`Provider ${providerType} not supported`);
   }
   ```

3. **WebView Loading Failed**
   ```typescript
   const handleWebViewError = (error: any) => {
     console.error('WebView error:', error);
     setError('Failed to load payment widget');
     Alert.alert('Loading Error', 'Please check your internet connection and try again.');
   };
   ```

4. **Invalid Callback URL**
   ```typescript
   const handlePurchaseFailure = (url: string) => {
     const urlObj = new URL(url);
     const params = new URLSearchParams(urlObj.search);
     const errorMessage = params.get('error') || 'Purchase failed';
     onError?.(errorMessage);
   };
   ```

## Testing

### Test Environment Setup

1. **Use Staging/Sandbox APIs**
   ```env
   EXPO_PUBLIC_TRANSAK_ENV=STAGING
   EXPO_PUBLIC_RAMP_API_KEY=test_api_key
   ```

2. **Test Wallet Addresses**
   ```typescript
   // Use testnet addresses for testing
   const testWalletAddress = '0x742d35Cc6634C0532925a3b8D2140C2E3d8D2200';
   ```

3. **Mock Callbacks**
   ```typescript
   // Test success callback
   const testSuccessCallback = () => {
     const testResult = {
       success: true,
       orderId: 'test-order-123',
       amount: '100',
       currency: 'ETH',
       provider: 'transak',
     };
     handlePurchaseSuccess(`inwallet://fiat-crypto-success?${new URLSearchParams(testResult).toString()}`);
   };
   ```

### Testing Checklist

- [ ] Widget opens correctly for both providers
- [ ] Wallet address is correctly passed to providers
- [ ] Success callbacks are properly handled
- [ ] Error scenarios are handled gracefully
- [ ] Deep linking works on both iOS and Android
- [ ] Loading states are shown appropriately
- [ ] Purchase history is tracked correctly

## Security Considerations

### 1. API Key Management
- Store API keys in environment variables
- Use different keys for staging and production
- Rotate keys regularly
- Never commit keys to version control

### 2. Domain Validation
```typescript
const allowedDomains = [
  'global.transak.com',
  'app.ramp.network',
  'widget.ramp.network',
  'transak.com',
  'ramp.network',
];

const isAllowedDomain = (url: string) => {
  try {
    const urlObj = new URL(url);
    return allowedDomains.some(domain => 
      urlObj.hostname === domain || urlObj.hostname.endsWith(`.${domain}`)
    );
  } catch {
    return false;
  }
};
```

### 3. Callback URL Security
- Validate all callback URLs
- Use HTTPS for all redirects
- Implement proper deep linking validation
- Sanitize all URL parameters

### 4. User Data Protection
- Never store payment information
- Encrypt sensitive data in transit
- Use secure storage for user preferences
- Implement proper session management

## Production Deployment

### 1. Environment Configuration
```env
# Production Environment
EXPO_PUBLIC_TRANSAK_API_KEY=your_production_transak_api_key
EXPO_PUBLIC_TRANSAK_ENV=PRODUCTION
EXPO_PUBLIC_RAMP_API_KEY=your_production_ramp_api_key
```

### 2. App Store Configuration
- Configure deep linking schemes
- Add required permissions for WebView
- Test payment flows in production environment
- Monitor transaction success rates

### 3. Analytics and Monitoring
```typescript
const trackPurchaseEvent = (provider: string, amount: string, currency: string) => {
  // Analytics tracking
  analytics.track('fiat_crypto_purchase', {
    provider,
    amount,
    currency,
    timestamp: new Date().toISOString(),
  });
};
```

## Troubleshooting

### Common Issues

1. **WebView Not Loading**
   - Check internet connection
   - Verify API keys are correct
   - Ensure provider domains are accessible

2. **Callbacks Not Working**
   - Verify deep linking configuration
   - Check URL scheme registration
   - Test callback URLs manually

3. **Payment Failures**
   - Check user's payment method
   - Verify transaction limits
   - Review provider-specific error messages

4. **Authentication Issues**
   - Ensure user is properly authenticated with Privy
   - Verify wallet connection
   - Check wallet address format

### Debug Tools

```typescript
// Enable debug logging
const DEBUG_MODE = __DEV__ || process.env.NODE_ENV === 'development';

const debugLog = (message: string, data?: any) => {
  if (DEBUG_MODE) {
    console.log(`[FiatToCryptoWidget] ${message}`, data);
  }
};
```

## Support

For technical support:
- Check provider documentation (Transak, Ramp Network)
- Review error logs and callback responses
- Test with staging environments first
- Contact provider support for payment-specific issues

## License

This implementation is provided under the MIT License. See LICENSE file for details.