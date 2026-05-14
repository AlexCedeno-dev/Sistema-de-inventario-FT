import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { apiRequest } from "../services/api";

interface AuthUser {
  usuario_id: number;
  nombre_completo: string;
  nomina?: string | null;
  correo: string;
  tipo_usuario: "IT" | "BECARIO";
}

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  user: AuthUser | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  const refreshSession = async () => {
    try {
      const data = await apiRequest<{ ok: boolean; user: AuthUser }>("/auth/me");
      setUser(data.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSession();
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const data = await apiRequest<{ ok: boolean; user: AuthUser }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            username,
            password,
          }),
        }
      );

      setUser(data.user);
      return true;
    } catch {
      setUser(null);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiRequest("/auth/logout", {
        method: "POST",
      });
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        user,
        login,
        logout,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
