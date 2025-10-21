import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  MapPin, 
  Clock, 
  User,
  Phone,
  Truck,
  AlertCircle,
  ArrowLeft,
  Info,
  ExternalLink
} from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';

const employeeRoute = {
  employee: {
    name: 'Juan Pérez',
    id: 'EMP-001',
    department: 'Ventas'
  },
  route: {
    id: 'RT-005',
    date: '22/10/2024',
    shift: 'Matutino',
    pickupTime: '07:15 AM',
    arrivalTime: '08:25 AM',
    pickupAddress: 'Calle 72 #54-46, Barranquilla',
    pickupCoordinates: [10.9878, -74.7889] as [number, number],
    destination: 'Sede Norte',
    destinationAddress: 'Calle 85 #42-32, Barranquilla'
  },
  driver: {
    name: 'Roberto Sánchez',
    phone: '+57 311 987 6543',
    photo: 'RS'
  },
  vehicle: {
    name: 'Bus Mercedes 001',
    plate: 'ABC-123',
    capacity: 45
  }
};

export function EmployeeView() {
  const openInGoogleMaps = () => {
    const query = encodeURIComponent(employeeRoute.route.pickupAddress);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
              <span>Volver</span>
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-sky-600 text-white flex items-center justify-center">
                JP
              </div>
              <div>
                <p className="text-sm text-gray-900">{employeeRoute.employee.name}</p>
                <p className="text-xs text-gray-600">{employeeRoute.employee.department}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6 max-w-4xl">
        {/* Welcome Message */}
        <div className="text-center">
          <h1 className="text-gray-900 mb-2">¡Hola, {employeeRoute.employee.name.split(' ')[0]}!</h1>
          <p className="text-gray-600">Aquí está la información de tu ruta para hoy</p>
        </div>

        {/* Pickup Info - Main Card */}
        <Card className="border-2 border-sky-600 bg-sky-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sky-900">
              <Clock className="w-6 h-6" />
              Tu Hora de Recogida
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-4">
              <p className="text-5xl text-sky-900 mb-2">{employeeRoute.route.pickupTime}</p>
              <p className="text-gray-700">Estate listo 5 minutos antes</p>
            </div>
          </CardContent>
        </Card>

        {/* Route Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detalles de la Ruta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Fecha</p>
                <p className="text-gray-900">{employeeRoute.route.date}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Turno</p>
                <Badge className="bg-sky-100 text-sky-800">{employeeRoute.route.shift}</Badge>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Destino</p>
              <p className="text-gray-900">{employeeRoute.route.destination}</p>
              <p className="text-sm text-gray-600 mt-1">{employeeRoute.route.destinationAddress}</p>
            </div>
            <Separator />
            <div>
              <p className="text-sm text-gray-600 mb-1">Hora de llegada estimada</p>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <p className="text-gray-900">{employeeRoute.route.arrivalTime}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pickup Location */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Tu Punto de Recogida
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900 mb-3">{employeeRoute.route.pickupAddress}</p>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={openInGoogleMaps}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver en Google Maps
              </Button>
            </div>
            <div className="h-[300px] rounded-lg overflow-hidden border bg-gradient-to-br from-sky-50 to-blue-50 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 rounded-full bg-sky-600 mx-auto flex items-center justify-center shadow-xl">
                    <MapPin className="w-10 h-10 text-white" />
                  </div>
                  <div className="bg-white rounded-lg p-4 shadow-lg max-w-xs mx-4">
                    <p className="text-sm text-gray-900">{employeeRoute.route.pickupAddress}</p>
                    <p className="text-xs text-gray-600 mt-2">Coordenadas: {employeeRoute.route.pickupCoordinates[0]}, {employeeRoute.route.pickupCoordinates[1]}</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Driver & Vehicle Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Tu Conductor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-16 h-16 rounded-full bg-orange-600 text-white flex items-center justify-center text-xl">
                  {employeeRoute.driver.photo}
                </div>
                <div>
                  <p className="text-gray-900">{employeeRoute.driver.name}</p>
                  <p className="text-sm text-gray-600">{employeeRoute.driver.phone}</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => window.open(`tel:${employeeRoute.driver.phone}`)}
              >
                <Phone className="w-4 h-4 mr-2" />
                Llamar al Conductor
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Vehículo Asignado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-1">Vehículo</p>
                <p className="text-gray-900">{employeeRoute.vehicle.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Placa</p>
                <Badge variant="outline" className="text-base">{employeeRoute.vehicle.plate}</Badge>
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">Capacidad</p>
                <p className="text-gray-900">{employeeRoute.vehicle.capacity} pasajeros</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notes */}
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-700" />
          <AlertDescription className="text-blue-900">
            <p className="mb-2">Instrucciones importantes:</p>
            <ul className="space-y-1 text-sm ml-4 list-disc">
              <li>Estate en tu punto de recogida 5 minutos antes de la hora indicada</li>
              <li>Ten tu identificación de empleado visible</li>
              <li>Si no puedes abordar, notifica con anticipación</li>
              <li>Respeta las normas de convivencia en el vehículo</li>
            </ul>
          </AlertDescription>
        </Alert>

        {/* Emergency Contact */}
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-700 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-orange-900 mb-1">¿Tienes algún problema?</p>
                <p className="text-sm text-orange-800 mb-2">
                  Contacta al centro de control: <strong>+57 601 234 5678</strong>
                </p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-orange-300 text-orange-900 hover:bg-orange-100"
                  onClick={() => window.open('tel:+576012345678')}
                >
                  <Phone className="w-3 h-3 mr-2" />
                  Llamar Ahora
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
