import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { RefreshCw, Laptop, AlertCircle, CheckCircle2, Wrench } from 'lucide-react';
import { getAgentesDetectados, type AgenteDetectado } from '../services/agents';

export function Agentes() {
    const navigate = useNavigate();
    const [agentes, setAgentes] = useState<AgenteDetectado[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [refreshing, setRefreshing] = useState(false);

    const cargarAgentes = async (showLoader = true) => {
        try {
        if (showLoader) setLoading(true);
        setRefreshing(true);
        setError('');

        const data = await getAgentesDetectados();
        setAgentes(data);
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

    const getEstadoBadge = (estado: AgenteDetectado['estado_registro']) => {
    switch (estado) {
        case 'REGISTRADO':
        return 'bg-green-100 text-green-700';
        case 'SIN_SERVICE_TAG':
        return 'bg-yellow-100 text-yellow-700';
        case 'DESCONECTADO':
        return 'bg-red-100 text-red-700';
        default:
        return 'bg-blue-100 text-blue-700';
    }
    };

    const getEstadoTexto = (estado: AgenteDetectado['estado_registro']) => {
    switch (estado) {
        case 'REGISTRADO':
        return 'Registrado';
        case 'SIN_SERVICE_TAG':
        return 'Sin Service Tag';
        case 'DESCONECTADO':
        return 'Desconectado';
        default:
        return 'Disponible';
    }
    };

    return (
        <div className="p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div>
            <h1 className="text-2xl font-bold text-gray-900">Agentes detectados</h1>
            <p className="text-sm text-gray-600 mt-1">
                Aquí puedes ver los equipos reportados por NodeGuard y seleccionar cuál registrar manualmente.
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
            <div className="rounded-xl bg-white p-10 shadow-sm border border-gray-200 text-center">
            <Laptop className="h-10 w-10 mx-auto text-gray-400 mb-3" />
            <h2 className="text-lg font-semibold text-gray-800">No hay agentes detectados</h2>
            <p className="text-sm text-gray-500 mt-1">
                Cuando un equipo con NodeGuard reporte información, aparecerá aquí.
            </p>
            </div>
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
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getEstadoBadge(agente.estado_registro)}`}>
                            {getEstadoTexto(agente.estado_registro)}
                        </span>
                        </td>
                        <td className="px-4 py-3">
                        <button
                            onClick={() => handleRegistrar(agente.monitoreo_id)}
                            disabled={
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