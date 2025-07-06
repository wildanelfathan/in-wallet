# In-Wallet Mobile App

A React Native Expo app with biometric authentication integration using Privy for secure wallet login.

## Features

- 🔐 Biometric authentication (Face ID, Touch ID, Fingerprint)
- 🔑 Privy integration for wallet management
- 📱 Cross-platform support (iOS & Android)
- 🔒 Secure local storage for user credentials
- ⚡ Fast authentication with biometric login

## Prerequisites

- Node.js 18+ 
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator or Android Emulator (or physical device)
- Privy account and app ID

## Setup

1. **Install dependencies**:
   ```bash
   cd mobile
   npm install
   ```

2. **Configure Privy**:
   - Update `PRIVY_APP_ID` in `App.tsx` with your actual Privy app ID
   - Configure your Privy app settings at https://console.privy.io

3. **Start the development server**:
   ```bash
   npm start
   ```

## Usage

### Basic Integration

The `useBiometricLogin` hook provides everything you need for biometric authentication:

```tsx
import { useBiometricLogin } from './src/hooks/useBiometricLogin';

function LoginComponent() {
  const {
    isSupported,
    isEnrolled,
    isLoading,
    error,
    authenticate,
    checkBiometricSupport,
  } = useBiometricLogin();

  const handleBiometricLogin = async () => {
    const result = await authenticate();
    if (result.success) {
      // User successfully authenticated
      console.log('Biometric login successful!');
    } else {
      // Handle authentication failure
      console.log('Authentication failed:', result.error);
    }
  };

  return (
    <TouchableOpacity 
      onPress={handleBiometricLogin}
      disabled={!isSupported || !isEnrolled || isLoading}
    >
      <Text>
        {isLoading ? 'Authenticating...' : 'Login with Biometrics'}
      </Text>
    </TouchableOpacity>
  );
}
```

### Enabling Biometric Login

After a successful regular login, users can enable biometric authentication:

```tsx
import { useEnableBiometricLogin } from './src/hooks/useBiometricLogin';

function SettingsComponent() {
  const { enableBiometricLogin, disableBiometricLogin } = useEnableBiometricLogin();

  const handleEnableBiometric = async () => {
    const success = await enableBiometricLogin();
    if (success) {
      console.log('Biometric login enabled!');
    }
  };

  return (
    <TouchableOpacity onPress={handleEnableBiometric}>
      <Text>Enable Biometric Login</Text>
    </TouchableOpacity>
  );
}
```

## How It Works

1. **First Login**: User logs in with regular Privy authentication (email/wallet)
2. **Enable Biometrics**: User can enable biometric login, which stores encrypted user data locally
3. **Subsequent Logins**: User can authenticate with biometrics, which then triggers Privy login automatically

## Security

- User credentials are stored securely using Expo SecureStore
- Biometric authentication is handled by the device's secure enclave
- No sensitive data is transmitted over the network during biometric authentication
- Full integration with Privy's secure authentication system

## API Reference

### `useBiometricLogin()`

Returns an object with the following properties:

- `isSupported: boolean` - Whether biometric authentication is supported
- `isEnrolled: boolean` - Whether biometric authentication is enrolled on the device
- `isLoading: boolean` - Whether authentication is in progress
- `error: string | null` - Any authentication error
- `authenticate: () => Promise<BiometricLoginResult>` - Trigger biometric authentication
- `checkBiometricSupport: () => Promise<void>` - Check device biometric support

### `useEnableBiometricLogin()`

Returns an object with the following methods:

- `enableBiometricLogin: () => Promise<boolean>` - Enable biometric login for current user
- `disableBiometricLogin: () => Promise<void>` - Disable biometric login

## Configuration

### iOS
- Face ID usage is configured in `app.json` under `ios.infoPlist.NSFaceIDUsageDescription`

### Android
- Fingerprint permissions are configured in `app.json` under `android.permissions`

## Troubleshooting

### Common Issues

1. **Biometric not supported**: Check if device has biometric hardware
2. **Not enrolled**: User needs to set up biometric authentication in device settings
3. **Authentication failed**: User may have cancelled or failed biometric verification
4. **No user data**: User needs to log in with regular credentials first

### Testing

- Use iOS Simulator: Go to Device > Face ID/Touch ID > Toggle Enrollment
- Use Android Emulator: Settings > Security > Fingerprint, add fingerprint in extended controls

## Platform Support

- **iOS**: Face ID, Touch ID
- **Android**: Fingerprint, face unlock (device dependent)
- **Web**: Fallback to regular login (biometrics not supported)

## Dependencies

- `expo-local-authentication` - Biometric authentication
- `expo-secure-store` - Secure local storage
- `@privy-io/react-auth` - Privy authentication
- `@privy-io/expo` - Privy Expo integration