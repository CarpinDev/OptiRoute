// const API_URL = 'http://localhost:4300/api';
const API_URL = 'https://q7xkzgcw-4300.use.devtunnels.ms/api';

export interface Location {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'home_base' | 'office' | 'waypoint';
  description?: string;
  isActive: boolean;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLocationDto {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'home_base' | 'office' | 'waypoint';
  description?: string;
  isActive?: boolean;
  isDefault?: boolean;
}

export interface UpdateLocationDto extends Partial<CreateLocationDto> {}

export interface DefaultLocations {
  homeBase: Location | null;
  office: Location | null;
}

class LocationService {
  async getAll(): Promise<Location[]> {
    const response = await fetch(`${API_URL}/locations`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener las ubicaciones');
    }
    
    return response.json();
  }

  async getByType(type: 'home_base' | 'office' | 'waypoint'): Promise<Location[]> {
    const response = await fetch(`${API_URL}/locations/type/${type}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener las ubicaciones');
    }
    
    return response.json();
  }

  async getDefaults(): Promise<DefaultLocations> {
    const response = await fetch(`${API_URL}/locations/defaults`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener las ubicaciones predeterminadas');
    }
    
    return response.json();
  }

  async getById(id: number): Promise<Location> {
    const response = await fetch(`${API_URL}/locations/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al obtener la ubicación');
    }
    
    return response.json();
  }

  async create(data: CreateLocationDto): Promise<Location> {
    const response = await fetch(`${API_URL}/locations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Error al crear la ubicación');
    }
    
    return response.json();
  }

  async update(id: number, data: UpdateLocationDto): Promise<Location> {
    const response = await fetch(`${API_URL}/locations/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      throw new Error('Error al actualizar la ubicación');
    }
    
    return response.json();
  }

  async setAsDefault(id: number): Promise<Location> {
    const response = await fetch(`${API_URL}/locations/${id}/set-default`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al establecer como predeterminada');
    }
    
    return response.json();
  }

  async delete(id: number): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/locations/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al eliminar la ubicación');
    }
    
    return response.json();
  }

  async seedDefault(): Promise<void> {
    const response = await fetch(`${API_URL}/locations/seed`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Error al crear ubicaciones predeterminadas');
    }
  }
}

export const locationService = new LocationService();