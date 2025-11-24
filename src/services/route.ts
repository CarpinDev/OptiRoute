import apiClient from './api';
import { Employee } from './employee';
import { Vehicle } from './vehicle';

// Types
export interface RouteStop {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  order: number;
  type: 'pickup' | 'destination' | 'waypoint';
  estimatedArrival: string;
  actualArrival?: string;
  distanceFromPrevious: number;
  durationFromPrevious: number;
  isCompleted: boolean;
  instructions?: string;
}

export interface RouteAssignment {
  id: number;
  employee: Employee;
  pickupOrder: number;
  estimatedPickupTime: string;
  actualPickupTime?: string;
  isPickedUp: boolean;
  notes?: string;
}

export interface Route {
  id: number;
  name: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'evening';
  homeBase: string;
  status: 'planned' | 'in_progress' | 'completed' | 'cancelled';
  totalDistance: number;
  estimatedDuration: number;
  startTime?: string;
  endTime?: string;
  estimatedCost: number;
  vehicle: Vehicle;
  vehicleId: number;
  assignments: RouteAssignment[];
  stops: RouteStop[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRouteData {
  name: string;
  date: string;
  shift: 'morning' | 'afternoon' | 'evening';
  homeBase: string;
  vehicleId: number;
  employeeIds: number[];
  homeBaseLocationId?: number;
  destinationLocationId?: number;
  startTime?: string;
  notes?: string;
}

export interface RouteFilters {
  status?: string;
  date?: string;
  shift?: string;
  vehicleId?: number;
  page?: number;
  limit?: number;
}

export interface RouteResponse {
  data: Route[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RouteStats {
  total: number;
  planned: number;
  inProgress: number;
  completed: number;
  monthlyStats: Array<{
    month: string;
    count: number;
  }>;
}

// Route Service
export const routeService = {
  async getAll(filters: RouteFilters = {}): Promise<RouteResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    return apiClient.get(`/routes${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: number): Promise<Route> {
    return apiClient.get(`/routes/${id}`);
  },

  async create(routeData: CreateRouteData): Promise<Route> {
    return apiClient.post('/routes', routeData);
  },

  async update(id: number, routeData: Partial<CreateRouteData>): Promise<Route> {
    return apiClient.put(`/routes/${id}`, routeData);
  },

  async updateStatus(id: number, status: string): Promise<Route> {
    return apiClient.patch(`/routes/${id}/status`, { status });
  },

  async delete(id: number): Promise<{ message: string }> {
    return apiClient.delete(`/routes/${id}`);
  },

  async getStatistics(): Promise<RouteStats> {
    return apiClient.get('/routes/statistics');
  },

  // Driver specific endpoints
  async getDriverRoute(vehicleId: number): Promise<Route & { 
    progress: any; 
    currentStop: RouteStop; 
    nextStop: RouteStop; 
  }> {
    return apiClient.get(`/driver/route/${vehicleId}`);
  },

  async startRoute(vehicleId: number): Promise<{ success: boolean; message: string; route: Route }> {
    return apiClient.post(`/driver/route/${vehicleId}/start`);
  },

  async completeStop(stopId: number): Promise<{ success: boolean; message: string; routeCompleted: boolean }> {
    return apiClient.post(`/driver/stop/${stopId}/complete`);
  },

  async getDriverHistory(vehicleId: number, limit?: number) {
    return apiClient.get(`/driver/history/${vehicleId}${limit ? `?limit=${limit}` : ''}`);
  },

  // Employee specific endpoints
  async getEmployeeRoute(employeeId: number, date?: string) {
    return apiClient.get(`/employee-view/${employeeId}/route${date ? `?date=${date}` : ''}`);
  },

  async getEmployeeHistory(employeeId: number, limit?: number) {
    return apiClient.get(`/employee-view/${employeeId}/history${limit ? `?limit=${limit}` : ''}`);
  },

  async getEmployeeProfile(employeeId: number) {
    return apiClient.get(`/employee-view/${employeeId}/profile`);
  }
};

export default routeService;