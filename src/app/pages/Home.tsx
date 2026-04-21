import { useEffect, useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Monitor,
  Activity,
  Package,
  TrendingUp,
  Clock,
  AlertTriangle,
} from 'lucide-react';

type MonitoringDevice = {
  hostname: string | null;
  ip: string | null;
  mac: string | null;
  usuario: string | null;
  empleado: string | null;
  serviceTag: string | null;
  idEmpleado: string | null;
  departamento: string | null;
  plataforma: string | null;
  tipoSistema: string | null;
  uptime: number | null;
  ubicacion: string | null;
  fecha: string | null;
  lastSeen: string | null;
  estado: string | null;
  cpu: {
    modelo: string | null;
    nucleos: number | null;
    velocidad_mhz: number | null;
    temperatura: number | null;
  };
  ram: {
    totalGB: number | null;
    libreGB: number | null;
    usoGB: number | null;
    porcentaje: number | null;
  };
  discos: {
    disco: string | null;
    tamañoGB: number | null;
    usadoGB: number | null;
    porcentaje: number | null;
  }[];
  sistema: {
    edicion: string | null;
    version: string | null;
    instalado: string | null;
    build: string | null;
    especificacion: string | null;
    idDispositivo: string | null;
    idProducto: string | null;
  };
  inventario: {
    status: string | null;
    nombre_completo: string | null;
    empleado_id: string | null;
    departamento: string | null;
    service_tag: string | null;
  } | null;
};

