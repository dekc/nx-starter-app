import {
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  styled,
  useTheme,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { AppDataStore } from '../stores/AppDataStore';
import { useInstance } from 'react-ioc';
import { observer } from 'mobx-react-lite';
import { useNavigate } from 'react-router-dom';
import { AppRoute } from '../routes/AppRoutes';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
  },
}));

interface SideDrawerProps {
  routeList: AppRoute[];
}
/**
 * SideDrawer functional component
 * Creates a side drawer with a list of links represented as
 * a list of Mui ListItems from the routeList prop.
 * A route is listed if it has a name and show property set to true.
 *
 * @param {SideDrawerProps} { routeList = [] }
 * @returns {JSX.Element} a Mui Drawer component
 */
const SideDrawer = ({ routeList = [] }: SideDrawerProps) => {
  const appDataStore = useInstance(AppDataStore);
  const theme = useTheme();
  const navigate = useNavigate();

  const onClickListItem = (path: string) => {
    navigate(path);
    appDataStore.setLeftSideDrawerOpen(false);
  };

  const links = () => {
    return routeList
      .filter((route) => route.name && route.show)
      .map((route) => {
        return (
          <ListItem key={route.path} disablePadding>
            <ListItemButton onClick={() => onClickListItem(route.path)}>
              <ListItemText primary={route.name} />
            </ListItemButton>
          </ListItem>
        );
      });
  };

  const appLinks = () => <List>{links()}</List>;

  return (
    <div>
      <StyledDrawer
        anchor="left"
        open={appDataStore.leftSideDrawerOpen}
        onClose={() => appDataStore.toggleLeftSideDrawer()}
      >
        <DrawerHeader>
          <IconButton onClick={() => appDataStore.setLeftSideDrawerOpen(false)}>
            {theme.direction === 'ltr' ? <ChevronLeft /> : <ChevronRight />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        {appLinks()}
      </StyledDrawer>
    </div>
  );
};

export default observer(SideDrawer);
