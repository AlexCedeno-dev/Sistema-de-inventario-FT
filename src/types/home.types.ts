export type NivelAlerta = 'critico' | 'advertencia' | 'info';

export type TipoAlerta =
  | 'garantia'
  | 'ram'
  | 'offline'
  | 'pendiente_registro'
  | 'disco';

export interface HomeResumen {
  totales: {
    totalEquipos: number;
    equiposOnline: number;
    inventarioActivo: number;
    alertasCriticas: number;
    disponibilidad: number;
  };
  resumenSistema: {
    totalMonitoreados: number;
    online: number;
    offline: number;
  };
}

export interface HomeActividad {
  nuevosEquipos: number;
  actualizaciones: number;
  nuevasAlertas: number;
}

export interface HomeReciente {
  tipo: string;
  titulo: string;
  descripcion: string;
  referencia_id: number | null;
  service_tag: string | null;
  fecha: string | null;
}

export interface HomeAlerta {
  id: string;
  tipo: TipoAlerta;
  nivel: NivelAlerta;

  equipo_id?: number | null;
  monitoreo_id?: number | null;
  device_id?: string | null;

  service_tag?: string | null;
  hostname?: string | null;
  tipo_equipo?: string | null;
  empleado?: string | null;
  departamento?: string | null;
  planta?: string | null;

  mensaje: string;
  valor?: number | string | null;
  horas_offline?: number | null;
  last_seen?: string | null;
  fecha_limite?: string | null;

  ram_total_gb?: number | null;
  ram_libre_gb?: number | null;
  ram_uso_gb?: number | null;

  marca?: string | null;
  modelo?: string | null;
  ip?: string | null;
  mac?: string | null;
}