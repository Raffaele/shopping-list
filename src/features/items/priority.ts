import type { IconName } from '@/components/Icon/Icon';
import type { Priority } from '@/db';

export const DEFAULT_PRIORITY: Priority = 3;

export const PRIORITY_LABEL_KEYS = {
  3: 'items.priority.high',
  2: 'items.priority.medium',
  1: 'items.priority.low',
} as const satisfies Record<Priority, string>;

export const PRIORITY_ICONS = {
  3: 'priorityHigh',
  2: 'priorityMedium',
  1: 'priorityLow',
} as const satisfies Record<Priority, IconName>;
