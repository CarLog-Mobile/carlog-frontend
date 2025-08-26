import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface Trip {
  id: string;
  carId: string;
  date: string;
  startLocation: string;
  endLocation: string;
  distance: number;
  duration: number;
  fuelUsed: number;
  cost: number;
}

export default function TripsScreen({ navigation, route }: any) {
  const [trips, setTrips] = useState<Trip[]>([
    {
      id: '1',
      carId: '1',
      date: '2024-01-15',
      startLocation: 'Home',
      endLocation: 'Work',
      distance: 12.5,
      duration: 25,
      fuelUsed: 0.8,
      cost: 2.40
    },
    {
      id: '2',
      carId: '1',
      date: '2024-01-14',
      startLocation: 'Work',
      endLocation: 'Grocery Store',
      distance: 8.2,
      duration: 18,
      fuelUsed: 0.5,
      cost: 1.50
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newTrip, setNewTrip] = useState({
    startLocation: '',
    endLocation: '',
    distance: '',
    duration: '',
    fuelUsed: '',
    cost: ''
  });

  const addTrip = () => {
    if (!newTrip.startLocation || !newTrip.endLocation || !newTrip.distance) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const trip: Trip = {
      id: Date.now().toString(),
      carId: route.params?.carId || '1',
      date: new Date().toISOString().split('T')[0],
      startLocation: newTrip.startLocation,
      endLocation: newTrip.endLocation,
      distance: parseFloat(newTrip.distance) || 0,
      duration: parseFloat(newTrip.duration) || 0,
      fuelUsed: parseFloat(newTrip.fuelUsed) || 0,
      cost: parseFloat(newTrip.cost) || 0
    };

    setTrips([trip, ...trips]);
    setNewTrip({ startLocation: '', endLocation: '', distance: '', duration: '', fuelUsed: '', cost: '' });
    setShowAddForm(false);
  };

  const deleteTrip = (id: string) => {
    Alert.alert(
      'Delete Trip',
      'Are you sure you want to delete this trip?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setTrips(trips.filter(trip => trip.id !== id)) }
      ]
    );
  };

  const totalDistance = trips.reduce((sum, trip) => sum + trip.distance, 0);
  const totalCost = trips.reduce((sum, trip) => sum + trip.cost, 0);
  const totalFuel = trips.reduce((sum, trip) => sum + trip.fuelUsed, 0);

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
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Distance</Text>
            <Text style={styles.statValue}>{totalDistance.toFixed(1)} mi</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Cost</Text>
            <Text style={styles.statValue}>${totalCost.toFixed(2)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Fuel Used</Text>
            <Text style={styles.statValue}>{totalFuel.toFixed(1)} gal</Text>
          </View>
        </View>

        {/* Trip List */}
        {trips.map((trip) => (
          <TouchableOpacity
            key={trip.id}
            style={styles.tripCard}
            onPress={() => navigation.navigate('Fuel', { tripId: trip.id })}
          >
            <View style={styles.tripCardContent}>
              <View style={styles.tripInfo}>
                <View style={styles.tripRoute}>
                  <Text style={styles.tripLocation}>{trip.startLocation}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#9ca3af" style={styles.tripArrow} />
                  <Text style={styles.tripLocation}>{trip.endLocation}</Text>
                </View>
                <Text style={styles.tripDate}>{trip.date}</Text>
                <View style={styles.tripDetails}>
                  <View style={styles.tripDetail}>
                    <Ionicons name="speedometer" size={14} color="#9ca3af" />
                    <Text style={styles.tripDetailText}>{trip.distance} mi</Text>
                  </View>
                  <View style={styles.tripDetail}>
                    <Ionicons name="time" size={14} color="#9ca3af" />
                    <Text style={styles.tripDetailText}>{trip.duration} min</Text>
                  </View>
                  <View style={styles.tripDetail}>
                    <Ionicons name="card" size={14} color="#9ca3af" />
                    <Text style={styles.tripDetailText}>${trip.cost}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => deleteTrip(trip.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={16} color="white" />
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {showAddForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add New Trip</Text>
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
              placeholder="Distance (miles)"
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
            <TextInput
              style={styles.input}
              placeholder="Fuel Used (gallons)"
              value={newTrip.fuelUsed}
              onChangeText={(text) => setNewTrip({...newTrip, fuelUsed: text})}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Cost ($)"
              value={newTrip.cost}
              onChangeText={(text) => setNewTrip({...newTrip, cost: text})}
              keyboardType="numeric"
            />
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={addTrip}
              >
                <Text style={styles.addButtonText}>Add Trip</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddForm(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!showAddForm && (
          <TouchableOpacity
            style={styles.addNewButton}
            onPress={() => setShowAddForm(true)}
          >
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.addNewButtonText}>Add New Trip</Text>
          </TouchableOpacity>
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
  tripRoute: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tripLocation: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  tripArrow: {
    marginHorizontal: 8,
  },
  tripDate: {
    color: '#6b7280',
    fontSize: 16,
    marginBottom: 8,
  },
  tripDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  tripDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tripDetailText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
    backgroundColor: '#f9fafb',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#0656E0',
    paddingVertical: 12,
    borderRadius: 12,
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
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  cancelButtonText: {
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
  addNewButton: {
    backgroundColor: '#0656E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    marginBottom: 16,
    gap: 8,
  },
  addNewButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
});
