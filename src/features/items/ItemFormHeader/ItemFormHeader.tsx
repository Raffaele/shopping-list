import { Dialog } from 'radix-ui';
import type { ReactNode } from 'react';
import dialogStyles from '@/components/Dialog/Dialog.module.css';
import styles from './ItemFormHeader.module.css';

interface ItemFormHeaderProps {
  title: string;
  children?: ReactNode;
}

/** Dialog title with its actions beside it, always visible while the form scrolls. */
export function ItemFormHeader({ title, children }: ItemFormHeaderProps) {
  return (
    <div className={styles.header}>
      <Dialog.Title className={`${dialogStyles.title} ${styles.title}`}>{title}</Dialog.Title>
      {children}
    </div>
  );
}
