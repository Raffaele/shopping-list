import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import type { Priority } from '@/db';
import { PRIORITY_ICONS, PRIORITY_LABEL_KEYS } from '../priority';
import styles from './PriorityIcon.module.css';
import { priorityToneClass } from './priorityTone';

export function PriorityIcon({ priority }: { priority: Priority }) {
  const { t } = useTranslation();

  return (
    <span
      className={`${styles['icon']} ${priorityToneClass(priority)}`}
      role="img"
      aria-label={t(PRIORITY_LABEL_KEYS[priority])}
    >
      <Icon name={PRIORITY_ICONS[priority]} />
    </span>
  );
}
