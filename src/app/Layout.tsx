import { useTranslation } from 'react-i18next';
import { NavLink, Outlet } from 'react-router';
import { useApplyTheme } from './useApplyTheme';
import styles from './Layout.module.css';

export function Layout() {
  const { t } = useTranslation();
  useApplyTheme();

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    isActive ? `${styles.link} ${styles.active}` : styles.link;

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <h1 className={styles.title}>{t('app.title')}</h1>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
      <nav className={styles.nav} aria-label={t('nav.label')}>
        <NavLink to="/" end className={linkClass}>
          {t('nav.home')}
        </NavLink>
        <NavLink to="/settings" className={linkClass}>
          {t('nav.settings')}
        </NavLink>
      </nav>
    </div>
  );
}
