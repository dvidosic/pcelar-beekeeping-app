export const createInspectionsTable = `
  CREATE TABLE IF NOT EXISTS inspections (
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
    health_status TEXT CHECK(health_status IN ('healthy','varroa','nosema','other')),
    treatment_applied INTEGER NOT NULL DEFAULT 0,
    treatment_substance TEXT,
    treatment_date TEXT,
    swarm_event TEXT CHECK(swarm_event IN ('none','natural','artificial')),
    swarm_destination_hive_id TEXT REFERENCES hives(id),
    notes TEXT,
    created_at TEXT NOT NULL
  );
`;
