import { toSuggestionKey } from '@/db/suggestions';

export const MAX_VISIBLE_SUGGESTIONS = 5;

/** Names containing the typed text, leaving out an exact match: nothing left to complete. */
export function filterSuggestions(names: string[], query: string): string[] {
  const key = toSuggestionKey(query);
  return names
    .filter((name) => {
      const nameKey = toSuggestionKey(name);
      return nameKey !== key && nameKey.includes(key);
    })
    .slice(0, MAX_VISIBLE_SUGGESTIONS);
}
