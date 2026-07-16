import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { supabase } from '@/src/lib/supabase';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Deep-link scheme registered in app.json → user lands back in-app after
// clicking the reset link in their email.
const REDIRECT_TO = 'lyrapp://reset-password';

export default function ForgotPassword() {
  const router = useRouter();
  const params = useLocalSearchParams<{ email?: string }>();

  const [email, setEmail] = useState((params.email as string) || '');
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [formErr, setFormErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const canSubmit = EMAIL_RE.test(email) && !submitting;

  const onSubmit = async () => {
    setEmailErr(null);
    setFormErr(null);
    if (!EMAIL_RE.test(email)) {
      setEmailErr('البريد الإلكتروني غير صالح');
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: REDIRECT_TO,
      });
      if (error) throw error;
      setSent(true);
    } catch (e: any) {
      setFormErr(e?.message || 'حدث خطأ. حاول مرة أخرى.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.root}>
      <StatusBar style="light" />

      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={{ flex: 1, backgroundColor: '#000000' }}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* زر العودة */}
            <Pressable
              onPress={() => router.back()}
              hitSlop={12}
              style={styles.backBtn}
              testID="forgot-password-back-button"
            >
              <Ionicons name="chevron-back" size={20} color="#F8F9FA" />
            </Pressable>

            {/* الهيدر — نفس نمط SignIn */}
            <View style={styles.headerContainer}>
              <View style={styles.glowOverlay} />
              <View style={styles.logoScaleContainer}>
                <Image
                  source={require('@/assets/images/icon.png')}
                  style={styles.logoImage}
                  resizeMode="contain"
                />
                <View style={styles.lettersContainer}>
                  <Text style={styles.logoLetter}>L</Text>
                  <Text style={styles.logoLetter}>Y</Text>
                  <Text style={styles.logoLetter}>R</Text>
                </View>
              </View>
              <Text style={styles.tagline}>استعادة كلمة المرور</Text>
            </View>

            <View style={styles.formContainer}>
              {!sent ? (
                <>
                  <Text style={styles.title} testID="forgot-password-title">
                    إعادة تعيين كلمة المرور
                  </Text>
                  <Text style={styles.subtitle}>
                    أدخل البريد الإلكتروني المرتبط بحسابك وسنرسل لك رابط إعادة تعيين آمن.
                  </Text>

                  <View style={styles.inputWrapper}>
                    <TextInput
                      style={[styles.input, emailErr ? styles.inputError : null]}
                      placeholder="البريد الإلكتروني"
                      placeholderTextColor="rgba(255, 255, 255, 0.45)"
                      value={email}
                      onChangeText={(val) => {
                        setEmail(val);
                        if (emailErr) setEmailErr(null);
                      }}
                      autoCapitalize="none"
                      autoCorrect={false}
                      keyboardType="email-address"
                      testID="forgot-password-email-input"
                    />
                    {emailErr ? <Text style={styles.errorText}>{emailErr}</Text> : null}
                  </View>

                  {formErr ? (
                    <Text style={styles.formErr} testID="forgot-password-form-error">
                      {formErr}
                    </Text>
                  ) : null}

                  <Pressable
                    style={({ pressed }) => [
                      styles.submitBtn,
                      !canSubmit && styles.submitBtnDisabled,
                      pressed && styles.submitBtnPressed,
                    ]}
                    onPress={onSubmit}
                    disabled={!canSubmit}
                    testID="forgot-password-submit-button"
                  >
                    {submitting ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.submitBtnText}>إرسال رابط الإعادة</Text>
                    )}
                  </Pressable>
                </>
              ) : (
                <View style={styles.sentBlock}>
                  <View style={styles.iconRing}>
                    <Ionicons name="mail-outline" size={30} color="#00F5D4" />
                  </View>
                  <Text style={styles.title} testID="forgot-password-sent-title">
                    تحقق من بريدك
                  </Text>
                  <Text style={styles.subtitle} testID="forgot-password-sent-subtitle">
                    أرسلنا رابط إعادة التعيين إلى {email}. ينتهي بعد 60 دقيقة.
                  </Text>

                  <Pressable
                    style={({ pressed }) => [
                      styles.submitBtn,
                      { marginTop: 20 },
                      submitting && styles.submitBtnDisabled,
                      pressed && styles.submitBtnPressed,
                    ]}
                    onPress={onSubmit}
                    disabled={submitting}
                    testID="forgot-password-resend-button"
                  >
                    {submitting ? (
                      <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                      <Text style={styles.submitBtnText}>إعادة الإرسال</Text>
                    )}
                  </Pressable>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.footer}>
                <Pressable
                  onPress={() => router.replace('/(auth)/sign-in')}
                  testID="forgot-password-back-to-sign-in-link"
                >
                  <Text style={styles.footerText}>
                    تذكرت كلمة المرور؟ <Text style={styles.footerLink}>تسجيل الدخول</Text>
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  safe: { flex: 1, backgroundColor: '#000000' },
  scroll: { paddingHorizontal: 24, paddingTop: 12, paddingBottom: 40, backgroundColor: '#000000' },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
  headerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 30,
    position: 'relative',
  },
  logoScaleContainer: { alignItems: 'center', justifyContent: 'center' },
  logoImage: { width: 110, height: 110, marginBottom: 12 },
  lettersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  logoLetter: { color: '#FFFFFF', fontSize: 36, fontWeight: '900', letterSpacing: 2 },
  glowOverlay: {
    position: 'absolute',
    top: -10,
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#8B00FF',
    opacity: 0.2,
    zIndex: -1,
    // @ts-expect-error web-only style
    filter: Platform.OS === 'web' ? 'blur(60px)' : undefined,
    shadowColor: '#8B00FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 35,
  },
  tagline: { color: '#E4E4E7', fontSize: 14, fontWeight: '700', marginTop: 14, textAlign: 'center' },
  formContainer: { width: '100%' },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontSize: 13,
    lineHeight: 21,
    textAlign: 'center',
    marginBottom: 22,
    paddingHorizontal: 10,
  },
  inputWrapper: { marginBottom: 14, width: '100%' },
  input: {
    backgroundColor: 'rgba(25, 25, 25, 0.85)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'right',
  },
  inputError: { borderColor: '#EF4444' },
  errorText: {
    color: '#EF4444',
    fontSize: 12,
    marginTop: 6,
    textAlign: 'right',
    fontWeight: '500',
  },
  formErr: {
    color: '#EF4444',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 14,
    fontWeight: '600',
  },
  submitBtn: {
    backgroundColor: '#8B00FF',
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowColor: '#8B00FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 5,
  },
  submitBtnDisabled: { backgroundColor: '#44186B', shadowOpacity: 0, elevation: 0 },
  submitBtnPressed: { opacity: 0.85 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  sentBlock: { alignItems: 'center', width: '100%' },
  iconRing: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 245, 212, 0.35)',
    backgroundColor: 'rgba(0, 245, 212, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  divider: {
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginVertical: 25,
  },
  footer: { alignItems: 'center' },
  footerText: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, fontWeight: '600' },
  footerLink: { color: '#FFFFFF', fontWeight: '800' },
});
