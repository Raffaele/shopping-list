import { useLiveQuery } from 'dexie-react-hooks';
import { shoppingFacade } from '@/db';

/** `undefined` while the first load is in progress. */
export function useStoreSuggestions(storeId: string): string[] | undefined {
  return useLiveQuery(() => shoppingFacade.getStoreSuggestions(storeId), [storeId]);
}
