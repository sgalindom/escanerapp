import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const fondoMainImage = require('./imagenes/Login.jpg');
const logoImage = require('./imagenes/logo_2.png');

function MainPanel() {
  const navigation = useNavigation();

  const handleNavigateToCirugia = () => {
    navigation.navigate('EscanerCX');
  };

  const handleNavigateToUrgencias = () => {
    navigation.navigate('proximamente');
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    navigation.replace('Login');
  };

  

  return (
    <View style={styles.container}>
      <ImageBackground source={fondoMainImage} style={styles.backgroundImage}>
        <View style={styles.contentContainer}>
          <View style={styles.logoContainer}>
            <Image source={logoImage} style={styles.logo} />
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={handleNavigateToCirugia} style={styles.button}>
              <Text style={styles.buttonText}>CIRUGÍA</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.buttonWrapper}>
            <TouchableOpacity onPress={handleNavigateToUrgencias} style={styles.button}>
              <Text style={styles.buttonText}>URGENCIAS</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Cerrar sesión</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', 
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    marginBottom: 50, 
  },
  logo: {
    width: 300, 
    height: 200, 
    resizeMode: 'contain',
  },
  buttonWrapper: {
    marginBottom: 20, 
  },
  button: {
    backgroundColor: '#FFFFFF', 
    width: 300, 
    height: 100, 
    borderRadius: 10, 
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#2F9FFA', 
    fontSize: 20, 
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#FF6347', 
    width: 200, 
    height: 50, 
    borderRadius: 10, 
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  logoutButtonText: {
    color: '#FFFFFF', 
    fontSize: 16, 
    fontWeight: 'bold',
  },
});

export default MainPanel;
