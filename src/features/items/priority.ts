import type { Priority } from '@/db';

export const DEFAULT_PRIORITY: Priority = 2;

export const PRIORITY_LABEL_KEYS = {
  3: 'items.priority.high',
  2: 'items.priority.medium',
  1: 'items.priority.low',
} as const satisfies Record<Priority, string>;
