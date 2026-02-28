import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { adminApi } from '../api/axios';

const FEATURE_LABELS = { tts: 'Text to Speech', stt: 'Speech to Text', translate: 'Translate' };

export default function AdminDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/', { replace: true });
      return;
    }
    adminApi
      .getStats()
      .then(({ data }) => setStats(data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, [user?.isAdmin, navigate]);

  if (!user?.isAdmin) return null;
  if (loading) {
    return (
      <div className="py-12 text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Loading…
      </div>
    );
  }
  if (error) {
    return (
      <div className="py-6">
        <div className="rounded border py-2 px-3 text-sm" style={{ borderColor: '#dc2626', backgroundColor: '#fef2f2', color: '#b91c1c' }}>
          {error}
        </div>
      </div>
    );
  }
  if (!stats) return null;

  const {
    totalUsers,
    signupsLast7Days,
    usersWithApiKeyCount,
    creditsUsersWithKey,
    usage,
    mostUsedFeature,
    recentSignups,
  } = stats;
  const totalUsage = (usage?.tts ?? 0) + (usage?.stt ?? 0) + (usage?.translate ?? 0);

  const statCards = [
    { title: 'Total users', value: totalUsers },
    { title: 'Signups (last 7 days)', value: signupsLast7Days },
    { title: "App's shared credit", value: `₹${user?.credits ?? 0}` },
    { title: 'Users with API key', value: usersWithApiKeyCount ?? 0 },
    { title: 'In-app credits (users with key)', value: `₹${creditsUsersWithKey ?? 0}` },
    { title: 'Most used feature', value: mostUsedFeature ? FEATURE_LABELS[mostUsedFeature] : '—' },
  ];

  return (
    <div className="py-6">
      <h1 className="mb-1 text-xl font-bold" style={{ color: 'var(--color-text)' }}>
        Admin dashboard
      </h1>
      <p className="mb-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
        Overview of users and feature usage.
      </p>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {statCards.map((card) => (
          <div
            key={card.title}
            className="rounded-lg border p-4"
            style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
          >
            <p className="mb-1 text-sm" style={{ color: 'var(--color-text-muted)' }}>
              {card.title}
            </p>
            <p className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <h2 className="mb-3 font-semibold" style={{ color: 'var(--color-text)' }}>
        Feature usage
      </h2>
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <p className="mb-1 font-semibold" style={{ color: 'var(--color-accent)' }}>Text to Speech</p>
          <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{usage?.tts ?? 0}</p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {totalUsage > 0 ? Math.round(((usage?.tts ?? 0) / totalUsage) * 100) : 0}% of total
          </p>
        </div>
        <div className="rounded-lg border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <p className="mb-1 font-semibold" style={{ color: 'var(--color-accent)' }}>Speech to Text</p>
          <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{usage?.stt ?? 0}</p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {totalUsage > 0 ? Math.round(((usage?.stt ?? 0) / totalUsage) * 100) : 0}% of total
          </p>
        </div>
        <div className="rounded-lg border p-4" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
          <p className="mb-1 font-semibold" style={{ color: 'var(--color-accent)' }}>Translate</p>
          <p className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>{usage?.translate ?? 0}</p>
          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
            {totalUsage > 0 ? Math.round(((usage?.translate ?? 0) / totalUsage) * 100) : 0}% of total
          </p>
        </div>
      </div>

      <h2 className="mb-3 font-semibold" style={{ color: 'var(--color-text)' }}>
        Recent signups
      </h2>
      <div className="overflow-x-auto rounded-lg border" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ backgroundColor: 'var(--color-bg)' }}>
              <th className="p-3 font-medium" style={{ color: 'var(--color-text)' }}>Email</th>
              <th className="p-3 text-right font-medium" style={{ color: 'var(--color-text)' }}>Signed up</th>
              <th className="p-3 text-right font-medium" style={{ color: 'var(--color-text)' }}>Last active</th>
            </tr>
          </thead>
          <tbody>
            {recentSignups?.length ? (
              recentSignups.map((row) => (
                <tr key={row.email} className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                  <td className="p-3" style={{ color: 'var(--color-text)' }}>{row.email}</td>
                  <td className="p-3 text-right" style={{ color: 'var(--color-text-muted)' }}>
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
                      : '—'}
                  </td>
                  <td className="p-3 text-right" style={{ color: 'var(--color-text-muted)' }}>
                    {row.lastActiveAt
                      ? new Date(row.lastActiveAt).toLocaleString(undefined, { dateStyle: 'short', timeStyle: 'short' })
                      : '—'}
                  </td>
                </tr>
              ))
            ) : (
              <tr className="border-t" style={{ borderColor: 'var(--color-border)' }}>
                <td colSpan={3} className="py-6 text-center" style={{ color: 'var(--color-text-muted)' }}>
                  No signups yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
