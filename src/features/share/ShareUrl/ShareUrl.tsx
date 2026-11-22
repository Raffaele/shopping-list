import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IconButton } from '@/components/IconButton/IconButton';
import styles from './ShareUrl.module.css';

const COPIED_FEEDBACK_MS = 2000;

export function ShareUrl({ url }: { url: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => {
      setCopied(false);
    }, COPIED_FEEDBACK_MS);
    return () => {
      clearTimeout(timer);
    };
  }, [copied]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className={styles.field}>
      <span className={styles.label}>{t('share.urlLabel')}</span>
      <div className={styles.row}>
        <p className={styles.url}>{url}</p>
        <IconButton
          icon={copied ? 'check' : 'copy'}
          aria-label={t('share.copy')}
          onClick={() => {
            void copy();
          }}
        />
      </div>
      <p className={styles.status} role="status">
        {copied ? t('share.copiedStatus') : ''}
      </p>
    </div>
  );
}
