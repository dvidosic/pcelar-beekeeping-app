import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { HiveWithStatus } from '@/types/hive';
import { HiveStatusDot } from './HiveStatusDot';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';
import { L } from '@/constants/labels';
import { formatDate } from '@/utils/dateUtils';

interface HiveCardProps {
  hive: HiveWithStatus;
  onPress: () => void;
  onLongPress?: () => void;
}

export function HiveCard({ hive, onPress, onLongPress }: HiveCardProps) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={hive.name}
    >
      <View style={styles.stripe} />
      <View style={styles.content}>
        <View style={styles.topRow}>
          <HiveStatusDot status={hive.status} size={14} />
          <Text style={styles.name} numberOfLines={1}>{hive.name}</Text>
        </View>
        {hive.location ? (
          <Text style={styles.location} numberOfLines={1}>📍 {hive.location}</Text>
        ) : null}
        <Text style={styles.lastInspection}>
          {hive.lastInspectedAt
            ? `${L.zadnjiPregled}: ${formatDate(hive.lastInspectedAt)}`
            : L.nijePregledano}
        </Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    marginHorizontal: spacing.base,
    marginVertical: spacing.sm,
    minHeight: 72,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    overflow: 'hidden',
  },
  stripe: {
    width: 5,
    alignSelf: 'stretch',
    backgroundColor: colors.primary,
  },
  content: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  name: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.text,
    flex: 1,
  },
  location: {
    fontSize: 13,
    color: colors.textMuted,
  },
  lastInspection: {
    fontSize: 12,
    color: colors.textMuted,
  },
  chevron: {
    fontSize: 24,
    color: colors.border,
    paddingRight: spacing.md,
  },
});
