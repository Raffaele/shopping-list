import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import type { Item } from '@/db';
import { ItemListItem } from '../ItemListItem/ItemListItem';
import styles from './ItemList.module.css';

interface ItemListProps {
  items: Item[];
  onFound: (item: Item) => void;
}

export function ItemList({ items, onFound }: ItemListProps) {
  const { t } = useTranslation();

  if (items.length === 0) {
    return <EmptyState title={t('items.emptyTitle')} text={t('items.emptyText')} />;
  }

  return (
    <ul className={styles.list} aria-label={t('items.listLabel')}>
      {items.map((item) => (
        <ItemListItem key={item.id} item={item} onFound={onFound} />
      ))}
    </ul>
  );
}
