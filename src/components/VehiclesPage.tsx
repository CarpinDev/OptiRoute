import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Truck, Users, Fuel, Calendar, Plus, Download } from 'lucide-react';

const vehicles = [
  { 
    id: 'VEH-001', 
    name: 'Bus Mercedes 001', 
    type: 'Bus', 
    capacity: 45, 
    plate: 'ABC-123',
    status: 'Disponible',
    fuel: '85%',
    lastMaintenance: '15/09/2024',
    provider: 'Trans Express'
  },
  { 
    id: 'VEH-002', 
    name: 'Bus Volvo 002', 
    type: 'Bus', 
    capacity: 50, 
    plate: 'DEF-456',
    status: 'En Ruta',
    fuel: '72%',
    lastMaintenance: '20/09/2024',
    provider: 'Trans Express'
  },
  { 
    id: 'VEH-003', 
    name: 'Van Toyota 003', 
    type: 'Van', 
    capacity: 15, 
    plate: 'GHI-789',
    status: 'En Ruta',
    fuel: '90%',
    lastMaintenance: '10/09/2024',
    provider: 'Rápido Seguro'
  },
  { 
    id: 'VEH-004', 
    name: 'Minibus Chevrolet 004', 
    type: 'Minibus', 
    capacity: 25, 
    plate: 'JKL-012',
    status: 'Disponible',
    fuel: '65%',
    lastMaintenance: '05/10/2024',
    provider: 'Trans Express'
  },
  { 
    id: 'VEH-005', 
    name: 'Van Nissan 005', 
    type: 'Van', 
    capacity: 12, 
    plate: 'MNO-345',
    status: 'Mantenimiento',
    fuel: '45%',
    lastMaintenance: '01/10/2024',
    provider: 'Rápido Seguro'
  },
];

export function VehiclesPage() {
  const disponibles = vehicles.filter(v => v.status === 'Disponible').length;
  const enRuta = vehicles.filter(v => v.status === 'En Ruta').length;
  const mantenimiento = vehicles.filter(v => v.status === 'Mantenimiento').length;

  return (
    <div className="p-6 space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Vehículos</p>
                <p className="text-3xl text-gray-900">{vehicles.length}</p>
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

      {/* Vehicles Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestión de Vehículos</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button>
              <Button size="sm" className="bg-blue-700 hover:bg-blue-800">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Vehículo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="overflow-hidden">
                <div className={`h-2 ${
                  vehicle.status === 'Disponible' ? 'bg-green-500' :
                  vehicle.status === 'En Ruta' ? 'bg-orange-500' :
                  'bg-red-500'
                }`} />
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Truck className="w-6 h-6 text-gray-700" />
                      </div>
                      <div>
                        <p className="text-gray-900">{vehicle.name}</p>
                        <p className="text-sm text-gray-600">{vehicle.plate}</p>
                      </div>
                    </div>
                    <Badge 
                      className={
                        vehicle.status === 'Disponible' ? 'bg-green-100 text-green-800' :
                        vehicle.status === 'En Ruta' ? 'bg-orange-100 text-orange-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {vehicle.status}
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Capacidad
                      </span>
                      <span className="text-gray-900">{vehicle.capacity} pasajeros</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Fuel className="w-4 h-4" />
                        Combustible
                      </span>
                      <span className="text-gray-900">{vehicle.fuel}</span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Último Mant.
                      </span>
                      <span className="text-gray-900">{vehicle.lastMaintenance}</span>
                    </div>

                    <div className="pt-3 border-t">
                      <p className="text-xs text-gray-600">Proveedor</p>
                      <p className="text-sm text-gray-900">{vehicle.provider}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Ver Detalles
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1">
                      Historial
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
