import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#0d47a1' },
    secondary: { main: '#1565c0' },
    background: { default: '#f5f5f5', paper: '#ffffff' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiCard: {
      defaultProps: { elevation: 1 },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0 },
    },
  },
});

export default theme;
