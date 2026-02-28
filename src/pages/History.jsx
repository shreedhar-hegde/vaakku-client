import { useState, useEffect } from 'react';
import { historyApi, ai } from '../api/axios';

const TYPE_LABELS = { tts: 'Text to Speech', stt: 'Speech to Text', translate: 'Translate' };
const DEFAULT_TTS_LANG = 'en-IN';

function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

function getOutputText(entry) {
  if (entry.type === 'stt' || entry.type === 'translate') return entry.output || '';
  if (entry.type === 'tts') return entry.input ? `Generated audio (${entry.target_language_code || '—'})` : '';
  return '';
}

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [playAudioUrl, setPlayAudioUrl] = useState(null);
  const [playLoadingId, setPlayLoadingId] = useState(null);
  const [playError, setPlayError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = typeFilter ? { type: typeFilter } : {};
    historyApi
      .getList(params)
      .then((res) => setItems(res.data?.items ?? []))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load history'))
      .finally(() => setLoading(false));
  }, [typeFilter]);

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
  };

  const handlePlay = async (entry) => {
    setPlayError(null);
    const textToSpeak = entry.type === 'tts' ? (entry.input || '') : entry.type === 'stt' ? (entry.output || '') : '';
    if (!textToSpeak.trim()) return;
    const lang = entry.type === 'tts' ? (entry.target_language_code || DEFAULT_TTS_LANG) : DEFAULT_TTS_LANG;
    setPlayLoadingId(entry._id);
    try {
      const { data } = await ai.tts({
        text: textToSpeak.trim(),
        target_language_code: lang,
        speaker: 'shubh',
        model: 'bulbul:v3',
      });
      const base64 = data?.audios?.[0];
      if (base64) {
        setPlayAudioUrl(`data:audio/wav;base64,${base64}`);
        setPlayingId(entry._id);
      } else setPlayError('No audio returned');
    } catch (err) {
      setPlayError(err.response?.data?.error || err.response?.data?.message || err.message || 'Play failed');
    } finally {
      setPlayLoadingId(null);
    }
  };

  const handlePlayEnded = () => {
    setPlayingId(null);
    setPlayAudioUrl(null);
  };

  return (
    <div className="py-6">
      <h1 className="mb-1 text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
        History
      </h1>
      <p className="mb-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Past TTS, STT, and translation results. Copy output to reuse.
      </p>
      <div
        className="mb-4 flex items-center gap-2 rounded border py-2 px-3 text-sm"
        style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)', color: 'var(--color-text-muted)' }}
      >
        History is limited to the 10 most recent entries. Older entries are removed automatically.
      </div>

      <select
        value={typeFilter}
        onChange={(e) => setTypeFilter(e.target.value)}
        className="mb-4 rounded border py-1.5 pl-2 pr-8 text-sm"
        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
        aria-label="Filter by type"
      >
        <option value="">All</option>
        <option value="tts">Text to Speech</option>
        <option value="stt">Speech to Text</option>
        <option value="translate">Translate</option>
      </select>

      {error && (
        <div className="mb-4 rounded border py-2 px-3 text-sm" style={{ borderColor: '#dc2626', backgroundColor: '#fef2f2', color: '#b91c1c' }}>
          {error}
        </div>
      )}
      {playError && (
        <div className="mb-4 flex items-center justify-between rounded border py-2 px-3 text-sm" style={{ borderColor: '#dc2626', backgroundColor: '#fef2f2', color: '#b91c1c' }}>
          <span>{playError}</span>
          <button type="button" onClick={() => setPlayError(null)} className="underline">Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="py-8 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Loading…
        </div>
      ) : items.length === 0 ? (
        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
          No history yet. Use TTS, STT, or Translate to see entries here.
        </p>
      ) : (
        <div className="rounded-lg border overflow-hidden" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          {items.map((entry) => {
            const outputText = getOutputText(entry);
            const hasCopy = outputText && entry.type !== 'tts';
            const canPlay =
              (entry.type === 'tts' && (entry.input || '').trim()) ||
              (entry.type === 'stt' && (entry.output || '').trim());
            const isPlaying = playingId === entry._id;
            const isPlayLoading = playLoadingId === entry._id;
            return (
              <div
                key={entry._id}
                className="border-b p-3 last:border-b-0"
                style={{ borderColor: 'var(--color-border)' }}
              >
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className="rounded border px-2 py-0.5 text-xs font-medium"
                    style={{ borderColor: 'var(--color-accent)', color: 'var(--color-accent)' }}
                  >
                    {TYPE_LABELS[entry.type] || entry.type}
                  </span>
                  <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                    {formatDate(entry.createdAt)}
                  </span>
                  {canPlay && (
                    <button
                      type="button"
                      onClick={() => handlePlay(entry)}
                      disabled={!!playLoadingId}
                      className="rounded p-1 transition-opacity hover:opacity-80 disabled:opacity-50"
                      style={{ color: 'var(--color-accent)' }}
                      aria-label="Play"
                      title={entry.type === 'tts' ? 'Play again' : 'Read aloud'}
                    >
                      {isPlayLoading ? '…' : '▶'}
                    </button>
                  )}
                </div>
                {entry.input && (
                  <p className="mb-1 truncate text-sm" style={{ color: 'var(--color-text-muted)' }} title={entry.input}>
                    In: {entry.input}
                  </p>
                )}
                {outputText && (
                  <div className="flex items-start gap-2">
                    <p className="min-w-0 flex-1 break-words text-sm" style={{ color: 'var(--color-text)' }}>
                      {outputText}
                    </p>
                    {hasCopy && (
                      <button
                        type="button"
                        onClick={() => handleCopy(outputText)}
                        className="shrink-0 rounded p-1 hover:opacity-80"
                        style={{ color: 'var(--color-text-muted)' }}
                        title="Copy"
                        aria-label="Copy"
                      >
                        Copy
                      </button>
                    )}
                  </div>
                )}
                {isPlaying && playAudioUrl && (
                  <audio
                    key={entry._id}
                    src={playAudioUrl}
                    controls
                    autoPlay
                    onEnded={handlePlayEnded}
                    className="mt-2 max-w-full"
                    style={{ maxWidth: 320 }}
                  />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
