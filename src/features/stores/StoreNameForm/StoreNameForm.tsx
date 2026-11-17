import { useState, type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button/Button';
import dialogStyles from '@/components/Dialog/Dialog.module.css';
import styles from './StoreNameForm.module.css';

interface StoreNameFormProps {
  initialName?: string;
  submitLabel: string;
  onSubmit: (name: string) => Promise<void>;
  /** Rendered before the submit button, e.g. a cancel button. */
  extraActions?: ReactNode;
}

export function StoreNameForm({
  initialName = '',
  submitLabel,
  onSubmit,
  extraActions,
}: StoreNameFormProps) {
  const { t } = useTranslation();
  const [name, setName] = useState(initialName);
  const isBlank = name.trim() === '';

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        if (!isBlank) void onSubmit(name);
      }}
    >
      <label className={styles.label}>
        <span className={styles.labelText}>{t('stores.nameLabel')}</span>
        <input
          className={styles.input}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
      </label>
      <div className={dialogStyles.actions}>
        {extraActions}
        <Button type="submit" variant="primary" icon="check" disabled={isBlank}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
