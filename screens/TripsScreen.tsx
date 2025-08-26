import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet, Dimensions, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { tripsApi } from '../services/api';

const { width } = Dimensions.get('window');

interface Trip {
  id: string;
  carId: string;
  date: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  duration: number;
}

export default function TripsScreen({ navigation, route }: any) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingTrip, setAddingTrip] = useState(false);
  const [newTrip, setNewTrip] = useState({
    startLocation: '',
    endLocation: '',
    distance: '',
    duration: ''
  });

  // Load trips from API when component mounts
  useEffect(() => {
    loadTrips();
  }, []);

  const loadTrips = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await tripsApi.getAll(route.params?.carId);
      setTrips(data);
    } catch (err) {
      // Don't show error for empty data, just set empty array
      console.error('Error loading trips:', err);
      setTrips([]);
    } finally {
      setLoading(false);
    }
  };

  const addTrip = async () => {
    if (!newTrip.startLocation || !newTrip.endLocation || !newTrip.distance) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setAddingTrip(true);
      const tripData = {
        carId: route.params?.carId || '1',
        date: new Date().toISOString().split('T')[0],
        startLocation: newTrip.startLocation,
        endLocation: newTrip.endLocation,
        distance: parseFloat(newTrip.distance) || 0,
        duration: parseFloat(newTrip.duration) || 0
      };

      const newTripResponse = await tripsApi.create(tripData);
      setTrips([newTripResponse, ...trips]);
      setNewTrip({ startLocation: '', endLocation: '', distance: '', duration: '' });
      setShowAddModal(false);
    } catch (err) {
      Alert.alert('Error', 'Network error');
      console.error('Error adding trip:', err);
    } finally {
      setAddingTrip(false);
    }
  };

  const deleteTrip = async (id: string) => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
                         try {
               await tripsApi.delete(id);
               setTrips(trips.filter(trip => trip.id !== id));
             } catch (err) {
               Alert.alert('Error', 'Network error');
               console.error('Error deleting trip:', err);
             }
          }
        }
      ]
    );
  };

  // Calculate trip statistics
  const calculateTripStats = () => {
    if (trips.length === 0) return { totalDistance: 0, avgDistance: 0, totalDuration: 0, avgDuration: 0 };
    
    const totalDistance = trips.reduce((sum, trip) => sum + trip.distance, 0);
    const totalDuration = trips.reduce((sum, trip) => sum + trip.duration, 0);
    const avgDistance = totalDistance / trips.length;
    const avgDuration = totalDuration / trips.length;
    
    return { totalDistance, avgDistance, totalDuration, avgDuration };
  };

  // Calculate monthly distance traveled
  const calculateMonthlyDistance = () => {
    const monthlyData: { [key: string]: number } = {};
    
    trips.forEach(trip => {
      const month = trip.date.substring(0, 7); // YYYY-MM format
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      monthlyData[month] += trip.distance;
    });
    
    return Object.entries(monthlyData)
      .map(([month, distance]) => ({ month, distance }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months
  };

  const tripStats = calculateTripStats();
  const monthlyDistance = calculateMonthlyDistance();

  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>Trip Logs</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading trips...</Text>
        </View>
      </View>
    );
  }



  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Trip Logs</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={20} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="filter" size={20} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerAddButton} onPress={() => setShowAddModal(true)}>
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Charts Section */}
        <View style={styles.chartsSection}>
          {/* Monthly Distance Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Monthly Distance (km)</Text>
            <View style={styles.chartContainer}>
              {monthlyDistance.length > 0 ? (
                <View style={styles.barChart}>
                  {monthlyDistance.map((item, index) => (
                    <View key={index} style={styles.barContainer}>
                      <View style={styles.barWrapper}>
                        <View 
                          style={[
                            styles.bar, 
                            { 
                              height: Math.min(item.distance * 2, 120),
                              backgroundColor: '#0656E0'
                            }
                          ]}
                        />
                      </View>
                      <Text style={styles.barLabel}>{item.distance.toFixed(0)}</Text>
                      <Text style={styles.barDate}>{item.month.split('-')[1]}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noDataText}>Add trips to see monthly distance data</Text>
              )}
            </View>
          </View>

          {/* Trip Statistics Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Trip Statistics</Text>
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Distance</Text>
                               <Text style={styles.statValue}>{(tripStats.totalDistance || 0).toFixed(1)} km</Text>
             </View>
             <View style={styles.statItem}>
               <Text style={styles.statLabel}>Avg Distance</Text>
               <Text style={styles.statValue}>{(tripStats.avgDistance || 0).toFixed(1)} km</Text>
             </View>
             <View style={styles.statItem}>
               <Text style={styles.statLabel}>Total Duration</Text>
               <Text style={styles.statValue}>{(tripStats.totalDuration || 0).toFixed(0)} min</Text>
             </View>
             <View style={styles.statItem}>
               <Text style={styles.statLabel}>Avg Duration</Text>
               <Text style={styles.statValue}>{(tripStats.avgDuration || 0).toFixed(0)} min</Text>
             </View>
            </View>
          </View>
        </View>

        {/* Trip Entries */}
        {trips.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="map-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>No trips yet</Text>
            <Text style={styles.emptySubtext}>Add your first trip to get started</Text>
            <TouchableOpacity style={styles.addFirstButton} onPress={() => setShowAddModal(true)}>
              <Text style={styles.addFirstButtonText}>Add First Trip</Text>
            </TouchableOpacity>
          </View>
        ) : (
          trips.map((trip) => (
            <TouchableOpacity
              key={trip.id}
              style={styles.tripCard}
              onPress={() => navigation.navigate('Fuel', { tripId: trip.id })}
            >
              <View style={styles.tripCardContent}>
                <View style={styles.tripInfo}>
                  <View style={styles.tripHeader}>
                    <Text style={styles.tripDate}>{trip.date}</Text>
                  </View>
                  <View style={styles.tripRoute}>
                    <Text style={styles.tripLocation}>{trip.startLocation}</Text>
                    <Ionicons name="arrow-forward" size={16} color="#9ca3af" style={styles.tripArrow} />
                    <Text style={styles.tripLocation}>{trip.endLocation}</Text>
                  </View>
                                     <View style={styles.tripDetails}>
                     <View style={styles.tripDetail}>
                       <Ionicons name="speedometer" size={14} color="#9ca3af" />
                       <Text style={styles.tripDetailText}>{(trip.distance || 0)} km</Text>
                     </View>
                     <View style={styles.tripDetail}>
                       <Ionicons name="time" size={14} color="#9ca3af" />
                       <Text style={styles.tripDetailText}>{(trip.duration || 0)} min</Text>
                     </View>
                   </View>
                </View>
                <TouchableOpacity
                  onPress={() => deleteTrip(trip.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={14} color="white" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Add Trip Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Trip Entry</Text>
              <TouchableOpacity
                onPress={() => setShowAddModal(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <TextInput
                style={styles.input}
                placeholder="Start Location"
                value={newTrip.startLocation}
                onChangeText={(text) => setNewTrip({...newTrip, startLocation: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="End Location"
                value={newTrip.endLocation}
                onChangeText={(text) => setNewTrip({...newTrip, endLocation: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Distance (km)"
                value={newTrip.distance}
                onChangeText={(text) => setNewTrip({...newTrip, distance: text})}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Duration (minutes)"
                value={newTrip.duration}
                onChangeText={(text) => setNewTrip({...newTrip, duration: text})}
                keyboardType="numeric"
              />
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
                disabled={addingTrip}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addButton, addingTrip && styles.addButtonDisabled]}
                onPress={addTrip}
                disabled={addingTrip}
              >
                {addingTrip ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.addButtonText}>Add Entry</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  headerAddButton: {
    backgroundColor: '#059669',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 36,
    height: 36,
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 60,
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

  // Charts Section
  chartsSection: {
    marginBottom: 24,
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  chartContainer: {
    height: 140,
    justifyContent: 'center',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  barDate: {
    fontSize: 10,
    color: '#6b7280',
  },
  noDataText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },

  // Trip Cards
  tripCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  tripCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  tripInfo: {
    flex: 1,
  },
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  tripRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripLocation: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
  },
  tripArrow: {
    marginHorizontal: 8,
  },
  tripDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: '45%',
  },
  tripDetailText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    width: 32,
    height: 32,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    minHeight: '60%',
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  closeButton: {
    padding: 4,
  },
  modalScrollView: {
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  addButton: {
    flex: 1,
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
