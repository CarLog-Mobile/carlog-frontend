import React from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import DashboardScreen from './screens/DashboardScreen';

import './global.css';

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <DashboardScreen navigation={{ navigate: () => {} }} />
      <StatusBar style="auto" />
    </View>
  );
}
