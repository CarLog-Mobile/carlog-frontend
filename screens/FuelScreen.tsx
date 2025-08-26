import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface FuelEntry {
  id: string;
  date: string;
  gallons: number;
  costPerGallon: number;
  totalCost: number;
  mileage: number;
  location: string;
  fuelType: string;
}

export default function FuelScreen({ navigation, route }: any) {
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      gallons: 12.5,
      costPerGallon: 3.25,
      totalCost: 40.63,
      mileage: 45000,
      location: 'Shell Station',
      fuelType: 'Regular'
    },
    {
      id: '2',
      date: '2024-01-08',
      gallons: 11.8,
      costPerGallon: 3.15,
      totalCost: 37.17,
      mileage: 44800,
      location: 'Exxon',
      fuelType: 'Regular'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newEntry, setNewEntry] = useState({
    gallons: '',
    costPerGallon: '',
    mileage: '',
    location: '',
    fuelType: 'Regular'
  });

  const addFuelEntry = () => {
    if (!newEntry.gallons || !newEntry.costPerGallon || !newEntry.mileage) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const gallons = parseFloat(newEntry.gallons);
    const costPerGallon = parseFloat(newEntry.costPerGallon);
    const totalCost = gallons * costPerGallon;

    const entry: FuelEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      gallons,
      costPerGallon,
      totalCost,
      mileage: parseFloat(newEntry.mileage),
      location: newEntry.location || 'Unknown',
      fuelType: newEntry.fuelType
    };

    setFuelEntries([entry, ...fuelEntries]);
    setNewEntry({ gallons: '', costPerGallon: '', mileage: '', location: '', fuelType: 'Regular' });
    setShowAddForm(false);
  };

  const deleteEntry = (id: string) => {
    Alert.alert(
      'Delete Entry',
      'Are you sure you want to delete this fuel entry?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setFuelEntries(fuelEntries.filter(entry => entry.id !== id)) }
      ]
    );
  };

  const totalGallons = fuelEntries.reduce((sum, entry) => sum + entry.gallons, 0);
  const totalCost = fuelEntries.reduce((sum, entry) => sum + entry.totalCost, 0);
  const avgCostPerGallon = totalGallons > 0 ? totalCost / totalGallons : 0;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Fuel Logs</Text>
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
            <Text style={styles.statLabel}>Total Gallons</Text>
            <Text style={styles.statValue}>{totalGallons.toFixed(1)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Cost</Text>
            <Text style={styles.statValue}>${totalCost.toFixed(2)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Avg Price</Text>
            <Text style={styles.statValue}>${avgCostPerGallon.toFixed(2)}</Text>
          </View>
        </View>

        {/* Fuel Entries */}
        {fuelEntries.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            style={styles.fuelCard}
            onPress={() => navigation.navigate('Maintenance', { fuelEntryId: entry.id })}
          >
            <View style={styles.fuelCardContent}>
              <View style={styles.fuelInfo}>
                <View style={styles.fuelHeader}>
                  <Text style={styles.fuelLocation}>{entry.location}</Text>
                  <Text style={styles.fuelTotalCost}>${entry.totalCost.toFixed(2)}</Text>
                </View>
                <Text style={styles.fuelDate}>{entry.date}</Text>
                <View style={styles.fuelDetails}>
                  <View style={styles.fuelDetail}>
                    <Ionicons name="water" size={14} color="#9ca3af" />
                    <Text style={styles.fuelDetailText}>{entry.gallons} gal</Text>
                  </View>
                  <View style={styles.fuelDetail}>
                    <Ionicons name="card" size={14} color="#9ca3af" />
                    <Text style={styles.fuelDetailText}>${entry.costPerGallon}/gal</Text>
                  </View>
                  <View style={styles.fuelDetail}>
                    <Ionicons name="speedometer" size={14} color="#9ca3af" />
                    <Text style={styles.fuelDetailText}>{entry.mileage} mi</Text>
                  </View>
                </View>
                <Text style={styles.fuelType}>{entry.fuelType}</Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteEntry(entry.id)}
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
            <Text style={styles.formTitle}>Add Fuel Entry</Text>
            <TextInput
              style={styles.input}
              placeholder="Gallons"
              value={newEntry.gallons}
              onChangeText={(text) => setNewEntry({...newEntry, gallons: text})}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Cost per Gallon ($)"
              value={newEntry.costPerGallon}
              onChangeText={(text) => setNewEntry({...newEntry, costPerGallon: text})}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Current Mileage"
              value={newEntry.mileage}
              onChangeText={(text) => setNewEntry({...newEntry, mileage: text})}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Location (optional)"
              value={newEntry.location}
              onChangeText={(text) => setNewEntry({...newEntry, location: text})}
            />
            <View style={styles.fuelTypeButtons}>
              <TouchableOpacity
                style={[styles.fuelTypeButton, newEntry.fuelType === 'Regular' && styles.fuelTypeButtonActive]}
                onPress={() => setNewEntry({...newEntry, fuelType: 'Regular'})}
              >
                <Text style={[styles.fuelTypeButtonText, newEntry.fuelType === 'Regular' && styles.fuelTypeButtonTextActive]}>Regular</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.fuelTypeButton, newEntry.fuelType === 'Premium' && styles.fuelTypeButtonActive]}
                onPress={() => setNewEntry({...newEntry, fuelType: 'Premium'})}
              >
                <Text style={[styles.fuelTypeButtonText, newEntry.fuelType === 'Premium' && styles.fuelTypeButtonTextActive]}>Premium</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={addFuelEntry}
              >
                <Text style={styles.addButtonText}>Add Entry</Text>
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
            <Text style={styles.addNewButtonText}>Add Fuel Entry</Text>
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
  fuelCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  fuelCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  fuelInfo: {
    flex: 1,
  },
  fuelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  fuelLocation: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  fuelTotalCost: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  fuelDate: {
    color: '#6b7280',
    fontSize: 16,
    marginBottom: 8,
  },
  fuelDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  fuelDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  fuelDetailText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  fuelType: {
    color: '#6b7280',
    fontSize: 12,
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
  fuelTypeButtons: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
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
  formButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#059669',
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
    backgroundColor: '#059669',
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
