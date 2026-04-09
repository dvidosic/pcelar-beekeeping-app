import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '@/constants/colors';
import { spacing, radius } from '@/constants/spacing';
import { L } from '@/constants/labels';
import { Reminder } from '@/types/reminder';
import { formatDateTime } from '@/utils/dateUtils';

interface ReminderCardProps {
  reminder: Reminder;
  onComplete: () => void;
  onDelete: () => void;
}

export const ReminderCard = memo(function ReminderCard({
  reminder,
  onComplete,
  onDelete,
}: ReminderCardProps) {
  const completed = reminder.is_completed === 1;

  return (
    <View style={[styles.card, completed && styles.cardCompleted]}>
      <View style={[styles.stripe, { backgroundColor: completed ? colors.disabled : colors.primary }]} />
      <View style={styles.body}>
        <View style={styles.info}>
          <Text style={[styles.description, completed && styles.textCompleted]} numberOfLines={2}>
            {reminder.description}
          </Text>
          <Text style={[styles.datetime, completed && styles.textCompleted]}>
            {formatDateTime(reminder.remind_at)}
          </Text>
          {completed && (
            <Text style={styles.completedBadge}>{L.obavljeno}</Text>
          )}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, completed && styles.actionBtnDone]}
            onPress={completed ? undefined : onComplete}
            disabled={completed}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Text style={[styles.actionIcon, completed && styles.actionIconDone]}>✓</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onDelete}
            hitSlop={{ top: 4, bottom: 4, left: 4, right: 4 }}
          >
            <Text style={styles.deleteIcon}>✕</Text>
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
  cardCompleted: {
    opacity: 0.65,
  },
  stripe: {
    width: 5,
  },
  body: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    minHeight: 72,
    gap: spacing.sm,
  },
  info: {
    flex: 1,
    gap: spacing.xs,
  },
  description: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  datetime: {
    fontSize: 13,
    color: colors.textMuted,
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  completedBadge: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.success,
    textDecorationLine: 'none',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  actionBtn: {
    width: 44,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.sm,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  actionBtnDone: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  actionIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
  },
  actionIconDone: {
    color: colors.white,
  },
  deleteIcon: {
    fontSize: 18,
    color: colors.textMuted,
    fontWeight: '600',
  },
});
