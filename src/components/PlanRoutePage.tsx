import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Badge } from './ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { 
  Calendar, 
  MapPin, 
  Truck, 
  Users, 
  AlertCircle, 
  Sparkles,
  RefreshCw,
  Play,
  Zap,
  Route,
  Building2,
  Car
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { useApi } from '../hooks/useApi';
import routeService, { CreateRouteData, Route as RouteData } from '../services/route';
import employeeService from '../services/employee';
import vehicleService from '../services/vehicle';
import { locationService, Location } from '../services/locationService';
import { formatters } from '../services/utils';

export function PlanRoutePage() {
  const navigate = useNavigate();
  const [selectedEmployees, setSelectedEmployees] = useState<number[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<number>(0);
  const [selectedHomeBaseId, setSelectedHomeBaseId] = useState<number>(0);
  const [selectedDestinationId, setSelectedDestinationId] = useState<number>(0);
  const [routeName, setRouteName] = useState('');
  const [routeDate, setRouteDate] = useState(new Date().toISOString().split('T')[0]);
  const [routeShift, setRouteShift] = useState<'morning' | 'afternoon' | 'evening'>('morning');
  const [departureTime, setDepartureTime] = useState('07:00');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizedRoute, setOptimizedRoute] = useState<RouteData | null>(null);

  const {
    data: employees,
    loading: employeesLoading,
    error: employeesError
  } = useApi(() => employeeService.getAll());

  const {
    data: vehicles,
    loading: vehiclesLoading,
    error: vehiclesError
  } = useApi(() => vehicleService.getAll());

  const {
    data: homeBaseLocations,
    loading: homeBaseLoading,
    error: homeBaseError
  } = useApi(() => locationService.getByType('home_base'));

  const {
    data: destinationLocations,
    loading: destinationLoading,
    error: destinationError
  } = useApi(() => locationService.getByType('office'));

  const activeEmployees = employees?.data?.filter(e => e.status === 'active') || [];
  const availableVehicles = vehicles?.data?.filter(v => v.status === 'available') || [];

  const handleEmployeeToggle = (employeeId: number) => {
    setSelectedEmployees((prev: number[]) => 
      prev.includes(employeeId)
        ? prev.filter((id: number) => id !== employeeId)
        : [...prev, employeeId]
    );
    // Clear optimized route when selection changes
    setOptimizedRoute(null);
  };

  const handleOptimizeRoute = async () => {
    if (selectedEmployees.length === 0 || !selectedVehicleId) {
      alert('Por favor selecciona empleados y un vehículo');
      return;
    }

    const routeData: CreateRouteData = {
      name: routeName || `Ruta ${new Date().toLocaleDateString()}`,
      date: routeDate,
      shift: routeShift,
      homeBase: 'main',
      vehicleId: selectedVehicleId,
      employeeIds: selectedEmployees,
      homeBaseLocationId: selectedHomeBaseId || undefined,
      destinationLocationId: selectedDestinationId || undefined,
      startTime: departureTime
    };

    try {
      setIsOptimizing(true);
      const result = await routeService.create(routeData);
      setOptimizedRoute(result);
    } catch (error) {
      console.error('Error optimizing route:', error);
      alert('Error al optimizar la ruta. Intenta de nuevo.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleCreateRoute = async () => {
    if (!optimizedRoute) {
      alert('Primero debe optimizar la ruta');
      return;
    }

    try {
      // La ruta ya fue creada y optimizada en handleOptimizeRoute
      alert('Ruta creada exitosamente');
      navigate('/dashboard/ruta-generada', { state: { route: optimizedRoute } });
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar la ruta. Intenta de nuevo.');
    }
  };

  const selectedVehicle = availableVehicles.find(v => v.id === selectedVehicleId);

  if (employeesLoading || vehiclesLoading || homeBaseLoading || destinationLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Cargando datos...</span>
      </div>
    );
  }

  if (employeesError || vehiclesError || homeBaseError || destinationError) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Error al cargar los datos. Verifica que existan empleados y vehículos registrados.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Planificar Nueva Ruta</h1>
        <p className="text-gray-600">Optimización automática usando algoritmo TSP para la ruta más eficiente</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="w-5 h-5" />
                Información de la Ruta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="routeName">Nombre de la Ruta</Label>
                  <Input 
                    id="routeName"
                    placeholder="Ruta Matutina Centro"
                    value={routeName}
                    onChange={(e) => setRouteName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="departureTime">Hora de Salida</Label>
                  <Input 
                    id="departureTime"
                    type="datetime-local"
                    value={departureTime}
                    onChange={(e) => setDepartureTime(e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Configuración de Ubicaciones
              </CardTitle>
              <CardDescription>
                Configura los puntos de inicio y destino de la ruta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="homeBase" className="flex items-center gap-2">
                    <Car className="w-4 h-4" />
                    Centro de Vehículos (Inicio)
                  </Label>
                  {homeBaseLocations && homeBaseLocations.length > 0 ? (
                    <Select 
                      value={selectedHomeBaseId.toString()} 
                      onValueChange={(value) => setSelectedHomeBaseId(parseInt(value) || 0)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona punto de inicio" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Usar ubicación predeterminada</SelectItem>
                        {homeBaseLocations.map((location) => (
                          <SelectItem key={location.id} value={location.id.toString()}>
                            <div className="flex items-center gap-2">
                              <Car className="w-4 h-4" />
                              <span>{location.name}</span>
                              {location.isDefault && <Badge variant="secondary">Predeterminada</Badge>}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No hay centros de vehículos configurados. 
                        <Button variant="link" className="p-0 h-auto" onClick={() => window.open('/dashboard/ubicaciones', '_blank')}>
                          Configurar ubicaciones
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="destination" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    Oficina (Destino)
                  </Label>
                  {destinationLocations && destinationLocations.length > 0 ? (
                    <Select 
                      value={selectedDestinationId.toString()} 
                      onValueChange={(value) => setSelectedDestinationId(parseInt(value) || 0)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona punto de destino" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Usar ubicación predeterminada</SelectItem>
                        {destinationLocations.map((location) => (
                          <SelectItem key={location.id} value={location.id.toString()}>
                            <div className="flex items-center gap-2">
                              <Building2 className="w-4 h-4" />
                              <span>{location.name}</span>
                              {location.isDefault && <Badge variant="secondary">Predeterminada</Badge>}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        No hay oficinas configuradas. 
                        <Button variant="link" className="p-0 h-auto" onClick={() => window.open('/dashboard/ubicaciones', '_blank')}>
                          Configurar ubicaciones
                        </Button>
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </div>
              {/* Ubicaciones seleccionadas preview */}
              {(selectedHomeBaseId || selectedDestinationId) && (
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <h4 className="text-sm font-medium text-blue-900 mb-2">Ubicaciones Configuradas:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                    {selectedHomeBaseId > 0 && (
                      <div className="flex items-center gap-2 text-blue-700">
                        <Car className="w-3 h-3" />
                        <span>Inicio: {homeBaseLocations?.find(l => l.id === selectedHomeBaseId)?.name}</span>
                      </div>
                    )}
                    {selectedDestinationId > 0 && (
                      <div className="flex items-center gap-2 text-blue-700">
                        <Building2 className="w-3 h-3" />
                        <span>Destino: {destinationLocations?.find(l => l.id === selectedDestinationId)?.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Vehicle Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Selección de Vehículo
              </CardTitle>
              <CardDescription>
                Elige el vehículo que realizará la ruta
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availableVehicles.length > 0 ? (
                <Select value={selectedVehicleId.toString()} onValueChange={(value) => setSelectedVehicleId(parseInt(value))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un vehículo" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableVehicles.map((vehicle) => (
                      <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4" />
                          <span>{vehicle.model} - {vehicle.licensePlate}</span>
                          <Badge variant="outline" className="ml-2">
                            Cap: {vehicle.capacity}
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No hay vehículos disponibles. Registra vehículos primero.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Employee Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Selección de Empleados ({selectedEmployees.length} seleccionados)
              </CardTitle>
              <CardDescription>
                Selecciona los empleados que serán recogidos en esta ruta
              </CardDescription>
            </CardHeader>
            <CardContent>
              {activeEmployees.length > 0 ? (
                <div className="max-h-80 overflow-y-auto space-y-3">
                  {activeEmployees.map((employee) => (
                    <div 
                      key={employee.id} 
                      className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleEmployeeToggle(employee.id)}
                    >
                      <Checkbox 
                        checked={selectedEmployees.includes(employee.id)}
                        onChange={() => handleEmployeeToggle(employee.id)}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {formatters.getFullName(employee.firstName, employee.lastName)}
                        </p>
                        <p className="text-sm text-gray-600 truncate">
                          <MapPin className="w-3 h-3 inline mr-1" />
                          {employee.address}
                        </p>
                      </div>
                      <Badge variant="outline" className="shrink-0">
                        {employee.department}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No hay empleados activos disponibles.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Summary and Actions */}
        <div className="space-y-6">
          {/* Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">Empleados</span>
                <span className="font-medium">{selectedEmployees.length}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b">
                <span className="text-sm text-gray-600">Vehículo</span>
                <span className="font-medium">
                  {selectedVehicle ? selectedVehicle.model : 'No seleccionado'}
                </span>
              </div>
              {selectedVehicle && (
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-sm text-gray-600">Capacidad</span>
                  <span className="font-medium">
                    {selectedEmployees.length}/{selectedVehicle.capacity}
                  </span>
                </div>
              )}
              {selectedVehicle && selectedEmployees.length > selectedVehicle.capacity && (
                <Alert className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-red-600">
                    Excede la capacidad del vehículo
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Optimization Result */}
          {optimizedRoute && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800 flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Ruta Optimizada
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Distancia Total</span>
                    <span className="font-medium text-green-800">
                      {formatters.distance(optimizedRoute.totalDistance)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Tiempo Estimado</span>
                    <span className="font-medium text-green-800">
                      {formatters.duration(optimizedRoute.estimatedDuration)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-green-700">Paradas</span>
                    <span className="font-medium text-green-800">
                      {optimizedRoute.stops.length}
                    </span>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-green-800 mb-2">Orden de Recorrido:</h4>
                    <div className="space-y-1">
                      {optimizedRoute.stops.map((stop, index) => (
                        <div key={index} className="text-xs text-green-700">
                          {index + 1}. {stop.address}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {!optimizedRoute ? (
                  <Button 
                    onClick={handleOptimizeRoute}
                    disabled={
                      isOptimizing || 
                      selectedEmployees.length === 0 || 
                      !selectedVehicleId ||
                      (selectedVehicle && selectedEmployees.length > selectedVehicle.capacity)
                    }
                    className="w-full bg-orange-600 hover:bg-orange-700"
                    size="lg"
                  >
                    {isOptimizing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Optimizando...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Optimizar Ruta
                      </>
                    )}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleCreateRoute}
                    className="w-full bg-green-600 hover:bg-green-700"
                    size="lg"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Crear Ruta
                  </Button>
                )}
                
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard')}
                  className="w-full"
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Algorithm Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                Algoritmo TSP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-blue-700">
                Utilizamos el Problema del Viajante (TSP) para calcular automáticamente 
                la ruta más eficiente que minimiza la distancia total y el tiempo de viaje.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
