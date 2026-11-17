import { DARK_QUERY, resolveTheme } from './theme';

describe('resolveTheme', () => {
  it('resolves system according to the media query', () => {
    expect(resolveTheme('system', true)).toBe('dark');
    expect(resolveTheme('system', false)).toBe('light');
  });

  it('keeps explicit choices', () => {
    expect(resolveTheme('light', true)).toBe('light');
    expect(resolveTheme('dark', false)).toBe('dark');
  });

  it('matchMedia mock reflects the dark query', () => {
    expect(DARK_QUERY).toContain('prefers-color-scheme');
    expect(window.matchMedia(DARK_QUERY).matches).toBe(false);
  });
});
