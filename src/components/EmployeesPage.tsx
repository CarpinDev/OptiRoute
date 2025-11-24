import { useState, useEffect } from 'react';
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
  UserCheck,
  AlertCircle,
  RefreshCw,
  Edit,
  Trash2
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
import { Alert, AlertDescription } from './ui/alert';
import { useApi } from '../hooks/useApi';
import employeeService, { Employee, CreateEmployeeData } from '../services/employee';
import { formatters } from '../services/utils';

export function EmployeesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: employees,
    loading: employeesLoading,
    error: employeesError,
    refetch: refetchEmployees
  } = useApi(() => employeeService.getAll());

  const [newEmployee, setNewEmployee] = useState<CreateEmployeeData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    position: '',
    latitude: 0,
    longitude: 0,
    status: 'active'
  });

  const [editEmployee, setEditEmployee] = useState<CreateEmployeeData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    department: '',
    position: '',
    latitude: 0,
    longitude: 0,
    status: 'active'
  });

  const filteredEmployees = employees?.data?.filter(emp => {
    const searchTermLower = (searchTerm || '').toLowerCase();
    return (
      formatters.getFullName(emp.firstName, emp.lastName).toLowerCase().includes(searchTermLower) ||
      (emp.email || '').toLowerCase().includes(searchTermLower) ||
      (emp.department || '').toLowerCase().includes(searchTermLower)
    );
  }) || [];

  const activeCount = employees?.data?.filter(e => e.status === 'active').length || 0;
  const inactiveCount = employees?.data?.filter(e => e.status === 'inactive').length || 0;

  const handleCreateEmployee = async () => {
    try {
      setIsSubmitting(true);
      await employeeService.create(newEmployee);
      await refetchEmployees();
      setDialogOpen(false);
      setNewEmployee({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        address: '',
        department: '',
        position: '',
        latitude: 0,
        longitude: 0,
        status: 'active'
      });
    } catch (error) {
      console.error('Error creating employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateEmployee = async (id: number, updates: Partial<CreateEmployeeData>) => {
    try {
      setIsSubmitting(true);
      await employeeService.update(id, updates);
      await refetchEmployees();
      setEditingEmployee(null);
    } catch (error) {
      console.error('Error updating employee:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteEmployee = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este empleado?')) {
      return;
    }

    try {
      await employeeService.delete(id);
      await refetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  if (employeesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Cargando empleados...</span>
      </div>
    );
  }

  if (employeesError) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Error al cargar empleados: {employeesError}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4" 
              onClick={() => refetchEmployees()}
            >
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Empleados</p>
                <p className="text-3xl text-gray-900">{employees?.data?.length || 0}</p>
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
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input 
                        id="firstName" 
                        placeholder="Juan" 
                        value={newEmployee.firstName}
                        onChange={(e) => setNewEmployee({...newEmployee, firstName: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input 
                        id="lastName" 
                        placeholder="Pérez" 
                        value={newEmployee.lastName}
                        onChange={(e) => setNewEmployee({...newEmployee, lastName: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Correo Electrónico</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="juan.perez@empresa.com" 
                        value={newEmployee.email}
                        onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input 
                        id="phone" 
                        placeholder="+57 300 123 4567" 
                        value={newEmployee.phone}
                        onChange={(e) => setNewEmployee({...newEmployee, phone: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input 
                        id="address" 
                        placeholder="Calle 72 #54-46, Barranquilla" 
                        value={newEmployee.address}
                        onChange={(e) => setNewEmployee({...newEmployee, address: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="department">Departamento</Label>
                      <Select 
                        value={newEmployee.department} 
                        onValueChange={(value) => setNewEmployee({...newEmployee, department: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ventas">Ventas</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="RRHH">RRHH</SelectItem>
                          <SelectItem value="Finanzas">Finanzas</SelectItem>
                          <SelectItem value="Operaciones">Operaciones</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="position">Cargo</Label>
                      <Input 
                        id="position" 
                        placeholder="Analista, Gerente, etc." 
                        value={newEmployee.position}
                        onChange={(e) => setNewEmployee({...newEmployee, position: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Estado</Label>
                      <Select 
                        value={newEmployee.status} 
                        onValueChange={(value: 'active' | 'inactive') => setNewEmployee({...newEmployee, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="inactive">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setDialogOpen(false)}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      className="bg-blue-700 hover:bg-blue-800" 
                      onClick={handleCreateEmployee}
                      disabled={isSubmitting || !newEmployee.firstName || !newEmployee.email}
                    >
                      {isSubmitting && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                      Guardar Empleado
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Edit Employee Dialog */}
              <Dialog open={!!editingEmployee} onOpenChange={(open) => !open && setEditingEmployee(null)}>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Edit className="w-5 h-5" />
                      Editar Empleado
                    </DialogTitle>
                    <DialogDescription>
                      Actualiza la información del empleado
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-firstName">Nombre</Label>
                      <Input 
                        id="edit-firstName" 
                        placeholder="Juan" 
                        value={editEmployee.firstName}
                        onChange={(e) => setEditEmployee({...editEmployee, firstName: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-lastName">Apellido</Label>
                      <Input 
                        id="edit-lastName" 
                        placeholder="Pérez" 
                        value={editEmployee.lastName}
                        onChange={(e) => setEditEmployee({...editEmployee, lastName: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-email">Correo Electrónico</Label>
                      <Input 
                        id="edit-email" 
                        type="email" 
                        placeholder="juan.perez@empresa.com" 
                        value={editEmployee.email}
                        onChange={(e) => setEditEmployee({...editEmployee, email: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-phone">Teléfono</Label>
                      <Input 
                        id="edit-phone" 
                        placeholder="+57 300 123 4567" 
                        value={editEmployee.phone}
                        onChange={(e) => setEditEmployee({...editEmployee, phone: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-address">Dirección</Label>
                      <Input 
                        id="edit-address" 
                        placeholder="Calle 72 #54-46, Barranquilla" 
                        value={editEmployee.address}
                        onChange={(e) => setEditEmployee({...editEmployee, address: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-department">Departamento</Label>
                      <Select 
                        value={editEmployee.department} 
                        onValueChange={(value) => setEditEmployee({...editEmployee, department: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Ventas">Ventas</SelectItem>
                          <SelectItem value="Marketing">Marketing</SelectItem>
                          <SelectItem value="IT">IT</SelectItem>
                          <SelectItem value="RRHH">RRHH</SelectItem>
                          <SelectItem value="Finanzas">Finanzas</SelectItem>
                          <SelectItem value="Operaciones">Operaciones</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-position">Cargo</Label>
                      <Input 
                        id="edit-position" 
                        placeholder="Analista, Gerente, etc." 
                        value={editEmployee.position}
                        onChange={(e) => setEditEmployee({...editEmployee, position: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-status">Estado</Label>
                      <Select 
                        value={editEmployee.status} 
                        onValueChange={(value: 'active' | 'inactive') => setEditEmployee({...editEmployee, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Activo</SelectItem>
                          <SelectItem value="inactive">Inactivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingEmployee(null)}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      className="bg-blue-700 hover:bg-blue-800" 
                      onClick={() => editingEmployee && handleUpdateEmployee(editingEmployee.id, editEmployee)}
                      disabled={isSubmitting || !editEmployee.firstName || !editEmployee.email}
                    >
                      {isSubmitting && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                      Actualizar Empleado
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
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell>EMP-{emp.id.toString().padStart(3, '0')}</TableCell>
                    <TableCell>{formatters.getFullName(emp.firstName, emp.lastName)}</TableCell>
                    <TableCell>{emp.email || 'N/A'}</TableCell>
                    <TableCell>{emp.phone || 'N/A'}</TableCell>
                    <TableCell className="max-w-xs truncate">{emp.address || 'N/A'}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{emp.department || 'N/A'}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={emp.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}
                      >
                        {formatters.employeeStatus(emp.status)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setEditingEmployee(emp);
                            setEditEmployee({
                              firstName: emp.firstName,
                              lastName: emp.lastName,
                              email: emp.email,
                              phone: emp.phone,
                              address: emp.address,
                              department: emp.department,
                              position: emp.position,
                              latitude: emp.latitude,
                              longitude: emp.longitude,
                              status: emp.status
                            });
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEmployee(emp.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                    {searchTerm ? 'No se encontraron empleados que coincidan con la búsqueda' : 'No hay empleados registrados'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
