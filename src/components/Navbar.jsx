import { useState } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { useLocale } from '../context/LocaleContext';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import HistoryIcon from '@mui/icons-material/History';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const NAV_ITEMS_LOGGED_IN = [
  { key: 'dashboard', path: '/', icon: <DashboardIcon /> },
  { key: 'learn', path: '/learn', icon: <MenuBookIcon /> },
  { key: 'history', path: '/history', icon: <HistoryIcon /> },
  { key: 'settings', path: '/settings', icon: <SettingsIcon /> },
];

const NAV_ITEMS_ANONYMOUS = [
  { key: 'dashboard', path: '/dashboard', icon: <DashboardIcon /> },
  { key: 'learn', path: '/learn', icon: <MenuBookIcon /> },
];

function getNavItems(user) {
  const items = user ? [...NAV_ITEMS_LOGGED_IN] : [...NAV_ITEMS_ANONYMOUS];
  if (user?.isAdmin) {
    items.push({ key: 'admin', path: '/admin', icon: <AdminPanelSettingsIcon /> });
  }
  return items;
}

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { user } = useUser();
  const { t } = useLocale();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setDrawerOpen(false);
    navigate('/login');
  };

  const navItems = getNavItems(user);
  const navContent = (isDrawer = false) => (
    <>
      {navItems.map(({ key, path, icon }) => {
        const label = t(`nav.${key}`);
        const isActive = location.pathname === path || (path !== '/' && location.pathname.startsWith(path));
        const link = (
          <Typography
            component={RouterLink}
            to={path}
            onClick={() => isDrawer && setDrawerOpen(false)}
            sx={{
              color: isActive ? 'primary.contrastText' : 'inherit',
              textDecoration: 'none',
              fontWeight: isActive ? 600 : 400,
              opacity: isActive ? 1 : 0.9,
              px: isDrawer ? 0 : 1.5,
              py: isDrawer ? 0 : 0.5,
              borderRadius: 1,
              '&:hover': { opacity: 1, bgcolor: isDrawer ? 'action.hover' : 'rgba(255,255,255,0.08)' },
            }}
          >
            {label}
          </Typography>
        );
        if (isDrawer) {
          return (
            <ListItem key={path} disablePadding>
              <ListItemButton component={RouterLink} to={path} onClick={() => setDrawerOpen(false)} selected={isActive}>
                <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{icon}</ListItemIcon>
                <ListItemText primary={label} />
              </ListItemButton>
            </ListItem>
          );
        }
        return <Box key={path}>{link}</Box>;
      })}
    </>
  );

  return (
    <>
      <AppBar position="sticky" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ minHeight: { xs: 56 }, px: { xs: 1, sm: 2 } }}>
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            aria-label="Open menu"
            onClick={() => setDrawerOpen(true)}
            sx={{ display: { xs: 'block', md: 'none' }, mr: 1 }}
          >
            <MenuIcon />
          </IconButton>

          {/* Brand — always links to landing so users can get "home" from anywhere */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/landing"
            sx={{
              color: 'inherit',
              textDecoration: 'none',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              mr: { xs: 1, md: 3 },
            }}
          >
            {t('nav.brand')}
          </Typography>

          {/* Desktop nav */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 0.5, flexGrow: 1 }}>
            {navContent(false)}
          </Box>

          {/* User section: Sign in / Sign up when anonymous, logout when logged in */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 'auto' }}>
            {user ? (
              <>
                <Button
                  color="inherit"
                  startIcon={<LogoutIcon />}
                  onClick={handleLogout}
                  size="small"
                  sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
                >
                  {t('nav.logout')}
                </Button>
                <IconButton color="inherit" onClick={handleLogout} aria-label="Logout" sx={{ display: { xs: 'block', sm: 'none' } }}>
                  <LogoutIcon />
                </IconButton>
              </>
            ) : (
              <>
                <Button component={RouterLink} to="/login" color="inherit" size="small" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                  {t('nav.signIn')}
                </Button>
                <Button component={RouterLink} to="/signup" variant="contained" size="small" sx={{ display: { xs: 'none', sm: 'inline-flex' } }}>
                  {t('nav.signUp')}
                </Button>
                <IconButton component={RouterLink} to="/login" color="inherit" aria-label="Sign in" sx={{ display: { xs: 'block', sm: 'none' } }}>
                  <LogoutIcon />
                </IconButton>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: 280, pt: 2 },
        }}
      >
        <List sx={{ pt: 1 }}>
          {navContent(true)}
          {user ? (
            <ListItem disablePadding>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary={t('nav.logout')} />
              </ListItemButton>
            </ListItem>
          ) : (
            <>
              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/login" onClick={() => setDrawerOpen(false)}>
                  <ListItemIcon>
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary={t('nav.signIn')} />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component={RouterLink} to="/signup" onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary={t('nav.signUp')} />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </Drawer>
    </>
  );
}
