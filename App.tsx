import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import DashboardScreen from './screens/DashboardScreen';
import CarsScreen from './screens/CarsScreen';
import TripsScreen from './screens/TripsScreen';
import FuelScreen from './screens/FuelScreen';
import MaintenanceScreen from './screens/MaintenanceScreen';
import OBDLiveScreen from './screens/OBDLiveScreen';

// import './global.css'; // Temporarily disabled - NativeWind cache issue

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('Dashboard');

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        'Poppins-Regular': require('./fonts/Poppins-Regular.ttf'),
        'Poppins-SemiBold': require('./fonts/Poppins-SemiBold.ttf'),
        'Coinbase-Sans-Medium': require('./fonts/Coinbase_Sans-Medium.ttf'),
      });
      setFontsLoaded(true);
    }
    loadFonts();
  }, []);

  const navigation = {
    navigate: (screenName: string) => {
      setCurrentScreen(screenName);
    },
    goBack: () => {
      setCurrentScreen('Dashboard');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'Dashboard':
        return <DashboardScreen navigation={navigation} />;
      case 'Cars':
        return <CarsScreen navigation={navigation} />;
      case 'Trips':
        return <TripsScreen navigation={navigation} />;
      case 'Fuel':
        return <FuelScreen navigation={navigation} />;
      case 'Maintenance':
        return <MaintenanceScreen navigation={navigation} />;
      case 'OBDLive':
        return <OBDLiveScreen navigation={navigation} />;
      default:
        return <DashboardScreen navigation={navigation} />;
    }
  };

  if (!fontsLoaded) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      {renderScreen()}
      <StatusBar style="auto" />
    </View>
  );
}
