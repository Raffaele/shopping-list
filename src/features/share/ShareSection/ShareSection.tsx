import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button/Button';
import { Fieldset } from '@/components/Fieldset/Fieldset';
import { QrCode } from '@/components/QrCode/QrCode';
import { useInstallPrompt } from '@/pwa/useInstallPrompt';
import { getAppUrl } from '../appUrl';
import { InstallInstructions } from '../InstallInstructions/InstallInstructions';
import { ShareUrl } from '../ShareUrl/ShareUrl';

export function ShareSection() {
  const { t } = useTranslation();
  const { canInstall, install } = useInstallPrompt();
  const url = getAppUrl();

  return (
    <Fieldset legend={t('share.title')}>
      <ShareUrl url={url} />
      <QrCode value={url} label={t('share.qrLabel')} />
      {canInstall && (
        <Button
          variant="primary"
          onClick={() => {
            void install();
          }}
        >
          {t('share.installButton')}
        </Button>
      )}
      <InstallInstructions />
    </Fieldset>
  );
}
