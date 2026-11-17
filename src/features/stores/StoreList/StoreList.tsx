import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import type { Store } from '@/db';
import { StoreListItem } from '../StoreListItem/StoreListItem';
import styles from './StoreList.module.css';

export function StoreList({ stores }: { stores: Store[] }) {
  const { t } = useTranslation();

  if (stores.length === 0) {
    return <EmptyState title={t('stores.emptyTitle')} text={t('stores.emptyText')} />;
  }

  return (
    <ul className={styles.list} aria-label={t('stores.listLabel')}>
      {stores.map((store) => (
        <StoreListItem key={store.id} store={store} />
      ))}
    </ul>
  );
}
