Car Endpoints (/api/cars)
Basic CRUD Operations
GET /api/cars - Get all cars
GET /api/cars/{id} - Get car by ID
POST /api/cars - Create new car
PUT /api/cars/{id} - Update car
DELETE /api/cars/{id} - Delete car
Search & Filter Operations
GET /api/cars/license-plate/{licensePlate} - Get car by license plate
GET /api/cars/make/{make} - Get cars by make
GET /api/cars/make/{make}/model/{model} - Get cars by make and model
GET /api/cars/fuel-type/{fuelType} - Get cars by fuel type
GET /api/cars/mileage-range?minMileage={min}&maxMileage={max} - Get cars by mileage range
GET /api/cars/year-range?startYear={start}&endYear={end} - Get cars by year range
GET /api/cars/search?term={searchTerm} - Search cars
Utility Operations
PUT /api/cars/{id}/mileage?newMileage={mileage} - Update car mileage
GET /api/cars/exists/license-plate/{licensePlate} - Check if car exists by license plate
GET /api/cars/exists/{id} - Check if car exists by ID
Statistics
GET /api/cars/stats/total-distance - Get cars with total distance
GET /api/cars/stats/total-fuel-cost - Get cars with total fuel cost
GET /api/cars/overdue-maintenance - Get cars with overdue maintenance
Trip Endpoints (/api/trips)
Basic CRUD Operations
GET /api/trips?carId={carId} - Get all trips (optional carId filter)
GET /api/trips/{id} - Get trip by ID
POST /api/trips - Create new trip
PUT /api/trips/{id} - Update trip
DELETE /api/trips/{id} - Delete trip
Filter Operations
GET /api/trips/car/{carId} - Get trips by car ID
GET /api/trips/date/{date} - Get trips by date
GET /api/trips/date-range?startDate={start}&endDate={end} - Get trips by date range
GET /api/trips/car/{carId}/date-range?startDate={start}&endDate={end} - Get trips by car and date range
GET /api/trips/distance-range?minDistance={min}&maxDistance={max} - Get trips by distance range
GET /api/trips/duration-range?minDuration={min}&maxDuration={max} - Get trips by duration range
GET /api/trips/location/{location} - Get trips by location
GET /api/trips/search?term={searchTerm} - Search trips by location
Statistics
GET /api/trips/stats?carId={carId} - Get trip statistics
GET /api/trips/monthly-distance?carId={carId} - Get monthly distance statistics
GET /api/trips/car/{carId}/recent?limit={limit} - Get recent trips for a car
GET /api/trips/car/{carId}/total-distance - Get total distance for a car
GET /api/trips/car/{carId}/total-duration - Get total duration for a car
GET /api/trips/car/{carId}/average-distance - Get average distance for a car
Utility Operations
PUT /api/trips/{id}/distance?newDistance={distance} - Update trip distance
PUT /api/trips/{id}/duration?newDuration={duration} - Update trip duration
GET /api/trips/exists/{id} - Check if trip exists by ID
GET /api/trips/car/{carId}/has-trips - Check if car has trips
Fuel Entry Endpoints (/api/fuel-entries)
Basic CRUD Operations
GET /api/fuel-entries?carId={carId} - Get all fuel entries (optional carId filter)
GET /api/fuel-entries/{id} - Get fuel entry by ID
POST /api/fuel-entries - Create new fuel entry
PUT /api/fuel-entries/{id} - Update fuel entry
DELETE /api/fuel-entries/{id} - Delete fuel entry
Filter Operations
GET /api/fuel-entries/car/{carId} - Get fuel entries by car ID
GET /api/fuel-entries/date/{date} - Get fuel entries by date
GET /api/fuel-entries/date-range?startDate={start}&endDate={end} - Get fuel entries by date range
GET /api/fuel-entries/car/{carId}/date-range?startDate={start}&endDate={end} - Get fuel entries by car and date range
GET /api/fuel-entries/fuel-type/{fuelType} - Get fuel entries by fuel type
GET /api/fuel-entries/cost-range?minCost={min}&maxCost={max} - Get fuel entries by cost range
GET /api/fuel-entries/liters-range?minLiters={min}&maxLiters={max} - Get fuel entries by liters range
GET /api/fuel-entries/cost-per-liter-range?minCostPerLiter={min}&maxCostPerLiter={max} - Get fuel entries by cost per liter range
Statistics
GET /api/fuel-entries/efficiency?carId={carId} - Get fuel efficiency
GET /api/fuel-entries/monthly-costs?carId={carId} - Get monthly fuel cost statistics
GET /api/fuel-entries/car/{carId}/recent?limit={limit} - Get recent fuel entries for a car
GET /api/fuel-entries/car/{carId}/total-cost - Get total fuel cost for a car
GET /api/fuel-entries/car/{carId}/total-liters - Get total liters for a car
GET /api/fuel-entries/car/{carId}/average-cost-per-liter - Get average cost per liter for a car
GET /api/fuel-entries/car/{carId}/ordered-by-cost-per-liter?ascending={true/false} - Get fuel entries ordered by cost per liter
Utility Operations
PUT /api/fuel-entries/{id}/cost?newCost={cost} - Update fuel entry cost
PUT /api/fuel-entries/{id}/liters?newLiters={liters} - Update fuel entry liters
GET /api/fuel-entries/exists/{id} - Check if fuel entry exists by ID
GET /api/fuel-entries/car/{carId}/has-entries - Check if car has fuel entries
Maintenance Endpoints (/api/maintenance)
Basic CRUD Operations
GET /api/maintenance?carId={carId} - Get all maintenance items (optional carId filter)
GET /api/maintenance/{id} - Get maintenance item by ID
POST /api/maintenance - Create new maintenance item
PUT /api/maintenance/{id} - Update maintenance item
DELETE /api/maintenance/{id} - Delete maintenance item
Special Operations
PUT /api/maintenance/{id}/complete - Mark maintenance item as completed
GET /api/maintenance/overdue - Get overdue maintenance items
Filter Operations
GET /api/maintenance/car/{carId} - Get maintenance items by car ID
GET /api/maintenance/status/{status} - Get maintenance items by status
GET /api/maintenance/type/{type} - Get maintenance items by type
GET /api/maintenance/date/{date} - Get maintenance items by date
GET /api/maintenance/date-range?startDate={start}&endDate={end} - Get maintenance items by date range
GET /api/maintenance/cost-range?minCost={min}&maxCost={max} - Get maintenance items by cost range
GET /api/maintenance/mileage-range?minMileage={min}&maxMileage={max} - Get maintenance items by mileage range
GET /api/maintenance/search?term={searchTerm} - Search maintenance items by title
Statistics
GET /api/maintenance/car/{carId}/overdue - Get overdue maintenance items for a car
GET /api/maintenance/car/{carId}/recent?limit={limit} - Get recent maintenance items for a car
GET /api/maintenance/car/{carId}/total-cost - Get total maintenance cost for a car
GET /api/maintenance/car/{carId}/cost-by-type - Get maintenance cost by type for a car
GET /api/maintenance/car/{carId}/count-by-status - Get maintenance item count by status for a car
GET /api/maintenance/car/{carId}/count-by-type - Get maintenance item count by type for a car
GET /api/maintenance/upcoming?startDate={start}&endDate={end}&startMileage={start}&endMileage={end} - Get upcoming maintenance items
Utility Operations
PUT /api/maintenance/{id}/cost?newCost={cost} - Update maintenance item cost
PUT /api/maintenance/{id}/mileage?newMileage={mileage} - Update maintenance item mileage
GET /api/maintenance/exists/{id} - Check if maintenance item exists by ID
GET /api/maintenance/car/{carId}/has-items - Check if car has maintenance items
Dashboard Endpoints (/api/dashboard)
Statistics & Overview
GET /api/dashboard/stats?carId={carId} - Get dashboard statistics (optional carId filter)
GET /api/dashboard/recent-activity?carId={carId} - Get recent activity (optional carId filter)
GET /api/dashboard/selected-vehicle?carId={carId} - Get selected vehicle info
GET /api/dashboard/overview - Get dashboard overview
GET /api/dashboard/analytics?carId={carId} - Get analytics data (optional carId filter)