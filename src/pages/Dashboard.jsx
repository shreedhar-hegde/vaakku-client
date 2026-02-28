import { Link } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { useUser } from '../context/UserContext';
import { ROUTES } from '../constants/routes';

const toolKeys = [
  { key: 'tts', path: ROUTES.TTS },
  { key: 'stt', path: ROUTES.STT },
  { key: 'translate', path: ROUTES.TRANSLATE },
];

export default function Dashboard() {
  const { locale, setLocale, t, options } = useLocale();
  const { user } = useUser();
  const isAnonymous = !user;

  return (
    <div className="py-6">
      {isAnonymous && (
        <div
          className="mb-4 flex flex-wrap items-center justify-between gap-2 rounded border py-2 px-3 text-sm"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          <span style={{ color: 'var(--color-text)' }}>{t('dashboard.tryModeInfo')}</span>
          <Link
            to={ROUTES.SIGNUP}
            className="shrink-0 font-medium"
            style={{ color: 'var(--color-accent)' }}
          >
            {t('nav.signUp')}
          </Link>
        </div>
      )}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {t('dashboard.intro')}{' '}
          <Link to={ROUTES.LEARN} className="underline" style={{ color: 'var(--color-accent)' }}>
            {t('dashboard.learnLink')}
          </Link>
        </p>
        <select
          value={locale}
          onChange={(e) => setLocale(e.target.value)}
          className="rounded border bg-transparent py-1.5 pl-2 pr-8 text-sm"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          aria-label="Language"
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {toolKeys.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="block rounded-lg border p-5 text-left transition-[border-color,transform] duration-150 hover:border-[var(--color-accent)] hover:-translate-y-0.5"
            style={{
              borderColor: 'var(--color-border)',
              backgroundColor: 'var(--color-surface)',
              textDecoration: 'none',
              color: 'inherit',
            }}
          >
            <p className="mb-2 text-lg font-semibold" style={{ color: 'var(--color-accent)' }}>
              {t(`dashboard.${tool.key}.title`)}
            </p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)', lineHeight: 1.5 }}>
              {t(`dashboard.${tool.key}.description`)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
