import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, 
  Plus, 
  Download,
  UserPlus,
  Users,
  UserCheck
} from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Label } from './ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';

const employees = [
  { id: 'EMP-001', name: 'Juan Pérez', email: 'juan.perez@empresa.com', phone: '+57 300 123 4567', address: 'Calle 72 #54-46, Barranquilla', department: 'Ventas', status: 'Activo' },
  { id: 'EMP-002', name: 'María García', email: 'maria.garcia@empresa.com', phone: '+57 310 234 5678', address: 'Carrera 51B #84-24, Barranquilla', department: 'Marketing', status: 'Activo' },
  { id: 'EMP-003', name: 'Carlos Rodríguez', email: 'carlos.rodriguez@empresa.com', phone: '+57 320 345 6789', address: 'Calle 93 #47-42, Barranquilla', department: 'IT', status: 'Activo' },
  { id: 'EMP-004', name: 'Ana Martínez', email: 'ana.martinez@empresa.com', phone: '+57 301 456 7890', address: 'Calle 84 #51-18, Barranquilla', department: 'RRHH', status: 'Inactivo' },
  { id: 'EMP-005', name: 'Luis Fernández', email: 'luis.fernandez@empresa.com', phone: '+57 311 567 8901', address: 'Carrera 46 #76-135, Barranquilla', department: 'Finanzas', status: 'Activo' },
  { id: 'EMP-006', name: 'Sofia López', email: 'sofia.lopez@empresa.com', phone: '+57 321 678 9012', address: 'Calle 79B #57-52, Barranquilla', department: 'Operaciones', status: 'Activo' },
];

export function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = employees.filter(e => e.status === 'Activo').length;
  const inactiveCount = employees.filter(e => e.status === 'Inactivo').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Empleados</p>
                <p className="text-3xl text-gray-900">{employees.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Empleados Activos</p>
                <p className="text-3xl text-gray-900">{activeCount}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Empleados Inactivos</p>
                <p className="text-3xl text-gray-900">{inactiveCount}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-gray-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Employees Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestión de Empleados</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-700 hover:bg-blue-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Empleado
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <UserPlus className="w-5 h-5" />
                      Agregar Nuevo Empleado
                    </DialogTitle>
                    <DialogDescription>
                      Ingresa la información del empleado
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="name">Nombre Completo</Label>
                      <Input id="name" placeholder="Juan Pérez" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input id="email" type="email" placeholder="juan.perez@empresa.com" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" placeholder="+57 300 123 4567" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input id="address" placeholder="Calle 72 #54-46, Barranquilla" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="department">Departamento</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ventas">Ventas</SelectItem>
                          <SelectItem value="marketing">Marketing</SelectItem>
                          <SelectItem value="it">IT</SelectItem>
                          <SelectItem value="rrhh">RRHH</SelectItem>
                          <SelectItem value="finanzas">Finanzas</SelectItem>
                          <SelectItem value="operaciones">Operaciones</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>
                      Cancelar
                    </Button>
                    <Button className="bg-blue-700 hover:bg-blue-800" onClick={() => setDialogOpen(false)}>
                      Guardar Empleado
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre, email o departamento..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.map((emp) => (
                <TableRow key={emp.id}>
                  <TableCell>{emp.id}</TableCell>
                  <TableCell>{emp.name}</TableCell>
                  <TableCell>{emp.email}</TableCell>
                  <TableCell>{emp.phone}</TableCell>
                  <TableCell>{emp.address}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{emp.department}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={emp.status === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                    >
                      {emp.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
