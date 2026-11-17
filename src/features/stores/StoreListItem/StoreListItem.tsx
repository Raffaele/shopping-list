import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/IconButton/IconButton';
import { shoppingFacade, type Store } from '@/db';
import { DeleteStoreDialog } from '../DeleteStoreDialog/DeleteStoreDialog';
import { StoreNameDialog } from '../StoreNameDialog/StoreNameDialog';
import styles from './StoreListItem.module.css';

export function StoreListItem({ store }: { store: Store }) {
  const { t } = useTranslation();

  return (
    <li className={styles.row}>
      <span className={styles.name}>{store.name}</span>
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
