import { getDb } from '../client';
import { Inspection } from '@/types/inspection';

export async function getInspectionsByHiveId(hiveId: string): Promise<Inspection[]> {
  const db = await getDb();
  return db.getAllAsync<Inspection>(
    'SELECT * FROM inspections WHERE hive_id = ? ORDER BY inspected_at DESC',
    [hiveId]
  );
}

export async function getLastInspection(hiveId: string): Promise<Inspection | null> {
  const db = await getDb();
  return db.getFirstAsync<Inspection>(
    'SELECT * FROM inspections WHERE hive_id = ? ORDER BY inspected_at DESC LIMIT 1',
    [hiveId]
  );
}

export async function getInspectionById(id: string): Promise<Inspection | null> {
  const db = await getDb();
  return db.getFirstAsync<Inspection>('SELECT * FROM inspections WHERE id = ?', [id]);
}

export async function insertInspection(inspection: Inspection): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO inspections (
      id, hive_id, inspected_at, brood_quantity, brood_quality, brood_frames,
      queen_seen, queen_age, food_stores, food_stores_kg, temperament, hygienic_behavior,
      honey_intake_daily_g, health_status, treatment_applied, treatment_substance,
      treatment_date, swarm_event, swarm_destination_hive_id, swarm_new_hive_note, notes, created_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      inspection.id, inspection.hive_id, inspection.inspected_at,
      inspection.brood_quantity, inspection.brood_quality, inspection.brood_frames,
      inspection.queen_seen, inspection.queen_age, inspection.food_stores, inspection.food_stores_kg,
      inspection.temperament, inspection.hygienic_behavior,
      inspection.honey_intake_daily_g, inspection.health_status,
      inspection.treatment_applied, inspection.treatment_substance,
      inspection.treatment_date, inspection.swarm_event,
      inspection.swarm_destination_hive_id, inspection.swarm_new_hive_note,
      inspection.notes, inspection.created_at,
    ]
  );
}

export async function updateInspection(
  id: string,
  data: Omit<Inspection, 'id' | 'hive_id' | 'created_at'>
): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `UPDATE inspections SET
      inspected_at=?, brood_quantity=?, brood_quality=?, brood_frames=?,
      queen_seen=?, queen_age=?, food_stores=?, food_stores_kg=?, temperament=?, hygienic_behavior=?,
      honey_intake_daily_g=?, health_status=?, treatment_applied=?, treatment_substance=?,
      treatment_date=?, swarm_event=?, swarm_destination_hive_id=?, swarm_new_hive_note=?, notes=?
    WHERE id=?`,
    [
      data.inspected_at, data.brood_quantity, data.brood_quality, data.brood_frames,
      data.queen_seen, data.queen_age, data.food_stores, data.food_stores_kg,
      data.temperament, data.hygienic_behavior,
      data.honey_intake_daily_g, data.health_status,
      data.treatment_applied, data.treatment_substance,
      data.treatment_date, data.swarm_event,
      data.swarm_destination_hive_id, data.swarm_new_hive_note, data.notes, id,
    ]
  );
}

export async function deleteInspection(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM inspections WHERE id = ?', [id]);
}
