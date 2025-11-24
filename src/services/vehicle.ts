import apiClient from './api';

// Types
export interface Vehicle {
  id: number;
  licensePlate: string;
  model: string;
  brand: string;
  year: number;
  capacity: number;
  type: 'bus' | 'van' | 'minibus';
  status: 'available' | 'in_route' | 'maintenance' | 'out_of_service';
  driverName?: string;
  driverPhone?: string;
  provider?: string;
  fuelConsumption: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVehicleData {
  licensePlate: string;
  model: string;
  brand: string;
  year: number;
  capacity: number;
  type: 'bus' | 'van' | 'minibus';
  status?: 'available' | 'in_route' | 'maintenance' | 'out_of_service';
  driverName?: string;
  driverPhone?: string;
  provider?: string;
  fuelConsumption?: number;
  isActive?: boolean;
}

export interface VehicleFilters {
  status?: string;
  type?: string;
  provider?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface VehicleResponse {
  data: Vehicle[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface VehicleStats {
  total: number;
  available: number;
  inRoute: number;
  maintenance: number;
  typeStats: Array<{
    type: string;
    count: number;
    totalCapacity: number;
  }>;
  providerStats: Array<{
    provider: string;
    count: number;
  }>;
}

// Vehicle Service
export const vehicleService = {
  async getAll(filters: VehicleFilters = {}): Promise<VehicleResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    return apiClient.get(`/vehicles${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: number): Promise<Vehicle> {
    return apiClient.get(`/vehicles/${id}`);
  },

  async getAvailable(): Promise<Vehicle[]> {
    return apiClient.get('/vehicles/available');
  },

  async create(vehicleData: CreateVehicleData): Promise<Vehicle> {
    return apiClient.post('/vehicles', vehicleData);
  },

  async update(id: number, vehicleData: Partial<CreateVehicleData>): Promise<Vehicle> {
    return apiClient.put(`/vehicles/${id}`, vehicleData);
  },

  async updateStatus(id: number, status: string): Promise<Vehicle> {
    return apiClient.patch(`/vehicles/${id}/status`, { status });
  },

  async delete(id: number): Promise<{ message: string }> {
    return apiClient.delete(`/vehicles/${id}`);
  },

  async getStatistics(): Promise<VehicleStats> {
    return apiClient.get('/vehicles/statistics');
  },

  async getProviders(): Promise<string[]> {
    return apiClient.get('/vehicles/providers');
  },

  // Initialize sample vehicles for development
  async seedVehicles() {
    return apiClient.post('/vehicles/seed');
  }
};

export default vehicleService;