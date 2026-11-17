import { useLiveQuery } from 'dexie-react-hooks';
import { shoppingFacade, type Item } from '@/db';

/** `undefined` while the first load is in progress. */
export function useStoreItems(storeId: string): Item[] | undefined {
  return useLiveQuery(() => shoppingFacade.getStoreItems(storeId), [storeId]);
}

/** `undefined` while the first load is in progress. */
export function useItemStoreIds(itemId: string): string[] | undefined {
  return useLiveQuery(() => shoppingFacade.getItemStoreIds(itemId), [itemId]);
}
