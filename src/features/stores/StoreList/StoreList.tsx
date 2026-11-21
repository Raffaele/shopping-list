import { useTranslation } from 'react-i18next';
import { EmptyState } from '@/components/EmptyState/EmptyState';
import type { Store } from '@/db';
import { StoreListItem } from '../StoreListItem/StoreListItem';
import { useStoreReorder } from '../useStoreReorder';
import styles from './StoreList.module.css';

export function StoreList({ stores }: { stores: Store[] }) {
  const { t } = useTranslation();
  const { orderedStores, draggedId, startDrag, moveByKey, registerRow } = useStoreReorder(stores);

  if (stores.length === 0) {
    return <EmptyState title={t('stores.emptyTitle')} text={t('stores.emptyText')} />;
  }

  return (
    <ul className={styles.list} aria-label={t('stores.listLabel')}>
      {orderedStores.map((store) => (
        <StoreListItem
          key={store.id}
          store={store}
          isDragged={store.id === draggedId}
          rowRef={registerRow(store.id)}
          onDragStart={() => startDrag(store.id)}
          onMoveByKey={(key) => moveByKey(store.id, key)}
        />
      ))}
    </ul>
  );
}
