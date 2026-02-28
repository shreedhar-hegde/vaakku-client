import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
} from '@mui/material';
import { ai } from '../api/axios';
import { useUser } from '../context/UserContext';
import { useLocale } from '../context/LocaleContext';
import {
  ANON_LIMITS,
  ANON_MAX_CHARS,
  getAnonymousRemaining,
  incrementAnonymousUsage,
  setAnonymousUsageAtLimit,
} from '../utils/anonymousUsage';

const LANGUAGES = [
  { value: 'auto', label: 'Auto-detect' },
  { value: 'en-IN', label: 'English' },
  { value: 'hi-IN', label: 'Hindi' },
  { value: 'bn-IN', label: 'Bengali' },
  { value: 'ta-IN', label: 'Tamil' },
  { value: 'te-IN', label: 'Telugu' },
  { value: 'gu-IN', label: 'Gujarati' },
  { value: 'kn-IN', label: 'Kannada' },
  { value: 'ml-IN', label: 'Malayalam' },
  { value: 'mr-IN', label: 'Marathi' },
  { value: 'pa-IN', label: 'Punjabi' },
  { value: 'od-IN', label: 'Odia' },
];

export default function Translate() {
  const { user, refreshUser } = useUser();
  const { t } = useLocale();
  const [input, setInput] = useState('');
  const [sourceLang, setSourceLang] = useState('auto');
  const [targetLang, setTargetLang] = useState('hi-IN');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [translated, setTranslated] = useState('');

  const isAnonymous = !user;
  const maxChars = isAnonymous ? ANON_MAX_CHARS.translate : 1000;
  const anonRemaining = getAnonymousRemaining('translate');
  const anonLimitReached = isAnonymous && anonRemaining <= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTranslated('');
    if (!input.trim()) return;
    if (isAnonymous && anonLimitReached) return;
    setLoading(true);
    try {
      const { data } = await ai.translate({
        input: input.trim().slice(0, maxChars),
        source_language_code: sourceLang,
        target_language_code: targetLang,
      });
      setTranslated(data.translated_text ?? data.translation ?? '');
      if (isAnonymous) incrementAnonymousUsage('translate');
      else await refreshUser();
    } catch (err) {
      const res = err.response?.data;
      if (res?.code === 'ANONYMOUS_LIMIT_REACHED') setAnonymousUsageAtLimit('translate');
      setError(res?.error || err.response?.data?.message || err.message || 'Translation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
        Translate
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        {isAnonymous
          ? `Translate between English and Indian languages (up to ${ANON_MAX_CHARS.translate} characters).`
          : 'Translate between English and Indian languages (Mayura; up to 1,000 characters).'}
      </Typography>
      {isAnonymous && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {anonLimitReached
            ? t('anonymous.limitReached') + ' '
            : t('anonymous.translateTriesLeft').replace('{{remaining}}', anonRemaining).replace('{{limit}}', ANON_LIMITS.translate) + ' '}
          <Button component={RouterLink} to="/signup" size="small" sx={{ mt: 0.5 }}>
            {t('anonymous.signUpForMore')}
          </Button>
        </Alert>
      )}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
          {error}
        </Alert>
      )}
      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Text to translate"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text..."
            inputProps={{ maxLength: maxChars }}
            helperText={`${input.length}/${maxChars}`}
            margin="normal"
          />
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mt: 2 }}>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>From</InputLabel>
              <Select value={sourceLang} label="From" onChange={(e) => setSourceLang(e.target.value)}>
                {LANGUAGES.map((l) => (
                  <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>To</InputLabel>
              <Select value={targetLang} label="To" onChange={(e) => setTargetLang(e.target.value)}>
                {LANGUAGES.filter((l) => l.value !== 'auto').map((l) => (
                  <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading || !input.trim() || (isAnonymous && anonLimitReached)}
          >
            {loading ? <CircularProgress size={24} /> : 'Translate'}
          </Button>
        </form>
        {translated && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">Translation</Typography>
            <Typography sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>{translated}</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
}
