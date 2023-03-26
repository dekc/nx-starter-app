import { Box, styled } from '@mui/material';
import { ReactNode } from 'react';

import { AppRoute, AppRoutes } from '../routes/AppRoutes';
import SideDrawer from './SideDrawer';

const StyledContent = styled(Box)({
  flex: 1,
});

interface ContentProps {
  routes?: AppRoute[];
  main?: ReactNode;
}

const Content = ({ routes = [], main = null }: ContentProps) => {
  return (
    <StyledContent>
      <main>{main}</main>
      <AppRoutes routeList={routes} />
      <SideDrawer routeList={routes} />
    </StyledContent>
  );
};

export default Content;
