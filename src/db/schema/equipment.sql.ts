export const createEquipmentConditionsTable = `
  CREATE TABLE IF NOT EXISTS equipment_conditions (
    id TEXT PRIMARY KEY,
    inspection_id TEXT NOT NULL REFERENCES inspections(id) ON DELETE CASCADE,
    component TEXT NOT NULL CHECK(component IN ('floor','super1','super2','super3','frames','feeder','roof')),
    condition TEXT NOT NULL CHECK(condition IN ('good','needs_attention','replaced')),
    notes TEXT
  );
`;
