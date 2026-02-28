import { useState } from 'react';
import { Link, useNavigate, Navigate } from 'react-router-dom';
import { auth } from '../api/axios';
import { useLocale } from '../context/LocaleContext';
import { getPasswordRequirements, validatePassword } from '../utils/passwordValidation';
import { ROUTES } from '../constants/routes';

export default function Signup() {
  const navigate = useNavigate();
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem('token')) {
    return <Navigate to={ROUTES.DASHBOARD_INDEX} replace />;
  }

  const requirements = getPasswordRequirements(password);
  const passwordValid = requirements.every((r) => r.met);
  const confirmMatch = confirmPassword === password && password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await auth.signup(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
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
            Create your account
          </h1>
          {error && (
            <div className="mb-4 rounded border py-2 px-3 text-sm" style={{ borderColor: '#dc2626', backgroundColor: '#fef2f2', color: '#b91c1c' }}>
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <label className="mb-1 block text-sm" style={{ color: 'var(--color-text-muted)' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="mb-3 w-full rounded border py-2 px-3 text-sm"
              style={{ borderColor: 'var(--color-border)' }}
            />
            <label className="mb-1 block text-sm" style={{ color: 'var(--color-text-muted)' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              required
              autoComplete="new-password"
              className="mb-1 w-full rounded border py-2 px-3 text-sm"
              style={{ borderColor: password.length > 0 && !passwordValid ? '#dc2626' : 'var(--color-border)' }}
            />
            {password.length > 0 && !passwordValid && (
              <p className="mb-2 text-xs" style={{ color: '#b91c1c' }}>Meet all requirements below</p>
            )}
            <ul className="mb-2 list-none space-y-1 pl-0 text-sm">
              {requirements.map((r) => (
                <li key={r.label} className="flex items-center gap-2" style={{ color: r.met ? 'var(--color-text-muted)' : 'var(--color-text)' }}>
                  <span>{r.met ? '✓' : '○'}</span>
                  {r.label}
                </li>
              ))}
            </ul>
            <label className="mb-1 block text-sm" style={{ color: 'var(--color-text-muted)' }}>Confirm password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
              required
              autoComplete="new-password"
              className="mb-4 w-full rounded border py-2 px-3 text-sm"
              style={{ borderColor: confirmPassword.length > 0 && !confirmMatch ? '#dc2626' : 'var(--color-border)' }}
            />
            {confirmPassword.length > 0 && !confirmMatch && (
              <p className="-mt-2 mb-2 text-xs" style={{ color: '#b91c1c' }}>Passwords do not match</p>
            )}
            <button
              type="submit"
              disabled={loading || !passwordValid || !confirmMatch}
              className="w-full rounded py-2.5 text-sm font-medium text-white transition-opacity duration-150 disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-accent)' }}
            >
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </form>
          <p className="mt-4 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            You get 1000 credits to start. After signing in, open <strong>Learn</strong> to see how usage works and how to add your own Sarvam API key.
          </p>
          <p className="mt-2 text-sm" style={{ color: 'var(--color-text)' }}>
            Already have an account?{' '}
            <Link to={ROUTES.LOGIN} className="underline" style={{ color: 'var(--color-accent)' }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
