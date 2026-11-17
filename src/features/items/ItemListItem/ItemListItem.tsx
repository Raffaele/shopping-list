import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/IconButton/IconButton';
import { shoppingFacade, type Item } from '@/db';
import { EditItemDialog } from '../EditItemDialog/EditItemDialog';
import { PRIORITY_LABEL_KEYS } from '../priority';
import styles from './ItemListItem.module.css';

export function ItemListItem({ item }: { item: Item }) {
  const { t } = useTranslation();

  return (
    <li className={styles.row}>
      <div className={styles.details}>
        <span className={styles.name}>{item.name}</span>
        <span className={styles.meta}>
          {t('items.quantity', { quantity: item.quantity })} ·{' '}
          <span className={styles[`priority${item.priority}`]}>
            {t(PRIORITY_LABEL_KEYS[item.priority])}
          </span>
        </span>
      </div>
      <EditItemDialog item={item} />
      <IconButton
        icon="check"
        variant="primary"
        aria-label={t('items.markFound', { name: item.name })}
        onClick={() => {
          void shoppingFacade.markFound(item.id);
        }}
      />
    </li>
  );
}
