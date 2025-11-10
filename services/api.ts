// API service for CarLog app
const API_BASE_URL = 'http://10.0.2.2:8080/api';

// MOCK MODE - Set to true to use mock data instead of real API
const USE_MOCK_DATA = true;

// Mock data storage
const mockData = {
  cars: [
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: '2020',
      licensePlate: 'ABC123',
      mileage: 45000,
      fuelType: 'Regular'
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Civic',
      year: '2019',
      licensePlate: 'XYZ789',
      mileage: 32000,
      fuelType: 'Regular'
    }
  ],
  trips: [
    {
      id: '1',
      carId: '1',
      date: '2025-11-01',
      startLocation: 'Home',
      endLocation: 'Work',
      distance: 25.5,
      duration: 35
    },
    {
      id: '2',
      carId: '1',
      date: '2025-11-05',
      startLocation: 'Work',
      endLocation: 'Mall',
      distance: 15.2,
      duration: 20
    }
  ],
  fuelEntries: [
    {
      id: '1',
      carId: '1',
      date: '2025-11-01',
      liters: 40,
      costPerLiter: 1.5,
      totalCost: 60,
      mileage: 45000,
      fuelType: 'Regular'
    }
  ],
  maintenance: [
    {
      id: '1',
      carId: '1',
      title: 'Oil Change',
      description: 'Regular oil change service',
      date: '2025-10-15',
      mileage: 44000,
      cost: 50,
      status: 'completed',
      type: 'oil_change',
      nextDueMileage: 47000,
      nextDueDate: '2026-01-15'
    }
  ]
};

// Mock API response delay (simulates network)
const mockDelay = () => new Promise(resolve => setTimeout(resolve, 300));

// Generic API request function
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  // If using mock data, return mock responses
  if (USE_MOCK_DATA) {
    await mockDelay();
    console.log('Using mock data for:', endpoint);
    
    // Parse endpoint and return appropriate mock data
    if (endpoint.includes('/cars')) {
      if (options.method === 'POST') {
        const newCar = { ...JSON.parse(options.body as string), id: Date.now().toString() };
        mockData.cars.push(newCar);
        return newCar;
      }
      if (options.method === 'DELETE') {
        const id = endpoint.split('/').pop();
        mockData.cars = mockData.cars.filter(c => c.id !== id);
        return { success: true };
      }
      return mockData.cars;
    }
    if (endpoint.includes('/trips')) {
      if (endpoint.includes('/stats')) {
        return {
          totalTrips: mockData.trips.length,
          totalDistance: mockData.trips.reduce((sum, t) => sum + t.distance, 0),
          totalDuration: mockData.trips.reduce((sum, t) => sum + t.duration, 0)
        };
      }
      if (options.method === 'POST') {
        const newTrip = { ...JSON.parse(options.body as string), id: Date.now().toString() };
        mockData.trips.push(newTrip);
        return newTrip;
      }
      if (options.method === 'DELETE') {
        const id = endpoint.split('/').pop();
        mockData.trips = mockData.trips.filter(t => t.id !== id);
        return { success: true };
      }
      return mockData.trips;
    }
    if (endpoint.includes('/fuel-entries')) {
      if (options.method === 'POST') {
        const newEntry = { ...JSON.parse(options.body as string), id: Date.now().toString() };
        mockData.fuelEntries.push(newEntry);
        return newEntry;
      }
      if (options.method === 'DELETE') {
        const id = endpoint.split('/').pop();
        mockData.fuelEntries = mockData.fuelEntries.filter(f => f.id !== id);
        return { success: true };
      }
      return mockData.fuelEntries;
    }
    if (endpoint.includes('/maintenance')) {
      if (options.method === 'POST') {
        const newItem = { ...JSON.parse(options.body as string), id: Date.now().toString() };
        mockData.maintenance.push(newItem);
        return newItem;
      }
      if (options.method === 'DELETE') {
        const id = endpoint.split('/').pop();
        mockData.maintenance = mockData.maintenance.filter(m => m.id !== id);
        return { success: true };
      }
      if (endpoint.includes('/complete')) {
        const id = endpoint.split('/')[2];
        const item = mockData.maintenance.find(m => m.id === id);
        if (item) item.status = 'completed';
        return item;
      }
      return mockData.maintenance;
    }
    if (endpoint.includes('/dashboard/stats')) {
      return {
        totalCars: mockData.cars.length,
        totalTrips: mockData.trips.length,
        totalFuelCost: mockData.fuelEntries.reduce((sum, f) => sum + f.totalCost, 0),
        totalMaintenanceCost: mockData.maintenance.reduce((sum, m) => sum + m.cost, 0),
        averageMPG: 28.5,
        thisMonthTrips: mockData.trips.length
      };
    }
    if (endpoint.includes('/dashboard/recent-activity')) {
      return [];
    }
    
    return [];
  }

  // Real API logic (when USE_MOCK_DATA is false)
  const url = `${API_BASE_URL}${endpoint}`;
  
  console.log('Making API request to:', url);
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add timeout to prevent hanging requests
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timeout')), 10000); // 10 second timeout
  });

  try {
    console.log('Starting fetch request...');
    const response = await Promise.race([
      fetch(url, config),
      timeoutPromise
    ]) as Response;
    console.log('Response received:', response.status, response.statusText);
    
    if (!response.ok) {
      console.error('Response not ok:', response.status, response.statusText);
      throw new Error('Network error');
    }
    
    const data = await response.json();
    console.log('Response data:', data);
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw new Error('Network error');
  }
};

