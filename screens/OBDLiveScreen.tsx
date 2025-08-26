import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

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
    if (value < min || value > max) return '#ef4444';
    if (value > max * 0.8 || value < min * 1.2) return '#f59e0b';
    return '#059669';
  };

  const getGaugeColor = (value: number, min: number, max: number) => {
    if (value < min || value > max) return '#ef4444';
    if (value > max * 0.8 || value < min * 1.2) return '#f59e0b';
    return '#059669';
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>OBD Live Data</Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={20} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="settings" size={20} color="#1f2937" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="help-circle" size={20} color="#1f2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Connection Status */}
        <View style={styles.connectionCard}>
          <View style={styles.connectionHeader}>
            <Text style={styles.connectionTitle}>Connection Status</Text>
            <View style={[styles.connectionIndicator, { backgroundColor: isConnected ? '#059669' : '#ef4444' }]} />
          </View>
          <View style={styles.connectionButtons}>
            {!isConnected ? (
              <TouchableOpacity
                style={styles.connectButton}
                onPress={connectOBD}
              >
                <Ionicons name="bluetooth" size={16} color="white" />
                <Text style={styles.connectButtonText}>Connect OBD</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.connectedButtons}>
                <TouchableOpacity
                  style={styles.disconnectButton}
                  onPress={disconnectOBD}
                >
                  <Ionicons name="close-circle" size={16} color="white" />
                  <Text style={styles.disconnectButtonText}>Disconnect</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.recordButton, isRecording && styles.recordingButton]}
                  onPress={isRecording ? stopRecording : startRecording}
                >
                  <Ionicons name={isRecording ? "stop" : "play"} size={16} color="white" />
                  <Text style={styles.recordButtonText}>
                    {isRecording ? 'Stop Recording' : 'Start Recording'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </View>

        {isConnected && (
          <>
            {/* Engine Data */}
            <View style={styles.dataCard}>
              <Text style={styles.dataCardTitle}>Engine Data</Text>
              <View style={styles.dataGrid}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Engine RPM</Text>
                  <Text style={[styles.dataValue, { color: getStatusColor(obdData.engineRPM, 600, 3000) }]}>
                    {Math.round(obdData.engineRPM)} RPM
                  </Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Speed</Text>
                  <Text style={[styles.dataValue, { color: getStatusColor(obdData.speed, 0, 120) }]}>
                    {Math.round(obdData.speed)} MPH
                  </Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Engine Load</Text>
                  <Text style={[styles.dataValue, { color: getStatusColor(obdData.engineLoad, 0, 100) }]}>
                    {Math.round(obdData.engineLoad)}%
                  </Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Throttle Position</Text>
                  <Text style={[styles.dataValue, { color: getStatusColor(obdData.throttlePosition, 0, 100) }]}>
                    {Math.round(obdData.throttlePosition)}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Temperature & Pressure */}
            <View style={styles.dataCard}>
              <Text style={styles.dataCardTitle}>Temperature & Pressure</Text>
              <View style={styles.dataGrid}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Coolant Temp</Text>
                  <Text style={[styles.dataValue, { color: getStatusColor(obdData.coolantTemp, 160, 220) }]}>
                    {Math.round(obdData.coolantTemp)}°F
                  </Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Intake Temp</Text>
                  <Text style={[styles.dataValue, { color: getStatusColor(obdData.intakeTemp, 70, 120) }]}>
                    {Math.round(obdData.intakeTemp)}°F
                  </Text>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Oil Pressure</Text>
                  <Text style={[styles.dataValue, { color: getStatusColor(obdData.oilPressure, 30, 60) }]}>
                    {Math.round(obdData.oilPressure)} PSI
                  </Text>
                </View>
              </View>
            </View>

            {/* Fuel & Battery */}
            <View style={styles.dataCard}>
              <Text style={styles.dataCardTitle}>Fuel & Battery</Text>
              <View style={styles.dataGrid}>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Fuel Level</Text>
                  <View style={styles.fuelGaugeContainer}>
                    <View style={styles.fuelGauge}>
                      <View 
                        style={[styles.fuelGaugeFill, { 
                          width: `${obdData.fuelLevel}%`,
                          backgroundColor: getGaugeColor(obdData.fuelLevel, 10, 100)
                        }]}
                      />
                    </View>
                    <Text style={[styles.dataValue, { color: getStatusColor(obdData.fuelLevel, 10, 100) }]}>
                      {Math.round(obdData.fuelLevel)}%
                    </Text>
                  </View>
                </View>
                <View style={styles.dataRow}>
                  <Text style={styles.dataLabel}>Battery Voltage</Text>
                  <Text style={[styles.dataValue, { color: getStatusColor(obdData.batteryVoltage, 12.0, 14.5) }]}>
                    {obdData.batteryVoltage.toFixed(1)}V
                  </Text>
                </View>
              </View>
            </View>

            {/* Check Engine Light */}
            {obdData.checkEngineLight && (
              <View style={styles.warningCard}>
                <Ionicons name="warning" size={24} color="#ef4444" />
                <Text style={styles.warningTitle}>Check Engine Light ON</Text>
                {obdData.codes.length > 0 && (
                  <Text style={styles.warningText}>
                    Error Codes: {obdData.codes.join(', ')}
                  </Text>
                )}
              </View>
            )}

            {/* Recording Status */}
            {isRecording && (
              <View style={styles.recordingCard}>
                <Ionicons name="radio-button-on" size={24} color="#0656E0" />
                <Text style={styles.recordingTitle}>Recording Live Data</Text>
                <Text style={styles.recordingText}>
                  Data Points: {recordingData.length}
                </Text>
              </View>
            )}
          </>
        )}

        {/* Navigation */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Cars')}
        >
          <Ionicons name="arrow-back" size={20} color="white" />
          <Text style={styles.backButtonText}>Back to Cars</Text>
        </TouchableOpacity>
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
  connectionCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  connectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  connectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1f2937',
  },
  connectionIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  connectionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  connectButton: {
    flex: 1,
    backgroundColor: '#059669',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  connectButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  connectedButtons: {
    flexDirection: 'row',
    gap: 8,
    flex: 1,
  },
  disconnectButton: {
    flex: 1,
    backgroundColor: '#ef4444',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  disconnectButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  recordButton: {
    flex: 1,
    backgroundColor: '#0656E0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  recordingButton: {
    backgroundColor: '#ef4444',
  },
  recordButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  dataCard: {
    backgroundColor: 'white',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  dataCardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1f2937',
  },
  dataGrid: {
    gap: 12,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dataLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  dataValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  fuelGaugeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fuelGauge: {
    width: 80,
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fuelGaugeFill: {
    height: '100%',
    borderRadius: 4,
  },
  warningCard: {
    backgroundColor: '#fef2f2',
    borderWidth: 1,
    borderColor: '#fecaca',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  warningTitle: {
    color: '#ef4444',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  warningText: {
    color: '#ef4444',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  recordingCard: {
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#bfdbfe',
    borderRadius: 18,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  recordingTitle: {
    color: '#0656E0',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 8,
  },
  recordingText: {
    color: '#0656E0',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 4,
  },
  backButton: {
    backgroundColor: '#8b5cf6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 18,
    marginBottom: 16,
    gap: 8,
  },
  backButtonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 18,
  },
});
