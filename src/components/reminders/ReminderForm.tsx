import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { DateTimePickerField } from '@/components/ui/DateTimePickerField';
import { FormField } from '@/components/ui/FormField';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';
import { L } from '@/constants/labels';

interface ReminderFormProps {
  onSubmit: (description: string, remindAt: Date) => Promise<void>;
}

function defaultRemindAt(): Date {
  // Default to tomorrow at 09:00
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(9, 0, 0, 0);
  return d;
}

export function ReminderForm({ onSubmit }: ReminderFormProps) {
  const [description, setDescription] = useState('');
  const [remindAt, setRemindAt] = useState(defaultRemindAt);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!description.trim()) {
      setError(L.obaveznoPolje);
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await onSubmit(description.trim(), remindAt);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <FormField label={L.opisRadnje} required error={error}>
        <TextInput
          style={[styles.input, error ? styles.inputError : null]}
          value={description}
          onChangeText={(v) => {
            setDescription(v);
            if (error) setError('');
          }}
          placeholder={L.unesiteOpis}
          placeholderTextColor={colors.disabledText}
          autoCapitalize="sentences"
          returnKeyType="done"
          multiline
          numberOfLines={2}
          textAlignVertical="top"
        />
      </FormField>

      <DateTimePickerField
        label={L.datumPodsjetnika}
        value={remindAt}
        onChange={setRemindAt}
        mode="datetime"
      />

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
    paddingTop: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
    minHeight: 72,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.danger,
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
