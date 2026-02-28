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

const SPEAKERS = [
  'shubh', 'aditya', 'ritu', 'priya', 'neha', 'rahul', 'pooja', 'rohan', 'simran', 'kavya',
  'amit', 'dev', 'ishita', 'shreya', 'ratan', 'varun', 'anand', 'tanya', 'tarun',
];

const SPEAKER_GENDER = {
  shubh: 'm', aditya: 'm', ritu: 'f', priya: 'f', neha: 'f', rahul: 'm', pooja: 'f', rohan: 'm',
  simran: 'f', kavya: 'f', amit: 'm', dev: 'm', ishita: 'f', shreya: 'f', ratan: 'm', varun: 'm',
  anand: 'm', tanya: 'f', tarun: 'm',
};

const SPEAKER_LANGUAGE = {
  shubh: 'Hindi', aditya: 'Hindi', ritu: 'Hindi', priya: 'Hindi', neha: 'Hindi',
  rahul: 'Tamil', pooja: 'Tamil', rohan: 'Tamil', simran: 'Tamil', kavya: 'Tamil',
  amit: 'Kannada', dev: 'Kannada', ishita: 'Kannada', shreya: 'Kannada', ratan: 'Kannada',
  varun: 'Telugu', anand: 'Telugu', tanya: 'Telugu', tarun: 'Telugu',
};

const VOICE_FILTER_OPTIONS = ['All', 'Hindi', 'Tamil', 'Kannada', 'Telugu'];

const FILTER_TO_LANG_CODE = { Hindi: 'hi-IN', Tamil: 'ta-IN', Kannada: 'kn-IN', Telugu: 'te-IN' };

