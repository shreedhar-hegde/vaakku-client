import { Link, Navigate } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { ROUTES } from '../constants/routes';

const featureKeys = [
  { key: 'tts', path: ROUTES.TTS, labelKey: 'landing.features.tts' },
  { key: 'stt', path: ROUTES.STT, labelKey: 'landing.features.stt' },
  { key: 'translate', path: ROUTES.TRANSLATE, labelKey: 'landing.features.translate' },
];

export default function Landing() {
  const { locale, setLocale, t, options } = useLocale();
  if (localStorage.getItem('token')) return <Navigate to={ROUTES.TTS} replace />;

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <header
        className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between border-b px-4 py-3 md:px-6"
        style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
      >
        <div className="flex items-center gap-3">
          <Link to={ROUTES.LANDING} className="text-lg font-bold" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
            {t('landing.brand')}
          </Link>
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="rounded border bg-transparent py-1.5 pl-2 pr-8 text-sm transition-colors duration-150"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            aria-label="Language"
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={ROUTES.LOGIN}
            className="rounded border py-1.5 px-3 text-sm font-medium transition-colors duration-150"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)', textDecoration: 'none' }}
          >
            {t('landing.signIn')}
          </Link>
          <Link
            to={ROUTES.SIGNUP}
            className="rounded py-1.5 px-3 text-sm font-medium text-white transition-opacity duration-150"
            style={{ backgroundColor: 'var(--color-accent)', color: 'var(--color-surface)', textDecoration: 'none' }}
          >
            {t('nav.signUp')}
          </Link>
        </div>
      </header>

      <section
        className="px-4 pb-12 pt-24 text-center md:pb-16 md:pt-28"
        style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
      >
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-4 text-2xl font-bold leading-tight md:text-3xl">
            {t('landing.heroTitle')}
          </h1>
          <p className="mx-auto mb-8 max-w-[520px] text-base leading-relaxed opacity-95 md:text-lg">
            {t('landing.heroSubtitle')}
          </p>
          <Link
            to={ROUTES.TTS}
            className="inline-flex items-center gap-1 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold transition-opacity duration-150 hover:opacity-90"
            style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
          >
            Try Text to Speech
            <span aria-hidden>→</span>
          </Link>
          <p className="mt-4 text-sm opacity-90">
            {t('landing.tryNowHint') || 'No account needed — limited tries per tool.'}
          </p>
        </div>
      </section>

      <section id="features" className="mx-auto max-w-5xl px-4 py-10 md:py-14">
        <h2 className="mb-1 text-center text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
          {t('landing.sectionTitle')}
        </h2>
        <p className="mx-auto mb-8 max-w-md text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {t('landing.sectionSubtitle')}
        </p>
        <div className="grid gap-6 md:grid-cols-3">
          {featureKeys.map((f) => (
            <div
              key={f.key}
              className="rounded-lg border p-6 transition-[border-color] duration-150 hover:border-[var(--color-accent)]"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
            >
              <div
                className="mb-3 flex h-14 w-14 items-center justify-center rounded-lg text-white"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                {f.key === 'tts' && '🔊'}
                {f.key === 'stt' && '🎤'}
                {f.key === 'translate' && '⇄'}
              </div>
              <h3 className="mb-2 font-semibold" style={{ color: 'var(--color-text)' }}>
                {t(`${f.labelKey}.title`)}
              </h3>
              <p className="mb-4 text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {t(`${f.labelKey}.description`)}
              </p>
              <Link
                to={f.path}
                className="inline-flex items-center gap-1 text-sm font-medium transition-opacity duration-150 hover:opacity-90"
                style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
              >
                Try it
                <span aria-hidden>→</span>
              </Link>
            </div>
          ))}
        </div>

        <div
          className="mt-12 rounded-lg border px-4 py-8 text-center md:mt-14"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          <h3 className="mb-1 font-semibold" style={{ color: 'var(--color-text)' }}>{t('landing.ctaTitle')}</h3>
          <p className="mb-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>{t('landing.ctaSubtitle')}</p>
          <Link
            to={ROUTES.SIGNUP}
            className="inline-flex items-center gap-1 rounded-lg px-6 py-2.5 text-sm font-semibold text-white transition-opacity duration-150 hover:opacity-90"
            style={{ backgroundColor: 'var(--color-accent)', textDecoration: 'none' }}
          >
            {t('landing.createAccount')}
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      <footer className="border-t py-4 text-center" style={{ borderColor: 'var(--color-border)' }}>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {t('landing.footerAlready')}{' '}
          <Link to={ROUTES.LOGIN} className="font-semibold" style={{ color: 'var(--color-accent)' }}>
            {t('landing.signInLink')}
          </Link>
        </p>
      </footer>
    </div>
  );
}
