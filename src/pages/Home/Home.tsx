import { useTranslation } from 'react-i18next';
import styles from './Home.module.css';

export function Home() {
  const { t } = useTranslation();
  return (
    <section className={styles.empty}>
      <h2 className={styles.heading}>{t('home.emptyTitle')}</h2>
      <p className={styles.text}>{t('home.emptyText')}</p>
    </section>
  );
}
