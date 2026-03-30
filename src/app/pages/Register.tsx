import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { toast } from 'sonner';
import { Save, Plus } from 'lucide-react';

export function Register() {
  const [activeTab, setActiveTab] = useState('empleado');

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

  const handleSubmit = () => {
    // Validación básica
    if (!nombreEmpleado || !departamento || !planta) {
      toast.error('Por favor, completa la información del empleado');
      setActiveTab('empleado');
      return;
    }

    if (!tipo || !marca || !modelo || !serviceTag) {
      toast.error('Por favor, completa la información del equipo');
      setActiveTab('equipo');
      return;
    }

    // En un entorno real, aquí se enviaría la información al servidor
    toast.success('Equipo registrado exitosamente', {
      description: `${nombreEquipo || serviceTag} asignado a ${nombreEmpleado}`,
    });

    // Resetear formulario
    resetForm();
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
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Registrar Equipo de Cómputo</h1>
        <p className="text-gray-500 mt-1">Completa la información para registrar un nuevo equipo</p>
      </div>

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
                      <SelectItem value="Sistemas">Sistemas</SelectItem>
                      <SelectItem value="Laboratorio">Laboratorio</SelectItem>
                      <SelectItem value="Producción">Producción</SelectItem>
                      <SelectItem value="Desarrollo">Desarrollo</SelectItem>
                      <SelectItem value="Administración">Administración</SelectItem>
                      <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                      <SelectItem value="Ventas">Ventas</SelectItem>
                      <SelectItem value="Logística">Logística</SelectItem>
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
                      <SelectItem value="Planta Norte">Planta Norte</SelectItem>
                      <SelectItem value="Planta Sur">Planta Sur</SelectItem>
                      <SelectItem value="Planta Central">Planta Central</SelectItem>
                      <SelectItem value="Oficinas Matriz">Oficinas Matriz</SelectItem>
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
            <Button onClick={handleSubmit} className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Guardar Equipo
            </Button>
            <Button variant="outline" onClick={resetForm}>
              Limpiar Formulario
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
