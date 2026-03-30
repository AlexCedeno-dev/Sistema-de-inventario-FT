import { useState } from 'react';
import { monitoringDevices } from '../data/mockData';
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

export function Dashboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState<typeof monitoringDevices[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const onlineDevices = monitoringDevices.filter((d) => d.estado.includes('Online'));
  const offlineDevices = monitoringDevices.filter((d) => d.estado.includes('Offline'));

  const avgCpuUsage = 
    monitoringDevices.reduce((acc, device) => acc + device.ram.porcentaje, 0) / monitoringDevices.length;

  const highDiskUsage = monitoringDevices.filter((device) =>
    device.discos.some((disco) => disco.porcentaje > 85)
  ).length;

  const filteredDevices = monitoringDevices.filter(
    (device) =>
      device.hostname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.usuario.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.ip.includes(searchTerm)
  );

  const handleViewDetails = (device: typeof monitoringDevices[0]) => {
    setSelectedDevice(device);
    setIsModalOpen(true);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard de Monitoreo</h1>
        <p className="text-gray-500 mt-1">Vista en tiempo real del estado de los equipos</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipos</CardTitle>
            <Monitor className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monitoringDevices.length}</div>
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
              {((onlineDevices.length / monitoringDevices.length) * 100).toFixed(0)}% disponibilidad
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

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por hostname, usuario o IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Devices Table */}
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
                  <th className="text-left py-3 px-4 font-semibold text-sm">IP</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Ubicación</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">CPU</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">RAM</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Disco</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device, index) => {
                  const maxDiskUsage = Math.max(...device.discos.map((d) => d.porcentaje));
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
                      <td className="py-3 px-4 font-mono text-sm">{device.ip}</td>
                      <td className="py-3 px-4 text-sm">{device.ubicacion || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <Cpu className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{device.cpu.nucleos} núcleos</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <MemoryStick className="h-4 w-4 text-gray-400" />
                            <span className="text-xs">{device.ram.porcentaje.toFixed(0)}%</span>
                          </div>
                          <Progress value={device.ram.porcentaje} className="h-1.5" />
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <HardDrive className="h-4 w-4 text-gray-400" />
                            <span className="text-xs">{maxDiskUsage.toFixed(0)}%</span>
                          </div>
                          <Progress
                            value={maxDiskUsage}
                            className={`h-1.5 ${
                              maxDiskUsage > 85 ? 'bg-red-200' : maxDiskUsage > 70 ? 'bg-yellow-200' : ''
                            }`}
                          />
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
