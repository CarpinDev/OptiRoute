import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Truck, 
  Users, 
  Fuel, 
  Calendar, 
  Plus, 
  Download,
  AlertCircle,
  RefreshCw,
  Search,
  Edit,
  Trash2,
  MapPin
} from 'lucide-react';
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
import vehicleService, { Vehicle, CreateVehicleData } from '../services/vehicle';
import { formatters } from '../services/utils';

export function VehiclesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    data: vehicles,
    loading: vehiclesLoading,
    error: vehiclesError,
    refetch: refetchVehicles
  } = useApi(() => vehicleService.getAll());

  const [newVehicle, setNewVehicle] = useState<CreateVehicleData>({
    licensePlate: '',
    model: '',
    brand: '',
    year: new Date().getFullYear(),
    capacity: 0,
    type: 'bus',
    status: 'available'
  });

  const [editVehicle, setEditVehicle] = useState<CreateVehicleData>({
    licensePlate: '',
    model: '',
    brand: '',
    year: new Date().getFullYear(),
    capacity: 0,
    type: 'bus',
    status: 'available'
  });

  const filteredVehicles = vehicles?.data?.filter(vehicle => {
    const searchTermLower = (searchTerm || '').toLowerCase();
    return (
      (vehicle.licensePlate || '').toLowerCase().includes(searchTermLower) ||
      (vehicle.model || '').toLowerCase().includes(searchTermLower) ||
      (vehicle.type || '').toLowerCase().includes(searchTermLower)
    );
  }) || [];

  const disponibles = vehicles?.data?.filter(v => v.status === 'available').length || 0;
  const enRuta = vehicles?.data?.filter(v => v.status === 'in_route').length || 0;
  const mantenimiento = vehicles?.data?.filter(v => v.status === 'maintenance').length || 0;

  const handleCreateVehicle = async () => {
    try {
      setIsSubmitting(true);
      await vehicleService.create(newVehicle);
      await refetchVehicles();
      setDialogOpen(false);
      setNewVehicle({
        licensePlate: '',
        model: '',
        brand: '',
        year: new Date().getFullYear(),
        capacity: 0,
        type: 'bus',
        status: 'available'
      });
    } catch (error) {
      console.error('Error creating vehicle:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el vehículo';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateVehicle = async (id: number, updates: Partial<CreateVehicleData>) => {
    try {
      setIsSubmitting(true);
      await vehicleService.update(id, updates);
      await refetchVehicles();
      setEditingVehicle(null);
    } catch (error) {
      console.error('Error updating vehicle:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el vehículo';
      alert(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este vehículo?')) {
      return;
    }

    try {
      await vehicleService.delete(id);
      await refetchVehicles();
    } catch (error) {
      console.error('Error deleting vehicle:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el vehículo';
      alert(errorMessage);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'in_use': return 'bg-orange-500';
      case 'maintenance': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800';
      case 'in_use': return 'bg-orange-100 text-orange-800';
      case 'maintenance': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (vehiclesLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Cargando vehículos...</span>
      </div>
    );
  }

  if (vehiclesError) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Error al cargar vehículos: {vehiclesError}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4" 
              onClick={() => refetchVehicles()}
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Vehículos</h1>
          <p className="text-gray-600 mt-2">Administra la flota de vehículos OptiRoute</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => refetchVehicles()}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </Button>
      </div>

      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Vehículos</p>
                <p className="text-3xl text-gray-900">{vehicles?.data?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Disponibles</p>
                <p className="text-3xl text-gray-900">{disponibles}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En Ruta</p>
                <p className="text-3xl text-gray-900">{enRuta}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-orange-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Mantenimiento</p>
                <p className="text-3xl text-gray-900">{mantenimiento}</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <Truck className="w-6 h-6 text-red-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vehicle Management */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <CardTitle>Lista de Vehículos</CardTitle>
            <div className="flex gap-2">
              {/* <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button> */}
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-blue-700 hover:bg-blue-800">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Vehículo
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Truck className="w-5 h-5" />
                      Agregar Nuevo Vehículo
                    </DialogTitle>
                    <DialogDescription>
                      Registra un nuevo vehículo en la flota
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="plate">Placa</Label>
                      <Input 
                        id="plate" 
                        placeholder="ABC-123" 
                        value={newVehicle.licensePlate}
                        onChange={(e) => setNewVehicle({...newVehicle, licensePlate: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="model">Modelo</Label>
                      <Input 
                        id="model" 
                        placeholder="Mercedes Benz Sprinter" 
                        value={newVehicle.model}
                        onChange={(e) => setNewVehicle({...newVehicle, model: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="capacity">Capacidad</Label>
                      <Input 
                        id="capacity" 
                        type="number" 
                        placeholder="45" 
                        value={newVehicle.capacity || ''}
                        onChange={(e) => setNewVehicle({...newVehicle, capacity: parseInt(e.target.value) || 0})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="type">Tipo</Label>
                      <Select 
                        value={newVehicle.type} 
                        onValueChange={(value: 'bus' | 'van' | 'minibus') => setNewVehicle({...newVehicle, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bus">Bus</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="minibus">Minibus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="brand">Marca</Label>
                      <Input 
                        id="brand" 
                        placeholder="Mercedes Benz, Ford, etc." 
                        value={newVehicle.brand}
                        onChange={(e) => setNewVehicle({...newVehicle, brand: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="year">Año</Label>
                      <Input 
                        id="year" 
                        type="number" 
                        placeholder="2023" 
                        value={newVehicle.year || ''}
                        onChange={(e) => setNewVehicle({...newVehicle, year: parseInt(e.target.value) || new Date().getFullYear()})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="status">Estado</Label>
                      <Select 
                        value={newVehicle.status} 
                        onValueChange={(value: 'available' | 'in_route' | 'maintenance' | 'out_of_service') => setNewVehicle({...newVehicle, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Disponible</SelectItem>
                          <SelectItem value="in_route">En Ruta</SelectItem>
                          <SelectItem value="maintenance">Mantenimiento</SelectItem>
                          <SelectItem value="out_of_service">Fuera de Servicio</SelectItem>
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
                      onClick={handleCreateVehicle}
                      disabled={isSubmitting || !newVehicle.licensePlate || !newVehicle.model || !newVehicle.brand || !newVehicle.capacity}
                    >
                      {isSubmitting && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                      Guardar Vehículo
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              {/* Edit Vehicle Dialog */}
              <Dialog open={!!editingVehicle} onOpenChange={(open) => !open && setEditingVehicle(null)}>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Edit className="w-5 h-5" />
                      Editar Vehículo
                    </DialogTitle>
                    <DialogDescription>
                      Actualiza la información del vehículo
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-licensePlate">Placa</Label>
                      <Input 
                        id="edit-licensePlate" 
                        placeholder="ABC-123" 
                        value={editVehicle.licensePlate}
                        onChange={(e) => setEditVehicle({...editVehicle, licensePlate: e.target.value.toUpperCase()})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-model">Modelo</Label>
                      <Input 
                        id="edit-model" 
                        placeholder="Sprinter" 
                        value={editVehicle.model}
                        onChange={(e) => setEditVehicle({...editVehicle, model: e.target.value})}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-brand">Marca</Label>
                      <Input 
                        id="edit-brand" 
                        placeholder="Mercedes-Benz" 
                        value={editVehicle.brand}
                        onChange={(e) => setEditVehicle({...editVehicle, brand: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="edit-year">Año</Label>
                        <Input 
                          id="edit-year" 
                          type="number" 
                          min="2000"
                          max={new Date().getFullYear() + 1}
                          value={editVehicle.year}
                          onChange={(e) => setEditVehicle({...editVehicle, year: parseInt(e.target.value) || new Date().getFullYear()})}
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="edit-capacity">Capacidad</Label>
                        <Input 
                          id="edit-capacity" 
                          type="number" 
                          min="1"
                          placeholder="15"
                          value={editVehicle.capacity || ''}
                          onChange={(e) => setEditVehicle({...editVehicle, capacity: parseInt(e.target.value) || 0})}
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-type">Tipo</Label>
                      <Select 
                        value={editVehicle.type} 
                        onValueChange={(value: 'bus' | 'van' | 'minibus') => setEditVehicle({...editVehicle, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bus">Bus</SelectItem>
                          <SelectItem value="van">Van</SelectItem>
                          <SelectItem value="minibus">Minibus</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="edit-status">Estado</Label>
                      <Select 
                        value={editVehicle.status} 
                        onValueChange={(value: 'available' | 'in_route' | 'maintenance' | 'out_of_service') => setEditVehicle({...editVehicle, status: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="available">Disponible</SelectItem>
                          <SelectItem value="in_route">En Ruta</SelectItem>
                          <SelectItem value="maintenance">Mantenimiento</SelectItem>
                          <SelectItem value="out_of_service">Fuera de Servicio</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button 
                      variant="outline" 
                      onClick={() => setEditingVehicle(null)}
                      disabled={isSubmitting}
                    >
                      Cancelar
                    </Button>
                    <Button 
                      className="bg-blue-700 hover:bg-blue-800" 
                      onClick={() => editingVehicle && handleUpdateVehicle(editingVehicle.id, editVehicle)}
                      disabled={isSubmitting || !editVehicle.licensePlate || !editVehicle.model || !editVehicle.brand || !editVehicle.capacity}
                    >
                      {isSubmitting && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
                      Actualizar Vehículo
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
                placeholder="Buscar por placa, modelo o tipo..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredVehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <div className={`h-2 ${getStatusColor(vehicle.status)}`} />
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <Truck className="w-6 h-6 text-gray-700" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{vehicle.model || 'N/A'}</p>
                          <p className="text-sm text-gray-600">{vehicle.licensePlate || 'N/A'}</p>
                        </div>
                      </div>
                      <Badge className={getStatusBadgeColor(vehicle.status)}>
                        {formatters.vehicleStatus(vehicle.status)}
                      </Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Capacidad
                        </span>
                        <span className="font-medium">{vehicle.capacity} personas</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Tipo</span>
                        <span className="font-medium">{vehicle.type}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Creado
                        </span>
                        <span className="font-medium">{formatters.date(vehicle.createdAt)}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingVehicle(vehicle);
                          setEditVehicle({
                            licensePlate: vehicle.licensePlate,
                            model: vehicle.model,
                            brand: vehicle.brand,
                            year: vehicle.year,
                            capacity: vehicle.capacity,
                            type: vehicle.type,
                            status: vehicle.status
                          });
                        }}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteVehicle(vehicle.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Truck className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchTerm ? 'No se encontraron vehículos' : 'No hay vehículos registrados'}
              </h3>
              <p className="mb-4">
                {searchTerm 
                  ? 'Intenta con otros términos de búsqueda' 
                  : 'Comienza agregando el primer vehículo a la flota'}
              </p>
              {!searchTerm && (
                <Button 
                  className="bg-blue-700 hover:bg-blue-800"
                  onClick={() => setDialogOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Primer Vehículo
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
