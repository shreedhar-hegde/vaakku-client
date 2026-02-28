/** Central route paths for navigation and redirects. */
export const ROUTES = {
  LANDING: '/landing',
  LOGIN: '/login',
  SIGNUP: '/signup',
  DASHBOARD: '/dashboard',
  DASHBOARD_INDEX: '/',
  TTS: '/tts',
  STT: '/stt',
  TRANSLATE: '/translate',
  SETTINGS: '/settings',
  LEARN: '/learn',
  HISTORY: '/history',
  ADMIN: '/admin',
};

/** Paths allowed without authentication (anonymous tier). */
export const ANONYMOUS_PATHS = [ROUTES.TTS, ROUTES.STT, ROUTES.TRANSLATE, ROUTES.LEARN, ROUTES.DASHBOARD];
