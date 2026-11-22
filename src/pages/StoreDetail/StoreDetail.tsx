import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router';
import { IconLink } from '@/components/IconLink/IconLink';
import { AddItemDialog } from '@/features/items/AddItemDialog/AddItemDialog';
import { FoundToast } from '@/features/items/FoundToast/FoundToast';
import { ItemList } from '@/features/items/ItemList/ItemList';
import { useFoundUndo } from '@/features/items/useFoundUndo';
import { useStoreItems } from '@/features/items/useStoreItems';
import { useStores } from '@/features/stores/useStores';
import { NotFound } from '@/pages/NotFound/NotFound';
import styles from './StoreDetail.module.css';

export function StoreDetail() {
  const { t } = useTranslation();
  const { storeId = '' } = useParams();
  const stores = useStores();
  const items = useStoreItems(storeId);
  const found = useFoundUndo();
  const store = stores?.find((candidate) => candidate.id === storeId);

  if (stores === undefined) return null;
  if (store === undefined) return <NotFound />;

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <IconLink to="/" icon="back" aria-label={t('items.backToStores')} />
        <div className={styles.titles}>
          <h2 className={styles.heading}>{store.name}</h2>
          {items && <p className={styles.count}>{t('items.count', { count: items.length })}</p>}
        </div>
        <AddItemDialog storeId={store.id} />
      </div>
      {items && (
        <ItemList
          items={items}
          onFound={(item) => {
            void found.markFound(item);
          }}
        />
      )}
      <FoundToast
        removed={found.removed}
        onUndo={() => {
          void found.undo();
        }}
        onDismiss={found.dismiss}
      />
    </div>
  );
}
