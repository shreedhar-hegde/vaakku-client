import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as Dialog from '@radix-ui/react-dialog';
import * as Tabs from '@radix-ui/react-tabs';
import { useLocale } from '../context/LocaleContext';
import { useUser } from '../context/UserContext';
import { ROUTES } from '../constants/routes';
import { userApi } from '../api/axios';

const SARVAM_DASHBOARD = 'https://dashboard.sarvam.ai/';

export default function Topbar() {
  const navigate = useNavigate();
  const { t } = useLocale();
  const { user, refreshUser } = useUser();
  const hasApiKey = user?.hasSarvamKey;
  const credits = user?.credits ?? null;
  const [dialogOpen, setDialogOpen] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [keyLoading, setKeyLoading] = useState(false);
  const [keyMessage, setKeyMessage] = useState({ type: '', text: '' });

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate(ROUTES.LOGIN);
  };

  const handleSaveKey = async (e) => {
    e.preventDefault();
    setKeyMessage({ type: '', text: '' });
    setKeyLoading(true);
    try {
      await userApi.updateSarvamApiKey(apiKeyInput.trim());
      setApiKeyInput('');
      await refreshUser();
      setKeyMessage({ type: 'success', text: 'API key saved. Your usage will be billed to your Sarvam account.' });
    } catch (err) {
      setKeyMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save key' });
    } finally {
      setKeyLoading(false);
    }
  };

  const handleClearKey = async () => {
    setKeyMessage({ type: '', text: '' });
    setKeyLoading(true);
    try {
      await userApi.updateSarvamApiKey('');
      await refreshUser();
      setKeyMessage({ type: 'success', text: 'API key removed. The app will use shared credits.' });
    } catch (err) {
      setKeyMessage({ type: 'error', text: err.response?.data?.error || 'Failed to remove key' });
    } finally {
      setKeyLoading(false);
    }
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-20 flex h-14 items-center justify-between border-b px-4 md:px-6"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <Link
        to={ROUTES.LANDING}
        className="text-lg font-bold tracking-tight"
        style={{ color: 'var(--color-accent)', textDecoration: 'none', fontFamily: 'var(--font-display)' }}
      >
        {t('nav.brand')}
      </Link>

      <div className="flex items-center gap-2">
        <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors duration-150 hover:border-[var(--color-accent)]"
              style={{
                borderColor: 'var(--color-border)',
                backgroundColor: 'var(--color-surface)',
                color: 'var(--color-text-muted)',
              }}
              aria-label="Credits or API key status"
            >
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor: hasApiKey ? '#22c55e' : credits !== null && credits < 10 ? '#f59e0b' : '#eab308',
                  animation: !hasApiKey && credits !== null && credits < 10 ? 'pulse 1.5s ease-in-out infinite' : undefined,
                }}
              />
              {hasApiKey ? (
                <span>API Key Active</span>
              ) : credits !== null ? (
                <span>Shared Credits: {credits}</span>
              ) : (
                <span>Shared Credits</span>
              )}
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay
              className="fixed inset-0 bg-black/30"
              style={{ animation: 'fadeIn 150ms ease' }}
            />
            <Dialog.Content
              className="fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border p-4"
              style={{
                backgroundColor: 'var(--color-surface)',
                borderColor: 'var(--color-border)',
              }}
              onPointerDownOutside={() => setDialogOpen(false)}
            >
              <Dialog.Title className="sr-only">Credits and API key</Dialog.Title>
              <Tabs.Root defaultValue={hasApiKey ? 'api-key' : 'credits'}>
                <Tabs.List className="credits-api-tabs mb-4 flex gap-0 border-b" style={{ borderColor: 'var(--color-border)' }}>
                  <Tabs.Trigger
                    value="credits"
                    className="credits-api-tab border-b-2 px-4 py-2 text-sm transition-colors duration-150"
                  >
                    Use Shared Credits
                  </Tabs.Trigger>
                  <Tabs.Trigger
                    value="api-key"
                    className="credits-api-tab border-b-2 px-4 py-2 text-sm transition-colors duration-150"
                  >
                    Use My API Key
                  </Tabs.Trigger>
                </Tabs.List>
                <Tabs.Content value="credits" className="text-sm" style={{ color: 'var(--color-text)' }}>
                  <p>Use the app with shared credits. Sign up for an account to get 1,000 free credits.</p>
                  {!user && (
                    <Link to={ROUTES.SIGNUP} className="mt-3 inline-block font-medium" style={{ color: 'var(--color-accent)' }} onClick={() => setDialogOpen(false)}>
                      Sign up
                    </Link>
                  )}
                </Tabs.Content>
                <Tabs.Content value="api-key" className="mt-2">
                  {keyMessage.text && (
                    <p
                      className="mb-2 text-sm"
                      style={{ color: keyMessage.type === 'error' ? '#b91c1c' : 'var(--color-text-muted)' }}
                    >
                      {keyMessage.text}
                    </p>
                  )}
                  <p className="mb-2 text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    <a href={SARVAM_DASHBOARD} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: 'var(--color-accent)' }}>
                      Sarvam Dashboard
                    </a>
                    {' '}— create a key, then paste below.
                  </p>
                  <form onSubmit={handleSaveKey}>
                    <input
                      type="password"
                      value={apiKeyInput}
                      onChange={(e) => setApiKeyInput(e.target.value)}
                      placeholder="Paste api-subscription-key"
                      className="mb-3 w-full rounded border py-2 px-3 text-sm"
                      style={{ borderColor: 'var(--color-border)' }}
                      autoComplete="off"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={keyLoading || !apiKeyInput.trim()}
                        className="rounded py-2 px-3 text-sm font-medium text-white disabled:opacity-50"
                        style={{ backgroundColor: 'var(--color-accent)' }}
                      >
                        {keyLoading ? 'Saving…' : 'Save key'}
                      </button>
                      {hasApiKey && (
                        <button
                          type="button"
                          onClick={handleClearKey}
                          disabled={keyLoading}
                          className="rounded border py-2 px-3 text-sm"
                          style={{ borderColor: 'var(--color-border)' }}
                        >
                          Remove key
                        </button>
                      )}
                    </div>
                  </form>
                </Tabs.Content>
              </Tabs.Root>
              <Dialog.Close asChild>
                <button type="button" className="absolute right-3 top-3 rounded p-1 text-sm" style={{ color: 'var(--color-text-muted)' }} aria-label="Close">
                  ×
                </button>
              </Dialog.Close>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <div className="h-4 w-px shrink-0" style={{ backgroundColor: 'var(--color-border)' }} aria-hidden />

        {user ? (
          <>
            <Link
              to={ROUTES.LEARN}
              className="hidden rounded p-1.5 text-sm transition-opacity duration-150 hover:opacity-90 sm:block"
              style={{ color: 'var(--color-text-muted)' }}
              aria-label="How it works"
              title="How it works"
            >
              How it works
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="hidden rounded px-3 py-1.5 text-sm transition-opacity duration-150 hover:opacity-90 sm:block"
              style={{ color: 'var(--color-text-muted)' }}
            >
              {t('nav.logout')}
            </button>
          </>
        ) : (
          <div className="hidden items-center gap-2 sm:flex">
            <Link
              to={ROUTES.LOGIN}
              className="rounded px-3 py-1.5 text-sm transition-opacity duration-150 hover:opacity-90"
              style={{ color: 'var(--color-text)' }}
            >
              {t('nav.signIn')}
            </Link>
            <Link
              to={ROUTES.SIGNUP}
              className="rounded px-3 py-1.5 text-sm font-medium transition-opacity duration-150 hover:opacity-90"
              style={{
                backgroundColor: 'var(--color-accent)',
                color: 'var(--color-surface)',
              }}
            >
              {t('nav.signUp')}
            </Link>
          </div>
        )}
      </div>
    </header>
  );
}
