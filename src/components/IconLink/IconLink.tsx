import { Link, type LinkProps } from 'react-router';
import { Icon, type IconName } from '@/components/Icon/Icon';
import styles from '../IconButton/IconButton.module.css';

interface IconLinkProps extends Omit<LinkProps, 'className' | 'children'> {
  icon: IconName;
  'aria-label': string;
}

/** A link that looks like an `IconButton`, for navigation. */
export function IconLink({ icon, ...rest }: IconLinkProps) {
  return (
    <Link className={`${styles.button} ${styles.default}`} {...rest}>
      <Icon name={icon} />
    </Link>
  );
}
