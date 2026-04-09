export const createFeedingsTable = `
  CREATE TABLE IF NOT EXISTS feedings (
    id TEXT PRIMARY KEY,
    hive_id TEXT NOT NULL REFERENCES hives(id) ON DELETE CASCADE,
    fed_at TEXT NOT NULL,
    food_type TEXT CHECK(food_type IN ('sugar_syrup','fondant','other')),
    food_type_custom TEXT,
    quantity_kg REAL,
    notes TEXT
  );
`;
