import { Box, Paper, Toolbar, useTheme } from '@mui/material';
import { styled } from '@mui/system';
import { useInstance } from 'react-ioc';
import { ThemeDataStore } from '../theme/ThemeDataStore';
import { observer } from 'mobx-react-lite';

const StyledFooter = styled(Box)(({ theme }) => {
  console.log(theme);
  return {
    position: 'sticky',
    bottom: 0,
    zIndex: 1,
  };
});

const Footer = () => {
  const theme = useTheme();
  const themeDataStore = useInstance(ThemeDataStore);

  console.log(themeDataStore.mode);
  return (
    <StyledFooter>
      <Paper>
        <Toolbar>
          <footer>Footer</footer>
        </Toolbar>
      </Paper>
    </StyledFooter>
  );
};

export default observer(Footer);
