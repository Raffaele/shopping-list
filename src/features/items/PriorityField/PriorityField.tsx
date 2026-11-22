import { RadioGroup } from 'radix-ui';
import { useTranslation } from 'react-i18next';
import { PRIORITIES, type Priority } from '@/db';
import { Icon } from '@/components/Icon/Icon';
import { PRIORITY_ICONS, PRIORITY_LABEL_KEYS } from '../priority';
import { priorityToneClass } from '../PriorityIcon/priorityTone';
import styles from './PriorityField.module.css';

interface PriorityFieldProps {
  value: Priority;
  onChange: (priority: Priority) => void;
}

export function PriorityField({ value, onChange }: PriorityFieldProps) {
  const { t } = useTranslation();
  const options = [...PRIORITIES].reverse();

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{t('items.priorityLabel')}</legend>
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
          <RadioGroup.Item
            key={priority}
            className={`${styles.option} ${priorityToneClass(priority)}`}
            value={String(priority)}
            aria-label={t(PRIORITY_LABEL_KEYS[priority])}
          >
            <Icon name={PRIORITY_ICONS[priority]} />
          </RadioGroup.Item>
        ))}
      </RadioGroup.Root>
    </fieldset>
  );
}
