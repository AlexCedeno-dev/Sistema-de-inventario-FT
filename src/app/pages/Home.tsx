import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import {
  Monitor,
  Activity,
  Package,
  TrendingUp,
  Clock,
  AlertTriangle,
} from 'lucide-react';

import HomeAlertasModal from '../components/home/HomeAlertasModal';
import {
  getHomeActividad,
  getHomeAlertas,
  getHomeRecientes,
  getHomeResumen,
} from '../services/home.service';

import type {
  HomeActividad,
  HomeAlerta,
  HomeReciente,
  HomeResumen,
} from '../../types/home.types';

export function Home() {
  const navigate = useNavigate();

  const [resumen, setResumen] = useState<HomeResumen | null>(null);
  const [actividad, setActividad] = useState<HomeActividad | null>(null);
  const [recientes, setRecientes] = useState<HomeReciente[]>([]);
  const [alertas, setAlertas] = useState<HomeAlerta[]>([]);

  const [loadingHome, setLoadingHome] = useState(false);
  const [loadingAlertas, setLoadingAlertas] = useState(false);
  const [modalAlertasOpen, setModalAlertasOpen] = useState(false);
  
  

  async function cargarHome() {
    try {
      setLoadingHome(true);

      const [resumenData, actividadData, recientesData] = await Promise.all([
        getHomeResumen(),
        getHomeActividad(),
        getHomeRecientes(),
      ]);

      setResumen(resumenData);
      setActividad(actividadData);
      setRecientes(recientesData);
    } catch (error) {
      console.error('Error cargando datos del Home:', error);
    } finally {
      setLoadingHome(false);
    }
  }

  async function abrirModalAlertas() {
    try {
      setModalAlertasOpen(true);
      setLoadingAlertas(true);

      const data = await getHomeAlertas();
      setAlertas(data);
    } catch (error) {
      console.error('Error cargando alertas:', error);
    } finally {
      setLoadingAlertas(false);
    }
  }

  useEffect(() => {
    cargarHome();

    const interval = setInterval(() => {
      cargarHome();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const totalEquipos = resumen?.totales.totalEquipos ?? 0;
  const equiposOnline = resumen?.totales.equiposOnline ?? 0;
  const inventarioActivo = resumen?.totales.inventarioActivo ?? 0;
  const alertasCriticas = resumen?.totales.alertasCriticas ?? 0;
  const disponibilidad = resumen?.totales.disponibilidad ?? 0;

  const totalMonitoreados = resumen?.resumenSistema.totalMonitoreados ?? 0;
  const online = resumen?.resumenSistema.online ?? 0;
  const offline = resumen?.resumenSistema.offline ?? 0;
  

function handleVerEquipo(alerta: HomeAlerta) {
  const params = new URLSearchParams();

  if (alerta.equipo_id) {
    params.set('equipo_id', String(alerta.equipo_id));
  }

  if (alerta.service_tag) {
    params.set('service_tag', alerta.service_tag);
  }

  if (alerta.hostname) {
    params.set('hostname', alerta.hostname);
  }

  setModalAlertasOpen(false);

  navigate(`/inventory-new?${params.toString()}`);
}

function handleVerMonitoreo(alerta: HomeAlerta) {
  const params = new URLSearchParams();

  if (alerta.monitoreo_id) {
    params.set('monitoreo_id', String(alerta.monitoreo_id));
  }

  if (alerta.device_id) {
    params.set('device_id', alerta.device_id);
  }

  if (alerta.service_tag) {
    params.set('service_tag', alerta.service_tag);
  }

  if (alerta.hostname) {
    params.set('hostname', alerta.hostname);
  }

  setModalAlertasOpen(false);

  navigate(`/dashboard?${params.toString()}`);
}

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900">
          Bienvenido al Sistema IT
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Resumen general y actualizaciones de las últimas 24 horas
        </p>

        {loadingHome && (
          <p className="mt-2 text-sm text-gray-400">
            Actualizando información del sistema...
          </p>
        )}
      </div>

      {/* Estadísticas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipos</CardTitle>
            <Monitor className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalEquipos}</div>
            <p className="text-xs text-gray-500 mt-1">
              Monitoreo en tiempo real
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Equipos Online</CardTitle>
            <Activity className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {equiposOnline}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {disponibilidad}% disponibilidad
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-600">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Inventario Activo
            </CardTitle>
            <Package className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">
              {inventarioActivo}
            </div>
            <p className="text-xs text-gray-500 mt-1">Equipos asignados</p>
          </CardContent>
        </Card>

        <Card
          onClick={abrirModalAlertas}
          className="border-l-4 border-l-orange-600 cursor-pointer transition hover:-translate-y-1 hover:shadow-md"
        >
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Alertas Críticas
            </CardTitle>
            <AlertTriangle className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {alertasCriticas}
            </div>
            <p className="text-xs text-gray-500 mt-1">Requieren atención</p>
          </CardContent>
        </Card>
      </div>

      {/* Actualizaciones de las Últimas 24 Horas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <CardTitle>Actividad de las Últimas 24 Horas</CardTitle>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-blue-600 text-white p-2 rounded-full">
                  <TrendingUp className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold">Nuevos Equipos</p>
                  <p className="text-sm text-gray-500">
                    Registrados en el sistema
                  </p>
                </div>
              </div>

              <div className="text-2xl font-bold text-blue-600">
                {actividad?.nuevosEquipos ?? 0}
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="bg-green-600 text-white p-2 rounded-full">
                  <Activity className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold">Actualizaciones</p>
                  <p className="text-sm text-gray-500">
                    Cambios de configuración
                  </p>
                </div>
              </div>

              <div className="text-2xl font-bold text-green-600">
                {actividad?.actualizaciones ?? 0}
              </div>
            </div>

            <div
              onClick={abrirModalAlertas}
              className="flex items-center justify-between p-4 bg-orange-50 rounded-lg cursor-pointer transition hover:bg-orange-100"
            >
              <div className="flex items-center gap-3">
                <div className="bg-orange-600 text-white p-2 rounded-full">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <p className="font-semibold">Nuevas Alertas</p>
                  <p className="text-sm text-gray-500">Problemas detectados</p>
                </div>
              </div>

              <div className="text-2xl font-bold text-orange-600">
                {actividad?.nuevasAlertas ?? 0}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Equipos Actualizados Recientemente */}
        <Card>
          <CardHeader>
            <CardTitle>Actualizaciones Recientes</CardTitle>
          </CardHeader>

          <CardContent>
            {recientes.length === 0 ? (
              <div className="rounded-lg border border-dashed p-6 text-center text-sm text-gray-500">
                No hay actualizaciones recientes.
              </div>
            ) : (
              <div className="space-y-4">
                {recientes.map((item, index) => (
                  <div
                    key={`${item.tipo}-${item.referencia_id}-${index}`}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-sm">
                          {item.titulo}
                        </p>

                        <Badge variant="secondary" className="text-xs">
                          {item.tipo.toUpperCase()}
                        </Badge>
                      </div>

                      <p className="text-sm text-gray-500">
                        {item.descripcion}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        Fecha:{' '}
                        {item.fecha
                          ? new Date(item.fecha).toLocaleString('es-MX')
                          : 'NULL'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Estado del Sistema */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen del Sistema</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <Monitor className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Total Monitoreados</p>
              <p className="text-3xl font-bold text-blue-600">
                {totalMonitoreados}
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <Activity className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Online</p>
              <p className="text-3xl font-bold text-green-600">
                {online}
              </p>
            </div>

            <div className="text-center p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-lg">
              <AlertTriangle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600 mb-1">Offline</p>
              <p className="text-3xl font-bold text-red-600">
                {offline}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <HomeAlertasModal
        open={modalAlertasOpen}
        alertas={alertas}
        loading={loadingAlertas}
        onClose={() => setModalAlertasOpen(false)}
        onVerEquipo={handleVerEquipo}
        onVerMonitoreo={handleVerMonitoreo}
      />
    </div>
  );
}