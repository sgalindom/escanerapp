import React, { useRef, useState } from 'react';
import { StyleSheet, View, StatusBar, Text, TouchableOpacity } from 'react-native';
import { Camera, CameraType } from 'react-native-camera-kit';
import { useNavigation } from '@react-navigation/native';
import { useBarcode } from '../BarcodeContext';

const Registrourg = () => {
  const [scannedData, setScannedData] = useState(null);
  const [scanDateTime, setScanDateTime] = useState(null);
  const cameraRef = useRef(null);
  const navigation = useNavigation();
  const { setBarcode } = useBarcode();

  const handleBarcodeRead = ({ nativeEvent }) => {
    const barcodeValue = nativeEvent.codeStringValue;
    const currentDateTime = new Date();
    const formattedDate = `${currentDateTime.getFullYear()}-${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}-${currentDateTime.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${currentDateTime.getHours().toString().padStart(2, '0')}:${currentDateTime.getMinutes().toString().padStart(2, '0')}`;
    setScannedData(barcodeValue);
    setScanDateTime(`${formattedDate} ${formattedTime}`);
    setBarcode(barcodeValue);
  };

  const handleRegister = () => {
    navigation.navigate('registrodatosurg', { scanDateTime: scanDateTime, scannedData: scannedData });
  };

  const handleScanAgain = () => {
    setScannedData(null);
    setScanDateTime(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.cameraPreview}
          flashMode={CameraType.Auto}
          zoomMode="on"
          focusMode="on"
          torchMode="off"
          scanBarcode
          onReadCode={handleBarcodeRead}
        />
        {scannedData && (
          <View style={styles.overlay}>
            <Text style={styles.text}>Código QR: {scannedData}</Text>
            <Text style={styles.text}>Hora del escaneo: {scanDateTime}</Text>
            <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
              <Text style={styles.registerButtonText}>Registrar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.scanAgainButton} onPress={handleScanAgain}>
              <Text style={styles.scanAgainButtonText}>Intentar de Nuevo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  cameraContainer: {
    flex: 1,
  },
  cameraPreview: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
    marginBottom: 10,
  },
  registerButton: {
    backgroundColor: '#2F9FFA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  scanAgainButton: {
    backgroundColor: '#FF5733',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  scanAgainButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Registrourg;
