import { useSyncExternalStore } from 'react';
import { getInstallPrompt, promptInstall, subscribeToInstallPrompt } from './install';

export function useInstallPrompt() {
  const prompt = useSyncExternalStore(subscribeToInstallPrompt, getInstallPrompt);
  return { canInstall: prompt !== null, install: promptInstall };
}
