export interface MonitoringDevice {
  hostname: string;
  ip: string;
  mac: string;
  usuario: string;
  plataforma: string;
  tipoSistema: string;
  uptime: number;
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
  discos: Array<{
    disco: string;
    tamañoGB: string;
    usadoGB: string;
    porcentaje: number;
  }>;
  sistema: {
    idDispositivo: string;
    idProducto: string;
    especificacion: string;
    edicion: string;
    version: string;
    instalado: string;
  };
  ubicacion: string | null;
  fecha: string;
  lastSeen: string;
  estado: string;
}

export interface InventoryDevice {
  id: string;
  status: string;
  nombreEmpleado: string;
  departamento: string;
  planta: string;
  tipo: string;
  marca: string;
  modelo: string;
  serviceTag: string;
  fechaCompra: string;
  fechaAsignacion: string;
  inicioGarantia: string;
  finGarantia: string;
  estadoRenovacion: string;
  nombreEquipo: string;
  biosPassword: string;
  usuarioWindows: string;
  passwordWindows: string;
  usuarioAdmin: string;
  passwordAdmin: string;
  correoEnrollado: string;
  passwordEnrollado: string;
  licenciaOffice: string;
  correoExmail: string;
  passwordExmail: string;
  usuarioNAS: string;
  passwordNAS: string;
  usuarioVPN: string;
  passwordVPN: string;
  usuarioOsticket: string;
  passwordOsticket: string;
  especificaciones: string;
  cartaResponsiva: string | null;
  bitlocker: string | null;
  firmado: boolean;
  permisoSalidaPlanta: boolean;
}

