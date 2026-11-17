import { SETTINGS_STORAGE_KEY, useSettings } from './settings';

describe('settings store', () => {
  it('defaults to system and persists changes', () => {
    expect(useSettings.getState().theme).toBe('system');
    useSettings.getState().setTheme('dark');
    expect(useSettings.getState().theme).toBe('dark');
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    expect(raw).toContain('"theme":"dark"');
    useSettings.getState().setTheme('system');
  });
});
