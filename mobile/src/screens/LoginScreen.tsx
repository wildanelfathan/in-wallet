import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { usePrivy } from '@privy-io/react-auth';
import { useBiometricLogin, useEnableBiometricLogin } from '../hooks/useBiometricLogin';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen: React.FC = () => {
  const { login, logout, ready, authenticated, user } = usePrivy();
  const {
    isSupported,
    isEnrolled,
    isLoading: biometricLoading,
    error: biometricError,
    authenticate: biometricAuthenticate,
    checkBiometricSupport,
  } = useBiometricLogin();
  const { enableBiometricLogin, disableBiometricLogin } = useEnableBiometricLogin();

  const [regularLoginLoading, setRegularLoginLoading] = useState(false);

  useEffect(() => {
    if (ready) {
      checkBiometricSupport();
    }
  }, [ready, checkBiometricSupport]);

  const handleRegularLogin = async () => {
    setRegularLoginLoading(true);
    try {
      await login();
    } catch (error) {
      Alert.alert('Login Failed', 'Unable to log in. Please try again.');
    } finally {
      setRegularLoginLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    const result = await biometricAuthenticate();
    if (result.success) {
      Alert.alert('Success', 'Successfully logged in with biometric authentication!');
    }
  };

  const handleLogout = async () => {
    await logout();
  };

  const getBiometricIcon = () => {
    if (Platform.OS === 'ios') {
      return isSupported ? 'ios-finger-print' : 'ios-lock-closed';
    }
    return isSupported ? 'md-finger-print' : 'md-lock-closed';
  };

  const getBiometricText = () => {
    if (!isSupported) return 'Biometric authentication not supported';
    if (!isEnrolled) return 'No biometric authentication enrolled';
    return Platform.OS === 'ios' ? 'Sign in with Face ID / Touch ID' : 'Sign in with Fingerprint';
  };

  if (!ready) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#676FFF" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  if (authenticated && user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome!</Text>
          <Text style={styles.subtitle}>You are successfully logged in</Text>
        </View>

        <View style={styles.userInfo}>
          <Text style={styles.userInfoTitle}>User Information</Text>
          <Text style={styles.userInfoText}>Email: {user.email?.address || 'N/A'}</Text>
          <Text style={styles.userInfoText}>Wallet: {user.wallet?.address || 'N/A'}</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={enableBiometricLogin}
            disabled={!isSupported || !isEnrolled}
          >
            <Ionicons name="ios-finger-print" size={20} color="#fff" />
            <Text style={styles.buttonText}>Enable Biometric Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={disableBiometricLogin}
          >
            <Ionicons name="ios-lock-closed" size={20} color="#676FFF" />
            <Text style={[styles.buttonText, styles.secondaryButtonText]}>
              Disable Biometric Login
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.dangerButton]}
            onPress={handleLogout}
          >
            <Text style={styles.buttonText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>In-Wallet</Text>
        <Text style={styles.subtitle}>Secure mobile wallet authentication</Text>
      </View>

      <View style={styles.loginSection}>
        {/* Biometric Login Button */}
        {isSupported && isEnrolled && (
          <TouchableOpacity
            style={[styles.button, styles.biometricButton]}
            onPress={handleBiometricLogin}
            disabled={biometricLoading}
          >
            {biometricLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Ionicons name={getBiometricIcon()} size={24} color="#fff" />
            )}
            <Text style={styles.buttonText}>
              {biometricLoading ? 'Authenticating...' : getBiometricText()}
            </Text>
          </TouchableOpacity>
        )}

        {/* Regular Login Button */}
        <TouchableOpacity
          style={[styles.button, styles.regularButton]}
          onPress={handleRegularLogin}
          disabled={regularLoginLoading}
        >
          {regularLoginLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Ionicons name="ios-log-in" size={20} color="#fff" />
          )}
          <Text style={styles.buttonText}>
            {regularLoginLoading ? 'Logging in...' : 'Login with Email/Wallet'}
          </Text>
        </TouchableOpacity>

        {/* Biometric Status */}
        {!isSupported && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              Biometric authentication is not supported on this device
            </Text>
          </View>
        )}

        {isSupported && !isEnrolled && (
          <View style={styles.statusContainer}>
            <Text style={styles.statusText}>
              Please set up biometric authentication in your device settings
            </Text>
          </View>
        )}

        {biometricError && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{biometricError}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#676FFF',
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  loginSection: {
    flex: 1,
    justifyContent: 'center',
    gap: 16,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#676FFF',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  biometricButton: {
    backgroundColor: '#2ECC71',
  },
  regularButton: {
    backgroundColor: '#676FFF',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#676FFF',
  },
  dangerButton: {
    backgroundColor: '#E74C3C',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#676FFF',
  },
  userInfo: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  userInfoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  statusContainer: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  statusText: {
    color: '#856404',
    fontSize: 14,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#F8D7DA',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  errorText: {
    color: '#721C24',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default LoginScreen;