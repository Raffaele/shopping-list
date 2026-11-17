import type { Item, ItemFields, NewItem, Store } from './types';

export interface ShoppingFacade {
  /** Sorted by name. */
  getStores(): Promise<Store[]>;
  createStore(name: string): Promise<Store>;
  renameStore(storeId: string, name: string): Promise<void>;
  /** Also deletes the items left with no store. */
  deleteStore(storeId: string): Promise<void>;

  /** The item must be linked to at least one existing store. */
  createItem(newItem: NewItem): Promise<Item>;
  updateItem(itemId: string, changes: Partial<ItemFields>): Promise<void>;
  addItemToStore(itemId: string, storeId: string): Promise<void>;
  /** Removing the last store of an item deletes the item. */
  removeItemFromStore(itemId: string, storeId: string): Promise<void>;
  /** Replaces the stores of an item atomically; at least one existing store is required. */
  setItemStores(itemId: string, storeIds: string[]): Promise<void>;
  getItemStoreIds(itemId: string): Promise<string[]>;

  /** Highest priority first, then by name. */
  getStoreItems(storeId: string): Promise<Item[]>;
  /** Deletes the item and all its links, so it disappears from every store. */
  markFound(itemId: string): Promise<void>;
}
