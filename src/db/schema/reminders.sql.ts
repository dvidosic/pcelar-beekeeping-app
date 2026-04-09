export const createRemindersTable = `
  CREATE TABLE IF NOT EXISTS reminders (
    id TEXT PRIMARY KEY,
    hive_id TEXT NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    remind_at TEXT NOT NULL,
    is_completed INTEGER NOT NULL DEFAULT 0,
    notification_id TEXT,
    created_at TEXT NOT NULL
  );
`;
