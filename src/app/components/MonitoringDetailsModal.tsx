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
  MapPin,
  Wifi,
  User,
  Laptop,
} from 'lucide-react';
import type { MonitoringDevice } from '../services/monitoringApi';

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

  const toText = (value: unknown, fallback = 'No disponible') => {
    if (
      value === null ||
      value === undefined ||
      value === '' ||
      value === 'NULL' ||
      value === 'null' ||
      value === 'N/A'
    ) {
      return fallback;
    }

    return String(value);
  };

  const toNumberText = (value: unknown, decimals = 2) => {
    if (typeof value !== 'number' || Number.isNaN(value)) return '0.00';
    return value.toFixed(decimals);
  };

  const safeDate = (value: string | null | undefined) => {
    if (!value) return 'Sin fecha';

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return 'Sin fecha';

    return date.toLocaleString('es-MX');
  };

  const formatUptime = (seconds: number | null | undefined) => {
    if (typeof seconds !== 'number' || Number.isNaN(seconds)) {
      return 'No disponible';
    }

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

  const maxDiskUsage =
    Array.isArray(device.discos) && device.discos.length > 0
      ? Math.max(
          ...device.discos.map((d) =>
            typeof d.porcentaje === 'number' ? d.porcentaje : 0
          )
        )
      : null;

  const locationText = device.ubicacion?.texto || 'Sin ubicación registrada';

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
            Detalle completo del equipo monitoreado, inventario, hardware, red y ubicación.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="inventario">Inventario</TabsTrigger>
            <TabsTrigger value="hardware">Hardware</TabsTrigger>
            <TabsTrigger value="discos">Discos</TabsTrigger>
            <TabsTrigger value="sistema">Sistema</TabsTrigger>
            <TabsTrigger value="ubicacion">Ubicación</TabsTrigger>
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
                <p className="text-sm text-gray-500">Usuario Windows</p>
                <p className="font-semibold">{toText(device.usuario)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">IP Local</p>
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
                <p className="text-sm text-gray-500">Ubicación aproximada</p>
                <p className="font-semibold">{locationText}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Última Conexión</p>
                <p className="text-sm">{safeDate(device.lastSeen)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Último Reporte</p>
                <p className="text-sm">{safeDate(device.fecha)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Disco más alto</p>
                <p className={`font-semibold ${getUsageTone(maxDiskUsage)}`}>
                  {maxDiskUsage !== null ? `${toNumberText(maxDiskUsage, 0)}%` : 'Sin datos'}
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="inventario" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <p className="text-sm text-gray-500">Empleado asignado</p>
                </div>
                <p className="font-semibold">{toText(device.empleado)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">ID Empleado</p>
                <p className="font-mono text-sm">{toText(device.idEmpleado)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Status Empleado</p>
                <p className="font-semibold">{toText(device.statusEmpleado)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Departamento</p>
                <p className="font-semibold">{toText(device.departamento)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Planta</p>
                <p className="font-semibold">{toText(device.planta)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Fecha Asignación</p>
                <p className="text-sm">{safeDate(device.fechaAsignacion)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Service Tag</p>
                <p className="font-mono text-sm">{toText(device.serviceTag)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Serial Number</p>
                <p className="font-mono text-sm">{toText(device.serialNumber)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Nombre equipo inventario</p>
                <p className="font-mono text-sm">
                  {toText(device.nombreEquipoInventario)}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg col-span-1 md:col-span-3">
                <p className="text-sm text-gray-500">Observación</p>
                <p className="text-sm">
                  Esta información viene del cruce entre monitoreo_equipos, equipos y empleados.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hardware" className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Laptop className="h-4 w-4 text-gray-500" />
                <h3 className="font-semibold">Equipo</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Marca</p>
                  <p className="text-sm font-medium">{toText(device.marca)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Modelo</p>
                  <p className="text-sm font-medium">{toText(device.modelo)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Tipo Equipo</p>
                  <p className="text-sm font-medium">{toText(device.tipoEquipo)}</p>
                </div>
              </div>
            </div>

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
                      : 'No disponible'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Temperatura</p>
                  <p className="text-sm font-medium">
                    {device.cpu?.temperatura != null
                      ? `${toText(device.cpu.temperatura)} °C`
                      : 'No disponible'}
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
                      : 'No disponible'}
                  </span>

                  <span className="text-sm font-mono">
                    {device.ram?.usoGB != null
                      ? `${toNumberText(device.ram.usoGB)} GB`
                      : 'N/A'}
                    {' / '}
                    {device.ram?.totalGB != null
                      ? `${toNumberText(device.ram.totalGB)} GB`
                      : 'N/A'}
                  </span>
                </div>

                <Progress
                  value={
                    typeof device.ram?.porcentaje === 'number'
                      ? device.ram.porcentaje
                      : 0
                  }
                  className="h-2"
                />

                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    Libre:{' '}
                    {device.ram?.libreGB != null
                      ? `${toNumberText(device.ram.libreGB)} GB`
                      : 'N/A'}
                  </span>
                  <span>
                    En uso:{' '}
                    {device.ram?.usoGB != null
                      ? `${toNumberText(device.ram.usoGB)} GB`
                      : 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="discos" className="space-y-4">
            {Array.isArray(device.discos) && device.discos.length > 0 ? (
              device.discos.map((disco, index) => (
                <div key={`${disco.disco}-${index}`} className="bg-gray-50 p-4 rounded-lg">
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
                          : 'No disponible'}
                      </span>

                      <span className="text-sm font-mono">
                        {disco.usadoGB != null
                          ? `${toNumberText(disco.usadoGB)} GB`
                          : 'N/A'}
                        {' / '}
                        {disco.tamañoGB != null
                          ? `${toNumberText(disco.tamañoGB)} GB`
                          : 'N/A'}
                      </span>
                    </div>

                    <Progress
                      value={
                        typeof disco.porcentaje === 'number'
                          ? disco.porcentaje
                          : 0
                      }
                      className="h-2"
                    />

                    <div className="flex justify-between text-sm text-gray-500">
                      <span>
                        Usado:{' '}
                        {disco.usadoGB != null
                          ? `${toNumberText(disco.usadoGB)} GB`
                          : 'N/A'}
                      </span>
                      <span>
                        Total:{' '}
                        {disco.tamañoGB != null
                          ? `${toNumberText(disco.tamañoGB)} GB`
                          : 'N/A'}
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
                  <p className="text-sm text-gray-500">Edición Windows</p>
                  <p className="font-semibold text-sm">
                    {toText(device.sistema?.edicion)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Versión Windows</p>
                  <p className="font-mono text-sm">
                    {toText(device.sistema?.version)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Build</p>
                  <p className="font-mono text-sm">
                    {toText(device.sistema?.build)}
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
                  <p className="text-sm text-gray-500">ID Producto / Serial</p>
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

          <TabsContent value="ubicacion" className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="h-4 w-4 text-gray-500" />
                <h3 className="font-semibold">Última ubicación aproximada</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="font-semibold">{locationText}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Ciudad</p>
                  <p className="font-semibold">{toText(device.ubicacion?.ciudad)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Estado</p>
                  <p className="font-semibold">{toText(device.ubicacion?.estado)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">País</p>
                  <p className="font-semibold">{toText(device.ubicacion?.pais)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Latitud</p>
                  <p className="font-mono text-sm">
                    {device.ubicacion?.latitud != null
                      ? maskValue(device.ubicacion.latitud)
                      : 'No disponible'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Longitud</p>
                  <p className="font-mono text-sm">
                    {device.ubicacion?.longitud != null
                      ? maskValue(device.ubicacion.longitud)
                      : 'No disponible'}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Última ubicación recibida</p>
                  <p className="text-sm">
                    {safeDate(device.ubicacion?.ultimaUbicacionAt)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Fuente</p>
                  <p className="font-semibold">{toText(device.ubicacion?.fuente)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Proveedor</p>
                  <p className="font-semibold">{toText(device.ubicacion?.proveedor)}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-3">
                <Wifi className="h-4 w-4 text-gray-500" />
                <h3 className="font-semibold">Red detectada</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500">IP Local</p>
                  <p className="font-mono text-sm">{toText(device.ip)}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">IP Pública</p>
                  <p className="font-mono text-sm">
                    {toText(device.ubicacion?.ipPublica)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">MAC</p>
                  <p className="font-mono text-sm">{maskValue(device.mac)}</p>
                </div>
              </div>

              <p className="text-xs text-gray-500 mt-4">
                Nota: la ubicación por IP pública es aproximada. Puede mostrar la ciudad del proveedor, firewall, VPN o nodo de salida de internet.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}