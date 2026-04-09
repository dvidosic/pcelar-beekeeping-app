import { useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { InspectionDraft } from '@/types/inspection';

const DRAFT_TTL_DAYS = 7;

function draftKey(hiveId: string): string {
  return `inspection_draft__${hiveId}`;
}

function editDraftKey(inspectionId: string): string {
  return `inspection_draft__edit__${inspectionId}`;
}

function isExpired(savedAt: string): boolean {
  const ms = Date.now() - new Date(savedAt).getTime();
  return ms > DRAFT_TTL_DAYS * 86_400_000;
}

export function useInspectionDraft(hiveId: string, inspectionId?: string) {
  const key = inspectionId ? editDraftKey(inspectionId) : draftKey(hiveId);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadDraft = useCallback(async (): Promise<InspectionDraft | null> => {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return null;
      const draft: InspectionDraft = JSON.parse(raw);
      if (isExpired(draft.savedAt)) {
        await AsyncStorage.removeItem(key);
        return null;
      }
      return draft;
    } catch {
      return null;
    }
  }, [key]);

  const saveDraft = useCallback(
    (draft: InspectionDraft) => {
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(async () => {
        try {
          const toSave: InspectionDraft = { ...draft, savedAt: new Date().toISOString() };
          await AsyncStorage.setItem(key, JSON.stringify(toSave));
        } catch {}
      }, 800);
    },
    [key]
  );

  const clearDraft = useCallback(async () => {
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    try {
      await AsyncStorage.removeItem(key);
    } catch {}
  }, [key]);

  const hasDraft = useCallback(async (): Promise<boolean> => {
    try {
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return false;
      const draft: InspectionDraft = JSON.parse(raw);
      return !isExpired(draft.savedAt);
    } catch {
      return false;
    }
  }, [key]);

  return { loadDraft, saveDraft, clearDraft, hasDraft };
}
