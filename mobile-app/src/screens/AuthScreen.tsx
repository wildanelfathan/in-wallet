import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, SIZES } from '../constants/theme';

const { width, height } = Dimensions.get('window');

interface Props {
  navigation: any;
}

const AuthScreen: React.FC<Props> = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      setTimeout(() => {
        setLoading(false);
        navigation.replace('Main');
      }, 2000);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Authentication failed');
    }
  };

  const handleAppleSignIn = () => {
    // Simulate Apple Sign In
    navigation.replace('Main');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header with 3D Illustration */}
        <View style={styles.header}>
          <View style={styles.illustrationContainer}>
            {/* 3D Earth with Coins */}
            <View style={styles.earth}>
              <LinearGradient
                colors={['#4FC3F7', '#29B6F6', '#0277BD']}
                style={styles.earthGradient}
              />
              {/* Floating Coins */}
              <View style={[styles.coin, styles.coin1]}>
                <Text style={styles.coinSymbol}>$</Text>
              </View>
              <View style={[styles.coin, styles.coin2]}>
                <Text style={styles.coinSymbol}>₿</Text>
              </View>
              <View style={[styles.coin, styles.coin3]}>
                <Text style={styles.coinSymbol}>€</Text>
              </View>
              <View style={[styles.coin, styles.coin4]}>
                <Text style={styles.coinSymbol}>¥</Text>
              </View>
            </View>
          </View>

          <Text style={styles.title}>
            ONE ACCOUNT{'\n'}FOR ALL THE{'\n'}MONEY IN THE{'\n'}WORLD
          </Text>
        </View>

        {/* Auth Form */}
        <View style={styles.formContainer}>
          <View style={styles.form}>
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={COLORS.textMuted}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.textMuted}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
            {!isLogin && (
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor={COLORS.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.authButton, !isLogin && styles.secondaryButton]}
                onPress={() => {
                  setIsLogin(true);
                  if (isLogin) handleAuth();
                }}
                disabled={loading}
              >
                <Text style={[styles.authButtonText, !isLogin && styles.secondaryButtonText]}>
                  {loading && isLogin ? 'Logging in...' : 'Log in'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.authButton, isLogin && styles.secondaryButton]}
                onPress={() => {
                  setIsLogin(false);
                  if (!isLogin) handleAuth();
                }}
                disabled={loading}
              >
                <Text style={[styles.authButtonText, isLogin && styles.secondaryButtonText]}>
                  {loading && !isLogin ? 'Registering...' : 'Register'}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.appleButton}
              onPress={handleAppleSignIn}
              disabled={loading}
            >
              <Text style={styles.appleButtonText}>🍎 Sign in with Apple</Text>
            </TouchableOpacity>
          </View>
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
    flexGrow: 1,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: SIZES.xxl,
    paddingHorizontal: SIZES.xl,
  },
  illustrationContainer: {
    marginBottom: SIZES.xxl,
  },
  earth: {
    width: 200,
    height: 200,
    borderRadius: 100,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  earthGradient: {
    width: 200,
    height: 200,
    borderRadius: 100,
    position: 'absolute',
  },
  coin: {
    position: 'absolute',
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: COLORS.warning,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  coin1: {
    top: -20,
    left: 50,
  },
  coin2: {
    top: 30,
    right: -20,
  },
  coin3: {
    bottom: 20,
    left: -15,
  },
  coin4: {
    bottom: -10,
    right: 40,
  },
  coinSymbol: {
    fontSize: SIZES.textXl,
    fontWeight: 'bold',
    color: COLORS.textWhite,
  },
  title: {
    fontSize: SIZES.text3xl,
    fontWeight: 'bold',
    textAlign: 'center',
    color: COLORS.textPrimary,
    lineHeight: 40,
  },
  formContainer: {
    backgroundColor: COLORS.background,
    paddingHorizontal: SIZES.xl,
    paddingBottom: SIZES.xl,
  },
  form: {
    width: '100%',
  },
  input: {
    width: '100%',
    height: SIZES.inputHeight,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.radiusMd,
    paddingHorizontal: SIZES.md,
    fontSize: SIZES.textBase,
    marginBottom: SIZES.md,
    backgroundColor: COLORS.background,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SIZES.md,
    marginBottom: SIZES.lg,
  },
  authButton: {
    flex: 1,
    height: SIZES.buttonHeight,
    backgroundColor: COLORS.primary,
    borderRadius: SIZES.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  authButtonText: {
    fontSize: SIZES.textBase,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
  secondaryButtonText: {
    color: COLORS.textPrimary,
  },
  appleButton: {
    width: '100%',
    height: SIZES.buttonHeight,
    backgroundColor: COLORS.textPrimary,
    borderRadius: SIZES.radiusMd,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appleButtonText: {
    fontSize: SIZES.textBase,
    fontWeight: '600',
    color: COLORS.textWhite,
  },
});

export default AuthScreen;