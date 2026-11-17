import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeSetting = 'system' | 'light' | 'dark';

interface SettingsState {
  theme: ThemeSetting;
  setTheme: (theme: ThemeSetting) => void;
}

export const SETTINGS_STORAGE_KEY = 'settings';

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
    }),
    { name: SETTINGS_STORAGE_KEY, partialize: (s) => ({ theme: s.theme }) },
  ),
);