export const monitoringDevices: MonitoringDevice[] = [
  {
    hostname: "FSMXADMIN",
    ip: "10.8.4.92",
    mac: "8c:e9:ee:45:87:f6",
    usuario: "Fabiel",
    plataforma: "win32",
    tipoSistema: "x64",
    uptime: 3308818,
    cpu: {
      modelo: "12th Gen Intel(R) Core(TM) i5-1235U",
      nucleos: 12,
      velocidad_mhz: 2496,
      temperatura: null
    },
    ram: {
      totalGB: 15.69,
      libreGB: 4.12,
      usoGB: 11.57,
      porcentaje: 73.74
    },
    discos: [
      {
        disco: "C:",
        tamañoGB: "237.69",
        usadoGB: "220.03",
        porcentaje: 92.57
      },
      {
        disco: "Z:",
        tamañoGB: "7143.36",
        usadoGB: "1711.14",
        porcentaje: 23.95
      }
    ],
    sistema: {
      idDispositivo: "HVRF924",
      idProducto: "1.25.1",
      especificacion: "25H2",
      edicion: "Microsoft Windows 11 Pro",
      version: "10.0.26200",
      instalado: "26200"
    },
    ubicacion: "Planta Norte - Oficina 101",
    fecha: "2026-03-23T19:53:48.925Z",
    lastSeen: "2026-03-30T19:53:25.965Z",
    estado: "🟢 Online"
  },
  {
    hostname: "LAB-DESKTOP-02",
    ip: "10.8.4.105",
    mac: "b4:2e:99:3a:12:c8",
    usuario: "Maria Garcia",
    plataforma: "win32",
    tipoSistema: "x64",
    uptime: 1854321,
    cpu: {
      modelo: "Intel(R) Core(TM) i7-10700",
      nucleos: 8,
      velocidad_mhz: 2900,
      temperatura: 62
    },
    ram: {
      totalGB: 31.94,
      libreGB: 12.34,
      usoGB: 19.60,
      porcentaje: 61.35
    },
    discos: [
      {
        disco: "C:",
        tamañoGB: "476.94",
        usadoGB: "198.45",
        porcentaje: 41.61
      }
    ],
    sistema: {
      idDispositivo: "LAB02",
      idProducto: "1.20.5",
      especificacion: "22H2",
      edicion: "Microsoft Windows 10 Pro",
      version: "10.0.19045",
      instalado: "19045"
    },
    ubicacion: "Planta Sur - Lab 2",
    fecha: "2026-03-30T14:20:15.123Z",
    lastSeen: "2026-03-30T14:20:10.456Z",
    estado: "🟢 Online"
  },
  {
    hostname: "PROD-WS-15",
    ip: "10.8.5.78",
    mac: "00:1a:2b:3c:4d:5e",
    usuario: "Carlos Mendez",
    plataforma: "win32",
    tipoSistema: "x64",
    uptime: 5621478,
    cpu: {
      modelo: "AMD Ryzen 5 5600X",
      nucleos: 6,
      velocidad_mhz: 3700,
      temperatura: 55
    },
    ram: {
      totalGB: 15.93,
      libreGB: 2.87,
      usoGB: 13.06,
      porcentaje: 81.98
    },
    discos: [
      {
        disco: "C:",
        tamañoGB: "238.47",
        usadoGB: "215.32",
        porcentaje: 90.29
      },
      {
        disco: "D:",
        tamañoGB: "953.87",
        usadoGB: "456.23",
        porcentaje: 47.83
      }
    ],
    sistema: {
      idDispositivo: "PROD15",
      idProducto: "1.24.8",
      especificacion: "23H2",
      edicion: "Microsoft Windows 11 Pro",
      version: "10.0.22631",
      instalado: "22631"
    },
    ubicacion: "Planta Norte - Producción A",
    fecha: "2026-03-30T10:15:30.789Z",
    lastSeen: "2026-03-30T10:15:28.123Z",
    estado: "🟢 Online"
  },
  {
    hostname: "DEV-LAPTOP-08",
    ip: "10.8.3.42",
    mac: "ac:de:48:00:11:22",
    usuario: "Ana Rodriguez",
    plataforma: "win32",
    tipoSistema: "x64",
    uptime: 985612,
    cpu: {
      modelo: "11th Gen Intel(R) Core(TM) i7-1165G7",
      nucleos: 8,
      velocidad_mhz: 2800,
      temperatura: null
    },
    ram: {
      totalGB: 15.87,
      libreGB: 6.45,
      usoGB: 9.42,
      porcentaje: 59.36
    },
    discos: [
      {
        disco: "C:",
        tamañoGB: "476.44",
        usadoGB: "312.67",
        porcentaje: 65.62
      }
    ],
    sistema: {
      idDispositivo: "DEV08",
      idProducto: "1.22.3",
      especificacion: "22H2",
      edicion: "Microsoft Windows 11 Pro",
      version: "10.0.22621",
      instalado: "22621"
    },
    ubicacion: "Planta Central - Desarrollo",
    fecha: "2026-03-30T08:45:12.456Z",
    lastSeen: "2026-03-30T08:45:08.789Z",
    estado: "🟢 Online"
  },
  {
    hostname: "ADMIN-PC-03",
    ip: "10.8.2.15",
    mac: "f0:de:f1:a2:b3:c4",
    usuario: "Roberto Silva",
    plataforma: "win32",
    tipoSistema: "x64",
    uptime: 7845621,
    cpu: {
      modelo: "Intel(R) Core(TM) i5-9400",
      nucleos: 6,
      velocidad_mhz: 2900,
      temperatura: 68
    },
    ram: {
      totalGB: 7.94,
      libreGB: 1.23,
      usoGB: 6.71,
      porcentaje: 84.51
    },
    discos: [
      {
        disco: "C:",
        tamañoGB: "237.32",
        usadoGB: "228.91",
        porcentaje: 96.46
      }
    ],
    sistema: {
      idDispositivo: "ADMIN03",
      idProducto: "1.18.2",
      especificacion: "21H2",
      edicion: "Microsoft Windows 10 Pro",
      version: "10.0.19044",
      instalado: "19044"
    },
    ubicacion: null,
    fecha: "2026-03-23T16:30:45.321Z",
    lastSeen: "2026-03-23T16:30:20.654Z",
    estado: "🔴 Offline"
  }
];

