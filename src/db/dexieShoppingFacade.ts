import { db } from './db';
import type { ShoppingFacade } from './shoppingFacade';
import type { Item, ItemFields, NewItem, Store } from './types';
import { assertHasStores, assertValidItemFields, assertValidName } from './validation';

const TABLES = [db.stores, db.items, db.storeItems];

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

function compareByPriorityThenName(a: Item, b: Item): number {
  return b.priority - a.priority || a.name.localeCompare(b.name);
}

export const dexieShoppingFacade: ShoppingFacade = {
  async getStores() {
    const stores = await db.stores.toArray();
    return stores.sort((a, b) => a.name.localeCompare(b.name));
  },

  async createStore(name) {
    assertValidName(name);
    const store: Store = { id: crypto.randomUUID(), name: name.trim() };
    await db.stores.add(store);
    return store;
  },

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
    });
  },

  addItemToStore: (itemId, storeId) =>
    db.transaction('rw', TABLES, async () => {
      await assertItemExists(itemId);
      await assertStoreExists(storeId);
      await db.storeItems.put({ storeId, itemId });
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
    }),

  async getItemStoreIds(itemId) {
    const links = await db.storeItems.where('itemId').equals(itemId).toArray();
    return links.map((link) => link.storeId);
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
