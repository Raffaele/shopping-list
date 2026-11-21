import { useTranslation } from 'react-i18next';
import { Button } from '@/components/Button/Button';
import { IconButton } from '@/components/IconButton/IconButton';
import { shoppingFacade } from '@/db';
import { filterSuggestions } from '../suggestions';
import { useStoreSuggestions } from '../useStoreSuggestions';
import styles from './NameSuggestions.module.css';

interface NameSuggestionsProps {
  storeId: string;
  query: string;
  onUse: (name: string) => void;
}

export function NameSuggestions({ storeId, query, onUse }: NameSuggestionsProps) {
  const { t } = useTranslation();
  const suggestions = useStoreSuggestions(storeId);
  const visible = filterSuggestions(suggestions ?? [], query);

  if (visible.length === 0) return null;

  return (
    <ul className={styles.list} aria-label={t('items.suggestionsLabel')}>
      {visible.map((name) => (
        <li key={name} className={styles.row}>
          <span className={styles.name}>{name}</span>
          <Button
            aria-label={t('items.useSuggestion', { name })}
            onClick={() => {
              onUse(name);
            }}
          >
            {t('items.use')}
          </Button>
          <span className={styles.remove}>
            <IconButton
              icon="trash"
              variant="danger"
              aria-label={t('items.deleteSuggestion', { name })}
              onClick={() => void shoppingFacade.deleteStoreSuggestion(storeId, name)}
            />
          </span>
        </li>
      ))}
    </ul>
  );
}
