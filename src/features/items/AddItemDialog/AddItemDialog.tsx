import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/IconButton/IconButton';
import { MIN_QUANTITY, shoppingFacade } from '@/db';
import { ItemDialog } from '../ItemDialog/ItemDialog';
import { ItemForm } from '../ItemForm/ItemForm';
import { DEFAULT_PRIORITY } from '../priority';

export function AddItemDialog({ storeId }: { storeId: string }) {
  const { t } = useTranslation();

  return (
    <ItemDialog
      trigger={<IconButton icon="plus" variant="primary" aria-label={t('items.addItem')} />}
      title={t('items.addItem')}
    >
      {(close) => (
        <ItemForm
          initialValues={{
            name: '',
            quantity: MIN_QUANTITY,
            priority: DEFAULT_PRIORITY,
            storeIds: [storeId],
          }}
          suggestionsStoreId={storeId}
          submitLabel={t('items.add')}
          onSubmit={async (values) => {
            await shoppingFacade.createItem(values);
            close();
          }}
          onCancel={close}
        />
      )}
    </ItemDialog>
  );
}
