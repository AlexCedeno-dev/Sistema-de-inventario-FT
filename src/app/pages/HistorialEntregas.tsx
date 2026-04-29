import { useEffect, useState } from 'react';
import { Button } from '../components/ui/button';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3006';

type Filtro = 'hoy' | 'semana' | 'mes';

interface EntregaHistorial {
  fecha_firma: string;
  entregado_por: string;
  tipo_entregador: string;
  estado: string;
  service_tag: string;
  nombre_completo: string;
  equipo_id: string;
}

export function HistorialEntregas() {
  const [filtro, setFiltro] = useState<Filtro>('hoy');
  const [data, setData] = useState<EntregaHistorial[]>([]);
  const [loading, setLoading] = useState(false);

  const cargarHistorial = async (filtroActual: Filtro) => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API_BASE}/entregas-historial?filtro=${filtroActual}`
      );

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.error || 'Error al cargar historial');
      }

      setData(json);
    } catch (error) {
      console.error('Error historial entregas:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarHistorial(filtro);
  }, [filtro]);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Historial de entregas</h1>
        <p className="text-sm text-gray-500">
          Consulta quién entregó cada equipo y cuándo fue firmado.
        </p>
      </div>

      <div className="flex gap-2">
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

      <div className="border rounded-lg overflow-hidden bg-white">
        <table className="w-full text-sm">
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
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-4 text-center text-gray-500">
                  No hay entregas registradas.
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="border-t">
                  <td className="p-3">
                        {new Date(
                        new Date(item.fecha_firma).getTime() - (6 * 60 * 60 * 1000)
                        ).toLocaleString('es-MX', {
                        year:'numeric',
                        month:'2-digit',
                        day:'2-digit',
                        hour:'2-digit',
                        minute:'2-digit',
                        hour12:true
                        })}
                  </td>
                  <td className="p-3">{item.service_tag || 'N/A'}</td>
                  <td className="p-3">{item.nombre_completo || 'N/A'}</td>
                  <td className="p-3">{item.entregado_por || 'N/A'}</td>
                  <td className="p-3">{item.tipo_entregador || 'N/A'}</td>
                  <td className="p-3">{item.estado || 'N/A'}</td>
                  <td className="p-3">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                        window.open(`${API_BASE}/equipos/${item.equipo_id}/responsiva-firmada`, '_blank')
                        }
                    >
                        Descargar
                    </Button>
                    </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}