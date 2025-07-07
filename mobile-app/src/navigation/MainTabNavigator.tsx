import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import CardScreen from '../screens/CardScreen';
import SendScreen from '../screens/SendScreen';
import RecipientsScreen from '../screens/RecipientsScreen';
import ManageScreen from '../screens/ManageScreen';
import { COLORS, SIZES } from '../constants/theme';

const Tab = createBottomTabNavigator();

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Card') {
            iconName = focused ? 'card' : 'card-outline';
          } else if (route.name === 'Send') {
            iconName = focused ? 'arrow-up-circle' : 'arrow-up-circle-outline';
          } else if (route.name === 'Recipients') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Manage') {
            iconName = focused ? 'grid' : 'grid-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textMuted,
        tabBarStyle: {
          backgroundColor: COLORS.background,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          height: SIZES.tabBarHeight,
          paddingBottom: SIZES.md,
          paddingTop: SIZES.sm,
        },
        tabBarLabelStyle: {
          fontSize: SIZES.textXs,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Card" component={CardScreen} />
      <Tab.Screen 
        name="Send" 
        component={SendScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <View style={{
              backgroundColor: focused ? COLORS.primary : COLORS.surface,
              borderRadius: SIZES.radiusFull,
              padding: SIZES.sm,
            }}>
              <Ionicons 
                name="arrow-up" 
                size={size} 
                color={focused ? COLORS.textWhite : color} 
              />
            </View>
          ),
        }}
      />
      <Tab.Screen name="Recipients" component={RecipientsScreen} />
      <Tab.Screen name="Manage" component={ManageScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;