import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, StyleSheet, Dimensions, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface FuelEntry {
  id: string;
  date: string;
  liters: number;
  costPerLiter: number;
  totalCost: number;
  mileage: number;
  fuelType: string;
}

export default function FuelScreen({ navigation, route }: any) {
  const [fuelEntries, setFuelEntries] = useState<FuelEntry[]>([
    {
      id: '1',
      date: '2024-01-15',
      liters: 45.0,
      costPerLiter: 350.00,
      totalCost: 15750.00,
      mileage: 72420,
      fuelType: '92 Octane'
    },
    {
      id: '2',
      date: '2024-01-08',
      liters: 42.5,
      costPerLiter: 345.00,
      totalCost: 14662.50,
      mileage: 72000,
      fuelType: '92 Octane'
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [newEntry, setNewEntry] = useState({
    liters: '',
    costPerLiter: '',
    mileage: '',
    fuelType: '92 Octane'
  });

  const addFuelEntry = () => {
    if (!newEntry.liters || !newEntry.costPerLiter || !newEntry.mileage) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const liters = parseFloat(newEntry.liters);
    const costPerLiter = parseFloat(newEntry.costPerLiter);
    const totalCost = liters * costPerLiter;

    const entry: FuelEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      liters,
      costPerLiter,
      totalCost,
      mileage: parseFloat(newEntry.mileage),
      fuelType: newEntry.fuelType
    };

    setFuelEntries([entry, ...fuelEntries]);
    setNewEntry({ liters: '', costPerLiter: '', mileage: '', fuelType: '92 Octane' });
    setShowAddModal(false);
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

  // Calculate fuel efficiency (km/L)
  const calculateFuelEfficiency = () => {
    if (fuelEntries.length < 2) return [];
    
    const sortedEntries = [...fuelEntries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const efficiencyData = [];
    
    for (let i = 1; i < sortedEntries.length; i++) {
      const distance = sortedEntries[i].mileage - sortedEntries[i-1].mileage;
      const fuelUsed = sortedEntries[i].liters;
      const efficiency = distance / fuelUsed;
      
      efficiencyData.push({
        date: sortedEntries[i].date,
        efficiency: efficiency.toFixed(1),
        distance,
        fuelUsed
      });
    }
    
    return efficiencyData.slice(-6); // Last 6 entries
  };

  // Calculate monthly fuel costs
  const calculateMonthlyCosts = () => {
    const monthlyData: { [key: string]: number } = {};
    
    fuelEntries.forEach(entry => {
      const month = entry.date.substring(0, 7); // YYYY-MM format
      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }
      monthlyData[month] += entry.totalCost;
    });
    
    return Object.entries(monthlyData)
      .map(([month, cost]) => ({ month, cost }))
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6); // Last 6 months
  };

  const efficiencyData = calculateFuelEfficiency();
  const monthlyCosts = calculateMonthlyCosts();

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
          <TouchableOpacity style={styles.headerAddButton} onPress={() => setShowAddModal(true)}>
            <Ionicons name="add" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Charts Section */}
        <View style={styles.chartsSection}>
          {/* Fuel Efficiency Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Fuel Efficiency (km/L)</Text>
            <View style={styles.chartContainer}>
              {efficiencyData.length > 0 ? (
                <View style={styles.barChart}>
                  {efficiencyData.map((item, index) => (
                    <View key={index} style={styles.barContainer}>
                      <View style={styles.barWrapper}>
                        <View 
                          style={[
                            styles.bar, 
                            { 
                              height: Math.min(parseFloat(item.efficiency) * 8, 120),
                              backgroundColor: parseFloat(item.efficiency) > 12 ? '#059669' : 
                                              parseFloat(item.efficiency) > 8 ? '#f59e0b' : '#ef4444'
                            }
                          ]}
                        />
                      </View>
                      <Text style={styles.barLabel}>{item.efficiency}</Text>
                      <Text style={styles.barDate}>{item.date.split('-')[2]}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noDataText}>Add more fuel entries to see efficiency data</Text>
              )}
            </View>
          </View>

          {/* Monthly Fuel Costs Chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Monthly Fuel Costs (LKR)</Text>
            <View style={styles.chartContainer}>
              {monthlyCosts.length > 0 ? (
                <View style={styles.barChart}>
                  {monthlyCosts.map((item, index) => (
                    <View key={index} style={styles.barContainer}>
                      <View style={styles.barWrapper}>
                        <View 
                          style={[
                            styles.bar, 
                            { 
                              height: Math.min(item.cost / 1000, 120),
                              backgroundColor: '#0656E0'
                            }
                          ]}
                        />
                      </View>
                      <Text style={styles.barLabel}>{(item.cost / 1000).toFixed(0)}k</Text>
                      <Text style={styles.barDate}>{item.month.split('-')[1]}</Text>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noDataText}>Add fuel entries to see monthly costs</Text>
              )}
            </View>
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
                  <Text style={styles.fuelDate}>{entry.date}</Text>
                </View>
                <View style={styles.fuelDetails}>
                  <View style={styles.fuelDetail}>
                    <Ionicons name="water" size={14} color="#9ca3af" />
                    <Text style={styles.fuelDetailText}>{entry.liters} L</Text>
                  </View>
                  <View style={styles.fuelDetail}>
                    <Ionicons name="card" size={14} color="#9ca3af" />
                    <Text style={styles.fuelDetailText}>LKR {entry.costPerLiter}/L</Text>
                  </View>
                  <View style={styles.fuelDetail}>
                    <Ionicons name="cash" size={14} color="#9ca3af" />
                    <Text style={styles.fuelDetailText}>LKR {entry.totalCost.toFixed(2)}</Text>
                  </View>
                  <View style={styles.fuelDetail}>
                    <Ionicons name="speedometer" size={14} color="#9ca3af" />
                    <Text style={styles.fuelDetailText}>{entry.mileage} km</Text>
                  </View>
                </View>
                <Text style={styles.fuelType}>{entry.fuelType}</Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteEntry(entry.id)}
                style={styles.deleteButton}
              >
                <Ionicons name="trash-outline" size={14} color="white" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Add Fuel Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowAddModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Fuel Entry</Text>
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
                placeholder="Liters"
                value={newEntry.liters}
                onChangeText={(text) => setNewEntry({...newEntry, liters: text})}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Cost per Liter (LKR)"
                value={newEntry.costPerLiter}
                onChangeText={(text) => setNewEntry({...newEntry, costPerLiter: text})}
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                placeholder="Current Mileage (km)"
                value={newEntry.mileage}
                onChangeText={(text) => setNewEntry({...newEntry, mileage: text})}
                keyboardType="numeric"
              />
              
              <Text style={styles.fuelTypeLabel}>Fuel Type</Text>
              <View style={styles.fuelTypeButtons}>
                <TouchableOpacity
                  style={[styles.fuelTypeButton, newEntry.fuelType === '92 Octane' && styles.fuelTypeButtonActive]}
                  onPress={() => setNewEntry({...newEntry, fuelType: '92 Octane'})}
                >
                  <Text style={[styles.fuelTypeButtonText, newEntry.fuelType === '92 Octane' && styles.fuelTypeButtonTextActive]}>92 Octane</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.fuelTypeButton, newEntry.fuelType === '95 Octane' && styles.fuelTypeButtonActive]}
                  onPress={() => setNewEntry({...newEntry, fuelType: '95 Octane'})}
                >
                  <Text style={[styles.fuelTypeButtonText, newEntry.fuelType === '95 Octane' && styles.fuelTypeButtonTextActive]}>95 Octane</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.fuelTypeButton, newEntry.fuelType === 'Diesel' && styles.fuelTypeButtonActive]}
                  onPress={() => setNewEntry({...newEntry, fuelType: 'Diesel'})}
                >
                  <Text style={[styles.fuelTypeButtonText, newEntry.fuelType === 'Diesel' && styles.fuelTypeButtonTextActive]}>Diesel</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={addFuelEntry}
              >
                <Text style={styles.addButtonText}>Add Entry</Text>
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

  // Charts Section
  chartsSection: {
    marginBottom: 24,
  },
  chartCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 16,
  },
  chartContainer: {
    height: 140,
    justifyContent: 'center',
  },
  barChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 120,
    paddingHorizontal: 8,
  },
  barContainer: {
    alignItems: 'center',
    flex: 1,
  },
  barWrapper: {
    height: 120,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  bar: {
    width: 20,
    borderRadius: 10,
    minHeight: 4,
  },
  barLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  barDate: {
    fontSize: 10,
    color: '#6b7280',
  },
  noDataText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
    fontStyle: 'italic',
  },

  // Fuel Cards
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
  fuelDate: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  fuelTotalCost: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#059669',
  },
  fuelDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 8,
  },
  fuelDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    minWidth: '45%',
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
  },
  cancelButtonText: {
    color: '#374151',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 16,
  },
});
