import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';
import { useInstance } from 'react-ioc';
import { observer } from 'mobx-react-lite';

import { ThemeDataStore } from './ThemeDataStore';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      paper: '#121212',
    },
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
    background: {
      paper: '#fafafa',
    },
  },
});

const Theme = observer(({ children }: { children: React.ReactNode }) => {
  const themeStore = useInstance(ThemeDataStore);

  return (
    <ThemeProvider theme={themeStore.mode === 'dark' ? darkTheme : lightTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
});

export default Theme;
