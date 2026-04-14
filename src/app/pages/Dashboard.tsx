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
  serviceTag?: string;
  idEmpleado?: string;
  departamento?: string;
  plataforma: string;
  tipoSistema: string;
  uptime: number;
  ubicacion?: string;
  fecha: string;
  lastSeen: string;
  estado: string;
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

    const normalizarTag = (value: any) =>
    String(value ?? '')
      .trim()
      .toUpperCase();

  const loadDevices = async () => {
    try {
      const [equiposRes, identificadosRes] = await Promise.all([
        //fetch('http://192.168.179.6:3005/equipos'),
        //fetch('http://192.168.179.6:3005/equipos-identificados'),
        fetch('http://localhost:3006/equipos-local'),
        fetch('http://localhost:3006/equipos-identificados-local'),
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
        hostname: device.hostname ?? 'N/A',
        ip: device.ip ?? 'N/A',
        mac: device.mac ?? 'N/A',
        usuario: device.usuario ?? 'N/A',

        // empleado REAL desde inventario
        empleado: match?.inventario?.nombre_completo ?? 'Sin asignar',
        idEmpleado: match?.inventario?.empleado_id ? String(match.inventario.empleado_id) : 'N/A',
        departamento: match?.inventario?.departamento ?? 'N/A',

        // service tag para validar cruce
        serviceTag: match?.inventario?.service_tag ?? match?.sistema?.idDispositivo ?? 'N/A',

        plataforma: match?.plataforma ?? 'N/A',
        tipoSistema: match?.tipoSistema ?? 'N/A',
        uptime: match?.uptime ?? 0,
        ubicacion: match?.ubicacion ?? 'N/A',
        fecha: device.fecha ?? 'N/A',
        lastSeen: device.lastSeen ?? 'N/A',
        estado: device.estado ?? 'Offline',

        cpu: {
          modelo: device.cpu?.modelo ?? 'N/A',
          nucleos: device.cpu?.nucleos ?? 0,
          velocidad_mhz: device.cpu?.velocidad_mhz ?? 0,
          temperatura: device.cpu?.temperatura ?? null,
        },

        ram: {
          totalGB: device.ram?.totalGB ?? 0,
          libreGB: device.ram?.libreGB ?? 0,
          usoGB: device.ram?.usoGB ?? 0,
          porcentaje: device.ram?.porcentaje ?? 0,
        },

        discos: Array.isArray(device.discos) ? device.discos : [],

        sistema: {
          edicion: device.sistema?.edicion ?? 'N/A',
          version: device.sistema?.version ?? 'N/A',
          instalado: device.sistema?.instalado || device.sistema?.build || 'N/A',
          build: device.sistema?.build ?? 'N/A',
          especificacion: device.sistema?.especificacion ?? 'N/A',
          idDispositivo: device.sistema?.idDispositivo ?? 'N/A',
          idProducto: device.sistema?.idProducto ?? 'N/A',
          },
        };
      });

      setDevices(normalized);

      if (selectedDevice) {
        const updated = normalized.find(
          (dev) =>
            dev.hostname === selectedDevice.hostname &&
            dev.ip === selectedDevice.ip
        );
        if (updated) setSelectedDevice(updated);
      }
    } catch (error) {
      console.error('Error cargando equipos identificados:', error);
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
        ${device.ip ?? ''}
        ${device.usuario ?? ''}
        ${device.serviceTag ?? ''}
        ${device.idEmpleado ?? ''}
        ${device.departamento ?? ''}
      `.toLowerCase();

      return searchableText.includes(term);
    });
  }, [devices, searchTerm]);

  const handleViewDetails = (device: MonitoringDevice) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Monitoreo</h1>
        <p className="text-gray-500 mt-1">Vista en tiempo real del estado de los equipos</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipos</CardTitle>
            <Monitor className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.length}</div>
            <p className="text-xs text-gray-500 mt-1">Equipos monitoreados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipos Online</CardTitle>
            <Activity className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{onlineDevices.length}</div>
            <p className="text-xs text-gray-500 mt-1">
              {devices.length > 0
                ? `${((onlineDevices.length / devices.length) * 100).toFixed(0)}% disponibilidad`
                : '0% disponibilidad'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipos Offline</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{offlineDevices.length}</div>
            <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Discos Críticos</CardTitle>
            <HardDrive className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{highDiskUsage}</div>
            <p className="text-xs text-gray-500 mt-1">Uso de disco &gt; 85%</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por hostname, empleado, IP, service tag o id empleado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Equipos Monitoreados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">Estado</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Hostname</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Usuario</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Empleado</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">ID Empleado</th>
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
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <Badge
                          variant={device.estado.includes('Online') ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {device.estado}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-mono text-sm">{device.hostname}</td>
                      <td className="py-3 px-4 text-sm">{device.usuario}</td>
                      <td className="py-3 px-4 text-sm">{device.empleado ?? 'N/A'}</td>
                      <td className="py-3 px-4 font-mono text-sm">{device.idEmpleado ?? 'N/A'}</td>
                      <td className="py-3 px-4 font-mono text-sm">{device.serviceTag ?? 'N/A'}</td>
                      <td className="py-3 px-4 font-mono text-sm">{device.ip}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{device.cpu?.nucleos ?? 0} núcleos</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <MemoryStick className="h-4 w-4 text-gray-400" />
                            <span className="text-xs">{device.ram?.porcentaje?.toFixed(0) ?? 0}%</span>
                          </div>
                          <Progress value={device.ram?.porcentaje ?? 0} className="h-1.5" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <HardDrive className="h-4 w-4 text-gray-400" />
                            <span className="text-xs">{maxDiskUsage.toFixed(0)}%</span>
                          </div>
                          <Progress value={maxDiskUsage} className="h-1.5" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Button size="sm" variant="outline" onClick={() => handleViewDetails(device)}>
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