import { getDb } from '../client';
import { HoneyHarvest } from '@/types/harvest';

export async function getHarvestsByHiveId(hiveId: string): Promise<HoneyHarvest[]> {
  const db = await getDb();
  return db.getAllAsync<HoneyHarvest>(
    'SELECT * FROM honey_harvests WHERE hive_id = ? ORDER BY harvested_at DESC',
    [hiveId]
  );
}

export async function insertHarvest(harvest: HoneyHarvest): Promise<void> {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO honey_harvests (id, hive_id, harvested_at, honey_type, quantity_kg, notes)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      harvest.id,
      harvest.hive_id,
      harvest.harvested_at,
      harvest.honey_type,
      harvest.quantity_kg,
      harvest.notes,
    ]
  );
}

export async function deleteHarvest(id: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM honey_harvests WHERE id = ?', [id]);
}
