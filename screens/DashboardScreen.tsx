import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { carsApi, tripsApi, fuelApi, dashboardApi } from '../services/api';

const { width } = Dimensions.get('window');

interface DashboardStats {
  totalCars: number;
  totalTrips: number;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  averageMPG: number;
  thisMonthTrips: number;
}

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

export default function DashboardScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([]);
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalCars: 0,
    totalTrips: 0,
    totalFuelCost: 0,
    totalMaintenanceCost: 0,
    averageMPG: 0,
    thisMonthTrips: 0
  });

  // Load dashboard data when component mounts
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Load all data in parallel
      const [carsData, tripsData, fuelData] = await Promise.all([
        carsApi.getAll(),
        tripsApi.getAll(),
        fuelApi.getAll()
      ]);

      setCars(carsData || []);
      setTrips(tripsData || []);
      setFuelEntries(fuelData || []);

      // Set selected car (first car if available)
      if (carsData && carsData.length > 0) {
        setSelectedCar(carsData[0]);
      }

      // Calculate stats with null safety
      const totalFuelCost = (fuelData || []).reduce((sum: number, entry: FuelEntry) => sum + (entry.totalCost || 0), 0);
      const totalDistance = (tripsData || []).reduce((sum: number, trip: Trip) => sum + (trip.distance || 0), 0);
      const thisMonth = new Date().getMonth();
      const thisMonthTrips = (tripsData || []).filter((trip: Trip) => {
        const tripMonth = new Date(trip.date).getMonth();
        return tripMonth === thisMonth;
      }).length;

      setStats({
        totalCars: (carsData || []).length,
        totalTrips: (tripsData || []).length,
        totalFuelCost,
        totalMaintenanceCost: 0, // TODO: Add maintenance API
        averageMPG: totalDistance > 0 ? totalDistance / (totalFuelCost / 100) : 0, // Rough calculation
        thisMonthTrips
      });

    } catch (err) {
      // Don't show error for empty data, just set empty arrays
      console.error('Error loading dashboard data:', err);
      setCars([]);
      setTrips([]);
      setFuelEntries([]);
      setSelectedCar(null);
      setStats({
        totalCars: 0,
        totalTrips: 0,
        totalFuelCost: 0,
        totalMaintenanceCost: 0,
        averageMPG: 0,
        thisMonthTrips: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { title: 'Fuel', icon: 'water' as const, onPress: () => navigation.navigate('Fuel', { carId: selectedCar?.id }) },
    { title: 'Trips', icon: 'map' as const, onPress: () => navigation.navigate('Trips', { carId: selectedCar?.id }) },
    { title: 'Repair', icon: 'construct' as const, onPress: () => navigation.navigate('Maintenance', { carId: selectedCar?.id }) },
    { title: 'Settings', icon: 'settings' as const, onPress: () => navigation.navigate('Settings') },
  ];

  // Generate recent activity from trips and fuel entries
  const generateRecentActivity = () => {
    const activities = [];

    // Add recent trips
    const recentTrips = (trips || [])
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map(trip => ({
        type: 'trip',
        title: `${trip.startLocation || 'Unknown'} → ${trip.endLocation || 'Unknown'}`,
        time: getTimeAgo(new Date(trip.date)),
        icon: 'car' as const,
        color: '#3b82f6'
      }));

    // Add recent fuel entries
    const recentFuel = (fuelEntries || [])
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map(entry => ({
        type: 'fuel',
        title: `Fuel refill - LKR ${(entry.totalCost || 0).toFixed(2)}`,
        time: getTimeAgo(new Date(entry.date)),
        icon: 'water' as const,
        color: '#f59e0b'
      }));

    // Combine and sort by date
    const allActivities = [...recentTrips, ...recentFuel]
      .sort((a, b) => {
        const aTime = new Date(a.time.includes('ago') ? a.time : a.time).getTime();
        const bTime = new Date(b.time.includes('ago') ? b.time : b.time).getTime();
        return bTime - aTime;
      })
      .slice(0, 4);

    return allActivities;
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return '1 day ago';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return `${Math.floor(diffInHours / 24 / 7)} weeks ago`;
  };

  const recentActivity = generateRecentActivity();

  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading dashboard...</Text>
        </View>
      </View>
    );
  }

  // Show error state only for actual network errors
  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Dashboard</Text>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconButton} onPress={loadDashboardData}>
              <Ionicons name="refresh" size={20} color="#1f2937" />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={48} color="#ef4444" />
          <Text style={styles.errorText}>Network connection issue</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadDashboardData}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={20} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={20} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
                 {/* Stats Cards */}
         <View style={styles.statsRow}>
           <View style={styles.statCard}>
             <Text style={styles.statLabel}>Trips</Text>
             <Text style={styles.statValue}>{stats.totalTrips || 0}</Text>
           </View>
           <View style={styles.statCard}>
             <Text style={styles.statLabel}>Total Distance</Text>
             <Text style={styles.statValue}>{(trips || []).length > 0 ? `${(trips || []).reduce((sum, trip) => sum + (trip.distance || 0), 0).toFixed(0)} km` : '0 km'}</Text>
           </View>
         </View>

                 {/* Currently Selected Vehicle - Only show if there are cars */}
         {(cars || []).length > 0 && selectedCar && (
          <View style={styles.vehicleSection}>
            <View style={styles.vehicleHeader}>
              <Text style={styles.vehicleHeaderTitle}>Currently Selected</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Cars')}>
                <Text style={styles.changeVehicleText}>Change vehicle</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.vehicleCard}>
              <View style={styles.vehicleContent}>
                <View style={styles.vehicleInfo}>
                                     <Text style={styles.vehicleName}>{selectedCar.make || 'Unknown'} {selectedCar.model || 'Unknown'}</Text>
                   <Text style={styles.vehicleYear}>{selectedCar.year || 'Unknown'}</Text>
                   <Text style={styles.vehiclePlate}>{selectedCar.licensePlate || 'Not specified'}</Text>
                  <TouchableOpacity style={styles.detailsButton} onPress={() => navigation.navigate('Cars')}>
                    <Ionicons name="eye-outline" size={16} color="#1f2937" />
                    <Text style={styles.detailsButtonText}>Details</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.vehicleImage}>
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="car" size={40} color="#9ca3af" />
                  </View>
                </View>
              </View>
            </View>
          </View>
        )}

                 {/* No Cars Message */}
         {(cars || []).length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>No vehicles yet</Text>
            <Text style={styles.emptySubtext}>Add your first car to get started</Text>
            <TouchableOpacity style={styles.addFirstButton} onPress={() => navigation.navigate('Cars')}>
              <Text style={styles.addFirstButtonText}>Add First Car</Text>
            </TouchableOpacity>
          </View>
        )}

                 {/* Quick Actions */}
         <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Cars')}>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.quickActionsGrid}>
              {quickActions.map((action, index) => (
                <View key={index} style={styles.quickActionContainer}>
                  <TouchableOpacity
                    style={styles.quickActionCard}
                    onPress={action.onPress}
                  >
                    <Ionicons name={action.icon} size={36} color="#0656E0" style={styles.quickActionIcon} />
                  </TouchableOpacity>
                  <Text style={styles.quickActionText}>{action.title}</Text>
                </View>
              ))}
            </View>
          </View>

                 {/* Recent Activity - Only show if there are activities */}
         {(recentActivity || []).length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Trips')}>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>
            {recentActivity.slice(0, 2).map((activity, index) => (
              <View key={index} style={styles.activityItem}>
                <Ionicons name={activity.icon} size={20} color={activity.color} style={styles.activityIcon} />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityTime}>{activity.time}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

                 {/* No Activity Message */}
         {(recentActivity || []).length === 0 && (cars || []).length > 0 && (
          <View style={styles.emptyActivityContainer}>
            <Ionicons name="time-outline" size={48} color="#9ca3af" />
            <Text style={styles.emptyActivityText}>No recent activity</Text>
            <Text style={styles.emptyActivitySubtext}>Start adding trips and fuel entries to see activity here</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingLeft: 5,
    paddingRight: 5,
  },

  header: {
    backgroundColor: 'transparent',
    paddingTop: 48,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerContent: {
    flex: 1,
  },
  headerTitle: {
    color: '#1f2937',
    fontSize: 30,
    fontFamily: 'Poppins-SemiBold',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  iconButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
  },
  profileButton: {
    backgroundColor: '#0656E0',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
  },

  // Loading and Error States
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },

  // Empty States
  emptyContainer: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 32,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  addFirstButton: {
    backgroundColor: '#059669',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  addFirstButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyActivityContainer: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 24,
    marginBottom: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyActivityText: {
    marginTop: 12,
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  emptyActivitySubtext: {
    marginTop: 4,
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    gap: 8,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    flex: 1,
    alignItems: 'flex-start',
  },
  statValue: {
    fontSize: 28,
    fontFamily: 'Coinbase-Sans-Medium',
    color: '#1f2937',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Coinbase-Sans-Medium',
  },
  vehicleSection: {
    marginBottom: 24,
  },
  vehicleCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  changeVehicleText: {
    fontSize: 16,
    fontFamily: 'Coinbase-Sans-Medium',
    color: '#0656E0',
    fontWeight: '500',
  },
  vehicleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  vehicleYear: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 12,
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    gap: 6,
  },
  detailsButtonText: {
    fontSize: 14,
    color: '#1f2937',
    fontWeight: '500',
  },
  vehicleImage: {
    width: 80,
    height: 60,
    marginLeft: 16,
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  viewAllText: {
    fontSize: 16,
    color: '#0656E0',
    fontWeight: '500',
    fontFamily: 'Coinbase-Sans-Medium',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionContainer: {
    alignItems: 'center',
    width: '22%',
  },
  quickActionCard: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    height: 80,
    marginBottom: 8,
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  quickActionText: {
    color: '#1f2937',
    fontSize: 14,
    fontFamily: 'Coinbase-Sans-Medium',
    fontWeight: '500',
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },

  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginBottom: 8,
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  activityTime: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
});
