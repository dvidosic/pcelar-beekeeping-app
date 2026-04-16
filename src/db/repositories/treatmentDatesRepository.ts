import { getDb } from '../client';
import { generateUUID } from '@/utils/uuid';

export async function getTreatmentDates(inspectionId: string): Promise<string[]> {
  const db = await getDb();
  const rows = await db.getAllAsync<{ treatment_date: string }>(
    'SELECT treatment_date FROM treatment_dates WHERE inspection_id = ? ORDER BY treatment_date ASC',
    [inspectionId]
  );
  return rows.map((r) => r.treatment_date);
}

export async function insertTreatmentDates(inspectionId: string, dates: string[]): Promise<void> {
  if (dates.length === 0) return;
  const db = await getDb();
  for (const date of dates) {
    await db.runAsync(
      'INSERT INTO treatment_dates (id, inspection_id, treatment_date) VALUES (?, ?, ?)',
      [generateUUID(), inspectionId, date]
    );
  }
}

export async function deleteTreatmentDates(inspectionId: string): Promise<void> {
  const db = await getDb();
  await db.runAsync('DELETE FROM treatment_dates WHERE inspection_id = ?', [inspectionId]);
}
