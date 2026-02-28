import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Alert,
  CircularProgress,
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

const SPEAKERS = [
  'shubh', 'aditya', 'ritu', 'priya', 'neha', 'rahul', 'pooja', 'rohan', 'simran', 'kavya',
  'amit', 'dev', 'ishita', 'shreya', 'ratan', 'varun', 'anand', 'tanya', 'tarun',
];

export default function TTS() {
  const { user, refreshUser } = useUser();
  const { t } = useLocale();
  const [text, setText] = useState('');
  const [targetLang, setTargetLang] = useState('en-IN');
  const [speaker, setSpeaker] = useState('shubh');
  const [pace, setPace] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [audioUrl, setAudioUrl] = useState(null);

  const isAnonymous = !user;
  const maxChars = isAnonymous ? ANON_MAX_CHARS.tts : 2500;
  const anonRemaining = getAnonymousRemaining('tts');
  const anonLimitReached = isAnonymous && anonRemaining <= 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAudioUrl(null);
    if (!text.trim()) return;
    if (isAnonymous && anonLimitReached) return;
    setLoading(true);
    try {
      const { data } = await ai.tts({
        text: text.trim().slice(0, maxChars),
        target_language_code: targetLang,
        speaker,
        model: 'bulbul:v3',
        pace,
      });
      const base64 = data.audios?.[0];
      if (base64) {
        setAudioUrl(`data:audio/wav;base64,${base64}`);
        if (isAnonymous) incrementAnonymousUsage('tts');
        else await refreshUser();
      } else {
        setError('No audio returned');
      }
    } catch (err) {
      const res = err.response?.data;
      if (res?.code === 'ANONYMOUS_LIMIT_REACHED') setAnonymousUsageAtLimit('tts');
      setError(res?.error || err.response?.data?.message || err.message || 'TTS failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
        Text to Speech
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        {isAnonymous
          ? `Enter text (up to ${ANON_MAX_CHARS.tts} characters) and choose language and voice.`
          : 'Enter text (up to 2,500 characters) and choose language and voice.'}
      </Typography>
      {isAnonymous && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {anonLimitReached
            ? t('anonymous.limitReached') + ' '
            : t('anonymous.ttsTriesLeft').replace('{{remaining}}', anonRemaining).replace('{{limit}}', ANON_LIMITS.tts) + ' '}
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
            label="Text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste text to convert to speech..."
            inputProps={{ maxLength: maxChars }}
            helperText={`${text.length}/${maxChars}`}
            margin="normal"
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Language</InputLabel>
              <Select value={targetLang} label="Language" onChange={(e) => setTargetLang(e.target.value)}>
                {LANGUAGES.map((l) => (
                  <MenuItem key={l.value} value={l.value}>{l.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Voice</InputLabel>
              <Select value={speaker} label="Voice" onChange={(e) => setSpeaker(e.target.value)}>
                {SPEAKERS.map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ minWidth: { xs: '100%', sm: 200 } }}>
              <Typography gutterBottom>Pace: {pace}</Typography>
              <Slider value={pace} min={0.5} max={2} step={0.1} onChange={(_, v) => setPace(v)} valueLabelDisplay="auto" />
            </Box>
          </Box>
          <Button
            type="submit"
            variant="contained"
            sx={{ mt: 2 }}
            disabled={loading || !text.trim() || (isAnonymous && anonLimitReached)}
          >
            {loading ? <CircularProgress size={24} /> : 'Generate speech'}
          </Button>
        </form>
        {audioUrl && (
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" gutterBottom>Preview</Typography>
            <audio controls src={audioUrl} style={{ width: '100%', maxWidth: 400 }} />
          </Box>
        )}
      </Paper>
    </Box>
  );
}
