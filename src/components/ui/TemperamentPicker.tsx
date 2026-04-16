import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';
import { L } from '@/constants/labels';

const LEVELS = [
  { value: 1, emoji: '😡' },
  { value: 2, emoji: '😠' },
  { value: 3, emoji: '😐' },
  { value: 4, emoji: '🙂' },
  { value: 5, emoji: '😌' },
];

interface TemperamentPickerProps {
  value: number; // 1–5
  onChange: (v: number) => void;
  disabled?: boolean;
}

export function TemperamentPicker({ value, onChange, disabled }: TemperamentPickerProps) {
  return (
    <View style={styles.wrapper}>
      <View style={styles.endLabels}>
        <Text style={styles.endLabel}>{L.vrloAgresivna}</Text>
        <Text style={styles.endLabel}>{L.vrlaMirna}</Text>
      </View>
      <View style={styles.row}>
        {LEVELS.map((level, index) => {
          const selected = level.value === value;
          const isFirst = index === 0;
          const isLast = index === LEVELS.length - 1;
          return (
            <TouchableOpacity
              key={level.value}
              style={[
                styles.btn,
                selected ? styles.btnSelected : styles.btnUnselected,
                isFirst && styles.btnFirst,
                isLast && styles.btnLast,
                disabled && styles.btnDisabled,
              ]}
              onPress={() => !disabled && onChange(level.value)}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Temperament ${level.value}`}
              accessibilityState={{ selected }}
            >
              <Text style={[styles.number, selected && styles.numberSelected]}>
                {level.value}
              </Text>
              <Text style={styles.emoji}>{level.emoji}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: spacing.sm,
  },
  endLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  endLabel: {
    fontSize: 11,
    color: colors.textMuted,
    fontStyle: 'italic',
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
    paddingVertical: 6,
    gap: 2,
  },
  btnFirst: {},
  btnLast: {},
  btnSelected: {
    backgroundColor: colors.primary,
  },
  btnUnselected: {
    backgroundColor: colors.white,
  },
  btnDisabled: {
    opacity: 0.45,
  },
  number: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  numberSelected: {
    color: colors.textOnPrimary,
  },
  emoji: {
    fontSize: 14,
  },
});
