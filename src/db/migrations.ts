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
  sqls: string[];
}

const migrations: Migration[] = [
  {
    version: 1,
    sqls: [
      createHivesTable,
      createInspectionsTable,
      createEquipmentConditionsTable,
      createHoneyHarvestsTable,
      createFeedingsTable,
      createRemindersTable,
    ],
  },
  {
    version: 2,
    // Repair migration: creates any tables not created by v1 on affected devices.
    // Safe on all installs — every statement uses CREATE TABLE IF NOT EXISTS.
    sqls: [
      createInspectionsTable,
      createEquipmentConditionsTable,
      createHoneyHarvestsTable,
      createFeedingsTable,
      createRemindersTable,
    ],
  },
  {
    version: 3,
    // Rebuild inspections table to remove CHECK constraints on health_status and swarm_event
    // (new values added: tropileloza, americka_gnjiloca, razrojena) and add swarm_new_hive_note column.
    // SQLite does not support ALTER COLUMN or DROP CONSTRAINT, so table is rebuilt.
    sqls: [
      `CREATE TABLE IF NOT EXISTS inspections_v3 (
        id TEXT PRIMARY KEY,
        hive_id TEXT NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
        inspected_at TEXT NOT NULL,
        brood_quantity TEXT CHECK(brood_quantity IN ('low','normal','high')),
        brood_quality TEXT CHECK(brood_quality IN ('good','spotty','poor')),
        queen_seen INTEGER NOT NULL DEFAULT 1,
        queen_age TEXT CHECK(queen_age IN ('under1','one_to_two','over2','unknown')),
        food_stores TEXT CHECK(food_stores IN ('low','adequate','full')),
        temperament INTEGER CHECK(temperament BETWEEN 1 AND 5),
        hygienic_behavior TEXT CHECK(hygienic_behavior IN ('poor','normal','good')),
        honey_intake_daily_g INTEGER,
        health_status TEXT,
        treatment_applied INTEGER NOT NULL DEFAULT 0,
        treatment_substance TEXT,
        treatment_date TEXT,
        swarm_event TEXT,
        swarm_destination_hive_id TEXT REFERENCES hives(id),
        swarm_new_hive_note TEXT,
        notes TEXT,
        created_at TEXT NOT NULL
      );`,
      `INSERT INTO inspections_v3 SELECT id,hive_id,inspected_at,brood_quantity,brood_quality,queen_seen,queen_age,food_stores,temperament,hygienic_behavior,honey_intake_daily_g,health_status,treatment_applied,treatment_substance,treatment_date,swarm_event,swarm_destination_hive_id,NULL,notes,created_at FROM inspections;`,
      `DROP TABLE inspections;`,
      `ALTER TABLE inspections_v3 RENAME TO inspections;`,
    ],
  },
  {
    version: 4,
    // Add brood frame count and food weight fields.
    // SQLite supports ADD COLUMN — no table rebuild needed.
    sqls: [
      `ALTER TABLE inspections ADD COLUMN brood_frames INTEGER;`,
      `ALTER TABLE inspections ADD COLUMN food_stores_kg REAL;`,
    ],
  },
  {
    version: 5,
    // New table for multiple treatment dates per inspection.
    // ON DELETE CASCADE relies on PRAGMA foreign_keys = ON (set in client.ts).
    sqls: [
      `CREATE TABLE IF NOT EXISTS treatment_dates (
        id TEXT PRIMARY KEY,
        inspection_id TEXT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
        treatment_date TEXT NOT NULL
      );`,
    ],
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
    for (const sql of migration.sqls) {
      await db.execAsync(sql);
    }
    await db.runAsync(
      'INSERT INTO schema_version (version, applied_at) VALUES (?, ?)',
      [migration.version, new Date().toISOString()]
    );
  }
}
