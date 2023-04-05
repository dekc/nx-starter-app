import { Box, styled } from '@mui/material';
import { ReactNode } from 'react';

import { AppRoute, AppRoutes } from '../routes/AppRoutes';
import SideDrawer from './SideDrawer';

const StyledContent = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  paddingBottom: '2rem',
  flex: 1,
});

interface ContentProps {
  routes?: AppRoute[];
  children?: ReactNode;
}

const Content = ({ routes = [], children = null }: ContentProps) => {
  return (
    <StyledContent>
      <main>{children}</main>
      <AppRoutes routeList={routes} />
      <SideDrawer routeList={routes} />
    </StyledContent>
  );
};

export default Content;
