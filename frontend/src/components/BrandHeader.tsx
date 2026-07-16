import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Image, ImageSourcePropType } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

type Props = {
  subtitle?: string;
  compact?: boolean;
};

const LOGO: ImageSourcePropType = require('../../assets/images/lyra-logo.jpg');

/**
 * BrandHeader — pulsing orb logo + "L Y R" wordmark.
 * Pulses a soft outer purple shadow ring to echo the orb's luminance.
 */
export function BrandHeader({ subtitle, compact = false }: Props) {
  const pulse = useSharedValue(0);

  useEffect(() => {
    pulse.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1600, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 1600, easing: Easing.in(Easing.quad) }),
      ),
      -1,
      false,
    );
  }, [pulse]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + pulse.value * 0.45,
    transform: [{ scale: 1 + pulse.value * 0.14 }],
  }));

  const size = compact ? 72 : 112;

  return (
    <View style={styles.wrapper}>
      <View style={[styles.logoWrap, { width: size + 60, height: size + 60 }]}>
        <Animated.View
          style={[
            styles.glow,
            {
              width: size + 40,
              height: size + 40,
              borderRadius: (size + 40) / 2,
            },
            glowStyle,
          ]}
        />
        <Image
          source={LOGO}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
          }}
          testID="brand-header-logo"
        />
      </View>

      <Text style={[styles.wordmark, compact && styles.wordmarkCompact]} testID="brand-header-wordmark">
        L <Text style={styles.wordmarkAccent}>Y</Text> R
      </Text>

      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  logoWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  glow: {
    position: 'absolute',
    backgroundColor: 'rgba(157, 78, 221, 0.55)',
    shadowColor: '#9D4EDD',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 40,
  },
  wordmark: {
    color: '#F8F9FA',
    fontSize: 44,
    fontWeight: '900',
    letterSpacing: 14,
    textShadowColor: 'rgba(157, 78, 221, 0.6)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  wordmarkCompact: {
    fontSize: 30,
    letterSpacing: 10,
  },
  wordmarkAccent: {
    color: '#C77DFF',
  },
  subtitle: {
    marginTop: 8,
    color: '#A1A1AA',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
