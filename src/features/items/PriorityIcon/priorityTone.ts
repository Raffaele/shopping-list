import type { Priority } from '@/db';
import styles from './PriorityIcon.module.css';

const TONE_CLASSES = {
  3: styles['high'],
  2: styles['medium'],
  1: styles['low'],
} as const satisfies Record<Priority, string | undefined>;

export function priorityToneClass(priority: Priority): string | undefined {
  return TONE_CLASSES[priority];
}
