# CarLog - Vehicle Management App

A comprehensive React Native/Expo application for tracking and managing vehicle information, trips, fuel consumption, maintenance, and real-time OBD diagnostics.

## Features

### 🚗 Vehicle Management
- Add and manage multiple vehicles
- Track vehicle details (make, model, year, license plate, mileage, fuel type)
- Delete vehicles with confirmation

### 🗺️ Trip Tracking
- Record driving trips with start/end locations
- Track distance, duration, fuel used, and cost
- View trip history and statistics
- Summary cards showing total distance, cost, and fuel consumption

### ⛽ Fuel Tracker
- Log fuel purchases with gallons, cost per gallon, and total cost
- Track current mileage at each fill-up
- Monitor fuel consumption patterns
- Calculate average cost per gallon
- Support for different fuel types (Regular, Premium)

### 🔧 Maintenance Manager
- Schedule and track vehicle maintenance
- Different maintenance types (oil change, tire rotation, brake service, inspection, other)
- Mark maintenance items as completed
- Track maintenance costs
- Set next due mileage/date reminders
- Status indicators (completed, scheduled, overdue)

### 📊 OBD Live Diagnostics
- Real-time vehicle data monitoring (simulated)
- Engine RPM, speed, temperature, fuel level, battery voltage
- Engine load, throttle position, oil pressure
- Check engine light status and error codes
- Data recording capabilities
- Visual status indicators (green/yellow/red)

### 📱 Dashboard
- Overview of all vehicle statistics
- Quick action buttons for common tasks
- Recent activity feed
- Performance metrics (average MPG, monthly trips)
- Summary cards for cars, trips, fuel costs, and maintenance

## Technical Stack

- **Framework**: React Native with Expo
- **Language**: TypeScript
- **Styling**: React Native StyleSheet (with some Tailwind CSS classes)
- **Navigation**: Custom sidebar navigation
- **State Management**: React useState hooks

## Project Structure

```
my-expo-app/
├── App.tsx                 # Main app with navigation
├── screens/
│   ├── DashboardScreen.tsx # Main dashboard
│   ├── CarsScreen.tsx      # Vehicle management
│   ├── TripsScreen.tsx     # Trip tracking
│   ├── FuelScreen.tsx      # Fuel consumption
│   ├── MaintenanceScreen.tsx # Maintenance tracking
│   └── OBDLiveScreen.tsx   # OBD diagnostics
├── components/             # Reusable components
├── types/                  # TypeScript type definitions
└── assets/                 # Images and icons
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd my-expo-app
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

5. Run on your preferred platform:
   - **iOS**: Press `i` in the terminal or scan QR code with Expo Go app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

## Usage

### Navigation
- Use the hamburger menu (☰) to access the sidebar navigation
- Navigate between different screens: Dashboard, Cars, Trips, Fuel, Maintenance, OBD Live

### Adding Data
- Each screen has an "Add New" button to create new entries
- Fill in the required fields in the form
- Tap "Add" to save the entry

### Managing Data
- Tap on existing entries to view details
- Use the "Delete" button to remove entries (with confirmation)
- For maintenance items, use "Complete" to mark as done

### OBD Live Features
- Tap "Connect OBD" to simulate device connection
- View real-time vehicle data (simulated)
- Use "Start Recording" to capture data points
- Monitor various engine parameters and status indicators

## Data Management

Currently, the app uses local state management with React hooks. All data is stored in memory and will be lost when the app is closed. For production use, consider implementing:

- AsyncStorage for local persistence
- SQLite database for complex queries
- Backend API integration for cloud storage
- Real OBD-II device integration

## Future Enhancements

- [ ] Data persistence with AsyncStorage
- [ ] Real OBD-II device integration
- [ ] Push notifications for maintenance reminders
- [ ] Export data to CSV/PDF
- [ ] Charts and analytics
- [ ] Multiple user support
- [ ] Offline mode
- [ ] Dark theme support

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please open an issue in the repository.
