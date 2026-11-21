import Dexie, { type EntityTable, type Table } from 'dexie';
import type { Item, Store, StoreItem } from './types';

export interface MetaEntry {
  key: string;
  value: unknown;
}

export class AppDB extends Dexie {
  meta!: EntityTable<MetaEntry, 'key'>;
  stores!: EntityTable<Store, 'id'>;
  items!: EntityTable<Item, 'id'>;
  storeItems!: Table<StoreItem, [string, string]>;

  constructor() {
    super('shopping-list');
    // To change the schema, NEVER edit an existing version: add a new
    // `this.version(N+1).stores({ ... })` (with an optional `.upgrade()`) after this one.
    this.version(1).stores({
      meta: 'key',
    });
    this.version(2).stores({
      stores: 'id',
      items: 'id',
      storeItems: '[storeId+itemId], storeId, itemId',
    });
    this.version(3)
      .stores({ stores: 'id, position' })
      .upgrade(async (transaction) => {
        const stores = await transaction.table<Omit<Store, 'position'>>('stores').toArray();
        const byName = stores.sort((a, b) => a.name.localeCompare(b.name));
        await Promise.all(
          byName.map((store, position) =>
            transaction.table('stores').update(store.id, { position }),
          ),
        );
      });
  }
}

export const db = new AppDB();
