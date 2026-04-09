export interface Hive {
  id: string;
  name: string;
  location: string | null;
  notes: string | null;
  created_at: string;
}

export type HiveStatus = 'healthy' | 'warning' | 'danger' | 'unknown';

export interface HiveWithStatus extends Hive {
  status: HiveStatus;
  lastInspectedAt: string | null;
}

export type HiveFormValues = {
  name: string;
  location: string;
  notes: string;
};
