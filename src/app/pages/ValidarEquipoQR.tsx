import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { CheckCircle, XCircle, Laptop, User, Building2, CalendarDays } from 'lucide-react';

type EquipoQR = {
  equipo_id: number;
  codigo_activo: string;
  service_tag: string;
  empleado_asignado: string | null;
  departamento: string | null;
  tipo: string | null;
  marca: string | null;
  modelo: string | null;
  permiso_salida: 'AUTORIZADO' | 'NO_AUTORIZADO';
  estado_registro: string | null;
  fecha_alta_equipo: string | null;
};

const API_URL = import.meta.env.VITE_API_URL;

export function ValidarEquipoQR() {
  const { token } = useParams();
  const [equipo, setEquipo] = useState<EquipoQR | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarEquipo() {
      try {
        setLoading(true);
        setError('');

        const res = await fetch(`${API_URL}/equipos/qr/${token}`);

        if (!res.ok) {
          throw new Error('Equipo no encontrado');
        }

        const data = await res.json();
        setEquipo(data.equipo);
      } catch (err: any) {
        setError(err.message || 'Error al validar equipo');
      } finally {
        setLoading(false);
      }
    }

    if (token) {
      cargarEquipo();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <p className="text-lg font-semibold">Validando equipo...</p>
        </div>
      </div>
    );
  }

  if (error || !equipo) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-lg w-full text-center border border-red-200">
          <XCircle className="h-16 w-16 text-red-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-700">QR no válido</h1>
          <p className="text-gray-600 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  const autorizado = equipo.permiso_salida === 'AUTORIZADO';

  const fechaAltaEquipo = equipo.fecha_alta_equipo
    ? new Date(equipo.fecha_alta_equipo).toLocaleDateString('es-MX')
    : 'Sin fecha';

  return (
    <div className={`min-h-screen p-6 flex items-center justify-center ${autorizado ? 'bg-green-50' : 'bg-red-50'}`}>
      <div className="bg-white rounded-3xl shadow-xl max-w-2xl w-full overflow-hidden border">
        <div className={`p-6 text-white text-center ${autorizado ? 'bg-green-600' : 'bg-red-600'}`}>
          {autorizado ? (
            <CheckCircle className="h-20 w-20 mx-auto mb-3" />
          ) : (
            <XCircle className="h-20 w-20 mx-auto mb-3" />
          )}

          <h1 className="text-3xl font-bold">
            {autorizado ? 'AUTORIZADO PARA SALIR' : 'NO AUTORIZADO PARA SALIR'}
          </h1>

          <p className="text-lg mt-2">{equipo.codigo_activo}</p>
        </div>

        <div className="p-6 space-y-4">
          <Info icon={<Laptop />} label="Service Tag" value={equipo.service_tag} />
          <Info icon={<User />} label="Empleado asignado" value={equipo.empleado_asignado || 'Sin empleado asignado'} />
          <Info icon={<Building2 />} label="Departamento" value={equipo.departamento || 'Sin departamento'} />
          <Info icon={<Laptop />} label="Tipo de equipo" value={equipo.tipo || 'Sin tipo'} />
          <Info icon={<Laptop />} label="Modelo" value={`${equipo.marca || ''} ${equipo.modelo || ''}`.trim() || 'Sin modelo'} />
          <Info icon={<CheckCircle />} label="Estado del equipo" value={equipo.estado_registro || 'Sin estado'} />
          <Info icon={<CalendarDays />} label="Fecha de alta del equipo" value={fechaAltaEquipo} />
        </div>

        <div className="p-4 bg-gray-50 text-center text-sm text-gray-500">
          Foresight Mexico Technology Co., Ltd.
        </div>
      </div>
    </div>
  );
}

function Info({
  icon,
  label,
  value
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-4 border rounded-xl p-4">
      <div className="text-blue-700">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}