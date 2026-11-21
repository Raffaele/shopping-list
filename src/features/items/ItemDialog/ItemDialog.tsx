import { useState, type ReactElement, type ReactNode } from 'react';
import { Dialog } from 'radix-ui';
import dialogStyles from '@/components/Dialog/Dialog.module.css';

interface ItemDialogProps {
  trigger: ReactElement;
  children: (close: () => void) => ReactNode;
}

export function ItemDialog({ trigger, children }: ItemDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className={dialogStyles.overlay} />
        <Dialog.Content
          className={`${dialogStyles.content} ${dialogStyles.flush}`}
          aria-describedby={undefined}
        >
          {children(() => {
            setOpen(false);
          })}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
