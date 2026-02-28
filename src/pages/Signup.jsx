import { useState } from 'react';
import { Link as RouterLink, useNavigate, Navigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Alert,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';

import { auth } from '../api/axios';
import { useLocale } from '../context/LocaleContext';
import { getPasswordRequirements, validatePassword } from '../utils/passwordValidation';
import { ROUTES } from '../constants/routes';

export default function Signup() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useLocale();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (localStorage.getItem('token')) {
    return <Navigate to={ROUTES.DASHBOARD_INDEX} replace />;
  }

  const requirements = getPasswordRequirements(password);
  const passwordValid = requirements.every((r) => r.met);
  const confirmMatch = confirmPassword === password && password.length > 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const pwdError = validatePassword(password);
    if (pwdError) {
      setError(pwdError);
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const { data } = await auth.signup(email, password);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
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
          Create your account
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
            onChange={(e) => {
              setPassword(e.target.value);
              setError('');
            }}
            required
            margin="normal"
            autoComplete="new-password"
            error={password.length > 0 && !passwordValid}
            helperText={password.length > 0 && !passwordValid ? 'Meet all requirements below' : ''}
          />
          <List dense disablePadding sx={{ mt: 0, mb: 1 }}>
            {requirements.map((r) => (
              <ListItem key={r.label} disablePadding sx={{ py: 0, minHeight: 28 }}>
                <ListItemIcon sx={{ minWidth: 28 }}>
                  {r.met ? (
                    <CheckCircleOutlineIcon color="success" fontSize="small" />
                  ) : (
                    <RadioButtonUncheckedIcon fontSize="small" sx={{ color: 'action.disabled' }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={r.label}
                  primaryTypographyProps={{
                    variant: 'body2',
                    color: r.met ? 'text.secondary' : 'text.primary',
                  }}
                />
              </ListItem>
            ))}
          </List>
          <TextField
            fullWidth
            label="Confirm password"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setError('');
            }}
            required
            margin="normal"
            autoComplete="new-password"
            error={confirmPassword.length > 0 && !confirmMatch}
            helperText={
              confirmPassword.length > 0 && !confirmMatch ? 'Passwords do not match' : ''
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
            disabled={loading || !passwordValid || !confirmMatch}
          >
            {loading ? 'Creating account…' : 'Sign up'}
          </Button>
        </form>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
          You get 1000 credits to start. After signing in, open <strong>Learn</strong> in the menu
          to see how usage works and how to add your own Sarvam API key.
        </Typography>
        <Typography sx={{ mt: 2 }}>
          Already have an account?{' '}
          <Link component={RouterLink} to="/login">
            Sign in
          </Link>
        </Typography>
      </Paper>
      </Box>
    </Box>
  );
}
