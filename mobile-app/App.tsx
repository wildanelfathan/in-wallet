import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import SplashScreen from './src/screens/SplashScreen';
import AuthScreen from './src/screens/AuthScreen';
import MainTabNavigator from './src/navigation/MainTabNavigator';
import QRScannerScreen from './src/screens/QRScannerScreen';
import SendMoneyScreen from './src/screens/SendMoneyScreen';
import AddMoneyScreen from './src/screens/AddMoneyScreen';
import CardOrderScreen from './src/screens/CardOrderScreen';
import TransactionHistoryScreen from './src/screens/TransactionHistoryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <StatusBar style="dark" />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Auth" component={AuthScreen} />
          <Stack.Screen name="Main" component={MainTabNavigator} />
          <Stack.Screen 
            name="QRScanner" 
            component={QRScannerScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="SendMoney" 
            component={SendMoneyScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="AddMoney" 
            component={AddMoneyScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="CardOrder" 
            component={CardOrderScreen}
            options={{ presentation: 'modal' }}
          />
          <Stack.Screen 
            name="TransactionHistory" 
            component={TransactionHistoryScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}