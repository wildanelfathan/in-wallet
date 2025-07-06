import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { usePrivy } from '@privy-io/react-auth';
import { Ionicons } from '@expo/vector-icons';
import TopUpPage from '../screens/TopUpPage';
import TopUpButton from '../components/TopUpButton';

/**
 * Complete example showing how to integrate TopUpPage
 * with navigation and state management
 */
const TopUpExample: React.FC = () => {
  const { authenticated, user } = usePrivy();
  const [currentScreen, setCurrentScreen] = useState<'home' | 'topup'>('home');
  const [walletBalance, setWalletBalance] = useState('0.00');

  const handleTopUpPress = () => {
    setCurrentScreen('topup');
  };

  const handleBackToHome = () => {
    setCurrentScreen('home');
  };

  const handleTopUpSuccess = (amount: string, currency: string) => {
    // Update wallet balance after successful top-up
    // This would typically come from your backend/blockchain
    const newBalance = (parseFloat(walletBalance) + parseFloat(amount)).toFixed(2);
    setWalletBalance(newBalance);
    setCurrentScreen('home');
  };

  if (!authenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="wallet" size={64} color="#666" />
          <Text style={styles.title}>Wallet Access Required</Text>
          <Text style={styles.subtitle}>
            Please log in to access your wallet and top-up features
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (currentScreen === 'topup') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToHome} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Top Up Wallet</Text>
          <View style={styles.backButton} />
        </View>
        <TopUpPage />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.walletContainer}>
        <View style={styles.walletHeader}>
          <Text style={styles.walletTitle}>Your Wallet</Text>
          <Text style={styles.walletAddress} numberOfLines={1}>
            {user?.wallet?.address || 'No wallet connected'}
          </Text>
        </View>

        <View style={styles.balanceContainer}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>${walletBalance}</Text>
          <Text style={styles.balanceCurrency}>USD</Text>
        </View>

        <View style={styles.actionsContainer}>
          <TopUpButton
            onPress={handleTopUpPress}
            title="Add Funds"
            size="large"
            variant="primary"
          />

          <TouchableOpacity style={styles.secondaryAction}>
            <Ionicons name="send" size={20} color="#676FFF" />
            <Text style={styles.secondaryActionText}>Send</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryAction}>
            <Ionicons name="card" size={20} color="#676FFF" />
            <Text style={styles.secondaryActionText}>Receive</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>Quick Actions</Text>
          
          <TouchableOpacity style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="trending-up" size={20} color="#34C759" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Buy Crypto</Text>
              <Text style={styles.featureDescription}>
                Purchase crypto with credit card or bank transfer
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="swap-horizontal" size={20} color="#FF9500" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Swap Tokens</Text>
              <Text style={styles.featureDescription}>
                Exchange between different cryptocurrencies
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.featureItem}>
            <View style={styles.featureIcon}>
              <Ionicons name="shield-checkmark" size={20} color="#676FFF" />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Security</Text>
              <Text style={styles.featureDescription}>
                Enable biometric login and security features
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  backButton: {
    padding: 8,
    width: 40,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
  walletContainer: {
    flex: 1,
    padding: 20,
  },
  walletHeader: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  walletTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  walletAddress: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Courier',
  },
  balanceContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceLabel: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  balanceCurrency: {
    fontSize: 14,
    color: '#666',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  secondaryAction: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
    gap: 8,
  },
  secondaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#676FFF',
  },
  featuresContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
});

export default TopUpExample;