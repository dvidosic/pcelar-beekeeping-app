import { useCallback, useEffect, useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import {
  getHarvestsByHiveId,
  insertHarvest,
  deleteHarvest,
} from '@/db/repositories/harvestRepository';
import { HoneyHarvest } from '@/types/harvest';
import { generateUUID } from '@/utils/uuid';
import { nowISO } from '@/utils/dateUtils';
import { L } from '@/constants/labels';

export function useHarvestLogs(hiveId: string) {
  const [harvests, setHarvests] = useState<HoneyHarvest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useUIStore();

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const rows = await getHarvestsByHiveId(hiveId);
      setHarvests(rows);
    } catch {
      showToast(L.greška, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [hiveId, showToast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addHarvest = useCallback(
    async (data: Omit<HoneyHarvest, 'id'>) => {
      const harvest: HoneyHarvest = { ...data, id: generateUUID() };
      try {
        await insertHarvest(harvest);
        await refresh();
      } catch (e) {
        console.error('[useHarvestLogs] addHarvest failed:', e);
        showToast(L.greška, 'error');
        throw new Error('insert failed');
      }
    },
    [refresh, showToast]
  );

  const removeHarvest = useCallback(
    async (id: string) => {
      try {
        await deleteHarvest(id);
        setHarvests((prev) => prev.filter((h) => h.id !== id));
      } catch {
        showToast(L.greška, 'error');
      }
    },
    [showToast]
  );

  return { harvests, isLoading, refresh, addHarvest, removeHarvest };
}
