import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, TextField, Button, Link, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { auth } from '../api/axios';
import { useLocale } from '../context/LocaleContext';

export default function Login() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await auth.login(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(140deg, ${theme.palette.primary.main}08 0%, ${theme.palette.primary.main}14 40%, ${theme.palette.background.default} 100%)`,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: '-20%',
          right: '-10%',
          width: '50%',
          height: '60%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.main}12 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: '-15%',
          left: '-15%',
          width: '45%',
          height: '50%',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.palette.primary.main}0a 0%, transparent 70%)`,
          pointerEvents: 'none',
        },
      }}
    >
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          py: 2,
          px: 2,
          display: 'flex',
          alignItems: 'center',
          bgcolor: 'rgba(255,255,255,0.8)',
          backdropFilter: 'saturate(180%) blur(12px)',
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography
          component={RouterLink}
          to="/landing"
          variant="h6"
          fontWeight={700}
          sx={{
            color: 'primary.main',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
            '&:hover': { opacity: 0.85 },
          }}
        >
          {t('landing.brand')}
        </Typography>
      </Box>
      <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', mt: 8 }}>
      <Paper elevation={2} sx={{ p: 4, maxWidth: 400, width: '100%', position: 'relative', zIndex: 1, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Sign in to VaakkuAI
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} variant="filled">
            {error}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            margin="normal"
            autoComplete="email"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            margin="normal"
            autoComplete="current-password"
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </Button>
        </form>
        <Typography sx={{ mt: 2 }}>
          Don't have an account?{' '}
          <Link component={RouterLink} to="/signup">
            Sign up
          </Link>
        </Typography>
      </Paper>
      </Box>
    </Box>
  );
}
