export const createHoneyHarvestsTable = `
  CREATE TABLE IF NOT EXISTS honey_harvests (
    id TEXT PRIMARY KEY,
    hive_id TEXT NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
    harvested_at TEXT NOT NULL,
    honey_type TEXT,
    quantity_kg REAL,
    notes TEXT
  );
`;
