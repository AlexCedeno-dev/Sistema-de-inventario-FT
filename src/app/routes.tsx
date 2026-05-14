import { createBrowserRouter, Navigate, useLocation } from 'react-router';
import type { ReactNode } from 'react';

import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Inventory } from './pages/Inventory';
import { InventoryNew } from './pages/InventoryNew';
import { Register } from './pages/Register';
import { Login } from './pages/Login';
import { Home } from './pages/Home';
import { Agentes } from './pages/Agentes';
import { InventoryABC } from './pages/InventoryABC';
import { useAuth } from './context/AuthContext';
import { FirmaEquipo } from './pages/FirmaEquipo';
import { HistorialEntregas } from './pages/HistorialEntregas';
import { ValidarEquipoQR } from './pages/ValidarEquipoQR';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-700 font-medium">Validando sesión...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  return <>{children}</>;
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <p className="text-slate-700 font-medium">Validando sesión...</p>
      </div>
    );
  }

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
      path: 'firma/:token',
      Component: FirmaEquipo,
    },
    {
      path: 'validar-equipo/:token',
      Component: ValidarEquipoQR,
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
          path: 'inventory-abc',
          Component: InventoryABC,
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
        {
          path: 'historial-entregas',
          Component: HistorialEntregas,
        },
      ],
    },
  ],
  {
    basename,
  }
);
