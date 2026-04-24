import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { DeviceDetailsModal, type InventoryDeviceModal } from '../components/DeviceDetailsModal';
import { SignatureModal } from '../components/SignatureModal';
import { QRModal } from '../components/QRModal';
import QRCode from 'react-qr-code';
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

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3006';

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
      onConfirm: async () => {
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
          showAlert('¡Éxito!', 'Equipo liberado correctamente', 'success');
        } catch (error: any) {
          console.error('Error liberando equipo:', error);
          showAlert('Error', error.message || 'Error al liberar equipo', 'error');
        } finally {
          setLiberandoEquipoId(null);
        }
      },
    });
  };

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

const handleAbrirFirma = (device: InventoryDevice) => {
  setDeviceToSign(device);
  setIsSignatureOpen(true);
};

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

  const handleGenerarFirmaMovil = (device:any) => {

  setPromptDialog({
    open:true,
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

  return (
    <div className="p-8 space-y-6">
      {/* Header con degradado mejorado */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 text-white shadow-2xl">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <PackageOpen className="h-8 w-8" />
            </div>
            <h1 className="text-4xl font-bold">Inventario Nuevo</h1>
          </div>
          <p className="text-white/90 text-lg font-medium">
            Sistema nuevo de gestión de PCs asignadas y documentación
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      {/* Cards de estadísticas mejorados */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('inventory.totalDevices')}
              </CardTitle>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Laptop className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{devices.length}</div>
            <p className="text-xs text-gray-500 mt-1">Equipos registrados</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('inventory.active')}
              </CardTitle>
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {devices.filter((d) => d.status === 'ACTIVO' || d.status === 'Activo').length}
            </div>
            <p className="text-xs text-gray-500 mt-1">En uso actualmente</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('inventory.signed')}
              </CardTitle>
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {devices.filter((d) => d.firmado).length}
            </div>
            <p className="text-xs text-gray-500 mt-1">Con documentación</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-gray-600">
                {t('inventory.warrantyExpiring')}
              </CardTitle>
              <div className="p-2 bg-orange-100 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{warrantyExpiring}</div>
            <p className="text-xs text-gray-500 mt-1">{t('inventory.expiringSoon')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de búsqueda y filtros mejorada */}
      <div className="flex items-center gap-4 bg-white p-4 rounded-xl shadow-md">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <Input
            placeholder={t('inventory.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11 h-12 border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[200px] h-12 border-gray-300">
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

      {/* Tabla mejorada - Parte 1 */}
      <Card className="border-0 shadow-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="text-xl flex items-center gap-2">
            <PackageOpen className="h-6 w-6 text-indigo-600" />
            Inventario Nuevo ({filteredDevices.length} equipos)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-100 to-gray-50 sticky top-0 z-10">
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-4 px-4 font-semibold text-xs uppercase tracking-wider text-gray-700">
                    ID Equipo
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-xs uppercase tracking-wider text-gray-700">
                    ID Empleado
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-xs uppercase tracking-wider text-gray-700">
                    Service Tag
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-xs uppercase tracking-wider text-gray-700">
                    Hostname
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-xs uppercase tracking-wider text-gray-700">
                    {t('inventory.status')}
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-xs uppercase tracking-wider text-gray-700">
                    {t('inventory.employee')}
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-xs uppercase tracking-wider text-gray-700">
                    {t('inventory.department')}
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-xs uppercase tracking-wider text-gray-700">
                    {t('inventory.plant')}
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-xs uppercase tracking-wider text-gray-700">
                    {t('inventory.type')}
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-xs uppercase tracking-wider text-gray-700">
                    {t('inventory.brand')}
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-xs uppercase tracking-wider text-gray-700">
                    {t('inventory.model')}
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-xs uppercase tracking-wider text-gray-700">
                    {t('inventory.letter')}
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-xs uppercase tracking-wider text-gray-700">
                    BitLocker
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-xs uppercase tracking-wider text-gray-700">
                    {t('inventory.signed')}
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-xs uppercase tracking-wider text-gray-700">
                    {t('inventory.actions')}
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredDevices.map((device, index) => (
                  <tr
                    key={`${device.id}-${index}`}
                    className="border-b hover:bg-gradient-to-r hover:from-indigo-50/50 hover:to-purple-50/50 transition-all duration-200"
                  >
                    <td className="py-4 px-4 font-mono text-sm font-semibold text-indigo-600">
                      {viewValue(device.idEquipo)}
                    </td>
                    <td className="py-4 px-4 font-mono text-sm">{viewValue(device.idEmpleado)}</td>
                    <td className="py-4 px-4 font-mono text-sm font-medium">
                      {viewValue(device.serviceTag)}
                    </td>
                    <td className="py-4 px-4 font-mono text-sm">{viewValue(device.hostname)}</td>

                    <td className="py-4 px-4">
                      <Badge
                        variant={
                          device.status === 'ACTIVO' || device.status === 'Activo'
                            ? 'default'
                            : 'secondary'
                        }
                        className={
                          device.status === 'ACTIVO' || device.status === 'Activo'
                            ? 'bg-green-500 hover:bg-green-600'
                            : ''
                        }
                      >
                        {viewValue(device.status)}
                      </Badge>
                    </td>

                    <td className="py-4 px-4 text-sm font-medium">
                      {viewValue(device.nombreEmpleado)}
                    </td>
                    <td className="py-4 px-4 text-sm">{viewValue(device.departamento)}</td>
                    <td className="py-4 px-4 text-sm">{viewValue(device.planta)}</td>
                    <td className="py-4 px-4 text-sm">{viewValue(device.tipo)}</td>
                    <td className="py-4 px-4 text-sm">{viewValue(device.marca)}</td>
                    <td className="py-4 px-4 text-sm">{viewValue(device.modelo)}</td>

                    <td className="py-4 px-4">
                      <div className="flex gap-2 items-center">
                        {device.cartaResponsiva ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-9 w-9 p-0 hover:bg-green-100"
                              onClick={() => handleDescargarResponsiva(device)}
                              title="Descargar responsiva"
                            >
                              <Download className="h-4 w-4 text-green-600" />
                            </Button>
                            <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <span className="text-xs font-semibold text-green-700">Firmada</span>
                            </div>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-9 w-9 p-0 hover:bg-blue-100"
                              onClick={() => handleSubirResponsivaFirmada(device)}
                              title="Subir responsiva firmada"
                            >
                              <Upload className="h-4 w-4 text-blue-600" />
                            </Button>
                            <div className="flex items-center gap-1 bg-red-100 px-2 py-1 rounded-full">
                              <XCircle className="h-4 w-4 text-red-600" />
                              <span className="text-xs font-semibold text-red-700">Pendiente</span>
                            </div>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex gap-2 items-center">
                        {device.bitlocker ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-9 w-9 p-0 hover:bg-green-100"
                              onClick={() => handleDescargarBitlocker(device)}
                            >
                              <Download className="h-4 w-4 text-green-600" />
                            </Button>
                            <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            </div>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-9 w-9 p-0 hover:bg-blue-100"
                              onClick={() => handleSubirBitlocker(device)}
                            >
                              <Upload className="h-4 w-4 text-blue-600" />
                            </Button>
                            <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                              <XCircle className="h-4 w-4 text-gray-500" />
                            </div>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      {device.firmado ? (
                        <Badge
                          variant="default"
                          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                        >
                          <FileCheck className="h-3 w-3 mr-1" />
                          {t('inventory.yes')}
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 border-indigo-300 text-indigo-600 hover:bg-indigo-50"
                          onClick={() => handleGenerarFirmaMovil(device)}
                        >
                          {t('inventory.sign')}
                        </Button>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <div className="flex gap-2 flex-wrap">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-300 text-blue-600 hover:bg-blue-50"
                          onClick={() => handleViewDetails(device)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          {t('inventory.details')}
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="border-purple-300 text-purple-600 hover:bg-purple-50"
                          onClick={() => handleGenerateQR(device)}
                        >
                          <QrCode className="h-4 w-4 mr-1" />
                          QR
                        </Button>

                        <Button
                          size="sm"
                          variant="outline"
                          className="border-green-300 text-green-600 hover:bg-green-50"
                          onClick={() => handleGenerarResponsiva(device)}
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          PDF
                        </Button>

                        <Button
                          size="sm"
                          variant="destructive"
                          disabled={!device.idEquipo || liberandoEquipoId === device.idEquipo}
                          onClick={() => handleLiberarEquipo(device)}
                          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
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
            <div className="text-center py-16">
              <PackageOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg font-medium">{t('inventory.noResults')}</p>
              <p className="text-gray-400 text-sm mt-2">
                Intenta ajustar los filtros de búsqueda
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

      <SignatureModal
          open={isSignatureOpen}
          onOpenChange={setIsSignatureOpen}
          onSave={handleGuardarFirmaDigital}
        />

        {qrOpen && (
<div className="
fixed inset-0
bg-black/50
flex items-center
justify-center
z-50
">

<div className="
bg-white
p-6
rounded-xl
shadow-xl
text-center
max-w-sm
">

<h3 className="
font-bold mb-4
">
Escanea para firmar
</h3>

<div className="
bg-white
p-4
inline-block
">
<QRCode
 value={firmaLink}
 size={220}
/>
</div>

<p className="
text-xs mt-4 break-all
">
{firmaLink}
</p>

<button
onClick={()=>setQrOpen(false)}
className="
mt-5
px-4 py-2
bg-blue-700
text-white rounded
"
>
Cerrar
</button>

</div>
</div>
)}
    </div>
  );
}
