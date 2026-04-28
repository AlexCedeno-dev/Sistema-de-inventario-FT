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
  AlertCircle,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import { useLanguage } from '../context/LanguageContext';

type InventoryDevice = {
  id: string;
  idEquipo: string | null;
  idEmpleado: string | null;
  status: string | null;
  nombreEmpleado: string | null;
  departamento: string | null;
  planta: string | null;
  tipo: string | null;
  marca: string | null;
  modelo: string | null;
  hostname: string | null;
  serviceTag: string | null;
  firmado: boolean;
  bitlocker: string | null;
  biosPassword: string | null;
  cartaResponsiva: string | null;
  finGarantia: string | null;
};

export function Inventory() {
  const { t } = useLanguage();

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

  const toNullableString = (value: any): string | null => {
    if (value === undefined || value === null) return null;
    const text = String(value).trim();
    if (!text) return null;

    const invalidValues = ['undefined', 'null', 'n/a', 'na', 'sin asignar', '0'];
    if (invalidValues.includes(text.toLowerCase())) return null;

    return text;
  };

  const viewValue = (value: string | null) => value ?? 'null';

  useEffect(() => {
  const loadInventory = async () => {
    try {
        //LOCAL
        const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3006';

      const response = await fetch(`${API_BASE}/inventario-viejo`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();
      setDevices(data);
    } catch (error) {
      console.error('Error cargando inventario viejo:', error);
      setDevices([]);
    }
  };

    loadInventory();
  }, []);

  const warrantyExpiring = devices.filter((device) => {
    if (!device.finGarantia) return false;

    const endDate = new Date(device.finGarantia);
    if (isNaN(endDate.getTime())) return false;

    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);

    return endDate <= sixMonthsFromNow && endDate >= today;
  }).length;

  const filteredDevices = devices.filter((device) => {
    const term = searchTerm.toLowerCase();

    const matchesSearch =
      (device.idEquipo ?? '').toLowerCase().includes(term) ||
      (device.idEmpleado ?? '').toLowerCase().includes(term) ||
      (device.nombreEmpleado ?? '').toLowerCase().includes(term) ||
      (device.departamento ?? '').toLowerCase().includes(term) ||
      (device.serviceTag ?? '').toLowerCase().includes(term) ||
      (device.hostname ?? '').toLowerCase().includes(term) ||
      (device.modelo ?? '').toLowerCase().includes(term);

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
      {/* Header nuevo diseño */}
      <div className="bg-gradient-to-r from-gray-600 to-gray-800 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold">Inventario Viejo</h1>
        </div>
        <p className="text-gray-100 text-lg">
          Sistema de gestión de PCs asignadas y documentación
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('inventory.totalDevices')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{devices.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('inventory.active')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {devices.filter((d) => d.status === 'Activo').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">{t('inventory.signed')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {devices.filter((d) => d.firmado).length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {t('inventory.warrantyExpiring')}
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{warrantyExpiring}</div>
            <p className="text-xs text-gray-500 mt-1">{t('inventory.expiringSoon')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('inventory.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder={t('inventory.status')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t('inventory.allStatus')}</SelectItem>
            <SelectItem value="Activo">{t('inventory.activeStatus')}</SelectItem>
            <SelectItem value="Mantenimiento">{t('inventory.maintenanceStatus')}</SelectItem>
            <SelectItem value="Inactivo">{t('inventory.inactiveStatus')}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabla */}
      <Card>
        <CardHeader>
          <CardTitle>{t('inventory.assignedPCs')}</CardTitle>
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
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    {t('inventory.status')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    {t('inventory.employee')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    {t('inventory.department')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    {t('inventory.plant')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    {t('inventory.type')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    {t('inventory.brand')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    {t('inventory.model')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    {t('inventory.letter')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">BitLocker</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    {t('inventory.signed')}
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">
                    {t('inventory.actions')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredDevices.map((device) => (
                  <tr key={device.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{viewValue(device.idEquipo)}</td>
                    <td className="py-3 px-4 font-mono text-sm">{viewValue(device.idEmpleado)}</td>
                    <td className="py-3 px-4 font-mono text-sm">
                      {viewValue(device.serviceTag)}
                    </td>
                    <td className="py-3 px-4 font-mono text-sm">{viewValue(device.hostname)}</td>

                    <td className="py-3 px-4">
                      <Badge
                        variant={device.status === 'Activo' ? 'default' : 'secondary'}
                      >
                        {viewValue(device.status)}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-sm">{viewValue(device.nombreEmpleado)}</td>
                    <td className="py-3 px-4 text-sm">{viewValue(device.departamento)}</td>
                    <td className="py-3 px-4 text-sm">{viewValue(device.planta)}</td>
                    <td className="py-3 px-4 text-sm">{viewValue(device.tipo)}</td>
                    <td className="py-3 px-4 text-sm">{viewValue(device.marca)}</td>
                    <td className="py-3 px-4 text-sm">{viewValue(device.modelo)}</td>

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
                          {t('inventory.yes')}
                        </Badge>
                      ) : (
                        <Button size="sm" variant="outline" className="h-7">
                          {t('inventory.sign')}
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
                          {t('inventory.details')}
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
            <div className="text-center py-8 text-gray-500">{t('inventory.noResults')}</div>
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