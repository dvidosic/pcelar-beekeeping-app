import { useCallback, useEffect, useState } from 'react';
import { getByInspectionId } from '@/db/repositories/equipmentRepository';
import { EquipmentCondition, EquipmentConditionMap } from '@/types/inspection';
import { EquipmentComponentKey, equipmentComponents } from '@/constants/options';

const DEFAULT_MAP: EquipmentConditionMap = Object.fromEntries(
  equipmentComponents.map(({ key }) => [key, 'good'])
) as EquipmentConditionMap;

export function useEquipmentConditions(inspectionId: string | null) {
  const [conditionMap, setConditionMap] = useState<EquipmentConditionMap>(DEFAULT_MAP);
  const [isLoading, setIsLoading] = useState(false);

  const load = useCallback(async () => {
    if (!inspectionId) {
      setConditionMap(DEFAULT_MAP);
      return;
    }
    setIsLoading(true);
    try {
      const rows = await getByInspectionId(inspectionId);
      const map = { ...DEFAULT_MAP };
      for (const row of rows) {
        map[row.component as EquipmentComponentKey] = row.condition as EquipmentCondition['condition'];
      }
      setConditionMap(map);
    } finally {
      setIsLoading(false);
    }
  }, [inspectionId]);

  useEffect(() => {
    load();
  }, [load]);

  return { conditionMap, isLoading };
}
