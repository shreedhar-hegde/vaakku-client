import { Link, useLocation } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { ROUTES } from '../constants/routes';

const TABS = [
  { key: 'tts', path: ROUTES.TTS, icon: 'speaker' },
  { key: 'stt', path: ROUTES.STT, icon: 'mic' },
  { key: 'translate', path: ROUTES.TRANSLATE, icon: 'translate' },
];

function TabIcon({ icon, isActive }) {
  const color = isActive ? 'var(--color-accent)' : 'var(--color-text-muted)';
  const size = 22;
  if (icon === 'speaker') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    );
  }
  if (icon === 'mic') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    );
  }
  if (icon === 'translate') {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 8l6 6" />
        <path d="M4 14l6-6 2-3" />
        <path d="M2 5h12" />
        <path d="M7 2h1a18 18 0 0 1 4 9" />
        <path d="M22 22l-5-10-5 10" />
        <path d="M14 18h6" />
      </svg>
    );
  }
  return null;
}

export default function MobileNav() {
  const location = useLocation();
  const { t } = useLocale();

  return (
    <nav
      className="mobile-nav fixed bottom-0 left-0 right-0 z-20 flex border-t md:hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
      aria-label="Main tools"
    >
      <div className="flex w-full">
        {TABS.map(({ key, path, icon }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <Link
              key={path}
              to={path}
              className="mobile-nav-tab flex flex-1 flex-col items-center justify-center gap-1 py-3 transition-colors duration-150 min-h-[56px]"
              style={{
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 400,
                backgroundColor: isActive ? 'rgba(15, 76, 129, 0.06)' : 'transparent',
              }}
            >
              <TabIcon icon={icon} isActive={isActive} />
              <span className="text-xs leading-tight">{t(`nav.${key}`)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
