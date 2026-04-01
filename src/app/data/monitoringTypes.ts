export interface MonitoringDevice {
  hostname: string;
  ip: string;
  mac: string;
  usuario: string;
  plataforma: string;
  tipoSistema: string;
  uptime: number;
  ubicacion?: string;
  fecha: string;
  lastSeen: string;
  estado: string;

  cpu: {
    modelo: string;
    nucleos: number;
    velocidad_mhz: number;
    temperatura: number | null;
  };

  ram: {
    totalGB: number;
    libreGB: number;
    usoGB: number;
    porcentaje: number;
  };

  discos: {
    disco: string;
    tamañoGB: number;
    usadoGB: number;
    porcentaje: number;
  }[];

  sistema: {
    edicion: string;
    version: string;
    instalado?: string;
    build?: string;
    especificacion: string;
    idDispositivo: string;
    idProducto: string;
  };
}