import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ImageBackground, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const fondoEscanerImage = require('../imagenes/Login.jpg');
const logoImage = require('../imagenes/logorectangular.png');

function EscanerCX() {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);

  const handleScan = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      navigation.navigate('Registrocx');
    }, 2000); // Simulando un escaneo que toma 2 segundos
  };

  const handleRecambioSala = () => {
    navigation.navigate('recambio');
  };

  const handleVerTiempos = () => {
    navigation.navigate('vertiempos');
  };

  return (
    <ImageBackground source={fondoEscanerImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} />
        </View>

        <TouchableOpacity onPress={handleScan} style={styles.button}>
          <Text style={styles.buttonText}>Escanear Tiempo</Text>
        </TouchableOpacity>

        {isLoading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#FFFFFF" />
            <Text style={styles.loadingText}>Cargando...</Text>
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 100,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#2F9FFA',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
  },
});

export default EscanerCX;
