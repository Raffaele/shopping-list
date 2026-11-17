import Dexie, { type EntityTable } from 'dexie';

export interface MetaEntry {
  key: string;
  value: unknown;
}

export class AppDB extends Dexie {
  meta!: EntityTable<MetaEntry, 'key'>;

  constructor() {
    super('shopping-list');
    // To change the schema, NEVER edit an existing version: add a new
    // `this.version(N+1).stores({ ... })` (with an optional `.upgrade()`) after this one.
    this.version(1).stores({
      meta: 'key',
    });
  }
}

export const db = new AppDB();
