import { filterSuggestions, MAX_VISIBLE_SUGGESTIONS } from './suggestions';

describe('filterSuggestions', () => {
  it('matches the typed text anywhere, ignoring case and surrounding spaces', () => {
    expect(filterSuggestions(['Oat milk', 'Milk', 'Bread'], ' MIL ')).toEqual(['Oat milk', 'Milk']);
  });

  it('leaves out an exact match', () => {
    expect(filterSuggestions(['Milk', 'Milk chocolate'], 'milk')).toEqual(['Milk chocolate']);
  });

  it('offers everything for an empty query, up to the visible limit', () => {
    const names = Array.from({ length: MAX_VISIBLE_SUGGESTIONS + 3 }, (_, i) => `Item ${i}`);
    expect(filterSuggestions(names, '')).toHaveLength(MAX_VISIBLE_SUGGESTIONS);
  });
});
