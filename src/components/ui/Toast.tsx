import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useUIStore } from '@/stores/uiStore';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';

export function ToastRenderer() {
  const toastQueue = useUIStore((s) => s.toastQueue);

  if (toastQueue.length === 0) return null;

  const toast = toastQueue[toastQueue.length - 1];

  const bgColor =
    toast.type === 'success'
      ? colors.success
      : toast.type === 'error'
      ? colors.danger
      : colors.text;

  return (
    <View style={[styles.toast, { backgroundColor: bgColor }]} pointerEvents="none">
      <Text style={styles.text}>{toast.message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    bottom: 90,
    left: spacing.base,
    right: spacing.base,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.base,
    borderRadius: radius.md,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 1000,
  },
  text: {
    color: colors.white,
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
});
