import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const fondoMainImage = require('../imagenes/Login.jpg');
const logoImage = require('../imagenes/logoblanco.png');

function Farmacia() {
  const [cedula, setCedula] = useState('');
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleConsultar = () => {
    if (!cedula.trim()) {
      Alert.alert('Error', 'Por favor, ingresa la cédula.');
      return;
    }

    setLoading(true);

    // Simulación de la respuesta de la API
    setTimeout(() => {
      setLoading(false);
      const medicamentos = ['Paracetamol', 'Ibuprofeno', 'Amoxicilina']; // Medicamentos simulados
      navigation.navigate('pedidosfarmacia', { medicamentos });
    }, 1000); // Simula un retraso de 1 segundo

  };

  return (
    <ImageBackground source={fondoMainImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={styles.title}>Consultar Medicamentos</Text>
        <TextInput
          style={styles.input}
          placeholder="Ingresa la cédula"
          value={cedula}
          onChangeText={setCedula}
          keyboardType="numeric"
        />
        <TouchableOpacity style={styles.button} onPress={handleConsultar} disabled={loading}>
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.buttonText}>Consultar</Text>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={handleGoBack}>
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  input: {
    width: '100%',
    padding: 15,
    borderColor: '#FFFFFF',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    color: '#000000',
  },
  button: {
    backgroundColor: '#FF6F61',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    backgroundColor: '#FF6347',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Farmacia;
