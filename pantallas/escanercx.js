import React from 'react';
import { View, TouchableOpacity, Text, ImageBackground, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const fondoEscanerImage = require('./imagenes/Login.jpg');
const logoImage = require('./imagenes/logorectangular.png');

function EscanerCX() {
  const navigation = useNavigation();

  const handleScan = () => {
    navigation.navigate('Registrocx');
  };

  const handleRecambioSala = () => {
    // Navegar a la pantalla de recambio de sala
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

      

        
        <TouchableOpacity onPress={handleVerTiempos} style={styles.button}>
          <Text style={styles.buttonText}>Tiempos recambio</Text>
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
});

export default EscanerCX;
