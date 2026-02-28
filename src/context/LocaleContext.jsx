import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'vaakku_locale';
const LOCALES_BASE = '/locales';
const LOCALE_CACHE_BUST = '?v=2'; // bump when adding/editing locale keys

export const LOCALE_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'hi-IN', label: 'Hindi' },
  { value: 'kn-IN', label: 'Kannada' },
];

function get(obj, path) {
  const parts = path.split('.');
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return path;
    cur = cur[p];
  }
  return typeof cur === 'string' ? cur : path;
}

const LocaleContext = createContext(null);

export function LocaleProvider({ children }) {
  const [locale, setLocaleState] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'en';
  });
  const [messages, setMessages] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const url = `${LOCALES_BASE}/${locale}.json${LOCALE_CACHE_BUST}`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(r.statusText);
        return r.json();
      })
      .then((data) => {
        if (!cancelled) setMessages(data);
      })
      .catch(() => {
        if (!cancelled) setMessages({});
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [locale]);

  const setLocale = useCallback((value) => {
    setLocaleState(value);
    localStorage.setItem(STORAGE_KEY, value);
  }, []);

  const t = useCallback(
    (key) => get(messages, key),
    [messages]
  );

  const value = { locale, setLocale, t, loading, options: LOCALE_OPTIONS };

  return (
    <LocaleContext.Provider value={value}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider');
  return ctx;
}
