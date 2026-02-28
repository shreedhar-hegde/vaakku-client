import { Link, useLocation } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { useUser } from '../context/UserContext';
import { ROUTES } from '../constants/routes';

const MAIN_LINKS = [
  { key: 'tts', path: ROUTES.TTS },
  { key: 'stt', path: ROUTES.STT },
  { key: 'translate', path: ROUTES.TRANSLATE },
];

const ACCOUNT_LINKS = [
  { key: 'history', path: ROUTES.HISTORY },
  { key: 'settings', path: ROUTES.SETTINGS },
];

function NavLink({ path, keyName, label, isActive }) {
  return (
    <Link
      to={path}
      className="sidebar-link rounded-r py-2.5 pl-4 pr-3 text-sm transition-colors duration-150"
      style={{
        borderLeft: `3px solid ${isActive ? 'var(--color-accent)' : 'transparent'}`,
        backgroundColor: isActive ? 'rgba(15, 76, 129, 0.06)' : 'transparent',
        color: isActive ? 'var(--color-accent)' : 'var(--color-text)',
        textDecoration: 'none',
      }}
    >
      {label}
    </Link>
  );
}

export default function Sidebar() {
  const location = useLocation();
  const { t } = useLocale();
  const { user } = useUser();
  const showAdmin = user?.isAdmin;

  const isActive = (path) =>
    location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <aside
      className="hidden w-[240px] shrink-0 flex-col border-r md:flex"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <nav className="flex flex-col gap-0.5 p-3">
        {MAIN_LINKS.map(({ key, path }) => (
          <NavLink key={path} path={path} keyName={key} label={t(`nav.${key}`)} isActive={isActive(path)} />
        ))}
        <div className="my-1.5 h-px shrink-0" style={{ backgroundColor: 'var(--color-border)' }} aria-hidden />
        {ACCOUNT_LINKS.map(({ key, path }) => (
          <NavLink key={path} path={path} keyName={key} label={t(`nav.${key}`)} isActive={isActive(path)} />
        ))}
        {showAdmin && (
          <>
            <div className="my-1.5 h-px shrink-0" style={{ backgroundColor: 'var(--color-border)' }} aria-hidden />
            <Link
              to={ROUTES.ADMIN}
              className="rounded-r py-2 pl-4 pr-3 text-sm transition-colors duration-150"
              style={{
                borderLeft: `3px solid ${location.pathname === ROUTES.ADMIN ? 'var(--color-accent)' : 'transparent'}`,
                backgroundColor: location.pathname === ROUTES.ADMIN ? 'rgba(15, 76, 129, 0.06)' : 'transparent',
                color: location.pathname === ROUTES.ADMIN ? 'var(--color-accent)' : 'var(--color-text-muted)',
                fontSize: '13px',
                textDecoration: 'none',
              }}
            >
              {t('nav.admin')}
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}
