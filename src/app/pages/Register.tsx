import { useEffect, useState } from 'react';
import { useLocation, useNavigate} from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import { getRegisterDataFromAgent } from '../services/register';


export function Register() {
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('empleado');
  const [loadingAgentData, setLoadingAgentData] = useState(false);

  // Empleado
  const [nombreEmpleado, setNombreEmpleado] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [planta, setPlanta] = useState('');

  // Equipo
  const [tipo, setTipo] = useState('');
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [serviceTag, setServiceTag] = useState('');
  const [nombreEquipo, setNombreEquipo] = useState('');
  const [especificaciones, setEspecificaciones] = useState('');
  const [fechaCompra, setFechaCompra] = useState('');
  const [fechaAsignacion, setFechaAsignacion] = useState('');

  // Garantía
  const [inicioGarantia, setInicioGarantia] = useState('');
  const [finGarantia, setFinGarantia] = useState('');
  const [estadoRenovacion, setEstadoRenovacion] = useState('');

  // Windows
  const [biosPassword, setBiosPassword] = useState('');
  const [usuarioWindows, setUsuarioWindows] = useState('');
  const [passwordWindows, setPasswordWindows] = useState('');
  const [usuarioAdmin, setUsuarioAdmin] = useState('');
  const [passwordAdmin, setPasswordAdmin] = useState('');
  const [correoEnrollado, setCorreoEnrollado] = useState('');
  const [passwordEnrollado, setPasswordEnrollado] = useState('');
  const [licenciaOffice, setLicenciaOffice] = useState('');

  // Accesos
  const [correoExmail, setCorreoExmail] = useState('');
  const [passwordExmail, setPasswordExmail] = useState('');
  const [usuarioNAS, setUsuarioNAS] = useState('');
  const [passwordNAS, setPasswordNAS] = useState('');
  const [usuarioVPN, setUsuarioVPN] = useState('');
  const [passwordVPN, setPasswordVPN] = useState('');
  const [usuarioOsticket, setUsuarioOsticket] = useState('');
  const [passwordOsticket, setPasswordOsticket] = useState('');

  const monitoreoId = new URLSearchParams(location.search).get('monitoreoId');
    //LOCAL y server 
  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3006';


  useEffect(() => {
    const loadAgentData = async () => {
      if (!monitoreoId) return;

      try {
        setLoadingAgentData(true);

        const data = await getRegisterDataFromAgent(Number(monitoreoId));
        const specsAutomaticas = [
              data.equipo.specs,
              data.sistema.ram_total_gb ? `${data.sistema.ram_total_gb} GB RAM` : '',
              data.sistema.plataforma,
              data.sistema.tipo_sistema,
              data.sistema.edicion_windows,
              data.sistema.version_windows
            ].filter(Boolean).join(' | ');

        setTipo(data.equipo.tipo || '');
        setMarca(data.equipo.marca || '');
        setModelo(data.equipo.modelo || '');
        setServiceTag(data.equipo.service_tag || '');
        setNombreEquipo(data.equipo.nombre_equipo || '');
        setEspecificaciones(specsAutomaticas);
        setUsuarioWindows(data.equipo.hostname_detectado || '');
        

        if (data.equipo.fecha_compra) {
          setFechaCompra(data.equipo.fecha_compra.slice(0, 10));
        }

        if (data.equipo.fecha_asig) {
          setFechaAsignacion(data.equipo.fecha_asig.slice(0, 10));
        }

        if (data.equipo.start_warranty) {
          setInicioGarantia(data.equipo.start_warranty.slice(0, 10));
        }

        if (data.equipo.end_warranty) {
          setFinGarantia(data.equipo.end_warranty.slice(0, 10));
        }

        toast.success('Datos del agente cargados', {
          description: `Se precargó el equipo ${data.equipo.nombre_equipo || data.equipo.service_tag}`,
        });
      } catch (error) {
        console.error('Error cargando datos del agente:', error);
        toast.error('No se pudieron cargar los datos del agente');
      } finally {
        setLoadingAgentData(false);
      }
    };

    loadAgentData();
  }, [monitoreoId]);

   const handleSubmit = async () => {
  try {
    if (!nombreEmpleado || !departamento || !planta) {
      toast.error('Completa datos del empleado');
      return;
    }

    if (!tipo || !marca || !modelo || !serviceTag) {
      toast.error('Completa datos del equipo');
      return;
    }

    const payload = {
      monitoreo_id: monitoreoId ? Number(monitoreoId) : null,
      empleado: {
        nombre_completo: nombreEmpleado,
        departamento,
        planta
      },
      equipo: {
        tipo,
        marca,
        modelo,
        service_tag: serviceTag,
        nombre_equipo: nombreEquipo || null,
        specs: especificaciones || null,
        fecha_compra: fechaCompra || null,
        fecha_asig: fechaAsignacion || null,
        start_warranty: inicioGarantia || null,
        end_warranty: finGarantia || null
      },
      windows: {
        usuarioWindows: usuarioWindows || null,
        passwordWindows: passwordWindows || null,
        usuarioAdmin: usuarioAdmin || null,
        passwordAdmin: passwordAdmin || null
      }
    };

    const res = await fetch(`${API_BASE}/registrar-equipo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || 'Error al guardar');
    }

    toast.success('Equipo registrado correctamente');
    navigate('/agentes');
  } catch (error: any) {
    toast.error(error.message || 'Error al registrar equipo');
  }
};

  const resetForm = () => {
    setNombreEmpleado('');
    setDepartamento('');
    setPlanta('');
    setTipo('');
    setMarca('');
    setModelo('');
    setServiceTag('');
    setNombreEquipo('');
    setEspecificaciones('');
    setFechaCompra('');
    setFechaAsignacion('');
    setInicioGarantia('');
    setFinGarantia('');
    setEstadoRenovacion('');
    setBiosPassword('');
    setUsuarioWindows('');
    setPasswordWindows('');
    setUsuarioAdmin('');
    setPasswordAdmin('');
    setCorreoEnrollado('');
    setPasswordEnrollado('');
    setLicenciaOffice('');
    setCorreoExmail('');
    setPasswordExmail('');
    setUsuarioNAS('');
    setPasswordNAS('');
    setUsuarioVPN('');
    setPasswordVPN('');
    setUsuarioOsticket('');
    setPasswordOsticket('');
    setActiveTab('empleado');
  };

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Registrar Equipo de Cómputo</h1>
        <p className="text-gray-500 mt-1">
        {monitoreoId
          ? 'Se seleccionó un agente detectado. Completa la información para registrar el equipo.'
          : 'Completa la información para registrar un nuevo equipo'}
        </p>
      </div>

      {loadingAgentData && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
          Cargando datos detectados por el agente...
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Información del Equipo</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="empleado">Empleado</TabsTrigger>
              <TabsTrigger value="equipo">Equipo</TabsTrigger>
              <TabsTrigger value="garantia">Garantía</TabsTrigger>
              <TabsTrigger value="windows">Windows</TabsTrigger>
              <TabsTrigger value="accesos">Accesos</TabsTrigger>
            </TabsList>

            <TabsContent value="empleado" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nombreEmpleado">Nombre del Empleado *</Label>
                  <Input
                    id="nombreEmpleado"
                    placeholder="Ej: Juan Pérez García"
                    value={nombreEmpleado}
                    onChange={(e) => setNombreEmpleado(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="departamento">Departamento *</Label>
                  <Select value={departamento} onValueChange={setDepartamento}>
                    <SelectTrigger id="departamento">
                      <SelectValue placeholder="Seleccionar departamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Engineering">Engineering</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Human Resources">Human Resources</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Logistics and Foreign Trade">Logistics and Foreign Trade</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Manufacture">Manufacture</SelectItem>
                      <SelectItem value="Materials handling">Materials handling</SelectItem>
                      <SelectItem value="NPL">NPL</SelectItem>
                      <SelectItem value="Paint">Paint</SelectItem>
                      <SelectItem value="Plant Management">Plant Management</SelectItem>
                      <SelectItem value="Purchase">Purchase</SelectItem>
                      <SelectItem value="Production Control">Production Control</SelectItem>
                      <SelectItem value="QA">QA</SelectItem>
                      <SelectItem value="Safety and Environment">Safety and Environment</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Scrap">Scrap</SelectItem>
                      <SelectItem value="Shipping">Shipping</SelectItem>
                      <SelectItem value="SQA">SQA</SelectItem>
                      <SelectItem value="Warehouse">Warehouse</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="planta">Planta *</Label>
                  <Select value={planta} onValueChange={setPlanta}>
                    <SelectTrigger id="planta">
                      <SelectValue placeholder="Seleccionar planta" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Planta Piva">PIVA</SelectItem>
                      <SelectItem value="Chichimeco Planta 2">Chichimeco Planta 2</SelectItem>
                      <SelectItem value="Chichimeco Planta 3">Chichimeco Planta 3</SelectItem>
                      <SelectItem value="Bodega">Bodega</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="equipo" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tipo">Tipo de Equipo *</Label>
                  <Select value={tipo} onValueChange={setTipo}>
                    <SelectTrigger id="tipo">
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Laptop">Laptop</SelectItem>
                      <SelectItem value="Desktop">Desktop</SelectItem>
                      <SelectItem value="Workstation">Workstation</SelectItem>
                      <SelectItem value="All-in-One">All-in-One</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="marca">Marca *</Label>
                  <Select value={marca} onValueChange={setMarca}>
                    <SelectTrigger id="marca">
                      <SelectValue placeholder="Seleccionar marca" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dell">Dell</SelectItem>
                      <SelectItem value="HP">HP</SelectItem>
                      <SelectItem value="Lenovo">Lenovo</SelectItem>
                      <SelectItem value="Asus">Asus</SelectItem>
                      <SelectItem value="Acer">Acer</SelectItem>
                      <SelectItem value="Apple">Apple</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="modelo">Modelo *</Label>
                  <Input
                    id="modelo"
                    placeholder="Ej: Latitude 5430"
                    value={modelo}
                    onChange={(e) => setModelo(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="serviceTag">Service Tag *</Label>
                  <Input
                    id="serviceTag"
                    placeholder="Ej: HVRF924"
                    value={serviceTag}
                    onChange={(e) => setServiceTag(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombreEquipo">Nombre del Equipo</Label>
                  <Input
                    id="nombreEquipo"
                    placeholder="Ej: FSMXADMIN"
                    value={nombreEquipo}
                    onChange={(e) => setNombreEquipo(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaCompra">Fecha de Compra</Label>
                  <Input
                    id="fechaCompra"
                    type="date"
                    value={fechaCompra}
                    onChange={(e) => setFechaCompra(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fechaAsignacion">Fecha de Asignación</Label>
                  <Input
                    id="fechaAsignacion"
                    type="date"
                    value={fechaAsignacion}
                    onChange={(e) => setFechaAsignacion(e.target.value)}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="especificaciones">Especificaciones Básicas</Label>
                  <Textarea
                    id="especificaciones"
                    placeholder="Ej: Intel i5-1235U, 16GB RAM, 256GB SSD"
                    value={especificaciones}
                    onChange={(e) => setEspecificaciones(e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="garantia" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="inicioGarantia">Inicio de Garantía</Label>
                  <Input
                    id="inicioGarantia"
                    type="date"
                    value={inicioGarantia}
                    onChange={(e) => setInicioGarantia(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="finGarantia">Fin de Garantía</Label>
                  <Input
                    id="finGarantia"
                    type="date"
                    value={finGarantia}
                    onChange={(e) => setFinGarantia(e.target.value)}
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <Label htmlFor="estadoRenovacion">Estado de Renovación</Label>
                  <Select value={estadoRenovacion} onValueChange={setEstadoRenovacion}>
                    <SelectTrigger id="estadoRenovacion">
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Vigente">Vigente</SelectItem>
                      <SelectItem value="Por Vencer">Por Vencer</SelectItem>
                      <SelectItem value="Vencida">Vencida</SelectItem>
                      <SelectItem value="Renovada">Renovada</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="windows" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="biosPassword">BIOS Password</Label>
                  <Input
                    id="biosPassword"
                    type="password"
                    placeholder="••••••••"
                    value={biosPassword}
                    onChange={(e) => setBiosPassword(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="licenciaOffice">Licencia Office</Label>
                  <Input
                    id="licenciaOffice"
                    placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX"
                    value={licenciaOffice}
                    onChange={(e) => setLicenciaOffice(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usuarioWindows">Usuario Windows</Label>
                  <Input
                    id="usuarioWindows"
                    placeholder="usuario.windows"
                    value={usuarioWindows}
                    onChange={(e) => setUsuarioWindows(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordWindows">Contraseña Windows</Label>
                  <Input
                    id="passwordWindows"
                    type="password"
                    placeholder="••••••••"
                    value={passwordWindows}
                    onChange={(e) => setPasswordWindows(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usuarioAdmin">Usuario Admin</Label>
                  <Input
                    id="usuarioAdmin"
                    placeholder="admin.local"
                    value={usuarioAdmin}
                    onChange={(e) => setUsuarioAdmin(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordAdmin">Contraseña Admin</Label>
                  <Input
                    id="passwordAdmin"
                    type="password"
                    placeholder="••••••••"
                    value={passwordAdmin}
                    onChange={(e) => setPasswordAdmin(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="correoEnrollado">Correo Enrollado</Label>
                  <Input
                    id="correoEnrollado"
                    type="email"
                    placeholder="usuario@empresa.com"
                    value={correoEnrollado}
                    onChange={(e) => setCorreoEnrollado(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordEnrollado">Contraseña Enrollado</Label>
                  <Input
                    id="passwordEnrollado"
                    type="password"
                    placeholder="••••••••"
                    value={passwordEnrollado}
                    onChange={(e) => setPasswordEnrollado(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="accesos" className="space-y-4 mt-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="correoExmail">Correo Exmail</Label>
                  <Input
                    id="correoExmail"
                    type="email"
                    placeholder="usuario@exmail.empresa.com"
                    value={correoExmail}
                    onChange={(e) => setCorreoExmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordExmail">Contraseña Exmail</Label>
                  <Input
                    id="passwordExmail"
                    type="password"
                    placeholder="••••••••"
                    value={passwordExmail}
                    onChange={(e) => setPasswordExmail(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usuarioNAS">Usuario NAS</Label>
                  <Input
                    id="usuarioNAS"
                    placeholder="usuario.nas"
                    value={usuarioNAS}
                    onChange={(e) => setUsuarioNAS(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordNAS">Contraseña NAS</Label>
                  <Input
                    id="passwordNAS"
                    type="password"
                    placeholder="••••••••"
                    value={passwordNAS}
                    onChange={(e) => setPasswordNAS(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usuarioVPN">Usuario VPN</Label>
                  <Input
                    id="usuarioVPN"
                    placeholder="usuario.vpn"
                    value={usuarioVPN}
                    onChange={(e) => setUsuarioVPN(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordVPN">Contraseña VPN</Label>
                  <Input
                    id="passwordVPN"
                    type="password"
                    placeholder="••••••••"
                    value={passwordVPN}
                    onChange={(e) => setPasswordVPN(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="usuarioOsticket">Usuario OSTicket</Label>
                  <Input
                    id="usuarioOsticket"
                    placeholder="usuario.osticket"
                    value={usuarioOsticket}
                    onChange={(e) => setUsuarioOsticket(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordOsticket">Contraseña OSTicket</Label>
                  <Input
                    id="passwordOsticket"
                    type="password"
                    placeholder="••••••••"
                    value={passwordOsticket}
                    onChange={(e) => setPasswordOsticket(e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex gap-4 mt-6 pt-6 border-t">
            <Button type="button" onClick={handleSubmit} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Guardar Equipo
            </Button>

            <Button type="button" variant="outline" onClick={resetForm}>
              Limpiar Formulario
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}