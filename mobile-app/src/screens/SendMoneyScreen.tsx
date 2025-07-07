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
import QRCode from 'react-native-qrcode-svg';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';

interface Props {
  navigation: any;
  route?: any;
}

const SendMoneyScreen: React.FC<Props> = ({ navigation, route }) => {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [description, setDescription] = useState('');
  const [showQR, setShowQR] = useState(false);

  const currencies = ['USD', 'EUR', 'BTC', 'SGD'];

  const qrData = route?.params?.qrData;

  React.useEffect(() => {
    if (qrData) {
      // Parse QR data and prefill form
      try {
        const url = new URL(qrData);
        const urlAmount = url.searchParams.get('amount');
        const urlRecipient = url.searchParams.get('recipient');
        if (urlAmount) setAmount(urlAmount);
        if (urlRecipient) setRecipient(urlRecipient);
      } catch (error) {
        // Handle non-URL QR codes
        if (qrData.includes('amount:')) {
          const amountMatch = qrData.match(/amount:(\d+\.?\d*)/);
          if (amountMatch) setAmount(amountMatch[1]);
        }
      }
    }
  }, [qrData]);

  const handleSendMoney = () => {
    if (!amount || !recipient) {
      Alert.alert('Error', 'Please fill in amount and recipient');
      return;
    }

    Alert.alert(
      'Confirm Payment',
      `Send ${amount} ${selectedCurrency} to ${recipient}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            Alert.alert('Success', 'Payment sent successfully!');
            navigation.goBack();
          },
        },
      ]
    );
  };

  const generateQRCode = () => {
    if (!amount || !selectedCurrency) {
      Alert.alert('Error', 'Please enter amount and select currency');
      return;
    }
    setShowQR(true);
  };

  const qrCodeData = `inwallet://pay?amount=${amount}&currency=${selectedCurrency}&recipient=YOUR_WALLET_ID&description=${description}`;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Send Money</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {showQR ? (
          // QR Code Display
          <View style={styles.qrContainer}>
            <Text style={styles.qrTitle}>Share QR Code</Text>
            <Text style={styles.qrSubtitle}>
              Scan this code to receive {amount} {selectedCurrency}
            </Text>
            
            <View style={styles.qrCodeWrapper}>
              <QRCode
                value={qrCodeData}
                size={200}
                color={COLORS.textPrimary}
                backgroundColor={COLORS.background}
              />
            </View>

            <View style={styles.qrInfo}>
              <Text style={styles.qrAmount}>{amount} {selectedCurrency}</Text>
              {description && (
                <Text style={styles.qrDescription}>{description}</Text>
              )}
            </View>

            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => setShowQR(false)}
            >
              <Text style={styles.primaryButtonText}>Back to Form</Text>
            </TouchableOpacity>
          </View>
        ) : (
          // Send Money Form
          <View style={styles.form}>
            <View style={styles.formSection}>
              <Text style={styles.label}>Amount</Text>
              <View style={styles.amountContainer}>
                <TextInput
                  style={styles.amountInput}
                  value={amount}
                  onChangeText={setAmount}
                  placeholder="0.00"
                  keyboardType="numeric"
                  placeholderTextColor={COLORS.textMuted}
                />
                <View style={styles.currencySelector}>
                  {currencies.map((currency) => (
                    <TouchableOpacity
                      key={currency}
                      style={[
                        styles.currencyButton,
                        selectedCurrency === currency && styles.activeCurrencyButton,
                      ]}
                      onPress={() => setSelectedCurrency(currency)}
                    >
                      <Text
                        style={[
                          styles.currencyButtonText,
                          selectedCurrency === currency && styles.activeCurrencyButtonText,
                        ]}
                      >
                        {currency}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Recipient</Text>
              <TextInput
                style={styles.input}
                value={recipient}
                onChangeText={setRecipient}
                placeholder="Email, phone, or wallet address"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Description (Optional)</Text>
              <TextInput
                style={styles.input}
                value={description}
                onChangeText={setDescription}
                placeholder="What's this for?"
                placeholderTextColor={COLORS.textMuted}
              />
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={generateQRCode}
              >
                <Ionicons name="qr-code-outline" size={20} color={COLORS.primary} />
                <Text style={styles.secondaryButtonText}>Generate QR</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleSendMoney}
              >
                <Text style={styles.primaryButtonText}>Send Money</Text>
              </TouchableOpacity>
            </View>

            {/* Quick Amount Buttons */}
            <View style={styles.quickAmounts}>
              <Text style={styles.quickAmountsTitle}>Quick Amounts</Text>
              <View style={styles.quickAmountButtons}>
                {['10', '25', '50', '100'].map((quickAmount) => (
                  <TouchableOpacity
                    key={quickAmount}
                    style={styles.quickAmountButton}
                    onPress={() => setAmount(quickAmount)}
                  >
                    <Text style={styles.quickAmountText}>${quickAmount}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Recent Recipients */}
            <View style={styles.recentSection}>
              <Text style={styles.sectionTitle}>Recent Recipients</Text>
              {['john@example.com', 'alice@example.com', '+1234567890'].map((contact, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.contactItem}
                  onPress={() => setRecipient(contact)}
                >
                  <View style={styles.contactAvatar}>
                    <Text style={styles.contactAvatarText}>
                      {contact.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <Text style={styles.contactText}>{contact}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
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
  // QR Code Styles
  qrContainer: {
    alignItems: 'center',
    paddingVertical: SIZES.xl,
  },
  qrTitle: {
    fontSize: SIZES.text2xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SIZES.sm,
  },
  qrSubtitle: {
    fontSize: SIZES.textBase,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.xl,
  },
  qrCodeWrapper: {
    backgroundColor: COLORS.background,
    padding: SIZES.lg,
    borderRadius: SIZES.radiusLg,
    ...SHADOWS.medium,
    marginBottom: SIZES.xl,
  },
  qrInfo: {
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  qrAmount: {
    fontSize: SIZES.text3xl,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: SIZES.sm,
  },
  qrDescription: {
    fontSize: SIZES.textBase,
    color: COLORS.textSecondary,
  },
  // Form Styles
  form: {},
  formSection: {
    marginBottom: SIZES.lg,
  },
  label: {
    fontSize: SIZES.textBase,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.sm,
  },
  input: {
    height: SIZES.inputHeight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.md,
    fontSize: SIZES.textBase,
    backgroundColor: COLORS.background,
  },
  amountContainer: {
    marginBottom: SIZES.md,
  },
  amountInput: {
    height: 60,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.md,
    fontSize: SIZES.text2xl,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: COLORS.background,
    marginBottom: SIZES.md,
  },
  currencySelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  currencyButton: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SIZES.xs,
  },
  activeCurrencyButton: {
    backgroundColor: COLORS.primary,
  },
  currencyButtonText: {
    fontSize: SIZES.textSm,
    fontWeight: '600',
    color: COLORS.textSecondary,
  },
  activeCurrencyButtonText: {
    color: COLORS.textWhite,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: SIZES.md,
    marginBottom: SIZES.xl,
  },
  primaryButton: {
    flex: 1,
    height: SIZES.buttonHeight,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: SIZES.textBase,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
  secondaryButton: {
    flex: 1,
    height: SIZES.buttonHeight,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    gap: SIZES.sm,
  },
  secondaryButtonText: {
    fontSize: SIZES.textBase,
    fontWeight: '600',
    color: COLORS.primary,
  },
  quickAmounts: {
    marginBottom: SIZES.xl,
  },
  quickAmountsTitle: {
    fontSize: SIZES.textBase,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.md,
  },
  quickAmountButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickAmountButton: {
    flex: 1,
    height: 40,
    backgroundColor: COLORS.surface,
    borderRadius: SIZES.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: SIZES.xs,
  },
  quickAmountText: {
    fontSize: SIZES.textSm,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  recentSection: {},
  sectionTitle: {
    fontSize: SIZES.textBase,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SIZES.md,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SIZES.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  contactAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  contactAvatarText: {
    fontSize: SIZES.textBase,
    fontWeight: 'bold',
    color: COLORS.textWhite,
  },
  contactText: {
    fontSize: SIZES.textBase,
    color: COLORS.textPrimary,
  },
});

export default SendMoneyScreen;