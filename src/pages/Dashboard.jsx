import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActionArea,
  Typography,
  Link,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import MicIcon from '@mui/icons-material/Mic';
import TranslateIcon from '@mui/icons-material/Translate';
import { useLocale } from '../context/LocaleContext';

const toolKeys = [
  { key: 'tts', path: '/tts', icon: <RecordVoiceOverIcon sx={{ fontSize: 40 }} /> },
  { key: 'stt', path: '/stt', icon: <MicIcon sx={{ fontSize: 40 }} /> },
  { key: 'translate', path: '/translate', icon: <TranslateIcon sx={{ fontSize: 40 }} /> },
];

export default function Dashboard() {
  const { locale, setLocale, t, options } = useLocale();

  return (
    <Box sx={{ py: { xs: 2, sm: 3 } }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 1, mb: 2 }}>
        <Typography color="text.secondary" sx={{ mb: { xs: 2, sm: 3 } }}>
          {t('dashboard.intro')}{' '}
          <Link component={RouterLink} to="/learn" underline="hover">
            {t('dashboard.learnLink')}
          </Link>
        </Typography>
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="dashboard-lang-label">Language</InputLabel>
          <Select
            labelId="dashboard-lang-label"
            value={locale}
            label="Language"
            onChange={(e) => setLocale(e.target.value)}
          >
            {options.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {toolKeys.map((tool) => (
          <Grid item xs={12} sm={6} md={4} key={tool.path}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
            >
              <CardActionArea component={RouterLink} to={tool.path} sx={{ height: '100%', p: { xs: 2, sm: 2.5 }, textAlign: 'left' }}>
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  <Box
                    sx={{
                      color: 'primary.main',
                      mb: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'flex-start',
                    }}
                  >
                    {tool.icon}
                  </Box>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {t(`dashboard.${tool.key}.title`)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5 }}>
                    {t(`dashboard.${tool.key}.description`)}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
