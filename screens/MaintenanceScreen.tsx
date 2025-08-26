import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

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
      case 'completed': return '#059669';
      case 'scheduled': return '#0656E0';
      case 'overdue': return '#ef4444';
      default: return '#6b7280';
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
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Maintenance</Text>
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
            <Text style={styles.statLabel}>Completed</Text>
            <Text style={styles.statValue}>{completedItems.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Scheduled</Text>
            <Text style={styles.statValue}>{scheduledItems.length}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Total Cost</Text>
            <Text style={styles.statValue}>${totalCost.toFixed(2)}</Text>
          </View>
        </View>

        {/* Maintenance Items */}
        {maintenanceItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.maintenanceCard}
            onPress={() => navigation.navigate('OBDLive', { maintenanceId: item.id })}
          >
            <View style={styles.maintenanceCardContent}>
              <View style={styles.maintenanceInfo}>
                <View style={styles.maintenanceHeader}>
                  <Text style={styles.maintenanceIcon}>{getTypeIcon(item.type)}</Text>
                  <View style={styles.maintenanceTitleSection}>
                    <Text style={styles.maintenanceTitle}>{item.title}</Text>
                    <Text style={styles.maintenanceDescription}>{item.description}</Text>
                  </View>
                </View>
                <Text style={styles.maintenanceDate}>{item.date}</Text>
                <View style={styles.maintenanceDetails}>
                  <View style={styles.maintenanceDetail}>
                    <Ionicons name="speedometer" size={14} color="#9ca3af" />
                    <Text style={styles.maintenanceDetailText}>{item.mileage} mi</Text>
                  </View>
                  {item.cost > 0 && (
                    <View style={styles.maintenanceDetail}>
                      <Ionicons name="card" size={14} color="#9ca3af" />
                      <Text style={styles.maintenanceDetailText}>${item.cost}</Text>
                    </View>
                  )}
                  {item.nextDueMileage && (
                    <View style={styles.maintenanceDetail}>
                      <Ionicons name="calendar" size={14} color="#0656E0" />
                      <Text style={styles.maintenanceDetailTextDue}>Due: {item.nextDueMileage} mi</Text>
                    </View>
                  )}
                </View>
              </View>
              <View style={styles.maintenanceActions}>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
                  <Text style={styles.statusText}>{item.status}</Text>
                </View>
                {item.status === 'scheduled' && (
                  <TouchableOpacity
                    onPress={() => markCompleted(item.id)}
                    style={styles.completeButton}
                  >
                    <Ionicons name="checkmark" size={14} color="white" />
                    <Text style={styles.completeButtonText}>Complete</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() => deleteItem(item.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={16} color="white" />
                  <Text style={styles.deleteButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {showAddForm && (
          <View style={styles.formCard}>
            <Text style={styles.formTitle}>Add Maintenance Item</Text>
            <TextInput
              style={styles.input}
              placeholder="Title (e.g., Oil Change)"
              value={newItem.title}
              onChangeText={(text) => setNewItem({...newItem, title: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Description (optional)"
              value={newItem.description}
              onChangeText={(text) => setNewItem({...newItem, description: text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Current Mileage"
              value={newItem.mileage}
              onChangeText={(text) => setNewItem({...newItem, mileage: text})}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Cost ($)"
              value={newItem.cost}
              onChangeText={(text) => setNewItem({...newItem, cost: text})}
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              placeholder="Next Due Mileage (optional)"
              value={newItem.nextDueMileage}
              onChangeText={(text) => setNewItem({...newItem, nextDueMileage: text})}
              keyboardType="numeric"
            />
            <View style={styles.typeButtons}>
              {['oil_change', 'tire_rotation', 'brake_service', 'inspection', 'other'].map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[styles.typeButton, newItem.type === type && styles.typeButtonActive]}
                  onPress={() => setNewItem({...newItem, type: type as MaintenanceItem['type']})}
                >
                  <Text style={[styles.typeButtonText, newItem.type === type && styles.typeButtonTextActive]}>
                    {type.replace('_', ' ')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.formButtons}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={addMaintenanceItem}
              >
                <Text style={styles.addButtonText}>Add Item</Text>
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
            <Text style={styles.addNewButtonText}>Add Maintenance Item</Text>
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
  maintenanceCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  maintenanceCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  maintenanceInfo: {
    flex: 1,
  },
  maintenanceHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  maintenanceIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  maintenanceTitleSection: {
    flex: 1,
  },
  maintenanceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  maintenanceDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  maintenanceDate: {
    color: '#6b7280',
    fontSize: 16,
    marginBottom: 8,
  },
  maintenanceDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  maintenanceDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  maintenanceDetailText: {
    color: '#9ca3af',
    fontSize: 14,
  },
  maintenanceDetailTextDue: {
    color: '#0656E0',
    fontSize: 14,
  },
  maintenanceActions: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  completeButton: {
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  completeButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
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
  typeButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  typeButton: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#f3f4f6',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  typeButtonActive: {
    backgroundColor: '#f97316',
    borderColor: '#f97316',
  },
  typeButtonText: {
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 12,
    color: '#374151',
  },
  typeButtonTextActive: {
    color: 'white',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  addButton: {
    flex: 1,
    backgroundColor: '#f97316',
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
    backgroundColor: '#f97316',
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
