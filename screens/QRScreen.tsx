import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Text, Icon, Pressable, Spinner, useToast, Center, Button, Image } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import { qrService, QRScanResult } from '../services/qrService';
import QRCode from 'qrcode';

const QRScreen = () => {
  const [isScanning, setIsScanning] = useState(true);
  const [scanResult, setScanResult] = useState<QRScanResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const toast = useToast();

  // TODO: Integrate with real camera scanner
  const handleFakeScan = async () => {
    setLoading(true);
    setError(null);
    setScanResult(null);
    try {
      // Simulate scanning a QR code (replace with real camera integration)
      const fakeQRData = 'sample-qr-data';
      const result = await qrService.scanQR(fakeQRData);
      if (result.success) {
        setScanResult(result);
        toast.show({ description: 'QR scanned successfully!' });
      } else {
        setError(result.error || 'Failed to scan QR');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to scan QR');
    } finally {
      setLoading(false);
    }
  };

  // TODO: Replace with user's real QR data for receiving payments
  const userQRValue = 'user-qr-code-placeholder';

  // Generate QR code data URL
  useEffect(() => {
    const generateQRCode = async () => {
      try {
        const dataUrl = await QRCode.toDataURL(userQRValue, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataUrl(dataUrl);
      } catch (err) {
        console.error('Failed to generate QR code:', err);
      }
    };

    generateQRCode();
  }, [userQRValue]);

  return (
    <Box flex={1} bg="black" safeArea>
      {/* Header */}
      <HStack px={4} py={4} justifyContent="space-between" alignItems="center">
        <Pressable onPress={() => {/* TODO: Close or go back */}}>
          <Icon as={Ionicons} name="close" size={6} color="white" />
        </Pressable>
        <HStack space={4}>
          <Pressable onPress={() => {/* TODO: Toggle flashlight */}}>
            <Icon as={Ionicons} name="flashlight" size={6} color="white" />
          </Pressable>
          <Pressable onPress={() => {/* TODO: Open gallery/image picker */}}>
            <Icon as={Ionicons} name="image-outline" size={6} color="white" />
          </Pressable>
        </HStack>
      </HStack>

      {isScanning ? (
        <VStack flex={1} justifyContent="center" alignItems="center" space={4}>
          {/* Scan Area */}
          <Box
            w="250px"
            h="250px"
            borderWidth={2}
            borderColor="white"
            rounded="lg"
            justifyContent="center"
            alignItems="center"
            mb={4}
          >
            {/* TODO: Integrate with real camera preview */}
            <Icon as={Ionicons} name="scan-outline" size={20} color="white:alpha.30" />
          </Box>
          <Text color="white" fontSize="lg">Scan QR Code Here</Text>
          <Text color="white:alpha.60" fontSize="sm" textAlign="center" px={8}>
            Win an iPhone 15 & Free Coins up to 200K InWallet App Only
          </Text>
          {/* TODO: Add QRIS or supported QR logo here */}
          {loading && <Spinner color="primary.500" mt={4} />}
          {error && <Text color="error.400" mt={2}>{error}</Text>}
          {scanResult && (
            <Box bg="white" p={4} rounded="xl" mt={4} alignItems="center">
              <Text fontSize="md" fontWeight="bold" color="primary.500">Scan Result</Text>
              <Text fontSize="sm" color="gray.700" mt={2}>{JSON.stringify(scanResult)}</Text>
              {/* TODO: Show parsed result in a user-friendly way, add actions (e.g., pay, view details) */}
            </Box>
          )}
          <Button mt={6} onPress={handleFakeScan} colorScheme="primary" isDisabled={loading}>
            Simulate Scan
          </Button>
        </VStack>
      ) : (
        <Center flex={1}>
          {/* Show user's own QR code for receiving payments */}
          <Text color="white" fontSize="lg" mb={4}>Show this QR to receive payments</Text>
          <Box bg="white" p={4} rounded="2xl" shadow={2} alignItems="center">
            {qrCodeDataUrl ? (
              <Image source={{ uri: qrCodeDataUrl }} alt="QR Code" size={200} />
            ) : (
              <Spinner size="lg" />
            )}
            <Text fontSize="md" color="black" mt={4}>Your InWallet QR</Text>
            {/* TODO: Add share, copy, or save QR actions */}
          </Box>
        </Center>
      )}

      {/* Bottom Action */}
      <Box px={4} py={6}>
        <Pressable
          bg="white"
          rounded="full"
          py={3}
          alignItems="center"
          onPress={() => setIsScanning(!isScanning)}
        >
          <Text fontSize="lg" fontWeight="semibold">
            {isScanning ? 'Show My QR Code' : 'Scan QR Code'}
          </Text>
        </Pressable>
      </Box>
    </Box>
  );
};

export default QRScreen; 