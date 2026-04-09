import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useUIStore } from '@/stores/uiStore';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { L } from '@/constants/labels';

export function LoadingOverlay() {
  const globalLoading = useUIStore((s) => s.globalLoading);

  if (!globalLoading) return null;

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.text}>{L.učitavanje}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,248,225,0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    gap: spacing.md,
  },
  text: {
    fontSize: 15,
    color: colors.textMuted,
  },
});
