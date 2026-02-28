import { useState } from 'react';
import { useUser } from '../context/UserContext';
import { userApi } from '../api/axios';

const SARVAM_DASHBOARD = 'https://dashboard.sarvam.ai/';

export default function Settings() {
  const { user, refreshUser } = useUser();
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);
    try {
      await userApi.updateSarvamApiKey(key.trim());
      setKey('');
      await refreshUser();
      setMessage({ type: 'success', text: 'API key saved. Your usage will be billed to your Sarvam account.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save key' });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setMessage({ type: '', text: '' });
    setLoading(true);
    try {
      await userApi.updateSarvamApiKey('');
      await refreshUser();
      setMessage({ type: 'success', text: 'API key removed. The app will use shared credits when you have no key.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to remove key' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-6">
      <h1 className="mb-1 text-xl font-semibold md:text-2xl" style={{ color: 'var(--color-text)' }}>
        Settings
      </h1>
      <p className="mb-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Manage your Sarvam AI API key. Optional: add your own key to use your Sarvam credits; otherwise the app uses shared credits.
      </p>

      {message.text && (
        <div
          className="mb-4 flex items-center justify-between rounded border py-2 px-3 text-sm"
          style={{
            borderColor: message.type === 'error' ? '#dc2626' : 'var(--color-border)',
            backgroundColor: message.type === 'error' ? '#fef2f2' : 'var(--color-surface)',
            color: message.type === 'error' ? '#b91c1c' : 'var(--color-text)',
          }}
        >
          <span>{message.text}</span>
          <button type="button" onClick={() => setMessage({ type: '', text: '' })} className="shrink-0 pl-2 underline" aria-label="Dismiss">
            Dismiss
          </button>
        </div>
      )}

      <div className="rounded border p-4 md:p-6" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <h2 className="mb-2 text-sm font-semibold" style={{ color: 'var(--color-text)' }}>
          Sarvam API key
        </h2>
        {user?.hasSarvamKey && (
          <p className="mb-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            You have an API key set. Usage is billed to your Sarvam account. Add a new key below to replace it, or clear to use shared credits.
          </p>
        )}
        <p className="mb-3 text-sm" style={{ color: 'var(--color-text-muted)' }}>
          Create a key at the{' '}
          <a href={SARVAM_DASHBOARD} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-accent)' }}>
            Sarvam Dashboard
          </a>
          , then paste it here. Your key is stored encrypted and only used for your requests.
        </p>
        <form onSubmit={handleSave}>
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Paste your api-subscription-key"
            className="mb-3 w-full rounded border py-2 px-3 text-sm"
            style={{ borderColor: 'var(--color-border)' }}
            autoComplete="off"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading || !key.trim()}
              className="rounded py-2 px-3 text-sm font-medium text-white transition-opacity duration-150 disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              {loading ? 'Saving…' : 'Save key'}
            </button>
            {user?.hasSarvamKey && (
              <button
                type="button"
                onClick={handleClear}
                disabled={loading}
                className="rounded border py-2 px-3 text-sm"
                style={{ borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
              >
                Remove key
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
