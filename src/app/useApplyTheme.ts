import { useEffect } from 'react';
import { useSettings } from '@/stores/settings';
import { DARK_QUERY, resolveTheme } from './theme';

function apply(theme: 'light' | 'dark') {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme);
  const color = getComputedStyle(root).getPropertyValue('--color-bg').trim();
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta && color) meta.setAttribute('content', color);
}

export function useApplyTheme() {
  const theme = useSettings((s) => s.theme);

  useEffect(() => {
    const mql = window.matchMedia(DARK_QUERY);
    const update = () => {
      apply(resolveTheme(theme, mql.matches));
    };
    update();
    if (theme !== 'system') return;
    mql.addEventListener('change', update);
    return () => {
      mql.removeEventListener('change', update);
    };
  }, [theme]);
}
