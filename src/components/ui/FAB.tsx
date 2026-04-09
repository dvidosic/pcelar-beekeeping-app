import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';

interface FABProps {
  onPress: () => void;
  icon?: string;
  label?: string;
  style?: ViewStyle;
}

export function FAB({ onPress, icon = '+', label, style }: FABProps) {
  return (
    <TouchableOpacity
      style={[styles.fab, label ? styles.extended : styles.round, style]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
    >
      <Text style={styles.icon}>{icon}</Text>
      {label && <Text style={styles.label}>{label}</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: spacing.lg,
    right: spacing.base,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  round: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
  },
  extended: {
    height: 56,
    borderRadius: radius.full,
    paddingHorizontal: spacing.base,
    gap: spacing.sm,
  },
  icon: {
    fontSize: 26,
    color: colors.textOnPrimary,
    lineHeight: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textOnPrimary,
  },
});
