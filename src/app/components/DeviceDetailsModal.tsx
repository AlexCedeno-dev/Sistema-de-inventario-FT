import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Download,
  Upload,
  FileCheck,
  Eye,
  EyeOff,
  Monitor,
  User,
  ShieldCheck,
  Key,
  FileText,
  Calendar,
  Edit3,
  MapPin,
  Tag,
  Laptop,
  Info,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

export type InventoryDeviceModal = {
  biosPassword: any;
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
  rutaCartaResponsiva?: string | null;
  finGarantia?: string | null;

  qrToken?: string | null;
  qr_token?: string | null;

  fechaAsig?: string | null;
  fecha_asig?: string | null;

  permisoSalidaPlanta?: boolean | number | string | null;

  usuarioWindows?: string;
  passwordWindows?: string;
  usuarioAdmin?: string;
  passwordAdmin?: string;
  usuarioEnrollado?: string;
  passwordEnrollado?: string;
  licenciaOffice?: string;
  usuarioNAS?: string;
  passwordNAS?: string;
  usuarioVPN?: string;
  passwordVPN?: string;
  usuarioOsticket?: string;
  passwordOsticket?: string;
};

interface DeviceDetailsModalProps {
  device: InventoryDeviceModal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUploadResponsiva?: (device: InventoryDeviceModal) => void;
  onDownloadResponsiva?: (device: InventoryDeviceModal) => void;
  onUpdated?: (device: InventoryDeviceModal) => void;
}

