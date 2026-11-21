import { db } from './db';
import { toSuggestionKey } from './suggestions';
import type { ShoppingFacade } from './shoppingFacade';
import type { Item, ItemFields, NewItem, Store } from './types';
import {
  assertHasStores,
  assertSameIds,
  assertValidItemFields,
  assertValidName,
} from './validation';

const TABLES = [db.stores, db.items, db.storeItems, db.storeSuggestions];

async function getStoreIdsOfItem(itemId: string): Promise<string[]> {
  const links = await db.storeItems.where('itemId').equals(itemId).toArray();
  return links.map((link) => link.storeId);
}

async function rememberName(storeIds: readonly string[], name: string): Promise<void> {
  const key = toSuggestionKey(name);
  await db.storeSuggestions.bulkPut(
    [...new Set(storeIds)].map((storeId) => ({ storeId, key, name })),
  );
}

async function rememberItemName(itemId: string): Promise<void> {
  const item = await db.items.get(itemId);
  if (item) await rememberName(await getStoreIdsOfItem(itemId), item.name);
}

async function getItemIdsOfStore(storeId: string): Promise<string[]> {
  const links = await db.storeItems.where('storeId').equals(storeId).toArray();
  return links.map((link) => link.itemId);
}

async function assertStoreExists(storeId: string): Promise<void> {
  if ((await db.stores.get(storeId)) === undefined) {
    throw new Error(`Store not found: ${storeId}`);
  }
}

async function assertItemExists(itemId: string): Promise<void> {
  if ((await db.items.get(itemId)) === undefined) {
    throw new Error(`Item not found: ${itemId}`);
  }
}

async function deleteItemIfOrphan(itemId: string): Promise<void> {
  const remainingLinks = await db.storeItems.where('itemId').equals(itemId).count();
  if (remainingLinks === 0) await db.items.delete(itemId);
}

async function nextStorePosition(): Promise<number> {
  const last = await db.stores.orderBy('position').last();
  return last === undefined ? 0 : last.position + 1;
}

function compareByPriorityThenName(a: Item, b: Item): number {
  return b.priority - a.priority || a.name.localeCompare(b.name);
}

export const dexieShoppingFacade: ShoppingFacade = {
  async getStores() {
    return db.stores.orderBy('position').toArray();
  },

  async createStore(name) {
    assertValidName(name);
    return db.transaction('rw', TABLES, async () => {
      const store: Store = {
        id: crypto.randomUUID(),
        name: name.trim(),
        position: await nextStorePosition(),
      };
      await db.stores.add(store);
      return store;
    });
  },

  reorderStores: (storeIds) =>
    db.transaction('rw', TABLES, async () => {
      assertSameIds(storeIds, await db.stores.toCollection().primaryKeys());
      await Promise.all(
        storeIds.map((storeId, position) => db.stores.update(storeId, { position })),
      );
    }),

  async renameStore(storeId, name) {
    assertValidName(name);
    await db.transaction('rw', TABLES, async () => {
      await assertStoreExists(storeId);
      await db.stores.update(storeId, { name: name.trim() });
    });
  },

  deleteStore: (storeId) =>
    db.transaction('rw', TABLES, async () => {
      const itemIds = await getItemIdsOfStore(storeId);
      await db.storeItems.where('storeId').equals(storeId).delete();
      await db.storeSuggestions.where('storeId').equals(storeId).delete();
      await db.stores.delete(storeId);
      await Promise.all(itemIds.map(deleteItemIfOrphan));
    }),

  async createItem({ storeIds, ...fields }: NewItem) {
    assertValidItemFields(fields);
    assertHasStores(storeIds);
    const item: Item = { id: crypto.randomUUID(), ...fields, name: fields.name.trim() };
    return db.transaction('rw', TABLES, async () => {
      await Promise.all(storeIds.map(assertStoreExists));
      await db.items.add(item);
      await db.storeItems.bulkAdd(
        [...new Set(storeIds)].map((storeId) => ({ storeId, itemId: item.id })),
      );
      await rememberName(storeIds, item.name);
      return item;
    });
  },

  async updateItem(itemId, changes: Partial<ItemFields>) {
    assertValidItemFields(changes);
    const trimmed =
      changes.name === undefined ? changes : { ...changes, name: changes.name.trim() };
    await db.transaction('rw', TABLES, async () => {
      await assertItemExists(itemId);
      await db.items.update(itemId, trimmed);
      if (trimmed.name !== undefined) await rememberItemName(itemId);
    });
  },

  addItemToStore: (itemId, storeId) =>
    db.transaction('rw', TABLES, async () => {
      await assertItemExists(itemId);
      await assertStoreExists(storeId);
      await db.storeItems.put({ storeId, itemId });
      await rememberItemName(itemId);
    }),

  removeItemFromStore: (itemId, storeId) =>
    db.transaction('rw', TABLES, async () => {
      await db.storeItems.delete([storeId, itemId]);
      await deleteItemIfOrphan(itemId);
    }),

  setItemStores: (itemId, storeIds) =>
    db.transaction('rw', TABLES, async () => {
      assertHasStores(storeIds);
      await assertItemExists(itemId);
      await Promise.all(storeIds.map(assertStoreExists));
      await db.storeItems.where('itemId').equals(itemId).delete();
      await db.storeItems.bulkAdd([...new Set(storeIds)].map((storeId) => ({ storeId, itemId })));
      await rememberItemName(itemId);
    }),

  getItemStoreIds: getStoreIdsOfItem,

  async getStoreSuggestions(storeId) {
    const suggestions = await db.storeSuggestions.where('storeId').equals(storeId).toArray();
    return suggestions.map(({ name }) => name).sort((a, b) => a.localeCompare(b));
  },

  async deleteStoreSuggestion(storeId, name) {
    await db.storeSuggestions.delete([storeId, toSuggestionKey(name)]);
  },

  async getStoreItems(storeId) {
    const itemIds = await getItemIdsOfStore(storeId);
    const items = await db.items.bulkGet(itemIds);
    return items.filter((item): item is Item => item !== undefined).sort(compareByPriorityThenName);
  },

  markFound: (itemId) =>
    db.transaction('rw', TABLES, async () => {
      await db.storeItems.where('itemId').equals(itemId).delete();
      await db.items.delete(itemId);
    }),
};
