import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { 
  MapPin, 
  Navigation, 
  Phone, 
  CheckCircle2,
  Clock,
  User,
  ArrowLeft,
  Circle
} from 'lucide-react';

const currentRoute = {
  id: 'RT-005',
  vehicle: 'Bus Mercedes 001',
  date: '22/10/2024',
  shift: 'Matutino',
  currentStop: 2,
  totalStops: 5,
  stops: [
    {
      order: 1,
      employee: 'Juan Pérez',
      phone: '+57 300 123 4567',
      address: 'Calle 72 #54-46, Barranquilla',
      eta: '07:15 AM',
      status: 'completed'
    },
    {
      order: 2,
      employee: 'María García',
      phone: '+57 310 234 5678',
      address: 'Carrera 51B #84-24, Barranquilla',
      eta: '07:28 AM',
      status: 'current'
    },
    {
      order: 3,
      employee: 'Carlos Rodríguez',
      phone: '+57 320 345 6789',
      address: 'Calle 93 #47-42, Barranquilla',
      eta: '07:42 AM',
      status: 'pending'
    },
    {
      order: 4,
      employee: 'Luis Fernández',
      phone: '+57 301 456 7890',
      address: 'Carrera 46 #76-135, Barranquilla',
      eta: '07:55 AM',
      status: 'pending'
    },
    {
      order: 5,
      employee: 'Sofia López',
      phone: '+57 321 678 9012',
      address: 'Calle 79B #57-52, Barranquilla',
      eta: '08:10 AM',
      status: 'pending'
    },
  ],
  finalDestination: {
    name: 'Sede Norte',
    address: 'Calle 85 #42-32, Barranquilla',
    eta: '08:25 AM'
  }
};

export function DriverView() {
  const [completedStops, setCompletedStops] = useState(1);
  const currentStopData = currentRoute.stops.find(s => s.status === 'current');
  const progress = (completedStops / currentRoute.totalStops) * 100;

  const handleCompleteStop = () => {
    if (completedStops < currentRoute.totalStops) {
      setCompletedStops(completedStops + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-orange-600 text-white flex items-center justify-center">
                RS
              </div>
              <div>
                <p className="text-sm text-gray-900">Roberto Sánchez</p>
                <p className="text-xs text-gray-600">Conductor</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        {/* Route Info */}
        <Card className="border-orange-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Mi Ruta de Hoy - {currentRoute.id}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {currentRoute.date} • {currentRoute.shift}
                </p>
              </div>
              <Badge className="bg-orange-600 text-white">En Progreso</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Vehículo</p>
                <p className="text-gray-900">{currentRoute.vehicle}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Destino Final</p>
                <p className="text-gray-900">{currentRoute.finalDestination.name}</p>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm text-gray-600">Progreso</p>
                <p className="text-sm text-gray-900">{completedStops} de {currentRoute.totalStops} paradas completadas</p>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Current Stop */}
        {currentStopData && (
          <Card className="border-2 border-orange-600 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                Parada Actual
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-gray-700" />
                    <p className="text-xl text-gray-900">{currentStopData.employee}</p>
                  </div>
                  <div className="flex items-start gap-2 text-gray-700 mb-2">
                    <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                    <p>{currentStopData.address}</p>
                  </div>
                  <div className="flex items-center gap-2 text-gray-700">
                    <Clock className="w-4 h-4" />
                    <p>ETA: {currentStopData.eta}</p>
                  </div>
                </div>
                <Badge className="bg-orange-600 text-white">
                  Parada {currentStopData.order}/{currentRoute.totalStops}
                </Badge>
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open(`tel:${currentStopData.phone}`)}
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Llamar
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentStopData.address)}`)}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  Navegar
                </Button>
              </div>

              <Button 
                className="w-full bg-orange-600 hover:bg-orange-700"
                onClick={handleCompleteStop}
              >
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Marcar como Completada
              </Button>
            </CardContent>
          </Card>
        )}

        {/* All Stops */}
        <Card>
          <CardHeader>
            <CardTitle>Itinerario Completo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {currentRoute.stops.map((stop) => (
                <div 
                  key={stop.order}
                  className={`flex items-start gap-3 p-4 rounded-lg border-2 transition-all ${
                    stop.status === 'completed' 
                      ? 'bg-green-50 border-green-200' 
                      : stop.status === 'current'
                      ? 'bg-orange-50 border-orange-600'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex-shrink-0 mt-1">
                    {stop.status === 'completed' ? (
                      <CheckCircle2 className="w-6 h-6 text-green-600" />
                    ) : stop.status === 'current' ? (
                      <div className="w-6 h-6 rounded-full bg-orange-600 text-white flex items-center justify-center">
                        {stop.order}
                      </div>
                    ) : (
                      <Circle className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-gray-900">{stop.employee}</p>
                      <Badge 
                        variant="outline"
                        className={
                          stop.status === 'completed' 
                            ? 'bg-green-100 text-green-800 border-green-300' 
                            : stop.status === 'current'
                            ? 'bg-orange-100 text-orange-800 border-orange-300'
                            : 'bg-gray-100 text-gray-600'
                        }
                      >
                        {stop.status === 'completed' ? 'Completada' : stop.status === 'current' ? 'Actual' : stop.eta}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{stop.address}</p>
                  </div>
                </div>
              ))}

              {/* Final Destination */}
              <div className="flex items-start gap-3 p-4 rounded-lg border-2 border-blue-200 bg-blue-50">
                <div className="w-6 h-6 rounded-full bg-blue-700 text-white flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-gray-900">{currentRoute.finalDestination.name}</p>
                    <Badge className="bg-blue-700 text-white">
                      {currentRoute.finalDestination.eta}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{currentRoute.finalDestination.address}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
