import { Link, Outlet, useLocation } from 'react-router';
import { Monitor, Package, PlusCircle, Menu } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';

export function Layout() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const navigation = [
    { name: 'Dashboard', path: '/', icon: Monitor },
    { name: 'Inventario', path: '/inventory', icon: Package },
    { name: 'Registrar Equipo', path: '/register', icon: PlusCircle },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gradient-to-b from-blue-900 to-blue-700 text-white transition-all duration-300 flex flex-col`}
      >
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <div>
              <h1 className="font-bold text-xl">Sistema IT</h1>
              <p className="text-blue-200 text-sm">Gestión de Equipos</p>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white hover:bg-blue-800"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex-1 px-3 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-800 text-white'
                    : 'text-blue-100 hover:bg-blue-800/50'
                } ${!isSidebarOpen && 'justify-center'}`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isSidebarOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-blue-800">
          {isSidebarOpen ? (
            <div className="text-xs text-blue-200">
              <p>© 2026 Sistema IT</p>
              <p>Versión 1.0.0</p>
            </div>
          ) : (
            <div className="h-8" />
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
