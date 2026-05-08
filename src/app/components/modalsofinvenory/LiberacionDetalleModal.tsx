import { useEffect, useState } from 'react';
import {
  Eye,
  Laptop,
  UserRound,
  KeyRound,
  ShieldCheck,
  Clipboard,
  Database,
  XCircle,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { formatearFechaMX, formatearFechaCortaMX } from '../../utils/fecha';
import { Button } from '../ui/button';

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3006';

interface LiberacionDetalleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  historialLiberacionId: number | null;
}

interface DetalleLiberacion {
  historial_liberacion_id: number;
  equipo_id: number | null;
  empleado_id: number | null;

  service_tag: string | null;
  empleado_nombre: string | null;
  empleado_departamento: string | null;
  empleado_planta: string | null;
  empleado_status: string | null;

  equipo_tipo: string | null;
  equipo_marca_id: number | null;
  equipo_marca: string | null;
  equipo_modelo: string | null;
  equipo_hostname: string | null;
  equipo_hostname_detectado: string | null;
  equipo_serial_number: string | null;
  equipo_specs: string | null;

  bios_password: string | null;

  equipo_fecha_compra: string | null;
  equipo_fecha_asig: string | null;
  equipo_start_warranty: string | null;
  equipo_end_warranty: string | null;
  equipo_fecha_alta_equipo: string | null;
  equipo_permiso_salida: number | null;
  equipo_qr_token: string | null;
  equipo_estado_registro_anterior: string | null;

  local_user_windows: string | null;
  password_windows: string | null;
  usuario_admin: string | null;
  password_admin: string | null;

  acceso_id: number | null;
  licencia_office: string | null;
  correo_enrrolado: string | null;
  password_enrrolado: string | null;

  usuario_nas: string | null;
  password_nas: string | null;

  usuario_vpn: string | null;
  password_vpn: string | null;

  usuario_osticket: string | null;
  password_osticket: string | null;

  liberado_por: string | null;
  tipo_liberador: string | null;
  estado: string | null;
  fecha_liberacion: string | null;
}

function InfoItem({
  label,
  value,
  copy = false,
}: {
  label: string;
  value?: string | number | null;
  copy?: boolean;
}) {
  const texto = value === null || value === undefined || value === '' ? 'N/A' : String(value);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
    } catch (error) {
      console.error('No se pudo copiar:', error);
    }
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <div className="mt-1 flex items-center justify-between gap-2">
        <p className="break-all font-mono text-sm text-slate-900">
          {texto}
        </p>

        {copy && texto !== 'N/A' && (
          <button
            type="button"
            onClick={copiar}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-50 hover:text-slate-900"
            title="Copiar"
          >
            <Clipboard className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  icon,
  children,
}: {
    title: string;
    icon: ReactNode;
    children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
        {icon}
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {children}
      </div>
    </section>
  );
}

