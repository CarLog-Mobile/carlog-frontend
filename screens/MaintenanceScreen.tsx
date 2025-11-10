import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet, Dimensions, Modal, ActivityIndicator } from 'react-native';
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
      cost: 0,
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
      cost: 0,
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
      status: 'completed',
      type: 'brake_service'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [addingItem, setAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    mileage: '',
    cost: '',
    type: 'oil_change' as MaintenanceItem['type'],
    nextDueMileage: '',
    nextDueDate: ''
  });

  const addMaintenanceItem = async () => {
    if (!newItem.title || !newItem.mileage) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setAddingItem(true);
      const item: MaintenanceItem = {
        id: Date.now().toString(),
        title: newItem.title,
        description: newItem.description,
        date: new Date().toISOString().split('T')[0],
        mileage: parseFloat(newItem.mileage) || 0,
        cost: parseFloat(newItem.cost) || 0,
        status: 'completed',
        type: newItem.type,
        nextDueMileage: parseFloat(newItem.nextDueMileage) || undefined,
        nextDueDate: newItem.nextDueDate || undefined
      };

      setMaintenanceItems([item, ...maintenanceItems]);
      setNewItem({ title: '', description: '', mileage: '', cost: '', type: 'oil_change', nextDueMileage: '', nextDueDate: '' });
      setShowAddForm(false);
    } catch (err) {
      Alert.alert('Error', 'Failed to add maintenance item');
      console.error('Error adding maintenance item:', err);
    } finally {
      setAddingItem(false);
    }
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

  const getTypeColor = (type: MaintenanceItem['type']) => {
    switch (type) {
      case 'oil_change': return '#0656E0';
      case 'tire_rotation': return '#059669';
      case 'brake_service': return '#f97316';
      case 'inspection': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type: MaintenanceItem['type']) => {
    switch (type) {
      case 'oil_change': return 'water-outline';
      case 'tire_rotation': return 'disc-outline';
      case 'brake_service': return 'hand-left-outline';
      case 'inspection': return 'search-outline';
      default: return 'build-outline';
    }
  };

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
          <TouchableOpacity style={styles.headerAddButton} onPress={() => setShowAddForm(true)}>
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Stats Card */}
        <View style={styles.statsRow}>
          <View style={[styles.statCard, { flex: 1 }]}>
            <Text style={styles.statLabel}>Total Services</Text>
            <Text style={styles.statValue}>{maintenanceItems.length}</Text>
          </View>
        </View>

        {/* Maintenance Items */}
        {maintenanceItems.map((item) => (
          <View
            key={item.id}
            style={styles.maintenanceCard}
          >
            <View style={styles.maintenanceCardContent}>
              <View style={styles.maintenanceInfo}>
                <View style={styles.maintenanceHeader}>
                  <View style={[styles.iconCircle, { backgroundColor: getTypeColor(item.type) + '20' }]}>
                    <Ionicons name={getTypeIcon(item.type)} size={20} color={getTypeColor(item.type)} />
                  </View>
                  <View style={styles.maintenanceTitleSection}>
                    <Text style={styles.maintenanceTitle}>{item.title}</Text>
                    <Text style={styles.maintenanceDate}>{item.date}</Text>
                  </View>
                </View>
                {item.description && (
                  <Text style={styles.maintenanceDescription}>{item.description}</Text>
                )}
                <View style={styles.maintenanceDetails}>
                  <View style={styles.maintenanceDetail}>
                    <Ionicons name="speedometer" size={14} color="#9ca3af" />
                    <Text style={styles.maintenanceDetailText}>{item.mileage} mi</Text>
                  </View>
                  {item.cost > 0 && (
                    <View style={styles.maintenanceDetail}>
                      <Ionicons name="cash" size={14} color="#9ca3af" />
                      <Text style={styles.maintenanceDetailText}>LKR {item.cost.toFixed(2)}</Text>
                    </View>
                  )}
                </View>
                {item.nextDueMileage && (
                  <View style={styles.nextDueContainer}>
                    <Ionicons name="calendar-outline" size={14} color="#0656E0" />
                    <Text style={styles.nextDueText}>Next due at {item.nextDueMileage} mi</Text>
                  </View>
                )}
              </View>
              <View style={styles.maintenanceActions}>
                <TouchableOpacity
                  onPress={() => deleteItem(item.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={14} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}

        {maintenanceItems.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="construct-outline" size={64} color="#9ca3af" />
            <Text style={styles.emptyText}>No maintenance records yet</Text>
            <Text style={styles.emptySubtext}>Add your first service to get started</Text>
            <TouchableOpacity style={styles.addFirstButton} onPress={() => setShowAddForm(true)}>
              <Text style={styles.addFirstButtonText}>Add First Service</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Add Maintenance Modal */}
      <Modal
        visible={showAddForm}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddForm(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Maintenance Service</Text>
              <TouchableOpacity
                onPress={() => setShowAddForm(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalScrollView}>
              <TextInput
                style={styles.input}
                placeholder="Service Title (e.g., Oil Change)"
                value={newItem.title}
                onChangeText={(text) => setNewItem({...newItem, title: text})}
              />
              <TextInput
                style={styles.input}
                placeholder="Description (optional)"
                value={newItem.description}
                onChangeText={(text) => setNewItem({...newItem, description: text})}
                multiline
                numberOfLines={3}
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
                placeholder="Cost (LKR)"
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
              
              <Text style={styles.typeLabel}>Service Type</Text>
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
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddForm(false)}
                disabled={addingItem}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.addButton, addingItem && styles.addButtonDisabled]}
                onPress={addMaintenanceItem}
                disabled={addingItem}
              >
                {addingItem ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.addButtonText}>Add Service</Text>
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
    alignItems: 'center',
    marginBottom: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  maintenanceTitleSection: {
    flex: 1,
  },
  maintenanceTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 2,
  },
  maintenanceDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  maintenanceDate: {
    color: '#9ca3af',
    fontSize: 14,
  },
  maintenanceDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    alignItems: 'center',
    marginBottom: 8,
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
  nextDueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  nextDueText: {
    color: '#0656E0',
    fontSize: 13,
    fontWeight: '500',
  },
  maintenanceActions: {
    alignItems: 'center',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  completeButton: {
    backgroundColor: '#059669',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    width: 32,
    height: 32,
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
    backgroundColor: '#059669',
    borderColor: '#059669',
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
    backgroundColor: '#059669',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
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
  
  // Empty State
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
    minHeight: '70%',
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
  typeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    marginTop: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  addButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
});
