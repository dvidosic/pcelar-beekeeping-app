import { SQLiteDatabase } from 'expo-sqlite';
import { createHivesTable } from './schema/hives.sql';
import { createInspectionsTable } from './schema/inspections.sql';
import { createEquipmentConditionsTable } from './schema/equipment.sql';
import { createHoneyHarvestsTable } from './schema/harvests.sql';
import { createFeedingsTable } from './schema/feedings.sql';
import { createRemindersTable } from './schema/reminders.sql';
import { getDb } from './client';

interface Migration {
  version: number;
  sql: string;
}

const migrations: Migration[] = [
  {
    version: 1,
    sql: `
      ${createHivesTable}
      ${createInspectionsTable}
      ${createEquipmentConditionsTable}
      ${createHoneyHarvestsTable}
      ${createFeedingsTable}
      ${createRemindersTable}
    `,
  },
];

async function getCurrentVersion(db: SQLiteDatabase): Promise<number> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS schema_version (
      version INTEGER PRIMARY KEY,
      applied_at TEXT NOT NULL
    );
  `);
  const row = await db.getFirstAsync<{ version: number }>(
    'SELECT MAX(version) as version FROM schema_version'
  );
  return row?.version ?? 0;
}

export async function runMigrations(): Promise<void> {
  const db = await getDb();
  const currentVersion = await getCurrentVersion(db);

  const pending = migrations.filter((m) => m.version > currentVersion);

  for (const migration of pending) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(migration.sql);
      await db.runAsync(
        'INSERT INTO schema_version (version, applied_at) VALUES (?, ?)',
        [migration.version, new Date().toISOString()]
      );
    });
  }
}
