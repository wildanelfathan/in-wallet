# in-wallet
in-wallet dapps

# In-Wallet Mobile App

A comprehensive mobile wallet application built with React Native and Expo, featuring advanced biometric authentication, fiat-to-crypto purchasing, and secure wallet management.

## Features

### 🔐 Biometric Authentication
- Face ID / Touch ID support for iOS
- Fingerprint authentication for Android
- Secure credential storage with device hardware security
- Seamless integration with Privy authentication
- Fallback to regular login for unsupported devices

### 💳 Fiat-to-Crypto Integration
- **Transak Integration**: Credit/debit cards, bank transfers (0.99% fees)
- **Ramp Network Integration**: Instant bank deposits (2.9% fees)
- iframe/popup widget implementation with WebView
- Automatic wallet address routing
- Deep linking callback handling
- Support for 7+ fiat currencies and 8+ cryptocurrencies

### 🏦 Wallet Management
- Secure wallet connection with Privy
- Transaction history tracking
- Balance monitoring
- Withdrawal to bank accounts and eWallets
- Multi-currency support

### 🔄 TopUp & Withdrawal
- Multiple payment provider support
- Real-time fee calculation
- Secure payment processing
- Transaction status tracking
- Comprehensive error handling

## Project Structure

```
mobile/
├── src/
│   ├── components/
│   │   ├── FiatToCryptoWidget.tsx    # Main fiat-to-crypto widget
│   │   └── TopUpButton.tsx           # Reusable top-up button
│   ├── screens/
│   │   ├── LoginScreen.tsx           # Authentication screen
│   │   ├── TopUpPage.tsx             # Enhanced top-up with widget integration
│   │   └── WithdrawPage.tsx          # Withdrawal functionality
│   ├── hooks/
│   │   ├── useBiometricLogin.ts      # Biometric authentication hook
│   │   ├── useTopUpProviders.ts      # Top-up provider management
│   │   └── useWithdraw.ts            # Withdrawal management
│   └── examples/
│       ├── FiatToCryptoExample.tsx   # Complete widget example
│       ├── TopUpExample.tsx          # Top-up integration example
│       └── WithdrawExample.tsx       # Withdrawal integration example
├── App.tsx                           # Main app component
├── app.json                          # Expo configuration
├── package.json                      # Dependencies
└── babel.config.js                   # Babel configuration
```

## Quick Start

### 1. Installation

```bash
cd mobile
npm install
```

### 2. Environment Configuration

Create a `.env` file in the mobile directory:

```env
# Privy Configuration
EXPO_PUBLIC_PRIVY_APP_ID=your_privy_app_id

# Transak Configuration
EXPO_PUBLIC_TRANSAK_API_KEY=your_transak_api_key
EXPO_PUBLIC_TRANSAK_ENV=STAGING

# Ramp Network Configuration
EXPO_PUBLIC_RAMP_API_KEY=your_ramp_api_key
```

### 3. Deep Linking Setup

Update your `app.json` for deep linking:

```json
{
  "expo": {
    "scheme": "inwallet",
    "ios": {
      "bundleIdentifier": "com.yourcompany.inwallet",
      "infoPlist": {
        "NSFaceIDUsageDescription": "Use Face ID to authenticate and access your wallet securely"
      }
    },
    "android": {
      "package": "com.yourcompany.inwallet",
      "permissions": [
        "android.permission.USE_BIOMETRIC",
        "android.permission.USE_FINGERPRINT"
      ]
    }
  }
}
```

### 4. Run the Application

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## Core Components

### FiatToCryptoWidget

The main widget for purchasing cryptocurrency with fiat currency:

```typescript
import FiatToCryptoWidget from './src/components/FiatToCryptoWidget';

const PurchaseScreen = () => {
  return (
    <FiatToCryptoWidget
      provider="transak"
      fiatCurrency="USD"
      cryptoCurrency="ETH"
      fiatAmount="100"
      onSuccess={(result) => {
        console.log('Purchase successful:', result);
      }}
      onError={(error) => {
        console.error('Purchase failed:', error);
      }}
    />
  );
};
```

