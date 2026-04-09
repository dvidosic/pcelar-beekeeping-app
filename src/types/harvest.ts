export interface HoneyHarvest {
  id: string;
  hive_id: string;
  harvested_at: string;
  honey_type: string | null;
  quantity_kg: number | null;
  notes: string | null;
}
