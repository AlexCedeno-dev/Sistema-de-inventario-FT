import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { InventoryDevice } from '../data/mockData';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from './ui/button';
import { Download } from 'lucide-react';
import { Badge } from './ui/badge';

interface QRModalProps {
  device: InventoryDevice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function QRModal({ device, open, onOpenChange }: QRModalProps) {
  if (!device) return null;

  const qrData = JSON.stringify({
    id: device.id,
    empleado: device.nombreEmpleado,
    equipo: device.nombreEquipo,
    serviceTag: device.serviceTag,
    marca: device.marca,
    modelo: device.modelo,
    permisoSalida: device.permisoSalidaPlanta,
    departamento: device.departamento,
    planta: device.planta,
    fecha: new Date().toISOString(),
  });

  const handleDownloadQR = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (!canvas) return;

    const svg = canvas.querySelector('svg');
    if (!svg) return;

    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `QR-${device.id}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Código QR - {device.id}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-50 p-6 rounded-lg">
            <div className="flex flex-col items-center">
              <div id="qr-code" className="bg-white p-4 rounded-lg">
                <QRCodeSVG
                  value={qrData}
                  size={256}
                  level="H"
                  includeMargin={true}
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Empleado</p>
              <p className="font-semibold">{device.nombreEmpleado}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Equipo</p>
              <p className="font-mono text-sm">{device.nombreEquipo}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Service Tag</p>
              <p className="font-mono text-sm">{device.serviceTag}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">Permiso de Salida</p>
              <Badge variant={device.permisoSalidaPlanta ? 'default' : 'destructive'}>
                {device.permisoSalidaPlanta ? '✓ Autorizado para salir' : '✗ No autorizado para salir'}
              </Badge>
            </div>
          </div>

          <Button onClick={handleDownloadQR} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Descargar Código QR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
