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
    { title: 'Add Trip', icon: 'car' as const, color: '#3b82f6', onPress: () => navigation.navigate('Trips') },
    { title: 'Add Fuel', icon: 'water' as const, color: '#10b981', onPress: () => navigation.navigate('Fuel') },
    { title: 'Maintenance', icon: 'construct' as const, color: '#f59e0b', onPress: () => navigation.navigate('Maintenance') },
    { title: 'OBD Live', icon: 'analytics' as const, color: '#8b5cf6', onPress: () => navigation.navigate('OBDLive') },
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

          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.quickActionsGrid}>
                             {quickActions.map((action, index) => (
                 <TouchableOpacity
                   key={index}
                   style={[styles.quickActionCard, { backgroundColor: action.color }]}
                   onPress={action.onPress}
                 >
                   <Ionicons name={action.icon} size={32} color="white" style={styles.quickActionIcon} />
                   <Text style={styles.quickActionText}>{action.title}</Text>
                 </TouchableOpacity>
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
    backgroundColor: '#f9fafb',
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
    fontSize: 32,
    fontWeight: 'bold',
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
    backgroundColor: '#3b82f6',
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
    borderRadius: 12,
    padding: 16,
    flex: 1,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1f2937',
    marginTop: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quickActionCard: {
    backgroundColor: '#3b82f6',
    borderRadius: 12,
    padding: 20,
    width: '47%',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  performanceCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
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
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
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
