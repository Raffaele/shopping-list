import { useTranslation } from 'react-i18next';
import type { Store } from '@/db';
import { StoreListItem } from '../StoreListItem/StoreListItem';
import styles from './StoreList.module.css';

export function StoreList({ stores }: { stores: Store[] }) {
  const { t } = useTranslation();

  if (stores.length === 0) {
    return (
      <div className={styles.empty}>
        <h3 className={styles.emptyTitle}>{t('stores.emptyTitle')}</h3>
        <p className={styles.emptyText}>{t('stores.emptyText')}</p>
      </div>
    );
  }

  return (
    <ul className={styles.list} aria-label={t('stores.listLabel')}>
      {stores.map((store) => (
        <StoreListItem key={store.id} store={store} />
      ))}
    </ul>
  );
}
