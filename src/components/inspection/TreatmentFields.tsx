import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { DateTimePickerField } from '@/components/ui/DateTimePickerField';
import { FormField } from '@/components/ui/FormField';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';
import { L } from '@/constants/labels';

interface TreatmentFieldsProps {
  substance: string;
  onSubstanceChange: (v: string) => void;
  treatmentDate: Date;
  onTreatmentDateChange: (d: Date) => void;
}

export function TreatmentFields({
  substance,
  onSubstanceChange,
  treatmentDate,
  onTreatmentDateChange,
}: TreatmentFieldsProps) {
  return (
    <View style={styles.container}>
      <FormField label={L.sredstvoTretmana} required>
        <TextInput
          style={styles.input}
          value={substance}
          onChangeText={onSubstanceChange}
          placeholder="npr. Apivar, Oxalic acid..."
          placeholderTextColor={colors.disabledText}
          returnKeyType="done"
          autoCapitalize="words"
        />
      </FormField>
      <DateTimePickerField
        label={L.datumTretmana}
        value={treatmentDate}
        onChange={onTreatmentDateChange}
        mode="date"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    marginTop: spacing.sm,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
    minHeight: 56,
  },
});
