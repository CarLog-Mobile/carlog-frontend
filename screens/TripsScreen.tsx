import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet } from 'react-native';

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
      <ScrollView style={styles.scrollView}>
        {/* Summary Cards */}
        <View style={styles.summaryCards}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Distance</Text>
            <Text style={styles.summaryValue}>{totalDistance.toFixed(1)} mi</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Cost</Text>
            <Text style={styles.summaryValueCost}>${totalCost.toFixed(2)}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Fuel Used</Text>
            <Text style={styles.summaryValueFuel}>{totalFuel.toFixed(1)} gal</Text>
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
                  <Text style={styles.tripArrow}>→</Text>
                  <Text style={styles.tripLocation}>{trip.endLocation}</Text>
                </View>
                <Text style={styles.tripDate}>{trip.date}</Text>
                <View style={styles.tripDetails}>
                  <Text style={styles.tripDetail}>{trip.distance} mi</Text>
                  <Text style={styles.tripDetail}>{trip.duration} min</Text>
                  <Text style={styles.tripDetail}>${trip.cost}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => deleteTrip(trip.id)}
                style={styles.deleteButton}
              >
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
            <Text style={styles.addNewButtonText}>+ Add New Trip</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },

  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  summaryCards: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  summaryLabel: {
    color: '#6b7280',
    fontSize: 12,
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2563eb',
  },
  summaryValueCost: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#059669',
  },
  summaryValueFuel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ea580c',
  },
  tripCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
    color: '#9ca3af',
    marginHorizontal: 8,
  },
  tripDate: {
    color: '#6b7280',
    fontSize: 16,
  },
  tripDetails: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  tripDetail: {
    color: '#9ca3af',
    fontSize: 14,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 10,
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    fontSize: 16,
  },
  formButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#2563eb',
    paddingVertical: 8,
    borderRadius: 4,
  },
  addButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#d1d5db',
    paddingVertical: 8,
    borderRadius: 4,
  },
  cancelButtonText: {
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
  },
  addNewButton: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  addNewButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
});
