import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  StyleSheet,
} from 'react-native';
import { DateTimePickerField } from '@/components/ui/DateTimePickerField';
import { SegmentedControl } from '@/components/ui/SegmentedControl';
import { FormField } from '@/components/ui/FormField';
import { feedingTypeOptions } from '@/constants/options';
import { Feeding } from '@/types/feeding';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';
import { L } from '@/constants/labels';

interface FeedingFormProps {
  hiveId: string;
  onSubmit: (data: Omit<Feeding, 'id'>) => Promise<void>;
}

export function FeedingForm({ hiveId, onSubmit }: FeedingFormProps) {
  const [fedAt, setFedAt] = useState(new Date());
  const [foodType, setFoodType] = useState<'sugar_syrup' | 'fondant' | 'other'>('sugar_syrup');
  const [foodTypeCustom, setFoodTypeCustom] = useState('');
  const [quantityKg, setQuantityKg] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        hive_id: hiveId,
        fed_at: fedAt.toISOString(),
        food_type: foodType,
        food_type_custom: foodType === 'other' ? (foodTypeCustom.trim() || null) : null,
        quantity_kg: quantityKg ? parseFloat(quantityKg) : null,
        notes: notes.trim() || null,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <DateTimePickerField
        label={L.datumVrijeme}
        value={fedAt}
        onChange={setFedAt}
        mode="date"
      />

      <FormField label={L.vrstaHrane}>
        <SegmentedControl
          options={feedingTypeOptions}
          value={foodType}
          onChange={(v) => setFoodType(v as typeof foodType)}
        />
      </FormField>

      {foodType === 'other' && (
        <FormField label={L.unesiteNaziv}>
          <TextInput
            style={styles.input}
            value={foodTypeCustom}
            onChangeText={setFoodTypeCustom}
            placeholder={L.unesiteNaziv}
            placeholderTextColor={colors.disabledText}
            autoCapitalize="words"
            returnKeyType="done"
          />
        </FormField>
      )}

      <FormField label={L.količinaKg}>
        <TextInput
          style={styles.input}
          value={quantityKg}
          onChangeText={setQuantityKg}
          placeholder={L.unesiteKolicinu}
          placeholderTextColor={colors.disabledText}
          keyboardType="decimal-pad"
          returnKeyType="done"
          blurOnSubmit={false}
          onSubmitEditing={() => Keyboard.dismiss()}
        />
      </FormField>

      <FormField label={L.napomene}>
        <TextInput
          style={[styles.input, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder="—"
          placeholderTextColor={colors.disabledText}
          multiline
          numberOfLines={3}
          textAlignVertical="top"
        />
      </FormField>

      <TouchableOpacity
        style={[styles.submitBtn, isSubmitting && styles.submitDisabled]}
        onPress={handleSubmit}
        disabled={isSubmitting}
        activeOpacity={0.8}
      >
        {isSubmitting ? (
          <ActivityIndicator color={colors.textOnPrimary} />
        ) : (
          <Text style={styles.submitText}>{L.spremi}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
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
  notesInput: {
    minHeight: 80,
    paddingTop: spacing.md,
  },
  submitBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.sm,
    elevation: 2,
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
});
