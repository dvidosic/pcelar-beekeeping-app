import { L } from './labels';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

export const broodQuantityOptions: SelectOption[] = [
  { value: 'low', label: L.malo },
  { value: 'normal', label: L.normalno },
  { value: 'high', label: L.puno },
];

export const broodQualityOptions: SelectOption[] = [
  { value: 'good', label: L.dobro },
  { value: 'spotty', label: L.mrljavo },
  { value: 'poor', label: L.loše },
];

export const queenAgeOptions: SelectOption[] = [
  { value: 'under1', label: L.ispod1god },
  { value: 'one_to_two', label: L.od1do2god },
  { value: 'over2', label: L.preko2god },
  { value: 'unknown', label: L.nepoznato },
];

export const foodStoresOptions: SelectOption[] = [
  { value: 'low', label: L.nedovoljno },
  { value: 'adequate', label: L.dovoljno },
  { value: 'full', label: L.puno },
];

export const hygienicBehaviorOptions: SelectOption[] = [
  { value: 'poor', label: L.loše },
  { value: 'normal', label: L.normalno },
  { value: 'good', label: L.dobro },
];

export const healthStatusOptions: SelectOption[] = [
  { value: 'healthy', label: L.zdravo },
  { value: 'varroa', label: L.varroa },
  { value: 'nosema', label: L.nosema },
  { value: 'other', label: L.ostalo },
  { value: 'tropileloza', label: L.tropileloza },
  { value: 'americka_gnjiloca', label: L.americkaGnjiloca },
];

export const swarmEventOptions: SelectOption[] = [
  { value: 'none', label: L.bezRojenja },
  { value: 'natural', label: L.prirodniRoj },
  { value: 'artificial', label: L.umjetniRoj },
  { value: 'razrojena', label: L.razrojena },
];

export const equipmentConditionOptions: SelectOption[] = [
  { value: 'good', label: L.uvjetDobro },
  { value: 'needs_attention', label: L.uvjetPopravak },
  { value: 'replaced', label: L.uvjetZamijenjeno },
];

export const honeyTypeOptions: SelectOption[] = [
  { value: 'bagremov', label: L.bagremovMed },
  { value: 'livadni', label: L.livadniMed },
  { value: 'šumski', label: L.šumskiMed },
  { value: 'other', label: L.ostalo },
];

export const feedingTypeOptions: SelectOption[] = [
  { value: 'sugar_syrup', label: L.šećernaOtopina },
  { value: 'fondant', label: L.pogača },
  { value: 'other', label: L.ostalo },
];

export const equipmentComponents = [
  { key: 'floor', label: L.podnica },
  { key: 'super1', label: L.nastavak1 },
  { key: 'super2', label: L.nastavak2 },
  { key: 'super3', label: L.nastavak3 },
  { key: 'frames', label: L.okviri },
  { key: 'feeder', label: L.hranilica },
  { key: 'roof', label: L.krov },
] as const;

export type EquipmentComponentKey = typeof equipmentComponents[number]['key'];
