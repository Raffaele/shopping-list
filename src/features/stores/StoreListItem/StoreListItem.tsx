import type { KeyboardEvent, Ref } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { DragHandle } from '@/components/DragHandle/DragHandle';
import { IconButton } from '@/components/IconButton/IconButton';
import { shoppingFacade, type Store } from '@/db';
import { DeleteStoreDialog } from '../DeleteStoreDialog/DeleteStoreDialog';
import { StoreNameDialog } from '../StoreNameDialog/StoreNameDialog';
import styles from './StoreListItem.module.css';

interface StoreListItemProps {
  store: Store;
  isDragged: boolean;
  rowRef: Ref<HTMLLIElement>;
  onDragStart: () => void;
  /** Returns whether the key was a reorder key. */
  onMoveByKey: (key: string) => boolean;
}

export function StoreListItem({
  store,
  isDragged,
  rowRef,
  onDragStart,
  onMoveByKey,
}: StoreListItemProps) {
  const { t } = useTranslation();

  const handleKeyDown = (event: KeyboardEvent) => {
    if (onMoveByKey(event.key)) event.preventDefault();
  };

  return (
    <li ref={rowRef} className={`${styles.row} ${isDragged ? styles.dragged : ''}`}>
      <DragHandle
        aria-label={t('stores.reorderStore', { name: store.name })}
        onPointerDown={onDragStart}
        onKeyDown={handleKeyDown}
      />
      <Link to={`/stores/${store.id}`} className={styles.name}>
        {store.name}
      </Link>
      <StoreNameDialog
        trigger={
          <IconButton icon="edit" aria-label={t('stores.renameStore', { name: store.name })} />
        }
        title={t('stores.renameTitle')}
        submitLabel={t('stores.save')}
        initialName={store.name}
        onSubmit={(name) => shoppingFacade.renameStore(store.id, name)}
      />
      <DeleteStoreDialog store={store} />
    </li>
  );
}
