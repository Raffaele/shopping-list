import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import styles from './NotFound.module.css';

export function NotFound() {
  const { t } = useTranslation();
  return (
    <section className={styles.root}>
      <h2 className={styles.heading}>{t('notFound.title')}</h2>
      <Link to="/" className={styles.link}>
        {t('notFound.backHome')}
      </Link>
    </section>
  );
}
