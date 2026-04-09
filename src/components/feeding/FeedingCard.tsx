import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';
import { Feeding } from '@/types/feeding';
import { feedingTypeOptions } from '@/constants/options';
import { formatDate } from '@/utils/dateUtils';

interface FeedingCardProps {
  feeding: Feeding;
  onDelete: () => void;
}

function foodTypeLabel(feeding: Feeding): string {
  if (!feeding.food_type) return '—';
  if (feeding.food_type === 'other') {
    return feeding.food_type_custom?.trim() || 'Ostalo';
  }
  const opt = feedingTypeOptions.find((o) => o.value === feeding.food_type);
  return opt ? opt.label : feeding.food_type;
}

export const FeedingCard = memo(function FeedingCard({ feeding, onDelete }: FeedingCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.stripe} />
      <View style={styles.body}>
        <View style={styles.info}>
          <Text style={styles.date}>{formatDate(feeding.fed_at)}</Text>
          <Text style={styles.type}>{foodTypeLabel(feeding)}</Text>
        </View>
        <View style={styles.right}>
          {feeding.quantity_kg != null && (
            <Text style={styles.quantity}>{feeding.quantity_kg} kg</Text>
          )}
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={onDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
});

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: radius.md,
    marginHorizontal: spacing.base,
    marginBottom: spacing.sm,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
  },
  stripe: {
    width: 5,
    backgroundColor: colors.success,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    minHeight: 72,
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
  type: {
    fontSize: 13,
    color: colors.textMuted,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  quantity: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
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
