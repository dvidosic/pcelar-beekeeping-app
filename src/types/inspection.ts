import { EquipmentComponentKey } from '@/constants/options';

export type BroodQuantity = 'low' | 'normal' | 'high';
export type BroodQuality = 'good' | 'spotty' | 'poor';
export type QueenAge = 'under1' | 'one_to_two' | 'over2' | 'unknown';
export type FoodStores = 'low' | 'adequate' | 'full';
export type HygienicBehavior = 'poor' | 'normal' | 'good';
export type HealthStatus = 'healthy' | 'varroa' | 'nosema' | 'other';
export type SwarmEvent = 'none' | 'natural' | 'artificial';
export type EquipmentConditionValue = 'good' | 'needs_attention' | 'replaced';

export interface Inspection {
  id: string;
  hive_id: string;
  inspected_at: string;
  brood_quantity: BroodQuantity | null;
  brood_quality: BroodQuality | null;
  queen_seen: number; // 0 | 1
  queen_age: QueenAge | null;
  food_stores: FoodStores | null;
  temperament: number | null; // 1–5
  hygienic_behavior: HygienicBehavior | null;
  honey_intake_daily_g: number | null;
  health_status: HealthStatus | null;
  treatment_applied: number; // 0 | 1
  treatment_substance: string | null;
  treatment_date: string | null;
  swarm_event: SwarmEvent | null;
  swarm_destination_hive_id: string | null;
  notes: string | null;
  created_at: string;
}

export interface EquipmentCondition {
  id: string;
  inspection_id: string;
  component: EquipmentComponentKey;
  condition: EquipmentConditionValue;
  notes: string | null;
}

export type EquipmentConditionMap = Record<EquipmentComponentKey, EquipmentConditionValue>;

export interface InspectionDraft {
  inspectedAt: string;
  broodQuantity: BroodQuantity;
  broodQuality: BroodQuality;
  queenSeen: boolean;
  queenAge: QueenAge;
  foodStores: FoodStores;
  temperament: number;
  hygienicBehavior: HygienicBehavior;
  honeyIntakeDailyG: string;
  healthStatus: HealthStatus;
  treatmentApplied: boolean;
  treatmentSubstance: string;
  treatmentDate: string;
  swarmEvent: SwarmEvent;
  swarmDestinationHiveId: string;
  notes: string;
  equipmentConditions: EquipmentConditionMap;
  savedAt: string;
}
