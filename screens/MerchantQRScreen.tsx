import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Icon, Pressable, Input, Button, Select, Spinner, useToast, Center } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { generatePaymentQR } from '../services/merchantService';
// @ts-ignore
import QRCode from 'react-native-qrcode-svg'; // Assume this is installed

// TODO: Replace with real currency list from API or config
const CURRENCIES = [
  { code: 'USD', label: 'US Dollar' },
  { code: 'IDR', label: 'Indonesian Rupiah' },
];

const MerchantQRScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState(CURRENCIES[0].code);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrResult, setQRResult] = useState<null | { qrCode: string; paymentId?: string; qrData?: string; amount: number; currency: string; description?: string }>(null);

  const handleGenerateQR = async () => {
    setLoading(true);
    setError(null);
    setQRResult(null);
    try {
      if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        setError('Please enter a valid amount.');
        setLoading(false);
        return;
      }
      // TODO: Add more robust validation if needed
      const result = await generatePaymentQR({
        merchantId: 'default', // TODO: Get from user context or props
        type: 'fiat', // TODO: Make this configurable
        amount: Number(amount),
        currency,
        description,
        // TODO: Add expiry if needed
      });
      if (result.success) {
        setQRResult({
          qrCode: result.qrCode || '',
          paymentId: result.paymentId,
          qrData: result.qrData,
          amount: Number(amount),
          currency,
          description,
        });
        toast.show({ description: 'QR code generated!' });
      } else {
        setError(result.error || 'Failed to generate QR code');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate QR code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box flex={1} bg="white" safeArea>
      <HStack px={4} py={4} alignItems="center" justifyContent="space-between">
        <Pressable onPress={() => navigation.goBack()}>
          <Icon as={Ionicons} name="arrow-back" size={6} color="primary.500" />
        </Pressable>
        <Text fontSize="xl" fontWeight="bold">Merchant QR</Text>
        <Box w={6} />
      </HStack>
      <VStack flex={1} px={4} py={2} space={4}>
        {qrResult ? (
          <Center flex={1}>
            <Text fontSize="lg" fontWeight="bold" mb={4}>Show this QR to your customer</Text>
            <Box bg="white" p={4} rounded="2xl" shadow={2} alignItems="center">
              {/* Display the QR code */}
              {qrResult.qrCode ? (
                <QRCode value={qrResult.qrCode} size={200} />
              ) : (
                <Text>No QR code data</Text>
              )}
              <Text fontSize="md" mt={4} fontWeight="semibold">Amount: {qrResult.currency} {qrResult.amount}</Text>
              {qrResult.description ? (
                <Text fontSize="sm" color="gray.500">{qrResult.description}</Text>
              ) : null}
              <Text fontSize="xs" color="gray.400" mt={2}>Payment ID: {qrResult.paymentId}</Text>
            </Box>
            <Button mt={8} onPress={() => setQRResult(null)} colorScheme="primary">Generate Another</Button>
          </Center>
        ) : (
          <VStack space={4}>
            <Text fontSize="md" fontWeight="semibold">Amount</Text>
            <Input
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              isDisabled={loading}
            />
            <Text fontSize="md" fontWeight="semibold">Currency</Text>
            <Select
              selectedValue={currency}
              onValueChange={setCurrency}
              isDisabled={loading}
            >
              {CURRENCIES.map(c => (
                <Select.Item key={c.code} label={c.label} value={c.code} />
              ))}
            </Select>
            <Text fontSize="md" fontWeight="semibold">Description (optional)</Text>
            <Input
              placeholder="Enter description"
              value={description}
              onChangeText={setDescription}
              isDisabled={loading}
            />
            {error && <Text color="error.500">{error}</Text>}
            <Button
              mt={4}
              onPress={handleGenerateQR}
              isLoading={loading}
              isDisabled={loading}
              colorScheme="primary"
            >
              Generate QR
            </Button>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default MerchantQRScreen; 