import '@testing-library/jest-dom/vitest';
import 'fake-indexeddb/auto';
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@/i18n';
import i18n from '@/i18n';

export function mockMatchMedia(matchesDark = false) {
  const listeners = new Set<(e: MediaQueryListEvent) => void>();
  const state = { matches: matchesDark };
  const mql = {
    get matches() {
      return state.matches;
    },
    media: '(prefers-color-scheme: dark)',
    addEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.add(cb),
    removeEventListener: (_: string, cb: (e: MediaQueryListEvent) => void) => listeners.delete(cb),
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => true,
    onchange: null,
  };
  vi.stubGlobal(
    'matchMedia',
    vi.fn(() => mql),
  );
  return {
    setDark(value: boolean) {
      state.matches = value;
      listeners.forEach((cb) => {
        cb({ matches: value } as MediaQueryListEvent);
      });
    },
  };
}

// Radix components rely on a few browser APIs missing in jsdom.
class ResizeObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}
vi.stubGlobal('ResizeObserver', ResizeObserverMock);
Element.prototype.scrollIntoView = () => undefined;
Element.prototype.hasPointerCapture = () => false;
Element.prototype.releasePointerCapture = () => undefined;

beforeEach(async () => {
  mockMatchMedia(false);
  localStorage.clear();
  document.documentElement.removeAttribute('data-theme');
  await i18n.changeLanguage('en');
});

afterEach(() => {
  cleanup();
});
