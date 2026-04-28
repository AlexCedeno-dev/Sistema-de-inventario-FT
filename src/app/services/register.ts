  //LOCAL y server
   const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3006';
  

export interface RegisterFromAgentResponse {
  monitoreo_id: number;
  empleado: {
    empleado_id: number | null;
    nombre_completo: string;
    departamento: string;
    planta: string;
  };
  equipo: {
    tipo: string;
    service_tag: string;
    serial_number: string;
    nombre_equipo: string;
    hostname_detectado: string;
    agente_device_id: string;
    registrado_desde: string;
    fecha_deteccion: string | null;
    fecha_ultima_conexion: string | null;
    marca: string;
    modelo: string;
    specs: string;
    fecha_asig: string | null;
    fecha_compra: string | null;
    start_warranty: string | null;
    end_warranty: string | null;
    po_number: number | null;
    oa_number: number | null;
  };
  sistema: {
    plataforma: string;
    tipo_sistema: string;
    edicion_windows: string;
    version_windows: string;
    build_windows: string;
    especificacion: string;
    ram_total_gb: number | null;
    ram_porcentaje: number | null;
  };
}

export interface EquipoDetalleResponse {
    equipo_id: number;
    empleado_id: number | null;

    nombre_completo: string | null;
    departamento: string | null;
    planta: string | null;

    tipo: string | null;
    marca: string | null;
    modelo: string | null;
    service_tag: string | null;
    nombre_equipo: string | null;
    bios_password: string | null;
    specs: string | null;

    fecha_compra: string | null;
    fecha_asig: string | null;
    start_warranty: string | null;
    end_warranty: string | null;

    local_user_windows: string | null;
    password_windows: string | null;
    usuario_admin: string | null;
    password_admin: string | null;

    licencia_office: string | null;

    correo_enrrolado: string | null;
    password_enrrolado: string | null;

    usuario_nas: string | null;
    password_nas: string | null;

    usuario_vpn: string | null;
    password_vpn: string | null;

    usuario_osticket: string | null;
    password_osticket: string | null;
}
export async function getRegisterDataFromAgent(
  monitoreoId: number
): Promise<RegisterFromAgentResponse> {
  const response = await fetch(
    `${API_BASE}/agentes/registro/${monitoreoId}`
  );

  if (!response.ok) {
    throw new Error(`Error al obtener datos del agente: ${response.status}`);
  }

  return response.json();
}

export async function liberarEquipo(equipoId: number) {
  const response = await fetch(`${API_BASE}/equipos/${equipoId}/liberar`, {
    method: 'POST'
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Error al liberar equipo');
  }

  return data;
}

export async function getEquipoDetalle(
    equipoId: number
  ): Promise<EquipoDetalleResponse> {
    const response = await fetch(`${API_BASE}/equipos/${equipoId}/detalle`);

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Error al obtener equipo: ${response.status}`);
    }

    return data;
  }

