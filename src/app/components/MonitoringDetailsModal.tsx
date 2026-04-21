import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Progress } from './ui/progress';
import {
  Eye,
  EyeOff,
  Monitor,
  Cpu,
  MemoryStick,
  HardDrive,
  Info,
} from 'lucide-react';

type MonitoringDevice = {
  hostname: string | null;
  ip: string | null;
  mac: string | null;
  usuario: string | null;
  empleado?: string | null;
  serviceTag?: string | null;
  idEmpleado?: string | null;
  departamento?: string | null;
  plataforma: string | null;
  tipoSistema: string | null;
  uptime: number | null;
  ubicacion?: string | null;
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
    instalado?: string | null;
    build?: string | null;
    especificacion: string | null;
    idDispositivo: string | null;
    idProducto: string | null;
  };
};

interface MonitoringDetailsModalProps {
  device: MonitoringDevice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MonitoringDetailsModal({
  device,
  open,
  onOpenChange,
}: MonitoringDetailsModalProps) {
  const [showSensitive, setShowSensitive] = useState(false);

  if (!device) return null;

  const toText = (value: unknown) => {
    if (value === null || value === undefined || value === '') return 'NULL';
    return String(value);
  };

  const toNumberText = (value: unknown, decimals = 2) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return 'NULL';
    return value.toFixed(decimals);
  };

  const safeDate = (value: string | null | undefined) => {
    if (!value) return 'NULL';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'NULL';
    return date.toLocaleString('es-MX');
  };

