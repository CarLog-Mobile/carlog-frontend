import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>My Cars</Text>
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
            <Text style={styles.statLabel}>Total Cars</Text>
            <Text style={styles.statValue}>{cars.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Mileage</Text>
            <Text style={styles.statValue}>{cars.reduce((sum, car) => sum + car.mileage, 0).toLocaleString()}</Text>
          </View>
        </View>

        {/* Cars List */}
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
                <TouchableOpacity style={styles.detailsButton}>
                  <Ionicons name="eye-outline" size={16} color="#1f2937" />
                  <Text style={styles.detailsButtonText}>View Details</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.carImage}>
                <View style={styles.imagePlaceholder}>
                  <Ionicons name="car" size={40} color="#9ca3af" />
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => deleteCar(car.id)}
              style={styles.deleteButton}
            >
              <Ionicons name="trash-outline" size={16} color="white" />
              <Text style={styles.deleteButtonText}>Delete</Text>
            </TouchableOpacity>
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
            <Ionicons name="add" size={24} color="white" />
            <Text style={styles.addNewButtonText}>Add New Car</Text>
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
  carCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  carCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  carInfo: {
    flex: 1,
  },
  carTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  carDetails: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  carMileage: {
    fontSize: 14,
    color: '#9ca3af',
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
  carImage: {
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
