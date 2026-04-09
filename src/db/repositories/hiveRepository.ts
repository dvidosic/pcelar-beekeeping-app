import { getDb } from '../client';
import { Hive } from '@/types/hive';

export async function getAllHives(): Promise<Hive[]> {
  const db = await getDb();
  return db.getAllAsync<Hive>('SELECT * FROM hives ORDER BY created_at ASC');
}

export async function getHiveById(id: string): Promise<Hive | null> {
  const db = await getDb();
  return db.getFirstAsync<Hive>('SELECT * FROM hives WHERE id = ?', [id]);
}

export async function insertHive(hive: Hive): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'INSERT INTO hives (id, name, location, notes, created_at) VALUES (?, ?, ?, ?, ?)',
    [hive.id, hive.name, hive.location, hive.notes, hive.created_at]
  );
}

export async function updateHive(
  id: string,
  data: Pick<Hive, 'name' | 'location' | 'notes'>
): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    'UPDATE hives SET name = ?, location = ?, notes = ? WHERE id = ?',
    [data.name, data.location, data.notes, id]
  );
}

export async function deleteHive(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM hives WHERE id = ?', [id]);
}

export async function getLastInspectionInfo(
  hiveId: string
): Promise<{ inspected_at: string; health_status: string | null; brood_quality: string | null; food_stores: string | null; temperament: number | null; brood_quantity: string | null; hygienic_behavior: string | null; queen_seen: number; swarm_event: string | null } | null> {
  const db = await getDb();
  return db.getFirstAsync(
    `SELECT inspected_at, health_status, brood_quality, food_stores, temperament,
            brood_quantity, hygienic_behavior, queen_seen, swarm_event
     FROM inspections
     WHERE hive_id = ?
     ORDER BY inspected_at DESC
     LIMIT 1`,
    [hiveId]
  );
}
