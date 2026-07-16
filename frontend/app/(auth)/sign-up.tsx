import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuth } from '@/src/context/AuthContext';

export default function SignUp() {
  const router = useRouter();
  const { signUp } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // التحقق من الحقول لتفعيل أو تعطيل الزر بنفس طريقة تسجيل الدخول
  const canSubmit = email.trim() !== '' && password.length >= 8 && username.trim() !== '' && !submitting;

  const onSubmit = async () => {
    if (!canSubmit) return;
    
    setSubmitting(true);
    try {
      await signUp(email.trim(), password, username.trim());
      router.replace({ 
        pathname: '/(auth)/verify-email', 
        params: { email: email.trim() } 
      });
    } catch (e) {
      console.log(e);
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
            >
              <Ionicons name="chevron-back" size={20} color="#F8F9FA" />
            </Pressable>

            {/* الهيدر مع اللوجو الكبير المخصص باللون الأبيض الكامل */}
            <View style={styles.headerContainer}>
              {/* التوهج البنفسجي */}
              <View style={styles.glowOverlay} />
              
              <View style={styles.logoScaleContainer}>
                {/* الشعار */}
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
              
              <Text style={styles.tagline}>أنشئ حسابك وشارك لحظاتك</Text>
            </View>

            {/* حاوية الحقول */}
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.input} 
                  placeholder="اسم المستخدم" 
                  placeholderTextColor="rgba(255, 255, 255, 0.45)" 
                  value={username} 
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  autoCorrect={false} 
                />
              </View>

              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.input} 
                  placeholder="البريد الإلكتروني" 
                  placeholderTextColor="rgba(255, 255, 255, 0.45)" 
                  value={email} 
                  onChangeText={setEmail} 
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputWrapper}>
                <TextInput 
                  style={styles.input} 
                  placeholder="كلمة المرور (8 أحرف على الأقل)" 
                  placeholderTextColor="rgba(255, 255, 255, 0.45)" 
                  value={password} 
                  onChangeText={setPassword} 
                  secureTextEntry 
                />
              </View>

              {/* زر إنشاء الحساب */}
              <Pressable 
                style={({ pressed }) => [
                  styles.submitBtn,
                  !canSubmit && styles.submitBtnDisabled,
                  pressed && styles.submitBtnPressed
                ]} 
                onPress={onSubmit}
                disabled={!canSubmit}
              >
                {submitting ? (
                  <ActivityIndicator color="#FFFFFF" size="small" />
                ) : (
                  <Text style={styles.submitBtnText}>إنشاء الحساب</Text>
                )}
              </Pressable>
            </View>

            {/* الخط الفاصل */}
            <View style={styles.divider} />

            {/* الفوتر */}
            <Pressable 
              onPress={() => router.replace('/(auth)/sign-in')} 
              style={styles.footer}
            >
              <Text style={styles.footerText}>
                لديك حساب بالفعل؟ <Text style={styles.footerLink}>تسجيل الدخول</Text>
              </Text>
            </Pressable>

          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { 
    flex: 1, 
    backgroundColor: '#000000' 
  },
  safe: { 
    flex: 1, 
    backgroundColor: '#000000' 
  },
  scroll: { 
    paddingHorizontal: 24, 
    paddingTop: 12, 
    paddingBottom: 40, 
    backgroundColor: '#000000' 
  },
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
    marginBottom: 35,
    position: 'relative',
  },
  logoScaleContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoImage: {
    width: 130,
    height: 130,
    marginBottom: 15,
  },
  lettersContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  logoLetter: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '900',
    letterSpacing: 2,
  },
  glowOverlay: {
    position: 'absolute',
    top: -10, 
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#8B00FF', 
    opacity: 0.2,
    zIndex: -1, 
    filter: Platform.OS === 'web' ? 'blur(60px)' : undefined, 
    shadowColor: '#8B00FF', 
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 35,
  },
  tagline: {
    color: '#E4E4E7', 
    fontSize: 14,
    fontWeight: '700',
    marginTop: 18, 
    textAlign: 'center',
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 14,
    width: '100%',
  },
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
  submitBtnDisabled: {
    backgroundColor: '#44186B',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnPressed: {
    opacity: 0.85,
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  divider: {
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)', 
    marginVertical: 25,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.7)', 
    fontSize: 14,
    fontWeight: '600',
  },
  footerLink: {
    color: '#FFFFFF', 
    fontWeight: '800',
  },
});
