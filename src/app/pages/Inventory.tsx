import { useState } from 'react';
import { inventoryDevices } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { DeviceDetailsModal } from '../components/DeviceDetailsModal';
import { QRModal } from '../components/QRModal';
import {
  Search,
  Download,
  Upload,
  FileCheck,
  Eye,
  QrCode,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';

export function Inventory() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState<typeof inventoryDevices[0] | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrDevice, setQRDevice] = useState<typeof inventoryDevices[0] | null>(null);

  const filteredDevices = inventoryDevices.filter((device) => {
    const matchesSearch =
      device.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.nombreEmpleado.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.departamento.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.serviceTag.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (device: typeof inventoryDevices[0]) => {
    setSelectedDevice(device);
    setIsDetailsModalOpen(true);
  };

  const handleGenerateQR = (device: typeof inventoryDevices[0]) => {
    setQRDevice(device);
    setIsQRModalOpen(true);
  };

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventario de Equipos</h1>
        <p className="text-gray-500 mt-1">Gestión de PCs asignadas y documentación</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Equipos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inventoryDevices.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {inventoryDevices.filter((d) => d.status === 'Activo').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Firmados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {inventoryDevices.filter((d) => d.firmado).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Con BitLocker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {inventoryDevices.filter((d) => d.bitlocker !== null).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por ID, empleado, departamento o service tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Mantenimiento">Mantenimiento</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>PCs Asignadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Empleado</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Departamento</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Planta</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Tipo</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Marca</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Modelo</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Carta</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">BitLocker</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Firmado</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{device.id}</td>
                    <td className="py-3 px-4">
                      <Badge variant={device.status === 'Activo' ? 'default' : 'secondary'}>
                        {device.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-sm">{device.nombreEmpleado}</td>
                    <td className="py-3 px-4 text-sm">{device.departamento}</td>
                    <td className="py-3 px-4 text-sm">{device.planta}</td>
                    <td className="py-3 px-4 text-sm">{device.tipo}</td>
                    <td className="py-3 px-4 text-sm">{device.marca}</td>
                    <td className="py-3 px-4 text-sm">{device.modelo}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {device.cartaResponsiva ? (
                          <>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Upload className="h-3.5 w-3.5" />
                            </Button>
                            <XCircle className="h-5 w-5 text-red-500" />
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {device.bitlocker ? (
                          <>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Download className="h-3.5 w-3.5" />
                            </Button>
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          </>
                        ) : (
                          <>
                            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                              <Upload className="h-3.5 w-3.5" />
                            </Button>
                            <XCircle className="h-5 w-5 text-red-500" />
                          </>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      {device.firmado ? (
                        <Badge variant="default" className="bg-green-500">
                          <FileCheck className="h-3 w-3 mr-1" />
                          Sí
                        </Badge>
                      ) : (
                        <Button size="sm" variant="outline" className="h-7">
                          Firmar
                        </Button>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(device)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          Detalles
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerateQR(device)}
                        >
                          <QrCode className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredDevices.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No se encontraron equipos que coincidan con los filtros
            </div>
          )}
        </CardContent>
      </Card>

      <DeviceDetailsModal
        device={selectedDevice}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
      />

      <QRModal device={qrDevice} open={isQRModalOpen} onOpenChange={setIsQRModalOpen} />
    </div>
  );
}
