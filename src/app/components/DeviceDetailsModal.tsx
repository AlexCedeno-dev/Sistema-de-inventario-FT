import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { InventoryDevice } from '../data/mockData';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Download, Upload, FileCheck, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface DeviceDetailsModalProps {
  device: InventoryDevice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeviceDetailsModal({ device, open, onOpenChange }: DeviceDetailsModalProps) {
  const [showPasswords, setShowPasswords] = useState(false);

  if (!device) return null;

  const maskPassword = (password: string) => {
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
              onClick={() => setShowPasswords(!showPasswords)}
            >
              {showPasswords ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
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
                <Badge variant={device.status === 'Activo' ? 'default' : 'secondary'}>
                  {device.status}
                </Badge>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Empleado</p>
                <p className="font-semibold">{device.nombreEmpleado}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Departamento</p>
                <p className="font-semibold">{device.departamento}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Planta</p>
                <p className="font-semibold">{device.planta}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Tipo</p>
                <p className="font-semibold">{device.tipo}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Marca</p>
                <p className="font-semibold">{device.marca}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Modelo</p>
                <p className="font-semibold">{device.modelo}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Service Tag</p>
                <p className="font-mono text-sm">{device.serviceTag}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Nombre del Equipo</p>
                <p className="font-mono text-sm">{device.nombreEquipo}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg col-span-3">
                <p className="text-sm text-gray-500">Especificaciones</p>
                <p className="text-sm">{device.especificaciones}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="garantia" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Fecha de Compra</p>
                <p className="font-semibold">{new Date(device.fechaCompra).toLocaleDateString('es-MX')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Fecha de Asignación</p>
                <p className="font-semibold">{new Date(device.fechaAsignacion).toLocaleDateString('es-MX')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Inicio de Garantía</p>
                <p className="font-semibold">{new Date(device.inicioGarantia).toLocaleDateString('es-MX')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Fin de Garantía</p>
                <p className="font-semibold">{new Date(device.finGarantia).toLocaleDateString('es-MX')}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                <p className="text-sm text-gray-500">Estado de Renovación</p>
                <Badge variant={device.estadoRenovacion === 'Vigente' ? 'default' : 'destructive'}>
                  {device.estadoRenovacion}
                </Badge>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="windows" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">BIOS Password</p>
                <p className="font-mono text-sm">{maskPassword(device.biosPassword)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Licencia Office</p>
                <p className="font-mono text-sm">{device.licenciaOffice}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Usuario Windows</p>
                <p className="font-mono text-sm">{device.usuarioWindows}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Contraseña Windows</p>
                <p className="font-mono text-sm">{maskPassword(device.passwordWindows)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Usuario Admin</p>
                <p className="font-mono text-sm">{device.usuarioAdmin}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Contraseña Admin</p>
                <p className="font-mono text-sm">{maskPassword(device.passwordAdmin)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Correo Enrollado</p>
                <p className="font-mono text-sm">{device.correoEnrollado}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Contraseña Enrollado</p>
                <p className="font-mono text-sm">{maskPassword(device.passwordEnrollado)}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="accesos" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Correo Exmail</p>
                <p className="font-mono text-sm">{device.correoExmail}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Contraseña Exmail</p>
                <p className="font-mono text-sm">{maskPassword(device.passwordExmail)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Usuario NAS</p>
                <p className="font-mono text-sm">{device.usuarioNAS}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Contraseña NAS</p>
                <p className="font-mono text-sm">{maskPassword(device.passwordNAS)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Usuario VPN</p>
                <p className="font-mono text-sm">{device.usuarioVPN}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Contraseña VPN</p>
                <p className="font-mono text-sm">{maskPassword(device.passwordVPN)}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Usuario OSTicket</p>
                <p className="font-mono text-sm">{device.usuarioOsticket}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500">Contraseña OSTicket</p>
                <p className="font-mono text-sm">{maskPassword(device.passwordOsticket)}</p>
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
                      <Button size="sm">
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
                      {device.permisoSalidaPlanta
                        ? 'El equipo cuenta con permiso para salir de las instalaciones'
                        : 'El equipo NO puede salir de las instalaciones'}
                    </p>
                  </div>
                  <Badge variant={device.permisoSalidaPlanta ? 'default' : 'destructive'}>
                    {device.permisoSalidaPlanta ? 'Autorizado' : 'No Autorizado'}
                  </Badge>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
