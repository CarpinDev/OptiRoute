import apiClient from './api';

// Seed Service - for development/testing
export const seedService = {
  async initializeAll() {
    return apiClient.post('/seed/all');
  },

  async createUsers() {
    return apiClient.post('/seed/users');
  },

  async createEmployees() {
    return apiClient.post('/seed/employees');
  },

  async createVehicles() {
    return apiClient.post('/seed/vehicles');
  }
};

// Utility functions for data formatting
export const formatters = {
  currency: (amount: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP'
    }).format(amount);
  },

  date: (date: string | Date): string => {
    return new Intl.DateTimeFormat('es-CO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  },

  time: (time: string): string => {
    return time.substring(0, 5); // HH:MM format
  },

  timeAgo: (date: string | Date): string => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInMs = now.getTime() - targetDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d`;
  },

  percentage: (value: number): string => {
    return `${value.toFixed(1)}%`;
  },

  distance: (km: number): string => {
    return `${km.toFixed(1)} km`;
  },

  duration: (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  },

  activityType: (type: string): string => {
    const typeMap: { [key: string]: string } = {
      'route': 'Ruta',
      'employee': 'Empleado',
      'vehicle': 'Vehículo',
      'maintenance': 'Mantenimiento',
      'completed': 'Completado',
      'planned': 'Planificado',
      'in_progress': 'En Progreso',
      'cancelled': 'Cancelado'
    };
    return typeMap[type] || type;
  },

  routeStatus: (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'planned': 'Planificada',
      'in_progress': 'En Progreso', 
      'completed': 'Completada',
      'cancelled': 'Cancelada'
    };
    return statusMap[status] || status;
  },

  shift: (shift: string): string => {
    const shiftMap: { [key: string]: string } = {
      'morning': 'Mañana',
      'afternoon': 'Tarde',
      'evening': 'Noche'
    };
    return shiftMap[shift] || shift;
  },

  employeeStatus: (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'active': 'Activo',
      'inactive': 'Inactivo',
      'on_leave': 'En Licencia'
    };
    return statusMap[status] || status;
  },

  vehicleStatus: (status: string): string => {
    const statusMap: { [key: string]: string } = {
      'available': 'Disponible',
      'in_route': 'En Ruta',
      'maintenance': 'Mantenimiento',
      'out_of_service': 'Fuera de Servicio'
    };
    return statusMap[status] || status;
  },

  // Helper function to get full name from firstName and lastName
  getFullName: (firstName?: string, lastName?: string): string => {
    return `${firstName || ''} ${lastName || ''}`.trim() || 'N/A';
  }
};

// Constants for the application
export const constants = {
  SHIFTS: [
    { value: 'morning', label: 'Mañana' },
    { value: 'afternoon', label: 'Tarde' },
    { value: 'evening', label: 'Noche' }
  ],

  EMPLOYEE_STATUSES: [
    { value: 'active', label: 'Activo', color: 'green' },
    { value: 'inactive', label: 'Inactivo', color: 'red' },
    { value: 'on_leave', label: 'En licencia', color: 'yellow' }
  ],

  VEHICLE_STATUSES: [
    { value: 'available', label: 'Disponible', color: 'green' },
    { value: 'in_route', label: 'En ruta', color: 'blue' },
    { value: 'maintenance', label: 'Mantenimiento', color: 'yellow' },
    { value: 'out_of_service', label: 'Fuera de servicio', color: 'red' }
  ],

  ROUTE_STATUSES: [
    { value: 'planned', label: 'Planificada', color: 'blue' },
    { value: 'in_progress', label: 'En progreso', color: 'yellow' },
    { value: 'completed', label: 'Completada', color: 'green' },
    { value: 'cancelled', label: 'Cancelada', color: 'red' }
  ],

  VEHICLE_TYPES: [
    { value: 'bus', label: 'Bus' },
    { value: 'van', label: 'Van' },
    { value: 'minibus', label: 'Minibus' }
  ],

  USER_ROLES: [
    { value: 'admin', label: 'Administrador' },
    { value: 'driver', label: 'Conductor' },
    { value: 'employee', label: 'Empleado' }
  ]
};

export default {
  seedService,
  formatters,
  constants
};