import React, { useRef, useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, StatusBar, Vibration, TouchableOpacity, Modal } from 'react-native';
import { useBarcode } from './BarcodeContext';
import { Camera, CameraType, Orientation } from 'react-native-camera-kit';
import { useData } from './DataContext';
import { useNavigation } from '@react-navigation/native';

const Registrocx = () => {
  const navigation = useNavigation();
  const cameraRef = useRef(null);
  const { barcode, setBarcode } = useBarcode();
  const { data, updateData } = useData();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedProcedure, setSelectedProcedure] = useState('');
  const [registerTime, setRegisterTime] = useState('');
  const [lastScanTime, setLastScanTime] = useState(0); // Estado para almacenar la última vez que se escaneó un código

  const handleBarcodeRead = (event) => {
    const currentTime = Date.now();
    if (currentTime - lastScanTime > 1000) { // Verificar si ha pasado al menos 1 segundo desde el último escaneo
      Vibration.vibrate(100);
      const barcodeValue = event.nativeEvent.codeStringValue;
      setBarcode(barcodeValue);
      setShowInfoModal(true);
      setLastScanTime(currentTime); // Actualizar el tiempo del último escaneo
      console.log('barcode', barcodeValue);
    }
  };

  const handleRegisterTime = () => {
    const currentTime = new Date().toLocaleString();
    setRegisterTime(currentTime);
    navigation.navigate('EscanerCX', { folio: barcode }); // Pasar el folio como parámetro de ruta
    updateData({
      selectedArea,
      selectedProcedure,
      registerTime: currentTime
    });
    setShowInfoModal(false);
  };

  const selectedAreaOptions = ['Area 1', 'Area 2'];
  const selectedProcedureOptions = ['Entrada Transfer', 'Salida Transfer', 'Entrada CX', 'Salida CX', 'Dado de Alta'];

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <SafeAreaView style={styles.cameraContainer}>
        <Camera
          ref={cameraRef}
          style={styles.cameraPreview}
          flashMode={CameraType.Auto}
          zoomMode="on"
          focusMode="on"
          torchMode="off"
          onOrientationChange={(e) => {
            switch (e.nativeEvent.orientation) {
              case Orientation.LandscapeLeft:
                console.log('orientationChange', 'LandscapeLeft');
                break;
              case Orientation.LandscapeRight:
                console.log('orientationChange', 'LandscapeRight');
                break;
              case Orientation.Portrait:
                console.log('orientationChange', 'Portrait');
                break;
              case Orientation.PortraitUpsideDown:
                console.log('orientationChange', 'PortraitUpsideDown');
                break;
              default:
                console.log('orientationChange', e.nativeEvent);
                break;
            }
          }}
          laserColor="red"
          frameColor="white"
          scanBarcode
          showFrame
          onReadCode={handleBarcodeRead}
        />
      </SafeAreaView>
      <Modal visible={showInfoModal} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Información del código QR:</Text>
            <Text style={styles.modalText}>{barcode}</Text>
            
            {/* Selección del área */}
            <Text style={styles.modalText}>Seleccione el área:</Text>
            {selectedAreaOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedArea(option)}
                style={[styles.option, selectedArea === option && styles.selectedOption]}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}
            
            {/* Selección del procedimiento */}
            <Text style={styles.modalText}>Seleccione el procedimiento:</Text>
            {selectedProcedureOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedProcedure(option)}
                style={[styles.option, selectedProcedure === option && styles.selectedOption]}>
                <Text style={styles.optionText}>{option}</Text>
              </TouchableOpacity>
            ))}

            <Text style={styles.modalText}>Tiempo exacto: {registerTime}</Text>
            <TouchableOpacity onPress={handleRegisterTime} style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Registrar Tiempo</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPreview: {
    aspectRatio: 1,
    width: '100%',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  option: {
    backgroundColor: '#2F9FFA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  selectedOption: {
    backgroundColor: '#4EB8F0', 
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  optionText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#2F9FFA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Registrocx;