  const formatUptime = (seconds: number | null | undefined) => {
    if (typeof seconds !== 'number' || Number.isNaN(seconds)) return 'NULL';
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getStatusBadgeVariant = (status: string | null | undefined) => {
    if ((status ?? '').includes('Online')) return 'default';
    if ((status ?? '').includes('Offline')) return 'destructive';
    return 'secondary';
  };

  const getStatusDotColor = (status: string | null | undefined) => {
    if ((status ?? '').includes('Online')) return 'bg-green-500';
    if ((status ?? '').includes('Offline')) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const getUsageTone = (percentage: number | null | undefined) => {
    const value = typeof percentage === 'number' ? percentage : 0;
    if (value < 60) return 'text-green-600';
    if (value < 80) return 'text-yellow-600';
    return 'text-red-600';
  };

  const maskValue = (value: unknown) => {
    const text = toText(value);
    if (!showSensitive) return '••••••••';
    return text;
  };

  const maxDiskUsage = Array.isArray(device.discos) && device.discos.length > 0
    ? Math.max(...device.discos.map((d) => (typeof d.porcentaje === 'number' ? d.porcentaje : 0)))
    : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={`h-3 w-3 rounded-full ${getStatusDotColor(device.estado)}`}
              />
              <span>{toText(device.hostname)}</span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowSensitive((prev) => !prev)}
            >
              {showSensitive ? (
                <EyeOff className="h-4 w-4 mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              {showSensitive ? 'Ocultar sensibles' : 'Mostrar sensibles'}
            </Button>
          </DialogTitle>

          <DialogDescription className="text-sm text-gray-500">
            Detalle completo del equipo monitoreado e información cruzada del inventario.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="inventario">Inventario</TabsTrigger>
            <TabsTrigger value="hardware">Hardware</TabsTrigger>
            <TabsTrigger value="discos">Discos</TabsTrigger>
            <TabsTrigger value="sistema">Sistema</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Estado</p>
                <Badge variant={getStatusBadgeVariant(device.estado)}>
                  {toText(device.estado)}
                </Badge>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Hostname</p>
                <p className="font-mono text-sm">{toText(device.hostname)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Usuario</p>
                <p className="font-semibold">{toText(device.usuario)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">IP</p>
                <p className="font-mono text-sm">{toText(device.ip)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">MAC</p>
                <p className="font-mono text-sm">{maskValue(device.mac)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Tiempo Encendido</p>
                <p className="font-semibold">{formatUptime(device.uptime)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Plataforma</p>
                <p className="font-semibold">{toText(device.plataforma)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Tipo de Sistema</p>
                <p className="font-semibold">{toText(device.tipoSistema)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Ubicación</p>
                <p className="font-semibold">{toText(device.ubicacion)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Última Conexión</p>
                <p className="text-sm">{safeDate(device.lastSeen)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Fecha de Registro</p>
                <p className="text-sm">{safeDate(device.fecha)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Disco más alto</p>
                <p className={`font-semibold ${getUsageTone(maxDiskUsage)}`}>
                  {maxDiskUsage !== null ? `${toNumberText(maxDiskUsage, 0)}%` : 'NULL'}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="inventario" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Empleado</p>
                <p className="font-semibold">{toText(device.empleado)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">ID Empleado</p>
                <p className="font-mono text-sm">{toText(device.idEmpleado)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Departamento</p>
                <p className="font-semibold">{toText(device.departamento)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Service Tag</p>
                <p className="font-mono text-sm">{toText(device.serviceTag)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Nombre de equipo</p>
                <p className="font-mono text-sm">{toText(device.hostname)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Ubicación inventario</p>
                <p className="font-semibold">{toText(device.ubicacion)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg col-span-1 md:col-span-3">
                <p className="text-sm text-gray-500">Observación</p>
                <p className="text-sm">
                  Información cruzada desde monitoreo + inventario. Campos no disponibles: NULL.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hardware" className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="h-4 w-4 text-gray-500" />
                <h3 className="font-semibold">Procesador</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Modelo</p>
                  <p className="text-sm font-medium">{toText(device.cpu?.modelo)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Núcleos</p>
                  <p className="text-sm font-medium">{toText(device.cpu?.nucleos)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Velocidad</p>
                  <p className="text-sm font-medium">
                    {device.cpu?.velocidad_mhz != null
                      ? `${toText(device.cpu.velocidad_mhz)} MHz`
                      : 'NULL'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Temperatura</p>
                  <p className="text-sm font-medium">
                    {device.cpu?.temperatura != null
                      ? `${toText(device.cpu.temperatura)} °C`
                      : 'NULL'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <MemoryStick className="h-4 w-4 text-gray-500" />
                <h3 className="font-semibold">Memoria RAM</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-sm">
                    Uso de memoria:{' '}
                    {device.ram?.porcentaje != null
                      ? `${toNumberText(device.ram.porcentaje)}%`
                      : 'NULL'}
                  </span>

                  <span className="text-sm font-mono">
                    {device.ram?.usoGB != null ? `${toNumberText(device.ram.usoGB)} GB` : 'NULL'}
                    {' / '}
                    {device.ram?.totalGB != null ? `${toNumberText(device.ram.totalGB)} GB` : 'NULL'}
                  </span>
                </div>

                <Progress value={typeof device.ram?.porcentaje === 'number' ? device.ram.porcentaje : 0} className="h-2" />

                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    Libre:{' '}
                    {device.ram?.libreGB != null ? `${toNumberText(device.ram.libreGB)} GB` : 'NULL'}
                  </span>
                  <span>
                    En uso:{' '}
                    {device.ram?.usoGB != null ? `${toNumberText(device.ram.usoGB)} GB` : 'NULL'}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="discos" className="space-y-4">
            {Array.isArray(device.discos) && device.discos.length > 0 ? (
              device.discos.map((disco, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <HardDrive className="h-4 w-4 text-gray-500" />
                    <h3 className="font-semibold">Disco {toText(disco.disco)}</h3>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center gap-4">
                      <span className="text-sm">
                        Uso del disco:{' '}
                        {disco.porcentaje != null
                          ? `${toNumberText(disco.porcentaje)}%`
                          : 'NULL'}
                      </span>

                      <span className="text-sm font-mono">
                        {disco.usadoGB != null ? `${toNumberText(disco.usadoGB)} GB` : 'NULL'}
                        {' / '}
                        {disco.tamañoGB != null ? `${toNumberText(disco.tamañoGB)} GB` : 'NULL'}
                      </span>
                    </div>

                    <Progress value={typeof disco.porcentaje === 'number' ? disco.porcentaje : 0} className="h-2" />

                    <div className="flex justify-between text-sm text-gray-500">
                      <span>
                        Usado:{' '}
                        {disco.usadoGB != null ? `${toNumberText(disco.usadoGB)} GB` : 'NULL'}
                      </span>
                      <span>
                        Total:{' '}
                        {disco.tamañoGB != null ? `${toNumberText(disco.tamañoGB)} GB` : 'NULL'}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-500">
                No hay discos disponibles
              </div>
            )}
          </TabsContent>

          <TabsContent value="sistema" className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-3">
                <Info className="h-4 w-4 text-gray-500" />
                <h3 className="font-semibold">Información del Sistema</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Edición</p>
                  <p className="font-semibold text-sm">{toText(device.sistema?.edicion)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Versión</p>
                  <p className="font-mono text-sm">{toText(device.sistema?.version)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Instalado / Build</p>
                  <p className="font-mono text-sm">
                    {toText(device.sistema?.instalado ?? device.sistema?.build ?? null)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Especificación</p>
                  <p className="font-semibold text-sm">
                    {toText(device.sistema?.especificacion)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">ID Dispositivo</p>
                  <p className="font-mono text-sm">
                    {maskValue(device.sistema?.idDispositivo)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">ID Producto</p>
                  <p className="font-mono text-sm">
                    {maskValue(device.sistema?.idProducto)}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Monitor className="h-4 w-4 text-gray-500" />
                <h3 className="font-semibold">Resumen Técnico</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Equipo</p>
                  <p className="font-medium">{toText(device.hostname)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Usuario</p>
                  <p className="font-medium">{toText(device.usuario)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Service Tag</p>
                  <p className="font-mono">{toText(device.serviceTag)}</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}