import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Users,
  Download,
  FileText,
  Send,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { useApi } from '../hooks/useApi';
import routeService, { Route } from '../services/route';
import { formatters } from '../services/utils';

export function GeneratedRoutePage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { routeId } = useParams();
  
  // Get route from navigation state or fetch by ID
  const [routeData, setRouteData] = useState<Route | null>(location.state?.route || null);
  
  const {
    data: fetchedRoute,
    loading: routeLoading,
    error: routeError,
    refetch: refetchRoute
  } = useApi(
    () => routeId ? routeService.getById(parseInt(routeId)) : Promise.resolve(null),
    [routeId]
  );

  useEffect(() => {
    if (fetchedRoute && !routeData) {
      setRouteData(fetchedRoute);
    }
  }, [fetchedRoute, routeData]);

  // If no route data and no routeId, redirect back
  useEffect(() => {
    if (!routeData && !routeId && !routeLoading) {
      navigate('/dashboard/rutas');
    }
  }, [routeData, routeId, routeLoading, navigate]);

  const openInGoogleMaps = () => {
    // Priorizar stops si están disponibles, sino usar assignments como respaldo
    if (routeData?.stops?.length && routeData.stops.length > 0) {
      // Usar direcciones de stops (ubicaciones configurables)
      const orderedStops = [...routeData.stops].sort((a, b) => a.order - b.order);
      
      const firstStop = orderedStops[0];
      const origin = encodeURIComponent(firstStop.address);
      
      const lastStop = orderedStops[orderedStops.length - 1];
      const destination = encodeURIComponent(lastStop.address);
      
      const waypoints = orderedStops
        .slice(1, -1)
        .map(stop => encodeURIComponent(stop.address))
        .join('|');
      
      let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
      if (waypoints) {
        url += `&waypoints=${waypoints}`;
      }
      
      window.open(url, '_blank');
    } else if (routeData?.assignments?.length && routeData.assignments.length > 0) {
      // Respaldo: usar direcciones de assignments (método anterior)
      const addresses = routeData.assignments.map(assignment => assignment.employee.address);
      const origin = encodeURIComponent(addresses[0]); // Primera dirección como origen
      const destination = encodeURIComponent(routeData.homeBase || 'Sede Principal');
      
      // Si hay más de una dirección, las intermedias van como waypoints
      const waypoints = addresses.length > 1 
        ? addresses.slice(1).map(address => encodeURIComponent(address)).join('|')
        : '';
      
      let url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}`;
      if (waypoints) {
        url += `&waypoints=${waypoints}`;
      }
      
      window.open(url, '_blank');
    } else {
      alert('No hay datos de ruta disponibles para mostrar en Google Maps');
    }
  };

  if (routeLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Cargando ruta...</span>
      </div>
    );
  }

  if (routeError || (!routeData && !routeLoading)) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {routeError || 'No se pudo cargar la información de la ruta'}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4" 
              onClick={() => routeId ? refetchRoute() : navigate('/dashboard/rutas')}
            >
              {routeId ? 'Reintentar' : 'Volver a Rutas'}
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!routeData) {
    return null;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate('/dashboard/rutas')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Rutas
          </Button>
          <div>
            <h1 className="text-gray-900 mb-2">
              Ruta Generada - RT-{routeData.id.toString().padStart(3, '0')}
            </h1>
            <p className="text-gray-600">Ruta optimizada lista para ser asignada</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button> */}
          <Button className="bg-blue-700 hover:bg-blue-800">
            <Send className="w-4 h-4 mr-2" />
            Enviar al Conductor
          </Button>
        </div>
      </div>

      {/* Route Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Navigation className="w-5 h-5 text-blue-700" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Distancia Total</p>
                <p className="text-xl text-gray-900">{formatters.distance(routeData.totalDistance)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Duración Est.</p>
                <p className="text-xl text-gray-900">{formatters.duration(routeData.estimatedDuration)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-sky-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-sky-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pasajeros</p>
                <p className="text-xl text-gray-900">{routeData.assignments?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Paradas</p>
                <p className="text-xl text-gray-900">{routeData.stops?.length || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Route Endpoints Information */}
      {routeData.stops && routeData.stops.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(() => {
            const sortedStops = [...routeData.stops].sort((a, b) => a.order - b.order);
            const startStop = sortedStops.find(stop => stop.order === 0);
            const endStop = sortedStops.find(stop => stop.type === 'destination');
            
            return (
              <>
                {/* Start Location */}
                {startStop && (
                  <Card className="border-blue-200 bg-blue-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-blue-700">
                        <Navigation className="w-5 h-5" />
                        Punto de Inicio
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-900">{startStop.name}</h3>
                        <p className="text-sm text-gray-600 flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {startStop.address}
                        </p>
                        {startStop.estimatedArrival && (
                          <p className="text-sm text-blue-600 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Salida: {formatters.time(startStop.estimatedArrival)}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
                
                {/* End Location */}
                {endStop && (
                  <Card className="border-green-200 bg-green-50">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="w-5 h-5" />
                        Destino Final
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2">
                        <h3 className="font-medium text-gray-900">{endStop.name}</h3>
                        <p className="text-sm text-gray-600 flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {endStop.address}
                        </p>
                        {endStop.estimatedArrival && (
                          <p className="text-sm text-green-600 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            Llegada estimada: {formatters.time(endStop.estimatedArrival)}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            );
          })()}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Visualization */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Visualización de Ruta</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[500px] rounded-lg overflow-hidden border bg-gradient-to-br from-blue-50 to-sky-50 relative">
              {/* Route visualization */}
              <div className="absolute inset-0 flex items-center justify-center p-8">
                <div className="relative w-full h-full flex flex-col justify-between">
                  {/* Show all assignments as stops */}
                  {routeData.assignments && routeData.assignments.length > 0 ? (
                    <>
                      {/* First employee */}
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-lg flex-shrink-0 z-10">
                          <span>1</span>
                        </div>
                        <div className="bg-white rounded-lg p-3 shadow-md flex-1">
                          <p className="text-sm text-gray-900">
                            {formatters.getFullName(routeData.assignments[0].employee.firstName, routeData.assignments[0].employee.lastName)}
                          </p>
                          <p className="text-xs text-gray-600">{routeData.assignments[0].employee.address}</p>
                        </div>
                      </div>

                      {/* Middle employees */}
                      {routeData.assignments.length > 2 && (
                        <div className="flex-1 flex flex-col justify-around py-4 border-l-4 border-dashed border-blue-300 ml-6">
                          {routeData.assignments.slice(1, -1).map((assignment, index) => (
                            <div key={assignment.id} className="flex items-center gap-4 -ml-6">
                              <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg flex-shrink-0 z-10">
                                {index + 2}
                              </div>
                              <div className="bg-white rounded-lg p-2 shadow-md flex-1">
                                <p className="text-sm text-gray-900">
                                  {formatters.getFullName(assignment.employee.firstName, assignment.employee.lastName)}
                                </p>
                                <p className="text-xs text-gray-600">
                                  {assignment.employee.address.length > 30 ? 
                                    `${assignment.employee.address.substring(0, 30)}...` : 
                                    assignment.employee.address
                                  }
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Last employee (if more than one) */}
                      {routeData.assignments.length > 1 && (
                        <div className="flex items-center gap-4">
                          <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg flex-shrink-0 z-10">
                            {routeData.assignments.length}
                          </div>
                          <div className="bg-white rounded-lg p-2 shadow-md flex-1">
                            <p className="text-sm text-gray-900">
                              {formatters.getFullName(
                                routeData.assignments[routeData.assignments.length - 1].employee.firstName, 
                                routeData.assignments[routeData.assignments.length - 1].employee.lastName
                              )}
                            </p>
                            <p className="text-xs text-gray-600">
                              {routeData.assignments[routeData.assignments.length - 1].employee.address}
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center text-gray-500">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No hay empleados asignados</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-700 border-2 border-white" />
                  <span className="text-gray-600">Inicio</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-600 border border-white" />
                  <span className="text-gray-600">Paradas</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-600 border-2 border-white" />
                  <span className="text-gray-600">Destino Final</span>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={openInGoogleMaps}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver en Google Maps
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Route Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Ruta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-1">Fecha</p>
              <p className="text-gray-900">{formatters.date(routeData.date)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Turno</p>
              <p className="text-gray-900">{formatters.shift(routeData.shift)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Destino</p>
              <p className="text-gray-900">{routeData.homeBase || 'Sede Principal'}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Vehículo</p>
              <p className="text-gray-900">
                {routeData.vehicle?.model || 'No asignado'} 
                {routeData.vehicle?.licensePlate && ` - ${routeData.vehicle.licensePlate}`}
              </p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Estado</p>
              <Badge className={
                routeData.status === 'completed' ? 'bg-green-100 text-green-800' :
                routeData.status === 'in_progress' ? 'bg-yellow-100 text-yellow-800' :
                routeData.status === 'planned' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }>
                {formatters.routeStatus(routeData.status)}
              </Badge>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Horario</p>
              <div className="flex items-center gap-2 flex-wrap">
                {routeData.startTime && (
                  <Badge className="bg-blue-100 text-blue-800">
                    Inicio: {formatters.time(routeData.startTime)}
                  </Badge>
                )}
                {routeData.startTime && routeData.estimatedDuration && (
                  <>
                    <ArrowRight className="w-4 h-4 text-gray-400" />
                    <Badge className="bg-green-100 text-green-800">
                      Estimado: {formatters.duration(routeData.estimatedDuration)}
                    </Badge>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Itinerary */}
      <Card>
        <CardHeader>
          <CardTitle>Itinerario Detallado</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {/* Priorizar stops, sino usar assignments como respaldo */}
            {routeData.stops && routeData.stops.length > 0 ? (
              // Mostrar usando datos de stops (ubicaciones configurables)
              <>
                {[...routeData.stops]
                  .sort((a, b) => a.order - b.order)
                  .map((stop, index) => {
                    const isStart = stop.type === 'waypoint' && stop.order === 0;
                    const isDestination = stop.type === 'destination';
                    const isPickup = stop.type === 'pickup';
                    
                    // Encontrar el empleado correspondiente para paradas de recogida
                    const assignment = routeData.assignments?.find(
                      (a: any) => a.employee.address === stop.address || 
                           (stop.name && stop.name.includes(a.employee.firstName))
                    );

                    return (
                      <div 
                        key={stop.id} 
                        className={`flex items-start gap-4 p-4 rounded-lg border transition-colors ${
                          isStart ? 'bg-blue-50 border-2 border-blue-200' :
                          isDestination ? 'bg-green-50 border-2 border-green-200' :
                          'bg-white border hover:bg-gray-50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-full text-white flex items-center justify-center flex-shrink-0 mt-1 ${
                          isStart ? 'bg-blue-600' :
                          isDestination ? 'bg-green-600' :
                          'bg-blue-600'
                        }`}>
                          {isStart ? (
                            <Navigation className="w-5 h-5" />
                          ) : isDestination ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            stop.order
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <p className="text-gray-900 font-medium">
                              {isStart ? `🚗 ${stop.name}` :
                               isDestination ? `🏢 ${stop.name}` :
                               isPickup && assignment ? 
                                 `👤 Recogida - ${formatters.getFullName(assignment.employee.firstName, assignment.employee.lastName)}` :
                                 stop.name}
                            </p>
                            <div className="flex items-center gap-2">
                              {stop.estimatedArrival && (
                                <Badge className={`${
                                  isStart ? 'bg-blue-700 text-white' :
                                  isDestination ? 'bg-green-700 text-white' :
                                  'bg-blue-100 text-blue-800'
                                }`}>
                                  {formatters.time(stop.estimatedArrival)}
                                </Badge>
                              )}
                              <Badge className={`${
                                isStart ? 'bg-blue-200 text-blue-800' :
                                isDestination ? 'bg-green-200 text-green-800' :
                                'bg-gray-200 text-gray-800'
                              }`}>
                                {isStart ? 'Punto de Inicio' :
                                 isDestination ? 'Destino Final' :
                                 'Recogida'}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex items-start gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{stop.address}</span>
                          </div>
                          
                          {/* Información adicional para empleados */}
                          {isPickup && assignment?.employee.department && (
                            <div className="mt-2">
                              <Badge variant="outline" className="text-xs">
                                {assignment.employee.department}
                              </Badge>
                            </div>
                          )}
                          
                          {/* Información de distancia y duración */}
                          {stop.distanceFromPrevious > 0 && stop.order > 0 && (
                            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Navigation className="w-3 h-3" />
                                {(stop.distanceFromPrevious / 1000).toFixed(1)} km
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {Math.round(stop.durationFromPrevious / 60)} min
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </>
            ) : routeData.assignments && routeData.assignments.length > 0 ? (
              // Respaldo: mostrar usando assignments (método anterior)
              <>
                {routeData.assignments.map((assignment: any, index: number) => (
                  <div 
                    key={assignment.id} 
                    className="flex items-start gap-4 p-4 bg-white rounded-lg border hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                      {assignment.pickupOrder || index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-gray-900">
                          {formatters.getFullName(assignment.employee.firstName, assignment.employee.lastName)}
                        </p>
                        <div className="flex items-center gap-2">
                          {assignment.estimatedPickupTime && (
                            <Badge className="bg-blue-100 text-blue-800">
                              {formatters.time(assignment.estimatedPickupTime)}
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <span>{assignment.employee.address}</span>
                      </div>
                      {assignment.employee.department && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs">
                            {assignment.employee.department}
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Final Destination */}
                <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg border-2 border-green-200">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-gray-900">{routeData.homeBase || 'Sede Principal'}</p>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-700 text-white">
                          Destino Final
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-start gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span>Punto de destino de todos los empleados</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No hay datos de ruta disponibles</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
