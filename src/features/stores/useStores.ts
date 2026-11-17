import { useLiveQuery } from 'dexie-react-hooks';
import { shoppingFacade, type Store } from '@/db';

/** `undefined` while the first load is in progress. */
export function useStores(): Store[] | undefined {
  return useLiveQuery(() => shoppingFacade.getStores());
}
