import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { radius } from '@/constants/spacing';

interface NumericStepperProps {
  value: number | null;
  onChange: (value: number | null) => void;
  min?: number;
  max?: number;
  label: string;
}

export function NumericStepper({
  value,
  onChange,
  min = 1,
  max = 20,
}: NumericStepperProps) {
  const handleDecrement = () => {
    if (value === null) return;
    if (value <= min) {
      onChange(null);
    } else {
      onChange(value - 1);
    }
  };

  const handleIncrement = () => {
    if (value === null) {
      onChange(min);
    } else if (value < max) {
      onChange(value + 1);
    }
  };

  const atMax = value !== null && value >= max;

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.btn, styles.btnLeft]}
        onPress={handleDecrement}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel="Smanji"
      >
        <Text style={styles.btnText}>−</Text>
      </TouchableOpacity>

      <View style={styles.valueDisplay}>
        <Text style={[styles.valueText, value === null && styles.valueNull]}>
          {value !== null ? String(value) : '—'}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.btn, styles.btnRight, atMax && styles.btnDisabled]}
        onPress={handleIncrement}
        activeOpacity={0.7}
        disabled={atMax}
        accessibilityRole="button"
        accessibilityLabel="Povećaj"
      >
        <Text style={[styles.btnText, atMax && styles.btnTextDisabled]}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
    backgroundColor: colors.primary,
  },
  btnLeft: {},
  btnRight: {},
  btnDisabled: {
    backgroundColor: colors.disabled,
  },
  btnText: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
  btnTextDisabled: {
    color: colors.disabledText,
  },
  valueDisplay: {
    flex: 2,
    minHeight: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  valueText: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  valueNull: {
    color: colors.disabledText,
  },
});
