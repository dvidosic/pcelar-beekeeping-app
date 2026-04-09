import { useCallback, useEffect } from 'react';
import { useHiveStore } from '@/stores/hiveStore';
import { useUIStore } from '@/stores/uiStore';
import {
  getAllHives,
  insertHive,
  updateHive,
  deleteHive,
  getLastInspectionInfo,
} from '@/db/repositories/hiveRepository';
import { HiveFormValues, HiveWithStatus } from '@/types/hive';
import { generateUUID } from '@/utils/uuid';
import { nowISO } from '@/utils/dateUtils';
import { computeHiveStatus } from '@/utils/statusUtils';
import { L } from '@/constants/labels';

async function loadAllHivesWithStatus(): Promise<HiveWithStatus[]> {
  const hives = await getAllHives();
  return Promise.all(
    hives.map(async (hive) => {
      const lastInspection = await getLastInspectionInfo(hive.id);
      const status = computeHiveStatus(lastInspection);
      return {
        ...hive,
        status,
        lastInspectedAt: lastInspection?.inspected_at ?? null,
      };
    })
  );
}

export function useHives() {
  const { hives, isLoading, setHives, setLoading, addHiveOptimistic, removeHiveOptimistic, updateHiveOptimistic } =
    useHiveStore();
  const { showToast } = useUIStore();

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const enriched = await loadAllHivesWithStatus();
      setHives(enriched);
    } catch {
      showToast(L.greška, 'error');
    } finally {
      setLoading(false);
    }
  }, [setHives, setLoading, showToast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addHive = useCallback(
    async (values: HiveFormValues) => {
      const hive: HiveWithStatus = {
        id: generateUUID(),
        name: values.name,
        location: values.location || null,
        notes: values.notes || null,
        created_at: nowISO(),
        status: 'unknown',
        lastInspectedAt: null,
      };
      addHiveOptimistic(hive);
      try {
        await insertHive(hive);
      } catch {
        removeHiveOptimistic(hive.id);
        showToast(L.greška, 'error');
        throw new Error('insert failed');
      }
    },
    [addHiveOptimistic, removeHiveOptimistic, showToast]
  );

  const editHive = useCallback(
    async (id: string, values: HiveFormValues) => {
      const prev = hives.find((h) => h.id === id);
      const updated = {
        name: values.name,
        location: values.location || null,
        notes: values.notes || null,
      };
      updateHiveOptimistic(id, updated);
      try {
        await updateHive(id, updated);
      } catch {
        if (prev) updateHiveOptimistic(id, prev);
        showToast(L.greška, 'error');
        throw new Error('update failed');
      }
    },
    [hives, updateHiveOptimistic, showToast]
  );

  const removeHive = useCallback(
    async (id: string) => {
      const prev = hives.find((h) => h.id === id);
      removeHiveOptimistic(id);
      try {
        await deleteHive(id);
      } catch {
        if (prev) addHiveOptimistic(prev);
        showToast(L.greška, 'error');
        throw new Error('delete failed');
      }
    },
    [hives, removeHiveOptimistic, addHiveOptimistic, showToast]
  );

  return { hives, isLoading, refresh, addHive, editHive, removeHive };
}
