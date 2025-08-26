import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';

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
      <ScrollView style={styles.scrollView}>
        {/* Summary Cards */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-white rounded-lg p-3 shadow-sm">
            <Text className="text-gray-600 text-sm">Total Gallons</Text>
            <Text className="text-xl font-bold text-green-600">{totalGallons.toFixed(1)}</Text>
          </View>
          <View className="flex-1 bg-white rounded-lg p-3 shadow-sm">
            <Text className="text-gray-600 text-sm">Total Cost</Text>
            <Text className="text-xl font-bold text-red-600">${totalCost.toFixed(2)}</Text>
          </View>
          <View className="flex-1 bg-white rounded-lg p-3 shadow-sm">
            <Text className="text-gray-600 text-sm">Avg Price</Text>
            <Text className="text-xl font-bold text-blue-600">${avgCostPerGallon.toFixed(2)}</Text>
          </View>
        </View>

        {/* Fuel Entries */}
        {fuelEntries.map((entry) => (
          <TouchableOpacity
            key={entry.id}
            className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200"
            onPress={() => navigation.navigate('Maintenance', { fuelEntryId: entry.id })}
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <View className="flex-row justify-between items-center mb-2">
                  <Text className="text-lg font-semibold text-gray-800">{entry.location}</Text>
                  <Text className="text-lg font-bold text-green-600">${entry.totalCost.toFixed(2)}</Text>
                </View>
                <Text className="text-gray-600">{entry.date}</Text>
                <View className="flex-row gap-4 mt-2">
                  <Text className="text-gray-500">{entry.gallons} gal</Text>
                  <Text className="text-gray-500">${entry.costPerGallon}/gal</Text>
                  <Text className="text-gray-500">{entry.mileage} mi</Text>
                </View>
                <Text className="text-gray-400 text-sm mt-1">{entry.fuelType}</Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteEntry(entry.id)}
                className="bg-red-500 px-2 py-1 rounded"
              >
                <Text className="text-white text-xs">Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}

        {showAddForm && (
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
            <Text className="text-lg font-bold mb-4">Add Fuel Entry</Text>
            <TextInput
              className="border border-gray-300 rounded p-2 mb-3"
              placeholder="Gallons"
              value={newEntry.gallons}
              onChangeText={(text) => setNewEntry({...newEntry, gallons: text})}
              keyboardType="numeric"
            />
            <TextInput
              className="border border-gray-300 rounded p-2 mb-3"
              placeholder="Cost per Gallon ($)"
              value={newEntry.costPerGallon}
              onChangeText={(text) => setNewEntry({...newEntry, costPerGallon: text})}
              keyboardType="numeric"
            />
            <TextInput
              className="border border-gray-300 rounded p-2 mb-3"
              placeholder="Current Mileage"
              value={newEntry.mileage}
              onChangeText={(text) => setNewEntry({...newEntry, mileage: text})}
              keyboardType="numeric"
            />
            <TextInput
              className="border border-gray-300 rounded p-2 mb-3"
              placeholder="Location (optional)"
              value={newEntry.location}
              onChangeText={(text) => setNewEntry({...newEntry, location: text})}
            />
            <View className="flex-row gap-2 mb-4">
              <TouchableOpacity
                className={`flex-1 py-2 rounded ${newEntry.fuelType === 'Regular' ? 'bg-blue-500' : 'bg-gray-300'}`}
                onPress={() => setNewEntry({...newEntry, fuelType: 'Regular'})}
              >
                <Text className={`text-center font-semibold ${newEntry.fuelType === 'Regular' ? 'text-white' : 'text-gray-700'}`}>Regular</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 py-2 rounded ${newEntry.fuelType === 'Premium' ? 'bg-blue-500' : 'bg-gray-300'}`}
                onPress={() => setNewEntry({...newEntry, fuelType: 'Premium'})}
              >
                <Text className={`text-center font-semibold ${newEntry.fuelType === 'Premium' ? 'text-white' : 'text-gray-700'}`}>Premium</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="flex-1 bg-green-500 py-2 rounded"
                onPress={addFuelEntry}
              >
                <Text className="text-white text-center font-semibold">Add Entry</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-gray-300 py-2 rounded"
                onPress={() => setShowAddForm(false)}
              >
                <Text className="text-gray-700 text-center font-semibold">Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {!showAddForm && (
          <TouchableOpacity
            className="bg-green-500 py-3 rounded-lg mb-4"
            onPress={() => setShowAddForm(true)}
          >
            <Text className="text-white text-center font-semibold text-lg">+ Add Fuel Entry</Text>
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
});
