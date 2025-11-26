import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { 
  Search, 
  Plus, 
  Download,
  Filter,
  Calendar,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Route as RouteIcon,
  MapPin,
  Users,
  Truck,
  Clock,
  AlertCircle,
  Play,
  Pause,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { useApi } from '../hooks/useApi';
import routeService, { Route, RouteFilters } from '../services/route';
import { formatters } from '../services/utils';

export function RoutesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [shiftFilter, setShiftFilter] = useState('all');
  const [selectedRoute, setSelectedRoute] = useState<Route | null>(null);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);

  const [filters, setFilters] = useState<RouteFilters>({
    page: 1,
    limit: 10
  });

  const {
    data: routes,
    loading: routesLoading,
    error: routesError,
    refetch: refetchRoutes
  } = useApi(() => routeService.getAll(filters));

  const {
    data: stats,
    loading: statsLoading,
    error: statsError
  } = useApi(() => routeService.getStatistics());

  // Filter routes based on search term and filters
  const filteredRoutes = routes?.data?.filter(route => {
    const searchTermLower = (searchTerm || '').toLowerCase();
    const matchesSearch = 
      route.name.toLowerCase().includes(searchTermLower) ||
      route.vehicle?.model?.toLowerCase().includes(searchTermLower) ||
      route.vehicle?.licensePlate?.toLowerCase().includes(searchTermLower);
    
    const matchesStatus = statusFilter === 'all' || route.status === statusFilter;
    const matchesShift = shiftFilter === 'all' || route.shift === shiftFilter;
    
    return matchesSearch && matchesStatus && matchesShift;
  }) || [];

  const handleViewDetails = (route: Route) => {
    setSelectedRoute(route);
    setDetailsDialogOpen(true);
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      await routeService.updateStatus(id, newStatus);
      await refetchRoutes();
    } catch (error) {
      console.error('Error updating route status:', error);
      // Mostrar el mensaje específico del backend
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el estado de la ruta';
      alert(errorMessage);
    }
  };

  const handleDeleteRoute = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta ruta?')) {
      return;
    }

    try {
      await routeService.delete(id);
      await refetchRoutes();
    } catch (error) {
      console.error('Error deleting route:', error);
      // Mostrar el mensaje específico del backend
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar la ruta';
      alert(errorMessage);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planned':
        return <Calendar className="w-4 h-4" />;
      case 'in_progress':
        return <Play className="w-4 h-4" />;
      case 'completed':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4" />;
      default:
        return <RouteIcon className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planned':
        return 'bg-blue-100 text-blue-800';
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (routesLoading || statsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-lg">Cargando rutas...</span>
      </div>
    );
  }

  if (routesError || statsError) {
    return (
      <div className="p-6">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Error al cargar las rutas: {routesError || statsError}
            <Button 
              variant="outline" 
              size="sm" 
              className="ml-4" 
              onClick={() => refetchRoutes()}
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
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Rutas</p>
                <p className="text-3xl text-gray-900">{stats?.total || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <RouteIcon className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Planificadas</p>
                <p className="text-3xl text-gray-900">{stats?.planned || 0}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-blue-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">En Progreso</p>
                <p className="text-3xl text-gray-900">{stats?.inProgress || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Play className="w-6 h-6 text-yellow-700" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Completadas</p>
                <p className="text-3xl text-gray-900">{stats?.completed || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-700" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Routes Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Gestión de Rutas</CardTitle>
            <div className="flex gap-2">
              {/* <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </Button> */}
              <Button 
                size="sm" 
                className="bg-blue-700 hover:bg-blue-800"
                onClick={() => navigate('/dashboard/planificar-ruta')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Ruta
              </Button>
            </div>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Buscar por nombre de ruta, vehículo o placa..."
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="planned">Planificada</SelectItem>
                <SelectItem value="in_progress">En Progreso</SelectItem>
                <SelectItem value="completed">Completada</SelectItem>
                <SelectItem value="cancelled">Cancelada</SelectItem>
              </SelectContent>
            </Select>
            <Select value={shiftFilter} onValueChange={setShiftFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Turno" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="morning">Mañana</SelectItem>
                <SelectItem value="afternoon">Tarde</SelectItem>
                <SelectItem value="evening">Noche</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Turno</TableHead>
                <TableHead>Vehículo</TableHead>
                <TableHead>Pasajeros</TableHead>
                <TableHead>Distancia</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRoutes.length > 0 ? (
                filteredRoutes.map((route) => (
                  <TableRow key={route.id}>
                    <TableCell>RT-{route.id.toString().padStart(3, '0')}</TableCell>
                    <TableCell className="font-medium">{route.name}</TableCell>
                    <TableCell>{formatters.date(route.date)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{formatters.shift(route.shift)}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <span>{route.vehicle?.model || 'N/A'}</span>
                        <span className="text-sm text-gray-500">
                          {route.vehicle?.licensePlate}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{route.assignments?.length || 0}</span>
                      </div>
                    </TableCell>
                    <TableCell>{formatters.distance(route.totalDistance)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(route.status)}>
                        <span className="flex items-center gap-1">
                          {getStatusIcon(route.status)}
                          {formatters.routeStatus(route.status)}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(route)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {route.status === 'planned' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(route.id, 'in_progress')}
                            className="text-green-600 hover:text-green-700"
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        {route.status === 'in_progress' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUpdateStatus(route.id, 'completed')}
                            className="text-blue-600 hover:text-blue-700"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRoute(route.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                    {searchTerm || (statusFilter !== 'all') || (shiftFilter !== 'all') 
                      ? 'No se encontraron rutas que coincidan con los filtros' 
                      : 'No hay rutas registradas'
                    }
                    {!searchTerm && statusFilter === 'all' && shiftFilter === 'all' && (
                      <div className="mt-4">
                        <Button 
                          onClick={() => navigate('/dashboard/planificar-ruta')}
                          className="bg-blue-700 hover:bg-blue-800"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Crear Primera Ruta
                        </Button>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Route Details Dialog */}
      <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RouteIcon className="w-5 h-5" />
              Detalles de la Ruta: {selectedRoute?.name}
            </DialogTitle>
            <DialogDescription>
              Información detallada de la ruta seleccionada
            </DialogDescription>
          </DialogHeader>
          {selectedRoute && (
            <div className="space-y-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">ID de Ruta</label>
                  <p className="text-gray-900">RT-{selectedRoute.id.toString().padStart(3, '0')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Estado</label>
                  <Badge className={getStatusColor(selectedRoute.status)}>
                    <span className="flex items-center gap-1">
                      {getStatusIcon(selectedRoute.status)}
                      {formatters.routeStatus(selectedRoute.status)}
                    </span>
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Fecha</label>
                  <p className="text-gray-900">{formatters.date(selectedRoute.date)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Turno</label>
                  <p className="text-gray-900">{formatters.shift(selectedRoute.shift)}</p>
                </div>
              </div>

              {/* Route Metrics */}
              <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div className="text-center">
                  <p className="text-sm text-gray-600">Distancia Total</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatters.distance(selectedRoute.totalDistance)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Duración Est.</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatters.duration(selectedRoute.estimatedDuration)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-600">Pasajeros</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {selectedRoute.assignments?.length || 0}
                  </p>
                </div>
              </div>

              {/* Vehicle Info */}
              <div>
                <label className="text-sm font-medium text-gray-600">Vehículo Asignado</label>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg mt-1">
                  <Truck className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {selectedRoute.vehicle?.model || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Placa: {selectedRoute.vehicle?.licensePlate} • 
                      Capacidad: {selectedRoute.vehicle?.capacity} pasajeros
                    </p>
                  </div>
                </div>
              </div>

              {/* Passengers List */}
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Pasajeros ({selectedRoute.assignments?.length || 0})
                </label>
                <div className="max-h-32 overflow-y-auto space-y-2 mt-2">
                  {selectedRoute.assignments?.map((assignment, index) => (
                    <div key={assignment.id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                      <div className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {formatters.getFullName(assignment.employee.firstName, assignment.employee.lastName)}
                        </p>
                        <p className="text-xs text-gray-600">{assignment.employee.address}</p>
                      </div>
                    </div>
                  )) || (
                    <p className="text-sm text-gray-500">No hay asignaciones disponibles</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={() => setDetailsDialogOpen(false)}
                  className="flex-1"
                >
                  Cerrar
                </Button>
                <Button
                  onClick={() => {
                    setDetailsDialogOpen(false);
                    navigate('/dashboard/ruta-generada', { state: { route: selectedRoute } });
                  }}
                  className="flex-1 bg-blue-700 hover:bg-blue-800"
                >
                  Ver Ruta Completa
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}