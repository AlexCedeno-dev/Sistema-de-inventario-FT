import { useEffect, useState } from 'react';
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

type InventoryDevice = {
  id: string;
  idEquipo: string;
  idEmpleado: string;
  status: string;
  nombreEmpleado: string;
  departamento: string;
  planta: string;
  tipo: string;
  marca: string;
  modelo: string;
  hostname: string;
  serviceTag: string;
  firmado: boolean;
  bitlocker: string | null;
  cartaResponsiva: string | null;
};

export function Inventory() {
  const [devices, setDevices] = useState<InventoryDevice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState<InventoryDevice | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrDevice, setQRDevice] = useState<InventoryDevice | null>(null);

  const normalizarTag = (value: any) =>
    String(value ?? '')
      .trim()
      .toUpperCase();

  useEffect(() => {
    const loadInventory = async () => {
      try {
        const [equiposRes, identificadosRes] = await Promise.all([
          //fetch('http://192.168.179.6:3005/equipos'),
          //fetch('http://192.168.179.6:3005/equipos-identificados'),
          fetch('http://localhost:3006/equipos-local'),
          fetch('http://localhost:3006/equipos-identificados-local'),
        ]);

        const equipos = await equiposRes.json();
        const identificados = await identificadosRes.json();

        const mapaEquipos = new Map();

        equipos.forEach((item: any) => {
          const tag = normalizarTag(item?.sistema?.idDispositivo);

          if (tag) {
            mapaEquipos.set(tag, item);
          }
        });

        const mapped: InventoryDevice[] = identificados
          .filter((d: any) => d.inventario)
          .map((d: any) => {
            const idEquipo = String(d.inventario?.equipo_id ?? '0');
            const idEmpleado = String(d.inventario?.empleado_id ?? '0');

            const serviceTag = normalizarTag(
              d.inventario?.service_tag ?? d.sistema?.idDispositivo
            );

            const matchEquipo = mapaEquipos.get(serviceTag);

            return {
              id: `${idEquipo}-${idEmpleado}`,
              idEquipo,
              idEmpleado,
              status: matchEquipo?.estado ?? 'Activo',
              nombreEmpleado: d.inventario?.nombre_completo ?? 'Sin asignar',
              departamento: d.inventario?.departamento ?? 'N/A',
              planta: d.inventario?.planta ?? 'N/A',
              tipo: d.inventario?.tipo ?? 'N/A',
              marca: d.inventario?.marca ?? matchEquipo?.marca ?? d.marca ?? 'N/A',
              modelo:
                d.inventario?.modelo ??
                matchEquipo?.modelo ??
                d.modelo ??
                d.inventario?.nombre_equipo ??
                'N/A',
              hostname:
                matchEquipo?.hostname ??
                d.hostname ??
                d.sistema?.hostname ??
                'N/A',
              serviceTag:
                d.inventario?.service_tag ??
                matchEquipo?.sistema?.idDispositivo ??
                d.sistema?.idDispositivo ??
                'N/A',
              firmado: false,
              bitlocker: null,
              cartaResponsiva: null,
            };
          });

        setDevices(mapped);
      } catch (error) {
        console.error('Error cargando inventario:', error);
      }
    };

    loadInventory();
  }, []);

  const filteredDevices = devices.filter((device) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      device.idEquipo.toLowerCase().includes(term) ||
      device.idEmpleado.toLowerCase().includes(term) ||
      device.nombreEmpleado.toLowerCase().includes(term) ||
      device.departamento.toLowerCase().includes(term) ||
      device.serviceTag.toLowerCase().includes(term) ||
      device.hostname.toLowerCase().includes(term) ||
      device.modelo.toLowerCase().includes(term);

    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (device: InventoryDevice) => {
    setSelectedDevice(device);
    setIsDetailsModalOpen(true);
  };

  const handleGenerateQR = (device: InventoryDevice) => {
    setQRDevice(device);
    setIsQRModalOpen(true);
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Inventario de Equipos</h1>
        <p className="text-gray-500 mt-1">Gestión de PCs asignadas y documentación</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Equipos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Activos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {devices.filter((d) => d.status === 'Activo').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Firmados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {devices.filter((d) => d.firmado).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Con BitLocker</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {devices.filter((d) => d.bitlocker !== null).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por ID, empleado, departamento, hostname o service tag..."
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

      <Card>
        <CardHeader>
          <CardTitle>PCs Asignadas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-sm">ID EQUIPO</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">ID EMPLEADO</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">SERVICE TAG</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">HOSTNAME</th>
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
                    <td className="py-3 px-4 font-mono text-sm">{device.idEquipo}</td>
                    <td className="py-3 px-4 font-mono text-sm">{device.idEmpleado}</td>
                    <td className="py-3 px-4 font-mono text-sm">{device.serviceTag}</td>
                    <td className="py-3 px-4 font-mono text-sm">{device.hostname}</td>
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

      <QRModal
        device={qrDevice}
        open={isQRModalOpen}
        onOpenChange={setIsQRModalOpen}
      />
    </div>
  );
}