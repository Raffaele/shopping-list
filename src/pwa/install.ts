interface InstallPromptEvent extends Event {
  prompt: () => Promise<void>;
}

function isInstallPromptEvent(event: Event): event is InstallPromptEvent {
  return 'prompt' in event && typeof event.prompt === 'function';
}

let pendingPrompt: InstallPromptEvent | null = null;
const listeners = new Set<() => void>();

function setPendingPrompt(prompt: InstallPromptEvent | null) {
  pendingPrompt = prompt;
  listeners.forEach((listener) => {
    listener();
  });
}

/** Must run at startup: the browser fires the event once, usually before any page is shown. */
export function listenForInstallPrompt() {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    if (isInstallPromptEvent(event)) setPendingPrompt(event);
  });
  window.addEventListener('appinstalled', () => {
    setPendingPrompt(null);
  });
}

export function subscribeToInstallPrompt(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getInstallPrompt(): InstallPromptEvent | null {
  return pendingPrompt;
}

export async function promptInstall(): Promise<void> {
  const prompt = pendingPrompt;
  if (!prompt) return;
  setPendingPrompt(null);
  await prompt.prompt();
}
