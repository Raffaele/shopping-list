import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/IconButton/IconButton';
import { MIN_QUANTITY, type Item } from '@/db';
import { EditItemDialog } from '../EditItemDialog/EditItemDialog';
import { PriorityIcon } from '../PriorityIcon/PriorityIcon';
import styles from './ItemListItem.module.css';

interface ItemListItemProps {
  item: Item;
  onFound: (item: Item) => void;
}

export function ItemListItem({ item, onFound }: ItemListItemProps) {
  const { t, i18n } = useTranslation();
  const formatNumber = (value: number) => new Intl.NumberFormat(i18n.language).format(value);

  return (
    <li className={styles.row}>
      <PriorityIcon priority={item.priority} />
      <div className={styles.details}>
        <span className={styles.name}>
          {item.name}
          {item.quantity !== MIN_QUANTITY && (
            <>
              {' ('}
              <strong>{formatNumber(item.quantity)}</strong>)
            </>
          )}
        </span>
      </div>
      <EditItemDialog item={item} />
      <IconButton
        icon="check"
        variant="primary"
        aria-label={t('items.markFound', { name: item.name })}
        onClick={() => {
          onFound(item);
        }}
      />
    </li>
  );
}
