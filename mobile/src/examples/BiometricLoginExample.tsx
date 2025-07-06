import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useBiometricLogin, useEnableBiometricLogin } from '../hooks/useBiometricLogin';
import { usePrivy } from '@privy-io/react-auth';

/**
 * Example 1: Basic Biometric Login Button
 * Shows how to implement a simple biometric login button
 */
export const BasicBiometricLoginExample: React.FC = () => {
  const { authenticate, isSupported, isEnrolled, isLoading } = useBiometricLogin();

  const handleBiometricLogin = async () => {
    const result = await authenticate();
    if (result.success) {
      Alert.alert('Success', 'Logged in successfully!');
    }
    // Error handling is done automatically by the hook
  };

  if (!isSupported) {
    return (
      <View style={styles.container}>
        <Text style={styles.warningText}>
          Biometric authentication is not supported on this device
        </Text>
      </View>
    );
  }

  if (!isEnrolled) {
    return (
      <View style={styles.container}>
        <Text style={styles.warningText}>
          Please set up biometric authentication in your device settings
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={handleBiometricLogin}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Authenticating...' : 'Login with Biometrics'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Example 2: Advanced Biometric Login with Status
 * Shows how to display detailed biometric authentication status
 */
export const AdvancedBiometricLoginExample: React.FC = () => {
  const {
    isSupported,
    isEnrolled,
    isLoading,
    error,
    authenticate,
    checkBiometricSupport,
  } = useBiometricLogin();

  const [statusMessage, setStatusMessage] = useState<string>('');

  useEffect(() => {
    checkBiometricSupport();
  }, [checkBiometricSupport]);

  useEffect(() => {
    if (!isSupported) {
      setStatusMessage('Biometric authentication is not supported');
    } else if (!isEnrolled) {
      setStatusMessage('No biometric authentication enrolled');
    } else {
      setStatusMessage('Biometric authentication is available');
    }
  }, [isSupported, isEnrolled]);

  const handleBiometricLogin = async () => {
    setStatusMessage('Authenticating...');
    const result = await authenticate();
    
    if (result.success) {
      setStatusMessage('Authentication successful!');
    } else {
      setStatusMessage(result.error || 'Authentication failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biometric Login Status</Text>
      <Text style={styles.statusText}>{statusMessage}</Text>
      
      {error && (
        <Text style={styles.errorText}>Error: {error}</Text>
      )}

      <TouchableOpacity
        style={[
          styles.button,
          (!isSupported || !isEnrolled || isLoading) && styles.buttonDisabled
        ]}
        onPress={handleBiometricLogin}
        disabled={!isSupported || !isEnrolled || isLoading}
      >
        <Text style={styles.buttonText}>
          {isLoading ? 'Authenticating...' : 'Authenticate'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

/**
 * Example 3: Biometric Settings Management
 * Shows how to enable/disable biometric login after regular login
 */
export const BiometricSettingsExample: React.FC = () => {
  const { user, authenticated } = usePrivy();
  const { enableBiometricLogin, disableBiometricLogin } = useEnableBiometricLogin();
  const { isSupported, isEnrolled } = useBiometricLogin();

  const [isBiometricEnabled, setIsBiometricEnabled] = useState(false);

  // Check if biometric login is already enabled
  useEffect(() => {
    const checkBiometricStatus = async () => {
      // You could implement a function to check if biometric is enabled
      // For now, we'll assume it's not enabled by default
      setIsBiometricEnabled(false);
    };
    
    if (authenticated) {
      checkBiometricStatus();
    }
  }, [authenticated]);

  const handleEnableBiometric = async () => {
    const success = await enableBiometricLogin();
    if (success) {
      setIsBiometricEnabled(true);
    }
  };

  const handleDisableBiometric = async () => {
    await disableBiometricLogin();
    setIsBiometricEnabled(false);
  };

  if (!authenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.warningText}>
          Please log in first to manage biometric settings
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Biometric Settings</Text>
      
      <View style={styles.userInfo}>
        <Text style={styles.userInfoText}>
          User: {user?.email?.address || 'Unknown'}
        </Text>
        <Text style={styles.userInfoText}>
          Biometric Status: {isBiometricEnabled ? 'Enabled' : 'Disabled'}
        </Text>
      </View>

      {!isSupported && (
        <Text style={styles.warningText}>
          Biometric authentication is not supported on this device
        </Text>
      )}

      {isSupported && !isEnrolled && (
        <Text style={styles.warningText}>
          Please set up biometric authentication in your device settings first
        </Text>
      )}

      {isSupported && isEnrolled && (
        <View style={styles.buttonContainer}>
          {!isBiometricEnabled ? (
            <TouchableOpacity
              style={styles.button}
              onPress={handleEnableBiometric}
            >
              <Text style={styles.buttonText}>Enable Biometric Login</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.button, styles.dangerButton]}
              onPress={handleDisableBiometric}
            >
              <Text style={styles.buttonText}>Disable Biometric Login</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

/**
 * Example 4: Complete Login Flow
 * Shows a complete login flow with both regular and biometric options
 */
export const CompleteLoginFlowExample: React.FC = () => {
  const { login, authenticated, user } = usePrivy();
  const { authenticate, isSupported, isEnrolled, isLoading } = useBiometricLogin();

  const [regularLoginLoading, setRegularLoginLoading] = useState(false);

  const handleRegularLogin = async () => {
    setRegularLoginLoading(true);
    try {
      await login();
    } catch (error) {
      Alert.alert('Error', 'Regular login failed');
    } finally {
      setRegularLoginLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    const result = await authenticate();
    if (result.success) {
      Alert.alert('Success', 'Biometric login successful!');
    }
  };

  if (authenticated) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>
          You are logged in as {user?.email?.address}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Login Method</Text>

      {/* Biometric Login Option */}
      {isSupported && isEnrolled && (
        <TouchableOpacity
          style={[styles.button, styles.biometricButton]}
          onPress={handleBiometricLogin}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Authenticating...' : 'Login with Biometrics'}
          </Text>
        </TouchableOpacity>
      )}

      {/* Regular Login Option */}
      <TouchableOpacity
        style={[styles.button, styles.regularButton]}
        onPress={handleRegularLogin}
        disabled={regularLoginLoading}
      >
        <Text style={styles.buttonText}>
          {regularLoginLoading ? 'Logging in...' : 'Login with Email/Wallet'}
        </Text>
      </TouchableOpacity>

      {/* Status Messages */}
      {!isSupported && (
        <Text style={styles.infoText}>
          Biometric authentication is not supported on this device
        </Text>
      )}

      {isSupported && !isEnrolled && (
        <Text style={styles.infoText}>
          Set up biometric authentication in your device settings for quick login
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
    minWidth: 200,
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  biometricButton: {
    backgroundColor: '#34C759',
  },
  regularButton: {
    backgroundColor: '#007AFF',
  },
  dangerButton: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  warningText: {
    fontSize: 14,
    color: '#FF9500',
    textAlign: 'center',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#FF3B30',
    textAlign: 'center',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
  },
  userInfo: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
  },
  userInfoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
});