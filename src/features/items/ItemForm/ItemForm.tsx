import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button/Button';
import dialogStyles from '@/components/Dialog/Dialog.module.css';
import { MIN_QUANTITY, type NewItem } from '@/db';
import { useStores } from '@/features/stores/useStores';
import { PriorityField } from '../PriorityField/PriorityField';
import { StoresField } from '../StoresField/StoresField';
import styles from './ItemForm.module.css';

interface ItemFormProps {
  initialValues: NewItem;
  submitLabel: string;
  onSubmit: (values: NewItem) => Promise<void>;
  onCancel: () => void;
}

function isValidQuantity(quantity: number): boolean {
  return Number.isInteger(quantity) && quantity >= MIN_QUANTITY;
}

export function ItemForm({ initialValues, submitLabel, onSubmit, onCancel }: ItemFormProps) {
  const { t } = useTranslation();
  const stores = useStores();
  const [name, setName] = useState(initialValues.name);
  const [quantityText, setQuantityText] = useState(String(initialValues.quantity));
  const [priority, setPriority] = useState(initialValues.priority);
  const [storeIds, setStoreIds] = useState(initialValues.storeIds);

  const quantity = Number(quantityText);
  const isValid = name.trim() !== '' && isValidQuantity(quantity) && storeIds.length > 0;

  return (
    <form
      className={styles.form}
      onSubmit={(event) => {
        event.preventDefault();
        if (isValid) void onSubmit({ name, quantity, priority, storeIds });
      }}
    >
      <label className={styles.label}>
        <span className={styles.labelText}>{t('items.nameLabel')}</span>
        <input
          className={styles.input}
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
      </label>
      <label className={styles.label}>
        <span className={styles.labelText}>{t('items.quantityLabel')}</span>
        <input
          className={styles.input}
          type="number"
          inputMode="numeric"
          min={MIN_QUANTITY}
          step={1}
          value={quantityText}
          onChange={(event) => {
            setQuantityText(event.target.value);
          }}
        />
      </label>
      <div className={styles.label}>
        <span className={styles.labelText}>{t('items.priorityLabel')}</span>
        <PriorityField value={priority} onChange={setPriority} />
      </div>
      <StoresField stores={stores ?? []} selectedIds={storeIds} onChange={setStoreIds} />
      <div className={dialogStyles.actions}>
        <Button icon="close" onClick={onCancel}>
          {t('items.cancel')}
        </Button>
        <Button type="submit" variant="primary" icon="check" disabled={!isValid}>
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
