import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';
import MicIcon from '@mui/icons-material/Mic';
import TranslateIcon from '@mui/icons-material/Translate';
import KeyIcon from '@mui/icons-material/Key';
import { adminApi } from '../api/axios';

const FEATURE_LABELS = {
  tts: 'Text to Speech',
  stt: 'Speech to Text',
  translate: 'Translate',
};

export default function AdminDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/', { replace: true });
      return;
    }
    adminApi
      .getStats()
      .then(({ data }) => setStats(data))
      .catch((err) => setError(err.response?.data?.error || 'Failed to load stats'))
      .finally(() => setLoading(false));
  }, [user?.isAdmin, navigate]);

  if (!user?.isAdmin) return null;
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Box sx={{ py: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  if (!stats) return null;

  const {
    totalUsers,
    signupsLast7Days,
    usersWithApiKeyCount,
    creditsUsersWithKey,
    usage,
    mostUsedFeature,
    recentSignups,
  } = stats;
  const totalUsage = (usage?.tts ?? 0) + (usage?.stt ?? 0) + (usage?.translate ?? 0);

  const statCards = [
    {
      title: 'Total users',
      value: totalUsers,
      icon: <PeopleIcon sx={{ fontSize: 32 }} />,
    },
    {
      title: 'Signups (last 7 days)',
      value: signupsLast7Days,
      icon: <TrendingUpIcon sx={{ fontSize: 32 }} />,
    },
    {
      title: "App's shared credit",
      value: `₹${user?.credits ?? 0}`,
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 32 }} />,
    },
    {
      title: 'Users with API key',
      value: usersWithApiKeyCount ?? 0,
      icon: <KeyIcon sx={{ fontSize: 32 }} />,
    },
    {
      title: 'In-app credits (users with key)',
      value: `₹${creditsUsersWithKey ?? 0}`,
      icon: <AccountBalanceWalletIcon sx={{ fontSize: 32 }} />,
    },
    {
      title: 'Most used feature',
      value: mostUsedFeature ? FEATURE_LABELS[mostUsedFeature] : '—',
      icon:
        mostUsedFeature === 'tts' ? (
          <RecordVoiceOverIcon sx={{ fontSize: 32 }} />
        ) : mostUsedFeature === 'stt' ? (
          <MicIcon sx={{ fontSize: 32 }} />
        ) : (
          <TranslateIcon sx={{ fontSize: 32 }} />
        ),
    },
  ];

  return (
    <Box sx={{ py: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Admin dashboard
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 3 }}>
        Overview of users and feature usage.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {statCards.map((card) => (
          <Grid item xs={12} sm={6} md={3} key={card.title}>
            <Card sx={{ height: '100%', borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ color: 'primary.main', mb: 1 }}>{card.icon}</Box>
                <Typography variant="body2" color="text.secondary">
                  {card.title}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                  {card.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Feature usage
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" elevation={0} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <RecordVoiceOverIcon color="primary" />
                <Typography fontWeight={600}>Text to Speech</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {usage?.tts ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalUsage > 0 ? Math.round(((usage?.tts ?? 0) / totalUsage) * 100) : 0}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" elevation={0} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <MicIcon color="primary" />
                <Typography fontWeight={600}>Speech to Text</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {usage?.stt ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalUsage > 0 ? Math.round(((usage?.stt ?? 0) / totalUsage) * 100) : 0}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card variant="outlined" elevation={0} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <TranslateIcon color="primary" />
                <Typography fontWeight={600}>Translate</Typography>
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {usage?.translate ?? 0}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {totalUsage > 0 ? Math.round(((usage?.translate ?? 0) / totalUsage) * 100) : 0}% of total
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
        Recent signups
      </Typography>
      <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 2 }}>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: 'action.hover' }}>
              <TableCell>Email</TableCell>
              <TableCell align="right">Signed up</TableCell>
              <TableCell align="right">Last active</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {recentSignups?.length ? (
              recentSignups.map((row) => (
                <TableRow key={row.email}>
                  <TableCell>{row.email}</TableCell>
                  <TableCell align="right">
                    {row.createdAt
                      ? new Date(row.createdAt).toLocaleString(undefined, {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })
                      : '—'}
                  </TableCell>
                  <TableCell align="right">
                    {row.lastActiveAt
                      ? new Date(row.lastActiveAt).toLocaleString(undefined, {
                          dateStyle: 'short',
                          timeStyle: 'short',
                        })
                      : '—'}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                  No signups yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
