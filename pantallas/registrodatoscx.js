import React, { useState } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import { useBarcode } from './BarcodeContext'; 

const fondoEscanerImage = require('./imagenes/Login.jpg');
const logoImage = require('./imagenes/logorectangular.png');

const RegistroDatosCX = () => {
  const { barcode } = useBarcode(); // Obtiene el código de barras del contexto
  const [selectedArea, setSelectedArea] = useState(null);
  const [selectedProcedure, setSelectedProcedure] = useState(null);
  const [procedureTime, setProcedureTime] = useState({});
  const areas = ['Área 1', 'Área 2'];
  const procedures = ['Entrada transfer', 'Salida transfer', 'Entrada CX', 'Salida CX'];
  const scanDateTime = new Date().toLocaleString(); // Obtiene la fecha 
  const navigation = useNavigation(); 

  const handleRegister = () => {
    // Guarda la fecha
    setProcedureTime((prevProcedureTime) => ({
      ...prevProcedureTime,
      [selectedProcedure]: scanDateTime,
    }));
    // Navega
    navigation.navigate('EscanerCX', {
      selectedArea,
      selectedProcedure,
      scanDateTime,
    });
  };

  const renderOptions = (options, setSelectedOption, selectedOption) => {
    return options.map((option, index) => (
      <TouchableOpacity
        key={index}
        style={[
          styles.option,
          selectedOption === option && styles.selectedOption,
        ]}
        onPress={() => setSelectedOption(option)}
      >
        <Text style={styles.optionText}>{option}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <ImageBackground source={fondoEscanerImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={logoImage} style={styles.logo} />
        <View style={styles.headingContainer}>
          <Text style={styles.heading}>Registro de Tiempos de Ingreso</Text>
        </View>
        <Text style={styles.barcode}>Folio Escaneado: {barcode}</Text>
        <Text style={styles.scanDateTime}>Fecha y Hora del Escaneo: {scanDateTime}</Text>

        <View style={styles.dropdown}>
          <Text style={styles.dropdownTitle}>Selecciona un Área</Text>
          <ScrollView style={styles.dropdownOptions}>
            {renderOptions(areas, setSelectedArea, selectedArea)}
          </ScrollView>
        </View>

        <View style={styles.dropdown}>
          <Text style={styles.dropdownTitle}>Selecciona un Procedimiento</Text>
          <ScrollView style={styles.dropdownOptions}>
            {renderOptions(procedures, setSelectedProcedure, selectedProcedure)}
          </ScrollView>
        </View>

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>Registrar</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  headingContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  barcode: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  scanDateTime: {
    fontSize: 16,
    color: 'white',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  dropdown: {
    marginBottom: 20,
    width: '80%',
  },
  dropdownTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  dropdownOptions: {
    maxHeight: 150,
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedOption: {
    backgroundColor: '#2F9FFA',
  },
  optionText: {
    fontSize: 16,
    color: 'black',
  },
  registerButton: {
    backgroundColor: '#2F9FFA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    elevation: 5,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default RegistroDatosCX;
