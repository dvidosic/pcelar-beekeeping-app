import { getDb } from '../client';
import { Feeding } from '@/types/feeding';

export async function getFeedingsByHiveId(hiveId: string): Promise<Feeding[]> {
  const db = await getDb();
  return db.getAllAsync<Feeding>(
    'SELECT * FROM feedings WHERE hive_id = ? ORDER BY fed_at DESC',
    [hiveId]
  );
}

export async function insertFeeding(feeding: Feeding): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO feedings (id, hive_id, fed_at, food_type, food_type_custom, quantity_kg, notes)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      feeding.id,
      feeding.hive_id,
      feeding.fed_at,
      feeding.food_type,
      feeding.food_type_custom,
      feeding.quantity_kg,
      feeding.notes,
    ]
  );
}

export async function deleteFeeding(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM feedings WHERE id = ?', [id]);
}
