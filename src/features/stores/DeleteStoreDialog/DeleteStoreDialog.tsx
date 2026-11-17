import { AlertDialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button/Button';
import dialogStyles from '@/components/Dialog/Dialog.module.css';
import { IconButton } from '@/components/IconButton/IconButton';
import { shoppingFacade, type Store } from '@/db';

export function DeleteStoreDialog({ store }: { store: Store }) {
  const { t } = useTranslation();

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <IconButton
          icon="trash"
          variant="danger"
          aria-label={t('stores.deleteStore', { name: store.name })}
        />
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className={dialogStyles.overlay} />
        <AlertDialog.Content className={dialogStyles.content}>
          <AlertDialog.Title className={dialogStyles.title}>
            {t('stores.deleteTitle')}
          </AlertDialog.Title>
          <AlertDialog.Description className={dialogStyles.description}>
            {t('stores.deleteDescription', { name: store.name })}
          </AlertDialog.Description>
          <div className={dialogStyles.actions}>
            <AlertDialog.Cancel asChild>
              <Button icon="close">{t('stores.cancel')}</Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                variant="danger"
                icon="trash"
                onClick={() => {
                  void shoppingFacade.deleteStore(store.id);
                }}
              >
                {t('stores.delete')}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
