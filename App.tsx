import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as Font from 'expo-font';
import DashboardScreen from './screens/DashboardScreen';

import './global.css';

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

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

  if (!fontsLoaded) {
    return <View style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <DashboardScreen navigation={{ navigate: () => {} }} />
      <StatusBar style="auto" />
    </View>
  );
}
