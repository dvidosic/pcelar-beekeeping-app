import { HiveStatus } from '@/types/hive';
import { daysSince } from './dateUtils';

interface InspectionSnapshot {
  inspected_at: string;
  health_status: string | null;
  brood_quality: string | null;
  food_stores: string | null;
  temperament: number | null;
  brood_quantity: string | null;
  hygienic_behavior: string | null;
  queen_seen: number;
  swarm_event: string | null;
}

export function computeHiveStatus(
  inspection: InspectionSnapshot | null
): HiveStatus {
  if (!inspection) return 'unknown';

  const {
    health_status,
    brood_quality,
    food_stores,
    temperament,
    brood_quantity,
    hygienic_behavior,
    queen_seen,
    swarm_event,
    inspected_at,
  } = inspection;

  // Danger — any single critical signal
  if (
    health_status === 'varroa' ||
    health_status === 'nosema' ||
    brood_quality === 'poor' ||
    food_stores === 'low' ||
    (temperament !== null && temperament >= 5)
  ) {
    return 'danger';
  }

  // Warning — moderate concern
  const days = daysSince(inspected_at);
  if (
    (brood_quantity === 'low' && queen_seen === 0) ||
    hygienic_behavior === 'poor' ||
    (food_stores === 'adequate' && days > 21) ||
    swarm_event === 'natural' ||
    temperament === 4
  ) {
    return 'warning';
  }

  return 'healthy';
}
