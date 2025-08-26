import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from 'react-native';

interface MaintenanceItem {
  id: string;
  title: string;
  description: string;
  date: string;
  mileage: number;
  cost: number;
  status: 'completed' | 'scheduled' | 'overdue';
  type: 'oil_change' | 'tire_rotation' | 'brake_service' | 'inspection' | 'other';
  nextDueMileage?: number;
  nextDueDate?: string;
}

export default function MaintenanceScreen({ navigation, route }: any) {
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([
    {
      id: '1',
      title: 'Oil Change',
      description: 'Synthetic oil change and filter replacement',
      date: '2024-01-10',
      mileage: 45000,
      cost: 45.00,
      status: 'completed',
      type: 'oil_change',
      nextDueMileage: 48000,
      nextDueDate: '2024-03-15'
    },
    {
      id: '2',
      title: 'Tire Rotation',
      description: 'Rotate tires and balance wheels',
      date: '2024-01-05',
      mileage: 44800,
      cost: 35.00,
      status: 'completed',
      type: 'tire_rotation',
      nextDueMileage: 47800,
      nextDueDate: '2024-03-10'
    },
    {
      id: '3',
      title: 'Brake Inspection',
      description: 'Check brake pads and rotors',
      date: '2024-02-20',
      mileage: 47000,
      cost: 0,
      status: 'scheduled',
      type: 'brake_service'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    mileage: '',
    cost: '',
    type: 'oil_change' as MaintenanceItem['type'],
    nextDueMileage: '',
    nextDueDate: ''
  });

  const addMaintenanceItem = () => {
    if (!newItem.title || !newItem.mileage) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const item: MaintenanceItem = {
      id: Date.now().toString(),
      title: newItem.title,
      description: newItem.description,
      date: new Date().toISOString().split('T')[0],
      mileage: parseFloat(newItem.mileage) || 0,
      cost: parseFloat(newItem.cost) || 0,
      status: 'scheduled',
      type: newItem.type,
      nextDueMileage: parseFloat(newItem.nextDueMileage) || undefined,
      nextDueDate: newItem.nextDueDate || undefined
    };

    setMaintenanceItems([item, ...maintenanceItems]);
    setNewItem({ title: '', description: '', mileage: '', cost: '', type: 'oil_change', nextDueMileage: '', nextDueDate: '' });
    setShowAddForm(false);
  };

  const markCompleted = (id: string) => {
    setMaintenanceItems(maintenanceItems.map(item => 
      item.id === id ? { ...item, status: 'completed' as const } : item
    ));
  };

  const deleteItem = (id: string) => {
    Alert.alert(
      'Delete Maintenance Item',
      'Are you sure you want to delete this maintenance item?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => setMaintenanceItems(maintenanceItems.filter(item => item.id !== id)) }
      ]
    );
  };

  const getStatusColor = (status: MaintenanceItem['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'scheduled': return 'bg-blue-500';
      case 'overdue': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getTypeIcon = (type: MaintenanceItem['type']) => {
    switch (type) {
      case 'oil_change': return '🛢️';
      case 'tire_rotation': return '🛞';
      case 'brake_service': return '🛑';
      case 'inspection': return '🔍';
      default: return '🔧';
    }
  };

  const completedItems = maintenanceItems.filter(item => item.status === 'completed');
  const scheduledItems = maintenanceItems.filter(item => item.status === 'scheduled');
  const totalCost = completedItems.reduce((sum, item) => sum + item.cost, 0);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Summary Cards */}
        <View className="flex-row gap-3 mb-4">
          <View className="flex-1 bg-white rounded-lg p-3 shadow-sm">
            <Text className="text-gray-600 text-sm">Completed</Text>
            <Text className="text-xl font-bold text-green-600">{completedItems.length}</Text>
          </View>
          <View className="flex-1 bg-white rounded-lg p-3 shadow-sm">
            <Text className="text-gray-600 text-sm">Scheduled</Text>
            <Text className="text-xl font-bold text-blue-600">{scheduledItems.length}</Text>
          </View>
          <View className="flex-1 bg-white rounded-lg p-3 shadow-sm">
            <Text className="text-gray-600 text-sm">Total Cost</Text>
            <Text className="text-xl font-bold text-orange-600">${totalCost.toFixed(2)}</Text>
          </View>
        </View>

        {/* Maintenance Items */}
        {maintenanceItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200"
            onPress={() => navigation.navigate('OBDLive', { maintenanceId: item.id })}
          >
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <View className="flex-row items-center mb-2">
                  <Text className="text-2xl mr-2">{getTypeIcon(item.type)}</Text>
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-800">{item.title}</Text>
                    <Text className="text-gray-600 text-sm">{item.description}</Text>
                  </View>
                </View>
                <Text className="text-gray-600">{item.date}</Text>
                <View className="flex-row gap-4 mt-2">
                  <Text className="text-gray-500">{item.mileage} mi</Text>
                  {item.cost > 0 && <Text className="text-gray-500">${item.cost}</Text>}
                  {item.nextDueMileage && <Text className="text-blue-500">Due: {item.nextDueMileage} mi</Text>}
                </View>
              </View>
              <View className="flex-col gap-2">
                <View className={`px-2 py-1 rounded ${getStatusColor(item.status)}`}>
                  <Text className="text-white text-xs capitalize">{item.status}</Text>
                </View>
                {item.status === 'scheduled' && (
                  <TouchableOpacity
                    onPress={() => markCompleted(item.id)}
                    className="bg-green-500 px-2 py-1 rounded"
                  >
                    <Text className="text-white text-xs">Complete</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => deleteItem(item.id)}
                  className="bg-red-500 px-2 py-1 rounded"
                >
                  <Text className="text-white text-xs">Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {showAddForm && (
          <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
            <Text className="text-lg font-bold mb-4">Add Maintenance Item</Text>
            <TextInput
              className="border border-gray-300 rounded p-2 mb-3"
              placeholder="Title (e.g., Oil Change)"
              value={newItem.title}
              onChangeText={(text) => setNewItem({...newItem, title: text})}
            />
            <TextInput
              className="border border-gray-300 rounded p-2 mb-3"
              placeholder="Description (optional)"
              value={newItem.description}
              onChangeText={(text) => setNewItem({...newItem, description: text})}
            />
            <TextInput
              className="border border-gray-300 rounded p-2 mb-3"
              placeholder="Current Mileage"
              value={newItem.mileage}
              onChangeText={(text) => setNewItem({...newItem, mileage: text})}
              keyboardType="numeric"
            />
            <TextInput
              className="border border-gray-300 rounded p-2 mb-3"
              placeholder="Cost ($)"
              value={newItem.cost}
              onChangeText={(text) => setNewItem({...newItem, cost: text})}
              keyboardType="numeric"
            />
            <TextInput
              className="border border-gray-300 rounded p-2 mb-3"
              placeholder="Next Due Mileage (optional)"
              value={newItem.nextDueMileage}
              onChangeText={(text) => setNewItem({...newItem, nextDueMileage: text})}
              keyboardType="numeric"
            />
            <View className="flex-row gap-2 mb-4">
              {['oil_change', 'tire_rotation', 'brake_service', 'inspection', 'other'].map((type) => (
                <TouchableOpacity
                  key={type}
                  className={`flex-1 py-2 rounded ${newItem.type === type ? 'bg-orange-500' : 'bg-gray-300'}`}
                  onPress={() => setNewItem({...newItem, type: type as MaintenanceItem['type']})}
                >
                  <Text className={`text-center font-semibold text-xs ${newItem.type === type ? 'text-white' : 'text-gray-700'}`}>
                    {type.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View className="flex-row gap-2">
              <TouchableOpacity
                className="flex-1 bg-orange-500 py-2 rounded"
                onPress={addMaintenanceItem}
              >
                <Text className="text-white text-center font-semibold">Add Item</Text>
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
            className="bg-orange-500 py-3 rounded-lg mb-4"
            onPress={() => setShowAddForm(true)}
          >
            <Text className="text-white text-center font-semibold text-lg">+ Add Maintenance Item</Text>
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
