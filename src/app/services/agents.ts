export interface AgenteDetectado {
  monitoreo_id: number;
  hostname: string;
  usuario: string;
  ip: string;
  mac: string;
  service_tag: string;
  serial_number: string;
  marca: string;
  modelo: string;
  tipo_equipo: string;
  plataforma: string;
  tipo_sistema: string;
  version_windows: string;
  build_windows: string;
  edicion_windows: string;
  cpu_modelo: string;
  cpu_nucleos: number | null;
  cpu_velocidad_mhz: number | null;
  ram_total_gb: number | null;
  ram_libre_gb: number | null;
  ram_uso_gb: number | null;
  ram_porcentaje: number | null;
  especificacion: string;
  estado_visual: string;
  fecha_reporte: string | null;
  last_seen: string | null;
  registrado_en_inventario: number;
  equipo_id_registrado: number | null;
  estado_registro: 'DISPONIBLE' | 'REGISTRADO' | 'SIN_SERVICE_TAG' | 'DESCONECTADO';
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3006';

export async function getAgentesDetectados(): Promise<AgenteDetectado[]> {
  const response = await fetch(`${API_BASE}/agentes`);

  if (!response.ok) {
    throw new Error(`Error al obtener agentes detectados: ${response.status}`);
  }

  return response.json();
}