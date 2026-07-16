import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { AuroraBackground } from '@/src/components/AuroraBackground';
import { BrandHeader } from '@/src/components/BrandHeader';
import { GlassCard } from '@/src/components/GlassCard';
import { GradientButton } from '@/src/components/GradientButton';
import { useI18n } from '@/src/i18n';
import { useAuth } from '@/src/context/AuthContext';

export default function VerifyEmail() {
  const params = useLocalSearchParams<{ email?: string }>();
  const router = useRouter();
  const { t } = useI18n();
  const { user, resendVerification, signOut } = useAuth();

  const email = (params.email as string) || user?.email || '';
  const [resent, setResent] = useState(false);
  const [resending, setResending] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onResend = async () => {
    if (!email) return;
    setErr(null);
    setResent(false);
    setResending(true);
    try {
      await resendVerification(email);
      setResent(true);
    } catch (e: any) {
      setErr(e?.message || t('auth.errGeneric'));
    } finally {
      setResending(false);
    }
  };

  const onBackToSignIn = async () => {
    // If a stale session got us here without verification, clear it first.
    if (user) await signOut();
    router.replace('/(auth)/sign-in');
  };

  const onOpenMail = async () => {
    const url = Platform.OS === 'ios' ? 'message://' : 'mailto:';
    try {
      await Linking.openURL(url);
    } catch {
      // ignore
    }
  };

  return (
    <View style={styles.root}>
      <AuroraBackground />
      <StatusBar style="light" />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <View style={styles.hero}>
          <BrandHeader compact />

          <GlassCard style={styles.card}>
            <View style={styles.iconRing}>
              <Ionicons name="mail-open-outline" size={34} color="#00F5D4" />
            </View>

            <Text style={styles.title} testID="verify-email-title">
              {t('auth.verifyTitle')}
            </Text>
            <Text style={styles.subtitle} testID="verify-email-subtitle">
              {t('auth.verifySubtitle', { email })}
            </Text>

            {resent ? (
              <View style={styles.resentPill} testID="verify-email-resent-pill">
                <Ionicons name="checkmark-circle" size={16} color="#00F5D4" />
                <Text style={styles.resentText}>{t('auth.resent')}</Text>
              </View>
            ) : null}

            {err ? (
              <Text style={styles.errText} testID="verify-email-error">
                {err}
              </Text>
            ) : null}

            <View style={styles.actions}>
              <GradientButton
                label={t('auth.openMail')}
                onPress={onOpenMail}
                testID="verify-email-open-mail-button"
              />
              <View style={{ height: 10 }} />
              <GradientButton
                variant="ghost"
                label={t('auth.resend')}
                onPress={onResend}
                loading={resending}
                testID="verify-email-resend-button"
              />
              <View style={{ height: 10 }} />
              <Pressable
                onPress={onBackToSignIn}
                style={({ pressed }) => [styles.linkBtn, pressed && { opacity: 0.6 }]}
                testID="verify-email-back-to-sign-in-button"
              >
                <Text style={styles.linkText}>{t('auth.backToSignIn')}</Text>
              </Pressable>
            </View>
          </GlassCard>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#05050A' },
  safe: { flex: 1, paddingHorizontal: 24 },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 24,
  },
  card: {
    padding: 24,
    alignItems: 'center',
    width: '100%',
  },
  iconRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 245, 212, 0.35)',
    backgroundColor: 'rgba(0, 245, 212, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    color: '#F8F9FA',
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    color: '#A1A1AA',
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  resentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(0, 245, 212, 0.10)',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'rgba(0, 245, 212, 0.35)',
    marginBottom: 12,
  },
  resentText: { color: '#00F5D4', fontSize: 12, fontWeight: '700' },
  errText: {
    color: '#FF5A5F',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 12,
  },
  actions: {
    width: '100%',
    marginTop: 4,
  },
  linkBtn: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  linkText: {
    color: '#C77DFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
