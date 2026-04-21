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
  Trash2,
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
  cartaResponsiva: string | null;
  finGarantia: string | null;
};

export function InventoryNew() {
  const { t } = useLanguage();

  const [devices, setDevices] = useState<InventoryDevice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState<InventoryDevice | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrDevice, setQRDevice] = useState<InventoryDevice | null>(null);
  const [liberandoEquipoId, setLiberandoEquipoId] = useState<string | null>(null);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3006';

  const viewValue = (value: string | null) => value ?? 'N/A';

  const loadInventoryNew = async () => {
    try {
      const response = await fetch(`${API_BASE}/inventario-nuevo`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();

      const mapped = data.map((row: any) => ({
        id: `${row.equipo_id ?? 'null'}-${row.empleado_id ?? 'null'}`,
        idEquipo: row.equipo_id != null ? String(row.equipo_id) : null,
        idEmpleado: row.empleado_id != null ? String(row.empleado_id) : null,
        status: row.status ?? row.estado_registro ?? null,
        nombreEmpleado: row.nombre_completo ?? null,
        departamento: row.departamento ?? null,
        planta: row.planta ?? null,
        tipo: row.tipo ?? null,
        marca: row.marca ?? null,
        modelo: row.modelo ?? null,
        hostname: row.hostname_detectado ?? row.nombre_equipo ?? null,
        serviceTag: row.service_tag ?? null,
        firmado: false,
        bitlocker: null,
        cartaResponsiva: null,
        finGarantia: row.end_warranty ?? null,
      }));

      setDevices(mapped);
    } catch (error) {
      console.error('Error cargando inventario nuevo:', error);
      setDevices([]);
    }
  };

  useEffect(() => {
    loadInventoryNew();
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

  const handleLiberarEquipo = async (device: InventoryDevice) => {
    if (!device.idEquipo) {
      alert('Este equipo no tiene ID válido para liberar.');
      return;
    }

    const confirmacion = window.confirm(
      `¿Seguro que quieres liberar este equipo?\n\nService Tag: ${device.serviceTag ?? 'N/A'}\nEmpleado: ${device.nombreEmpleado ?? 'N/A'}\n\nEl equipo desaparecerá del inventario y volverá a quedar disponible en Agentes.`
    );

    if (!confirmacion) return;

    try {
      setLiberandoEquipoId(device.idEquipo);

      const response = await fetch(`${API_BASE}/equipos/${device.idEquipo}/liberar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'No se pudo liberar el equipo');
      }

      await loadInventoryNew();
      alert('Equipo liberado correctamente');
    } catch (error: any) {
      console.error('Error liberando equipo:', error);
      alert(error.message || 'Error al liberar equipo');
    } finally {
      setLiberandoEquipoId(null);
    }
  };

  const handleGenerarResponsiva = (device: InventoryDevice) => {
    if (!device.idEquipo) {
      alert('Este equipo no tiene ID válido para generar PDF.');
      return;
    }

    window.open(`${API_BASE}/equipos/${device.idEquipo}/responsiva-pdf`, '_blank');
  };

  return (
    <div className="p-8 space-y-6">
      <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-2xl p-8 text-white shadow-xl">
        <div className="flex items-center gap-3 mb-2">
          <h1 className="text-4xl font-bold">Inventario Nuevo</h1>
        </div>
        <p className="text-slate-100 text-lg">
          Sistema nuevo de gestión de PCs asignadas y documentación
        </p>
      </div>

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
              {devices.filter((d) => d.status === 'ACTIVO' || d.status === 'Activo').length}
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
            <CardTitle className="text-sm font-medium">{t('inventory.warrantyExpiring')}</CardTitle>
            <AlertCircle className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{warrantyExpiring}</div>
            <p className="text-xs text-gray-500 mt-1">{t('inventory.expiringSoon')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
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
            <SelectItem value="ACTIVO">ACTIVO</SelectItem>
            <SelectItem value="Activo">Activo</SelectItem>
            <SelectItem value="Inactivo">Inactivo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Inventario Nuevo</CardTitle>
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
                  <th className="text-left py-3 px-4 font-semibold text-sm">{t('inventory.status')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">{t('inventory.employee')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">{t('inventory.department')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">{t('inventory.plant')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">{t('inventory.type')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">{t('inventory.brand')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">{t('inventory.model')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">{t('inventory.letter')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">BitLocker</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">{t('inventory.signed')}</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm">{t('inventory.actions')}</th>
                </tr>
              </thead>

              <tbody>
                {filteredDevices.map((device, index) => (
                  <tr key={`${device.id}-${index}`} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{viewValue(device.idEquipo)}</td>
                    <td className="py-3 px-4 font-mono text-sm">{viewValue(device.idEmpleado)}</td>
                    <td className="py-3 px-4 font-mono text-sm">{viewValue(device.serviceTag)}</td>
                    <td className="py-3 px-4 font-mono text-sm">{viewValue(device.hostname)}</td>

                    <td className="py-3 px-4">
                      <Badge variant={device.status === 'ACTIVO' || device.status === 'Activo' ? 'default' : 'secondary'}>
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
                      <div className="flex gap-2 flex-wrap">
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

                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleGenerarResponsiva(device)}
                        >
                          Generar PDF
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={!device.idEquipo || liberandoEquipoId === device.idEquipo}
                          onClick={() => handleLiberarEquipo(device)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          {liberandoEquipoId === device.idEquipo ? 'Liberando...' : 'Liberar'}
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
              {t('inventory.noResults')}
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