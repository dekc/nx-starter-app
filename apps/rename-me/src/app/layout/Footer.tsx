import { Box, Paper, Toolbar, styled } from '@mui/material';
import { useInstance } from 'react-ioc';
import { ThemeDataStore } from '../theme/ThemeDataStore';
import { observer } from 'mobx-react-lite';

const StyledFooter = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: 0,
  zIndex: 1,
  height: '64px',
  width: '100%',
  opacity: 0.5,
  borderTop: `2px solid ${theme.palette.primary.main}`,
}));

const Footer = () => {
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
