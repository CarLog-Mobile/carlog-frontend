import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet } from 'react-native';

interface Car {
  id: string;
  make: string;
  model: string;
  year: string;
  licensePlate: string;
  mileage: number;
  fuelType: string;
}

export default function CarsScreen({ navigation }: any) {
  const [cars, setCars] = useState<Car[]>([
    {
      id: '1',
      make: 'Toyota',
      model: 'Camry',
      year: '2020',
      licensePlate: 'ABC-123',
      mileage: 45000,
      fuelType: 'Gasoline'
    },
    {
      id: '2',
      make: 'Honda',
      model: 'Civic',
      year: '2019',
      licensePlate: 'XYZ-789',
      mileage: 32000,
      fuelType: 'Gasoline'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    mileage: '',
    fuelType: 'Gasoline'
  });

  const addCar = () => {
    if (!newCar.make || !newCar.model || !newCar.year || !newCar.licensePlate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const car: Car = {
      id: Date.now().toString(),
      make: newCar.make,
      model: newCar.model,
      year: newCar.year,
      licensePlate: newCar.licensePlate,
      mileage: parseInt(newCar.mileage) || 0,
      fuelType: newCar.fuelType
    };

    setCars([...cars, car]);
    setNewCar({ make: '', model: '', year: '', licensePlate: '', mileage: '', fuelType: 'Gasoline' });
    setShowAddForm(false);
  };

  const deleteCar = (id: string) => {
    Alert.alert(
      'Delete Car',
      'Are you sure you want to delete this car?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setCars(cars.filter(car => car.id !== id)) }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {cars.map((car) => (
          <TouchableOpacity
            key={car.id}
            style={styles.carCard}
            onPress={() => navigation.navigate('Trips', { carId: car.id })}
          >
            <View style={styles.carCardContent}>
              <View style={styles.carInfo}>
                <Text style={styles.carTitle}>{car.make} {car.model}</Text>
                <Text style={styles.carDetails}>{car.year} • {car.licensePlate}</Text>
                <Text style={styles.carMileage}>{car.mileage.toLocaleString()} miles • {car.fuelType}</Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteCar(car.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {showAddForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add New Car</Text>
            <TextInput
              style={styles.input}
              placeholder="Make (e.g., Toyota)"
              value={newCar.make}
              onChangeText={(text) => setNewCar({...newCar, make: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Model (e.g., Camry)"
              value={newCar.model}
              onChangeText={(text) => setNewCar({...newCar, model: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Year"
              value={newCar.year}
              onChangeText={(text) => setNewCar({...newCar, year: text})}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="License Plate"
              value={newCar.licensePlate}
              onChangeText={(text) => setNewCar({...newCar, licensePlate: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Current Mileage"
              value={newCar.mileage}
              onChangeText={(text) => setNewCar({...newCar, mileage: text})}
              keyboardType="numeric"
            />
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={addCar}
              >
                <Text style={styles.addButtonText}>Add Car</Text>
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
            <Text style={styles.addNewButtonText}>+ Add New Car</Text>
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
  carCard: {
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
  carCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  carInfo: {
    flex: 1,
  },
  carTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  carDetails: {
    fontSize: 16,
    color: '#6b7280',
  },
  carMileage: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 4,
  },
  deleteButton: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
  },
  deleteButtonText: {
    color: 'white',
    fontSize: 12,
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
    backgroundColor: '#3b82f6',
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
    backgroundColor: '#3b82f6',
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
