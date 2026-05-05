export type MonitoringDisk = {
  disco: string | null;
  tamañoGB: number | null;
  usadoGB: number | null;
  porcentaje: number | null;
  fechaReporte?: string | null;
};

export type MonitoringDevice = {
  monitoreoId: number;
  equipoIdRegistrado: number | null;

  hostname: string | null;
  ip: string | null;
  mac: string | null;
  usuario: string | null;

  serviceTag: string | null;
  serialNumber: string | null;
  deviceId: string | null;

  marca: string | null;
  modelo: string | null;
  tipoEquipo: string | null;

  registradoNuevo: boolean;
  pendienteRegistro: boolean;

  empleado: string | null;
  idEmpleado: number | string | null;
  departamento: string | null;
  planta: string | null;
  statusEmpleado: string | null;

  nombreEquipoInventario: string | null;
  fechaAsignacion: string | null;

  plataforma: string | null;
  tipoSistema: string | null;
  uptime: number | null;

  fecha: string | null;
  lastSeen: string | null;

  estado: string;
  estadoVisual: string | null;
  statusAgente: string | null;

  cpu: {
    modelo: string | null;
    nucleos: number | null;
    velocidad_mhz: number | null;
    temperatura: number | null;
  };

  ram: {
    totalGB: number | null;
    libreGB: number | null;
    usoGB: number | null;
    porcentaje: number | null;
  };

  discos: MonitoringDisk[];

  sistema: {
    edicion: string | null;
    version: string | null;
    build?: string | null;
    especificacion: string | null;
    idDispositivo: string | null;
    idProducto: string | null;
  };

  ubicacion: {
    texto: string | null;
    ipPublica: string | null;
    pais: string | null;
    estado: string | null;
    ciudad: string | null;
    latitud: number | null;
    longitud: number | null;
    proveedor: string | null;
    ultimaUbicacionAt: string | null;
    fuente: string | null;
  };
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3006';

export async function obtenerDashboardMonitoreo(): Promise<MonitoringDevice[]> {
  const response = await fetch(`${API_BASE}/dashboard-monitoreo`);

  if (!response.ok) {
    let message = `Error ${response.status}`;

    try {
      const errorData = await response.json();
      message = errorData?.error || message;
    } catch {
      // ignorar error de parseo
    }

    throw new Error(message);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    return [];
  }

  return data;
}