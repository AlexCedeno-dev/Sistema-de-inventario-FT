import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { Badge } from './ui/badge';

export type InventoryDeviceQR = {
  id: string;
  idEquipo: string | null;
  qrToken?: string | null;
  qr_token?: string | null;
  serviceTag: string | null;
  nombreEmpleado: string | null;
  departamento: string | null;
  tipo: string | null;
  marca: string | null;
  modelo: string | null;
  status: string | null;
  fechaAsig?: string | null;
  fecha_asig?: string | null;
  permisoSalidaPlanta?: boolean | number | string | null;
};

interface QRModalProps {
  device: InventoryDeviceQR | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRModal({ device, open, onOpenChange }: QRModalProps) {
  if (!device) return null;

  // --- LÓGICA INTACTA ---
  const basePath = import.meta.env.BASE_URL || '/';
  const qrToken = device.qrToken ?? device.qr_token ?? '';
  const tieneQrToken = qrToken.trim().length > 0;
  const qrUrl = `${window.location.origin}${basePath}validar-equipo/${qrToken}`;

  const permisoSalida =
    device.permisoSalidaPlanta === true ||
    device.permisoSalidaPlanta === 1 ||
    device.permisoSalidaPlanta === '1';

  const fechaAsignacion = device.fechaAsig ?? device.fecha_asig;
  const fechaAsignacionTexto = fechaAsignacion
    ? new Date(fechaAsignacion).toLocaleDateString('es-MX')
    : 'N/A';

  const API_URL = import.meta.env.VITE_API_URL;

  const handleDownloadQR = async () => {
    if (!device?.idEquipo) return;
    const res = await fetch(`${API_URL}/equipos/${device.idEquipo}/qr-etiqueta`);
    if (!res.ok) {
      alert('No se pudo descargar la etiqueta QR');
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Etiqueta-${device.serviceTag ?? device.idEquipo}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-medium text-gray-500">
            Etiqueta QR - {device.serviceTag ?? device.id}
          </DialogTitle>
        </DialogHeader>

        {/* 
            Ajuste de Proporción: p-10 en móviles y p-12 en desktop para que se vea centrado.
        */}
        <div id="qr-label" className="bg-white rounded-xl border p-8 md:p-12 w-full shadow-sm">
          {/* Header */}
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold tracking-tight text-black">FORESIGHT</h2>
            <p className="text-lg font-medium text-gray-600">
              Foresight Mexico Technology Co., Ltd.
            </p>
          </div>

          {/* 
              Cuerpo con Grid equilibrado:
              Se añadió pr-6 y pl-10 a la columna de información para que el texto 
              no toque el borde derecho y se vea proporcional al borde izquierdo.
          */}
          <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-8 items-center">
            {/* QR Section */}
            <div id="qr-code" className="flex flex-col items-center justify-center bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-200">
              <QRCodeSVG
                value={qrUrl || 'SIN_QR_TOKEN'}
                size={200}
                level="H"
                includeMargin
              />
              <span className="mt-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                Scan for Verification
              </span>
            </div>

            {/* 
                INFO SECTION: 
                - pl-10 crea el espacio desde la línea negra.
                - pr-10 crea el espacio hacia el borde derecho de la tarjeta.
            */}
            <div className="md:border-l-2 md:border-black pl-10 pr-10 space-y-4 text-lg">
              <div className="border-b border-gray-100 pb-3">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">ID de Equipo</p>
                <p className="font-bold text-xl leading-none">FSMX-{device.serviceTag}-{device.idEquipo}</p>
              </div>

              <div className="border-b border-gray-100 pb-3">
                <p className="text-xs font-bold text-gray-400 uppercase mb-1">Nombre del Empleado</p>
                <p className="font-semibold text-gray-800 leading-tight">{device.nombreEmpleado ?? 'N/A'}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-3">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Depart.</p>
                  <p className="font-semibold text-base">{device.departamento ?? 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Modelo</p>
                  <p className="font-semibold text-base">{device.modelo ?? 'N/A'}</p>
                </div>
              </div>

              <div className="border-b border-gray-100 pb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Permiso de Salida</p>
                  <Badge variant={permisoSalida ? 'default' : 'destructive'} className="text-xs px-3 py-0">
                    {permisoSalida ? 'Autorizado' : 'No Autorizado'}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-gray-400 uppercase mb-1">Estado</p>
                  <p className="font-bold text-blue-600 uppercase text-sm">{device.status ?? 'N/A'}</p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-sm font-medium text-gray-500">
                  Fecha de asignación: <span className="text-black font-bold">{fechaAsignacionTexto}</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer del Modal */}
        <div className="mt-4 space-y-3">
          <div className="bg-gray-50 p-3 rounded border border-gray-200">
            <p className="text-[10px] font-mono text-gray-400 truncate text-center">
              {qrUrl}
            </p>
          </div>

          <Button onClick={handleDownloadQR} className="w-full h-12 text-md font-bold" disabled={!tieneQrToken}>
            <Download className="h-5 w-5 mr-2" />
            Descargar Etiqueta QR (PDF)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}