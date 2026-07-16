import React from 'react';
import { StyleSheet, View } from 'react-native';

/**
 * SolidBackground — pure metallic dark black canvas.
 * Kept as a component (was AuroraBackground) so screens don't need edits.
 */
export function AuroraBackground() {
  return <View style={styles.bg} pointerEvents="none" />;
}

const styles = StyleSheet.create({
  bg: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#05050A',
  },
});
