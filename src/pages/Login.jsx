import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { auth } from '../api/axios';
import { useLocale } from '../context/LocaleContext';
import { ROUTES } from '../constants/routes';

export default function Login() {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem('token')) {
    return <Navigate to={ROUTES.DASHBOARD_INDEX} replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await auth.login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden p-4" style={{ backgroundColor: 'var(--color-bg)' }}>
      <header
        className="fixed left-0 right-0 top-0 z-10 flex items-center border-b px-4 py-3"
        style={{ backgroundColor: 'rgba(255,255,255,0.9)', borderColor: 'var(--color-border)' }}
      >
        <Link to={ROUTES.LANDING} className="text-lg font-bold" style={{ color: 'var(--color-accent)', textDecoration: 'none' }}>
          {t('landing.brand')}
        </Link>
      </header>
      <div className="mt-16 flex flex-1 items-center justify-center w-full">
        <div
          className="relative z-10 w-full max-w-md rounded-lg border p-6"
          style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          <h1 className="mb-4 text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
            Sign in to VaakkuAI
          </h1>
          {error && (
            <div className="mb-4 rounded border py-2 px-3 text-sm" style={{ borderColor: '#dc2626', backgroundColor: '#fef2f2', color: '#b91c1c' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <label className="mb-1 block text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mb-3 w-full rounded border py-2 px-3 text-sm"
              style={{ borderColor: 'var(--color-border)' }}
            />
            <label className="mb-1 block text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="mb-4 w-full rounded border py-2 px-3 text-sm"
              style={{ borderColor: 'var(--color-border)' }}
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded py-2.5 text-sm font-medium text-white transition-opacity duration-150 disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
          <p className="mt-4 text-sm" style={{ color: 'var(--color-text)' }}>
            Don't have an account?{' '}
            <Link to={ROUTES.SIGNUP} className="underline" style={{ color: 'var(--color-accent)' }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
