import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { DeviceDetailsModal, type InventoryDeviceModal } from '../components/DeviceDetailsModal';
import { SignatureModal } from '../components/SignatureModal';
import { QRModal } from '../components/QRModal';
import QRCode from 'react-qr-code';
import { useSearchParams } from 'react-router';
import { EntregaDialog } from '../components/modalsofinvenory/EntregaDialog';
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
  PackageOpen,
  Laptop,
  FileText,
  Clock,
  AlertTriangle,
  CheckCircle,
  Info,
  Link,
  ClipboardList,
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '../components/ui/alert-dialog';
import { useLanguage } from '../context/LanguageContext';


type InventoryDevice = InventoryDeviceModal;

// ============ COMPONENTES DE ALERTA PERSONALIZADOS ============

interface CustomAlertProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  type?: 'success' | 'error' | 'warning' | 'info';
}

function CustomAlert({ open, onOpenChange, title, description, type = 'info' }: CustomAlertProps) {
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-6 w-6 text-green-600" />;
      case 'error':
        return <XCircle className="h-6 w-6 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="h-6 w-6 text-orange-600" />;
      default:
        return <Info className="h-6 w-6 text-blue-600" />;
    }
  };

  const getColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-orange-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            {getIcon()}
            <AlertDialogTitle className={getColor()}>{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base pt-2">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => onOpenChange(false)}>
            Entendido
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'destructive';
}

function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'default',
}: ConfirmDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-6 w-6 text-orange-600" />
            <AlertDialogTitle className="text-orange-600">{title}</AlertDialogTitle>
          </div>
          <AlertDialogDescription className="text-base pt-2 whitespace-pre-line">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              onOpenChange(false);
            }}
            className={variant === 'destructive' ? 'bg-red-600 hover:bg-red-700' : ''}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface PromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: (value: string) => void;
  placeholder?: string;
  confirmText?: string;
  cancelText?: string;
}

  interface LiberacionDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    device: InventoryDevice | null;
    loading?: boolean;
    onConfirm: (data: {
      liberadoPor: string;
      tipoLiberador: 'IT' | 'BECARIO';
    }) => void;
  }

  function LiberacionDialog({
    open,
    onOpenChange,
    device,
    loading = false,
    onConfirm,
  }: LiberacionDialogProps) {
    const [liberadoPor, setLiberadoPor] = useState('');
    const [tipoLiberador, setTipoLiberador] = useState<'IT' | 'BECARIO' | ''>('');

    useEffect(() => {
      if (!open) {
        setLiberadoPor('');
        setTipoLiberador('');
      }
    }, [open]);

    const puedeConfirmar =
      liberadoPor.trim().length > 0 &&
      tipoLiberador !== '' &&
      !loading;

    const handleSubmit = () => {
      if (!puedeConfirmar) return;

      onConfirm({
        liberadoPor: liberadoPor.trim(),
        tipoLiberador,
      });
    };

    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <Trash2 className="h-6 w-6 text-red-600" />
              <AlertDialogTitle className="text-red-600">
                Registrar liberación
              </AlertDialogTitle>
            </div>

            <AlertDialogDescription className="pt-2">
              Indica quién está liberando el equipo para guardar el historial.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-2">
            <div className="rounded-xl border bg-slate-50 p-3 text-sm">
              <p>
                <span className="font-semibold">Service Tag:</span>{' '}
                {device?.serviceTag || 'N/A'}
              </p>
              <p>
                <span className="font-semibold">Empleado:</span>{' '}
                {device?.nombreEmpleado || 'N/A'}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Nombre de quien libera
              </label>
              <Input
                value={liberadoPor}
                onChange={(e) => setLiberadoPor(e.target.value)}
                placeholder="Ej: Martin Romo"
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Tipo
              </label>

              <Select
                value={tipoLiberador}
                onValueChange={(value) =>
                  setTipoLiberador(value as 'IT' | 'BECARIO')
                }
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IT">Empleado de IT</SelectItem>
                  <SelectItem value="BECARIO">Becario</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>
              Cancelar
            </AlertDialogCancel>

            <Button
              type="button"
              disabled={!puedeConfirmar}
              onClick={handleSubmit}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? 'Liberando...' : 'Confirmar liberación'}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }


  function PromptDialog({
    open,
    onOpenChange,
    title,
    description,
    onConfirm,
    placeholder = '',
    confirmText = 'Aceptar',
    cancelText = 'Cancelar',
  }: PromptDialogProps) {
    const [value, setValue] = useState('');

  useEffect(() => {
    if (!open) setValue('');
  }, [open]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription className="pt-2">{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="my-2"
        />
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (value.trim()) {
                onConfirm(value.trim());
                onOpenChange(false);
              }
            }}
            disabled={!value.trim()}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}