// Cars API - matches your endpoints
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
  // Additional endpoints from your documentation
  getByLicensePlate: (licensePlate: string) => apiRequest(`/cars/license-plate/${licensePlate}`),
  getByMake: (make: string) => apiRequest(`/cars/make/${make}`),
  getByMakeModel: (make: string, model: string) => apiRequest(`/cars/make/${make}/model/${model}`),
  getByFuelType: (fuelType: string) => apiRequest(`/cars/fuel-type/${fuelType}`),
  updateMileage: (id: string, mileage: number) => apiRequest(`/cars/${id}/mileage?newMileage=${mileage}`, {
    method: 'PUT',
  }),
  checkExists: (id: string) => apiRequest(`/cars/exists/${id}`),
  checkLicensePlateExists: (licensePlate: string) => apiRequest(`/cars/exists/license-plate/${licensePlate}`),
};

// Trips API - matches your endpoints
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
  // Additional endpoints from your documentation
  getByCar: (carId: string) => apiRequest(`/trips/car/${carId}`),
  getByDate: (date: string) => apiRequest(`/trips/date/${date}`),
  getByDateRange: (startDate: string, endDate: string) => apiRequest(`/trips/date-range?startDate=${startDate}&endDate=${endDate}`),
  getByCarAndDateRange: (carId: string, startDate: string, endDate: string) => apiRequest(`/trips/car/${carId}/date-range?startDate=${startDate}&endDate=${endDate}`),
  getStats: (carId?: string) => {
    const params = carId ? `?carId=${carId}` : '';
    return apiRequest(`/trips/stats${params}`);
  },
  getMonthlyDistance: (carId?: string) => {
    const params = carId ? `?carId=${carId}` : '';
    return apiRequest(`/trips/monthly-distance${params}`);
  },
  getRecentByCar: (carId: string, limit: number = 10) => apiRequest(`/trips/car/${carId}/recent?limit=${limit}`),
  getTotalDistanceByCar: (carId: string) => apiRequest(`/trips/car/${carId}/total-distance`),
  getTotalDurationByCar: (carId: string) => apiRequest(`/trips/car/${carId}/total-duration`),
  getAverageDistanceByCar: (carId: string) => apiRequest(`/trips/car/${carId}/average-distance`),
  updateDistance: (id: string, distance: number) => apiRequest(`/trips/${id}/distance?newDistance=${distance}`, {
    method: 'PUT',
  }),
  updateDuration: (id: string, duration: number) => apiRequest(`/trips/${id}/duration?newDuration=${duration}`, {
    method: 'PUT',
  }),
  checkExists: (id: string) => apiRequest(`/trips/exists/${id}`),
  checkCarHasTrips: (carId: string) => apiRequest(`/trips/car/${carId}/has-trips`),
};

