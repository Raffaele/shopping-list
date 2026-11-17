export type Priority = 1 | 2 | 3;

export interface Store {
  id: string;
  name: string;
}

export interface Item {
  id: string;
  name: string;
  quantity: number;
  priority: Priority;
}

export interface StoreItem {
  storeId: string;
  itemId: string;
}

export type ItemFields = Omit<Item, 'id'>;

export interface NewItem extends ItemFields {
  storeIds: string[];
}
