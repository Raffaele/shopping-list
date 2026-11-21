import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/IconButton/IconButton';
import { shoppingFacade, type Item } from '@/db';
import { ItemDialog } from '../ItemDialog/ItemDialog';
import { ItemFormHeader } from '../ItemFormHeader/ItemFormHeader';
import { ItemForm } from '../ItemForm/ItemForm';
import { useItemStoreIds } from '../useStoreItems';

interface EditItemFormProps {
  item: Item;
  close: () => void;
}

function EditItemForm({ item, close }: EditItemFormProps) {
  const { t } = useTranslation();
  const storeIds = useItemStoreIds(item.id);
  if (storeIds === undefined) return <ItemFormHeader title={t('items.editTitle')} />;

  const { id: itemId, ...fields } = item;
  return (
    <ItemForm
      title={t('items.editTitle')}
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
    >
      {(close) => <EditItemForm item={item} close={close} />}
    </ItemDialog>
  );
}
