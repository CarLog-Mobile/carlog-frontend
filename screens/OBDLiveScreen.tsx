import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';

interface OBDData {
  engineRPM: number;
  speed: number;
  coolantTemp: number;
  fuelLevel: number;
  batteryVoltage: number;
  engineLoad: number;
  throttlePosition: number;
  intakeTemp: number;
  oilPressure: number;
  checkEngineLight: boolean;
  codes: string[];
}

export default function OBDLiveScreen({ navigation, route }: any) {
  const [obdData, setObdData] = useState<OBDData>({
    engineRPM: 850,
    speed: 0,
    coolantTemp: 195,
    fuelLevel: 75,
    batteryVoltage: 14.2,
    engineLoad: 15,
    throttlePosition: 0,
    intakeTemp: 85,
    oilPressure: 45,
    checkEngineLight: false,
    codes: []
  });

  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingData, setRecordingData] = useState<OBDData[]>([]);

  // Simulate real-time data updates
  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        setObdData(prev => ({
          ...prev,
          engineRPM: prev.engineRPM + (Math.random() - 0.5) * 100,
          speed: prev.speed + (Math.random() - 0.5) * 2,
          coolantTemp: prev.coolantTemp + (Math.random() - 0.5) * 2,
          fuelLevel: Math.max(0, prev.fuelLevel - 0.01),
          batteryVoltage: 14.0 + (Math.random() - 0.5) * 0.4,
          engineLoad: Math.max(0, prev.engineLoad + (Math.random() - 0.5) * 5),
          throttlePosition: Math.max(0, prev.throttlePosition + (Math.random() - 0.5) * 2),
          intakeTemp: prev.intakeTemp + (Math.random() - 0.5) * 1,
          oilPressure: prev.oilPressure + (Math.random() - 0.5) * 2
        }));

        if (isRecording) {
          setRecordingData(prev => [...prev, obdData]);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isConnected, isRecording, obdData]);

  const connectOBD = () => {
    setIsConnected(true);
    Alert.alert('Connected', 'OBD-II device connected successfully!');
  };

  const disconnectOBD = () => {
    setIsConnected(false);
    setIsRecording(false);
    setRecordingData([]);
    Alert.alert('Disconnected', 'OBD-II device disconnected');
  };

  const startRecording = () => {
    if (!isConnected) {
      Alert.alert('Error', 'Please connect OBD device first');
      return;
    }
    setIsRecording(true);
    setRecordingData([]);
    Alert.alert('Recording Started', 'Live data recording has begun');
  };

  const stopRecording = () => {
    setIsRecording(false);
    Alert.alert('Recording Stopped', `Recorded ${recordingData.length} data points`);
  };

  const getStatusColor = (value: number, min: number, max: number) => {
    if (value < min || value > max) return 'text-red-600';
    if (value > max * 0.8 || value < min * 1.2) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getGaugeColor = (value: number, min: number, max: number) => {
    if (value < min || value > max) return 'bg-red-500';
    if (value > max * 0.8 || value < min * 1.2) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Connection Status */}
        <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold">Connection Status</Text>
            <View className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} />
          </View>
          <View className="flex-row gap-2">
            {!isConnected ? (
              <TouchableOpacity
                className="flex-1 bg-green-500 py-2 rounded"
                onPress={connectOBD}
              >
                <Text className="text-white text-center font-semibold">Connect OBD</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  className="flex-1 bg-red-500 py-2 rounded"
                  onPress={disconnectOBD}
                >
                  <Text className="text-white text-center font-semibold">Disconnect</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 py-2 rounded ${isRecording ? 'bg-red-500' : 'bg-blue-500'}`}
                  onPress={isRecording ? stopRecording : startRecording}
                >
                  <Text className="text-white text-center font-semibold">
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        {isConnected && (
          <>
            {/* Engine Data */}
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
              <Text className="text-lg font-bold mb-4">Engine Data</Text>
              <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">Engine RPM</Text>
                  <Text className={`font-bold ${getStatusColor(obdData.engineRPM, 600, 3000)}`}>
                    {Math.round(obdData.engineRPM)} RPM
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">Speed</Text>
                  <Text className={`font-bold ${getStatusColor(obdData.speed, 0, 120)}`}>
                    {Math.round(obdData.speed)} MPH
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">Engine Load</Text>
                  <Text className={`font-bold ${getStatusColor(obdData.engineLoad, 0, 100)}`}>
                    {Math.round(obdData.engineLoad)}%
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">Throttle Position</Text>
                  <Text className={`font-bold ${getStatusColor(obdData.throttlePosition, 0, 100)}`}>
                    {Math.round(obdData.throttlePosition)}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Temperature & Pressure */}
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
              <Text className="text-lg font-bold mb-4">Temperature & Pressure</Text>
              <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">Coolant Temp</Text>
                  <Text className={`font-bold ${getStatusColor(obdData.coolantTemp, 160, 220)}`}>
                    {Math.round(obdData.coolantTemp)}°F
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">Intake Temp</Text>
                  <Text className={`font-bold ${getStatusColor(obdData.intakeTemp, 70, 120)}`}>
                    {Math.round(obdData.intakeTemp)}°F
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">Oil Pressure</Text>
                  <Text className={`font-bold ${getStatusColor(obdData.oilPressure, 30, 60)}`}>
                    {Math.round(obdData.oilPressure)} PSI
                  </Text>
                </View>
              </View>
            </View>

            {/* Fuel & Battery */}
            <View className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-200">
              <Text className="text-lg font-bold mb-4">Fuel & Battery</Text>
              <View className="space-y-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">Fuel Level</Text>
                  <View className="flex-row items-center">
                    <View className="w-20 bg-gray-200 rounded-full h-2 mr-2">
                      <View 
                        className={`h-2 rounded-full ${getGaugeColor(obdData.fuelLevel, 10, 100)}`}
                        style={{ width: `${obdData.fuelLevel}%` }}
                      />
                    </View>
                    <Text className={`font-bold ${getStatusColor(obdData.fuelLevel, 10, 100)}`}>
                      {Math.round(obdData.fuelLevel)}%
                    </Text>
                  </View>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-600">Battery Voltage</Text>
                  <Text className={`font-bold ${getStatusColor(obdData.batteryVoltage, 12.0, 14.5)}`}>
                    {obdData.batteryVoltage.toFixed(1)}V
                  </Text>
                </View>
              </View>
            </View>

            {/* Check Engine Light */}
            {obdData.checkEngineLight && (
              <View className="bg-red-100 border border-red-300 rounded-lg p-4 mb-4">
                <Text className="text-red-800 font-bold text-center">⚠️ Check Engine Light ON</Text>
                {obdData.codes.length > 0 && (
                  <Text className="text-red-600 text-center mt-2">
                    Error Codes: {obdData.codes.join(', ')}
                  </Text>
                )}
              </View>
            )}

            {/* Recording Status */}
            {isRecording && (
              <View className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-4">
                <Text className="text-blue-800 font-bold text-center">🔴 Recording Live Data</Text>
                <Text className="text-blue-600 text-center mt-2">
                  Data Points: {recordingData.length}
                </Text>
              </View>
            )}
          </>
        )}

        {/* Navigation */}
        <TouchableOpacity
          className="bg-purple-500 py-3 rounded-lg mb-4"
          onPress={() => navigation.navigate('Cars')}
        >
          <Text className="text-white text-center font-semibold text-lg">Back to Cars</Text>
        </TouchableOpacity>
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
