import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ai } from '../api/axios';
import { useUser } from '../context/UserContext';
import { useLocale } from '../context/LocaleContext';
import {
  ANON_LIMITS,
  ANON_MAX_CHARS,
  getAnonymousRemaining,
  incrementAnonymousUsage,
  setAnonymousUsageAtLimit,
} from '../utils/anonymousUsage';
import { ROUTES } from '../constants/routes';
import { LANGUAGES_WITH_AUTO, LANGUAGES_TARGET } from '../constants/languages';

function LangTabRow({ value, onChange, options, 'aria-label': ariaLabel }) {
  return (
    <div
      role="tablist"
      className="flex overflow-x-auto border-b py-1"
      style={{ borderColor: 'var(--color-border)' }}
      aria-label={ariaLabel}
    >
      {options.map((opt) => {
        const isSelected = value === opt.value;
        return (
          <button
            key={opt.value}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange(opt.value)}
            className="translate-lang-tab shrink-0 border-b-2 px-3 py-2 text-sm transition-colors duration-150"
            style={{
              borderBottomColor: isSelected ? 'var(--color-accent)' : 'transparent',
              color: isSelected ? 'var(--color-accent)' : 'var(--color-text-muted)',
              backgroundColor: 'transparent',
            }}
          >
            {opt.label}
            {opt.native ? ` ${opt.native}` : ''}
          </button>
        );
      })}
    </div>
  );
}

export default function Translate() {
  const { user, refreshUser } = useUser();
  const { t } = useLocale();
  const [input, setInput] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('hi-IN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [translated, setTranslated] = useState('');

  const isAnonymous = !user;
  const maxChars = isAnonymous ? ANON_MAX_CHARS.translate : 1000;
  const anonRemaining = getAnonymousRemaining('translate');
  const anonLimitReached = isAnonymous && anonRemaining <= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTranslated('');
    if (!input.trim()) return;
    if (isAnonymous && anonLimitReached) return;
    setLoading(true);
    try {
      const { data } = await ai.translate({
        input: input.trim().slice(0, maxChars),
        source_language_code: sourceLang,
        target_language_code: targetLang,
      });
      setTranslated(data.translated_text ?? data.translation ?? '');
      if (isAnonymous) incrementAnonymousUsage('translate');
      else await refreshUser();
    } catch (err) {
      const res = err.response?.data;
      if (res?.code === 'ANONYMOUS_LIMIT_REACHED') setAnonymousUsageAtLimit('translate');
      setError(res?.error || err.response?.data?.message || err.message || 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  const hasInput = input.trim().length > 0;
  const hasOutput = translated.length > 0;

  return (
    <div className="py-6">
      {isAnonymous && (
        <div
          className="mb-4 flex flex-wrap items-center gap-2 rounded border py-2 px-3 text-sm"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          <span style={{ color: 'var(--color-text)' }}>
            {anonLimitReached
              ? t('anonymous.limitReached')
              : t('anonymous.translateTriesLeft')
                  .replace('{{remaining}}', anonRemaining)
                  .replace('{{limit}}', ANON_LIMITS.translate)}
          </span>
          <Link
            to={ROUTES.SIGNUP}
            className="font-medium underline transition-opacity duration-150 hover:opacity-90"
            style={{ color: 'var(--color-accent)' }}
          >
            {t('anonymous.signUpForMore')}
          </Link>
        </div>
      )}

      {error && (
        <div
          className="mb-4 flex items-center justify-between rounded border py-2 px-3 text-sm"
          style={{ borderColor: '#dc2626', backgroundColor: '#fef2f2', color: '#b91c1c' }}
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => setError('')}
            className="shrink-0 pl-2 underline"
            aria-label="Dismiss"
          >
            Dismiss
          </button>
        </div>
      )}

      <div className="flex min-h-[420px] flex-col border md:flex-row" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        {/* Left panel: input */}
        <div className="flex flex-1 flex-col md:min-w-0">
          <LangTabRow
            value={sourceLang}
            onChange={setSourceLang}
            options={LANGUAGES_WITH_AUTO}
            aria-label="Source language"
          />
          <form onSubmit={handleSubmit} className="flex flex-1 flex-col p-3">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={maxChars}
              placeholder="Enter text to translate..."
              className="min-h-[200px] flex-1 resize-none border-0 bg-transparent p-0 text-base outline-none placeholder:opacity-60"
              style={{
                color: 'var(--color-text)',
                fontFamily: 'var(--font-body)',
                lineHeight: 1.85,
              }}
              aria-label="Text to translate"
            />
            <div className="mt-2 flex justify-end">
              <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {input.length}/{maxChars}
              </span>
            </div>
            {hasInput && (
              <button
                type="submit"
                disabled={loading || (isAnonymous && anonLimitReached)}
                className="mt-3 w-full rounded-lg py-2.5 text-sm font-medium text-white transition-opacity duration-150 disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                {loading ? 'Translating…' : 'Translate'}
              </button>
            )}
          </form>
        </div>

        <div className="hidden shrink-0 md:block md:w-px" style={{ backgroundColor: 'var(--color-border)' }} aria-hidden />

        {/* Right panel: output */}
        <div className="flex min-h-[200px] flex-1 flex-col border-t md:min-w-0 md:border-t-0" style={{ borderColor: 'var(--color-border)' }}>
          <LangTabRow
            value={targetLang}
            onChange={setTargetLang}
            options={LANGUAGES_TARGET}
            aria-label="Target language"
          />
          <div className="content-indic relative flex-1 whitespace-pre-wrap p-3" style={{ minHeight: 160 }}>
            {hasOutput ? (
              translated
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <span
                  className="mb-3 text-[100px] leading-none"
                  style={{ opacity: 0.04, fontFamily: 'var(--font-body)' }}
                  aria-hidden
                >
                  క
                </span>
                <p className="text-center font-semibold" style={{ color: 'var(--color-text)' }}>
                  Translation
                </p>
                <p className="mt-1 max-w-xs text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Enter text and click Translate. Result appears here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
