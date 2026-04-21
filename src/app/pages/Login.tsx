import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Monitor, Lock, User } from "lucide-react";
import { toast } from "sonner";

export function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (login(username, password)) {
      toast.success("Inicio de sesión exitoso", {
        description: `Bienvenido ${username}`,
      });
      navigate("/");
    } else {
      toast.error("Error de autenticación", {
        description: "Usuario o contraseña incorrectos",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-700 to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-white p-4 rounded-full">
              <Monitor className="h-12 w-12 text-blue-900" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">
            Sistema IT
          </h1>
          <p className="text-blue-200">
            Gestión de Equipos de Cómputo
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-center">
              Iniciar Sesión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Usuario</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Ingresa tu usuario"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingresa tu contraseña"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full">
                Ingresar al Sistema
              </Button>

              <div className="text-center text-sm text-gray-500 mt-4">
                <p>Demo: admin / admin123</p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6 text-blue-200 text-sm">
          <p>© 2026 Sistema IT - Versión 1.0.0</p>
        </div>
      </div>
    </div>
  );
}