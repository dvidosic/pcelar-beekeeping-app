export const createHivesTable = `
  CREATE TABLE IF NOT EXISTS hives (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    location TEXT,
    notes TEXT,
    created_at TEXT NOT NULL
  );
`;
