import { Checkbox } from 'radix-ui';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { Icon } from '@/components/Icon/Icon';
import type { Store } from '@/db';
import styles from './StoresField.module.css';

interface StoresFieldProps {
  stores: Store[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
}

export function StoresField({ stores, selectedIds, onChange }: StoresFieldProps) {
  const { t } = useTranslation();
  const idPrefix = useId();

  function toggle(storeId: string, checked: boolean) {
    onChange(
      checked ? [...selectedIds, storeId] : selectedIds.filter((selected) => selected !== storeId),
    );
  }

  return (
    <fieldset className={styles.fieldset}>
      <legend className={styles.legend}>{t('items.storesLabel')}</legend>
      {stores.map((store) => {
        const id = `${idPrefix}-${store.id}`;
        return (
          <label key={store.id} htmlFor={id} className={styles.option}>
            <Checkbox.Root
              id={id}
              className={styles.checkbox}
              checked={selectedIds.includes(store.id)}
              onCheckedChange={(checked) => {
                toggle(store.id, checked === true);
              }}
            >
              <Checkbox.Indicator>
                <Icon name="check" />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span className={styles.name}>{store.name}</span>
          </label>
        );
      })}
      {selectedIds.length === 0 && <p className={styles.hint}>{t('items.storesHint')}</p>}
    </fieldset>
  );
}
