import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { FormField } from '@/components/ui/FormField';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';
import { L } from '@/constants/labels';
import { HiveFormValues } from '@/types/hive';

interface HiveFormProps {
  initialValues?: Partial<HiveFormValues>;
  onSubmit: (values: HiveFormValues) => Promise<void>;
  onCancel: () => void;
  submitLabel: string;
  isLoading?: boolean;
}

export function HiveForm({
  initialValues,
  onSubmit,
  onCancel,
  submitLabel,
  isLoading,
}: HiveFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [location, setLocation] = useState(initialValues?.location ?? '');
  const [notes, setNotes] = useState(initialValues?.notes ?? '');
  const [nameError, setNameError] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) {
      setNameError(L.obaveznoPolje);
      return;
    }
    setNameError('');
    await onSubmit({ name: name.trim(), location: location.trim(), notes: notes.trim() });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.flex}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <FormField label={L.imjeKošnice} required error={nameError}>
          <TextInput
            style={[styles.input, nameError ? styles.inputError : null]}
            value={name}
            onChangeText={(t) => { setName(t); if (t.trim()) setNameError(''); }}
            placeholder={L.unesiteNaziv}
            placeholderTextColor={colors.disabledText}
            returnKeyType="next"
            autoFocus
          />
        </FormField>

        <FormField label={L.lokacija}>
          <TextInput
            style={styles.input}
            value={location}
            onChangeText={setLocation}
            placeholder="npr. Livada kraj rijeke"
            placeholderTextColor={colors.disabledText}
            returnKeyType="next"
          />
        </FormField>

        <FormField label={L.bilješka}>
          <TextInput
            style={[styles.input, styles.multiline]}
            value={notes}
            onChangeText={setNotes}
            placeholder="Dodatne napomene..."
            placeholderTextColor={colors.disabledText}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </FormField>

        <View style={styles.actions}>
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel} activeOpacity={0.7}>
            <Text style={styles.cancelText}>{L.odustani}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.submitBtn, isLoading && styles.submitDisabled]}
            onPress={handleSubmit}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            {isLoading ? (
              <ActivityIndicator color={colors.textOnPrimary} />
            ) : (
              <Text style={styles.submitText}>{submitLabel}</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: spacing.base,
    paddingBottom: spacing.xl,
  },
  input: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.text,
    backgroundColor: colors.white,
    minHeight: 56,
  },
  inputError: {
    borderColor: colors.danger,
  },
  multiline: {
    minHeight: 88,
    paddingTop: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  cancelBtn: {
    flex: 1,
    height: 56,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
  },
  submitBtn: {
    flex: 2,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textOnPrimary,
  },
});
