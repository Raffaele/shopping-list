import { useTranslation } from 'react-i18next';
import styles from './InstallInstructions.module.css';

const PLATFORMS = ['android', 'ios'] as const;
const STEP_KEYS = ['1', '2', '3'] as const;

export function InstallInstructions() {
  const { t } = useTranslation();

  return (
    <div className={styles.platforms}>
      {PLATFORMS.map((platform) => (
        <section key={platform} className={styles.platform}>
          <h3 className={styles.title}>{t(`share.install.${platform}.title`)}</h3>
          <ol className={styles.steps}>
            {STEP_KEYS.map((step) => (
              <li key={step}>{t(`share.install.${platform}.step${step}`)}</li>
            ))}
          </ol>
        </section>
      ))}
    </div>
  );
}
