import type { ThemeSetting } from '@/stores/settings';

export type ResolvedTheme = 'light' | 'dark';

export const DARK_QUERY = '(prefers-color-scheme: dark)';

export function resolveTheme(theme: ThemeSetting, systemDark: boolean): ResolvedTheme {
  if (theme === 'system') return systemDark ? 'dark' : 'light';
  return theme;
}
