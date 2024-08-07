import React from 'react';
import { View, TouchableOpacity, Text, ImageBackground, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const fondoEscanerImage = require('../imagenes/Login.jpg');
const logoImage = require('../imagenes/logoblanco.png');

function EscanerURG() {
  const navigation = useNavigation();

  const handleScan = () => {
    navigation.navigate('registrourg');
  };

  

  

  return (
    <ImageBackground source={fondoEscanerImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} />
        </View>

        
        <TouchableOpacity onPress={handleScan} style={styles.button}>
          <Text style={styles.buttonText}>Escanear Tiempo de urgencia</Text>
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

export default EscanerURG;
