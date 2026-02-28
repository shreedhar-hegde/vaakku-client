/** Central route paths for navigation and redirects. */
export const ROUTES = {
  LANDING: '/landing',
  LOGIN: '/login',
  SIGNUP: '/signup',
  TTS: '/tts',
  STT: '/stt',
  TRANSLATE: '/translate',
  SETTINGS: '/settings',
  LEARN: '/learn',
  HISTORY: '/history',
  ADMIN: '/admin',
};

/** Paths allowed without authentication (anonymous tier). No sidebar/dashboard for anonymous. */
export const ANONYMOUS_PATHS = [ROUTES.TTS, ROUTES.STT, ROUTES.TRANSLATE];
