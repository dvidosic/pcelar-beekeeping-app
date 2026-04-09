export interface Feeding {
  id: string;
  hive_id: string;
  fed_at: string;
  food_type: 'sugar_syrup' | 'fondant' | 'other' | null;
  food_type_custom: string | null;
  quantity_kg: number | null;
  notes: string | null;
}
