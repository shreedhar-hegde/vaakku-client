import { Link } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { ROUTES } from '../constants/routes';

const SARVAM_DASHBOARD = 'https://dashboard.sarvam.ai/';

export default function Learn() {
  const { t } = useLocale();

  return (
    <div className="py-6">
      <h1 className="mb-2 text-xl font-bold md:text-2xl" style={{ color: 'var(--color-text)' }}>
        {t('learn.title')}
      </h1>
      <p className="mb-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
        {t('learn.subtitle')}
      </p>

      <div className="mb-6 rounded-lg border p-4 md:p-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <h2 className="mb-2 font-semibold" style={{ color: 'var(--color-text)' }}>
          {t('learn.tryWithoutSignupTitle') || 'Try without signing up'}
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {t('learn.tryWithoutSignupBody') || "You can try each tool a few times with no account: 3 Text-to-Speech tries, 2 Speech-to-Text tries, and 3 Translation tries. Sign up for full access, 1,000 free credits, history, and the option to use your own Sarvam API key."}
        </p>
      </div>

      <div className="mb-6 rounded-lg border p-4 md:p-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <h2 className="mb-2 font-semibold" style={{ color: 'var(--color-text)' }}>
          {t('learn.whatTitle')}
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {t('learn.whatBody')}
        </p>
      </div>

      <h2 className="mb-3 font-semibold" style={{ color: 'var(--color-text)' }}>
        {t('learn.twoWaysTitle')}
      </h2>

      <div className="mb-4 rounded-lg border p-4 md:p-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <h3 className="mb-2 font-semibold" style={{ color: 'var(--color-accent)' }}>
          {t('learn.option1Title')}
        </h3>
        <p className="mb-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {t('learn.option1Body')}
        </p>
        <p className="mb-2 text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          {t('learn.option1HowTo')}
        </p>
        <ul className="mb-3 list-none space-y-1 pl-0 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          <li className="flex items-start gap-2">
            <span style={{ color: 'var(--color-accent)' }}>✓</span>
            {t('learn.step1')} <a href={SARVAM_DASHBOARD} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-accent)' }}>dashboard.sarvam.ai</a>
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: 'var(--color-accent)' }}>✓</span>
            {t('learn.step2')}
          </li>
          <li className="flex items-start gap-2">
            <span style={{ color: 'var(--color-accent)' }}>✓</span>
            {t('learn.step3')}
          </li>
        </ul>
        <Link
          to={ROUTES.SETTINGS}
          className="inline-block rounded border py-2 px-3 text-sm font-medium"
          style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)', textDecoration: 'none' }}
        >
          {t('learn.goToSettings')}
        </Link>
      </div>

      <div className="mb-6 rounded-lg border p-4 md:p-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <h3 className="mb-2 font-semibold" style={{ color: 'var(--color-accent)' }}>
          {t('learn.option2Title')}
        </h3>
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          {t('learn.option2Body')}
        </p>
      </div>

      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        {t('learn.balanceNote')}{' '}
        <a href="https://docs.sarvam.ai/" target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-accent)' }}>
          {t('learn.sarvamDocs')}
        </a>.
      </p>
    </div>
  );
}
