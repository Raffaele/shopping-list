import de from './locales/de.json';
import en from './locales/en.json';
import es from './locales/es.json';
import fr from './locales/fr.json';
import itLocale from './locales/it.json';
import ru from './locales/ru.json';

const PLURAL_SUFFIX = /_(zero|one|two|few|many|other)$/;
const locales = { it: itLocale, fr, es, de, ru };

type Tree = { [key: string]: string | Tree };

function flatten(tree: Tree, prefix = ''): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(tree)) {
    const key = prefix ? `${prefix}.${k}` : k;
    if (typeof v === 'string') out[key] = v;
    else Object.assign(out, flatten(v, key));
  }
  return out;
}

function baseKeys(flat: Record<string, string>) {
  return new Set(Object.keys(flat).map((k) => k.replace(PLURAL_SUFFIX, '')));
}

function pluralCategories(flat: Record<string, string>) {
  const map = new Map<string, Set<string>>();
  for (const key of Object.keys(flat)) {
    const m = PLURAL_SUFFIX.exec(key);
    if (!m?.[1]) continue;
    const base = key.replace(PLURAL_SUFFIX, '');
    map.set(base, (map.get(base) ?? new Set()).add(m[1]));
  }
  return map;
}

const enFlat = flatten(en);

describe('i18n locales', () => {
  it('has no empty strings in en', () => {
    for (const v of Object.values(enFlat)) expect(v.trim()).not.toBe('');
  });

  for (const [lng, data] of Object.entries(locales)) {
    describe(lng, () => {
      const flat = flatten(data);

      it('has the same keys as en', () => {
        expect([...baseKeys(flat)].sort()).toEqual([...baseKeys(enFlat)].sort());
      });

      it('has no empty strings', () => {
        for (const v of Object.values(flat)) expect(v.trim()).not.toBe('');
      });

      it('has all plural categories for pluralized keys', () => {
        const required = new Intl.PluralRules(lng).resolvedOptions().pluralCategories;
        for (const [base, cats] of pluralCategories(flat)) {
          for (const c of required) expect(cats, `${base} missing _${c}`).toContain(c);
        }
      });
    });
  }
});
