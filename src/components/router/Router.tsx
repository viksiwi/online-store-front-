import { useRoutes, Navigate } from 'react-router-dom';

import { AuthPage } from '../../pages/auth/Auth.tsx';
import { Main } from '../../pages/main/Main.tsx';
import { Profile } from '../../pages/profile/Profile.tsx';
import { ProtectedRoute, PublicRoute } from './ProtectedRoutes.tsx';
import { Cart } from '../../pages/cart/Cart.tsx';
import { Orders } from '../../pages/orders/Order.tsx';

const routes = [
  {
    path: '/wb-front/',
    element: <Main />,
  },
  {
    path: '/wb-front/login/',
    element: (
      <PublicRoute redirectPath="/wb-front/main/">
        <AuthPage />
      </PublicRoute>
    ),
  },
  {
    path: '/wb-front/profile/',
    element: (
      <ProtectedRoute redirectPath="/wb-front/main/">
        <Profile />
      </ProtectedRoute>
    ),
  },
  {
    path: '/wb-front/cart/',
    element: (
      <ProtectedRoute redirectPath="/wb-front/login/">
        <Cart />
      </ProtectedRoute>
    ),
  },
  {
    path: '/wb-front/orders/',
    element: (
      <ProtectedRoute redirectPath="/wb-front/login/">
        <Orders />
      </ProtectedRoute>
    ),
  },
];

export const Router = () => {
  return useRoutes([...routes, { path: '*', element: <Navigate to="/wb-front/" /> }]);
};