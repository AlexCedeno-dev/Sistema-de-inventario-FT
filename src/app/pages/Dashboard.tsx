import { useEffect, useMemo, useState } from 'react';
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
} from 'lucide-react';
import { Progress } from '../components/ui/progress';

type MonitoringDevice = {
  hostname: string;
  ip: string;
  mac: string;
  usuario: string;
  empleado?: string;
  empleadoViejo?: string;
  serviceTag?: string;
  idEmpleado?: string;
  idEmpleadoViejo?: string;
  departamento?: string;
  departamentoViejo?: string;
  registradoNuevo?: boolean;
  registradoViejo?: boolean;
  plataforma: string;
  tipoSistema: string;
  uptime: number;
  ubicacion?: string;
  fecha: string;
  lastSeen: string;
  estado: string;
  statusEmpleadoNuevo?: string;
  statusEmpleadoViejo?: string;
  cpu: {
    modelo: string;
    nucleos: number;
    velocidad_mhz: number;
    temperatura: number | null;
  };
  ram: {
    totalGB: number;
    libreGB: number;
    usoGB: number;
    porcentaje: number;
  };
  discos: {
    disco: string;
    tamañoGB: number;
    usadoGB: number;
    porcentaje: number;
  }[];
  sistema: {
    edicion: string;
    version: string;
    instalado?: string;
    build?: string;
    especificacion: string;
    idDispositivo: string;
    idProducto: string;
  };
};

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [devices, setDevices] = useState<MonitoringDevice[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<MonitoringDevice | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //LOCAL y server
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3006';


  const loadDevices = async () => {
    try {
      const response = await fetch(`${API_BASE}/dashboard-monitoreo`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();

      setDevices(data);

      if (selectedDevice) {
        const updated = data.find(
          (dev: MonitoringDevice) =>
            dev.hostname === selectedDevice.hostname &&
            dev.ip === selectedDevice.ip
        );
        if (updated) setSelectedDevice(updated);
      }
    } catch (error) {
      console.error('Error cargando dashboard-monitoreo:', error);
    }
  };

  useEffect(() => {
    loadDevices();
    const interval = setInterval(loadDevices, 5000);
    return () => clearInterval(interval);
  }, []);

  const onlineDevices = useMemo(
    () => devices.filter((d) => d.estado.includes('Online')),
    [devices]
  );

  const offlineDevices = useMemo(
    () => devices.filter((d) => d.estado.includes('Offline')),
    [devices]
  );

  const highDiskUsage = useMemo(
    () =>
      devices.filter((device) =>
        device.discos?.some((disco) => disco.porcentaje > 85)
      ).length,
    [devices]
  );

  const filteredDevices = useMemo(() => {
    const term = searchTerm.toLowerCase().trim();

    return devices.filter((device) => {
      const searchableText = `
        ${device.hostname ?? ''}
        ${device.empleado ?? ''}
        ${device.empleadoViejo ?? ''}
        ${device.ip ?? ''}
        ${device.usuario ?? ''}
        ${device.serviceTag ?? ''}
        ${device.idEmpleado ?? ''}
        ${device.idEmpleadoViejo ?? ''}
        ${device.departamento ?? ''}
        ${device.departamentoViejo ?? ''}
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
        <div className="flex items-center gap-3 mb-2">
          <Activity className="h-8 w-8" />
          <h1 className="text-4xl font-bold">Dashboard de Monitoreo</h1>
        </div>
        <p className="text-blue-100 text-lg">
          Vista en tiempo real del estado de los equipos
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-md border-0 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipos</CardTitle>
            <Monitor className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.length}</div>
            <p className="text-xs text-gray-500 mt-1">Equipos monitoreados</p>
          </CardContent>
        </Card>

        <Card className="shadow-md border-0 rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipos Online</CardTitle>
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
            <CardTitle className="text-sm font-medium">Equipos Offline</CardTitle>
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
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por hostname, empleado, IP, service tag o id empleado..."
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
                  <th className="text-left py-3 px-4 font-semibold text-sm">Estado agente</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Hostname</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Usuario</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Empleado Nuevo</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">ID Nuevo</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Empleado Viejo</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">ID Viejo</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Nuevo</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Viejo</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Status Nuevo</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Status Viejo</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Service Tag</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">IP</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">CPU</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">RAM</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Disco</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device, index) => {
                  const maxDiskUsage = device.discos?.length
                    ? Math.max(...device.discos.map((d) => d.porcentaje))
                    : 0;

                  return (
                    <tr
                      key={index}
                      className="border-b hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <Badge
                          variant={
                            device.estado.includes('Online')
                              ? 'default'
                              : 'destructive'
                          }
                          className="text-xs"
                        >
                          {device.estado}
                        </Badge>
                      </td>

                      <td className="py-3 px-4 font-mono text-sm">{device.hostname}</td>
                      <td className="py-3 px-4 text-sm">{device.usuario}</td>

                      <td className="py-3 px-4 text-sm">
                        {device.empleado ?? 'No registrado en inventario nuevo'}
                      </td>

                      <td className="py-3 px-4 font-mono text-sm">
                        {device.idEmpleado ?? 'N/A'}
                      </td>

                      <td className="py-3 px-4 text-sm">
                        {device.empleadoViejo ?? 'No registrado en inventario viejo'}
                      </td>

                      <td className="py-3 px-4 font-mono text-sm">
                        {device.idEmpleadoViejo ?? 'N/A'}
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant={device.registradoNuevo ? 'default' : 'secondary'}>
                          {device.registradoNuevo ? 'Registrado' : 'No registrado'}
                        </Badge>
                      </td>

                      <td className="py-3 px-4">
                        <Badge variant={device.registradoViejo ? 'default' : 'secondary'}>
                          {device.registradoViejo ? 'Registrado' : 'No registrado'}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-sm">
                          {device.statusEmpleadoNuevo ?? 'N/A'}
                        </td>

                        <td className="py-3 px-4 text-sm">
                          {device.statusEmpleadoViejo ?? 'N/A'}
                        </td>

                      <td className="py-3 px-4 font-mono text-sm">
                        {device.serviceTag ?? 'N/A'}
                      </td>

                      <td className="py-3 px-4 font-mono text-sm">{device.ip}</td>

                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">
                            {device.cpu?.nucleos ?? 0} núcleos
                          </span>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-1 min-w-[110px]">
                          <div className="flex items-center gap-2">
                            <MemoryStick className="h-4 w-4 text-gray-400" />
                            <span className="text-xs">
                              {device.ram?.porcentaje?.toFixed(0) ?? 0}%
                            </span>
                          </div>
                          <Progress
                            value={device.ram?.porcentaje ?? 0}
                            className="h-1.5"
                          />
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
                          <Progress
                            value={maxDiskUsage}
                            className={`h-1.5 ${
                              maxDiskUsage > 85
                                ? 'bg-red-200'
                                : maxDiskUsage > 70
                                ? 'bg-yellow-200'
                                : ''
                            }`}
                          />
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          className="rounded-lg"
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