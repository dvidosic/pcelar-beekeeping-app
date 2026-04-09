import { getDb } from '../client';
import { EquipmentCondition } from '@/types/inspection';

export async function getByInspectionId(inspectionId: string): Promise<EquipmentCondition[]> {
  const db = await getDb();
  return db.getAllAsync<EquipmentCondition>(
    'SELECT * FROM equipment_conditions WHERE inspection_id = ?',
    [inspectionId]
  );
}

export async function deleteByInspectionId(inspectionId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM equipment_conditions WHERE inspection_id = ?', [inspectionId]);
}

export async function insertMany(rows: EquipmentCondition[]): Promise<void> {
  const db = await getDb();
  for (const row of rows) {
    await db.runAsync(
      'INSERT INTO equipment_conditions (id, inspection_id, component, condition, notes) VALUES (?,?,?,?,?)',
      [row.id, row.inspection_id, row.component, row.condition, row.notes]
    );
  }
}
