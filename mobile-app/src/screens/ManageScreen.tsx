import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES } from '../constants/theme';

const ManageScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Ionicons name="settings-outline" size={64} color={COLORS.textMuted} />
        <Text style={styles.title}>Manage</Text>
        <Text style={styles.subtitle}>Account settings and preferences</Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: SIZES.xl,
  },
  title: {
    fontSize: SIZES.text2xl,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SIZES.lg,
    marginBottom: SIZES.sm,
  },
  subtitle: {
    fontSize: SIZES.textBase,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default ManageScreen;