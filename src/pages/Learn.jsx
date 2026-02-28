import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import KeyIcon from '@mui/icons-material/Key';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import { useLocale } from '../context/LocaleContext';

const SARVAM_DASHBOARD = 'https://dashboard.sarvam.ai/';

export default function Learn() {
  const { t } = useLocale();

  return (
    <Box sx={{ py: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
        {t('learn.title')}
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        {t('learn.subtitle')}
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          {t('learn.tryWithoutSignupTitle') || 'Try without signing up'}
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {t('learn.tryWithoutSignupBody') || "You can try each tool a few times with no account: 3 Text-to-Speech tries, 2 Speech-to-Text tries, and 3 Translation tries. Sign up for full access, 1,000 free credits, history, and the option to use your own Sarvam API key."}
        </Typography>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 2 }}>
          <InfoIcon color="primary" sx={{ mt: 0.25 }} />
          <Box>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              {t('learn.whatTitle')}
            </Typography>
            <Typography color="text.secondary" sx={{ mb: 1 }}>
              {t('learn.whatBody')}
            </Typography>
          </Box>
        </Box>
      </Paper>

      <Typography variant="h6" fontWeight={600} sx={{ mb: 1.5 }}>
        {t('learn.twoWaysTitle')}
      </Typography>

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <KeyIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={600}>
            {t('learn.option1Title')}
          </Typography>
        </Box>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          {t('learn.option1Body')}
        </Typography>
        <Typography variant="subtitle2" fontWeight={600} gutterBottom>
          {t('learn.option1HowTo')}
        </Typography>
        <List dense disablePadding>
          <ListItem sx={{ alignItems: 'flex-start', py: 0.25 }}>
            <ListItemIcon sx={{ minWidth: 28, mt: 0.25 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary={t('learn.step1')} secondary={<Link href={SARVAM_DASHBOARD} target="_blank" rel="noopener noreferrer">dashboard.sarvam.ai</Link>} />
          </ListItem>
          <ListItem sx={{ alignItems: 'flex-start', py: 0.25 }}>
            <ListItemIcon sx={{ minWidth: 28, mt: 0.25 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary={t('learn.step2')} />
          </ListItem>
          <ListItem sx={{ alignItems: 'flex-start', py: 0.25 }}>
            <ListItemIcon sx={{ minWidth: 28, mt: 0.25 }}>
              <CheckCircleIcon color="success" sx={{ fontSize: 20 }} />
            </ListItemIcon>
            <ListItemText primary={t('learn.step3')} />
          </ListItem>
        </List>
        <Button component={RouterLink} to="/settings" variant="outlined" size="small" sx={{ mt: 2 }}>
          {t('learn.goToSettings')}
        </Button>
      </Paper>

      <Paper sx={{ p: { xs: 2, sm: 3 }, mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
          <AccountBalanceWalletIcon color="primary" />
          <Typography variant="subtitle1" fontWeight={600}>
            {t('learn.option2Title')}
          </Typography>
        </Box>
        <Typography color="text.secondary">
          {t('learn.option2Body')}
        </Typography>
      </Paper>

      <Typography variant="body2" color="text.secondary">
        {t("learn.balanceNote")}{' '}
        <Link href="https://docs.sarvam.ai/" target="_blank" rel="noopener noreferrer">
          {t('learn.sarvamDocs')}
        </Link>.
      </Typography>
    </Box>
  );
}
