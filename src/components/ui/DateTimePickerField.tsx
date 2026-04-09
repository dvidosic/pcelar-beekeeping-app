import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';
import { formatDate, formatDateTime } from '@/utils/dateUtils';

interface DateTimePickerFieldProps {
  label: string;
  value: Date;
  onChange: (date: Date) => void;
  mode?: 'date' | 'time' | 'datetime';
  disabled?: boolean;
}

export function DateTimePickerField({
  label,
  value,
  onChange,
  mode = 'datetime',
  disabled,
}: DateTimePickerFieldProps) {
  // For Android datetime, we need two sequential dialogs: date then time
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [pendingDate, setPendingDate] = useState<Date>(value);

  const displayValue =
    mode === 'date' ? formatDate(value.toISOString()) : formatDateTime(value.toISOString());

  const handlePress = () => {
    if (disabled) return;
    if (mode === 'datetime' || mode === 'date') {
      setShowDate(true);
    } else {
      setShowTime(true);
    }
  };

  const handleDateChange = (_event: DateTimePickerEvent, selected?: Date) => {
    setShowDate(false);
    if (selected) {
      if (mode === 'datetime') {
        // Store selected date, then open time picker
        setPendingDate(selected);
        setShowTime(true);
      } else {
        onChange(selected);
      }
    }
  };

  const handleTimeChange = (_event: DateTimePickerEvent, selected?: Date) => {
    setShowTime(false);
    if (selected) {
      if (mode === 'datetime') {
        // Combine the pending date with the selected time
        const combined = new Date(pendingDate);
        combined.setHours(selected.getHours());
        combined.setMinutes(selected.getMinutes());
        combined.setSeconds(0);
        combined.setMilliseconds(0);
        onChange(combined);
      } else {
        onChange(selected);
      }
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.field, disabled && styles.fieldDisabled]}
        onPress={handlePress}
        activeOpacity={0.7}
        accessibilityRole="button"
      >
        <Text style={styles.calendarIcon}>📅</Text>
        <Text style={[styles.value, disabled && styles.valueDisabled]}>{displayValue}</Text>
        <Text style={styles.chevron}>›</Text>
      </TouchableOpacity>

      {showDate && (
        <DateTimePicker
          value={mode === 'datetime' ? pendingDate : value}
          mode="date"
          display="default"
          onChange={handleDateChange}
          locale="hr-HR"
        />
      )}
      {showTime && (
        <DateTimePicker
          value={mode === 'datetime' ? pendingDate : value}
          mode="time"
          display="default"
          is24Hour
          onChange={handleTimeChange}
        />
      )}
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
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 56,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  fieldDisabled: {
    backgroundColor: colors.surface,
    borderColor: colors.disabled,
  },
  calendarIcon: {
    fontSize: 20,
  },
  value: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  valueDisabled: {
    color: colors.disabledText,
  },
  chevron: {
    fontSize: 22,
    color: colors.textMuted,
  },
});
