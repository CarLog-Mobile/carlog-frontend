// API service for CarLog app
const API_BASE_URL = 'http://localhost:8080/api';

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error('Couldn\'t fetch');
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw new Error('Couldn\'t fetch');
  }
};

// Cars API
export const carsApi = {
  getAll: () => apiRequest('/cars'),
  getById: (id: string) => apiRequest(`/cars/${id}`),
  create: (car: Omit<Car, 'id'>) => apiRequest('/cars', {
    method: 'POST',
    body: JSON.stringify(car),
  }),
  update: (id: string, car: Partial<Car>) => apiRequest(`/cars/${id}`, {
    method: 'PUT',
    body: JSON.stringify(car),
  }),
  delete: (id: string) => apiRequest(`/cars/${id}`, {
    method: 'DELETE',
  }),
};

// Trips API
export const tripsApi = {
  getAll: (carId?: string) => {
    const params = carId ? `?carId=${carId}` : '';
    return apiRequest(`/trips${params}`);
  },
  getById: (id: string) => apiRequest(`/trips/${id}`),
  create: (trip: Omit<Trip, 'id'>) => apiRequest('/trips', {
    method: 'POST',
    body: JSON.stringify(trip),
  }),
  update: (id: string, trip: Partial<Trip>) => apiRequest(`/trips/${id}`, {
    method: 'PUT',
    body: JSON.stringify(trip),
  }),
  delete: (id: string) => apiRequest(`/trips/${id}`, {
    method: 'DELETE',
  }),
  getStats: () => apiRequest('/trips/stats'),
  getMonthlyDistance: () => apiRequest('/trips/monthly-distance'),
};

// Fuel API
export const fuelApi = {
  getAll: (carId?: string) => {
    const params = carId ? `?carId=${carId}` : '';
    return apiRequest(`/fuel-entries${params}`);
  },
  getById: (id: string) => apiRequest(`/fuel-entries/${id}`),
  create: (entry: Omit<FuelEntry, 'id'>) => apiRequest('/fuel-entries', {
    method: 'POST',
    body: JSON.stringify(entry),
  }),
  update: (id: string, entry: Partial<FuelEntry>) => apiRequest(`/fuel-entries/${id}`, {
    method: 'PUT',
    body: JSON.stringify(entry),
  }),
  delete: (id: string) => apiRequest(`/fuel-entries/${id}`, {
    method: 'DELETE',
  }),
  getEfficiency: () => apiRequest('/fuel-entries/efficiency'),
  getMonthlyCosts: () => apiRequest('/fuel-entries/monthly-costs'),
};

// Maintenance API
export const maintenanceApi = {
  getAll: (carId?: string) => {
    const params = carId ? `?carId=${carId}` : '';
    return apiRequest(`/maintenance${params}`);
  },
  getById: (id: string) => apiRequest(`/maintenance/${id}`),
  create: (item: Omit<MaintenanceItem, 'id'>) => apiRequest('/maintenance', {
    method: 'POST',
    body: JSON.stringify(item),
  }),
  update: (id: string, item: Partial<MaintenanceItem>) => apiRequest(`/maintenance/${id}`, {
    method: 'PUT',
    body: JSON.stringify(item),
  }),
  delete: (id: string) => apiRequest(`/maintenance/${id}`, {
    method: 'DELETE',
  }),
  markCompleted: (id: string) => apiRequest(`/maintenance/${id}/complete`, {
    method: 'PUT',
  }),
  getOverdue: () => apiRequest('/maintenance/overdue'),
};

// Dashboard API
export const dashboardApi = {
  getStats: () => apiRequest('/dashboard/stats'),
  getRecentActivity: () => apiRequest('/dashboard/recent-activity'),
  getSelectedVehicle: () => apiRequest('/dashboard/selected-vehicle'),
};

interface Car {
  id: string;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  mileage: number;
  fuelType: string;
}

interface Trip {
  id: string;
  carId: string;
  date: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  duration: number;
}

interface FuelEntry {
  id: string;
  carId: string;
  date: string;
  liters: number;
  costPerLiter: number;
  totalCost: number;
  mileage: number;
  fuelType: string;
}

interface MaintenanceItem {
  id: string;
  carId: string;
  title: string;
  description: string;
  date: string;
  mileage: number;
  cost: number;
  status: 'completed' | 'scheduled' | 'overdue';
  type: 'oil_change' | 'tire_rotation' | 'brake_service' | 'inspection' | 'other';
  nextDueMileage?: number;
  nextDueDate?: string;
}
