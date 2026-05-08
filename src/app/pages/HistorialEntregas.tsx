import { useEffect, useMemo, useState } from 'react';
import { Search, Eye } from 'lucide-react';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { LiberacionDetalleModal } from '../components/modalsofinvenory/LiberacionDetalleModal';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3006';

type Filtro = 'hoy' | 'semana' | 'mes';
type TipoHistorial = 'entregas' | 'liberaciones';

interface EntregaHistorial {
  fecha_firma: string;
  entregado_por: string;
  tipo_entregador: string;
  estado: string;
  service_tag: string;
  nombre_completo: string;
  equipo_id: string;
}

interface LiberacionHistorial {
  historial_liberacion_id: number;
  equipo_id: string | number | null;
  empleado_id: string | number | null;
  service_tag: string;
  empleado_nombre: string | null;
  liberado_por: string;
  tipo_liberador: string;
  estado: string;
  fecha_liberacion: string;
}

export function HistorialEntregas() {
  const [tipoHistorial, setTipoHistorial] =
    useState<TipoHistorial>('entregas');

  const [filtro, setFiltro] = useState<Filtro>('hoy');
  const [data, setData] = useState<(EntregaHistorial | LiberacionHistorial)[]>([]);
  const [loading, setLoading] = useState(false);

  const [busqueda, setBusqueda] = useState('');

  const [detalleLiberacion, setDetalleLiberacion] = useState<{
    open: boolean;
    historialLiberacionId: number | null;
  }>({
    open: false,
    historialLiberacionId: null,
  });

  const formatearFecha = (fecha: string) => {
    if (!fecha) return 'N/A';

    const date = new Date(fecha);

    if (isNaN(date.getTime())) return 'N/A';

    return date.toLocaleString('es-MX', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const cargarHistorial = async (
    filtroActual: Filtro,
    tipoActual: TipoHistorial
  ) => {
    try {
      setLoading(true);

      const endpoint =
        tipoActual === 'entregas'
          ? '/entregas-historial'
          : '/liberaciones-historial';

      const res = await fetch(`${API_BASE}${endpoint}?filtro=${filtroActual}`);

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Error al cargar historial');
      }

      setData(json);
    } catch (error) {
      console.error('Error historial:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistorial(filtro, tipoHistorial);
  }, [filtro, tipoHistorial]);

  useEffect(() => {
    setBusqueda('');
  }, [tipoHistorial, filtro]);

  const dataFiltrada = useMemo(() => {
    const term = busqueda.trim().toLowerCase();

    if (!term) return data;

    return data.filter((row) => {
      if (tipoHistorial === 'entregas') {
        const item = row as EntregaHistorial;

        return (
          (item.service_tag || '').toLowerCase().includes(term) ||
          (item.nombre_completo || '').toLowerCase().includes(term) ||
          (item.entregado_por || '').toLowerCase().includes(term) ||
          (item.tipo_entregador || '').toLowerCase().includes(term) ||
          (item.estado || '').toLowerCase().includes(term)
        );
      }

      const item = row as LiberacionHistorial;

      return (
        (item.service_tag || '').toLowerCase().includes(term) ||
        (item.empleado_nombre || '').toLowerCase().includes(term) ||
        (item.liberado_por || '').toLowerCase().includes(term) ||
        (item.tipo_liberador || '').toLowerCase().includes(term) ||
        (item.estado || '').toLowerCase().includes(term)
      );
    });
  }, [data, busqueda, tipoHistorial]);

  const titulo =
    tipoHistorial === 'entregas'
      ? 'Historial de entregas'
      : 'Historial de liberaciones';

  const descripcion =
    tipoHistorial === 'entregas'
      ? 'Consulta quién entregó cada equipo y cuándo fue firmado.'
      : 'Consulta cuándo se liberó un equipo, quién realizó la liberación y el detalle guardado.';

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{titulo}</h1>
        <p className="text-sm text-gray-500">{descripcion}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={tipoHistorial === 'entregas' ? 'default' : 'outline'}
          onClick={() => setTipoHistorial('entregas')}
        >
          Entregas
        </Button>

        <Button
          variant={tipoHistorial === 'liberaciones' ? 'default' : 'outline'}
          onClick={() => setTipoHistorial('liberaciones')}
        >
          Liberaciones
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={filtro === 'hoy' ? 'default' : 'outline'}
          onClick={() => setFiltro('hoy')}
        >
          Hoy
        </Button>

        <Button
          variant={filtro === 'semana' ? 'default' : 'outline'}
          onClick={() => setFiltro('semana')}
        >
          Semana
        </Button>

        <Button
          variant={filtro === 'mes' ? 'default' : 'outline'}
          onClick={() => setFiltro('mes')}
        >
          Mes
        </Button>
      </div>

      <div className="relative max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />

        <Input
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder={
            tipoHistorial === 'entregas'
              ? 'Buscar por Service Tag, usuario o quien entregó...'
              : 'Buscar por Service Tag, empleado o quien liberó...'
          }
          className="pl-10"
        />
      </div>

      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="w-full text-sm">
          {tipoHistorial === 'entregas' ? (
            <>
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3">Fecha</th>
                  <th className="text-left p-3">Service Tag</th>
                  <th className="text-left p-3">Usuario</th>
                  <th className="text-left p-3">Entregó</th>
                  <th className="text-left p-3">Tipo</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-left p-3">PDF</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Cargando...
                    </td>
                  </tr>
                ) : dataFiltrada.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      No hay entregas registradas.
                    </td>
                  </tr>
                ) : (
                  dataFiltrada.map((row, index) => {
                    const item = row as EntregaHistorial;

                    return (
                      <tr key={index} className="border-t">
                        <td className="p-3">
                          {formatearFecha(item.fecha_firma)}
                        </td>

                        <td className="p-3">{item.service_tag || 'N/A'}</td>

                        <td className="p-3">
                          {item.nombre_completo || 'N/A'}
                        </td>

                        <td className="p-3">{item.entregado_por || 'N/A'}</td>

                        <td className="p-3">
                          {item.tipo_entregador || 'N/A'}
                        </td>

                        <td className="p-3">{item.estado || 'N/A'}</td>

                        <td className="p-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(
                                `${API_BASE}/equipos/${item.equipo_id}/responsiva-firmada`,
                                '_blank'
                              )
                            }
                          >
                            Descargar
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </>
          ) : (
            <>
              <thead className="bg-gray-100">
                <tr>
                  <th className="text-left p-3">Fecha</th>
                  <th className="text-left p-3">Service Tag</th>
                  <th className="text-left p-3">Empleado del equipo</th>
                  <th className="text-left p-3">Liberó</th>
                  <th className="text-left p-3">Tipo</th>
                  <th className="text-left p-3">Estado</th>
                  <th className="text-left p-3">Detalle</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      Cargando...
                    </td>
                  </tr>
                ) : dataFiltrada.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      No hay liberaciones registradas.
                    </td>
                  </tr>
                ) : (
                  dataFiltrada.map((row, index) => {
                    const item = row as LiberacionHistorial;

                    return (
                      <tr
                        key={item.historial_liberacion_id || index}
                        className="border-t"
                      >
                        <td className="p-3">
                          {formatearFecha(item.fecha_liberacion)}
                        </td>

                        <td className="p-3">{item.service_tag || 'N/A'}</td>

                        <td className="p-3">
                          {item.empleado_nombre || 'N/A'}
                        </td>

                        <td className="p-3">{item.liberado_por || 'N/A'}</td>

                        <td className="p-3">
                          {item.tipo_liberador || 'N/A'}
                        </td>

                        <td className="p-3">
                          <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                            {item.estado || 'LIBERADO'}
                          </span>
                        </td>

                        <td className="p-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              setDetalleLiberacion({
                                open: true,
                                historialLiberacionId:
                                  item.historial_liberacion_id,
                              })
                            }
                          >
                            <Eye className="mr-1 h-4 w-4" />
                            Ver detalle
                          </Button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </>
          )}
        </table>
      </div>

      <LiberacionDetalleModal
        open={detalleLiberacion.open}
        onOpenChange={(open) =>
          setDetalleLiberacion((prev) => ({
            open,
            historialLiberacionId: open ? prev.historialLiberacionId : null,
          }))
        }
        historialLiberacionId={detalleLiberacion.historialLiberacionId}
      />
    </div>
  );
}