import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AuroraBackground } from '@/src/components/AuroraBackground';
import { BrandHeader } from '@/src/components/BrandHeader';
import { useAuth } from '@/src/context/AuthContext';

/**
 * Placeholder Home tab so the router can transition after email verification.
 * Real feed/reels/stories will be built in the next iterations.
 */
export default function TabHome() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  const onSignOut = async () => {
    await signOut();
    router.replace('/(auth)/welcome');
  };

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.center}>
          <BrandHeader subtitle="you're in ✨" compact />
          <View style={styles.card}>
            <Ionicons name="sparkles-outline" size={22} color="#00F5D4" />
            <Text style={styles.cardTitle}>Auth flow complete</Text>
            <Text style={styles.cardBody}>
              Signed in as{'\n'}
              <Text style={styles.email}>{user?.email}</Text>
            </Text>
            <Text style={styles.hint}>
              Feed, Reels, Stories, and Chats are the next features to build. Give
              the green light and I&apos;ll wire them up one by one.
            </Text>
          </View>

          <Pressable onPress={onSignOut} style={styles.signOut} testID="home-sign-out-button">
            <Ionicons name="log-out-outline" size={16} color="#A1A1AA" />
            <Text style={styles.signOutText}>Sign out</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#05050A' },
  safe: { flex: 1, paddingHorizontal: 24 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 28 },
  card: {
    borderWidth: 1,
    borderColor: 'rgba(199, 125, 255, 0.20)',
    backgroundColor: 'rgba(15, 15, 20, 0.65)',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    maxWidth: 340,
    gap: 12,
  },
  cardTitle: { color: '#F8F9FA', fontSize: 18, fontWeight: '800' },
  cardBody: { color: '#A1A1AA', fontSize: 14, textAlign: 'center', lineHeight: 21 },
  email: { color: '#00F5D4', fontWeight: '700' },
  hint: {
    color: '#7A7A85',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
  },
  signOut: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  signOutText: { color: '#A1A1AA', fontSize: 13, fontWeight: '600' },
});
