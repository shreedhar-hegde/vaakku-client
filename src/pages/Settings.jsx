import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Link,
} from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import { useUser } from '../context/UserContext';
import { userApi } from '../api/axios';

const SARVAM_DASHBOARD = 'https://dashboard.sarvam.ai/';

export default function Settings() {
  const { user, refreshUser } = useUser();
  const [key, setKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSave = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);
    try {
      await userApi.updateSarvamApiKey(key.trim());
      setKey('');
      await refreshUser();
      setMessage({ type: 'success', text: 'API key saved. Your usage will be billed to your Sarvam account.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to save key' });
    } finally {
      setLoading(false);
    }
  };

  const handleClear = async () => {
    setMessage({ type: '', text: '' });
    setLoading(true);
    try {
      await userApi.updateSarvamApiKey('');
      await refreshUser();
      setMessage({ type: 'success', text: 'API key removed. The app will use shared credits when you have no key.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.error || 'Failed to remove key' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ py: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
        Settings
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        Manage your Sarvam AI API key. Optional: add your own key to use your Sarvam credits; otherwise the app uses shared credits.
      </Typography>

      {message.text && (
        <Alert severity={message.type === 'error' ? 'error' : 'success'} sx={{ mb: 2 }} onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      <Paper sx={{ p: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <KeyIcon color="action" />
          <Typography variant="subtitle1" fontWeight={600}>
            Sarvam API key
          </Typography>
        </Box>
        {user?.hasSarvamKey && (
          <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
            You have an API key set. Usage is billed to your Sarvam account. Add a new key below to replace it, or clear to use shared credits.
          </Typography>
        )}
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Create a key at the{' '}
          <Link href={SARVAM_DASHBOARD} target="_blank" rel="noopener noreferrer">
            Sarvam Dashboard
          </Link>
          , then paste it here. Your key is stored encrypted and only used for your requests.
        </Typography>
        <form onSubmit={handleSave}>
          <TextField
            fullWidth
            type="password"
            label="Sarvam API key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            placeholder="Paste your api-subscription-key"
            margin="normal"
            autoComplete="off"
          />
          <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
            <Button type="submit" variant="contained" disabled={loading || !key.trim()}>
              {loading ? 'Saving…' : 'Save key'}
            </Button>
            {user?.hasSarvamKey && (
              <Button type="button" variant="outlined" color="secondary" onClick={handleClear} disabled={loading}>
                Remove key
              </Button>
            )}
          </Box>
        </form>
      </Paper>
    </Box>
  );
}
