import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/IconButton/IconButton';
import { MIN_QUANTITY, shoppingFacade } from '@/db';
import { ItemDialog } from '../ItemDialog/ItemDialog';
import { ItemForm } from '../ItemForm/ItemForm';
import { DEFAULT_PRIORITY } from '../priority';

export function AddItemDialog({ storeId }: { storeId: string }) {
  const { t } = useTranslation();
  // Remounting the form resets it and refocuses the name field for the next item.
  const [formKey, setFormKey] = useState(0);

  return (
    <ItemDialog
      trigger={<IconButton icon="plus" variant="primary" aria-label={t('items.addItem')} />}
    >
      {(close) => (
        <ItemForm
          key={formKey}
          title={t('items.addItem')}
          initialValues={{
            name: '',
            quantity: MIN_QUANTITY,
            priority: DEFAULT_PRIORITY,
            storeIds: [storeId],
          }}
          suggestionsStoreId={storeId}
          autoFocusName
          submitLabel={t('items.add')}
          onSubmit={async (values) => {
            await shoppingFacade.createItem(values);
            setFormKey((key) => key + 1);
          }}
          onCancel={close}
        />
      )}
    </ItemDialog>
  );
}
