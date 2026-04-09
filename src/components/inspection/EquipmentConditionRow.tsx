import React, { memo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { colors } from '@/constants/colors';
import { spacing } from '@/constants/spacing';
import { equipmentConditionOptions } from '@/constants/options';
import { EquipmentConditionValue } from '@/types/inspection';

interface EquipmentConditionRowProps {
  label: string;
  value: EquipmentConditionValue;
  onChange: (v: EquipmentConditionValue) => void;
}

export const EquipmentConditionRow = memo(function EquipmentConditionRow({
  label,
  value,
  onChange,
}: EquipmentConditionRowProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <SegmentedControl
        options={equipmentConditionOptions}
        value={value}
        onChange={onChange as (v: string) => void}
        style={styles.control}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: spacing.sm,
  },
  control: {
    // inherits full width
  },
});
