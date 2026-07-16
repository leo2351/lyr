import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

type Props = {
  children: ReactNode;
  style?: ViewStyle | ViewStyle[];
};

/**
 * GlassCard — clean dark surface with a thin quiet border.
 * (Simplified from the previous frosted-glass variant to match the
 * "clean design" refactor spec.)
 */
export function GlassCard({ children, style }: Props) {
  return <View style={[styles.card, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    backgroundColor: '#0A0A10',
  },
});
