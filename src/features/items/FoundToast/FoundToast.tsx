import { Toast } from 'radix-ui';
import { useTranslation } from 'react-i18next';
import type { RemovedItem } from '@/db';
import styles from './FoundToast.module.css';

const TOAST_DURATION_MS = 6000;

interface FoundToastProps {
  removed: RemovedItem | null;
  onUndo: () => void;
  onDismiss: () => void;
}

export function FoundToast({ removed, onUndo, onDismiss }: FoundToastProps) {
  const { t } = useTranslation();

  return (
    <Toast.Provider duration={TOAST_DURATION_MS} label={t('items.notifications')}>
      {removed && (
        <Toast.Root
          key={removed.item.id}
          className={styles.toast}
          onOpenChange={(open) => {
            if (!open) onDismiss();
          }}
        >
          <Toast.Description className={styles.message}>
            {t('items.foundToast', { name: removed.item.name })}
          </Toast.Description>
          <Toast.Action altText={t('items.undoAltText')} className={styles.action} onClick={onUndo}>
            {t('items.undo')}
          </Toast.Action>
        </Toast.Root>
      )}
      <Toast.Viewport className={styles.viewport} />
    </Toast.Provider>
  );
}
