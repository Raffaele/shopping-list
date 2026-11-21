import type { ComponentPropsWithoutRef } from 'react';
import { Icon } from '@/components/Icon/Icon';
import styles from './DragHandle.module.css';

type DragHandleProps = Omit<ComponentPropsWithoutRef<'button'>, 'className' | 'children'> & {
  'aria-label': string;
};

export function DragHandle({ type = 'button', ...rest }: DragHandleProps) {
  return (
    <button type={type} className={styles.handle} {...rest}>
      <Icon name="grip" />
    </button>
  );
}
