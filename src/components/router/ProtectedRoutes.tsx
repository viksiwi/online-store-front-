import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute: React.FC<{ redirectPath: string, children?: React.ReactNode }> = ({ redirectPath, children }) => {
  const { state: authState } = useContext(AuthContext);

  if (!authState.isAuth) {
    return <Navigate to={redirectPath} />;
  }

  return children ? <>{children}</> : <Outlet />;
};

const PublicRoute: React.FC<{ redirectPath: string, children?: React.ReactNode }> = ({ redirectPath, children }) => {
  const { state: authState } = useContext(AuthContext);

  if (authState.isAuth) {
    return <Navigate to={redirectPath} />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export { ProtectedRoute, PublicRoute };
