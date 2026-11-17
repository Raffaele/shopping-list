import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/IconButton/IconButton';
import { shoppingFacade } from '@/db';
import { StoreList } from '@/features/stores/StoreList/StoreList';
import { StoreNameDialog } from '@/features/stores/StoreNameDialog/StoreNameDialog';
import { useStores } from '@/features/stores/useStores';
import styles from './Home.module.css';

async function addStore(name: string) {
  await shoppingFacade.createStore(name);
}

export function Home() {
  const { t } = useTranslation();
  const stores = useStores();

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h2 className={styles.heading}>{t('stores.title')}</h2>
        <StoreNameDialog
          trigger={<IconButton icon="plus" variant="primary" aria-label={t('stores.addStore')} />}
          title={t('stores.addStore')}
          submitLabel={t('stores.add')}
          onSubmit={addStore}
        />
      </div>
      {stores && <StoreList stores={stores} />}
    </div>
  );
}