export default function TTS() {
  const { user, refreshUser } = useUser();
  const { t } = useLocale();
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('hi-IN');
  const [speaker, setSpeaker] = useState('shubh');
  const [voiceFilter, setVoiceFilter] = useState('All');
  const [pace, setPace] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);

  const filteredSpeakers =
    voiceFilter === 'All'
      ? SPEAKERS
      : SPEAKERS.filter((s) => SPEAKER_LANGUAGE[s] === voiceFilter);
  const handleVoiceFilter = (option) => {
    setVoiceFilter(option);
    if (option !== 'All') {
      setTargetLang(FILTER_TO_LANG_CODE[option]);
      const next = SPEAKERS.filter((s) => SPEAKER_LANGUAGE[s] === option);
      if (next.length && !next.includes(speaker)) setSpeaker(next[0]);
    }
  };

  const isAnonymous = !user;
  const maxChars = isAnonymous ? ANON_MAX_CHARS.tts : 2500;
  const anonRemaining = getAnonymousRemaining('tts');
  const anonLimitReached = isAnonymous && anonRemaining <= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAudioUrl(null);
    if (!text.trim()) return;
    if (isAnonymous && anonLimitReached) return;
    setLoading(true);
    try {
      const { data } = await ai.tts({
        text: text.trim().slice(0, maxChars),
        target_language_code: targetLang,
        speaker,
        model: 'bulbul:v3',
        pace,
      });
      const base64 = data.audios?.[0];
      if (base64) {
        setAudioUrl(`data:audio/wav;base64,${base64}`);
        if (isAnonymous) incrementAnonymousUsage('tts');
        else await refreshUser();
      } else {
        setError('No audio returned');
      }
    } catch (err) {
      const res = err.response?.data;
      if (res?.code === 'ANONYMOUS_LIMIT_REACHED') setAnonymousUsageAtLimit('tts');
      setError(res?.error || err.response?.data?.message || err.message || 'TTS failed');
    } finally {
      setLoading(false);
    }
  };

  const progressRatio = maxChars ? Math.min(text.length / maxChars, 1) : 0;
  const progressColor = progressRatio >= 1 ? '#dc2626' : progressRatio >= 0.85 ? '#f59e0b' : '#22c55e';

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
              : t('anonymous.ttsTriesLeft')
                  .replace('{{remaining}}', anonRemaining)
                  .replace('{{limit}}', ANON_LIMITS.tts)}
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
          <button type="button" onClick={() => setError('')} className="shrink-0 pl-2 underline" aria-label="Dismiss">
            Dismiss
          </button>
        </div>
      )}

      <div className="mx-auto max-w-[1000px]">
        <h1 className="text-[22px] font-semibold" style={{ color: 'var(--color-text)' }}>
          Text to Speech
        </h1>
        <p className="mt-0.5 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Convert text to natural Indian voices
        </p>

        <div
          className="mt-4 flex min-h-[420px] flex-col border md:flex-row"
          style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
        >
          {/* Left panel: input */}
          <div className="flex flex-1 flex-col md:min-w-0">
            <form onSubmit={handleSubmit} className="flex flex-1 flex-col p-3">
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                maxLength={maxChars}
                placeholder="Type or paste text to convert to speech..."
                className="min-h-[160px] flex-1 resize-none border-0 bg-transparent p-0 text-base outline-none placeholder:opacity-60"
                style={{
                  color: 'var(--color-text)',
                  fontFamily: 'var(--font-body)',
                  lineHeight: 1.85,
                }}
                aria-label="Text for speech"
              />
              <div className="mt-2 flex justify-end">
                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {text.length}/{maxChars}
                </span>
              </div>
              <div className="tts-char-progress mt-1 h-1 w-full overflow-hidden rounded-full bg-opacity-30" style={{ backgroundColor: 'var(--color-border)' }}>
                <div
                  className="h-full rounded-full transition-all duration-200"
                  style={{ width: `${progressRatio * 100}%`, backgroundColor: progressColor }}
                />
              </div>

              <p className="mt-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Voice
              </p>
              <div className="mt-1 flex flex-wrap items-center gap-x-1 gap-y-0.5 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                <span>Filter voices:</span>
                {VOICE_FILTER_OPTIONS.map((opt) => (
                  <span key={opt}>
                    <button
                      type="button"
                      onClick={() => handleVoiceFilter(opt)}
                      className="inline rounded px-0.5 py-0.5 font-medium transition-colors hover:underline"
                      style={{
                        color: voiceFilter === opt ? 'var(--color-accent)' : 'var(--color-text-muted)',
                      }}
                    >
                      {opt}
                    </button>
                    {opt !== VOICE_FILTER_OPTIONS[VOICE_FILTER_OPTIONS.length - 1] && <span className="px-0.5" aria-hidden>·</span>}
                  </span>
                ))}
              </div>
              <div className="relative mt-2 border-b pb-3" style={{ borderColor: 'var(--color-border)' }}>
                <div className="tts-voice-fade tts-voice-fade-left" aria-hidden />
                <div className="tts-voice-fade tts-voice-fade-right" aria-hidden />
                <div className="tts-voice-row flex flex-nowrap gap-2 overflow-x-auto py-1" role="group" aria-label="Voice">
                {filteredSpeakers.map((s) => {
                  const isSelected = speaker === s;
                  const gender = SPEAKER_GENDER[s] || 'm';
                  const lang = SPEAKER_LANGUAGE[s] || '';
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSpeaker(s)}
                      title={`${s.charAt(0).toUpperCase() + s.slice(1)} (${lang})`}
                      className="tts-voice-pill shrink-0 rounded-full px-3 py-1.5 text-sm capitalize transition-colors duration-150"
                      style={{
                        backgroundColor: isSelected ? 'var(--color-accent)' : 'transparent',
                        color: isSelected ? 'var(--color-surface)' : 'var(--color-text-muted)',
                        border: `1px solid ${isSelected ? 'var(--color-accent)' : 'var(--color-border)'}`,
                      }}
                    >
                      <span
                        className="mr-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full"
                        style={{ backgroundColor: gender === 'f' ? '#ec4899' : 'var(--color-accent)' }}
                        aria-hidden
                      />
                      {s}
                    </button>
                  );
                })}
              </div>
              </div>

              <div className="mt-3">
                <label className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Pace: {Number(pace).toFixed(1)}x
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2"
                  step="0.1"
                  value={pace}
                  onChange={(e) => setPace(Number(e.target.value))}
                  className="tts-pace-slider mt-1 w-full"
                  style={{ accentColor: 'var(--color-accent)' }}
                />
                <div className="mt-0.5 flex justify-between text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  <span>0.5x</span>
                  <span>1x</span>
                  <span>2x</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !text.trim() || (isAnonymous && anonLimitReached)}
                className="mt-4 w-full rounded-lg py-2.5 text-sm font-medium text-white transition-opacity duration-150 disabled:opacity-50"
                style={{ backgroundColor: 'var(--color-accent)' }}
              >
                {loading ? 'Generating…' : 'Generate speech'}
              </button>
            </form>
          </div>

          <div className="w-px shrink-0" style={{ backgroundColor: 'var(--color-border)' }} />

          {/* Right panel: output */}
          <div className="flex min-h-[200px] flex-1 flex-col md:min-w-0">
            <div
              className="border-b px-3 py-2 text-sm"
              style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
            >
              Output
            </div>
            <div className="flex flex-1 flex-col items-center justify-center p-4" style={{ minHeight: 200 }}>
              {audioUrl ? (
                <div className="flex w-full flex-col items-center gap-2">
                  <div className="flex w-full items-center gap-2">
                    <audio controls src={audioUrl} className="h-10 flex-1 max-w-full" />
                    <a
                      href={audioUrl}
                      download="vaakku-tts.wav"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded border transition-opacity duration-150 hover:opacity-90"
                      style={{ borderColor: 'var(--color-border)' }}
                      aria-label="Download"
                      title="Download"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                    </a>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ color: 'var(--color-text-muted)', opacity: 0.6 }} aria-hidden>
                    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                    <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
                  </svg>
                  <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    Your audio will appear here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
