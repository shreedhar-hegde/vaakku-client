import { useState, useRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  Box,
  Tabs,
  Tab,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import MicIcon from '@mui/icons-material/Mic';
import StopIcon from '@mui/icons-material/Stop';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { ai } from '../api/axios';
import { useUser } from '../context/UserContext';
import { useLocale } from '../context/LocaleContext';
import {
  ANON_LIMITS,
  getAnonymousRemaining,
  incrementAnonymousUsage,
  setAnonymousUsageAtLimit,
} from '../utils/anonymousUsage';

const MODES = [
  { value: 'transcribe', label: 'Transcribe (same language)' },
  { value: 'translate', label: 'Translate to English' },
  { value: 'translit', label: 'Transliterate (Roman script)' },
  { value: 'codemix', label: 'Code-mixed' },
];

export default function STT() {
  const { user, refreshUser } = useUser();
  const { t } = useLocale();
  const [tab, setTab] = useState(0); // 0 = upload, 1 = record
  const isAnonymous = !user;
  const anonRemaining = getAnonymousRemaining('stt');
  const anonLimitReached = isAnonymous && anonRemaining <= 0;
  const [mode, setMode] = useState('transcribe');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);

  // Recording state
  const [recording, setRecording] = useState(false);
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordDuration, setRecordDuration] = useState(0);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setResult(null);
    setError('');
  };

  const startRecording = async () => {
    setError('');
    setResult(null);
    setRecordedBlob(null);
    setRecordDuration(0);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      chunksRef.current = [];
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunksRef.current.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        if (chunksRef.current.length) {
          const blob = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' });
          setRecordedBlob(blob);
        }
        setRecording(false);
        if (timerRef.current) clearInterval(timerRef.current);
      };
      recorder.start(200);
      mediaRecorderRef.current = recorder;
      setRecording(true);
      timerRef.current = setInterval(() => setRecordDuration((d) => d + 1), 1000);
    } catch (err) {
      setError('Microphone access denied or not available.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const submitFile = async (audioFile) => {
    if (!audioFile) return;
    if (isAnonymous && anonLimitReached) return;
    setError('');
    setResult(null);
    setLoading(true);
    try {
      const form = new FormData();
      form.append('file', audioFile);
      form.append('mode', mode);
      const { data } = await ai.stt(form);
      setResult({ transcript: data.transcript, language_code: data.language_code });
      if (isAnonymous) incrementAnonymousUsage('stt');
      else await refreshUser();
    } catch (err) {
      const res = err.response?.data;
      if (res?.code === 'ANONYMOUS_LIMIT_REACHED') setAnonymousUsageAtLimit('stt');
      setError(res?.error || err.response?.data?.message || err.message || 'STT failed');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitUpload = (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an audio file (WAV, MP3, etc.)');
      return;
    }
    submitFile(file);
  };

  const handleSubmitRecorded = () => {
    if (!recordedBlob) return;
    const ext = recordedBlob.type.includes('webm') ? 'webm' : 'audio';
    const audioFile = new File([recordedBlob], `recording.${ext}`, { type: recordedBlob.type });
    submitFile(audioFile);
  };

  const formatTime = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <Box sx={{ py: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
        Speech to Text
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Upload an audio file or record live from your microphone. Transcribe or translate to English.
      </Typography>
      {isAnonymous && (
        <Alert severity="info" sx={{ mb: 2 }}>
          {anonLimitReached
            ? t('anonymous.limitReached') + ' '
            : t('anonymous.sttTriesLeft').replace('{{remaining}}', anonRemaining).replace('{{limit}}', ANON_LIMITS.stt) + ' '}
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
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Output mode</InputLabel>
          <Select value={mode} label="Output mode" onChange={(e) => setMode(e.target.value)}>
            {MODES.map((m) => (
              <MenuItem key={m.value} value={m.value}>{m.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Upload file" icon={<UploadFileIcon />} iconPosition="start" />
          <Tab label="Record live" icon={<MicIcon />} iconPosition="start" />
        </Tabs>

        {tab === 0 && (
          <form onSubmit={handleSubmitUpload}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{ mb: 2 }}
              fullWidth
            >
              {file ? file.name : 'Choose audio file'}
              <input type="file" hidden accept="audio/*,.wav,.mp3,.m4a,.ogg,.flac" onChange={handleFileChange} />
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading || !file || (isAnonymous && anonLimitReached)}
              fullWidth
            >
              {loading ? <CircularProgress size={24} /> : 'Transcribe'}
            </Button>
          </form>
        )}

        {tab === 1 && (
          <Box>
            {!recording && !recordedBlob && (
              <Button
                variant="contained"
                startIcon={<MicIcon />}
                onClick={startRecording}
                fullWidth
                sx={{ mb: 2 }}
                color="primary"
              >
                Start recording
              </Button>
            )}
            {recording && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'error.main', animation: 'pulse 1s infinite' }} />
                  <Typography>Recording {formatTime(recordDuration)}</Typography>
                </Box>
                <Button variant="contained" color="error" startIcon={<StopIcon />} onClick={stopRecording}>
                  Stop
                </Button>
              </Box>
            )}
            {recordedBlob && !recording && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  Recorded audio. Play back or transcribe.
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <audio controls src={URL.createObjectURL(recordedBlob)} style={{ maxWidth: '100%', height: 40 }} />
                  <Button variant="outlined" size="small" onClick={() => { setRecordedBlob(null); setRecordDuration(0); }}>
                    Record again
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={loading ? <CircularProgress size={20} /> : null}
                    disabled={loading || (isAnonymous && anonLimitReached)}
                    onClick={handleSubmitRecorded}
                  >
                    {loading ? 'Transcribing…' : 'Transcribe'}
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        )}

        {result && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {result.language_code && `Language: ${result.language_code}`}
            </Typography>
            <Typography sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>{result.transcript || '—'}</Typography>
          </Box>
        )}
      </Paper>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </Box>
  );
}
