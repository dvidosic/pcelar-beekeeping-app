import { create } from 'zustand';
import { generateUUID } from '@/utils/uuid';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface UIStore {
  globalLoading: boolean;
  toastQueue: ToastMessage[];
  setGlobalLoading: (v: boolean) => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  globalLoading: false,
  toastQueue: [],
  setGlobalLoading: (v) => set({ globalLoading: v }),
  showToast: (message, type = 'info') => {
    const id = generateUUID();
    set((state) => ({
      toastQueue: [...state.toastQueue, { id, message, type }],
    }));
    // Auto-dismiss after 3 seconds
    setTimeout(() => {
      set((state) => ({
        toastQueue: state.toastQueue.filter((t) => t.id !== id),
      }));
    }, 3000);
  },
  dismissToast: (id) =>
    set((state) => ({
      toastQueue: state.toastQueue.filter((t) => t.id !== id),
    })),
}));
