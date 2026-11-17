import { useState, type ReactElement } from 'react';
import { Dialog } from 'radix-ui';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button/Button';
import dialogStyles from '@/components/Dialog/Dialog.module.css';
import { StoreNameForm } from '../StoreNameForm/StoreNameForm';

interface StoreNameDialogProps {
  trigger: ReactElement;
  title: string;
  submitLabel: string;
  initialName?: string;
  onSubmit: (name: string) => Promise<void>;
}

export function StoreNameDialog({
  trigger,
  title,
  submitLabel,
  initialName,
  onSubmit,
}: StoreNameDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  async function submit(name: string) {
    await onSubmit(name);
    setOpen(false);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={dialogStyles.overlay} />
        <Dialog.Content className={dialogStyles.content} aria-describedby={undefined}>
          <Dialog.Title className={dialogStyles.title}>{title}</Dialog.Title>
          <StoreNameForm
            initialName={initialName}
            submitLabel={submitLabel}
            onSubmit={submit}
            extraActions={
              <Dialog.Close asChild>
                <Button icon="close">{t('stores.cancel')}</Button>
              </Dialog.Close>
            }
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
