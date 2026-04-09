import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';
import { L } from '@/constants/labels';
import { Inspection, HealthStatus } from '@/types/inspection';
import { formatDate } from '@/utils/dateUtils';
import { healthStatusOptions, broodQuantityOptions } from '@/constants/options';

interface InspectionCardProps {
  inspection: Inspection;
  onPress: () => void;
  onDelete: () => void;
}

function healthColor(status: HealthStatus | null): string {
  if (!status || status === 'healthy') return colors.success;
  if (status === 'varroa' || status === 'nosema') return colors.danger;
  return colors.warning;
}

export const InspectionCard = memo(function InspectionCard({
  inspection,
  onPress,
  onDelete,
}: InspectionCardProps) {
  const color = healthColor(inspection.health_status);
  const healthLabel =
    healthStatusOptions.find((o) => o.value === inspection.health_status)?.label ?? '';
  const broodLabel =
    broodQuantityOptions.find((o) => o.value === inspection.brood_quantity)?.label ?? '';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.main}>
        <View style={styles.info}>
          <Text style={styles.date}>{formatDate(inspection.inspected_at)}</Text>
          {broodLabel ? (
            <Text style={styles.brood}>
              {L.količinaLegla}: {broodLabel}
            </Text>
          ) : null}
        </View>
        <View style={styles.right}>
          <View style={[styles.badge, { backgroundColor: color }]}>
            <Text style={styles.badgeText}>{healthLabel}</Text>
          </View>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={onDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  main: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 72,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  date: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  brood: {
    fontSize: 13,
    color: colors.textMuted,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
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
  deleteBtn: {
    width: 40,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 18,
    color: colors.textMuted,
    fontWeight: '600',
  },
});
