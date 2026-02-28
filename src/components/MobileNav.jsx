import { Link, useLocation } from 'react-router-dom';
import { useLocale } from '../context/LocaleContext';
import { ROUTES } from '../constants/routes';

const TABS = [
  { key: 'tts', path: ROUTES.TTS },
  { key: 'stt', path: ROUTES.STT },
  { key: 'translate', path: ROUTES.TRANSLATE },
];

export default function MobileNav() {
  const location = useLocation();
  const { t } = useLocale();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 flex border-t md:hidden"
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
      }}
    >
      <div className="flex w-full">
        {TABS.map(({ key, path }) => {
          const isActive = location.pathname === path || location.pathname.startsWith(path + '/');
          return (
            <Link
              key={path}
              to={path}
              className="flex flex-1 flex-col items-center gap-0.5 py-2 text-xs transition-opacity duration-150"
              style={{
                color: isActive ? 'var(--color-accent)' : 'var(--color-text-muted)',
                textDecoration: 'none',
                fontWeight: isActive ? 600 : 400,
              }}
            >
              {t(`nav.${key}`)}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
