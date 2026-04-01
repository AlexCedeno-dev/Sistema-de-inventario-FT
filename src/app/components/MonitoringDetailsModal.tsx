import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { MonitoringDevice } from '../data/monitoringTypes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';

interface MonitoringDetailsModalProps {
  device: MonitoringDevice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MonitoringDetailsModal({ device, open, onOpenChange }: MonitoringDetailsModalProps) {
  if (!device) return null;

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  };

  const getStatusColor = (status: string) => {
    if (status.includes('Online')) return 'bg-green-500';
    if (status.includes('Offline')) return 'bg-red-500';
    return 'bg-yellow-500';
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 60) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };
  
  console.log('Device recibido:', device);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className={`h-3 w-3 rounded-full ${getStatusColor(device.estado)}`} />
            {device.hostname}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="hardware">Hardware</TabsTrigger>
            <TabsTrigger value="discos">Discos</TabsTrigger>
            <TabsTrigger value="sistema">Sistema</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Estado</p>
                <Badge variant={device.estado.includes('Online') ? 'default' : 'destructive'}>
                  {device.estado}
                </Badge>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Usuario</p>
                <p className="font-semibold">{device.usuario}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Dirección IP</p>
                <p className="font-mono text-sm">{device.ip}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Dirección MAC</p>
                <p className="font-mono text-sm">{device.mac}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Plataforma</p>
                <p className="font-semibold">{device.plataforma} ({device.tipoSistema})</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Tiempo Encendido</p>
                <p className="font-semibold">{formatUptime(device.uptime)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                <p className="text-sm text-gray-500">Ubicación</p>
                <p className="font-semibold"> {typeof device.ubicacion === 'string' ? device.ubicacion : 'No especificada'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Última Conexión</p>
                <p className="text-sm">{device.lastSeen ? new Date(device.lastSeen).toLocaleString('es-MX') : 'No disponible'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Fecha de Registro</p>
                <p className="text-sm">{device.fecha ? new Date(device.fecha).toLocaleString('es-MX') : 'No disponible'}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hardware" className="space-y-4">
            {/* CPU */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Procesador (CPU)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-sm text-gray-500">Modelo</p>
                  <p className="text-sm font-medium">{device.cpu.modelo}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Núcleos</p>
                  <p className="text-sm font-medium">{device.cpu.nucleos} núcleos</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Velocidad</p>
                  <p className="text-sm font-medium">{device.cpu.velocidad_mhz} MHz</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Temperatura</p>
                  <p className="text-sm font-medium">
                    {device.cpu.temperatura ? `${device.cpu.temperatura}°C` : 'No disponible'}
                  </p>
                </div>
              </div>
            </div>

            {/* RAM */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Memoria RAM</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Uso de memoria: {typeof device.ram?.porcentaje === 'number' ? device.ram.porcentaje.toFixed(2) : 'N/A'}%</span>
                  <span className="text-sm font-mono">
                    {device.ram?.usoGB?.toFixed?.(2) ?? 'N/A'} GB / {device.ram?.totalGB?.toFixed?.(2) ?? 'N/A'} GB
                  </span>
                </div>
                <Progress value={device.ram.porcentaje} className={getUsageColor(device.ram.porcentaje)} />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>Libre: {device.ram.libreGB.toFixed(2)} GB</span>
                  <span>En uso: {device.ram.usoGB.toFixed(2)} GB</span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="discos" className="space-y-4">
            {device.discos.map((disco, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Disco {disco.disco}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm"> Uso del disco: {typeof disco.porcentaje === 'number' ? disco.porcentaje.toFixed(2) : 'N/A'}%</span>
                    <span className="text-sm font-mono">
                      {disco.usadoGB ?? 'N/A'} GB / {disco.tamañoGB ?? 'N/A'} GB
                    </span>
                  </div>
                  <Progress value={disco.porcentaje} className={getUsageColor(disco.porcentaje)} />
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Usado: {disco.usadoGB ?? 'N/A'} GB</span>
                    <span>Total: {disco.tamañoGB ?? 'N/A'} GB</span>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="sistema" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Edición</p>
                <p className="font-semibold text-sm">{device.sistema.edicion}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Versión</p>
                <p className="font-mono text-sm">{device.sistema.version}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Build Instalado</p>
                <p className="font-mono text-sm">{device.sistema.instalado}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Especificación</p>
                <p className="font-semibold">{device.sistema.especificacion}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">ID de Dispositivo</p>
                <p className="font-mono text-sm">{device.sistema.idDispositivo}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">ID de Producto</p>
                <p className="font-mono text-sm">{device.sistema.idProducto}</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
