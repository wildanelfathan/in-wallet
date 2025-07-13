import React, { useEffect, useState } from 'react';
import { Box, VStack, HStack, Text, Icon, Pressable, ScrollView, Spinner } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { getFiatBalance, getCryptoBalance } from '../services/walletService';

const RATES_API = '/api/rates';

const WalletScreen = () => {
  const [fiat, setFiat] = useState<{ balance: number; currency: string } | null>(null);
  const [crypto, setCrypto] = useState<{ balance: number; currency: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rates, setRates] = useState<any>(null);
  const [ratesLoading, setRatesLoading] = useState(true);
  const [ratesError, setRatesError] = useState<string | null>(null);

  useEffect(() => {
    const loadBalances = async () => {
      setLoading(true);
      setError(null);
      try {
        const fiatData = await getFiatBalance();
        const cryptoData = await getCryptoBalance();
        setFiat(fiatData);
        setCrypto(cryptoData as { balance: number; currency: string } | null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load balances');
      } finally {
        setLoading(false);
      }
    };
    loadBalances();
  }, []);

  useEffect(() => {
    const fetchRates = async () => {
      setRatesLoading(true);
      setRatesError(null);
      try {
        const res = await fetch(`${RATES_API}?base=usd&symbols=btc,eth,eur,idr`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to fetch rates');
        setRates(data.rates);
      } catch (err: any) {
        setRatesError(err.message || 'Failed to fetch rates');
      } finally {
        setRatesLoading(false);
      }
    };
    fetchRates();
  }, []);

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="white">
        <Spinner size="lg" color="primary.500" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center" bg="white">
        <Text color="error.500" fontSize="md">{error}</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="white" safeArea>
      {/* Header */}
      <HStack px={4} py={4} justifyContent="space-between" alignItems="center">
        <Text fontSize="xl" fontWeight="bold">Wallet</Text>
        <Icon as={Ionicons} name="settings-outline" size={6} color="gray.600" />
      </HStack>

      <ScrollView>
        {/* Exchange Rates Section */}
        <Box mx={4} mb={4} bg="gray.50" rounded="xl" p={4}>
          <Text fontSize="sm" color="gray.600" mb={2}>Exchange Rates (USD)</Text>
          {ratesLoading ? (
            <Text>Loading rates...</Text>
          ) : ratesError ? (
            <Text color="error.500">{ratesError}</Text>
          ) : rates ? (
            <VStack space={1}>
              {Object.entries(rates).map(([symbol, obj]: any) => (
                <HStack key={symbol} justifyContent="space-between">
                  <Text fontSize="md" fontWeight="medium">{symbol.toUpperCase()}</Text>
                  <Text fontSize="md">{String(Object.values(obj)[0])}</Text>
                </HStack>
              ))}
            </VStack>
          ) : null}
        </Box>
        {/* Crypto Price Card */}
        <Box mx={4} bg="coolGray.100" rounded="xl" p={4}>
          <Text fontSize="sm" color="gray.600">Crypto Balance</Text>
          <HStack alignItems="center" space={2}>
            <Text fontSize="2xl" fontWeight="bold">
              {crypto ? `${crypto.currency} ${crypto.balance.toLocaleString()}` : '--'}
            </Text>
          </HStack>
        </Box>

        {/* Fiat Balance Card */}
        <Box mx={4} mt={4} bg="primary.500" rounded="xl" p={4}>
          <Text color="white" fontSize="sm">Available Balance</Text>
          <Text color="white" fontSize="3xl" fontWeight="bold">
            {fiat ? `${fiat.currency} ${fiat.balance.toLocaleString()}` : '--'}
          </Text>
          <HStack mt={4} space={4}>
            <Pressable flex={1} bg="white:alpha.20" rounded="lg" py={2} alignItems="center">
              <Text color="white">Top Up</Text>
            </Pressable>
            <Pressable flex={1} bg="white:alpha.20" rounded="lg" py={2} alignItems="center">
              <Text color="white">Withdraw</Text>
            </Pressable>
          </HStack>
        </Box>

        {/* Wallet Services */}
        <VStack mt={6} px={4} space={4}>
          <Text fontSize="lg" fontWeight="semibold">Services</Text>
          <VStack space={3}>
            {[
              { name: 'Bank Integration', icon: 'business-outline' },
              { name: 'PayLater QR', icon: 'qr-code-outline' },
              { name: 'PayLater Limit', icon: 'card-outline' },
              { name: 'Ecommerce Payment', icon: 'cart-outline' },
              { name: 'Insurance', icon: 'shield-outline' },
              { name: 'Wallet Meter', icon: 'speedometer-outline' }
            ].map((service) => (
              <Pressable
                key={service.name}
                bg="gray.50"
                rounded="lg"
                p={4}
              >
                <HStack alignItems="center" space={3}>
                  <Icon as={Ionicons} name={service.icon} size={5} color="primary.500" />
                  <Text flex={1}>{service.name}</Text>
                  <Icon as={Ionicons} name="chevron-forward" size={5} color="gray.400" />
                </HStack>
              </Pressable>
            ))}
          </VStack>
        </VStack>

        {/* Insurance Banner */}
        <Box mx={4} mt={6} bg="info.100" rounded="xl" p={4}>
          <HStack alignItems="center" space={3}>
            <Icon as={Ionicons} name="shield-checkmark" size={6} color="info.500" />
            <VStack flex={1}>
              <Text fontSize="sm" fontWeight="semibold">FREE accident protection</Text>
              <Text fontSize="xs" color="gray.600">Up to Rp1JT coverage</Text>
            </VStack>
            <Pressable bg="info.500" rounded="lg" px={3} py={1}>
              <Text color="white" fontSize="xs">Claim</Text>
            </Pressable>
          </HStack>
        </Box>

        {/* Bottom Spacing */}
        <Box h={8} />
      </ScrollView>
    </Box>
  );
};

export default WalletScreen; 