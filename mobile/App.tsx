import React, { useEffect } from 'react';
import { StyleSheet, View, Text, SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { PrivyProvider } from '@privy-io/react-auth';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import LoginScreen from './src/screens/LoginScreen';

const PRIVY_APP_ID = 'your-privy-app-id'; // Replace with your actual Privy app ID

export default function App() {
  return (
    <SafeAreaProvider>
      <PrivyProvider
        appId={PRIVY_APP_ID}
        config={{
          appearance: {
            theme: 'light',
            accentColor: '#676FFF',
            logo: 'https://your-logo-url.com/logo.png',
          },
          loginMethods: ['email', 'wallet'],
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
        }}
      >
        <SafeAreaView style={styles.container}>
          <StatusBar style="auto" />
          <LoginScreen />
        </SafeAreaView>
      </PrivyProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});