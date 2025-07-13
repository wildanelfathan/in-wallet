import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../theme';
import { WalletCard } from '../components/WalletCard';
import { QuickActionsGrid } from '../components/QuickActionsGrid';
import TransactionList from '../components/TransactionList';
import { useWallet } from '../hooks/useWallet';
import { Transaction } from '../types';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const theme = useTheme();
  const { activeWallet } = useWallet();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  const quickActions = [
    {
      id: 'send',
      title: 'Send',
      icon: 'send',
      onPress: () => navigation.navigate('Wallet'),
    },
    {
      id: 'receive',
      title: 'Receive',
      icon: 'qr-code',
      onPress: () => navigation.navigate('QR'),
    },
    {
      id: 'bills',
      title: 'Pay Bills',
      icon: 'receipt',
      onPress: () => navigation.navigate('BillPayment'),
    },
    {
      id: 'history',
      title: 'History',
      icon: 'time',
      onPress: () => navigation.navigate('History'),
    },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.content}>
        {/* Wallet Card */}
        <WalletCard wallet={activeWallet} />

        {/* Quick Actions */}
        <View style={styles.section}>
          <QuickActionsGrid actions={quickActions} />
        </View>

        {/* Recent Transactions */}
        <View style={styles.section}>
          <TransactionList transactions={recentTransactions} limit={5} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  section: {
    marginTop: 24,
  },
});

export default HomeScreen; 