// ============ COMPONENTE PRINCIPAL ============

export function InventoryNew() {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();
  const [devices, setDevices] = useState<InventoryDevice[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedDevice, setSelectedDevice] = useState<InventoryDevice | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isQRModalOpen, setIsQRModalOpen] = useState(false);
  const [qrDevice, setQRDevice] = useState<InventoryDevice | null>(null);
  const [liberandoEquipoId, setLiberandoEquipoId] = useState<string | null>(null);

  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [deviceToSign, setDeviceToSign] = useState<InventoryDevice | null>(null);

  const [firmaLink,setFirmaLink]=useState('');
  const [qrOpen,setQrOpen]=useState(false); 
  const [entregaDialog, setEntregaDialog] = useState<{
  open: boolean;
  device: InventoryDevice | null;
    }>({
      open: false,
      device: null,
    });
  const [liberacionDialog, setLiberacionDialog] = useState<{
      open: boolean;
      device: InventoryDevice | null;
    }>({
      open: false,
      device: null,
    });

  // Estados para alertas y diálogos
  const [alert, setAlert] = useState<{
    open: boolean;
    title: string;
    description: string;
    type: 'success' | 'error' | 'warning' | 'info';
  }>({ open: false, title: '', description: '', type: 'info' });

  const [confirmDialog, setConfirmDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: () => void;
    variant?: 'default' | 'destructive';
  }>({ open: false, title: '', description: '', onConfirm: () => {} });

  const [promptDialog, setPromptDialog] = useState<{
    open: boolean;
    title: string;
    description: string;
    onConfirm: (value: string) => void;
    placeholder?: string;
  }>({ open: false, title: '', description: '', onConfirm: () => {}, placeholder: '' });

  const API_BASE =
    import.meta.env.DEV
      ? import.meta.env.VITE_API_URL || 'http://localhost:3006'
      : window.location.origin;

  const viewValue = (value: string | null) => value ?? 'N/A';

  const showAlert = (
    title: string,
    description: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info'
  ) => {
    setAlert({ open: true, title, description, type });
  };

  const loadInventoryNew = async () => {
    try {
      const response = await fetch(`${API_BASE}/inventario-nuevo`);

      if (!response.ok) {
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();

      const mapped: InventoryDevice[] = data.map((row: any) => ({
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
        firmado: !!row.carta_responsiva,
        bitlocker: row.bitlocker ?? null,
        rutaBitlocker: row.ruta_bitlocker ?? null,
        cartaResponsiva: row.carta_responsiva ?? null,
        rutaCartaResponsiva: row.ruta_carta_responsiva ?? null,
        finGarantia: row.end_warranty ?? null,

        qrToken: row.qr_token ?? null,
        fechaAsig: row.fecha_asig ?? null,
        permisoSalidaPlanta: row.permiso_salida ?? null,

        usuarioWindows: row.local_user_windows ?? '',
        passwordWindows: row.password_windows ?? '',
        usuarioAdmin: row.usuario_admin ?? '',
        passwordAdmin: row.password_admin ?? '',

        usuarioEnrollado: row.usuario_enrollado ?? '',
        passwordEnrollado: row.password_enrollado ?? '',
        licenciaOffice: row.licencia_office ?? '',

        usuarioExmail: row.usuario_exmail ?? '',
        passwordExmail: row.password_exmail ?? '',
        usuarioNAS: row.usuario_nas ?? '',
        passwordNAS: row.password_nas ?? '',
        usuarioVPN: row.usuario_vpn ?? '',
        passwordVPN: row.password_vpn ?? '',
        usuarioOsticket: row.usuario_osticket ?? '',
        passwordOsticket: row.password_osticket ?? '',
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

      useEffect(() => {
      const serviceTag = searchParams.get('service_tag');
      const hostname = searchParams.get('hostname');

      if (serviceTag) {
        setSearchTerm(serviceTag);
      } else if (hostname) {
        setSearchTerm(hostname);
      }
    }, [searchParams]);

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
    showAlert('Error', 'Este equipo no tiene ID válido para liberar.', 'error');
    return;
  }

  setConfirmDialog({
    open: true,
    title: '¿Confirmar liberación de equipo?',
    description: `¿Seguro que quieres liberar este equipo?\n\nService Tag: ${device.serviceTag ?? 'N/A'}\nEmpleado: ${device.nombreEmpleado ?? 'N/A'}\n\nEl equipo desaparecerá del inventario y volverá a quedar disponible en Agentes.`,
    variant: 'destructive',
    onConfirm: () => {
      setLiberacionDialog({
        open: true,
        device,
      });
    },
  });
};

const handleConfirmarLiberacion = async ({
  liberadoPor,
  tipoLiberador,
}: {
  liberadoPor: string;
  tipoLiberador: 'IT' | 'BECARIO';
}) => {
  const device = liberacionDialog.device;

  if (!device?.idEquipo) {
    showAlert('Error', 'Este equipo no tiene ID válido para liberar.', 'error');
    return;
  }

  try {
    setLiberandoEquipoId(device.idEquipo);

    const response = await fetch(`${API_BASE}/equipos/${device.idEquipo}/liberar`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        liberadoPor,
        tipoLiberador,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'No se pudo liberar el equipo');
    }

    setLiberacionDialog({
      open: false,
      device: null,
    });

    await loadInventoryNew();

    showAlert(
      '¡Éxito!',
      'Equipo liberado correctamente y registrado en historial.',
      'success'
    );
  } catch (error: any) {
    console.error('Error liberando equipo:', error);
    showAlert('Error', error.message || 'Error al liberar equipo', 'error');
  } finally {
    setLiberandoEquipoId(null);
  }
};

  // LEGACY: flujo anterior, pendiente de eliminar cuando terminemos nuevo flujo
  const handleGenerarResponsiva = (device: InventoryDevice) => {
    if (!device.idEquipo) {
      showAlert('Error', 'Este equipo no tiene ID válido para generar PDF.', 'error');
      return;
    }

    setPromptDialog({
      open: true,
      title: 'Generar Carta Responsiva',
      description: 'Ingresa el nombre de quien entrega el equipo:',
      placeholder: 'Ej: Juan Pérez',
      onConfirm: (entregadoPor) => {
        const nombre = encodeURIComponent(entregadoPor);
        window.open(
          `${API_BASE}/equipos/${device.idEquipo}/responsiva-pdf?entregadoPor=${nombre}`,
          '_blank'
        );
      },
    });
  };

  const handleSubirResponsivaFirmada = async (device: InventoryDevice) => {
    if (!device.idEquipo) {
      showAlert('Error', 'Equipo sin ID válido', 'error');
      return;
    }

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/pdf';

    input.onchange = async (event: Event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (!file) return;

      const formData = new FormData();
      formData.append('archivo', file);

      try {
        const response = await fetch(
          `${API_BASE}/equipos/${device.idEquipo}/responsiva-firmada`,
          {
            method: 'POST',
            body: formData,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'No se pudo subir la responsiva');
        }

        showAlert('¡Éxito!', 'Responsiva firmada subida correctamente', 'success');
        await loadInventoryNew();
      } catch (error: any) {
        showAlert('Error', error.message || 'Error al subir responsiva', 'error');
      }
    };

    input.click();
  };

  const handleDescargarResponsiva = (device: InventoryDevice) => {
    if (!device.idEquipo) {
      showAlert('Error', 'Equipo sin ID válido', 'error');
      return;
    }

    window.open(`${API_BASE}/equipos/${device.idEquipo}/responsiva-firmada`, '_blank');
  };

  const handleSubirBitlocker = async (device: InventoryDevice) => {

    if (!device.idEquipo) return;

    const input = document.createElement('input');
    input.type='file';
    input.accept='application/pdf';

    input.onchange = async (e:any) => {

      const file = e.target.files?.[0];
      if(!file) return;

      const formData = new FormData();
      formData.append('archivo', file);

      await fetch(
        `${API_BASE}/equipos/${device.idEquipo}/bitlocker`,
        {
          method:'POST',
          body: formData
        }
      );

      await loadInventoryNew();
    };

    input.click();
};

const handleDescargarBitlocker = (
    device: InventoryDevice
    ) => {

    window.open(
      `${API_BASE}/equipos/${device.idEquipo}/bitlocker`,
      '_blank'
    );
};
// LEGACY: flujo anterior, pendiente de eliminar cuando terminemos nuevo flujo
const handleAbrirFirma = (device: InventoryDevice) => {
  setDeviceToSign(device);
  setIsSignatureOpen(true);
};

// LEGACY: flujo anterior, pendiente de eliminar cuando terminemos nuevo flujo
const handleGuardarFirmaDigital = async (firmas: {
  firmaITBase64: string;
  firmaReceptorBase64: string;
}) => {
  if (!deviceToSign?.idEquipo) {
    showAlert('Error', 'Equipo sin ID válido', 'error');
    return;
  }

  setPromptDialog({
    open: true,
    title: 'Confirmar entrega',
    description: 'Ingresa el nombre de quien entrega el equipo:',
    placeholder: 'Ej: Alejandro Cedeño',
    onConfirm: async (entregadoPor) => {
      try {
        const response = await fetch(
          `${API_BASE}/equipos/${deviceToSign.idEquipo}/responsiva-firma-digital`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firmaITBase64: firmas.firmaITBase64,
              firmaReceptorBase64: firmas.firmaReceptorBase64,
              entregadoPor,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'No se pudo guardar la firma');
        }

        showAlert('¡Éxito!', 'Responsiva firmada digitalmente', 'success');
        await loadInventoryNew();
      } catch (error: any) {
        showAlert('Error', error.message || 'Error al guardar firma', 'error');
      }
    },
  });
};

      // LEGACY: flujo anterior, pendiente de eliminar cuando terminemos nuevo flujo
      const handleGenerarFirmaMovil = (device:any) => {

      setPromptDialog({ open:true,
        title:'Firma por teléfono',
        description:
      'Nombre de quien entrega el equipo:',
        placeholder:'Ej. Alejandro',

        onConfirm: async (entregadoPor)=>{

        try{

          const res=
          await fetch(
      `${API_BASE}/equipos/${device.idEquipo}/generar-link-firma`,
      {
      method:'POST',
      headers:{
        'Content-Type':
        'application/json'
      },
      body:JSON.stringify({
        entregadoPor
      })
      }
      );

      const json=
      await res.json();

      if(!res.ok){
        throw new Error(
          json.error
        );
      }

      setFirmaLink(
        json.url
      );

      setQrOpen(true);

        }catch(error:any){

      showAlert(
      'Error',
      error.message,
      'error'
      );

        }

        }
      });

      };


const handleConfirmarEntrega = async ({
    entregadoPor,
    tipoEntregador,
  }: {
    entregadoPor: string;
    tipoEntregador: 'IT' | 'BECARIO';
  }) => {
    const device = entregaDialog.device;

    if (!device?.idEquipo) {
      showAlert('Error', 'Este equipo no tiene ID válido.', 'error');
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE}/equipos/${device.idEquipo}/generar-link-firma`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            entregadoPor,
            tipoEntregador,
          }),
        }
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'No se pudo generar el documento');
      }

      setFirmaLink(json.url);
      setQrOpen(true);

      showAlert(
        'Documento generado',
        'Escanea el QR para que el usuario firme la responsiva.',
        'success'
      );
    } catch (error: any) {
      showAlert(
        'Error',
        error.message || 'Error al generar documento',
        'error'
      );
    }
};

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute inset-0 bg-black/10" />
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-16 -left-12 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="rounded-2xl bg-white/20 p-3 backdrop-blur-sm">
                <PackageOpen className="h-8 w-8" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Inventario Nuevo</h1>
                <p className="mt-1 text-blue-100 text-sm md:text-base">
                  Sistema nuevo de gestión de PCs asignadas y documentación
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cards de estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        <Card className="border-0 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {t('inventory.totalDevices')}
            </CardTitle>
            <div className="rounded-xl bg-blue-50 p-2">
              <Laptop className="h-5 w-5 text-blue-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">{devices.length}</div>
            <p className="text-xs text-slate-500 mt-1">Equipos registrados</p>
          </CardContent>
        </Card>

        <Card className="border-0 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {t('inventory.active')}
            </CardTitle>
            <div className="rounded-xl bg-green-50 p-2">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {devices.filter((d) => d.status === 'ACTIVO').length}
            </div>
            <p className="text-xs text-slate-500 mt-1">En uso actualmente</p>
          </CardContent>
        </Card>

        <Card className="border-0 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {t('inventory.signed')}
            </CardTitle>
            <div className="rounded-xl bg-purple-50 p-2">
              <FileText className="h-5 w-5 text-purple-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {devices.filter((d) => d.firmado).length}
            </div>
            <p className="text-xs text-slate-500 mt-1">Con documentación</p>
          </CardContent>
        </Card>

        <Card className="border-0 rounded-2xl shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-slate-600">
              {t('inventory.warrantyExpiring')}
            </CardTitle>
            <div className="rounded-xl bg-orange-50 p-2">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{warrantyExpiring}</div>
            <p className="text-xs text-slate-500 mt-1">{t('inventory.expiringSoon')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de búsqueda y filtros */}
      <Card className="border-0 rounded-2xl shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder={t('inventory.search')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="h-11 rounded-xl border-slate-200 bg-white pl-10 shadow-sm focus-visible:ring-indigo-500"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 w-full rounded-xl border-slate-200 bg-white shadow-sm lg:w-[220px]">
                <SelectValue placeholder={t('inventory.status')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('inventory.allStatus')}</SelectItem>
                <SelectItem value="ACTIVO">ACTIVO</SelectItem>
                <SelectItem value="Inactivo">Inactivo</SelectItem>
              </SelectContent>
            </Select>

            <Link
              to="/historial-entregas"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
            >
              <ClipboardList className="h-4 w-4" />
              Historial entregas
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Tabla */}
      <Card className="border-0 rounded-2xl shadow-md overflow-hidden">
        <CardHeader className="border-b bg-white px-5 py-4">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <CardTitle className="flex items-center gap-2 text-xl">
              <PackageOpen className="h-6 w-6 text-indigo-600" />
              Inventario Nuevo
            </CardTitle>
            <Badge variant="secondary" className="w-fit rounded-full px-3 py-1">
              {filteredDevices.length} equipos
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1320px] border-collapse">
              <thead>
                <tr className="border-b bg-slate-100/80">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 min-w-[190px]">
                    Equipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 min-w-[240px]">
                    Empleado
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 min-w-[230px]">
                    Detalles del equipo
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 min-w-[130px]">
                    {t('inventory.status')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 min-w-[170px]">
                    {t('inventory.letter')}
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 min-w-[150px]">
                    BitLocker
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 min-w-[140px]">
                    {t('inventory.signed')}
                  </th>
                  <th className="sticky right-0 z-10 px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-600 min-w-[330px] bg-slate-100/95 backdrop-blur">
                    {t('inventory.actions')}
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredDevices.map((device, index) => (
                  <tr
                    key={`${device.id}-${index}`}
                    className="group hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-4 py-4 align-top">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <span className="rounded-lg bg-indigo-50 px-2 py-1 font-mono text-xs font-semibold text-indigo-700">
                            ID Equipo: {viewValue(device.idEquipo)}
                          </span>
                        </div>
                        <p className="font-mono text-sm font-semibold text-slate-900">
                          {viewValue(device.serviceTag)}
                        </p>
                        <p className="font-mono text-xs text-slate-500">
                          Hostname: {viewValue(device.hostname)}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <div className="space-y-1.5">
                        <p className="text-sm font-semibold text-slate-900">
                          {viewValue(device.nombreEmpleado)}
                        </p>
                        <p className="font-mono text-xs text-slate-500">
                          ID Empleado: {viewValue(device.idEmpleado)}
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          <Badge variant="outline" className="rounded-full bg-slate-50 text-xs">
                            {viewValue(device.departamento)}
                          </Badge>
                          <Badge variant="outline" className="rounded-full bg-slate-50 text-xs">
                            {viewValue(device.planta)}
                          </Badge>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <div className="space-y-1.5 text-sm">
                        <p className="font-medium text-slate-900">
                          {viewValue(device.marca)} {viewValue(device.modelo)}
                        </p>
                        <p className="text-xs text-slate-500">
                          Tipo: {viewValue(device.tipo)}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <Badge
                        variant={
                          device.status === 'ACTIVO' || device.status === 'Activo'
                            ? 'default'
                            : 'secondary'
                        }
                        className={
                          device.status === 'ACTIVO' || device.status === 'Activo'
                            ? 'rounded-full bg-green-600 hover:bg-green-700'
                            : 'rounded-full'
                        }
                      >
                        {viewValue(device.status)}
                      </Badge>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-col gap-2">
                        {device.cartaResponsiva ? (
                          <>
                            <div className="inline-flex w-fit items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Firmada
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-fit rounded-lg border-green-200 text-green-700 hover:bg-green-50"
                              onClick={() => handleDescargarResponsiva(device)}
                              title="Descargar responsiva"
                            >
                              <Download className="h-3.5 w-3.5 mr-1" />
                              Descargar
                            </Button>
                          </>
                        ) : (
                          <div className="inline-flex w-fit items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                            <XCircle className="h-3.5 w-3.5" />
                            Pendiente
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top">
                      <div className="flex flex-col gap-2">
                        {device.bitlocker ? (
                          <>
                            <div className="inline-flex w-fit items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-700">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Cargado
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-fit rounded-lg border-green-200 text-green-700 hover:bg-green-50"
                              onClick={() => handleDescargarBitlocker(device)}
                            >
                              <Download className="h-3.5 w-3.5 mr-1" />
                              Descargar
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="inline-flex w-fit items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                              <XCircle className="h-3.5 w-3.5" />
                              Sin archivo
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-fit rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50"
                              onClick={() => handleSubirBitlocker(device)}
                            >
                              <Upload className="h-3.5 w-3.5 mr-1" />
                              Subir
                            </Button>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-4 align-top">
                      {device.firmado ? (
                        <Badge
                          variant="default"
                          className="rounded-full bg-green-600 hover:bg-green-700"
                        >
                          <FileCheck className="h-3 w-3 mr-1" />
                          Firmado
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="rounded-full">
                          Pendiente
                        </Badge>
                      )}
                    </td>

                    <td className="sticky right-0 bg-white px-4 py-4 align-top shadow-[-12px_0_16px_-18px_rgba(15,23,42,0.6)] group-hover:bg-slate-50">
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 rounded-lg border-blue-200 text-blue-700 hover:bg-blue-50"
                          onClick={() => handleViewDetails(device)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {t('inventory.details')}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 rounded-lg border-purple-200 text-purple-700 hover:bg-purple-50"
                          onClick={() => handleGenerateQR(device)}
                        >
                          <QrCode className="h-4 w-4 mr-1" />
                          QR
                        </Button>

                        {!device.firmado && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="col-span-2 h-9 rounded-lg border-green-200 text-green-700 hover:bg-green-50"
                            onClick={() => setEntregaDialog({ open: true, device })}
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            Generar documento
                          </Button>
                        )}

                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={!device.idEquipo || liberandoEquipoId === device.idEquipo}
                          onClick={() => handleLiberarEquipo(device)}
                          className="col-span-2 h-9 rounded-lg bg-red-600 hover:bg-red-700"
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
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
              <div className="rounded-full bg-slate-100 p-4 mb-4">
                <PackageOpen className="h-12 w-12 text-slate-300" />
              </div>
              <p className="text-slate-600 text-lg font-semibold">{t('inventory.noResults')}</p>
              <p className="text-slate-400 text-sm mt-2">
                Intenta ajustar la búsqueda o el filtro seleccionado.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modales */}
      <DeviceDetailsModal
        device={selectedDevice}
        open={isDetailsModalOpen}
        onOpenChange={setIsDetailsModalOpen}
        onUpdated={(deviceActualizado) => {
          setDevices((prev) =>
            prev.map((d) =>
              d.idEquipo === deviceActualizado.idEquipo
                ? { ...d, ...deviceActualizado }
                : d
            )
          );

          setSelectedDevice((prev) =>
            prev?.idEquipo === deviceActualizado.idEquipo
              ? { ...prev, ...deviceActualizado }
              : prev
          );

          setQRDevice((prev) =>
            prev?.idEquipo === deviceActualizado.idEquipo
              ? { ...prev, ...deviceActualizado }
              : prev
          );

          loadInventoryNew();
        }}
        onUploadResponsiva={handleSubirResponsivaFirmada}
        onDownloadResponsiva={handleDescargarResponsiva}
      />

      <QRModal device={qrDevice} open={isQRModalOpen} onOpenChange={setIsQRModalOpen} />

      {/* Alertas y diálogos personalizados */}
      <CustomAlert
        open={alert.open}
        onOpenChange={(open) => setAlert({ ...alert, open })}
        title={alert.title}
        description={alert.description}
        type={alert.type}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onOpenChange={(open) => setConfirmDialog({ ...confirmDialog, open })}
        title={confirmDialog.title}
        description={confirmDialog.description}
        onConfirm={confirmDialog.onConfirm}
        variant={confirmDialog.variant}
      />

      <PromptDialog
        open={promptDialog.open}
        onOpenChange={(open) => setPromptDialog({ ...promptDialog, open })}
        title={promptDialog.title}
        description={promptDialog.description}
        onConfirm={promptDialog.onConfirm}
        placeholder={promptDialog.placeholder}
      />

      <EntregaDialog
        open={entregaDialog.open}
        onOpenChange={(open) =>
          setEntregaDialog((prev) => ({
            open,
            device: open ? prev.device : null,
          }))
        }
        onConfirm={handleConfirmarEntrega}
      />

      <LiberacionDialog
        open={liberacionDialog.open}
        onOpenChange={(open) =>
          setLiberacionDialog((prev) => ({
            open,
            device: open ? prev.device : null,
          }))
        }
        device={liberacionDialog.device}
        loading={!!liberandoEquipoId}
        onConfirm={handleConfirmarLiberacion}
      />

      <SignatureModal
        open={isSignatureOpen}
        onOpenChange={setIsSignatureOpen}
        onSave={handleGuardarFirmaDigital}
      />

      {qrOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
            <h3 className="mb-4 text-lg font-bold text-slate-900">Escanea para firmar</h3>

            <div className="inline-block rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
              <QRCode value={firmaLink} size={220} />
            </div>

            <p className="mt-4 break-all rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
              {firmaLink}
            </p>

            <Button
              type="button"
              onClick={() => setQrOpen(false)}
              className="mt-5 w-full rounded-xl bg-blue-700 text-white hover:bg-blue-800"
            >
              Cerrar
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
