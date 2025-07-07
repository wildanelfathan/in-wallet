import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

interface Props {
  navigation: any;
}

const AddMoneyScreen: React.FC<Props> = ({ navigation }) => {
  const [amount, setAmount] = useState('4');
  const [selectedCurrency, setSelectedCurrency] = useState('SGD');

  const handleAddMoney = () => {
    Alert.alert(
      'Add Money',
      `Add ${amount} ${selectedCurrency} to your wallet?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            Alert.alert('Success', 'Money added successfully!');
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Add money</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.balanceText}>You have 15 SGD</Text>

        <View style={styles.amountSection}>
          <Text style={styles.label}>Add</Text>
          <View style={styles.amountInputContainer}>
            <TextInput
              style={styles.amountInput}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              placeholder="0"
            />
            <View style={styles.currencyBadge}>
              <Ionicons name="flag" size={16} color={COLORS.primary} />
              <Text style={styles.currencyText}>SGD</Text>
            </View>
          </View>
        </View>

        <View style={styles.paymentSection}>
          <Text style={styles.label}>You'll pay</Text>
          <TouchableOpacity style={styles.currencySelector}>
            <View style={styles.currencyRow}>
              <Ionicons name="flag" size={20} color={COLORS.primary} />
              <Text style={styles.currencyName}>Singapore Dollar</Text>
            </View>
            <Ionicons name="chevron-down" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        {/* Promotion Banner */}
        <View style={styles.promotionBanner}>
          <LinearGradient
            colors={[COLORS.warning, '#FFA726']}
            style={styles.promotionGradient}
          >
            <View style={styles.promotionContent}>
              <View style={styles.promotionIcon}>
                <Text style={styles.promotionEmoji}>💰</Text>
              </View>
              <View style={styles.promotionText}>
                <Text style={styles.promotionTitle}>
                  Get your salary or pension paid to your InWallet account
                </Text>
                <TouchableOpacity>
                  <Text style={styles.promotionLink}>Switch now</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.closePromotion}>
                <Ionicons name="close" size={20} color={COLORS.textPrimary} />
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>

        {/* Payment Methods */}
        <View style={styles.paymentMethods}>
          <Text style={styles.sectionTitle}>Payment Methods</Text>
          
          <TouchableOpacity style={styles.paymentMethod}>
            <View style={styles.paymentMethodLeft}>
              <Ionicons name="card-outline" size={24} color={COLORS.primary} />
              <Text style={styles.paymentMethodText}>Debit/Credit Card</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentMethod}>
            <View style={styles.paymentMethodLeft}>
              <Ionicons name="business-outline" size={24} color={COLORS.primary} />
              <Text style={styles.paymentMethodText}>Bank Transfer</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.paymentMethod}>
            <View style={styles.paymentMethodLeft}>
              <Ionicons name="logo-apple" size={24} color={COLORS.textPrimary} />
              <Text style={styles.paymentMethodText}>Apple Pay</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.continueButton} onPress={handleAddMoney}>
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  closeButton: {
    padding: SIZES.sm,
  },
  headerTitle: {
    fontSize: SIZES.textLg,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  placeholder: {
    width: 40,
  },
  content: {
    padding: SIZES.lg,
  },
  balanceText: {
    fontSize: SIZES.textBase,
    color: COLORS.textSecondary,
    marginBottom: SIZES.xl,
  },
  amountSection: {
    marginBottom: SIZES.xl,
  },
  label: {
    fontSize: SIZES.textBase,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.md,
  },
  amountInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.md,
    height: 60,
  },
  amountInput: {
    flex: 1,
    fontSize: SIZES.text3xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  currencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.sm,
    borderRadius: SIZES.radiusMd,
    gap: SIZES.xs,
  },
  currencyText: {
    fontSize: SIZES.textBase,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  paymentSection: {
    marginBottom: SIZES.xl,
  },
  currencySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.md,
    paddingVertical: SIZES.md,
  },
  currencyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
  },
  currencyName: {
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
  },
  promotionBanner: {
    marginBottom: SIZES.xl,
    borderRadius: SIZES.radiusMd,
    overflow: 'hidden',
  },
  promotionGradient: {
    padding: SIZES.lg,
  },
  promotionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promotionIcon: {
    marginRight: SIZES.md,
  },
  promotionEmoji: {
    fontSize: SIZES.text2xl,
  },
  promotionText: {
    flex: 1,
  },
  promotionTitle: {
    fontSize: SIZES.textBase,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.xs,
  },
  promotionLink: {
    fontSize: SIZES.textBase,
    fontWeight: '600',
    color: COLORS.textPrimary,
    textDecorationLine: 'underline',
  },
  closePromotion: {
    padding: SIZES.sm,
  },
  paymentMethods: {
    marginBottom: SIZES.xl,
  },
  sectionTitle: {
    fontSize: SIZES.textLg,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.md,
  },
  paymentMethod: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  paymentMethodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.md,
  },
  paymentMethodText: {
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
  },
  continueButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusMd,
    paddingVertical: SIZES.md,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  continueButtonText: {
    fontSize: SIZES.textLg,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
});

export default AddMoneyScreen;