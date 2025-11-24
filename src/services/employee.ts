import apiClient from './api';

// Types
export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  fullName?: string; // Optional since it can be computed from firstName + lastName
  email: string;
  phone: string;
  address: string;
  department: string;
  position: string;
  status: 'active' | 'inactive' | 'on_leave';
  latitude: number;
  longitude: number;
  preferredShift: string;
  homeBase: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateEmployeeData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  department: string;
  position: string;
  latitude: number;
  longitude: number;
  preferredShift?: string;
  homeBase?: string;
  status?: 'active' | 'inactive' | 'on_leave';
}

export interface EmployeeFilters {
  status?: string;
  department?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface EmployeeResponse {
  data: Employee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EmployeeStats {
  total: number;
  active: number;
  inactive: number;
  onLeave: number;
  departmentStats: Array<{
    department: string;
    count: number;
  }>;
}

// Employee Service
export const employeeService = {
  async getAll(filters: EmployeeFilters = {}): Promise<EmployeeResponse> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const queryString = params.toString();
    return apiClient.get(`/employees${queryString ? `?${queryString}` : ''}`);
  },

  async getById(id: number): Promise<Employee> {
    return apiClient.get(`/employees/${id}`);
  },

  async create(employeeData: CreateEmployeeData): Promise<Employee> {
    return apiClient.post('/employees', employeeData);
  },

  async update(id: number, employeeData: Partial<CreateEmployeeData>): Promise<Employee> {
    return apiClient.put(`/employees/${id}`, employeeData);
  },

  async delete(id: number): Promise<{ message: string }> {
    return apiClient.delete(`/employees/${id}`);
  },

  async getStatistics(): Promise<EmployeeStats> {
    return apiClient.get('/employees/statistics');
  },

  async getDepartments(): Promise<string[]> {
    return apiClient.get('/employees/departments');
  },

  // Initialize sample employees for development
  async seedEmployees() {
    return apiClient.post('/employees/seed');
  }
};

export default employeeService;