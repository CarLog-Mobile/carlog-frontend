import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Dimensions } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

interface DashboardStats {
  totalCars: number;
  totalTrips: number;
  totalFuelCost: number;
  totalMaintenanceCost: number;
  averageMPG: number;
  thisMonthTrips: number;
}

export default function DashboardScreen({ navigation }: any) {
  
  const stats: DashboardStats = {
    totalCars: 2,
    totalTrips: 15,
    totalFuelCost: 245.50,
    totalMaintenanceCost: 180.00,
    averageMPG: 28.5,
    thisMonthTrips: 8
  };

  const quickActions = [
    { title: 'Cars', icon: 'car' as const, onPress: () => navigation.navigate('Cars') },
    { title: 'Reminders', icon: 'notifications' as const, onPress: () => navigation.navigate('Reminders') },
    { title: 'Trips', icon: 'map' as const, onPress: () => navigation.navigate('Trips') },
    { title: 'Scanner', icon: 'scan' as const, onPress: () => navigation.navigate('Scanner') },
  ];

  const recentActivity = [
    { type: 'trip', title: 'Home → Work', time: '2 hours ago', icon: 'car' as const },
    { type: 'fuel', title: 'Fuel refill - $45.20', time: '1 day ago', icon: 'water' as const },
    { type: 'maintenance', title: 'Oil change completed', time: '3 days ago', icon: 'construct' as const },
    { type: 'trip', title: 'Grocery store run', time: '1 week ago', icon: 'car' as const },
  ];



  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Dashboard</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="search" size={20} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="notifications-outline" size={20} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.profileButton}>
            <Ionicons name="person" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>

        <ScrollView style={styles.scrollView}>
          {/* Stats Cards */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Trips</Text>
              <Text style={styles.statValue}>{stats.totalTrips}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Miles travelled</Text>
              <Text style={styles.statValue}>1,247</Text>
            </View>
          </View>

          {/* Currently Selected Vehicle */}
          <View style={styles.vehicleSection}>
            <View style={styles.vehicleHeader}>
              <Text style={styles.vehicleHeaderTitle}>Currently Selected</Text>
              <TouchableOpacity>
                <Text style={styles.changeVehicleText}>Change vehicle</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.vehicleCard}>
              <View style={styles.vehicleContent}>
                <View style={styles.vehicleInfo}>
                  <Text style={styles.vehicleName}>Toyota Camry</Text>
                  <Text style={styles.vehicleYear}>2022</Text>
                  <Text style={styles.vehiclePlate}>ABC-1234</Text>
                  <TouchableOpacity style={styles.detailsButton}>
                    <Ionicons name="eye-outline" size={16} color="#1f2937" />
                    <Text style={styles.detailsButtonText}>Details</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.vehicleImage}>
                  <View style={styles.imagePlaceholder}>
                    <Ionicons name="car" size={40} color="#9ca3af" />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Quick Actions</Text>
              <TouchableOpacity>
                <Text style={styles.viewAllText}>View all</Text>
              </TouchableOpacity>
            </View>
                                                   <View style={styles.quickActionsGrid}>
                {quickActions.map((action, index) => (
                  <View key={index} style={styles.quickActionContainer}>
                    <TouchableOpacity
                      style={styles.quickActionCard}
                      onPress={action.onPress}
                    >
                      <Ionicons name={action.icon} size={36} color="#0656E0" style={styles.quickActionIcon} />
                    </TouchableOpacity>
                    <Text style={styles.quickActionText}>{action.title}</Text>
                  </View>
                ))}
              </View>
          </View>

          {/* Performance Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Performance</Text>
            <View style={styles.performanceCard}>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>Average MPG</Text>
                <Text style={styles.performanceValue}>{stats.averageMPG}</Text>
              </View>
              <View style={styles.performanceItem}>
                <Text style={styles.performanceLabel}>This Month Trips</Text>
                <Text style={styles.performanceValue}>{stats.thisMonthTrips}</Text>
              </View>
            </View>
          </View>

          {/* Recent Activity */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
                         {recentActivity.map((activity, index) => (
               <View key={index} style={styles.activityItem}>
                 <Ionicons name={activity.icon} size={20} color="#6b7280" style={styles.activityIcon} />
                 <View style={styles.activityContent}>
                   <Text style={styles.activityTitle}>{activity.title}</Text>
                   <Text style={styles.activityTime}>{activity.time}</Text>
                 </View>
               </View>
             ))}
          </View>
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
  profileButton: {
    backgroundColor: '#0656E0',
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
  vehicleSection: {
    marginBottom: 24,
  },
  vehicleCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
  },
  vehicleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  vehicleHeaderTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  changeVehicleText: {
    fontSize: 16,
    fontFamily: 'Coinbase-Sans-Medium',
    color: '#0656E0',
    fontWeight: '500',
  },
  vehicleContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  vehicleYear: {
    fontSize: 16,
    color: '#1f2937',
    marginBottom: 4,
  },
  vehiclePlate: {
    fontSize: 16,
    color: '#1f2937',
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
  vehicleImage: {
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
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  viewAllText: {
    fontSize: 16,
    color: '#0656E0',
    fontWeight: '500',
    fontFamily: 'Coinbase-Sans-Medium',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionContainer: {
    alignItems: 'center',
    width: '22%',
  },
  quickActionCard: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    width: '100%',
    height: 80,
    marginBottom: 8,
  },
  quickActionIcon: {
    marginBottom: 8,
  },
  quickActionText: {
    color: '#1f2937',
    fontSize: 14,
    fontFamily: 'Coinbase-Sans-Medium',
    fontWeight: '500',
    textAlign: 'center',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#ef4444',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  performanceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
  },
  performanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  performanceLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  performanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginBottom: 8,
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1f2937',
  },
  activityTime: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
});
