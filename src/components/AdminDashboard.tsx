import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { 
  Users, 
  Truck, 
  Route, 
  TrendingUp,
  Calendar,
  MapPin,
  Clock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AdminDashboard() {
  const stats = [
    { 
      label: 'Empleados Activos', 
      value: '248', 
      change: '+12%', 
      icon: Users,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100'
    },
    { 
      label: 'Vehículos Disponibles', 
      value: '18', 
      change: '3 en ruta', 
      icon: Truck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    { 
      label: 'Rutas Activas', 
      value: '6', 
      change: 'Hoy', 
      icon: Route,
      color: 'text-sky-600',
      bgColor: 'bg-sky-100'
    },
  ];

  const quickActions = [
    { label: 'Planificar Nueva Ruta', icon: Route, path: '/dashboard/planificar-ruta', color: 'bg-blue-700 hover:bg-blue-800' },
    { label: 'Gestionar Empleados', icon: Users, path: '/dashboard/empleados', color: 'bg-orange-600 hover:bg-orange-700' },
    { label: 'Ver Vehículos', icon: Truck, path: '/dashboard/vehiculos', color: 'bg-sky-600 hover:bg-sky-700' },
  ];

  const recentRoutes = [
    { 
      id: 'RT-001', 
      name: 'Ruta Matutina - Sede Norte', 
      employees: 32, 
      vehicle: 'Bus Mercedes 001',
      status: 'Completada',
      time: '07:30 AM'
    },
    { 
      id: 'RT-002', 
      name: 'Ruta Vespertina - Sede Sur', 
      employees: 28, 
      vehicle: 'Van Toyota 003',
      status: 'En Progreso',
      time: '05:45 PM'
    },
    { 
      id: 'RT-003', 
      name: 'Ruta Matutina - Sede Centro', 
      employees: 45, 
      vehicle: 'Bus Volvo 002',
      status: 'Completada',
      time: '08:00 AM'
    },
    { 
      id: 'RT-004', 
      name: 'Ruta Nocturna - Sede Norte', 
      employees: 18, 
      vehicle: 'Van Nissan 005',
      status: 'Programada',
      time: '10:00 PM'
    },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-3xl text-gray-900 mb-1">{stat.value}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      {stat.change}
                    </p>
                  </div>
                  <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Acciones Rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {quickActions.map((action, i) => {
              const Icon = action.icon;
              return (
                <Link key={i} to={action.path}>
                  <Button className={`w-full h-auto py-4 ${action.color}`}>
                    <div className="flex flex-col items-center gap-2">
                      <Icon className="w-6 h-6" />
                      <span>{action.label}</span>
                    </div>
                  </Button>
                </Link>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Recent Routes */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Rutas Recientes</CardTitle>
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Ver Todas
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentRoutes.map((route) => (
              <div key={route.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <p className="text-gray-900">{route.name}</p>
                    <div className="flex items-center gap-4 mt-1">
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {route.employees} empleados
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        {route.vehicle}
                      </p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {route.time}
                      </p>
                    </div>
                  </div>
                </div>
                <Badge 
                  variant={route.status === 'Completada' ? 'secondary' : route.status === 'En Progreso' ? 'default' : 'outline'}
                  className={
                    route.status === 'Completada' ? 'bg-green-100 text-green-800' : 
                    route.status === 'En Progreso' ? 'bg-blue-100 text-blue-800' : 
                    'bg-gray-100 text-gray-800'
                  }
                >
                  {route.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