### Biometric Authentication

Secure biometric login integration:

```typescript
import { useBiometricLogin } from './src/hooks/useBiometricLogin';

const LoginScreen = () => {
  const { authenticateWithBiometrics, isSupported, isEnrolled } = useBiometricLogin();

  const handleBiometricLogin = async () => {
    try {
      await authenticateWithBiometrics();
      // User authenticated successfully
    } catch (error) {
      // Handle authentication failure
    }
  };

  return (
    <View>
      {isSupported && isEnrolled && (
        <TouchableOpacity onPress={handleBiometricLogin}>
          <Text>Login with Face ID / Touch ID</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
```

## Supported Providers

### Transak
- **Payment Methods**: Credit/debit cards, bank transfers
- **Fees**: 0.99% + network fees
- **Limits**: $30 - $10,000
- **Processing**: 5-10 minutes
- **Currencies**: USD, EUR, GBP, INR, CAD, AUD, JPY
- **Crypto**: ETH, BTC, USDC, USDT, MATIC, BNB, AVAX

### Ramp Network
- **Payment Methods**: Bank transfers, instant deposits
- **Fees**: 2.9% + network fees
- **Limits**: $5 - $20,000
- **Processing**: 10-30 minutes
- **Currencies**: USD, EUR, GBP, PLN, CZK
- **Crypto**: ETH, BTC, USDC, DAI, MATIC

## Security Features

- **Biometric Authentication**: Hardware-backed security
- **Secure Storage**: Encrypted credential storage
- **Domain Validation**: Allowlisted provider domains
- **Callback Validation**: Secure deep linking
- **API Key Management**: Environment-based configuration
- **Transaction Tracking**: Comprehensive audit trail

## Development Guidelines

### Testing
- Use staging/sandbox APIs for development
- Test biometric authentication on physical devices
- Verify deep linking on both iOS and Android
- Test payment flows with small amounts

### Security
- Never commit API keys to version control
- Use different keys for staging and production
- Implement proper error handling
- Validate all user inputs
- Monitor transaction success rates

## Documentation

- [`BIOMETRIC_LOGIN_IMPLEMENTATION.md`](./BIOMETRIC_LOGIN_IMPLEMENTATION.md) - Biometric authentication guide
- [`TOP_UP_IMPLEMENTATION.md`](./TOP_UP_IMPLEMENTATION.md) - Top-up functionality documentation
- [`WITHDRAW_IMPLEMENTATION.md`](./WITHDRAW_IMPLEMENTATION.md) - Withdrawal feature guide
- [`FIAT_TO_CRYPTO_WIDGET_IMPLEMENTATION.md`](./FIAT_TO_CRYPTO_WIDGET_IMPLEMENTATION.md) - Widget integration documentation

## Backend Integration

The mobile app integrates with the backend API for:
- User authentication and wallet management
- Transaction processing and history
- Withdrawal requests and account management
- Balance queries and limits checking

Backend endpoints:
- `POST /api/auth/login` - User authentication
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/withdraw` - Process withdrawals
- `GET /api/wallet/transactions` - Transaction history

## Troubleshooting

### Common Issues

1. **Biometric Authentication Not Working**
   - Ensure device has biometric hardware
   - Check if biometric authentication is enrolled
   - Verify app permissions

2. **Widget Not Loading**
   - Check internet connection
   - Verify API keys are correct
   - Ensure WebView permissions

3. **Deep Linking Issues**
   - Verify URL scheme configuration
   - Check app.json deep linking setup
   - Test callback URLs manually

4. **Payment Failures**
   - Check provider-specific error messages
   - Verify transaction limits
   - Review user's payment method

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For technical support:
- Check the documentation files
- Review error logs and console output
- Test with staging environments first
- Contact the development team for assistance
