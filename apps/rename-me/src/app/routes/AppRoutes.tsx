import { Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

interface AppRoute {
  path: string;
  element: JSX.Element | string;
  name?: string;
  show?: boolean;
  protected?: boolean;
}

interface AppRoutesProps {
  routeList: AppRoute[];
}
/**
 * AppRoutes functional component
 *
 * Creates an array of <Route> elements from an array of AppRoute objects
 * if the route is protected, it wraps the route element in a <ProtectedRoute>
 * element and returns the result in a <Route> element, otherwise it just
 * returns the route element wrapped in a <Route> element
 *
 * @param {AppRoutesProps} { routeList = [] }
 * @returns {JSX.Element[]} array of <Route> elements
 */
const AppRoutes = ({ routeList = [] }: AppRoutesProps) => {
  return (
    <Routes>
      {Boolean(routeList.length) &&
        routeList
          // .filter((route) => route.show ?? false)
          .map((route) => {
            if (route.protected) {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<ProtectedRoute>{route.element}</ProtectedRoute>}
                />
              );
            } else {
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.element}
                />
              );
            }
          })}
    </Routes>
  );
};

export { AppRoute, AppRoutes };
