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
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/src/context/AuthContext';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function SignIn() {
  const router = useRouter();
  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailErr, setEmailErr] = useState<string | null>(null);
  const [pwErr, setPwErr] = useState<string | null>(null);
  const [formErr, setFormErr] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = EMAIL_RE.test(email) && password.length >= 8 && !submitting;

  const onSubmit = async () => {
    setEmailErr(null);
    setPwErr(null);
    setFormErr(null);

    let ok = true;
    if (!EMAIL_RE.test(email)) {
      setEmailErr('البريد الإلكتروني غير صالح');
      ok = false;
    }
    if (password.length < 8) {
      setPwErr('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      ok = false;
    }
    if (!ok) return;

    setSubmitting(true);
    try {
      await signIn(email.trim(), password);
    } catch (e: any) {
      const msg = e?.message || 'حدث خطأ أثناء تسجيل الدخول';
      if (/confirm|not confirmed|verify/i.test(msg)) {
        router.replace({
          pathname: '/(auth)/verify-email',
          params: { email: email.trim() },
        });
        return;
      }
      setFormErr(msg);
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
              testID="sign-in-back-button"
            >
              <Ionicons name="chevron-back" size={20} color="#F8F9FA" />
            </Pressable>

            {/* الهيدر مع اللوجو الكبير المخصص باللون الأبيض الكامل */}
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
              
              <Text style={styles.tagline}>شارك لحظاتك</Text>
            </View>

            {/* حاوية الحقول والنصوص */}
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, emailErr ? styles.inputError : null]}
                  placeholder="البريد الإلكتروني أو اسم المستخدم"
                  placeholderTextColor="rgba(255, 255, 255, 0.45)"
                  value={email}
                  onChangeText={(val) => {
                    setEmail(val);
                    if (emailErr) setEmailErr(null);
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  testID="sign-in-email-input"
                />
                {emailErr ? <Text style={styles.errorText}>{emailErr}</Text> : null}
              </View>

              <View style={styles.inputWrapper}>
                <TextInput
                  style={[styles.input, pwErr ? styles.inputError : null]}
                  placeholder="كلمة المرور"
                  placeholderTextColor="rgba(255, 255, 255, 0.45)"
                  value={password}
                  onChangeText={(val) => {
                    setPassword(val);
                    if (pwErr) setPwErr(null);
                  }}
                  secureTextEntry
                  autoCapitalize="none"
                  autoCorrect={false}
                  testID="sign-in-password-input"
                />
                {pwErr ? <Text style={styles.errorText}>{pwErr}</Text> : null}
              </View>

              {formErr ? <Text style={styles.formErr} testID="sign-in-form-error">{formErr}</Text> : null}

              <Pressable
                style={({ pressed }) => [
                  styles.submitBtn,
                  !canSubmit && styles.submitBtnDisabled,
                  pressed && styles.submitBtnPressed
                ]}
                onPress={onSubmit}
                disabled={!canSubmit}
                testID="sign-in-submit-button"
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>تسجيل الدخول</Text>
                )}
              </Pressable>

              {/* تم ربط زر "نسيت كلمة المرور" هنا */}
              <Pressable 
                onPress={() => router.push('/(auth)/forgot-password')} 
                style={styles.forgotBtn}
                testID="sign-in-forgot-password-link"
              >
                <Text style={styles.forgotText}>هل نسيت كلمة المرور؟</Text>
              </Pressable>
            </View>

            <View style={styles.divider} />

            <View style={styles.footer}>
              <Pressable
                onPress={() => router.replace('/(auth)/sign-up')}
                testID="sign-in-go-to-sign-up-link"
              >
                <Text style={styles.footerText}>
                  ليس لديك حساب؟ <Text style={styles.footerLink}>إنشاء حساب</Text>
                </Text>
              </Pressable>
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
    width: 36, height: 36, borderRadius: 18, borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)', alignItems: 'center',
    justifyContent: 'center', marginBottom: 5, alignSelf: 'flex-start',
  },
  headerContainer: { alignItems: 'center', justifyContent: 'center', marginTop: 15, marginBottom: 35, position: 'relative' },
  logoScaleContainer: { alignItems: 'center', justifyContent: 'center' },
  logoImage: { width: 130, height: 130, marginBottom: 15 },
  lettersContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 20 },
  logoLetter: { color: '#FFFFFF', fontSize: 40, fontWeight: '900', letterSpacing: 2 },
  glowOverlay: {
    position: 'absolute', top: -10, width: 110, height: 110, borderRadius: 55,
    backgroundColor: '#8B00FF', opacity: 0.2, zIndex: -1,
    filter: Platform.OS === 'web' ? 'blur(60px)' : undefined,
    shadowColor: '#8B00FF', shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8, shadowRadius: 35,
  },
  tagline: { color: '#E4E4E7', fontSize: 14, fontWeight: '700', marginTop: 18, textAlign: 'center' },
  formContainer: { width: '100%' },
  inputWrapper: { marginBottom: 14, width: '100%' },
  input: {
    backgroundColor: 'rgba(25, 25, 25, 0.85)',
    borderWidth: 1.5, borderColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 12, paddingVertical: 15, paddingHorizontal: 16,
    fontSize: 14, color: '#FFFFFF', textAlign: 'right',
  },
  inputError: { borderColor: '#EF4444' },
  errorText: { color: '#EF4444', fontSize: 12, marginTop: 6, textAlign: 'right', fontWeight: '500' },
  formErr: { color: '#EF4444', fontSize: 13, textAlign: 'center', marginBottom: 14, fontWeight: '600' },
  submitBtn: {
    backgroundColor: '#8B00FF', borderRadius: 10, paddingVertical: 15,
    alignItems: 'center', justifyContent: 'center', marginTop: 10,
    shadowColor: '#8B00FF', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 12, elevation: 5,
  },
  submitBtnDisabled: { backgroundColor: '#44186B', shadowOpacity: 0, elevation: 0 },
  submitBtnPressed: { opacity: 0.85 },
  submitBtnText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  forgotBtn: { alignItems: 'center', marginTop: 18 },
  forgotText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', opacity: 0.9 },
  divider: { height: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.08)', marginVertical: 25 },
  footer: { alignItems: 'center' },
  footerText: { color: 'rgba(255, 255, 255, 0.7)', fontSize: 14, fontWeight: '600' },
  footerLink: { color: '#FFFFFF', fontWeight: '800' },
});
