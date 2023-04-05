import React, { SyntheticEvent } from 'react';
import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  styled,
} from '@mui/material';
import { Brightness4, Brightness7, Menu } from '@mui/icons-material';
import { ThemeDataStore } from '../theme/ThemeDataStore';
import { useInstance } from 'react-ioc';
import { observer } from 'mobx-react-lite';
import { AppDataStore } from '../stores/AppDataStore';

const TITLE = import.meta.env.VITE_TITLE ?? 'rename-me';

const StyledHeader = styled(Box)(({ theme }) => ({
  position: 'sticky',
  top: 0,

  zIndex: 1,
  ...theme.mixins.toolbar,
}));

const Header = () => {
  const appDataStore = useInstance(AppDataStore);
  const themeDataStore = useInstance(ThemeDataStore);

  const onMenuButtonClick = (
    event: SyntheticEvent<HTMLButtonElement, Event>
  ): void => {
    console.debug('onMenuButtonClick', event);
    appDataStore.setLeftSideDrawerOpen(true);
  };

  const onClickMode = (): void => {
    themeDataStore.toggleMode();
  };

  return (
    <StyledHeader>
      <AppBar>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            aria-label="menu"
            size="large"
            onClick={onMenuButtonClick}
          >
            <Menu />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {TITLE}
          </Typography>
          <IconButton onClick={onClickMode}>
            {themeDataStore.mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </StyledHeader>
  );
};

export default observer(Header);
