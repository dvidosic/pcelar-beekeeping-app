import { getDb } from '../client';
import { Reminder } from '@/types/reminder';

export async function getRemindersByHiveId(hiveId: string): Promise<Reminder[]> {
  const db = await getDb();
  // Pending first (is_completed ASC), then by remind_at ASC
  return db.getAllAsync<Reminder>(
    'SELECT * FROM reminders WHERE hive_id = ? ORDER BY is_completed ASC, remind_at ASC',
    [hiveId]
  );
}

export async function getOverdueReminders(hiveId: string, nowISO: string): Promise<Reminder[]> {
  const db = await getDb();
  return db.getAllAsync<Reminder>(
    'SELECT * FROM reminders WHERE hive_id = ? AND is_completed = 0 AND remind_at < ?',
    [hiveId, nowISO]
  );
}

export async function insertReminder(reminder: Reminder): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO reminders (id, hive_id, description, remind_at, is_completed, notification_id, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      reminder.id,
      reminder.hive_id,
      reminder.description,
      reminder.remind_at,
      reminder.is_completed,
      reminder.notification_id,
      reminder.created_at,
    ]
  );
}

export async function markReminderCompleted(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE reminders SET is_completed = 1, notification_id = NULL WHERE id = ?',
    [id]
  );
}

export async function deleteReminder(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM reminders WHERE id = ?', [id]);
}
