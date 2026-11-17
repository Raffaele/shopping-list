import type { ComponentPropsWithoutRef } from 'react';
import { Icon, type IconName } from '@/components/Icon/Icon';
import styles from './Button.module.css';

type Variant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends Omit<ComponentPropsWithoutRef<'button'>, 'className'> {
  variant?: Variant;
  icon?: IconName;
}

export function Button({
  variant = 'secondary',
  type = 'button',
  icon,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button type={type} className={`${styles.button} ${styles[variant]}`} {...rest}>
      {icon && <Icon name={icon} />}
      {children}
    </button>
  );
}
