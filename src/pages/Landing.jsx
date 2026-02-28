import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Stack,
  useTheme,
  useMediaQuery,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import MicIcon from '@mui/icons-material/Mic';
import TranslateIcon from '@mui/icons-material/Translate';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useLocale } from '../context/LocaleContext';

const featureKeys = [
  { key: 'tts', icon: <RecordVoiceOverIcon sx={{ fontSize: 36 }} /> },
  { key: 'stt', icon: <MicIcon sx={{ fontSize: 36 }} /> },
  { key: 'translate', icon: <TranslateIcon sx={{ fontSize: 36 }} /> },
];

export default function Landing() {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'));
  const { locale, setLocale, t, options } = useLocale();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Top bar */}
      <Box
        component="header"
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          py: 2,
          px: { xs: 2, sm: 3 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
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
          }}
        >
          {t('landing.brand')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="landing-lang-label">Language</InputLabel>
            <Select
              labelId="landing-lang-label"
              value={locale}
              label="Language"
              onChange={(e) => setLocale(e.target.value)}
            >
              {options.map((opt) => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            component={RouterLink}
            to="/login"
            variant="outlined"
            size={isSmall ? 'small' : 'medium'}
            sx={{ borderRadius: 2 }}
          >
            {t('landing.signIn')}
          </Button>
        </Box>
      </Box>

      {/* Hero */}
      <Box
        sx={{
          pt: { xs: 14, sm: 16 },
          pb: { xs: 8, sm: 12 },
          px: 2,
          background: `linear-gradient(165deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark || '#0a3d7a'} 50%, #0d2847 100%)`,
          color: '#fff',
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant={isSmall ? 'h4' : 'h3'}
            fontWeight={700}
            sx={{
              letterSpacing: '-0.03em',
              lineHeight: 1.2,
              mb: 2,
              textShadow: '0 1px 2px rgba(0,0,0,0.2)',
            }}
          >
            {t('landing.heroTitle')}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              fontSize: { xs: '1rem', sm: '1.15rem' },
              opacity: 0.95,
              maxWidth: 520,
              mx: 'auto',
              mb: 4,
              lineHeight: 1.6,
            }}
          >
            {t('landing.heroSubtitle')}
          </Typography>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={2}
            justifyContent="center"
            alignItems="center"
          >
            <Button
              component={RouterLink}
              to="/signup"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                bgcolor: '#fff',
                color: 'primary.main',
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: 600,
                '&:hover': {
                  bgcolor: 'rgba(255,255,255,0.92)',
                },
              }}
            >
              {t('landing.getStartedFree')}
            </Button>
            <Button
              component={RouterLink}
              to="/dashboard"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'rgba(255,255,255,0.8)',
                color: '#fff',
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#fff',
                  bgcolor: 'rgba(255,255,255,0.12)',
                },
              }}
            >
              {t('landing.tryNow')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              sx={{
                borderColor: 'rgba(255,255,255,0.6)',
                color: '#fff',
                borderRadius: 2,
                '&:hover': {
                  borderColor: '#fff',
                  bgcolor: 'rgba(255,255,255,0.08)',
                },
              }}
            >
              {t('landing.howItWorks')}
            </Button>
          </Stack>
        </Container>
      </Box>

      {/* Features */}
      <Container id="features" maxWidth="lg" sx={{ py: { xs: 6, sm: 10 }, px: 2 }}>
        <Typography
          variant="h5"
          fontWeight={600}
          textAlign="center"
          sx={{ mb: 1 }}
        >
          {t('landing.sectionTitle')}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          textAlign="center"
          sx={{ mb: 4, maxWidth: 480, mx: 'auto' }}
        >
          {t('landing.sectionSubtitle')}
        </Typography>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={{ xs: 3, md: 4 }}
          alignItems="stretch"
        >
          {featureKeys.map((f) => (
            <Box
              key={f.key}
              sx={{
                flex: 1,
                p: 3,
                borderRadius: 2,
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 3,
                },
              }}
            >
              <Box
                sx={{
                  width: 56,
                  height: 56,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mb: 2,
                }}
              >
                {f.icon}
              </Box>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                {t(`landing.features.${f.key}.title`)}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                {t(`landing.features.${f.key}.description`)}
              </Typography>
            </Box>
          ))}
        </Stack>

        {/* Bottom CTA */}
        <Box
          sx={{
            mt: { xs: 8, sm: 10 },
            py: 5,
            px: 2,
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: '#fff',
            textAlign: 'center',
          }}
        >
          <Typography variant="h6" fontWeight={600} gutterBottom>
            {t('landing.ctaTitle')}
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9, mb: 2 }}>
            {t('landing.ctaSubtitle')}
          </Typography>
          <Button
            component={RouterLink}
            to="/signup"
            variant="contained"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: '#fff',
              color: 'primary.main',
              borderRadius: 2,
              fontWeight: 600,
              '&:hover': { bgcolor: 'rgba(255,255,255,0.92)' },
            }}
          >
            {t('landing.createAccount')}
          </Button>
        </Box>
      </Container>

      {/* Footer */}
      <Box
        component="footer"
        sx={{
          py: 2,
          px: 2,
          borderTop: '1px solid',
          borderColor: 'divider',
          textAlign: 'center',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          {t('landing.footerAlready')}{' '}
          <Button
            component={RouterLink}
            to="/login"
            size="small"
            sx={{ textTransform: 'none', fontWeight: 600 }}
          >
            {t('landing.signInLink')}
          </Button>
        </Typography>
      </Box>
    </Box>
  );
}
