import { observer } from 'mobx-react-lite';
import React from 'react';
import { useInstance } from 'react-ioc';
import { Navigate, useLocation } from 'react-router-dom';

import { AppDataStore } from '../stores/AppDataStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = observer(({ children }: ProtectedRouteProps) => {
  const appStore = useInstance(AppDataStore);
  const location = useLocation();

  if (!appStore.authenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <div>{children}</div>;
});

export { ProtectedRoute, ProtectedRouteProps };
