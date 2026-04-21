export interface PendingAgent {
  monitoreo_id: number;
  hostname: string | null;
  usuario: string | null;
  ip: string | null;
  mac: string | null;
  service_tag: string | null;
  serial_number: string | null;
  marca: string | null;
  modelo: string | null;
  tipo_equipo: string | null;
  plataforma: string | null;
  version_windows: string | null;
  estado_visual: string | null;
  fecha_reporte: string | null;
  last_seen: string | null;
}