export function DeviceDetailsModal({
  device,
  open,
  onOpenChange,
  onUploadResponsiva,
  onDownloadResponsiva,
  onUpdated,
}: DeviceDetailsModalProps) {
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3006';

  const [showPasswords, setShowPasswords] = useState(false);
  const [detalle, setDetalle] = useState<any>(null);
  const [permisoSalida, setPermisoSalida] = useState(false);
  const [loadingPermiso, setLoadingPermiso] = useState(false);

  useEffect(() => {
    if (!device) return;

    setPermisoSalida(
      device.permisoSalidaPlanta === true ||
        device.permisoSalidaPlanta === 1 ||
        device.permisoSalidaPlanta === '1'
    );
  }, [device]);

  useEffect(() => {
    if (!open || !device?.idEquipo) return;

    const cargarDetalle = async () => {
      try {
        const res = await fetch(`${API_BASE}/equipos/${device.idEquipo}/detalle`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Error al cargar detalle');
        }

        setDetalle(data);
      } catch (error) {
        console.error('Error detalle equipo:', error);
        setDetalle(null);
      }
    };

    cargarDetalle();
  }, [open, device?.idEquipo, API_BASE]);

  if (!device) return null;

  const maskPassword = (password?: string | null) => {
    if (!password) return 'N/A';
    return showPasswords ? password : '••••••••';
  };

  const handleCambiarPermisoSalida = async (nuevoEstado: boolean) => {
    if (!device?.idEquipo) return;

    try {
      setLoadingPermiso(true);

      const res = await fetch(`${API_BASE}/equipos/${device.idEquipo}/permiso-salida`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          permiso_salida: nuevoEstado ? 1 : 0,
        }),
      });

      if (!res.ok) {
        throw new Error('Error al actualizar permiso');
      }

      const deviceActualizado: InventoryDeviceModal = {
        ...device,
        permisoSalidaPlanta: nuevoEstado ? 1 : 0,
      };

      setPermisoSalida(nuevoEstado);
      onUpdated?.(deviceActualizado);
    } catch (error) {
      console.error(error);
      alert('No se pudo actualizar el permiso');
    } finally {
      setLoadingPermiso(false);
    }
  };

  const DetailItem = ({
    label,
    value,
    icon: Icon,
  }: {
    label: string;
    value: any;
    icon: any;
  }) => (
    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-start gap-3 min-h-[92px]">
      <div className="mt-1 text-blue-500 shrink-0">
        <Icon className="h-4 w-4" />
      </div>

      <div className="min-w-0">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
          {label}
        </p>
        <p className="font-semibold text-gray-800 break-words">
          {value ?? 'N/A'}
        </p>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-5xl max-h-[92vh] overflow-y-auto p-0 border-none rounded-xl">
        <div className="bg-slate-900 text-white p-6 rounded-t-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="text-blue-400 text-xs font-bold uppercase tracking-widest mb-1">
                Detalles de Inventario
              </p>

              <DialogTitle className="text-2xl font-bold m-0 break-words">
                Equipo - {device.id}
              </DialogTitle>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                className="font-bold"
                onClick={() => navigate(`/register?equipoId=${device.idEquipo}`)}
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Editar Datos
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setShowPasswords(!showPasswords)}
              >
                {showPasswords ? (
                  <EyeOff className="h-4 w-4 mr-2" />
                ) : (
                  <Eye className="h-4 w-4 mr-2" />
                )}

                {showPasswords ? 'Ocultar' : 'Ver'} Contraseñas
              </Button>
            </div>
          </div>
        </div>

        <div className="p-6 bg-white">
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 mb-8 bg-gray-100/80 p-1 h-auto rounded-lg">
              <TabsTrigger value="info">Información</TabsTrigger>
              <TabsTrigger value="garantia">Garantía</TabsTrigger>
              <TabsTrigger value="windows">Windows</TabsTrigger>
              <TabsTrigger value="accesos">Accesos</TabsTrigger>
              <TabsTrigger value="documentos">Documentos</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 min-h-[92px]">
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-2">
                    Estado
                  </p>

                  <Badge
                    variant={
                      device.status === 'Activo' || device.status === 'ACTIVO'
                        ? 'default'
                        : 'secondary'
                    }
                    className="px-4"
                  >
                    {device.status ?? 'N/A'}
                  </Badge>
                </div>

                <DetailItem label="Empleado" value={device.nombreEmpleado} icon={User} />
                <DetailItem label="Departamento" value={device.departamento} icon={Info} />
                <DetailItem label="Planta" value={device.planta} icon={MapPin} />
                <DetailItem label="Tipo" value={device.tipo} icon={Laptop} />
                <DetailItem label="Marca" value={device.marca} icon={Tag} />
                <DetailItem label="Modelo" value={device.modelo} icon={Monitor} />
                <DetailItem label="Hostname" value={device.hostname} icon={Laptop} />
                <DetailItem label="Service Tag" value={device.serviceTag} icon={Key} />
              </div>
            </TabsContent>

            <TabsContent value="garantia" className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem label="Fin de Garantía" value={device.finGarantia} icon={Calendar} />
              </div>
            </TabsContent>

            <TabsContent value="windows" className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem
                  label="Contraseña BIOS"
                  value={maskPassword(detalle?.bios_password ?? device.biosPassword)}
                  icon={ShieldCheck}
                />

                <DetailItem
                  label="Licencia Office"
                  value={maskPassword(detalle?.licencia_office ?? device.licenciaOffice)}
                  icon={FileText}
                />

                <DetailItem
                  label="Usuario Windows"
                  value={detalle?.local_user_windows ?? device.usuarioWindows}
                  icon={User}
                />

                <DetailItem
                  label="Password Windows"
                  value={maskPassword(detalle?.password_windows ?? device.passwordWindows)}
                  icon={Key}
                />

                <DetailItem
                  label="Usuario Admin"
                  value={detalle?.usuario_admin ?? device.usuarioAdmin}
                  icon={User}
                />

                <DetailItem
                  label="Password Admin"
                  value={maskPassword(detalle?.password_admin ?? device.passwordAdmin)}
                  icon={Key}
                />
              </div>
            </TabsContent>

            <TabsContent value="accesos" className="space-y-4 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DetailItem
                  label="Usuario NAS"
                  value={detalle?.usuario_nas ?? device.usuarioNAS}
                  icon={User}
                />

                <DetailItem
                  label="Password NAS"
                  value={maskPassword(detalle?.password_nas ?? device.passwordNAS)}
                  icon={Key}
                />

                <DetailItem
                  label="Usuario VPN"
                  value={detalle?.usuario_vpn ?? device.usuarioVPN}
                  icon={User}
                />

                <DetailItem
                  label="Password VPN"
                  value={maskPassword(detalle?.password_vpn ?? device.passwordVPN)}
                  icon={Key}
                />

                <DetailItem
                  label="Usuario OSTicket"
                  value={detalle?.usuario_osticket ?? device.usuarioOsticket}
                  icon={User}
                />

                <DetailItem
                  label="Password OSTicket"
                  value={maskPassword(detalle?.password_osticket ?? device.passwordOsticket)}
                  icon={Key}
                />
              </div>
            </TabsContent>

            <TabsContent value="documentos" className="space-y-6 animate-in fade-in duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <h3 className="font-bold flex items-center gap-2 text-slate-700">
                      <FileText className="h-4 w-4 text-blue-500" />
                      Carta Responsiva
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {device.cartaResponsiva ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onDownloadResponsiva?.(device)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      ) : null}
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 font-mono bg-white p-2 rounded border border-gray-200 truncate">
                    {device.cartaResponsiva
                      ? `Archivo: ${device.cartaResponsiva}`
                      : 'No disponible'}
                  </p>
                </div>

                <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <h3 className="font-bold flex items-center gap-2 text-slate-700">
                      <ShieldCheck className="h-4 w-4 text-indigo-500" />
                      Clave BitLocker
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {device.bitlocker ? (
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Descargar
                        </Button>
                      ) : null}

                      <Button size="sm" variant="outline">
                        <Upload className="h-4 w-4 mr-2" />
                        Subir
                      </Button>
                    </div>
                  </div>

                  <p className="text-xs text-gray-500 font-mono bg-white p-2 rounded border border-gray-200 truncate">
                    {device.bitlocker ? `Archivo: ${device.bitlocker}` : 'No disponible'}
                  </p>
                </div>
              </div>

              <div className="bg-white p-5 rounded-xl border-2 border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-800">Estado de Firma</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {device.firmado
                      ? 'Documento firmado'
                      : 'Pendiente de firma por el empleado'}
                  </p>
                </div>

                {device.firmado ? (
                  <Badge variant="default" className="bg-green-500 px-4 py-1">
                    <FileCheck className="h-4 w-4 mr-2" />
                    Firmado
                  </Badge>
                ) : (
                  <Button className="bg-blue-600 hover:bg-blue-700 font-bold">
                    <FileCheck className="h-4 w-4 mr-2" />
                    Firmar Documento
                  </Button>
                )}
              </div>

              <div
                className={`p-6 rounded-xl border-2 transition-all ${
                  permisoSalida
                    ? 'bg-green-50/50 border-green-100'
                    : 'bg-red-50/50 border-red-100'
                }`}
              >
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <h3 className="font-bold text-lg text-slate-800 mb-1">
                      Permiso de Salida de Planta
                    </h3>

                    <p className="text-sm text-gray-600 max-w-md italic">
                      {permisoSalida
                        ? 'Este equipo cuenta con la autorización necesaria para ser retirado de las instalaciones.'
                        : 'El equipo no tiene autorización. Debe permanecer dentro de la planta.'}
                    </p>
                  </div>

                  <div className="flex flex-col items-start md:items-end gap-3">
                    <Badge
                      variant={permisoSalida ? 'default' : 'destructive'}
                      className="px-4 py-1 uppercase text-[10px] tracking-widest font-black"
                    >
                      {permisoSalida ? 'Autorizado' : 'Restringido'}
                    </Badge>

                    <button
                      type="button"
                      onClick={() => handleCambiarPermisoSalida(!permisoSalida)}
                      disabled={loadingPermiso}
                      className={`px-6 py-2 rounded-lg text-sm font-bold text-white shadow-sm transition-all ${
                        permisoSalida
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-green-600 hover:bg-green-700'
                      } disabled:opacity-50`}
                    >
                      {loadingPermiso
                        ? 'Actualizando...'
                        : permisoSalida
                          ? 'Revocar Autorización'
                          : 'Autorizar Salida'}
                    </button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}