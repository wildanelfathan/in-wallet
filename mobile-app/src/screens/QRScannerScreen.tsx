import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Dimensions,
} from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: any;
}

const QRScannerScreen: React.FC<Props> = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [flashOn, setFlashOn] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: { type: string; data: string }) => {
    setScanned(true);
    
    // Parse QR code data
    try {
      // Check if it's a payment QR code
      if (data.startsWith('inwallet://pay') || data.includes('amount')) {
        // Navigate to payment confirmation
        navigation.navigate('SendMoney', { qrData: data });
      } else {
        Alert.alert(
          'QR Code Scanned',
          `Data: ${data}`,
          [
            { text: 'Scan Again', onPress: () => setScanned(false) },
            { text: 'Close', onPress: () => navigation.goBack() },
          ]
        );
      }
    } catch (error) {
      Alert.alert('Error', 'Invalid QR code format');
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>Requesting camera permission...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color={COLORS.textMuted} />
          <Text style={styles.permissionTitle}>Camera Permission Required</Text>
          <Text style={styles.permissionText}>
            Please enable camera permission to scan QR codes
          </Text>
          <TouchableOpacity
            style={styles.permissionButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.permissionButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="close" size={24} color={COLORS.textWhite} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan QR Code</Text>
        <TouchableOpacity
          style={styles.flashButton}
          onPress={() => setFlashOn(!flashOn)}
        >
          <Ionicons 
            name={flashOn ? "flash" : "flash-outline"} 
            size={24} 
            color={COLORS.textWhite} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.scannerContainer}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
          style={StyleSheet.absoluteFillObject}
          flashMode={flashOn ? 'torch' : 'off'}
        />
        
        {/* Overlay */}
        <View style={styles.overlay}>
          <View style={styles.scanArea}>
            {/* Corner indicators */}
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsText}>
            Position the QR code within the frame
          </Text>
          <Text style={styles.subInstructionsText}>
            For payments, ensure it's a valid InWallet QR code
          </Text>
        </View>
      </View>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('SendMoney')}
        >
          <Ionicons name="send-outline" size={24} color={COLORS.primary} />
          <Text style={styles.actionButtonText}>Send Money</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setScanned(false)}
          disabled={!scanned}
        >
          <Ionicons 
            name="refresh-outline" 
            size={24} 
            color={scanned ? COLORS.primary : COLORS.textMuted} 
          />
          <Text style={[
            styles.actionButtonText,
            { color: scanned ? COLORS.primary : COLORS.textMuted }
          ]}>
            Scan Again
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.textPrimary,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SIZES.lg,
    paddingVertical: SIZES.md,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  closeButton: {
    padding: SIZES.sm,
  },
  headerTitle: {
    fontSize: SIZES.textLg,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
  flashButton: {
    padding: SIZES.sm,
  },
  scannerContainer: {
    flex: 1,
    position: 'relative',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  scanArea: {
    width: 250,
    height: 250,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: COLORS.primary,
    borderWidth: 3,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  instructionsContainer: {
    position: 'absolute',
    bottom: 120,
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
  },
  instructionsText: {
    fontSize: SIZES.textBase,
    color: COLORS.textWhite,
    textAlign: 'center',
    marginBottom: SIZES.sm,
    fontWeight: '500',
  },
  subInstructionsText: {
    fontSize: SIZES.textSm,
    color: COLORS.textWhite,
    opacity: 0.8,
    textAlign: 'center',
  },
  bottomActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.lg,
    backgroundColor: COLORS.background,
  },
  actionButton: {
    alignItems: 'center',
    padding: SIZES.md,
  },
  actionButtonText: {
    fontSize: SIZES.textSm,
    color: COLORS.primary,
    marginTop: SIZES.xs,
    fontWeight: '500',
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
  },
  permissionTitle: {
    fontSize: SIZES.textXl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SIZES.lg,
    marginBottom: SIZES.md,
    textAlign: 'center',
  },
  permissionText: {
    fontSize: SIZES.textBase,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: SIZES.xl,
  },
  permissionButton: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SIZES.xl,
    paddingVertical: SIZES.md,
    borderRadius: SIZES.radiusMd,
  },
  permissionButtonText: {
    fontSize: SIZES.textBase,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
});

export default QRScannerScreen;