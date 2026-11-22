import { registerSW } from 'virtual:pwa-register';
import { listenForInstallPrompt } from './install';

const HOUR_MS = 60 * 60 * 1000;

export function registerPwa() {
  listenForInstallPrompt();
  registerSW({
    immediate: true,
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      const check = () => {
        if (navigator.onLine) void registration.update();
      };
      setInterval(check, HOUR_MS);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check();
      });
      window.addEventListener('online', check);
    },
  });

  if (typeof navigator.storage?.persist === 'function') {
    navigator.storage.persist().catch(() => undefined);
  }
}
