import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

const CardOrderScreen: React.FC<Props> = ({ navigation }) => {
  const [selectedCardType, setSelectedCardType] = useState('standard');

  const handleOrderCard = () => {
    Alert.alert(
      'Order InWallet Card',
      'Order your physical debit card for 9 SGD?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Order',
          onPress: () => {
            Alert.alert('Success', 'Card ordered successfully! It will arrive in 5-7 business days.');
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
        <Text style={styles.headerTitle}>Order Card</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Card Preview */}
        <View style={styles.cardPreview}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.primaryDark]}
            style={styles.card}
          >
            <View style={styles.cardHeader}>
              <Text style={styles.cardBrand}>InWallet</Text>
              <View style={styles.chipIcon}>
                <Ionicons name="radio-button-on" size={32} color={COLORS.textWhite} />
              </View>
            </View>
            <View style={styles.cardNumber}>
              <Text style={styles.cardNumberText}>•••• •••• •••• 1234</Text>
            </View>
            <View style={styles.cardFooter}>
              <View>
                <Text style={styles.cardLabel}>CARDHOLDER</Text>
                <Text style={styles.cardValue}>YOUR NAME</Text>
              </View>
              <View>
                <Text style={styles.cardLabel}>EXPIRES</Text>
                <Text style={styles.cardValue}>12/28</Text>
              </View>
              <Text style={styles.visaLogo}>VISA</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Card Info */}
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>GET A DEBIT CARD FOR 9 SGD</Text>
          <Text style={styles.cardSubtitle}>
            No subscription needed - this is a one-time fee to cover costs.
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <View style={styles.feature}>
            <Ionicons name="globe-outline" size={24} color={COLORS.textPrimary} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Spend in 150+ currencies</Text>
              <Text style={styles.featureDescription}>
                One card to spend or withdraw money with the real exchange rate.
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Ionicons name="flash-outline" size={24} color={COLORS.textPrimary} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Start spending instantly</Text>
              <Text style={styles.featureDescription}>
                Your card details are ready to use as soon as you order — you can set up Apple Pay, too.
              </Text>
            </View>
          </View>

          <View style={styles.feature}>
            <Ionicons name="shield-checkmark-outline" size={24} color={COLORS.textPrimary} />
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>Secure and protected</Text>
              <Text style={styles.featureDescription}>
                Advanced security features and fraud protection for all your transactions.
              </Text>
            </View>
          </View>
        </View>

        {/* Delivery Info */}
        <View style={styles.deliveryInfo}>
          <Text style={styles.deliveryTitle}>Delivery Information</Text>
          <View style={styles.deliveryItem}>
            <Ionicons name="time-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.deliveryText}>5-7 business days delivery</Text>
          </View>
          <View style={styles.deliveryItem}>
            <Ionicons name="location-outline" size={20} color={COLORS.textSecondary} />
            <Text style={styles.deliveryText}>Delivered to your registered address</Text>
          </View>
          <View style={styles.deliveryItem}>
            <Ionicons name="checkmark-circle-outline" size={20} color={COLORS.success} />
            <Text style={styles.deliveryText}>Free shipping worldwide</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.orderButton} onPress={handleOrderCard}>
          <Text style={styles.orderButtonText}>Order your card</Text>
        </TouchableOpacity>

        {/* Fine Print */}
        <View style={styles.finePrint}>
          <Text style={styles.finePrintText}>
            By ordering this card, you agree to the InWallet Card Terms and Conditions. 
            Your card will be linked to your InWallet account and can be used for 
            online and in-store purchases worldwide.
          </Text>
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
  cardPreview: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  card: {
    width: 320,
    height: 200,
    borderRadius: SIZES.radiusLg,
    padding: SIZES.lg,
    justifyContent: 'space-between',
    ...SHADOWS.large,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cardBrand: {
    fontSize: SIZES.textLg,
    fontWeight: 'bold',
    color: COLORS.textWhite,
  },
  chipIcon: {
    opacity: 0.8,
  },
  cardNumber: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardNumberText: {
    fontSize: SIZES.textXl,
    fontWeight: 'bold',
    color: COLORS.textWhite,
    letterSpacing: 2,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardLabel: {
    fontSize: SIZES.textXs,
    color: COLORS.textWhite,
    opacity: 0.8,
    marginBottom: SIZES.xs,
  },
  cardValue: {
    fontSize: SIZES.textSm,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
  visaLogo: {
    fontSize: SIZES.textLg,
    fontWeight: 'bold',
    color: COLORS.textWhite,
    fontStyle: 'italic',
  },
  cardInfo: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  cardTitle: {
    fontSize: SIZES.text2xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SIZES.md,
  },
  cardSubtitle: {
    fontSize: SIZES.textBase,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  features: {
    marginBottom: SIZES.xl,
  },
  feature: {
    flexDirection: 'row',
    marginBottom: SIZES.lg,
  },
  featureContent: {
    flex: 1,
    marginLeft: SIZES.md,
  },
  featureTitle: {
    fontSize: SIZES.textBase,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.xs,
  },
  featureDescription: {
    fontSize: SIZES.textSm,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  deliveryInfo: {
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    padding: SIZES.lg,
    marginBottom: SIZES.xl,
  },
  deliveryTitle: {
    fontSize: SIZES.textBase,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.md,
  },
  deliveryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.sm,
  },
  deliveryText: {
    fontSize: SIZES.textSm,
    color: COLORS.textSecondary,
    marginLeft: SIZES.sm,
  },
  orderButton: {
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusMd,
    paddingVertical: SIZES.md,
    alignItems: 'center',
    marginBottom: SIZES.lg,
    ...SHADOWS.small,
  },
  orderButtonText: {
    fontSize: SIZES.textLg,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
  finePrint: {
    padding: SIZES.md,
  },
  finePrintText: {
    fontSize: SIZES.textXs,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default CardOrderScreen;