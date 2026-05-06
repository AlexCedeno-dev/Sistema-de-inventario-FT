import { useEffect, useMemo, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { MonitoringDetailsModal } from '../components/MonitoringDetailsModal';
import {
  Monitor,
  Activity,
  HardDrive,
  AlertTriangle,
  Search,
  Cpu,
  MemoryStick,
  MapPin,
  RefreshCw,
} from 'lucide-react';
import { Progress } from '../components/ui/progress';
import {
  obtenerDashboardMonitoreo,
  type MonitoringDevice,
} from '../services/monitoringApi';

function toText(value: unknown, fallback = 'N/A') {
  if (
    value === null ||
    value === undefined ||
    value === '' ||
    value === 'NULL' ||
    value === 'null'
  ) {
    return fallback;
  }

  return String(value);
}

function toNumber(value: unknown, fallback = 0) {
  if (typeof value === 'number' && !Number.isNaN(value)) return value;

  const num = Number(value);

  return Number.isFinite(num) ? num : fallback;
}

function formatDate(value: string | null | undefined) {
  if (!value) return 'Sin fecha';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return 'Sin fecha';

  return date.toLocaleString('es-MX');
}

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [devices, setDevices] = useState<MonitoringDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<MonitoringDevice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [error, setError] = useState('');
  const loadingRef = useRef(false);

  const loadDevices = async () => {
    if (loadingRef.current) return;

    try {
      loadingRef.current = true;
      setLoading(true);
      setError('');

      const data = await obtenerDashboardMonitoreo();

      setDevices(data);
      setLastRefresh(new Date());

      setSelectedDevice((current) => {
        if (!current) return current;

        const updated = data.find(
          (dev) => dev.monitoreoId === current.monitoreoId
        );

        return updated || current;
      });
    } catch (err) {
      console.error('Error cargando dashboard-monitoreo:', err);
      setError(err instanceof Error ? err.message : 'Error cargando dashboard');
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  };

      useEffect(() => {
        loadDevices();

        const interval = setInterval(loadDevices, 30000);

        return () => clearInterval(interval);
      }, []);

  const onlineDevices = useMemo(
    () => devices.filter((d) => d.estado?.includes('Online')),
    [devices]
  );

  const offlineDevices = useMemo(
    () => devices.filter((d) => d.estado?.includes('Offline')),
    [devices]
  );

  const highDiskUsage = useMemo(
    () =>
      devices.filter((device) =>
        device.discos?.some((disco) => toNumber(disco.porcentaje) > 85)
      ).length,
    [devices]
  );

  const devicesWithLocation = useMemo(
    () =>
      devices.filter(
        (device) =>
          device.ubicacion?.ciudad &&
          device.ubicacion.ciudad !== 'N/A'
      ).length,
    [devices]
  );

  const filteredDevices = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return devices.filter((device) => {
      const searchableText = `
        ${device.hostname ?? ''}
        ${device.empleado ?? ''}
        ${device.ip ?? ''}
        ${device.usuario ?? ''}
        ${device.serviceTag ?? ''}
        ${device.idEmpleado ?? ''}
        ${device.departamento ?? ''}
        ${device.planta ?? ''}
        ${device.marca ?? ''}
        ${device.modelo ?? ''}
        ${device.ubicacion?.texto ?? ''}
        ${device.ubicacion?.ipPublica ?? ''}
      `.toLowerCase();

      return searchableText.includes(term);
    });
  }, [devices, searchTerm]);

  const handleViewDetails = (device: MonitoringDevice) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-8 w-8" />
              <h1 className="text-4xl font-bold">Dashboard de Monitoreo</h1>
            </div>

            <p className="text-blue-100 text-lg">
              Vista en tiempo real del estado de los equipos registrados
            </p>

            <p className="text-blue-100 text-sm mt-2">
              Última actualización:{' '}
              {lastRefresh ? lastRefresh.toLocaleTimeString('es-MX') : 'Sin actualizar'}
            </p>
          </div>

          <Button
            type="button"
            variant="secondary"
            className="rounded-xl"
            onClick={loadDevices}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card className="shadow-md border-0 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipos</CardTitle>
            <Monitor className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.length}</div>
            <p className="text-xs text-gray-500 mt-1">Equipos registrados</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Online</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {onlineDevices.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {devices.length > 0
                ? `${((onlineDevices.length / devices.length) * 100).toFixed(0)}% disponibilidad`
                : '0% disponibilidad'}
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Offline</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {offlineDevices.length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Discos Críticos</CardTitle>
            <HardDrive className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {highDiskUsage}
            </div>
            <p className="text-xs text-gray-500 mt-1">Uso de disco &gt; 85%</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Con Ubicación</CardTitle>
            <MapPin className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {devicesWithLocation}
            </div>
            <p className="text-xs text-gray-500 mt-1">Ubicación IP pública</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por hostname, empleado, IP, service tag, modelo, planta o ubicación..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 h-11 rounded-xl border-gray-200 shadow-sm"
          />
        </div>
      </div>

      <Card className="shadow-md border-0 rounded-2xl">
        <CardHeader>
          <CardTitle>Equipos Monitoreados</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto rounded-xl">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-slate-100/80">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Hostname</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Empleado</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Usuario Windows</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Service Tag</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Equipo</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">IP Local</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Ubicación</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">CPU</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">RAM</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Disco</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Última conexión</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Acciones</th>
                </tr>
              </thead>

              <tbody>
                {filteredDevices.map((device) => {
                  const maxDiskUsage = device.discos?.length
                    ? Math.max(...device.discos.map((d) => toNumber(d.porcentaje)))
                    : 0;

                  const ramUsage = toNumber(device.ram?.porcentaje);

                  return (
                    <tr
                      key={device.monitoreoId}
                      className="border-b hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            device.estado?.includes('Online')
                              ? 'default'
                              : 'destructive'
                          }
                          className="text-xs whitespace-nowrap"
                        >
                          {device.estado}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 font-mono text-sm">
                        {toText(device.hostname)}
                      </td>

                      <td className="py-3 px-4 text-sm min-w-[160px]">
                        <div className="font-medium">{toText(device.empleado)}</div>
                        <div className="text-xs text-gray-500">
                          ID: {toText(device.idEmpleado)}
                        </div>
                      </td>

                      <td className="py-3 px-4 text-sm">
                        {toText(device.usuario)}
                      </td>

                      <td className="py-3 px-4 font-mono text-sm">
                        {toText(device.serviceTag)}
                      </td>

                      <td className="py-3 px-4 text-sm min-w-[160px]">
                        <div className="font-medium">
                          {toText(device.marca)} {toText(device.modelo, '')}
                        </div>
                        <div className="text-xs text-gray-500">
                          {toText(device.tipoEquipo)}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono text-sm">
                        {toText(device.ip)}
                      </td>

                      <td className="py-3 px-4 text-sm min-w-[180px]">
                        <div className="font-medium">
                          {toText(device.ubicacion?.texto, 'Sin ubicación')}
                        </div>
                        <div className="text-xs text-gray-500">
                          IP pública: {toText(device.ubicacion?.ipPublica)}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2 min-w-[110px]">
                          <Cpu className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {toText(device.cpu?.nucleos, '0')} núcleos
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1 min-w-[110px]">
                          <div className="flex items-center gap-2">
                            <MemoryStick className="h-4 w-4 text-gray-400" />
                            <span className="text-xs">
                              {ramUsage.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={ramUsage} className="h-1.5" />
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1 min-w-[110px]">
                          <div className="flex items-center gap-2">
                            <HardDrive className="h-4 w-4 text-gray-400" />
                            <span className="text-xs">
                              {maxDiskUsage.toFixed(0)}%
                            </span>
                          </div>
                          <Progress value={maxDiskUsage} className="h-1.5" />
                        </div>
                      </td>

                      <td className="py-3 px-4 text-sm min-w-[150px]">
                        {formatDate(device.lastSeen)}
                      </td>

                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg whitespace-nowrap"
                          onClick={() => handleViewDetails(device)}
                        >
                          Ver Detalles
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredDevices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron equipos que coincidan con la búsqueda
            </div>
          )}
        </CardContent>
      </Card>

      <MonitoringDetailsModal
        device={selectedDevice}
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}