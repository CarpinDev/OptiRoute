import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { Alert, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import { MapPin, Building2, Car, Star, Pencil, Trash2, Plus } from 'lucide-react';
import { Location, CreateLocationDto, UpdateLocationDto, locationService } from '../services/locationService';

const LocationsPage = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [formData, setFormData] = useState<CreateLocationDto>({
    name: '',
    address: '',
    latitude: 0,
    longitude: 0,
    type: 'home_base',
    description: '',
    isActive: true,
    isDefault: false
  });
  const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const data = await locationService.getAll();
      setLocations(data);
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al cargar las ubicaciones' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      await locationService.create(formData);
      setAlert({ type: 'success', message: 'Ubicación creada exitosamente' });
      setCreateDialogOpen(false);
      resetForm();
      fetchLocations();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al crear la ubicación' });
    }
  };

  const handleEdit = async () => {
    if (!selectedLocation) return;

    try {
      await locationService.update(selectedLocation.id, formData);
      setAlert({ type: 'success', message: 'Ubicación actualizada exitosamente' });
      setEditDialogOpen(false);
      resetForm();
      fetchLocations();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al actualizar la ubicación' });
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await locationService.setAsDefault(id);
      setAlert({ type: 'success', message: 'Ubicación establecida como predeterminada' });
      fetchLocations();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al establecer como predeterminada' });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Está seguro de que desea eliminar esta ubicación?')) return;

    try {
      await locationService.delete(id);
      setAlert({ type: 'success', message: 'Ubicación eliminada exitosamente' });
      fetchLocations();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al eliminar la ubicación' });
    }
  };

  const handleSeedDefault = async () => {
    try {
      await locationService.seedDefault();
      setAlert({ type: 'success', message: 'Ubicaciones predeterminadas creadas' });
      fetchLocations();
    } catch (error) {
      setAlert({ type: 'error', message: 'Error al crear ubicaciones predeterminadas' });
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      latitude: 0,
      longitude: 0,
      type: 'home_base',
      description: '',
      isActive: true,
      isDefault: false
    });
    setSelectedLocation(null);
  };

  const openEditDialog = (location: Location) => {
    setSelectedLocation(location);
    setFormData({
      name: location.name,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      type: location.type,
      description: location.description || '',
      isActive: location.isActive,
      isDefault: location.isDefault
    });
    setEditDialogOpen(true);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home_base': return <Car className="h-4 w-4" />;
      case 'office': return <Building2 className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case 'home_base': return 'Centro de Vehículos';
      case 'office': return 'Oficina';
      default: return 'Punto Intermedio';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'home_base': return 'bg-blue-100 text-blue-800';
      case 'office': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando ubicaciones...</p>
        </div>
      </div>
    );
  }

  const homeBaseLocations = locations.filter(l => l.type === 'home_base');
  const officeLocations = locations.filter(l => l.type === 'office');
  const waypointLocations = locations.filter(l => l.type === 'waypoint');

  return (
    <div className="space-y-6">
      {alert && (
        <Alert className={alert.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
          <AlertDescription className={alert.type === 'error' ? 'text-red-700' : 'text-green-700'}>
            {alert.message}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Configuración de Ubicaciones</h1>
          <p className="text-gray-600">Gestiona los puntos de inicio, destino y paradas intermedias para las rutas</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleSeedDefault}
          >
            Crear Predeterminadas
          </Button>
          <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Ubicación
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Crear Nueva Ubicación</DialogTitle>
                <DialogDescription>
                  Agrega una nueva ubicación para usar en las rutas
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ej: Centro de Vehículos Principal"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Ej: Calle 26 #13-19, Bogotá"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="grid gap-2">
                    <Label htmlFor="latitude">Latitud</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="longitude">Longitud</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="type">Tipo</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="home_base">Centro de Vehículos</SelectItem>
                      <SelectItem value="office">Oficina</SelectItem>
                      <SelectItem value="waypoint">Punto Intermedio</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción (opcional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descripción adicional de la ubicación"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    id="isDefault"
                    type="checkbox"
                    checked={formData.isDefault}
                    onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                    className="rounded border-gray-300"
                  />
                  <Label htmlFor="isDefault">Establecer como predeterminada</Label>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleCreate}>
                  Crear Ubicación
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Centros de Vehículos */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <Car className="h-5 w-5 mr-2" />
          Centros de Vehículos (Punto de Inicio)
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {homeBaseLocations.map((location) => (
            <Card key={location.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{location.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    {location.isDefault && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                    <Badge className={getTypeColor(location.type)}>
                      {getTypeName(location.type)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                <p className="text-xs text-gray-500 mb-3">
                  Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                </p>
                {location.description && (
                  <p className="text-sm text-gray-600 mb-3">{location.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(location)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(location.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  {!location.isDefault && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSetDefault(location.id)}
                      className="text-xs"
                    >
                      Marcar como predeterminada
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {homeBaseLocations.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-gray-500">No hay centros de vehículos configurados</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <Separator />

      {/* Oficinas */}
      <div>
        <h2 className="text-lg font-semibold mb-3 flex items-center">
          <Building2 className="h-5 w-5 mr-2" />
          Oficinas (Punto de Destino)
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {officeLocations.map((location) => (
            <Card key={location.id} className="relative">
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{location.name}</CardTitle>
                  <div className="flex items-center gap-1">
                    {location.isDefault && (
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    )}
                    <Badge className={getTypeColor(location.type)}>
                      {getTypeName(location.type)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                <p className="text-xs text-gray-500 mb-3">
                  Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                </p>
                {location.description && (
                  <p className="text-sm text-gray-600 mb-3">{location.description}</p>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => openEditDialog(location)}
                    >
                      <Pencil className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(location.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                  {!location.isDefault && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleSetDefault(location.id)}
                      className="text-xs"
                    >
                      Marcar como predeterminada
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          {officeLocations.length === 0 && (
            <Card className="col-span-full">
              <CardContent className="flex items-center justify-center py-8">
                <p className="text-gray-500">No hay oficinas configuradas</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {waypointLocations.length > 0 && (
        <>
          <Separator />
          {/* Puntos Intermedios */}
          <div>
            <h2 className="text-lg font-semibold mb-3 flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Puntos Intermedios
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {waypointLocations.map((location) => (
                <Card key={location.id} className="relative">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{location.name}</CardTitle>
                      <Badge className={getTypeColor(location.type)}>
                        {getTypeName(location.type)}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-2">{location.address}</p>
                    <p className="text-xs text-gray-500 mb-3">
                      Lat: {location.latitude.toFixed(6)}, Lng: {location.longitude.toFixed(6)}
                    </p>
                    {location.description && (
                      <p className="text-sm text-gray-600 mb-3">{location.description}</p>
                    )}
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(location)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(location.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Dialog de Edición */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Editar Ubicación</DialogTitle>
            <DialogDescription>
              Modifica la información de la ubicación
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Nombre</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-address">Dirección</Label>
              <Input
                id="edit-address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="grid gap-2">
                <Label htmlFor="edit-latitude">Latitud</Label>
                <Input
                  id="edit-latitude"
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-longitude">Longitud</Label>
                <Input
                  id="edit-longitude"
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-type">Tipo</Label>
              <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="home_base">Centro de Vehículos</SelectItem>
                  <SelectItem value="office">Oficina</SelectItem>
                  <SelectItem value="waypoint">Punto Intermedio</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-description">Descripción (opcional)</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="flex items-center space-x-2">
              <input
                id="edit-isDefault"
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
                className="rounded border-gray-300"
              />
              <Label htmlFor="edit-isDefault">Establecer como predeterminada</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit}>
              Actualizar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LocationsPage;