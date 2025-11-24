import apiClient from './api';

// Types
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'driver' | 'employee';
  status: 'active' | 'inactive';
  phone?: string;
  employeeId?: number;
  vehicleId?: number;
}

export interface LoginResponse {
  success: boolean;
  user: User;
  token: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'driver' | 'employee';
  phone?: string;
  employeeId?: number;
  vehicleId?: number;
}

// Auth Service
export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    return apiClient.login(email, password);
  },

  async register(userData: RegisterData) {
    return apiClient.register(userData);
  },

  logout() {
    apiClient.logout();
  },

  getCurrentUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },

  getUsersByRole(role: string) {
    return apiClient.get(`/auth/users-by-role?role=${role}`);
  },

  // Initialize default users for development
  async seedUsers() {
    return apiClient.post('/seed/users');
  }
};

export default authService;