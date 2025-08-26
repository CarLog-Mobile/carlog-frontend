import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet, Dimensions, Modal, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { carsApi } from '../services/api';

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
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addingCar, setAddingCar] = useState(false);
  const [newCar, setNewCar] = useState({
    make: '',
    model: '',
    year: '',
    licensePlate: '',
    mileage: '',
    fuelType: 'Gasoline'
  });

  // Load cars from API when component mounts
  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await carsApi.getAll();
      setCars(data);
    } catch (err) {
      // Don't show error for empty data, just set empty array
      console.error('Error loading cars:', err);
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const addCar = async () => {
    if (!newCar.make || !newCar.model || !newCar.year || !newCar.licensePlate) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setAddingCar(true);
      const carData = {
        make: newCar.make,
        model: newCar.model,
        year: newCar.year,
        licensePlate: newCar.licensePlate,
        mileage: parseInt(newCar.mileage) || 0,
        fuelType: newCar.fuelType
      };

      const newCarResponse = await carsApi.create(carData);
      setCars([...cars, newCarResponse]);
      setNewCar({ make: '', model: '', year: '', licensePlate: '', mileage: '', fuelType: 'Gasoline' });
      setShowAddModal(false);
    } catch (err) {
      Alert.alert('Error', 'Network error');
      console.error('Error adding car:', err);
    } finally {
      setAddingCar(false);
    }
  };

  const deleteCar = async (id: string) => {
    Alert.alert(
      'Delete Car',
      'Are you sure you want to delete this car?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive', 
          onPress: async () => {
                         try {
               await carsApi.delete(id);
               setCars(cars.filter(car => car.id !== id));
             } catch (err) {
               Alert.alert('Error', 'Network error');
               console.error('Error deleting car:', err);
             }
          }
        }
      ]
    );
  };

  // Show loading state
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>My Cars</Text>
          </View>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#059669" />
          <Text style={styles.loadingText}>Loading cars...</Text>
        </View>
      </View>
    );
  }



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
          <TouchableOpacity style={styles.headerAddButton} onPress={() => setShowAddModal(true)}>
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {cars.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="car-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>No cars yet</Text>
            <Text style={styles.emptySubtext}>Add your first car to get started</Text>
            <TouchableOpacity style={styles.addFirstButton} onPress={() => setShowAddModal(true)}>
              <Text style={styles.addFirstButtonText}>Add First Car</Text>
            </TouchableOpacity>
          </View>
        ) : (
          cars.map((car) => (
            <TouchableOpacity
              key={car.id}
              style={styles.carCard}
              onPress={() => navigation.navigate('Trips', { carId: car.id })}
            >
              <View style={styles.carCardContent}>
                <View style={styles.carInfo}>
                  <View style={styles.carHeader}>
                    <Text style={styles.carName}>{car.make} {car.model}</Text>
                    <Text style={styles.carYear}>{car.year}</Text>
                  </View>
                  <Text style={styles.carPlate}>{car.licensePlate}</Text>
                                     <View style={styles.carDetails}>
                     <View style={styles.carDetail}>
                       <Ionicons name="speedometer" size={14} color="#9ca3af" />
                       <Text style={styles.carDetailText}>{(car.mileage || 0).toLocaleString()} km</Text>
                     </View>
                     <View style={styles.carDetail}>
                       <Ionicons name="water" size={14} color="#9ca3af" />
                       <Text style={styles.carDetailText}>{car.fuelType || 'Not specified'}</Text>
                     </View>
                   </View>
                </View>
                <TouchableOpacity
                  onPress={() => deleteCar(car.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={14} color="white" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Add Car Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Car</Text>
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
                placeholder="Year (e.g., 2020)"
                value={newCar.year}
                onChangeText={(text) => setNewCar({...newCar, year: text})}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="License Plate"
                value={newCar.licensePlate}
                onChangeText={(text) => setNewCar({...newCar, licensePlate: text})}
                autoCapitalize="characters"
              />
              <TextInput
                style={styles.input}
                placeholder="Current Mileage (km)"
                value={newCar.mileage}
                onChangeText={(text) => setNewCar({...newCar, mileage: text})}
                keyboardType="numeric"
              />
              
              <Text style={styles.fuelTypeLabel}>Fuel Type</Text>
              <View style={styles.fuelTypeButtons}>
                <TouchableOpacity
                  style={[styles.fuelTypeButton, newCar.fuelType === 'Gasoline' && styles.fuelTypeButtonActive]}
                  onPress={() => setNewCar({...newCar, fuelType: 'Gasoline'})}
                >
                  <Text style={[styles.fuelTypeButtonText, newCar.fuelType === 'Gasoline' && styles.fuelTypeButtonTextActive]}>Gasoline</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.fuelTypeButton, newCar.fuelType === 'Diesel' && styles.fuelTypeButtonActive]}
                  onPress={() => setNewCar({...newCar, fuelType: 'Diesel'})}
                >
                  <Text style={[styles.fuelTypeButtonText, newCar.fuelType === 'Diesel' && styles.fuelTypeButtonTextActive]}>Diesel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.fuelTypeButton, newCar.fuelType === 'Electric' && styles.fuelTypeButtonActive]}
                  onPress={() => setNewCar({...newCar, fuelType: 'Electric'})}
                >
                  <Text style={[styles.fuelTypeButtonText, newCar.fuelType === 'Electric' && styles.fuelTypeButtonTextActive]}>Electric</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
                disabled={addingCar}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addButton, addingCar && styles.addButtonDisabled]}
                onPress={addCar}
                disabled={addingCar}
              >
                {addingCar ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.addButtonText}>Add Car</Text>
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

  // Car Cards
  carCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
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
  carHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  carName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  carYear: {
    fontSize: 16,
    color: '#6b7280',
  },
  carPlate: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  carDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  carDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: '45%',
  },
  carDetailText: {
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
  fuelTypeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  fuelTypeButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  fuelTypeButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  fuelTypeButtonActive: {
    backgroundColor: '#0656E0',
    borderColor: '#0656E0',
  },
  fuelTypeButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
    color: '#374151',
  },
  fuelTypeButtonTextActive: {
    color: 'white',
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
