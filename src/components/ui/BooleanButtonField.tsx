import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';
import { L } from '@/constants/labels';

interface BooleanButtonFieldProps {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
  trueLabel?: string;
  falseLabel?: string;
  disabled?: boolean;
}

export function BooleanButtonField({
  label,
  value,
  onChange,
  trueLabel = L.da,
  falseLabel = L.ne,
  disabled,
}: BooleanButtonFieldProps) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.row}>
        <TouchableOpacity
          style={[styles.btn, styles.btnLeft, value && styles.btnSelected, disabled && styles.btnDisabled]}
          onPress={() => !disabled && onChange(true)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityState={{ selected: value }}
        >
          <Text style={[styles.btnText, value ? styles.btnTextSelected : styles.btnTextUnselected]}>
            {trueLabel}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.btn, styles.btnRight, !value && styles.btnSelected, disabled && styles.btnDisabled]}
          onPress={() => !disabled && onChange(false)}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityState={{ selected: !value }}
        >
          <Text style={[styles.btnText, !value ? styles.btnTextSelected : styles.btnTextUnselected]}>
            {falseLabel}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.base,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    borderRadius: radius.sm,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  btn: {
    flex: 1,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  btnLeft: {
    borderRightWidth: 0.75,
    borderRightColor: colors.border,
  },
  btnRight: {
    borderLeftWidth: 0.75,
    borderLeftColor: colors.border,
  },
  btnSelected: {
    backgroundColor: colors.primary,
  },
  btnDisabled: {
    opacity: 0.45,
  },
  btnText: {
    fontSize: 16,
    fontWeight: '700',
  },
  btnTextSelected: {
    color: colors.textOnPrimary,
  },
  btnTextUnselected: {
    color: colors.text,
  },
});
