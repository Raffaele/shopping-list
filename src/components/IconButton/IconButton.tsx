import type { ComponentPropsWithoutRef } from 'react';
import { Icon, type IconName } from '@/components/Icon/Icon';
import styles from './IconButton.module.css';

type Variant = 'default' | 'primary' | 'danger';

interface IconButtonProps extends Omit<
  ComponentPropsWithoutRef<'button'>,
  'className' | 'children'
> {
  icon: IconName;
  'aria-label': string;
  variant?: Variant;
}

export function IconButton({
  icon,
  variant = 'default',
  type = 'button',
  ...rest
}: IconButtonProps) {
  return (
    <button type={type} className={`${styles.button} ${styles[variant]}`} {...rest}>
      <Icon name={icon} />
    </button>
  );
}
