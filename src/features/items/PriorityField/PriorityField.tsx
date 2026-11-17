import { RadioGroup } from 'radix-ui';
import { useTranslation } from 'react-i18next';
import { PRIORITIES, type Priority } from '@/db';
import { PRIORITY_LABEL_KEYS } from '../priority';
import styles from './PriorityField.module.css';

interface PriorityFieldProps {
  value: Priority;
  onChange: (priority: Priority) => void;
}

export function PriorityField({ value, onChange }: PriorityFieldProps) {
  const { t } = useTranslation();
  const options = [...PRIORITIES].reverse();

  return (
    <RadioGroup.Root
      className={styles.group}
      aria-label={t('items.priorityLabel')}
      value={String(value)}
      onValueChange={(next) => {
        const priority = options.find((option) => String(option) === next);
        if (priority !== undefined) onChange(priority);
      }}
    >
      {options.map((priority) => (
        <label key={priority} className={styles.option}>
          <RadioGroup.Item className={styles.radio} value={String(priority)}>
            <RadioGroup.Indicator className={styles.indicator} />
          </RadioGroup.Item>
          {t(PRIORITY_LABEL_KEYS[priority])}
        </label>
      ))}
    </RadioGroup.Root>
  );
}
