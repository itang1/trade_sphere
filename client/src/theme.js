import { createTheme } from '@mui/material/styles';

export const colors = {
  teal: '#3C6E71',
  tealDark: '#284B63',
  sand: '#F2ECE1',
  cream: '#F8F7F1',
  border: '#E4DCCB',
  accent: '#D9822B',
};

export const theme = createTheme({
  palette: {
    primary: { main: colors.teal, dark: colors.tealDark },
    secondary: { main: colors.accent },
    background: { default: colors.cream, paper: '#FFFFFF' },
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter", "Helvetica Neue", Arial, sans-serif',
    h1: { fontSize: '2.25rem', fontWeight: 700, color: colors.tealDark },
    h2: { fontSize: '1.5rem', fontWeight: 600, color: colors.tealDark },
    h3: { fontSize: '1.15rem', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: { a: { color: colors.teal, fontWeight: 600 } },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600 } },
    },
    MuiToggleButton: {
      styleOverrides: { root: { textTransform: 'none', fontWeight: 600, paddingInline: 12 } },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { border: `1px solid ${colors.border}` } },
    },
    MuiAppBar: {
      styleOverrides: { root: { border: 'none' } },
    },
  },
});
