import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/IconButton/IconButton';
import { shoppingFacade, type Item } from '@/db';
import { ItemDialog } from '../ItemDialog/ItemDialog';
import { ItemForm } from '../ItemForm/ItemForm';
import { useItemStoreIds } from '../useStoreItems';

interface EditItemFormProps {
  item: Item;
  close: () => void;
}

function EditItemForm({ item, close }: EditItemFormProps) {
  const { t } = useTranslation();
  const storeIds = useItemStoreIds(item.id);
  if (storeIds === undefined) return null;

  const { id: itemId, ...fields } = item;
  return (
    <ItemForm
      initialValues={{ ...fields, storeIds }}
      submitLabel={t('items.save')}
      onSubmit={async ({ storeIds: selectedStoreIds, ...changes }) => {
        await shoppingFacade.updateItem(itemId, changes);
        await shoppingFacade.setItemStores(itemId, selectedStoreIds);
        close();
      }}
      onCancel={close}
    />
  );
}

export function EditItemDialog({ item }: { item: Item }) {
  const { t } = useTranslation();

  return (
    <ItemDialog
      trigger={<IconButton icon="edit" aria-label={t('items.editItem', { name: item.name })} />}
      title={t('items.editTitle')}
    >
      {(close) => <EditItemForm item={item} close={close} />}
    </ItemDialog>
  );
}
