const STORAGE_KEY = 'vaakku_anonymous_usage';

export const ANON_LIMITS = { tts: 3, stt: 2, translate: 3 };
export const ANON_MAX_CHARS = { tts: 200, translate: 500 };

function read() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { tts: 0, stt: 0, translate: 0 };
    const parsed = JSON.parse(raw);
    return {
      tts: Math.max(0, parseInt(parsed.tts, 10) || 0),
      stt: Math.max(0, parseInt(parsed.stt, 10) || 0),
      translate: Math.max(0, parseInt(parsed.translate, 10) || 0),
    };
  } catch {
    return { tts: 0, stt: 0, translate: 0 };
  }
}

function write(usage) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(usage));
  } catch (_) {}
}

export function getAnonymousUsage(feature) {
  return read()[feature] ?? 0;
}

export function getAnonymousRemaining(feature) {
  const used = read()[feature] ?? 0;
  const limit = ANON_LIMITS[feature] ?? 0;
  return Math.max(0, limit - used);
}

export function incrementAnonymousUsage(feature) {
  const u = read();
  const limit = ANON_LIMITS[feature];
  if (limit != null) {
    u[feature] = Math.min(limit, (u[feature] ?? 0) + 1);
    write(u);
  }
}

export function setAnonymousUsageAtLimit(feature) {
  const u = read();
  const limit = ANON_LIMITS[feature];
  if (limit != null) {
    u[feature] = limit;
    write(u);
  }
}

export function isAnonymousLimitReached(feature) {
  return getAnonymousRemaining(feature) <= 0;
}
