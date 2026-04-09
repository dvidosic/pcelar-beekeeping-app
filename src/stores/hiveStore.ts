import { create } from 'zustand';
import { HiveWithStatus } from '@/types/hive';

interface HiveStore {
  hives: HiveWithStatus[];
  selectedHiveId: string | null;
  isLoading: boolean;
  setHives: (hives: HiveWithStatus[]) => void;
  setSelectedHive: (id: string | null) => void;
  setLoading: (v: boolean) => void;
  addHiveOptimistic: (hive: HiveWithStatus) => void;
  removeHiveOptimistic: (id: string) => void;
  updateHiveOptimistic: (id: string, data: Partial<HiveWithStatus>) => void;
}

export const useHiveStore = create<HiveStore>((set) => ({
  hives: [],
  selectedHiveId: null,
  isLoading: false,
  setHives: (hives) => set({ hives }),
  setSelectedHive: (id) => set({ selectedHiveId: id }),
  setLoading: (v) => set({ isLoading: v }),
  addHiveOptimistic: (hive) =>
    set((state) => ({ hives: [...state.hives, hive] })),
  removeHiveOptimistic: (id) =>
    set((state) => ({ hives: state.hives.filter((h) => h.id !== id) })),
  updateHiveOptimistic: (id, data) =>
    set((state) => ({
      hives: state.hives.map((h) => (h.id === id ? { ...h, ...data } : h)),
    })),
}));