export function Home() {
const [devices, setDevices] = useState<MonitoringDevice[]>([]);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3006';

  const normalizarTag = (value: any) =>
    String(value ?? '')
      .trim()
      .toUpperCase();

  useEffect(() => {
    const loadDevices = async () => {
      try {
        const [equiposRes, identificadosRes] = await Promise.all([
          fetch(`${API_BASE}/equipos-local`),
          fetch(`${API_BASE}/equipos-identificados-local`),
        ]);

        const equipos = await equiposRes.json();
        const identificados = await identificadosRes.json();

        const mapaIdentificados = new Map();

        identificados.forEach((item: any) => {
          const tag = normalizarTag(
            item?.inventario?.service_tag ?? item?.sistema?.idDispositivo
          );

          if (tag) {
            mapaIdentificados.set(tag, item);
          }
        });

        const normalized: MonitoringDevice[] = equipos.map((device: any) => {
          const serviceTag = normalizarTag(device?.sistema?.idDispositivo);
          const match = mapaIdentificados.get(serviceTag);

          return {
            hostname: device?.hostname ?? null,
            ip: device?.ip ?? null,
            mac: device?.mac ?? null,
            usuario: device?.usuario ?? null,
            empleado: match?.inventario?.nombre_completo ?? null,
            idEmpleado: match?.inventario?.empleado_id != null
              ? String(match.inventario.empleado_id)
              : null,
            departamento: match?.inventario?.departamento ?? null,
            serviceTag:
              match?.inventario?.service_tag ??
              match?.sistema?.idDispositivo ??
              device?.sistema?.idDispositivo ??
              null,
            plataforma: match?.plataforma ?? null,
            tipoSistema: match?.tipoSistema ?? null,
            uptime: match?.uptime ?? null,
            ubicacion: match?.ubicacion ?? null,
            fecha: device?.fecha ?? null,
            lastSeen: device?.lastSeen ?? null,
            estado: device?.estado ?? null,

            cpu: {
              modelo: device?.cpu?.modelo ?? null,
              nucleos: device?.cpu?.nucleos ?? null,
              velocidad_mhz: device?.cpu?.velocidad_mhz ?? null,
              temperatura: device?.cpu?.temperatura ?? null,
            },

            ram: {
              totalGB: device?.ram?.totalGB ?? null,
              libreGB: device?.ram?.libreGB ?? null,
              usoGB: device?.ram?.usoGB ?? null,
              porcentaje: device?.ram?.porcentaje ?? null,
            },

            discos: Array.isArray(device?.discos)
              ? device.discos.map((disco: any) => ({
                  disco: disco?.disco ?? null,
                  tamañoGB: disco?.tamañoGB ?? null,
                  usadoGB: disco?.usadoGB ?? null,
                  porcentaje: disco?.porcentaje ?? null,
                }))
              : [],

            sistema: {
              edicion: device?.sistema?.edicion ?? null,
              version: device?.sistema?.version ?? null,
              instalado: device?.sistema?.instalado ?? null,
              build: device?.sistema?.build ?? null,
              especificacion: device?.sistema?.especificacion ?? null,
              idDispositivo: device?.sistema?.idDispositivo ?? null,
              idProducto: device?.sistema?.idProducto ?? null,
            },

            inventario: match?.inventario
              ? {
                  status: match.inventario?.status ?? null,
                  nombre_completo: match.inventario?.nombre_completo ?? null,
                  empleado_id: match.inventario?.empleado_id != null
                    ? String(match.inventario.empleado_id)
                    : null,
                  departamento: match.inventario?.departamento ?? null,
                  service_tag: match.inventario?.service_tag ?? null,
                }
              : null,
          };
        });

        setDevices(normalized);
      } catch (error) {
        console.error('Error cargando datos del Home:', error);
      }
    };

    loadDevices();
  }, [API_BASE]);

  // Últimas 24 horas - simulación
  const last24Hours = {
    newDevices: 2,
    updatedDevices: 5,
    alerts: 3,
  };

  const onlineDevices = useMemo(
    () => devices.filter((d) => (d.estado ?? '').includes('Online')),
    [devices]
  );

  const offlineDevices = useMemo(
    () => devices.filter((d) => (d.estado ?? '').includes('Offline')),
    [devices]
  );

  const activeInventory = useMemo(
    () => devices.filter((d) => (d.inventario?.status ?? '').toLowerCase() === 'activo'),
    [devices]
  );

  // Equipos críticos (disco > 85%)
  const criticalDevices = useMemo(
    () =>
      devices.filter((device) =>
        device.discos.some((disco) => (disco.porcentaje ?? 0) > 85)
      ),
    [devices]
  );

  // Últimas actualizaciones (últimos 3 equipos)
  const recentUpdates = useMemo(() => devices.slice(0, 3), [devices]);

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">Bienvenido al Sistema IT</h1>
        <p className="text-gray-500 mt-2 text-lg">
          Resumen general y actualizaciones de las últimas 24 horas
        </p>
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipos</CardTitle>
            <Monitor className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{devices.length}</div>
            <p className="text-xs text-gray-500 mt-1">Monitoreo en tiempo real</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipos Online</CardTitle>
            <Activity className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{onlineDevices.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {devices.length > 0
                ? `${((onlineDevices.length / devices.length) * 100).toFixed(0)}% disponibilidad`
                : '0% disponibilidad'}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventario Activo</CardTitle>
            <Package className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{activeInventory.length}</div>
            <p className="text-xs text-gray-500 mt-1">Equipos asignados</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Alertas Críticas</CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{criticalDevices.length}</div>
            <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
          </CardContent>
        </Card>
      </div>

      {/* Actualizaciones de las Últimas 24 Horas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <CardTitle>Actividad de las Últimas 24 Horas</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white p-2 rounded-full">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold">Nuevos Equipos</p>
                  <p className="text-sm text-gray-500">Registrados en el sistema</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-blue-600">{}</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 text-white p-2 rounded-full">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold">Actualizaciones</p>
                  <p className="text-sm text-gray-500">Cambios de configuración</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-green-600">{}</div>
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-orange-600 text-white p-2 rounded-full">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold">Nuevas Alertas</p>
                  <p className="text-sm text-gray-500">Problemas detectados</p>
                </div>
              </div>
              <div className="text-2xl font-bold text-orange-600">{}</div>
            </div>
          </CardContent>
        </Card>

        {/* Equipos Actualizados Recientemente */}
        <Card>
          <CardHeader>
            <CardTitle>Actualizaciones Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUpdates.map((device, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold font-mono text-sm">
                        {device.hostname ?? 'NULL'}
                      </p>
                      <Badge
                        variant={(device.estado ?? '').includes('Online') ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {device.estado ?? 'NULL'}
                      </Badge>
                    </div>

                    <p className="text-sm text-gray-500">
                      {device.empleado ?? 'NULL'}
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Última actualización:{' '}
                      {device.lastSeen
                        ? new Date(device.lastSeen).toLocaleString('es-MX')
                        : 'NULL'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <Monitor className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Total Monitoreados</p>
              <p className="text-3xl font-bold text-blue-600">{devices.length}</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Online</p>
              <p className="text-3xl font-bold text-green-600">{onlineDevices.length}</p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Offline</p>
              <p className="text-3xl font-bold text-red-600">{offlineDevices.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}