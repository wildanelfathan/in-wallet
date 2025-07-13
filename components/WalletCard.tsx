import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../theme';
import { Wallet } from '../hooks/useWallet';
import { formatCurrency } from '../utils/formatters';

type WalletCardProps = {
  wallet: Wallet | null;
};

export const WalletCard: React.FC<WalletCardProps> = ({ wallet }) => {
  const theme = useTheme();

  if (!wallet) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
        <Text style={[styles.title, { color: theme.colors.textInverse }]}>
          No Active Wallet
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textInverse }]}>
          Please create or select a wallet
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <Text style={[styles.title, { color: theme.colors.textInverse }]}>
        Total Balance
      </Text>
      <Text style={[styles.balance, { color: theme.colors.textInverse }]}>
        {formatCurrency(wallet.balance, wallet.currency)}
      </Text>
      <View style={styles.footer}>
        <Text style={[styles.footerText, { color: theme.colors.textInverse }]}>
          Wallet ID: {wallet.id.slice(0, 8)}...
        </Text>
        <View style={[styles.statusIndicator, { backgroundColor: theme.colors.success }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
  balance: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerText: {
    fontSize: 14,
    opacity: 0.8,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
}); 