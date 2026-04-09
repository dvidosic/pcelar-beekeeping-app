import { useCallback, useEffect, useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import {
  getInspectionsByHiveId,
  insertInspection,
  updateInspection,
  deleteInspection,
} from '@/db/repositories/inspectionRepository';
import {
  insertMany as insertEquipmentMany,
  deleteByInspectionId,
} from '@/db/repositories/equipmentRepository';
import { Inspection, EquipmentConditionMap, EquipmentCondition } from '@/types/inspection';
import { EquipmentComponentKey, equipmentComponents } from '@/constants/options';
import { generateUUID } from '@/utils/uuid';
import { nowISO } from '@/utils/dateUtils';
import { withTransaction } from '@/db/client';
import { L } from '@/constants/labels';

function buildEquipmentRows(
  inspectionId: string,
  map: EquipmentConditionMap
): EquipmentCondition[] {
  return equipmentComponents.map(({ key }) => ({
    id: generateUUID(),
    inspection_id: inspectionId,
    component: key as EquipmentComponentKey,
    condition: map[key as EquipmentComponentKey],
    notes: null,
  }));
}

export function useInspections(hiveId: string) {
  const [inspections, setInspections] = useState<Inspection[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useUIStore();

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const rows = await getInspectionsByHiveId(hiveId);
      setInspections(rows);
    } catch {
      showToast(L.greška, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [hiveId, showToast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addInspection = useCallback(
    async (
      data: Omit<Inspection, 'id' | 'created_at'>,
      equipmentMap: EquipmentConditionMap
    ): Promise<string> => {
      const id = generateUUID();
      const inspection: Inspection = { ...data, id, created_at: nowISO() };
      const equipmentRows = buildEquipmentRows(id, equipmentMap);

      await withTransaction(async (db) => {
        await insertInspection(inspection);
        await insertEquipmentMany(equipmentRows);
      });

      await refresh();
      return id;
    },
    [refresh]
  );

  const editInspection = useCallback(
    async (
      id: string,
      data: Omit<Inspection, 'id' | 'hive_id' | 'created_at'>,
      equipmentMap: EquipmentConditionMap
    ) => {
      const equipmentRows = buildEquipmentRows(id, equipmentMap);

      await withTransaction(async () => {
        await updateInspection(id, data);
        await deleteByInspectionId(id);
        await insertEquipmentMany(equipmentRows);
      });

      await refresh();
    },
    [refresh]
  );

  const removeInspection = useCallback(
    async (id: string) => {
      try {
        await deleteInspection(id);
        setInspections((prev) => prev.filter((i) => i.id !== id));
      } catch {
        showToast(L.greška, 'error');
      }
    },
    [showToast]
  );

  return { inspections, isLoading, refresh, addInspection, editInspection, removeInspection };
}
