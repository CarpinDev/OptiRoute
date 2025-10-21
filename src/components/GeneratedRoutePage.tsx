import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
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
  ExternalLink
} from 'lucide-react';

const routeData = {
  id: 'RT-005',
  date: '22/10/2024',
  shift: 'Matutino',
  destination: 'Sede Norte',
  vehicle: 'Bus Mercedes 001',
  driver: 'Roberto Sánchez',
  totalDistance: '45.2 km',
  estimatedDuration: '1h 25min',
  departureTime: '07:00 AM',
  arrivalTime: '08:25 AM',
  stops: [
    {
      order: 1,
      employee: 'Juan Pérez',
      address: 'Calle 72 #54-46, Barranquilla',
      coordinates: [10.9878, -74.7889] as [number, number],
      eta: '07:15 AM',
      distance: '8.5 km',
      status: 'pending'
    },
    {
      order: 2,
      employee: 'María García',
      address: 'Carrera 51B #84-24, Barranquilla',
      coordinates: [11.0041, -74.8070] as [number, number],
      eta: '07:28 AM',
      distance: '5.2 km',
      status: 'pending'
    },
    {
      order: 3,
      employee: 'Carlos Rodríguez',
      address: 'Calle 93 #47-42, Barranquilla',
      coordinates: [11.0180, -74.8051] as [number, number],
      eta: '07:42 AM',
      distance: '6.8 km',
      status: 'pending'
    },
    {
      order: 4,
      employee: 'Luis Fernández',
      address: 'Carrera 46 #76-135, Barranquilla',
      coordinates: [10.9635, -74.7964] as [number, number],
      eta: '07:55 AM',
      distance: '7.3 km',
      status: 'pending'
    },
    {
      order: 5,
      employee: 'Sofia López',
      address: 'Calle 79B #57-52, Barranquilla',
      coordinates: [10.9942, -74.7853] as [number, number],
      eta: '08:10 AM',
      distance: '9.1 km',
      status: 'pending'
    },
  ],
  finalDestination: {
    name: 'Sede Norte',
    address: 'Calle 85 #42-32, Barranquilla',
    coordinates: [10.9983, -74.7892] as [number, number],
    eta: '08:25 AM',
    distance: '8.3 km'
  }
};

export function GeneratedRoutePage() {
  const openInGoogleMaps = () => {
    const addresses = [
      ...routeData.stops.map(s => s.address),
      routeData.finalDestination.address
    ];
    const destination = encodeURIComponent(routeData.finalDestination.address);
    const waypoints = addresses.slice(0, -1).map(a => encodeURIComponent(a)).join('|');
    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&waypoints=${waypoints}`;
    window.open(url, '_blank');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2">Ruta Generada - {routeData.id}</h1>
          <p className="text-gray-600">Ruta optimizada lista para ser asignada</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline">
            <FileText className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
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
                <p className="text-xl text-gray-900">{routeData.totalDistance}</p>
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
                <p className="text-xl text-gray-900">{routeData.estimatedDuration}</p>
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
                <p className="text-xl text-gray-900">{routeData.stops.length}</p>
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
                <p className="text-xl text-gray-900">{routeData.stops.length + 1}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
                  {/* Start */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-blue-700 text-white flex items-center justify-center shadow-lg flex-shrink-0 z-10">
                      <span>S</span>
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-md flex-1">
                      <p className="text-sm text-gray-900">{routeData.stops[0].employee}</p>
                      <p className="text-xs text-gray-600">{routeData.stops[0].address}</p>
                    </div>
                  </div>

                  {/* Middle stops */}
                  <div className="flex-1 flex flex-col justify-around py-4 border-l-4 border-dashed border-blue-300 ml-6">
                    {routeData.stops.slice(1).map((stop) => (
                      <div key={stop.order} className="flex items-center gap-4 -ml-6">
                        <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-lg flex-shrink-0 z-10">
                          {stop.order}
                        </div>
                        <div className="bg-white rounded-lg p-2 shadow-md flex-1">
                          <p className="text-sm text-gray-900">{stop.employee}</p>
                          <p className="text-xs text-gray-600">{stop.address.substring(0, 30)}...</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* End */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-green-600 text-white flex items-center justify-center shadow-lg flex-shrink-0 z-10">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div className="bg-white rounded-lg p-3 shadow-md flex-1">
                      <p className="text-sm text-gray-900">{routeData.finalDestination.name}</p>
                      <p className="text-xs text-gray-600">{routeData.finalDestination.address}</p>
                    </div>
                  </div>
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
              <p className="text-gray-900">{routeData.date}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Turno</p>
              <p className="text-gray-900">{routeData.shift}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Destino</p>
              <p className="text-gray-900">{routeData.destination}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Vehículo</p>
              <p className="text-gray-900">{routeData.vehicle}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Conductor</p>
              <p className="text-gray-900">{routeData.driver}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Horario</p>
              <div className="flex items-center gap-2">
                <Badge className="bg-blue-100 text-blue-800">
                  Salida: {routeData.departureTime}
                </Badge>
                <ArrowRight className="w-4 h-4 text-gray-400" />
                <Badge className="bg-green-100 text-green-800">
                  Llegada: {routeData.arrivalTime}
                </Badge>
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
            {/* Start */}
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
              <div className="w-8 h-8 rounded-full bg-blue-700 text-white flex items-center justify-center flex-shrink-0 mt-1">
                <span>S</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-gray-900">Inicio del recorrido</p>
                  <Badge className="bg-blue-700 text-white">{routeData.departureTime}</Badge>
                </div>
                <p className="text-sm text-gray-600">{routeData.stops[0].address}</p>
              </div>
            </div>

            {/* Stops */}
            {routeData.stops.map((stop) => (
              <div key={stop.order} className="flex items-start gap-4 p-4 bg-white rounded-lg border hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center flex-shrink-0 mt-1">
                  {stop.order}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-gray-900">{stop.employee}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{stop.distance}</Badge>
                      <Badge className="bg-orange-100 text-orange-800">{stop.eta}</Badge>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>{stop.address}</span>
                  </div>
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
                  <p className="text-gray-900">{routeData.finalDestination.name}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{routeData.finalDestination.distance}</Badge>
                    <Badge className="bg-green-700 text-white">{routeData.finalDestination.eta}</Badge>
                  </div>
                </div>
                <div className="flex items-start gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{routeData.finalDestination.address}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
