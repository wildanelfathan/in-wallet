import { useState, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { usePrivy } from '@privy-io/react-auth';
import { Alert, Platform } from 'react-native';

interface BiometricLoginResult {
  success: boolean;
  error?: string;
}

interface UseBiometricLoginReturn {
  isSupported: boolean;
  isEnrolled: boolean;
  isLoading: boolean;
  error: string | null;
  authenticate: () => Promise<BiometricLoginResult>;
  checkBiometricSupport: () => Promise<void>;
}

const BIOMETRIC_ENABLED_KEY = 'biometric_enabled';
const BIOMETRIC_USER_KEY = 'biometric_user';

export const useBiometricLogin = (): UseBiometricLoginReturn => {
  const [isSupported, setIsSupported] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { login } = usePrivy();

  const checkBiometricSupport = useCallback(async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      setIsSupported(compatible);
      
      if (compatible) {
        const enrolled = await LocalAuthentication.isEnrolledAsync();
        setIsEnrolled(enrolled);
      }
    } catch (err) {
      setError('Failed to check biometric support');
      console.error('Biometric support check failed:', err);
    }
  }, []);

  const getBiometricType = useCallback(async (): Promise<string> => {
    const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
    
    if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
      return Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition';
    }
    
    if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
      return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
    }
    
    return 'Biometric Authentication';
  }, []);

  const authenticate = useCallback(async (): Promise<BiometricLoginResult> => {
    setIsLoading(true);
    setError(null);

    try {
      // Check if biometric authentication is available
      if (!isSupported || !isEnrolled) {
        throw new Error('Biometric authentication is not available on this device');
      }

      // Check if biometric login is enabled for this user
      const biometricEnabled = await SecureStore.getItemAsync(BIOMETRIC_ENABLED_KEY);
      if (!biometricEnabled) {
        throw new Error('Biometric login is not enabled. Please log in with your regular credentials first.');
      }

      const biometricType = await getBiometricType();
      
      // Prompt for biometric authentication
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Use ${biometricType} to sign in`,
        subtitle: 'Authenticate to access your wallet',
        fallbackLabel: 'Use Password',
        cancelLabel: 'Cancel',
        requireConfirmation: false,
      });

      if (!result.success) {
        if (result.error === 'user_cancel') {
          throw new Error('Authentication was cancelled');
        } else if (result.error === 'user_fallback') {
          throw new Error('User chose to use fallback authentication');
        } else {
          throw new Error('Biometric authentication failed');
        }
      }

      // Get stored user data
      const userData = await SecureStore.getItemAsync(BIOMETRIC_USER_KEY);
      if (!userData) {
        throw new Error('No user data found. Please log in with your regular credentials first.');
      }

      const user = JSON.parse(userData);
      
      // Trigger Privy login
      await login();
      
      return { success: true };
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Biometric authentication failed';
      setError(errorMessage);
      
      // Show alert for better UX
      Alert.alert(
        'Authentication Failed',
        errorMessage,
        [
          { text: 'OK', style: 'default' }
        ]
      );
      
      return { success: false, error: errorMessage };
    } finally {
      setIsLoading(false);
    }
  }, [isSupported, isEnrolled, getBiometricType, login]);

  return {
    isSupported,
    isEnrolled,
    isLoading,
    error,
    authenticate,
    checkBiometricSupport,
  };
};

// Helper hook for enabling biometric login after successful regular login
export const useEnableBiometricLogin = () => {
  const { user } = usePrivy();
  
  const enableBiometricLogin = useCallback(async (): Promise<boolean> => {
    try {
      if (!user) {
        throw new Error('No user logged in');
      }

      // Check biometric availability
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        Alert.alert('Not Supported', 'Biometric authentication is not supported on this device');
        return false;
      }

      const enrolled = await LocalAuthentication.isEnrolledAsync();
      if (!enrolled) {
        Alert.alert('Not Enrolled', 'Please set up biometric authentication in your device settings first');
        return false;
      }

      const biometricType = await (async () => {
        const types = await LocalAuthentication.supportedAuthenticationTypesAsync();
        if (types.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
          return Platform.OS === 'ios' ? 'Face ID' : 'Face Recognition';
        }
        if (types.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
          return Platform.OS === 'ios' ? 'Touch ID' : 'Fingerprint';
        }
        return 'Biometric Authentication';
      })();

      // Confirm biometric setup
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: `Set up ${biometricType} for quick login`,
        subtitle: 'This will allow you to sign in quickly in the future',
        fallbackLabel: 'Cancel',
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        // Store user data and enable biometric login
        await SecureStore.setItemAsync(BIOMETRIC_ENABLED_KEY, 'true');
        await SecureStore.setItemAsync(BIOMETRIC_USER_KEY, JSON.stringify({
          id: user.id,
          email: user.email?.address,
          walletAddress: user.wallet?.address,
        }));
        
        Alert.alert('Success', `${biometricType} login has been enabled!`);
        return true;
      } else {
        Alert.alert('Cancelled', 'Biometric login setup was cancelled');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enable biometric login';
      Alert.alert('Error', errorMessage);
      return false;
    }
  }, [user]);

  const disableBiometricLogin = useCallback(async (): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(BIOMETRIC_ENABLED_KEY);
      await SecureStore.deleteItemAsync(BIOMETRIC_USER_KEY);
      Alert.alert('Success', 'Biometric login has been disabled');
    } catch (err) {
      Alert.alert('Error', 'Failed to disable biometric login');
    }
  }, []);

  return {
    enableBiometricLogin,
    disableBiometricLogin,
  };
};