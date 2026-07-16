import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  ReactNode,
} from 'react';
import { I18n } from 'i18n-js';
import { I18nManager, Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { translations, Locale } from './translations';

const i18n = new I18n(translations);
i18n.enableFallback = true;
i18n.defaultLocale = 'en';

const STORAGE_KEY = 'lyra.locale';

type I18nContextValue = {
  locale: Locale;
  isRTL: boolean;
  t: (key: string, options?: object) => string;
  setLocale: (locale: Locale) => Promise<void>;
};

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

function resolveInitialLocale(): Locale {
  // Default to Arabic per current design brief; user can toggle via language pill.
  return 'ar';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    (async () => {
      const stored = (await AsyncStorage.getItem(STORAGE_KEY)) as Locale | null;
      const initial = stored ?? resolveInitialLocale();
      i18n.locale = initial;
      const shouldBeRTL = initial === 'ar';
      if (I18nManager.isRTL !== shouldBeRTL && Platform.OS !== 'web') {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
      }
      setLocaleState(initial);
    })();
  }, []);

  const setLocale = useCallback(async (next: Locale) => {
    i18n.locale = next;
    await AsyncStorage.setItem(STORAGE_KEY, next);
    const shouldBeRTL = next === 'ar';
    if (Platform.OS !== 'web' && I18nManager.isRTL !== shouldBeRTL) {
      I18nManager.allowRTL(shouldBeRTL);
      I18nManager.forceRTL(shouldBeRTL);
      // Full reload is needed for RTL flip to take effect natively.
      // Consumer screens can prompt the user; we don't force-restart here.
    }
    setLocaleState(next);
  }, []);

  const t = useCallback((key: string, options?: object) => i18n.t(key, options), []);

  const value = useMemo<I18nContextValue>(
    () => ({ locale, isRTL: locale === 'ar', t, setLocale }),
    [locale, t, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>');
  return ctx;
}
