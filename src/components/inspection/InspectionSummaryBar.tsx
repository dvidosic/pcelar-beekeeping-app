import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';
import { L } from '@/constants/labels';
import { Inspection, HealthStatus } from '@/types/inspection';
import { formatDate } from '@/utils/dateUtils';
import { healthStatusOptions } from '@/constants/options';

interface InspectionSummaryBarProps {
  inspection: Inspection | null;
  onPress: () => void;
}

function healthColor(status: HealthStatus | null): string {
  if (!status || status === 'healthy') return colors.success;
  if (status === 'varroa' || status === 'nosema') return colors.danger;
  return colors.warning;
}

export const InspectionSummaryBar = memo(function InspectionSummaryBar({
  inspection,
  onPress,
}: InspectionSummaryBarProps) {
  if (!inspection) return null;

  const color = healthColor(inspection.health_status);
  const label =
    healthStatusOptions.find((o) => o.value === inspection.health_status)?.label ?? L.zdravo;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.row}>
        <Text style={styles.dateLabel}>{L.zadnjiPregled}:</Text>
        <Text style={styles.date}>{formatDate(inspection.inspected_at)}</Text>
      </View>
      <View style={[styles.badge, { backgroundColor: color }]}>
        <Text style={styles.badgeText}>{label}</Text>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    flex: 1,
  },
  dateLabel: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  date: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  badge: {
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
});
