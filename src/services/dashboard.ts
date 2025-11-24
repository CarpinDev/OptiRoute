import apiClient from './api';

// Types
export interface DashboardStats {
  overview: {
    totalEmployees: number;
    activeEmployees: number;
    totalVehicles: number;
    availableVehicles: number;
    totalRoutes: number;
    activeRoutes: number;
    totalCapacity: number;
    utilizationRate: number;
  };
  employees: any;
  vehicles: any;
  routes: any;
  efficiency: {
    averageOptimizedDistance: number;
    averageRouteTime: number;
    optimizationScore: number;
  };
  savings: {
    monthly: number;
    annual: number;
    fuelSaved: number;
    timeSaved: number;
  };
  trends: {
    monthlyRoutesAverage: number;
    employeeGrowth: string;
    vehicleUtilization: string;
    costReduction: string;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    status: string;
    timestamp: string;
  }>;
}

export interface PerformanceMetrics {
  operational: {
    onTimePerformance: number;
    routeEfficiency: number;
    vehicleUtilization: number;
    employeeUtilization: number;
  };
  financial: {
    costPerRoute: number;
    costPerEmployee: number;
    monthlySavings: number;
    budgetUtilization: number;
  };
  quality: {
    customerSatisfaction: number;
    incidentRate: number;
    delayRate: number;
    complaintResolutionTime: number;
  };
}

// Dashboard Service
export const dashboardService = {
  async getStats(): Promise<DashboardStats> {
    return apiClient.get('/dashboard/stats');
  },

  async getPerformanceMetrics(): Promise<PerformanceMetrics> {
    return apiClient.get('/dashboard/performance');
  },

  async getRecentActivity() {
    return apiClient.get('/dashboard/activity');
  }
};

export default dashboardService;