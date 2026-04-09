import * as Notifications from 'expo-notifications';
import { L } from '@/constants/labels';

export async function scheduleReminderNotification(
  reminderId: string,
  description: string,
  remindAt: Date,
  hiveId: string
): Promise<string | null> {
  if (remindAt <= new Date()) return null;
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: L.naslovObavijesti,
        body: description,
        data: { reminderId, hiveId },
        sound: true,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date: remindAt,
        channelId: 'reminders',
      },
    });
    return notificationId;
  } catch {
    return null;
  }
}

export async function cancelReminderNotification(notificationId: string | null): Promise<void> {
  if (!notificationId) return;
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch {}
}
