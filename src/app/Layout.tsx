import { useTranslation } from 'react-i18next';
import { Outlet, useMatch } from 'react-router';
import { IconLink } from '@/components/IconLink/IconLink';
import { useApplyTheme } from './useApplyTheme';
import styles from './Layout.module.css';

const APP_ICON_URL = `${import.meta.env.BASE_URL}icon.svg`;

export function Layout() {
  const { t } = useTranslation();
  useApplyTheme();
  const isOnSettings = useMatch('/settings') !== null;

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <img className={styles.icon} src={APP_ICON_URL} alt="" />
        <h1 className={styles.title}>{t('app.title')}</h1>
        {!isOnSettings && (
          <IconLink to="/settings" icon="settings" aria-label={t('nav.settings')} />
        )}
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}
