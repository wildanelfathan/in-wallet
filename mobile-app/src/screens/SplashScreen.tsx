import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES, FONTS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: any;
}

const SplashScreen: React.FC<Props> = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('Auth');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* InWallet Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logo}>
            <View style={styles.logoSquare}>
              <View style={styles.gridContainer}>
                <View style={styles.gridItem} />
                <View style={styles.gridItem} />
                <View style={styles.gridItem} />
                <View style={styles.gridItem} />
              </View>
              <View style={styles.signalIcon}>
                <View style={styles.signalBar} />
                <View style={[styles.signalBar, styles.signalBar2]} />
                <View style={[styles.signalBar, styles.signalBar3]} />
              </View>
            </View>
          </View>
        </View>

        {/* App Name */}
        <Text style={styles.appName}>InWallet</Text>
        <Text style={styles.tagline}>Your Digital Wallet Solution</Text>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by InWallet Technology</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
  },
  logoContainer: {
    marginBottom: SIZES.xxl,
  },
  logo: {
    width: 120,
    height: 120,
    borderRadius: SIZES.radiusXl,
    backgroundColor: COLORS.textWhite,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 16,
  },
  logoSquare: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 32,
    height: 32,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gridItem: {
    width: 12,
    height: 12,
    backgroundColor: COLORS.textWhite,
    borderRadius: SIZES.radiusXs,
    margin: 2,
  },
  signalIcon: {
    position: 'absolute',
    top: 8,
    right: 8,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  signalBar: {
    width: 3,
    height: 6,
    backgroundColor: COLORS.textWhite,
    marginHorizontal: 1,
    borderRadius: 1,
  },
  signalBar2: {
    height: 8,
  },
  signalBar3: {
    height: 10,
  },
  appName: {
    fontSize: SIZES.text4xl,
    fontWeight: 'bold',
    color: COLORS.textWhite,
    marginBottom: SIZES.sm,
    textAlign: 'center',
  },
  tagline: {
    fontSize: SIZES.textLg,
    color: COLORS.textWhite,
    opacity: 0.9,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: SIZES.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: SIZES.textSm,
    color: COLORS.textWhite,
    opacity: 0.8,
  },
});

export default SplashScreen;