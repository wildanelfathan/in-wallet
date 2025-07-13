import React, { useState } from 'react';
import { Box, VStack, HStack, Text, Icon, Pressable, Input, Button, Select, Spinner, useToast } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { sendCrypto } from '../services/cryptoService';

// TODO: Replace with real token/network list from API or config
const TOKENS = [
  { 
    symbol: 'ETH', 
    name: 'Ethereum', 
    decimals: 18,
    address: null,
    network: 'ethereum' as const 
  },
  { 
    symbol: 'MATIC', 
    name: 'Polygon', 
    decimals: 18,
    address: '0x0000000000000000000000000000000000001010',
    network: 'polygon' as const 
  },
];

const SendCryptoScreen = () => {
  const navigation = useNavigation();
  const toast = useToast();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [token, setToken] = useState(TOKENS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<null | { txHash: string }>(null);

  const handleSend = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      if (!recipient || !amount || isNaN(Number(amount)) || Number(amount) <= 0) {
        setError('Please enter a valid recipient and amount.');
        setLoading(false);
        return;
      }
      // TODO: Add more robust validation (address format, etc.)
      const result = await sendCrypto({
        userId: 'user-123', // TODO: Get from auth context
        fromAddress: '', // TODO: Get from user's wallet
        toAddress: recipient,
        amount: amount,
        token: token,
        network: token.network,
      });
      if (result.success) {
        setSuccess({ txHash: result.transactionHash || '' });
        toast.show({ description: 'Crypto sent successfully!' });
      } else {
        setError(result.error || 'Failed to send crypto');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send crypto');
    } finally {
      setLoading(false);
    }
  };

  // Top bar with back button and title
  return (
    <Box flex={1} bg="white" safeArea>
      <HStack px={4} py={4} alignItems="center" justifyContent="space-between">
        <Pressable onPress={() => navigation.goBack()}>
          <Icon as={Ionicons} name="arrow-back" size={6} color="primary.500" />
        </Pressable>
        <Text fontSize="xl" fontWeight="bold">Send Crypto</Text>
        <Box w={6} />
      </HStack>
      <VStack flex={1} px={4} py={2} space={4}>
        {success ? (
          <Box alignItems="center" justifyContent="center" flex={1}>
            <Icon as={Ionicons} name="checkmark-circle" size={16} color="success.500" />
            <Text fontSize="lg" fontWeight="bold" mt={4}>Sent Successfully!</Text>
            <Text fontSize="sm" color="gray.500" mt={2}>Transaction Hash:</Text>
            <Text fontSize="xs" color="gray.700" selectable>{success.txHash}</Text>
            <Button mt={8} onPress={() => navigation.goBack()} colorScheme="primary">Done</Button>
          </Box>
        ) : (
          <VStack space={4}>
            <Text fontSize="md" fontWeight="semibold">Recipient Address</Text>
            <Input
              placeholder="Enter recipient address"
              value={recipient}
              onChangeText={setRecipient}
              autoCapitalize="none"
              autoCorrect={false}
              isDisabled={loading}
            />
            {/* TODO: Add QR scan/address book shortcut */}
            <Text fontSize="md" fontWeight="semibold">Amount</Text>
            <Input
              placeholder="Enter amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType="decimal-pad"
              isDisabled={loading}
            />
            <Text fontSize="md" fontWeight="semibold">Token</Text>
            <Select
              selectedValue={token.symbol}
              onValueChange={val => setToken(TOKENS.find(t => t.symbol === val) || TOKENS[0])}
              isDisabled={loading}
            >
              {TOKENS.map(t => (
                <Select.Item key={t.symbol} label={`${t.name} (${t.symbol})`} value={t.symbol} />
              ))}
            </Select>
            {error && <Text color="error.500">{error}</Text>}
            <Button
              mt={4}
              onPress={handleSend}
              isLoading={loading}
              isDisabled={loading}
              colorScheme="primary"
            >
              Send
            </Button>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default SendCryptoScreen; 