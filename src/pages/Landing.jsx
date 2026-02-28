import { Link } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { ROUTES } from '../constants/routes';

const featureKeys = [
  { key: 'tts', labelKey: 'landing.features.tts' },
  { key: 'stt', labelKey: 'landing.features.stt' },
  { key: 'translate', labelKey: 'landing.features.translate' },
];

export default function Landing() {
  const { locale, setLocale, t, options } = useLocale();
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      <header
        className="fixed left-0 right-0 top-0 z-10 flex items-center justify-between border-b px-4 py-3 md:px-6"
        style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderColor: 'var(--color-border)' }}
      >
        <Link to={ROUTES.LANDING} className="text-lg font-bold" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
          {t('landing.brand')}
        </Link>
        <div className="flex items-center gap-2">
          <select
            value={locale}
            onChange={(e) => setLocale(e.target.value)}
            className="rounded border bg-transparent py-1.5 pl-2 pr-8 text-sm"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
            aria-label="Language"
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          {isLoggedIn ? (
            <Link
              to={ROUTES.DASHBOARD_INDEX}
              className="rounded border py-1.5 px-3 text-sm font-medium"
              style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)', textDecoration: 'none' }}
            >
              {t('nav.dashboard')}
            </Link>
          ) : (
            <Link
              to={ROUTES.LOGIN}
              className="rounded border py-1.5 px-3 text-sm font-medium"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)', textDecoration: 'none' }}
            >
              {t('landing.signIn')}
            </Link>
          )}
        </div>
      </header>

      <section
        className="px-4 pb-12 pt-24 text-center md:pb-16 md:pt-28"
        style={{ background: 'linear-gradient(165deg, var(--color-accent) 0%, #0a3d6e 50%, #0d2847 100%)', color: '#fff' }}
      >
        <div className="mx-auto max-w-2xl">
          <h1 className="mb-4 text-2xl font-bold leading-tight md:text-3xl" style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}>
            {t('landing.heroTitle')}
          </h1>
          <p className="mx-auto mb-8 max-w-[520px] text-base leading-relaxed opacity-95 md:text-lg">
            {t('landing.heroSubtitle')}
          </p>
          <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              to={isLoggedIn ? ROUTES.DASHBOARD_INDEX : ROUTES.SIGNUP}
              className="inline-flex items-center gap-1 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold transition-opacity duration-150 hover:opacity-92"
              style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
            >
              {isLoggedIn ? t('nav.dashboard') : t('landing.getStartedFree')}
              <span aria-hidden>→</span>
            </Link>
            <Link
              to={ROUTES.DASHBOARD_INDEX}
              className="rounded-lg border border-white/80 px-6 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:border-white hover:bg-white/10"
              style={{ textDecoration: 'none' }}
            >
              {t('landing.tryNow')}
            </Link>
            <button
              type="button"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="rounded-lg border border-white/60 px-6 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:border-white hover:bg-white/10"
            >
              {t('landing.howItWorks')}
            </button>
          </div>
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
              className="rounded-lg border p-6 transition-[transform,border-color] duration-150 hover:-translate-y-0.5 hover:border-[var(--color-accent)]"
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
              <p className="text-sm leading-relaxed" style={{ color: 'var(--color-text-muted)' }}>
                {t(`${f.labelKey}.description`)}
              </p>
            </div>
          ))}
        </div>

        {!isLoggedIn && (
          <div
            className="mt-12 rounded-lg px-4 py-8 text-center md:mt-14"
            style={{ backgroundColor: 'var(--color-accent)', color: '#fff' }}
          >
            <h3 className="mb-1 font-semibold">{t('landing.ctaTitle')}</h3>
            <p className="mb-4 text-sm opacity-90">{t('landing.ctaSubtitle')}</p>
            <Link
              to={ROUTES.SIGNUP}
              className="inline-flex items-center gap-1 rounded-lg bg-white px-6 py-2.5 text-sm font-semibold transition-opacity duration-150 hover:opacity-92"
              style={{ color: 'var(--color-accent)', textDecoration: 'none' }}
            >
              {t('landing.createAccount')}
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}
      </section>

      {!isLoggedIn && (
        <footer className="border-t py-4 text-center" style={{ borderColor: 'var(--color-border)' }}>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {t('landing.footerAlready')}{' '}
            <Link to={ROUTES.LOGIN} className="font-semibold" style={{ color: 'var(--color-accent)' }}>
              {t('landing.signInLink')}
            </Link>
          </p>
        </footer>
      )}
    </div>
  );
}