export function LiberacionDetalleModal({
  open,
  onOpenChange,
  historialLiberacionId,
}: LiberacionDetalleModalProps) {
  const [detalle, setDetalle] = useState<DetalleLiberacion | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  useEffect(() => {
    if (!open || !historialLiberacionId) {
      setDetalle(null);
      setError('');
      return;
    }

    const cargarDetalle = async () => {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(
          `${API_BASE}/liberaciones-historial/${historialLiberacionId}`
        );

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.error || 'No se pudo cargar el detalle');
        }

        setDetalle(json);
      } catch (error: any) {
        console.error('Error detalle liberación:', error);
        setError(error.message || 'Error al cargar detalle');
        setDetalle(null);
      } finally {
        setLoading(false);
      }
    };

    cargarDetalle();
  }, [open, historialLiberacionId]);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-h-[90vh] max-w-5xl overflow-hidden rounded-2xl p-0">
        <div className="border-b bg-slate-50 px-6 py-5">
          <AlertDialogHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-blue-100 p-2">
                <Eye className="h-6 w-6 text-blue-700" />
              </div>

              <div>
                <AlertDialogTitle className="text-xl text-slate-900">
                  Detalle de liberación
                </AlertDialogTitle>

                <AlertDialogDescription>
                  Información guardada al momento de desasignar el equipo.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
        </div>

        <div className="max-h-[68vh] overflow-y-auto px-6 py-5">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-slate-500">
              Cargando detalle...
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
              <XCircle className="h-10 w-10 text-red-600" />
              <p className="font-semibold text-red-600">{error}</p>
            </div>
          ) : detalle ? (
            <div className="space-y-8">
              <Section
                title="Datos de liberación"
                icon={<ShieldCheck className="h-5 w-5 text-red-600" />}
              >
                <InfoItem label="Fecha liberación" value={formatearFechaMX(detalle.fecha_liberacion)}/>
                <InfoItem label="Estado" value={detalle.estado || 'LIBERADO'} />
                <InfoItem label="Liberado por" value={detalle.liberado_por} />
                <InfoItem label="Tipo liberador" value={detalle.tipo_liberador} />
              </Section>

              <Section
                title="Empleado desasignado"
                icon={<UserRound className="h-5 w-5 text-indigo-600" />}
              >
                <InfoItem label="ID empleado" value={detalle.empleado_id} />
                <InfoItem label="Nombre completo" value={detalle.empleado_nombre} />
                <InfoItem label="Departamento" value={detalle.empleado_departamento} />
                <InfoItem label="Planta" value={detalle.empleado_planta} />
                <InfoItem label="Status" value={detalle.empleado_status} />
              </Section>

              <Section
                title="Datos del equipo"
                icon={<Laptop className="h-5 w-5 text-blue-600" />}
              >
                <InfoItem label="ID equipo" value={detalle.equipo_id} />
                <InfoItem label="Service Tag" value={detalle.service_tag} copy />
                <InfoItem label="Serial Number" value={detalle.equipo_serial_number} copy />
                <InfoItem label="Tipo" value={detalle.equipo_tipo} />
                <InfoItem label="Marca" value={detalle.equipo_marca} />
                <InfoItem label="Modelo" value={detalle.equipo_modelo} />
                <InfoItem label="Hostname" value={detalle.equipo_hostname} copy />
                <InfoItem label="Hostname detectado" value={detalle.equipo_hostname_detectado} copy />
                <InfoItem label="Specs" value={detalle.equipo_specs} />
                <InfoItem label="BIOS Password" value={detalle.bios_password} copy />
                <InfoItem
                  label="Fecha compra"
                  value={formatearFechaCortaMX(detalle.equipo_fecha_compra)}
                />

                <InfoItem
                  label="Fecha asignación"
                  value={formatearFechaCortaMX(detalle.equipo_fecha_asig)}
                />

                <InfoItem
                  label="Inicio garantía"
                  value={formatearFechaCortaMX(detalle.equipo_start_warranty)}
                />

                <InfoItem
                  label="Fin garantía"
                  value={formatearFechaCortaMX(detalle.equipo_end_warranty)}
                />

                <InfoItem label="Fecha alta equipo"value={formatearFechaMX(detalle.equipo_fecha_alta_equipo)}/>
                <InfoItem label="Fecha liberación" value={formatearFechaCortaMX(detalle.equipo_fecha_compra)}/>
                <InfoItem label="Permiso salida" value={detalle.equipo_permiso_salida === 1 ? 'Sí' : 'No'} />
                <InfoItem label="Estado anterior" value={detalle.equipo_estado_registro_anterior} />
              </Section>

              <Section
                title="Credenciales Windows"
                icon={<KeyRound className="h-5 w-5 text-amber-600" />}
              >
                <InfoItem label="Usuario Windows" value={detalle.local_user_windows} copy />
                <InfoItem label="Password Windows" value={detalle.password_windows} copy />
                <InfoItem label="Usuario Admin" value={detalle.usuario_admin} copy />
                <InfoItem label="Password Admin" value={detalle.password_admin} copy />
              </Section>

              <Section
                title="Office / Enrrolado"
                icon={<KeyRound className="h-5 w-5 text-green-600" />}
              >
                <InfoItem label="Acceso ID" value={detalle.acceso_id} />
                <InfoItem label="Licencia Office" value={detalle.licencia_office} copy />
                <InfoItem label="Correo Enrrolado" value={detalle.correo_enrrolado} copy />
                <InfoItem label="Password Enrrolado" value={detalle.password_enrrolado} copy />
              </Section>

              <Section
                title="NAS / VPN / Osticket"
                icon={<Database className="h-5 w-5 text-purple-600" />}
              >
                <InfoItem label="Usuario NAS" value={detalle.usuario_nas} copy />
                <InfoItem label="Password NAS" value={detalle.password_nas} copy />
                <InfoItem label="Usuario VPN" value={detalle.usuario_vpn} copy />
                <InfoItem label="Password VPN" value={detalle.password_vpn} copy />
                <InfoItem label="Usuario Osticket" value={detalle.usuario_osticket} copy />
                <InfoItem label="Password Osticket" value={detalle.password_osticket} copy />
              </Section>
            </div>
          ) : (
            <div className="flex items-center justify-center py-16 text-slate-500">
              Sin información para mostrar.
            </div>
          )}
        </div>

        <AlertDialogFooter className="border-t bg-white px-6 py-4">
          <AlertDialogCancel>
            Cerrar
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}