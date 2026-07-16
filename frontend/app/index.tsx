import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Redirect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useAuth } from '@/src/context/AuthContext';
import { AuroraBackground } from '@/src/components/AuroraBackground';
import { BrandHeader } from '@/src/components/BrandHeader';

/**
 * Root gate — routes based on session + email verification state.
 *  • Loading  → branded spinner
 *  • No user  → (auth)/welcome
 *  • Unverified email → (auth)/verify-email
 *  • Verified → (tabs)
 */
export default function Index() {
  const { session, user, isEmailVerified, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.root}>
        <AuroraBackground />
        <StatusBar style="light" />
        <View style={styles.center}>
          <BrandHeader compact />
          <ActivityIndicator color="#C77DFF" style={{ marginTop: 24 }} />
        </View>
      </View>
    );
  }

  if (!session || !user) {
    return <Redirect href="/(auth)/welcome" />;
  }

  if (!isEmailVerified) {
    return <Redirect href={{ pathname: '/(auth)/verify-email', params: { email: user.email ?? '' } }} />;
  }

  return <Redirect href="/(tabs)" />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#05050A' },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
