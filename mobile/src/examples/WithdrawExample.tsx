import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { usePrivy } from '@privy-io/react-auth';
import { Ionicons } from '@expo/vector-icons';
import WithdrawPage from '../screens/WithdrawPage';
import { useWithdraw } from '../hooks/useWithdraw';

/**
 * Complete example showing how to integrate WithdrawPage
 * with navigation, state management, and wallet functionality
 */
const WithdrawExample: React.FC = () => {
  const { authenticated, user } = usePrivy();
  const { walletBalance, destinationAccounts } = useWithdraw();
  const [currentScreen, setCurrentScreen] = useState<'dashboard' | 'withdraw'>('dashboard');

  const handleWithdrawPress = () => {
    setCurrentScreen('withdraw');
  };

  const handleBackToDashboard = () => {
    setCurrentScreen('dashboard');
  };

  if (!authenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centerContent}>
          <Ionicons name="wallet" size={64} color="#666" />
          <Text style={styles.title}>Wallet Access Required</Text>
          <Text style={styles.subtitle}>
            Please log in to access your wallet and withdrawal features
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (currentScreen === 'withdraw') {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackToDashboard} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Withdraw Funds</Text>
          <View style={styles.backButton} />
        </View>
        <WithdrawPage />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.dashboardContainer}>
          {/* Header */}
          <View style={styles.walletHeader}>
            <Text style={styles.walletTitle}>Your Wallet</Text>
            <Text style={styles.walletAddress} numberOfLines={1}>
              {user?.wallet?.address || 'No wallet connected'}
            </Text>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <Text style={styles.balanceLabel}>Available Balance</Text>
            <Text style={styles.balanceAmount}>
              ${walletBalance?.available || '0.00'}
            </Text>
            <Text style={styles.balanceCurrency}>USD</Text>
            
            {walletBalance && parseFloat(walletBalance.pending) > 0 && (
              <Text style={styles.pendingAmount}>
                ${walletBalance.pending} pending
              </Text>
            )}
          </View>

          {/* Quick Actions */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity
              style={[styles.actionButton, styles.withdrawButton]}
              onPress={handleWithdrawPress}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="arrow-up" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Withdraw</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.sendButton]}>
              <View style={styles.actionIcon}>
                <Ionicons name="send" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Send</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.actionButton, styles.receiveButton]}>
              <View style={styles.actionIcon}>
                <Ionicons name="qr-code" size={24} color="#fff" />
              </View>
              <Text style={styles.actionText}>Receive</Text>
            </TouchableOpacity>
          </View>

          {/* Destination Accounts Summary */}
          <View style={styles.accountsCard}>
            <View style={styles.accountsHeader}>
              <Text style={styles.accountsTitle}>Withdrawal Accounts</Text>
              <TouchableOpacity>
                <Text style={styles.manageText}>Manage</Text>
              </TouchableOpacity>
            </View>

            {destinationAccounts.length > 0 ? (
              <View style={styles.accountsList}>
                {destinationAccounts.slice(0, 3).map((account) => (
                  <View key={account.id} style={styles.accountItem}>
                    <View style={styles.accountIcon}>
                      <Ionicons
                        name={account.type === 'bank_account' ? 'card' : 'wallet'}
                        size={20}
                        color="#676FFF"
                      />
                    </View>
                    <View style={styles.accountInfo}>
                      <Text style={styles.accountName}>
                        {account.type === 'bank_account' 
                          ? `${account.bankName} ****${account.accountNumber.slice(-4)}`
                          : `${account.ewalletType?.toUpperCase()} - ${account.name}`
                        }
                      </Text>
                      <View style={styles.accountStatus}>
                        <Ionicons
                          name={account.isVerified ? "checkmark-circle" : "time"}
                          size={14}
                          color={account.isVerified ? "#34C759" : "#FF9500"}
                        />
                        <Text style={[
                          styles.statusText,
                          { color: account.isVerified ? "#34C759" : "#FF9500" }
                        ]}>
                          {account.isVerified ? 'Verified' : 'Pending'}
                        </Text>
                      </View>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color="#ccc" />
                  </View>
                ))}
                
                {destinationAccounts.length > 3 && (
                  <Text style={styles.moreAccountsText}>
                    +{destinationAccounts.length - 3} more accounts
                  </Text>
                )}
              </View>
            ) : (
              <View style={styles.noAccountsContainer}>
                <Ionicons name="card-outline" size={32} color="#ccc" />
                <Text style={styles.noAccountsText}>No withdrawal accounts</Text>
                <Text style={styles.noAccountsSubtext}>
                  Add a bank account or eWallet to withdraw funds
                </Text>
                <TouchableOpacity style={styles.addAccountButton}>
                  <Text style={styles.addAccountText}>Add Account</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Quick Withdraw Shortcuts */}
          {destinationAccounts.length > 0 && walletBalance && parseFloat(walletBalance.available) > 0 && (
            <View style={styles.quickWithdrawCard}>
              <Text style={styles.quickWithdrawTitle}>Quick Withdraw</Text>
              <View style={styles.quickAmountButtons}>
                {['25', '50', '100', '250'].map((amount) => {
                  const availableAmount = parseFloat(walletBalance.available);
                  const amountNum = parseFloat(amount);
                  const isDisabled = amountNum > availableAmount;
                  
                  return (
                    <TouchableOpacity
                      key={amount}
                      style={[
                        styles.quickAmountButton,
                        isDisabled && styles.quickAmountButtonDisabled
                      ]}
                      onPress={handleWithdrawPress}
                      disabled={isDisabled}
                    >
                      <Text style={[
                        styles.quickAmountText,
                        isDisabled && styles.quickAmountTextDisabled
                      ]}>
                        ${amount}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* Recent Activity */}
          <View style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityTitle}>Recent Activity</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View All</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.activityList}>
              {/* Mock recent transactions */}
              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="arrow-up" size={16} color="#FF3B30" />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityDescription}>Withdrawal to Chase Bank</Text>
                  <Text style={styles.activityDate}>2 hours ago</Text>
                </View>
                <Text style={styles.activityAmount}>-$500.00</Text>
              </View>

              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="arrow-down" size={16} color="#34C759" />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityDescription}>Top-up via Transak</Text>
                  <Text style={styles.activityDate}>Yesterday</Text>
                </View>
                <Text style={styles.activityAmount}>+$100.00</Text>
              </View>

              <View style={styles.activityItem}>
                <View style={styles.activityIcon}>
                  <Ionicons name="arrow-up" size={16} color="#FF3B30" />
                </View>
                <View style={styles.activityInfo}>
                  <Text style={styles.activityDescription}>Withdrawal to PayPal</Text>
                  <Text style={styles.activityDate}>3 days ago</Text>
                </View>
                <Text style={styles.activityAmount}>-$250.00</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    flex: 1,
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
  dashboardContainer: {
    padding: 20,
  },
  walletHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  walletTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  walletAddress: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'Courier',
  },
  balanceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
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
    fontSize: 16,
    color: '#666',
  },
  pendingAmount: {
    fontSize: 14,
    color: '#FF9500',
    marginTop: 8,
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  withdrawButton: {
    backgroundColor: '#676FFF',
  },
  sendButton: {
    backgroundColor: '#34C759',
  },
  receiveButton: {
    backgroundColor: '#FF9500',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  accountsCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  accountsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  accountsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  manageText: {
    fontSize: 14,
    color: '#676FFF',
    fontWeight: '500',
  },
  accountsList: {
    gap: 12,
  },
  accountItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  accountIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accountInfo: {
    flex: 1,
  },
  accountName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 4,
  },
  accountStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '500',
  },
  moreAccountsText: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 8,
  },
  noAccountsContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  noAccountsText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  noAccountsSubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 16,
  },
  addAccountButton: {
    backgroundColor: '#676FFF',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addAccountText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  quickWithdrawCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickWithdrawTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  quickAmountButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  quickAmountButton: {
    flex: 1,
    backgroundColor: '#676FFF',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quickAmountButtonDisabled: {
    backgroundColor: '#ccc',
  },
  quickAmountText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  quickAmountTextDisabled: {
    color: '#999',
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  activityTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  viewAllText: {
    fontSize: 14,
    color: '#676FFF',
    fontWeight: '500',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityDescription: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  activityDate: {
    fontSize: 12,
    color: '#666',
  },
  activityAmount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
});

export default WithdrawExample;