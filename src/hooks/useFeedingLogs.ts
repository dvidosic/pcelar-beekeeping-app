import { useCallback, useEffect, useState } from 'react';
import { useUIStore } from '@/stores/uiStore';
import {
  getFeedingsByHiveId,
  insertFeeding,
  deleteFeeding,
} from '@/db/repositories/feedingRepository';
import { Feeding } from '@/types/feeding';
import { generateUUID } from '@/utils/uuid';
import { L } from '@/constants/labels';

export function useFeedingLogs(hiveId: string) {
  const [feedings, setFeedings] = useState<Feeding[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useUIStore();

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const rows = await getFeedingsByHiveId(hiveId);
      setFeedings(rows);
    } catch {
      showToast(L.greška, 'error');
    } finally {
      setIsLoading(false);
    }
  }, [hiveId, showToast]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const addFeeding = useCallback(
    async (data: Omit<Feeding, 'id'>) => {
      const feeding: Feeding = { ...data, id: generateUUID() };
      try {
        await insertFeeding(feeding);
        await refresh();
      } catch {
        showToast(L.greška, 'error');
        throw new Error('insert failed');
      }
    },
    [refresh, showToast]
  );

  const removeFeeding = useCallback(
    async (id: string) => {
      try {
        await deleteFeeding(id);
        setFeedings((prev) => prev.filter((f) => f.id !== id));
      } catch {
        showToast(L.greška, 'error');
      }
    },
    [showToast]
  );

  return { feedings, isLoading, refresh, addFeeding, removeFeeding };
}
