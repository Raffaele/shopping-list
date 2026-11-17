import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router';
import { AddItemDialog } from '@/features/items/AddItemDialog/AddItemDialog';
import { ItemList } from '@/features/items/ItemList/ItemList';
import { useStoreItems } from '@/features/items/useStoreItems';
import { useStores } from '@/features/stores/useStores';
import { NotFound } from '@/pages/NotFound/NotFound';
import styles from './StoreDetail.module.css';

export function StoreDetail() {
  const { t } = useTranslation();
  const { storeId = '' } = useParams();
  const stores = useStores();
  const items = useStoreItems(storeId);
  const store = stores?.find((candidate) => candidate.id === storeId);

  if (stores === undefined) return null;
  if (store === undefined) return <NotFound />;

  return (
    <div className={styles.page}>
      <Link to="/" className={styles.back}>
        {t('items.backToStores')}
      </Link>
      <div className={styles.header}>
        <div className={styles.titles}>
          <h2 className={styles.heading}>{store.name}</h2>
          {items && <p className={styles.count}>{t('items.count', { count: items.length })}</p>}
        </div>
        <AddItemDialog storeId={store.id} />
      </div>
      {items && <ItemList items={items} />}
    </div>
  );
}
