import { RadioGroup, Select } from 'radix-ui';
import { useTranslation } from 'react-i18next';
import { Fieldset } from '@/components/Fieldset/Fieldset';
import { IconLink } from '@/components/IconLink/IconLink';
import { ShareSection } from '@/features/share/ShareSection/ShareSection';
import { SUPPORTED_LANGUAGES } from '@/i18n/languages';
import { useSettings, type ThemeSetting } from '@/stores/settings';
import styles from './Settings.module.css';

const THEMES: ThemeSetting[] = ['system', 'light', 'dark'];

function isTheme(value: string): value is ThemeSetting {
  return THEMES.some((th) => th === value);
}

export function Settings() {
  const { t, i18n } = useTranslation();
  const theme = useSettings((s) => s.theme);
  const setTheme = useSettings((s) => s.setTheme);
  const current = i18n.resolvedLanguage ?? 'en';

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <IconLink to="/" icon="back" aria-label={t('settings.back')} />
        <h2 className={styles.heading}>{t('settings.title')}</h2>
      </div>

      <Fieldset legend={t('settings.theme.title')}>
        <RadioGroup.Root
          className={styles.radioGroup}
          value={theme}
          onValueChange={(v) => {
            if (isTheme(v)) setTheme(v);
          }}
        >
          {THEMES.map((th) => (
            <div key={th} className={styles.radioRow}>
              <RadioGroup.Item className={styles.radio} value={th} id={`theme-${th}`}>
                <RadioGroup.Indicator className={styles.radioIndicator} />
              </RadioGroup.Item>
              <label className={styles.radioLabel} htmlFor={`theme-${th}`}>
                {t(`settings.theme.${th}`)}
              </label>
            </div>
          ))}
        </RadioGroup.Root>
      </Fieldset>

      <section className={styles.section}>
        <h3 id="language-label" className={styles.sectionTitle}>
          {t('settings.language.title')}
        </h3>
        <Select.Root
          value={current}
          onValueChange={(lng) => {
            void i18n.changeLanguage(lng);
          }}
        >
          <Select.Trigger className={styles.trigger} aria-labelledby="language-label">
            <Select.Value />
          </Select.Trigger>
          <Select.Portal>
            <Select.Content className={styles.content} position="popper" sideOffset={4}>
              <Select.Viewport>
                {SUPPORTED_LANGUAGES.map((l) => (
                  <Select.Item key={l.code} value={l.code} className={styles.item}>
                    <Select.ItemText>{l.name}</Select.ItemText>
                  </Select.Item>
                ))}
              </Select.Viewport>
            </Select.Content>
          </Select.Portal>
        </Select.Root>
      </section>

      <ShareSection />

      <p className={styles.version}>
        {t('settings.version')}: {__APP_VERSION__}
      </p>
    </div>
  );
}
