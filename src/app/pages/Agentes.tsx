import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import {
  RefreshCw,
  Laptop,
  AlertCircle,
  CheckCircle2,
  Wrench,
  ShieldAlert,
  Clock3,
} from 'lucide-react';
import { getAgentesDetectados, type AgenteDetectado } from '../services/agents';

type GrupoAgentes = {
  resumen: {
    pendientes: number;
    registrados: number;
    incidencias: number;
  };
  pendientes: AgenteDetectado[];
  registrados: AgenteDetectado[];
  incidencias: AgenteDetectado[];
};

type TabKey = 'pendientes' | 'registrados' | 'incidencias';

export function Agentes() {
  const navigate = useNavigate();

  const [data, setData] = useState<GrupoAgentes>({
    resumen: {
      pendientes: 0,
      registrados: 0,
      incidencias: 0,
    },
    pendientes: [],
    registrados: [],
    incidencias: [],
  });

  const [activeTab, setActiveTab] = useState<TabKey>('pendientes');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

    const cargarAgentes = async (showLoader = true) => {
    try {
        if (showLoader) setLoading(true);
        setRefreshing(true);
        setError('');

        const result = await getAgentesDetectados();

        setData({
        resumen: {
            pendientes: result?.resumen?.pendientes ?? 0,
            registrados: result?.resumen?.registrados ?? 0,
            incidencias: result?.resumen?.incidencias ?? 0,
        },
        pendientes: result?.pendientes ?? [],
        registrados: result?.registrados ?? [],
        incidencias: result?.incidencias ?? [],
        });
    } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los agentes detectados.');
    } finally {
        setLoading(false);
        setRefreshing(false);
    }
    };

  useEffect(() => {
    cargarAgentes();

    const interval = setInterval(() => {
      cargarAgentes(false);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleRegistrar = (monitoreoId: number) => {
    navigate(`/register?monitoreoId=${monitoreoId}`);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'REGISTRADO':
        return 'bg-green-100 text-green-700';
      case 'SIN_SERVICE_TAG':
        return 'bg-yellow-100 text-yellow-700';
      case 'DESCONECTADO':
        return 'bg-red-100 text-red-700';
      case 'PENDIENTE':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getEstadoTexto = (estado: string) => {
    switch (estado) {
      case 'REGISTRADO':
        return 'Registrado';
      case 'SIN_SERVICE_TAG':
        return 'Sin Service Tag';
      case 'DESCONECTADO':
        return 'Desconectado';
      case 'PENDIENTE':
        return 'Pendiente';
      default:
        return 'Disponible';
    }
  };

  const getTabItems = () => {
    switch (activeTab) {
      case 'pendientes':
        return data.pendientes;
      case 'registrados':
        return data.registrados;
      case 'incidencias':
        return data.incidencias;
      default:
        return [];
    }
  };

  const agentes = getTabItems();

  const renderEmptyState = () => {
    const config = {
      pendientes: {
        icon: <Clock3 className="h-10 w-10 mx-auto text-gray-400 mb-3" />,
        title: 'No hay agentes pendientes',
        text: 'Cuando un equipo nuevo reporte información y aún no esté registrado, aparecerá aquí.',
      },
      registrados: {
        icon: <CheckCircle2 className="h-10 w-10 mx-auto text-gray-400 mb-3" />,
        title: 'No hay equipos registrados',
        text: 'Los equipos que ya estén ligados al inventario aparecerán en esta sección.',
      },
      incidencias: {
        icon: <ShieldAlert className="h-10 w-10 mx-auto text-gray-400 mb-3" />,
        title: 'No hay incidencias',
        text: 'Aquí aparecerán agentes desconectados o con datos incompletos.',
      },
    };

    const current = config[activeTab];

    return (
      <div className="rounded-xl bg-white p-10 shadow-sm border border-gray-200 text-center">
        {current.icon}
        <h2 className="text-lg font-semibold text-gray-800">{current.title}</h2>
        <p className="text-sm text-gray-500 mt-1">{current.text}</p>
      </div>
    );
  };

  return (
    <div className="p-6 md:p-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agentes detectados</h1>
          <p className="text-sm text-gray-600 mt-1">
            Aquí puedes ver los equipos reportados por NodeGuard, separados por pendientes,
            registrados e incidencias.
          </p>
        </div>

        <button
          onClick={() => cargarAgentes(false)}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          Actualizar
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-6">
        <button
          onClick={() => setActiveTab('pendientes')}
          className={`rounded-xl border p-4 text-left transition ${
            activeTab === 'pendientes'
              ? 'border-blue-300 bg-blue-50'
              : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
        >
          <div className="text-sm text-gray-500">Pendientes</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{data.resumen.pendientes}</div>
          <div className="mt-1 text-xs text-gray-500">Equipos listos para registrar</div>
        </button>

        <button
          onClick={() => setActiveTab('registrados')}
          className={`rounded-xl border p-4 text-left transition ${
            activeTab === 'registrados'
              ? 'border-green-300 bg-green-50'
              : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
        >
          <div className="text-sm text-gray-500">Registrados</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{data.resumen.registrados}</div>
          <div className="mt-1 text-xs text-gray-500">Equipos ya ligados al inventario</div>
        </button>

        <button
          onClick={() => setActiveTab('incidencias')}
          className={`rounded-xl border p-4 text-left transition ${
            activeTab === 'incidencias'
              ? 'border-red-300 bg-red-50'
              : 'border-gray-200 bg-white hover:bg-gray-50'
          }`}
        >
          <div className="text-sm text-gray-500">Incidencias</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{data.resumen.incidencias}</div>
          <div className="mt-1 text-xs text-gray-500">Desconectados o sin datos clave</div>
        </button>
      </div>

      <div className="mb-4 flex items-center gap-2">
        {activeTab === 'pendientes' && (
          <>
            <Clock3 className="h-5 w-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Pendientes de registro</h2>
          </>
        )}
        {activeTab === 'registrados' && (
          <>
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            <h2 className="text-lg font-semibold text-gray-900">Equipos registrados</h2>
          </>
        )}
        {activeTab === 'incidencias' && (
          <>
            <ShieldAlert className="h-5 w-5 text-red-600" />
            <h2 className="text-lg font-semibold text-gray-900">Incidencias</h2>
          </>
        )}
      </div>

      {loading ? (
        <div className="rounded-xl bg-white p-8 shadow-sm border border-gray-200">
          <p className="text-gray-600">Cargando agentes detectados...</p>
        </div>
      ) : error ? (
        <div className="rounded-xl bg-red-50 p-4 border border-red-200 text-red-700 flex items-center gap-2">
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </div>
      ) : agentes.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="rounded-xl bg-white shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3 font-semibold">Hostname</th>
                  <th className="px-4 py-3 font-semibold">Service Tag</th>
                  <th className="px-4 py-3 font-semibold">Usuario</th>
                  <th className="px-4 py-3 font-semibold">IP</th>
                  <th className="px-4 py-3 font-semibold">Modelo</th>
                  <th className="px-4 py-3 font-semibold">Última conexión</th>
                  <th className="px-4 py-3 font-semibold">Estado</th>
                  <th className="px-4 py-3 font-semibold">Acción</th>
                </tr>
              </thead>
              <tbody>
                {agentes.map((agente) => (
                  <tr key={agente.monitoreo_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{agente.hostname || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-700">{agente.service_tag || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-700">{agente.usuario || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-700">{agente.ip || 'N/A'}</td>
                    <td className="px-4 py-3 text-gray-700">
                      {[agente.marca, agente.modelo].filter(Boolean).join(' ') || 'N/A'}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{agente.last_seen || 'N/A'}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getEstadoBadge(
                          agente.estado_registro
                        )}`}
                      >
                        {getEstadoTexto(agente.estado_registro)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRegistrar(agente.monitoreo_id)}
                        disabled={
                          activeTab !== 'pendientes' ||
                          agente.estado_registro === 'REGISTRADO' ||
                          agente.estado_registro === 'DESCONECTADO'
                        }
                        className="inline-flex items-center gap-2 rounded-lg border border-blue-200 px-3 py-2 text-blue-700 hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {agente.estado_registro === 'REGISTRADO' ? (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            Registrado
                          </>
                        ) : agente.estado_registro === 'DESCONECTADO' ? (
                          <>
                            <AlertCircle className="h-4 w-4" />
                            Desconectado
                          </>
                        ) : activeTab !== 'pendientes' ? (
                          <>
                            <Laptop className="h-4 w-4" />
                            Solo lectura
                          </>
                        ) : (
                          <>
                            <Wrench className="h-4 w-4" />
                            Registrar
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}