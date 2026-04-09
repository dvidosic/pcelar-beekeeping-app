export interface Reminder {
  id: string;
  hive_id: string;
  description: string;
  remind_at: string;
  is_completed: number; // 0 | 1
  notification_id: string | null;
  created_at: string;
}
