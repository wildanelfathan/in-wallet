import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

interface Props {
  navigation: any;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('All');

  const currencies = [
    {
      code: 'USD',
      name: 'US Dollar',
      flag: '🇺🇸',
      balance: 1234.56,
      color: COLORS.info,
    },
    {
      code: 'EUR',
      name: 'Euro',
      flag: '🇪🇺',
      balance: 892.30,
      color: COLORS.success,
    },
    {
      code: 'BTC',
      name: 'Bitcoin',
      flag: '₿',
      balance: 0.0234,
      color: COLORS.warning,
    },
    {
      code: 'SGD',
      name: 'Singapore Dollar',
      flag: '🇸🇬',
      balance: 15.00,
      color: COLORS.primary,
    },
  ];

  const transactions = [
    {
      id: '1',
      type: 'sent',
      title: 'For your InWallet card',
      description: 'Paid • Today',
      amount: '9 SGD',
      icon: 'arrow-up',
    },
    {
      id: '2',
      type: 'received',
      title: 'To your SGD balance',
      description: 'Added • Today',
      amount: '24 SGD',
      icon: 'add',
    },
    {
      id: '3',
      type: 'sent',
      title: 'Coffee Shop Payment',
      description: 'Paid • Yesterday',
      amount: '12.50 USD',
      icon: 'arrow-up',
    },
  ];

  const onRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Account</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.earnButton}>
              <Text style={styles.earnButtonText}>Earn $115</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationButton}>
              <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Filter Tabs */}
        <View style={styles.tabContainer}>
          {['All', 'Interest'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[
                styles.tab,
                selectedTab === tab && styles.activeTab,
              ]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  selectedTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Currency Cards */}
        <View style={styles.currencyContainer}>
          {currencies.map((currency, index) => (
            <TouchableOpacity
              key={currency.code}
              style={[
                styles.currencyCard,
                index % 2 === 0 ? styles.leftCard : styles.rightCard,
              ]}
              onPress={() => navigation.navigate('AddMoney')}
            >
              <View style={styles.currencyHeader}>
                <View style={styles.flagContainer}>
                  <Text style={styles.flag}>{currency.flag}</Text>
                </View>
              </View>
              <View style={styles.currencyContent}>
                <Text style={styles.currencyBalance}>
                  {currency.balance.toLocaleString('en-US', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: currency.code === 'BTC' ? 4 : 2,
                  })}
                </Text>
                <Text style={styles.currencyName}>{currency.name}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Transactions Section */}
        <View style={styles.transactionsSection}>
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionHistory')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.transactionsList}>
            {transactions.map((transaction) => (
              <TouchableOpacity key={transaction.id} style={styles.transactionItem}>
                <View style={styles.transactionLeft}>
                  <View style={[
                    styles.transactionIcon,
                    { backgroundColor: transaction.type === 'sent' ? COLORS.surfaceGray : COLORS.primaryLight }
                  ]}>
                    <Ionicons
                      name={transaction.icon as any}
                      size={20}
                      color={transaction.type === 'sent' ? COLORS.textSecondary : COLORS.primary}
                    />
                  </View>
                  <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>{transaction.title}</Text>
                    <Text style={styles.transactionDescription}>{transaction.description}</Text>
                  </View>
                </View>
                <Text style={[
                  styles.transactionAmount,
                  { color: transaction.type === 'sent' ? COLORS.textPrimary : COLORS.success }
                ]}>
                  {transaction.type === 'received' ? '+' : ''}{transaction.amount}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('QRScanner')}
          >
            <Ionicons name="qr-code-outline" size={24} color={COLORS.primary} />
            <Text style={styles.quickActionText}>Scan QR</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('SendMoney')}
          >
            <Ionicons name="send-outline" size={24} color={COLORS.primary} />
            <Text style={styles.quickActionText}>Send Money</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.quickActionButton}
            onPress={() => navigation.navigate('CardOrder')}
          >
            <Ionicons name="card-outline" size={24} color={COLORS.primary} />
            <Text style={styles.quickActionText}>Order Card</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    paddingBottom: SIZES.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: SIZES.text3xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
  },
  earnButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusFull,
  },
  earnButtonText: {
    color: COLORS.textWhite,
    fontSize: SIZES.textSm,
    fontWeight: '600',
  },
  notificationButton: {
    padding: SIZES.sm,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.lg,
  },
  tab: {
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusFull,
    marginRight: SIZES.md,
  },
  activeTab: {
    backgroundColor: COLORS.textPrimary,
  },
  tabText: {
    fontSize: SIZES.textBase,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  activeTabText: {
    color: COLORS.textWhite,
  },
  currencyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.xl,
  },
  currencyCard: {
    width: '48%',
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    marginBottom: SIZES.md,
    ...SHADOWS.small,
  },
  leftCard: {
    marginRight: '4%',
  },
  rightCard: {
    marginLeft: 0,
  },
  currencyHeader: {
    marginBottom: SIZES.lg,
  },
  flagContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flag: {
    fontSize: SIZES.textXl,
  },
  currencyContent: {},
  currencyBalance: {
    fontSize: SIZES.text2xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.xs,
  },
  currencyName: {
    fontSize: SIZES.textSm,
    color: COLORS.textSecondary,
  },
  transactionsSection: {
    paddingHorizontal: SIZES.lg,
    marginBottom: SIZES.xl,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  transactionsTitle: {
    fontSize: SIZES.text2xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  seeAllText: {
    fontSize: SIZES.textBase,
    color: COLORS.primary,
    fontWeight: '500',
    textDecorationLine: 'underline',
  },
  transactionsList: {},
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: SIZES.textBase,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginBottom: SIZES.xs,
  },
  transactionDescription: {
    fontSize: SIZES.textSm,
    color: COLORS.textSecondary,
  },
  transactionAmount: {
    fontSize: SIZES.textBase,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.lg,
    backgroundColor: COLORS.surface,
    marginHorizontal: SIZES.lg,
    borderRadius: SIZES.radiusLg,
  },
  quickActionButton: {
    alignItems: 'center',
    padding: SIZES.md,
  },
  quickActionText: {
    fontSize: SIZES.textSm,
    color: COLORS.textPrimary,
    marginTop: SIZES.xs,
    fontWeight: '500',
  },
});

export default HomeScreen;