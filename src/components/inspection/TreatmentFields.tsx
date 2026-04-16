import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { FormField } from '@/components/ui/FormField';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';
import { L } from '@/constants/labels';
import { formatDate } from '@/utils/dateUtils';

interface TreatmentFieldsProps {
  substance: string;
  onSubstanceChange: (v: string) => void;
  treatmentDates: string[];
  onTreatmentDatesChange: (dates: string[]) => void;
}

export function TreatmentFields({
  substance,
  onSubstanceChange,
  treatmentDates,
  onTreatmentDatesChange,
}: TreatmentFieldsProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handlePickDate = (_event: DateTimePickerEvent, selected?: Date) => {
    setShowDatePicker(false);
    if (selected) {
      const iso = selected.toISOString();
      const updated = [...treatmentDates, iso].sort();
      onTreatmentDatesChange(updated);
    }
  };

  const handleRemoveDate = (index: number) => {
    onTreatmentDatesChange(treatmentDates.filter((_, i) => i !== index));
  };

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

      <Text style={styles.sectionLabel}>{L.datumiTretmana}</Text>

      {treatmentDates.map((iso, index) => (
        <View key={iso + index} style={styles.dateRow}>
          <Text style={styles.dateText}>{formatDate(iso)}</Text>
          <TouchableOpacity
            style={styles.removeBtn}
            onPress={() => handleRemoveDate(index)}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={L.ukloniDatum}
          >
            <Text style={styles.removeBtnText}>×</Text>
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => setShowDatePicker(true)}
        activeOpacity={0.7}
        accessibilityRole="button"
      >
        <Text style={styles.addBtnText}>{L.dodajDatumTretmana}</Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="default"
          onChange={handlePickDate}
          locale="hr-HR"
        />
      )}
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
    gap: spacing.sm,
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
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: spacing.xs,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingLeft: spacing.md,
    minHeight: 48,
  },
  dateText: {
    fontSize: 15,
    color: colors.text,
    flex: 1,
  },
  removeBtn: {
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  removeBtnText: {
    fontSize: 22,
    color: colors.danger,
    fontWeight: '700',
    lineHeight: 26,
  },
  addBtn: {
    minHeight: 48,
    borderWidth: 1.5,
    borderColor: colors.primary,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.white,
  },
  addBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.primary,
  },
});
