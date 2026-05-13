import { AlertTriangle, Clock, Cpu, PackageSearch, ShieldAlert, X } from 'lucide-react';
import type { HomeAlerta } from '../../../types/home.types';

interface Props {
  open: boolean;
  alertas: HomeAlerta[];
  loading?: boolean;
  onClose: () => void;
  onVerEquipo?: (alerta: HomeAlerta) => void;
  onVerMonitoreo?: (alerta: HomeAlerta) => void;
}

function getIcon(tipo: string) {
  if (tipo === 'offline') return <Clock size={20} />;
  if (tipo === 'ram') return <Cpu size={20} />;
  if (tipo === 'garantia') return <ShieldAlert size={20} />;
  if (tipo === 'pendiente_registro') return <PackageSearch size={20} />;
  return <AlertTriangle size={20} />;
}

function getBadgeClass(nivel: string) {
  if (nivel === 'critico') {
    return 'bg-red-100 text-red-700 border border-red-200';
  }

  if (nivel === 'advertencia') {
    return 'bg-yellow-100 text-yellow-700 border border-yellow-200';
  }

  return 'bg-blue-100 text-blue-700 border border-blue-200';
}

function getCardClass(nivel: string) {
  if (nivel === 'critico') {
    return 'border-red-200 bg-red-50';
  }

  if (nivel === 'advertencia') {
    return 'border-yellow-200 bg-yellow-50';
  }

  return 'border-blue-200 bg-blue-50';
}

function formatDate(value?: string | null) {
  if (!value) return 'Sin registro';

  return new Date(value).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short'
  });
}

export default function HomeAlertasModal({
  open,
  alertas,
  loading = false,
  onClose,
  onVerEquipo,
  onVerMonitoreo
}: Props) {
  if (!open) return null;

  const criticas = alertas.filter((a) => a.nivel === 'critico').length;
  const advertencias = alertas.filter((a) => a.nivel === 'advertencia').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-5xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Alertas inteligentes del sistema
            </h2>
            <p className="text-sm text-gray-500">
              Equipos con garantía por vencer, alto consumo, pendientes u offline.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
          >
            <X size={22} />
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 px-6 py-4 md:grid-cols-3">
          <div className="rounded-xl border border-red-100 bg-red-50 p-4">
            <p className="text-sm text-red-600">Críticas</p>
            <p className="text-2xl font-bold text-red-700">{criticas}</p>
          </div>

          <div className="rounded-xl border border-yellow-100 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-600">Advertencias</p>
            <p className="text-2xl font-bold text-yellow-700">{advertencias}</p>
          </div>

          <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm text-blue-600">Total alertas</p>
            <p className="text-2xl font-bold text-blue-700">{alertas.length}</p>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto px-6 pb-6">
          {loading ? (
            <div className="py-10 text-center text-gray-500">
              Cargando alertas...
            </div>
          ) : alertas.length === 0 ? (
            <div className="rounded-xl border border-green-100 bg-green-50 p-6 text-center text-green-700">
              No hay alertas activas en este momento.
            </div>
          ) : (
            <div className="space-y-3">
              {alertas.map((alerta) => (
                <div
                  key={alerta.id}
                  className={`rounded-xl border p-4 ${getCardClass(alerta.nivel)}`}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="flex gap-3">
                      <div className="mt-1 text-red-600">
                        {getIcon(alerta.tipo)}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold text-gray-900">
                            {alerta.hostname || alerta.service_tag || 'Equipo sin nombre'}
                          </h3>

                          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getBadgeClass(alerta.nivel)}`}>
                            {alerta.nivel.toUpperCase()}
                          </span>

                          <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-gray-600">
                            {alerta.tipo.replace('_', ' ').toUpperCase()}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-gray-700">
                          {alerta.mensaje}
                        </p>

                        <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-gray-600 md:grid-cols-2">
                          <p>
                            <span className="font-semibold">Service Tag:</span>{' '}
                            {alerta.service_tag || 'N/A'}
                          </p>

                          <p>
                            <span className="font-semibold">Empleado:</span>{' '}
                            {alerta.empleado || 'Sin empleado'}
                          </p>

                          <p>
                            <span className="font-semibold">Departamento:</span>{' '}
                            {alerta.departamento || 'N/A'}
                          </p>

                          <p>
                            <span className="font-semibold">Planta:</span>{' '}
                            {alerta.planta || 'N/A'}
                          </p>

                          <p>
                            <span className="font-semibold">Última conexión:</span>{' '}
                            {formatDate(alerta.last_seen)}
                          </p>

                          {alerta.ip && (
                            <p>
                              <span className="font-semibold">IP:</span> {alerta.ip}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                    <button
                        onClick={() => onVerEquipo?.(alerta)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                    >
                        Ver equipo
                    </button>

                    <button
                        onClick={() => onVerMonitoreo?.(alerta)}
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
                    >
                        Ver monitoreo
                    </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}