import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ai } from '../api/axios';
import { useUser } from '../context/UserContext';
import { useLocale } from '../context/LocaleContext';
import {
  ANON_LIMITS,
  getAnonymousRemaining,
  incrementAnonymousUsage,
  setAnonymousUsageAtLimit,
} from '../utils/anonymousUsage';
import { ROUTES } from '../constants/routes';

const MODES = [
  { value: 'transcribe', label: 'Transcribe (same language)' },
  { value: 'translate', label: 'Translate to English' },
  { value: 'translit', label: 'Transliterate (Roman script)' },
  { value: 'codemix', label: 'Code-mixed' },
];

function UploadIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  );
}

function MicIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" y1="19" x2="12" y2="23" />
      <line x1="8" y1="23" x2="16" y2="23" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="6" y="6" width="12" height="12" />
    </svg>
  );
}

export default function STT() {
  const { user, refreshUser } = useUser();
  const { t } = useLocale();
  const [tab, setTab] = useState(1);
  const isAnonymous = !user;
  const anonRemaining = getAnonymousRemaining('stt');
  const anonLimitReached = isAnonymous && anonRemaining <= 0;
  const [mode, setMode] = useState('transcribe');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordDuration, setRecordDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setResult(null);
    setError('');
  };

  const startRecording = async () => {
    setError('');
    setResult(null);
    setRecordedBlob(null);
    setRecordDuration(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((tr) => tr.stop());
        if (chunksRef.current.length) {
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          setRecordedBlob(blob);
        }
        setRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };
      recorder.start(200);
      mediaRecorderRef.current = recorder;
      setRecording(true);
      timerRef.current = setInterval(() => setRecordDuration((d) => d + 1), 1000);
    } catch (err) {
      setError('Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const submitFile = async (audioFile) => {
    if (!audioFile) return;
    if (isAnonymous && anonLimitReached) return;
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', audioFile);
      form.append('mode', mode);
      const { data } = await ai.stt(form);
      setResult({ transcript: data.transcript, language_code: data.language_code });
      if (isAnonymous) incrementAnonymousUsage('stt');
      else await refreshUser();
    } catch (err) {
      const res = err.response?.data;
      if (res?.code === 'ANONYMOUS_LIMIT_REACHED') setAnonymousUsageAtLimit('stt');
      setError(res?.error || err.response?.data?.message || err.message || 'STT failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUpload = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an audio file (WAV, MP3, etc.)');
      return;
    }
    submitFile(file);
  };

  const handleSubmitRecorded = () => {
    if (!recordedBlob) return;
    const ext = recordedBlob.type.includes('webm') ? 'webm' : 'audio';
    const audioFile = new File([recordedBlob], `recording.${ext}`, { type: recordedBlob.type });
    submitFile(audioFile);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  const isEmpty = !result && !file && !recordedBlob && !recording;

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
              : t('anonymous.sttTriesLeft')
                  .replace('{{remaining}}', anonRemaining)
                  .replace('{{limit}}', ANON_LIMITS.stt)}
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

      <div
        className="border p-4 md:p-6"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
      >
        <div className="mb-4 flex overflow-x-auto border-b gap-0" style={{ borderColor: 'var(--color-border)' }}>
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              className="shrink-0 border-b-2 px-3 py-2 text-sm transition-colors duration-150"
              style={{
                borderBottomColor: mode === m.value ? 'var(--color-accent)' : 'transparent',
                color: mode === m.value ? 'var(--color-accent)' : 'var(--color-text-muted)',
                fontWeight: mode === m.value ? 600 : 400,
                backgroundColor: 'transparent',
              }}
            >
              {m.label}
            </button>
          ))}
        </div>

        <div className="mb-4 flex gap-0 border-b" style={{ borderColor: 'var(--color-border)' }}>
          <button
            type="button"
            onClick={() => setTab(0)}
            className="border-b-2 px-4 py-2 text-sm transition-colors duration-150"
            style={{
              borderBottomColor: tab === 0 ? 'var(--color-accent)' : 'transparent',
              color: tab === 0 ? 'var(--color-accent)' : 'var(--color-text-muted)',
              fontWeight: tab === 0 ? 600 : 400,
              backgroundColor: 'transparent',
            }}
          >
            Upload file
          </button>
          <button
            type="button"
            onClick={() => setTab(1)}
            className="border-b-2 px-4 py-2 text-sm transition-colors duration-150"
            style={{
              borderBottomColor: tab === 1 ? 'var(--color-accent)' : 'transparent',
              color: tab === 1 ? 'var(--color-accent)' : 'var(--color-text-muted)',
              fontWeight: tab === 1 ? 600 : 400,
              backgroundColor: 'transparent',
            }}
          >
            Record
          </button>
        </div>

        {tab === 0 && (
          <form onSubmit={handleSubmitUpload} className="space-y-4">
            <label
              className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded border-2 border-dashed py-6 px-4 transition-colors duration-150"
              style={{ borderColor: 'var(--color-border)' }}
            >
              <UploadIcon />
              <span className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                {file ? file.name : 'Choose audio file (WAV, MP3, etc.)'}
              </span>
              <input
                type="file"
                className="hidden"
                accept="audio/*,.wav,.mp3,.m4a,.ogg,.flac"
                onChange={handleFileChange}
              />
            </label>
            <button
              type="submit"
              disabled={loading || !file || (isAnonymous && anonLimitReached)}
              className="w-full py-2.5 text-sm font-medium text-white transition-opacity duration-150 disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              {loading ? 'Transcribing…' : 'Transcribe'}
            </button>
          </form>
        )}

        {tab === 1 && (
          <div className="flex flex-col items-center">
            {!recording && !recordedBlob && (
              <>
                {isEmpty && (
                  <div className="mb-8 text-center">
                    <span
                      className="text-[100px] leading-none"
                      style={{ opacity: 0.04, fontFamily: 'var(--font-body)' }}
                      aria-hidden
                    >
                      ஆ
                    </span>
                    <p className="mt-2 font-semibold" style={{ color: 'var(--color-text)' }}>
                      Speech to Text
                    </p>
                    <p className="mt-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                      Record or upload audio to get a transcript.
                    </p>
                  </div>
                )}
                <button
                  type="button"
                  onClick={startRecording}
                  className="flex h-24 w-24 items-center justify-center rounded-full text-white transition-opacity duration-150 hover:opacity-90"
                  style={{ backgroundColor: '#f59e0b' }}
                  aria-label="Start recording"
                >
                  <MicIcon />
                </button>
                <span className="mt-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Start recording
                </span>
              </>
            )}
            {recording && (
              <div className="flex w-full flex-col items-center gap-4">
                <button
                  type="button"
                  onClick={stopRecording}
                  className="stt-record-active flex h-24 w-24 items-center justify-center rounded-full border-4 text-white"
                  style={{
                    backgroundColor: '#dc2626',
                    borderColor: 'rgba(220, 38, 38, 0.5)',
                  }}
                  aria-label="Stop recording"
                >
                  <StopIcon />
                </button>
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>
                  {formatTime(recordDuration)}
                </p>
                <button
                  type="button"
                  onClick={stopRecording}
                  className="rounded border py-2 px-4 text-sm font-medium"
                  style={{ borderColor: '#dc2626', color: '#dc2626' }}
                >
                  Stop
                </button>
              </div>
            )}
            {recordedBlob && !recording && (
              <div className="w-full space-y-3">
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Recorded audio. Play back or transcribe.
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <audio controls src={URL.createObjectURL(recordedBlob)} className="max-h-10 max-w-full flex-1" />
                  <button
                    type="button"
                    onClick={() => {
                      setRecordedBlob(null);
                      setRecordDuration(0);
                    }}
                    className="rounded border py-1.5 px-3 text-sm"
                    style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
                  >
                    Record again
                  </button>
                  <button
                    type="button"
                    onClick={handleSubmitRecorded}
                    disabled={loading || (isAnonymous && anonLimitReached)}
                    className="rounded py-1.5 px-3 text-sm font-medium text-white transition-opacity duration-150 disabled:opacity-50"
                    style={{ backgroundColor: 'var(--color-accent)' }}
                  >
                    {loading ? 'Transcribing…' : 'Transcribe'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {result && (
          <div
            className="content-indic mt-6 rounded-lg border p-4"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-bg)', lineHeight: 1.9, fontFamily: 'var(--font-body)' }}
          >
            {result.language_code && (
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                Language: {result.language_code}
              </p>
            )}
            <p className="mt-2 whitespace-pre-wrap">
              {result.transcript || '—'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
