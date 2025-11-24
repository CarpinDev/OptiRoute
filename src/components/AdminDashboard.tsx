import { useEffect, useState } from 'react';
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
  Clock,
  DollarSign,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import dashboardService, { DashboardStats } from '../services/dashboard';
import { formatters } from '../services/utils';
import { Alert, AlertDescription } from './ui/alert';

export function AdminDashboard() {
  const {
    data: stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats
  } = useApi(() => dashboardService.getStats());

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Cargando dashboard...</span>
      </div>
    );
  }

  if (statsError) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Error al cargar el dashboard: {statsError}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4" 
              onClick={() => refetchStats()}
            >
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!stats) return null;

  const overviewCards = [
    { 
      label: 'Empleados Activos', 
      value: (stats?.overview?.activeEmployees ?? 0).toString(), 
      change: `${stats?.overview?.totalEmployees ?? 0} total`, 
      icon: Users,
      color: 'text-blue-700',
      bgColor: 'bg-blue-100'
    },
    { 
      label: 'Vehículos Disponibles', 
      value: (stats?.overview?.availableVehicles ?? 0).toString(), 
      change: `${stats?.overview?.totalVehicles ?? 0} total`, 
      icon: Truck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    },
    { 
      label: 'Rutas Activas', 
      value: (stats?.overview?.activeRoutes ?? 0).toString(), 
      change: `${stats?.overview?.totalRoutes ?? 0} total`, 
      icon: Route,
      color: 'text-sky-600',
      bgColor: 'bg-sky-100'
    },
    { 
      label: 'Ahorros Mensuales', 
      value: formatters.currency(stats?.savings?.monthly ?? 0), 
      change: (stats?.trends?.costReduction ?? '0%') + ' vs mes anterior', 
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
  ];

  const quickActions = [
    { label: 'Planificar Nueva Ruta', icon: Route, path: '/dashboard/planificar-ruta', color: 'bg-blue-700 hover:bg-blue-800' },
    { label: 'Gestionar Empleados', icon: Users, path: '/dashboard/empleados', color: 'bg-orange-600 hover:bg-orange-700' },
    { label: 'Ver Vehículos', icon: Truck, path: '/dashboard/vehiculos', color: 'bg-sky-600 hover:bg-sky-700' },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
          <p className="text-gray-600 mt-2">Gestión integral de transporte OptiRoute</p>
        </div>
        <Button 
          variant="outline" 
          onClick={() => refetchStats()}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {overviewCards.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-2">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-1">{stat.change}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <IconComponent className={`w-5 h-5 ${stat.color}`} />
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
          <Button variant="outline" size="sm" asChild>
            <Link to="/dashboard/rutas">
              <Calendar className="w-4 h-4 mr-2" />
              Ver Todas
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats?.recentActivity && stats.recentActivity.length > 0 ? (
              stats.recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-blue-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{activity.title}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatters.timeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <Badge 
                    className={getStatusColor(activity.status)}
                  >
                    {formatters.activityType(activity.type)}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Route className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No hay rutas recientes</p>
                <Link to="/dashboard/planificar-ruta">
                  <Button className="mt-4">
                    Planificar Primera Ruta
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Eficiencia de Rutas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Distancia promedio optimizada</span>
                <span className="font-medium">{formatters.distance(stats?.efficiency?.averageOptimizedDistance ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tiempo promedio de ruta</span>
                <span className="font-medium">{formatters.duration(stats?.efficiency?.averageRouteTime ?? 0)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Puntuación de optimización</span>
                <span className="font-medium text-green-600">{stats?.efficiency?.optimizationScore ?? 0}%</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ahorros del Mes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Combustible ahorrado</span>
                <span className="font-medium text-green-600">{(stats?.savings?.fuelSaved ?? 0).toFixed(1)} gal</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Tiempo ahorrado</span>
                <span className="font-medium text-green-600">{(stats?.savings?.timeSaved ?? 0)} min</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total ahorro mensual</span>
                <span className="font-medium text-green-600">{formatters.currency(stats?.savings?.monthly ?? 0)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
