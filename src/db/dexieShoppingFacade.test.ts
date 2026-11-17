import { beforeEach, describe, expect, it } from 'vitest';
import { db } from './db';
import { dexieShoppingFacade as facade } from './dexieShoppingFacade';
import type { NewItem } from './types';

const milk = (storeIds: string[], overrides: Partial<NewItem> = {}): NewItem => ({
  name: 'Milk',
  quantity: 1,
  priority: 2,
  storeIds,
  ...overrides,
});

beforeEach(async () => {
  await Promise.all([db.stores.clear(), db.items.clear(), db.storeItems.clear()]);
});

describe('stores', () => {
  it('creates, lists and renames stores', async () => {
    const store = await facade.createStore('  Lidl ');
    expect(store.name).toBe('Lidl');
    await facade.renameStore(store.id, 'Aldi');
    expect(await facade.getStores()).toEqual([{ id: store.id, name: 'Aldi' }]);
  });

  it('lists stores sorted by name', async () => {
    await facade.createStore('Lidl');
    await facade.createStore('Aldi');
    expect((await facade.getStores()).map((store) => store.name)).toEqual(['Aldi', 'Lidl']);
  });

  it('rejects empty names and unknown stores', async () => {
    await expect(facade.createStore('   ')).rejects.toThrow(RangeError);
    await expect(facade.renameStore('missing', 'x')).rejects.toThrow('Store not found');
  });

  it('deletes only the items left with no store', async () => {
    const a = await facade.createStore('A');
    const b = await facade.createStore('B');
    const onlyA = await facade.createItem(milk([a.id], { name: 'Only A' }));
    const shared = await facade.createItem(milk([a.id, b.id], { name: 'Shared' }));

    await facade.deleteStore(a.id);

    expect(await facade.getStores()).toEqual([b]);
    expect(await db.items.get(onlyA.id)).toBeUndefined();
    expect(await facade.getStoreItems(b.id)).toEqual([shared]);
    expect(await db.storeItems.count()).toBe(1);
  });
});

describe('items', () => {
  it('creates an item linked to its stores', async () => {
    const a = await facade.createStore('A');
    const b = await facade.createStore('B');
    const item = await facade.createItem(milk([a.id, b.id, a.id]));
    expect((await facade.getItemStoreIds(item.id)).sort()).toEqual([a.id, b.id].sort());
  });

  it.each([
    ['quantity 0', { quantity: 0 }],
    ['fractional quantity', { quantity: 1.5 }],
    ['priority 0', { priority: 0 as never }],
    ['priority 4', { priority: 4 as never }],
    ['empty name', { name: ' ' }],
    ['no stores', { storeIds: [] }],
  ])('rejects %s', async (_label, overrides) => {
    const store = await facade.createStore('A');
    await expect(facade.createItem(milk([store.id], overrides))).rejects.toThrow();
    expect(await db.items.count()).toBe(0);
  });

  it('rejects an unknown store without leaving data behind', async () => {
    await expect(facade.createItem(milk(['missing']))).rejects.toThrow('Store not found');
    expect(await db.items.count()).toBe(0);
  });

  it('edits an item', async () => {
    const store = await facade.createStore('A');
    const item = await facade.createItem(milk([store.id]));
    await facade.updateItem(item.id, { name: 'Oat milk', quantity: 3 });
    expect(await facade.getStoreItems(store.id)).toEqual([
      { ...item, name: 'Oat milk', quantity: 3 },
    ]);
    await expect(facade.updateItem(item.id, { quantity: 0 })).rejects.toThrow(RangeError);
    await expect(facade.updateItem('missing', { quantity: 2 })).rejects.toThrow('Item not found');
  });

  it('adds and removes stores, deleting the item when none is left', async () => {
    const a = await facade.createStore('A');
    const b = await facade.createStore('B');
    const item = await facade.createItem(milk([a.id]));

    await facade.addItemToStore(item.id, b.id);
    expect(await facade.getStoreItems(b.id)).toEqual([item]);

    await facade.removeItemFromStore(item.id, a.id);
    expect(await facade.getStoreItems(a.id)).toEqual([]);
    expect(await db.items.get(item.id)).toEqual(item);

    await facade.removeItemFromStore(item.id, b.id);
    expect(await db.items.get(item.id)).toBeUndefined();
  });
});

describe('store list', () => {
  it('sorts by priority descending, then by name', async () => {
    const store = await facade.createStore('A');
    await facade.createItem(milk([store.id], { name: 'Low', priority: 1 }));
    await facade.createItem(milk([store.id], { name: 'High B', priority: 3 }));
    await facade.createItem(milk([store.id], { name: 'High A', priority: 3 }));
    await facade.createItem(milk([store.id], { name: 'Mid', priority: 2 }));

    const names = (await facade.getStoreItems(store.id)).map((item) => item.name);
    expect(names).toEqual(['High A', 'High B', 'Mid', 'Low']);
  });
});

describe('markFound', () => {
  it('removes the item and its links from every store', async () => {
    const a = await facade.createStore('A');
    const b = await facade.createStore('B');
    const item = await facade.createItem(milk([a.id, b.id]));

    await facade.markFound(item.id);

    expect(await facade.getStoreItems(a.id)).toEqual([]);
    expect(await facade.getStoreItems(b.id)).toEqual([]);
    expect(await db.items.count()).toBe(0);
    expect(await db.storeItems.count()).toBe(0);
  });
});
