import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Download, Upload, FileCheck, Eye, EyeOff } from 'lucide-react';
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
  
}

export function DeviceDetailsModal({device, open, onOpenChange, onUploadResponsiva, onDownloadResponsiva,
}: DeviceDetailsModalProps) {
  const [showPasswords, setShowPasswords] = useState(false);
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3006';
  const [detalle, setDetalle] = useState<any>(null);
  const navigate = useNavigate();

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
    }, [open, device?.idEquipo]);


  if (!device) return null;

  const maskPassword = (password?: string | null) => {
    if (!password) return 'N/A';
    return showPasswords ? password : '••••••••';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Detalles del Equipo - {device.id}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/register?equipoId=${device.idEquipo}`)}
            >
              Editar Datos
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowPasswords(!showPasswords)}
            >
              {showPasswords ? (
                <EyeOff className="h-4 w-4 mr-2" />
              ) : (
                <Eye className="h-4 w-4 mr-2" />
              )}
              {showPasswords ? 'Ocultar' : 'Mostrar'} Contraseñas
            </Button>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="garantia">Garantía</TabsTrigger>
            <TabsTrigger value="windows">Windows</TabsTrigger>
            <TabsTrigger value="accesos">Accesos</TabsTrigger>
            <TabsTrigger value="documentos">Documentos</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Estado</p>
                <Badge variant={device.status === 'Activo' || device.status === 'ACTIVO' ? 'default' : 'secondary'}>
                  {device.status ?? 'N/A'}
                </Badge>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Empleado</p>
                <p className="font-semibold">{device.nombreEmpleado ?? 'N/A'}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Departamento</p>
                <p className="font-semibold">{device.departamento ?? 'N/A'}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Planta</p>
                <p className="font-semibold">{device.planta ?? 'N/A'}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Tipo</p>
                <p className="font-semibold">{device.tipo ?? 'N/A'}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Marca</p>
                <p className="font-semibold">{device.marca ?? 'N/A'}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Modelo</p>
                <p className="font-semibold">{device.modelo ?? 'N/A'}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Hostname</p>
                <p className="font-semibold">{device.hostname ?? 'N/A'}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Service Tag</p>
                <p className="font-semibold">{device.serviceTag ?? 'N/A'}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="garantia" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Fin de Garantía</p>
                <p className="font-semibold">{device.finGarantia ?? 'N/A'}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="windows" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Contraseña BIOS</p>
                <p className="font-semibold">{maskPassword(detalle?.bios_password ?? device.biosPassword)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Licencia Office</p>
                <p className="font-semibold">{maskPassword(detalle?.licencia_office ?? device.licenciaOffice)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Usuario Windows</p>
                <p className="font-semibold">{detalle?.local_user_windows ?? device.usuarioWindows ?? 'N/A'}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Password Windows</p>
                <p className="font-semibold">{maskPassword(detalle?.password_windows ?? device.passwordWindows)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Usuario Admin</p>
                <p className="font-semibold">{detalle?.usuario_admin ?? device.usuarioAdmin ?? 'N/A'}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Password Admin</p>
                <p className="font-semibold">{maskPassword(detalle?.password_admin ?? device.passwordAdmin)}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accesos" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Usuario NAS</p>
                <p className="font-semibold">{detalle?.usuario_nas ?? device.usuarioNAS ?? 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Password NAS</p>
                <p className="font-semibold">{maskPassword(detalle?.password_nas ?? device.passwordNAS)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Usuario VPN</p>
                <p className="font-semibold">{detalle?.usuario_vpn ?? device.usuarioVPN ?? 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Password VPN</p>
                <p className="font-semibold">{maskPassword(detalle?.password_vpn ?? device.passwordVPN)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Usuario OSTicket</p>
                <p className="font-semibold">{detalle?.usuario_osticket ?? device.usuarioOsticket ?? 'N/A'}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Password OSTicket</p>
                <p className="font-semibold">{maskPassword(detalle?.password_osticket ?? device.passwordOsticket)}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="documentos" className="space-y-4">
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Carta Responsiva</h3>
                  <div className="flex gap-2">
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

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => onUploadResponsiva?.(device)}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Subir
                    </Button>
                  </div>
                </div>

                <p className="text-sm text-gray-500">
                  {device.cartaResponsiva ? `Archivo: ${device.cartaResponsiva}` : 'No disponible'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Clave BitLocker</h3>
                  <div className="flex gap-2">
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

                <p className="text-sm text-gray-500">
                  {device.bitlocker ? `Archivo: ${device.bitlocker}` : 'No disponible'}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Estado de Firma</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {device.firmado ? 'Documento firmado' : 'Pendiente de firma'}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {device.firmado ? (
                      <Badge variant="default" className="bg-green-500">
                        <FileCheck className="h-4 w-4 mr-1" />
                        Firmado
                      </Badge>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => onUploadResponsiva?.(device)}
                      >
                        <FileCheck className="h-4 w-4 mr-2" />
                        Firmar
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Permiso de Salida de Planta</h3>
                    <p className="text-sm text-gray-500 mt-1">
                      El equipo NO puede salir de las instalaciones
                    </p>
                  </div>
                  <Badge variant="destructive">No Autorizado</Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}