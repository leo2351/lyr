import React from 'react';
import { View, Text, StyleSheet, Pressable, SafeAreaView, StatusBar, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useI18n } from '@/src/i18n';

export default function Welcome() {
  const router = useRouter();
  const { t, locale, setLocale } = useI18n();
  const toggleLang = () => setLocale(locale === 'en' ? 'ar' : 'en');

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <SafeAreaView style={styles.safe}>
        
        <View style={styles.topRow}>
          <Pressable onPress={toggleLang} style={styles.langPill}>
            <Text style={styles.langPillText}>{locale === 'en' ? 'العربية' : 'English'}</Text>
          </Pressable>
        </View>

        <View style={styles.headerContainer}>
          <Image source={require('@/assets/images/icon.png')} style={styles.logoImage} resizeMode="contain" />
          <Text style={styles.title}>{t('auth.welcomeTitle')}</Text>
          <Text style={styles.subtitle}>{t('auth.welcomeSubtitle')}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable style={styles.mainBtn} onPress={() => router.push('/(auth)/sign-up')}>
            <Text style={styles.btnText}>إنشاء حساب</Text>
          </Pressable>
          
          <Pressable style={styles.ghostBtn} onPress={() => router.push('/(auth)/sign-in')}>
            <Text style={styles.ghostBtnText}>تسجيل الدخول</Text>
          </Pressable>
        </View>

      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#000000' },
  safe: { flex: 1, justifyContent: 'space-between', paddingBottom: 40 },
  topRow: { flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 10, paddingHorizontal: 24 },
  langPill: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.12)', backgroundColor: 'rgba(25, 25, 25, 0.85)' },
  langPillText: { color: '#FFF', fontWeight: '700', fontSize: 12 },
  headerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 20, paddingHorizontal: 24 },
  logoImage: { width: 200, height: 200, marginBottom: 20 },
  title: { color: '#FFF', fontSize: 24, fontWeight: '800', marginBottom: 12 },
  subtitle: { color: '#A1A1AA', fontSize: 15, textAlign: 'center', paddingHorizontal: 20 },
  actions: { width: '100%', gap: 10 },
  mainBtn: { 
    backgroundColor: '#8B00FF', 
    borderRadius: 12, 
    paddingVertical: 12, 
    alignItems: 'center',
    marginHorizontal: 30, 
  },
  btnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
  ghostBtn: { 
    borderRadius: 12, 
    paddingVertical: 12, 
    alignItems: 'center', 
    borderWidth: 1.5, 
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginHorizontal: 30, 
  },
  ghostBtnText: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});
