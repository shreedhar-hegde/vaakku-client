/** Shared language options for Translate (with Auto-detect) and TTS. */
export const LANGUAGES_WITH_AUTO = [
  { value: 'auto', label: 'Auto-detect', native: '' },
  { value: 'en-IN', label: 'English', native: '' },
  { value: 'hi-IN', label: 'Hindi', native: 'हिन्दी' },
  { value: 'bn-IN', label: 'Bengali', native: 'বাংলা' },
  { value: 'ta-IN', label: 'Tamil', native: 'தமிழ்' },
  { value: 'te-IN', label: 'Telugu', native: 'తెలుగు' },
  { value: 'gu-IN', label: 'Gujarati', native: 'ગુજરાતી' },
  { value: 'kn-IN', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { value: 'ml-IN', label: 'Malayalam', native: 'മലയാളം' },
  { value: 'mr-IN', label: 'Marathi', native: 'मराठी' },
  { value: 'pa-IN', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { value: 'od-IN', label: 'Odia', native: 'ଓଡ଼ିଆ' },
];

/** Languages for target selection (no Auto-detect). */
export const LANGUAGES_TARGET = LANGUAGES_WITH_AUTO.filter((l) => l.value !== 'auto');

/** TTS page: 6 languages shown as top tab row (order and labels). */
export const TTS_LANG_TABS = [
  { value: 'en-IN', label: 'English', native: '' },
  { value: 'hi-IN', label: 'Hindi', native: 'हिन्दी' },
  { value: 'kn-IN', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { value: 'ta-IN', label: 'Tamil', native: 'தமிழ்' },
  { value: 'te-IN', label: 'Telugu', native: 'తెలుగు' },
  { value: 'bn-IN', label: 'Bengali', native: 'বাংলা' },
];
