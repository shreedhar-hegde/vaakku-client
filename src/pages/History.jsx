import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  IconButton,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Paper,
  Tooltip,
} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import MicIcon from '@mui/icons-material/Mic';
import TranslateIcon from '@mui/icons-material/Translate';
import { historyApi, ai } from '../api/axios';

const TYPE_LABELS = {
  tts: 'Text to Speech',
  stt: 'Speech to Text',
  translate: 'Translate',
};

const TYPE_ICONS = {
  tts: <RecordVoiceOverIcon fontSize="small" />,
  stt: <MicIcon fontSize="small" />,
  translate: <TranslateIcon fontSize="small" />,
};

function formatDate(d) {
  if (!d) return '';
  const date = new Date(d);
  const now = new Date();
  const sameDay = date.toDateString() === now.toDateString();
  if (sameDay) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
}

function getOutputText(entry) {
  if (entry.type === 'stt' || entry.type === 'translate') return entry.output || '';
  if (entry.type === 'tts') return entry.input ? `Generated audio (${entry.target_language_code || '—'})` : '';
  return '';
}

const DEFAULT_TTS_LANG = 'en-IN';

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState('');
  const [playingId, setPlayingId] = useState(null);
  const [playAudioUrl, setPlayAudioUrl] = useState(null);
  const [playLoadingId, setPlayLoadingId] = useState(null);
  const [playError, setPlayError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    const params = {};
    if (typeFilter) params.type = typeFilter;
    historyApi
      .getList(params)
      .then((res) => setItems(res.data?.items ?? []))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load history'))
      .finally(() => setLoading(false));
  }, [typeFilter]);

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {});
  };

  const handlePlay = async (entry) => {
    setPlayError(null);
    const textToSpeak =
      entry.type === 'tts' ? (entry.input || '') : entry.type === 'stt' ? (entry.output || '') : '';
    if (!textToSpeak.trim()) return;
    const lang = entry.type === 'tts' ? (entry.target_language_code || DEFAULT_TTS_LANG) : DEFAULT_TTS_LANG;
    setPlayLoadingId(entry._id);
    try {
      const { data } = await ai.tts({
        text: textToSpeak.trim(),
        target_language_code: lang,
        speaker: 'shubh',
        model: 'bulbul:v3',
      });
      const base64 = data?.audios?.[0];
      if (base64) {
        setPlayAudioUrl(`data:audio/wav;base64,${base64}`);
        setPlayingId(entry._id);
      } else {
        setPlayError('No audio returned');
      }
    } catch (err) {
      setPlayError(err.response?.data?.error || err.response?.data?.message || err.message || 'Play failed');
    } finally {
      setPlayLoadingId(null);
    }
  };

  const handlePlayEnded = () => {
    setPlayingId(null);
    setPlayAudioUrl(null);
  };

  return (
    <Box sx={{ py: { xs: 2, sm: 3 } }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        History
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 1 }}>
        Past TTS, STT, and translation results. Copy output to reuse.
      </Typography>
      <Alert severity="info" icon={<InfoOutlinedIcon />} sx={{ mb: 2 }}>
        History is limited to the 10 most recent entries. Older entries are removed automatically.
      </Alert>

      <FormControl size="small" sx={{ minWidth: 160, mb: 2 }}>
        <InputLabel>Type</InputLabel>
        <Select
          value={typeFilter}
          label="Type"
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="tts">Text to Speech</MenuItem>
          <MenuItem value="stt">Speech to Text</MenuItem>
          <MenuItem value="translate">Translate</MenuItem>
        </Select>
      </FormControl>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {playError && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setPlayError(null)}>
          {playError}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : items.length === 0 ? (
        <Typography color="text.secondary">No history yet. Use TTS, STT, or Translate to see entries here.</Typography>
      ) : (
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          <List disablePadding>
            {items.map((entry) => {
              const outputText = getOutputText(entry);
              const hasCopy = outputText && entry.type !== 'tts';
              const canPlay =
                (entry.type === 'tts' && (entry.input || '').trim()) ||
                (entry.type === 'stt' && (entry.output || '').trim());
              const isPlaying = playingId === entry._id;
              const isPlayLoading = playLoadingId === entry._id;
              return (
                <ListItem
                  key={entry._id}
                  divider
                  sx={{ flexDirection: 'column', alignItems: 'stretch', py: 1.5 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Chip
                      size="small"
                      icon={TYPE_ICONS[entry.type]}
                      label={TYPE_LABELS[entry.type] || entry.type}
                      color="primary"
                      variant="outlined"
                    />
                    <Typography variant="caption" color="text.secondary">
                      {formatDate(entry.createdAt)}
                    </Typography>
                    {canPlay && (
                      <Tooltip title={entry.type === 'tts' ? 'Play again' : 'Read aloud'}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handlePlay(entry)}
                          disabled={!!playLoadingId}
                          aria-label="Play"
                        >
                          {isPlayLoading ? (
                            <CircularProgress size={20} />
                          ) : (
                            <PlayArrowIcon fontSize="small" />
                          )}
                        </IconButton>
                      </Tooltip>
                    )}
                  </Box>
                  {entry.input && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }} noWrap title={entry.input}>
                      In: {entry.input}
                    </Typography>
                  )}
                  {outputText && (
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5 }}>
                      <ListItemText
                        primary={outputText}
                        primaryTypographyProps={{ variant: 'body2', sx: { wordBreak: 'break-word' } }}
                      />
                      {hasCopy && (
                        <IconButton size="small" onClick={() => handleCopy(outputText)} title="Copy">
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  )}
                  {isPlaying && playAudioUrl && (
                    <audio
                      key={entry._id}
                      src={playAudioUrl}
                      controls
                      autoPlay
                      onEnded={handlePlayEnded}
                      style={{ width: '100%', maxWidth: 320, marginTop: 0.5 }}
                    />
                  )}
                </ListItem>
              );
            })}
          </List>
        </Paper>
      )}
    </Box>
  );
}
