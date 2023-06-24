import { AppRoute } from './routes/AppRoutes';
import { Home } from './pages/Home';
import { NotFound } from './pages/NotFound';
import { Maps } from './pages/maps';
import { Dashboard } from './pages/Dashboard';
import { Login } from './pages/Login';

const routes: AppRoute[] = [
  {
    path: '/',
    element: <Home />,
    name: 'Home',
    show: true,
    protected: false,
  },
  {
    path: '/dashboard',
    element: <Dashboard />,
    name: 'Dashboard',
    show: true,
    protected: true,
  },
  {
    path: '/maps',
    element: <Maps />,
    name: 'Maps',
    show: true,
    protected: false,
  },
  {
    path: '*',
    element: <NotFound />,
    show: false,
    protected: false,
  },
  {
    path: '/login',
    element: <Login />,
    show: false,
    protected: false,
  },
];

export { routes };
