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
  permisoSalidaPlanta?: boolean | number | null;
};

interface QRModalProps {
  device: InventoryDeviceQR | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRModal({ device, open, onOpenChange }: QRModalProps) {
  if (!device) return null;

  const qrToken = device.qrToken ?? device.qr_token;

  const basePath = import.meta.env.BASE_URL || '/';

  const qrUrl = qrToken
    ? `${window.location.origin}${basePath}validar-equipo/${qrToken}`
    : '';

  const permisoSalida = Boolean(device.permisoSalidaPlanta);

  const fechaAsignacion = device.fechaAsig ?? device.fecha_asig;

  const fechaAsignacionTexto = fechaAsignacion
    ? new Date(fechaAsignacion).toLocaleDateString('es-MX')
    : 'N/A';

  const handleDownloadQR = () => {
    const qrContainer = document.getElementById('qr-code');
    if (!qrContainer) return;

    const svg = qrContainer.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8',
    });

    const url = URL.createObjectURL(svgBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `QR-${device.serviceTag ?? device.id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Etiqueta QR - {device.serviceTag ?? device.id}</DialogTitle>
        </DialogHeader>

        <div className="bg-white rounded-lg border p-6">
          <div className="text-center mb-5">
            <h2 className="text-3xl font-bold tracking-wide">FORESIGHT</h2>
            <p className="text-lg font-semibold">
              Foresight Mexico Technology Co., Ltd.
            </p>
          </div>

          <div className="grid grid-cols-[260px_1fr] gap-6 items-center">
            <div id="qr-code" className="bg-white p-2 flex justify-center">
              <QRCodeSVG
                value={qrUrl || 'SIN_QR_TOKEN'}
                size={240}
                level="H"
                includeMargin
              />
            </div>

            <div className="border-l-2 border-black pl-5 space-y-3 text-lg">
              <div className="border-b pb-2">
                <p className="font-semibold">{device.serviceTag ?? 'N/A'}</p>
              </div>

              <div className="border-b pb-2">
                <p>{device.nombreEmpleado ?? 'N/A'}</p>
              </div>

              <div className="border-b pb-2">
                <p>{device.departamento ?? 'N/A'}</p>
              </div>

              <div className="border-b pb-2">
                <p>{device.tipo ?? 'N/A'}</p>
              </div>

              <div className="border-b pb-2">
                <p>{device.modelo ?? 'N/A'}</p>
              </div>

              <div className="border-b pb-2">
                <Badge variant={permisoSalida ? 'default' : 'destructive'}>
                  {permisoSalida
                    ? 'Autorizado para salir'
                    : 'No autorizado para salir'}
                </Badge>
              </div>

              <div className="border-b pb-2">
                <p>{device.status ?? 'N/A'}</p>
              </div>

              <div>
                <p>Fecha de asignación: {fechaAsignacionTexto}</p>
              </div>
            </div>
          </div>
        </div>

        {!qrToken && (
          <p className="text-sm text-red-500">
            Este equipo no tiene QR Token. Revisa que el backend esté mandando qr_token.
          </p>
        )}

        <Button onClick={handleDownloadQR} className="w-full" disabled={!qrToken}>
          <Download className="h-4 w-4 mr-2" />
          Descargar Código QR
        </Button>
      </DialogContent>
    </Dialog>
  );
}