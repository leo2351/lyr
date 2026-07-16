import React from 'react';
import {
  StyleSheet,
  Text,
  Pressable,
  ActivityIndicator,
  View,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  label: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: 'primary' | 'ghost';
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function GradientButton({
  label,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  style,
  testID,
}: Props) {
  const isDisabled = disabled || loading;

  if (variant === 'ghost') {
    return (
      <Pressable
        onPress={onPress}
        disabled={isDisabled}
        style={({ pressed }) => [
          styles.ghost,
          pressed && !isDisabled && { opacity: 0.7, transform: [{ scale: 0.99 }] },
          isDisabled && { opacity: 0.5 },
          style,
        ]}
        testID={testID}
      >
        <Text style={styles.ghostLabel}>{label}</Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.wrapper,
        pressed && !isDisabled && { transform: [{ scale: 0.985 }] },
        isDisabled && { opacity: 0.55 },
        style,
      ]}
      testID={testID}
    >
      <LinearGradient
        colors={['#9D4EDD', '#7B2CBF', '#5A189A']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.shine} pointerEvents="none" />
        {loading ? (
          <ActivityIndicator color="#F8F9FA" />
        ) : (
          <Text style={styles.label}>{label}</Text>
        )}
      </LinearGradient>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: 999,
    overflow: 'hidden',
    shadowColor: '#9D4EDD',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 8,
  },
  gradient: {
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    position: 'relative',
  },
  shine: {
    position: 'absolute',
    top: 1,
    left: 12,
    right: 12,
    height: 22,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.10)',
  },
  label: {
    color: '#F8F9FA',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  ghost: {
    height: 56,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    borderWidth: 1,
    borderColor: 'rgba(199, 125, 255, 0.35)',
    backgroundColor: 'rgba(157, 78, 221, 0.08)',
  },
  ghostLabel: {
    color: '#F8F9FA',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
});
