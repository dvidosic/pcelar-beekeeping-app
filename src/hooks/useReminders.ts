import { useCallback, useEffect, useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import {
  getRemindersByHiveId,
  getOverdueReminders,
  insertReminder,
  markReminderCompleted,
  deleteReminder,
} from '@/db/repositories/reminderRepository';
import {
  scheduleReminderNotification,
  cancelReminderNotification,
} from '@/utils/notificationUtils';
import { Reminder } from '@/types/reminder';
import { generateUUID } from '@/utils/uuid';
import { nowISO } from '@/utils/dateUtils';
import { L } from '@/constants/labels';

export function useReminders(hiveId: string) {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useUIStore();

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const rows = await getRemindersByHiveId(hiveId);
      setReminders(rows);
    } catch {
      showToast(L.greška, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [hiveId, showToast]);

  // On mount: mark overdue incomplete reminders as completed, then load
  useEffect(() => {
    async function cleanupAndLoad() {
      try {
        const overdue = await getOverdueReminders(hiveId, nowISO());
        for (const r of overdue) {
          await cancelReminderNotification(r.notification_id);
          await markReminderCompleted(r.id);
        }
      } catch {}
      await refresh();
    }
    cleanupAndLoad();
  }, [hiveId]);

  const addReminder = useCallback(
    async (description: string, remindAt: Date) => {
      const id = generateUUID();
      const notificationId = await scheduleReminderNotification(
        id,
        description,
        remindAt,
        hiveId
      );
      const reminder: Reminder = {
        id,
        hive_id: hiveId,
        description,
        remind_at: remindAt.toISOString(),
        is_completed: 0,
        notification_id: notificationId,
        created_at: nowISO(),
      };
      try {
        await insertReminder(reminder);
        await refresh();
      } catch {
        showToast(L.greška, 'error');
        throw new Error('insert failed');
      }
    },
    [hiveId, refresh, showToast]
  );

  const completeReminder = useCallback(
    async (id: string) => {
      const reminder = reminders.find((r) => r.id === id);
      await cancelReminderNotification(reminder?.notification_id ?? null);
      try {
        await markReminderCompleted(id);
        setReminders((prev) =>
          prev.map((r) => (r.id === id ? { ...r, is_completed: 1, notification_id: null } : r))
        );
      } catch {
        showToast(L.greška, 'error');
      }
    },
    [reminders, showToast]
  );

  const removeReminder = useCallback(
    async (id: string) => {
      const reminder = reminders.find((r) => r.id === id);
      await cancelReminderNotification(reminder?.notification_id ?? null);
      try {
        await deleteReminder(id);
        setReminders((prev) => prev.filter((r) => r.id !== id));
      } catch {
        showToast(L.greška, 'error');
      }
    },
    [reminders, showToast]
  );

  return { reminders, isLoading, refresh, addReminder, completeReminder, removeReminder };
}
