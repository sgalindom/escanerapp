import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const background = require('../imagenes/Login.jpg');
const logo = require('../imagenes/logoblanco.png');

const MainPanel = () => {
  const navigation = useNavigation();

  const handleNavigateToCirugia = () => {
    navigation.navigate('EscanerCX');
  };

  const handleNavigateToUrgencias = () => {
    navigation.navigate('escanerurg');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={background} style={styles.backgroundImage}>
        <View style={styles.overlay}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
          </View>
          <TouchableOpacity onPress={handleNavigateToCirugia} style={styles.button}>
            <Text style={styles.buttonText}>CIRUGÍA</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNavigateToUrgencias} style={styles.button}>
            <Text style={styles.buttonText}>URGENCIAS</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoContainer: {
    marginBottom: 50,
    alignItems: 'center',
  },
  logo: {
    width: 400,
    height: 100,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#2F9FFA',
    width: '80%',
    height: 60,
    borderRadius: 30, // Bordes más redondeados
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  logoutButton: {
    backgroundColor: '#e74c3c',
    width: '50%',
    height: 50,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});

export default MainPanel;