export const inventoryDevices: InventoryDevice[] = [
  {
    id: "PC-2024-001",
    status: "Activo",
    nombreEmpleado: "Fabiel Martinez",
    departamento: "Sistemas",
    planta: "Planta Norte",
    tipo: "Laptop",
    marca: "Dell",
    modelo: "Latitude 5430",
    serviceTag: "HVRF924",
    fechaCompra: "2024-01-15",
    fechaAsignacion: "2024-01-20",
    inicioGarantia: "2024-01-15",
    finGarantia: "2027-01-15",
    estadoRenovacion: "Vigente",
    nombreEquipo: "FSMXADMIN",
    biosPassword: "Admin2024!",
    usuarioWindows: "fabiel.martinez",
    passwordWindows: "Win@2024Secure",
    usuarioAdmin: "admin.local",
    passwordAdmin: "Admin!Local2024",
    correoEnrollado: "fabiel.martinez@empresa.com",
    passwordEnrollado: "Enroll@2024",
    licenciaOffice: "XXXXX-XXXXX-XXXXX-XXXXX-XXXXX",
    correoExmail: "fabiel@exmail.empresa.com",
    passwordExmail: "Exmail!2024",
    usuarioNAS: "fmartinez",
    passwordNAS: "NAS@Secure24",
    usuarioVPN: "fabiel.vpn",
    passwordVPN: "VPN!Access24",
    usuarioOsticket: "fabiel.support",
    passwordOsticket: "Ticket@2024",
    especificaciones: "Intel i5-1235U, 16GB RAM, 256GB SSD",
    cartaResponsiva: "carta_fabiel_2024.pdf",
    bitlocker: "bitlocker_hvrf924.txt",
    firmado: true,
    permisoSalidaPlanta: true
  },
  {
    id: "PC-2023-045",
    status: "Activo",
    nombreEmpleado: "Maria Garcia Lopez",
    departamento: "Laboratorio",
    planta: "Planta Sur",
    tipo: "Desktop",
    marca: "HP",
    modelo: "EliteDesk 800 G6",
    serviceTag: "LAB02",
    fechaCompra: "2023-06-10",
    fechaAsignacion: "2023-06-15",
    inicioGarantia: "2023-06-10",
    finGarantia: "2026-06-10",
    estadoRenovacion: "Vigente",
    nombreEquipo: "LAB-DESKTOP-02",
    biosPassword: "BiosLab!02",
    usuarioWindows: "maria.garcia",
    passwordWindows: "Lab@Win2023",
    usuarioAdmin: "admin.lab02",
    passwordAdmin: "LabAdmin!23",
    correoEnrollado: "maria.garcia@empresa.com",
    passwordEnrollado: "Enroll@Lab23",
    licenciaOffice: "YYYYY-YYYYY-YYYYY-YYYYY-YYYYY",
    correoExmail: "mgarcia@exmail.empresa.com",
    passwordExmail: "ExLab!2023",
    usuarioNAS: "mgarcia",
    passwordNAS: "NASLab@23",
    usuarioVPN: "maria.vpn",
    passwordVPN: "VPNLab!23",
    usuarioOsticket: "maria.lab",
    passwordOsticket: "LabTicket@23",
    especificaciones: "Intel i7-10700, 32GB RAM, 512GB SSD",
    cartaResponsiva: "carta_maria_2023.pdf",
    bitlocker: null,
    firmado: true,
    permisoSalidaPlanta: false
  },
  {
    id: "PC-2023-089",
    status: "Activo",
    nombreEmpleado: "Carlos Mendez Ruiz",
    departamento: "Producción",
    planta: "Planta Norte",
    tipo: "Desktop",
    marca: "Lenovo",
    modelo: "ThinkCentre M70q",
    serviceTag: "PROD15",
    fechaCompra: "2023-09-22",
    fechaAsignacion: "2023-09-28",
    inicioGarantia: "2023-09-22",
    finGarantia: "2026-09-22",
    estadoRenovacion: "Vigente",
    nombreEquipo: "PROD-WS-15",
    biosPassword: "ProdBios!15",
    usuarioWindows: "carlos.mendez",
    passwordWindows: "Prod@Win23",
    usuarioAdmin: "admin.prod15",
    passwordAdmin: "ProdAdmin!15",
    correoEnrollado: "carlos.mendez@empresa.com",
    passwordEnrollado: "EnrollProd@23",
    licenciaOffice: "ZZZZZ-ZZZZZ-ZZZZZ-ZZZZZ-ZZZZZ",
    correoExmail: "cmendez@exmail.empresa.com",
    passwordExmail: "ExProd!2023",
    usuarioNAS: "cmendez",
    passwordNAS: "NASProd@23",
    usuarioVPN: "carlos.vpn",
    passwordVPN: "VPNProd!23",
    usuarioOsticket: "carlos.prod",
    passwordOsticket: "ProdTicket@23",
    especificaciones: "AMD Ryzen 5 5600X, 16GB RAM, 256GB SSD + 1TB HDD",
    cartaResponsiva: "carta_carlos_2023.pdf",
    bitlocker: "bitlocker_prod15.txt",
    firmado: true,
    permisoSalidaPlanta: false
  },
  {
    id: "PC-2024-012",
    status: "Activo",
    nombreEmpleado: "Ana Rodriguez Flores",
    departamento: "Desarrollo",
    planta: "Planta Central",
    tipo: "Laptop",
    marca: "Dell",
    modelo: "Precision 5560",
    serviceTag: "DEV08",
    fechaCompra: "2024-02-05",
    fechaAsignacion: "2024-02-10",
    inicioGarantia: "2024-02-05",
    finGarantia: "2027-02-05",
    estadoRenovacion: "Vigente",
    nombreEquipo: "DEV-LAPTOP-08",
    biosPassword: "DevBios!08",
    usuarioWindows: "ana.rodriguez",
    passwordWindows: "Dev@Win24",
    usuarioAdmin: "admin.dev08",
    passwordAdmin: "DevAdmin!08",
    correoEnrollado: "ana.rodriguez@empresa.com",
    passwordEnrollado: "EnrollDev@24",
    licenciaOffice: "AAAAA-AAAAA-AAAAA-AAAAA-AAAAA",
    correoExmail: "arodriguez@exmail.empresa.com",
    passwordExmail: "ExDev!2024",
    usuarioNAS: "arodriguez",
    passwordNAS: "NASDev@24",
    usuarioVPN: "ana.vpn",
    passwordVPN: "VPNDev!24",
    usuarioOsticket: "ana.dev",
    passwordOsticket: "DevTicket@24",
    especificaciones: "Intel i7-1165G7, 16GB RAM, 512GB SSD",
    cartaResponsiva: "carta_ana_2024.pdf",
    bitlocker: "bitlocker_dev08.txt",
    firmado: true,
    permisoSalidaPlanta: true
  },
  {
    id: "PC-2022-078",
    status: "Mantenimiento",
    nombreEmpleado: "Roberto Silva Gomez",
    departamento: "Administración",
    planta: "Planta Norte",
    tipo: "Desktop",
    marca: "HP",
    modelo: "ProDesk 600 G5",
    serviceTag: "ADMIN03",
    fechaCompra: "2022-11-18",
    fechaAsignacion: "2022-11-25",
    inicioGarantia: "2022-11-18",
    finGarantia: "2025-11-18",
    estadoRenovacion: "Por Vencer",
    nombreEquipo: "ADMIN-PC-03",
    biosPassword: "AdminBios!03",
    usuarioWindows: "roberto.silva",
    passwordWindows: "Admin@Win22",
    usuarioAdmin: "admin.admin03",
    passwordAdmin: "AdminAdmin!03",
    correoEnrollado: "roberto.silva@empresa.com",
    passwordEnrollado: "EnrollAdmin@22",
    licenciaOffice: "BBBBB-BBBBB-BBBBB-BBBBB-BBBBB",
    correoExmail: "rsilva@exmail.empresa.com",
    passwordExmail: "ExAdmin!2022",
    usuarioNAS: "rsilva",
    passwordNAS: "NASAdmin@22",
    usuarioVPN: "roberto.vpn",
    passwordVPN: "VPNAdmin!22",
    usuarioOsticket: "roberto.admin",
    passwordOsticket: "AdminTicket@22",
    especificaciones: "Intel i5-9400, 8GB RAM, 256GB SSD",
    cartaResponsiva: "carta_roberto_2022.pdf",
    bitlocker: null,
    firmado: false,
    permisoSalidaPlanta: false
  }
];
