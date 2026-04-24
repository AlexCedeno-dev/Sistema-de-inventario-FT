import { createBrowserRouter, Navigate } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { InventoryNew } from './pages/InventoryNew';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import {Agentes} from './pages/Agentes';
import { InventoryABC } from './pages/InventoryABC';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

const basename = import.meta.env.DEV ? '/' : '/inventory-it';

export const router = createBrowserRouter(
  [
    {
      path: '/login',
      element: (
        <PublicRoute>
          <Login />
        </PublicRoute>
      ),
    },
    {
      path: '/',
      element: (
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          index: true,
          Component: Home,
        },
        {
          path: 'dashboard',
          Component: Dashboard,
        },
        {
          path: 'inventory-old',
          Component: Inventory,
        },
        {
        path: "inventory-abc",
        Component: InventoryABC
        },
        {
          path: 'inventory-new',
          Component: InventoryNew,
        },
        {
          path: 'agentes',
          Component: Agentes,
        },
        {
          path: 'register',
          Component: Register,
        },
      ],
    },
  ],
  {
    basename,
  }
);