// Fuel API - matches your endpoints
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
  // Additional endpoints from your documentation
  getByCar: (carId: string) => apiRequest(`/fuel-entries/car/${carId}`),
  getByDate: (date: string) => apiRequest(`/fuel-entries/date/${date}`),
  getByDateRange: (startDate: string, endDate: string) => apiRequest(`/fuel-entries/date-range?startDate=${startDate}&endDate=${endDate}`),
  getByCarAndDateRange: (carId: string, startDate: string, endDate: string) => apiRequest(`/fuel-entries/car/${carId}/date-range?startDate=${startDate}&endDate=${endDate}`),
  getByFuelType: (fuelType: string) => apiRequest(`/fuel-entries/fuel-type/${fuelType}`),
  getEfficiency: (carId?: string) => {
    const params = carId ? `?carId=${carId}` : '';
    return apiRequest(`/fuel-entries/efficiency${params}`);
  },
  getMonthlyCosts: (carId?: string) => {
    const params = carId ? `?carId=${carId}` : '';
    return apiRequest(`/fuel-entries/monthly-costs${params}`);
  },
  getRecentByCar: (carId: string, limit: number = 10) => apiRequest(`/fuel-entries/car/${carId}/recent?limit=${limit}`),
  getTotalCostByCar: (carId: string) => apiRequest(`/fuel-entries/car/${carId}/total-cost`),
  getTotalLitersByCar: (carId: string) => apiRequest(`/fuel-entries/car/${carId}/total-liters`),
  getAverageCostPerLiterByCar: (carId: string) => apiRequest(`/fuel-entries/car/${carId}/average-cost-per-liter`),
  updateCost: (id: string, cost: number) => apiRequest(`/fuel-entries/${id}/cost?newCost=${cost}`, {
    method: 'PUT',
  }),
  updateLiters: (id: string, liters: number) => apiRequest(`/fuel-entries/${id}/liters?newLiters=${liters}`, {
    method: 'PUT',
  }),
  checkExists: (id: string) => apiRequest(`/fuel-entries/exists/${id}`),
  checkCarHasEntries: (carId: string) => apiRequest(`/fuel-entries/car/${carId}/has-entries`),
};

// Maintenance API - matches your endpoints
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
  // Additional endpoints from your documentation
  markCompleted: (id: string) => apiRequest(`/maintenance/${id}/complete`, {
    method: 'PUT',
  }),
  getOverdue: () => apiRequest('/maintenance/overdue'),
  getByCar: (carId: string) => apiRequest(`/maintenance/car/${carId}`),
  getByStatus: (status: string) => apiRequest(`/maintenance/status/${status}`),
  getByType: (type: string) => apiRequest(`/maintenance/type/${type}`),
  getByDate: (date: string) => apiRequest(`/maintenance/date/${date}`),
  getByDateRange: (startDate: string, endDate: string) => apiRequest(`/maintenance/date-range?startDate=${startDate}&endDate=${endDate}`),
  getOverdueByCar: (carId: string) => apiRequest(`/maintenance/car/${carId}/overdue`),
  getRecentByCar: (carId: string, limit: number = 10) => apiRequest(`/maintenance/car/${carId}/recent?limit=${limit}`),
  getTotalCostByCar: (carId: string) => apiRequest(`/maintenance/car/${carId}/total-cost`),
  updateCost: (id: string, cost: number) => apiRequest(`/maintenance/${id}/cost?newCost=${cost}`, {
    method: 'PUT',
  }),
  updateMileage: (id: string, mileage: number) => apiRequest(`/maintenance/${id}/mileage?newMileage=${mileage}`, {
    method: 'PUT',
  }),
  checkExists: (id: string) => apiRequest(`/maintenance/exists/${id}`),
  checkCarHasItems: (carId: string) => apiRequest(`/maintenance/car/${carId}/has-items`),
};

// Dashboard API - matches your endpoints
export const dashboardApi = {
  getStats: (carId?: string) => {
    const params = carId ? `?carId=${carId}` : '';
    return apiRequest(`/dashboard/stats${params}`);
  },
  getRecentActivity: (carId?: string) => {
    const params = carId ? `?carId=${carId}` : '';
    return apiRequest(`/dashboard/recent-activity${params}`);
  },
  getSelectedVehicle: (carId?: string) => {
    const params = carId ? `?carId=${carId}` : '';
    return apiRequest(`/dashboard/selected-vehicle${params}`);
  },
  getOverview: () => apiRequest('/dashboard/overview'),
  getAnalytics: (carId?: string) => {
    const params = carId ? `?carId=${carId}` : '';
    return apiRequest(`/dashboard/analytics${params}`);
  },
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
