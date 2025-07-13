import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ThemeProvider } from './theme/ThemeProvider';
import HomeScreen from './screens/HomeScreen';
import WalletScreen from './screens/WalletScreen';
import HistoryScreen from './screens/HistoryScreen';
import ProfileScreen from './screens/ProfileScreen';
import EditProfileScreen from './screens/EditProfileScreen';
import QRScreen from './screens/QRScreen';
import KYCScreen from './screens/KYCScreen';
import { BillPaymentScreen } from './screens/BillPaymentScreen';
import { ReceiptScreen } from './screens/ReceiptScreen';
import ReferralScreen from './screens/ReferralScreen';
import type { RootStackParamList } from './types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <ThemeProvider>
      {React.createElement(NavigationContainer as any, null, 
        React.createElement(Stack.Navigator as any, { initialRouteName: "Home" },
          React.createElement(Stack.Screen, { name: "Home", component: HomeScreen }),
          React.createElement(Stack.Screen, { name: "Wallet", component: WalletScreen }),
          React.createElement(Stack.Screen, { name: "History", component: HistoryScreen }),
          React.createElement(Stack.Screen, { name: "Profile", component: ProfileScreen }),
          React.createElement(Stack.Screen, { 
            name: "EditProfile", 
            component: EditProfileScreen, 
            options: { title: 'Edit Profile' } 
          }),
          React.createElement(Stack.Screen, { name: "KYC", component: KYCScreen }),
          React.createElement(Stack.Screen, { name: "Referral", component: ReferralScreen }),
          React.createElement(Stack.Screen, { name: "QR", component: QRScreen }),
          React.createElement(Stack.Screen, { 
            name: "BillPayment", 
            component: BillPaymentScreen, 
            options: { title: 'Pay Bills' } 
          }),
          React.createElement(Stack.Screen, { 
            name: "Receipt", 
            component: ReceiptScreen, 
            options: { title: 'Payment Receipt' } 
          })
        )
      )}
    </ThemeProvider>
  );
}
