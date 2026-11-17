import type { ItemFields, Priority } from './types';

export const MIN_QUANTITY = 1;
export const PRIORITIES: readonly Priority[] = [1, 2, 3];

export function assertValidName(name: string): void {
  if (name.trim() === '') throw new RangeError('Name must not be empty');
}

export function assertValidQuantity(quantity: number): void {
  if (!Number.isInteger(quantity) || quantity < MIN_QUANTITY) {
    throw new RangeError(`Quantity must be an integer >= ${MIN_QUANTITY}`);
  }
}

export function assertValidPriority(priority: number): void {
  if (!PRIORITIES.some((allowed) => allowed === priority)) {
    throw new RangeError('Priority must be 1, 2 or 3');
  }
}

export function assertValidItemFields(fields: Partial<ItemFields>): void {
  if (fields.name !== undefined) assertValidName(fields.name);
  if (fields.quantity !== undefined) assertValidQuantity(fields.quantity);
  if (fields.priority !== undefined) assertValidPriority(fields.priority);
}

export function assertHasStores(storeIds: readonly string[]): void {
  if (storeIds.length === 0) throw new RangeError('An item needs at least one store');
}
