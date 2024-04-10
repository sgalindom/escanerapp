import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const fondoMainImage = require('./imagenes/Login.jpg');
const logoImage = require('./imagenes/logo_2.png');

function MainPanel() {
  const navigation = useNavigation();

  const handleNavigateToCirugia = () => {
    navigation.navigate('EscanerCX');
  };

  const handleNavigateToUrgencias = () => {
    navigation.navigate('Urgencias');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.curveContainer}></View>
        <Text style={styles.welcomeText}>Bienvenido</Text>
      </View>
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
  headerContainer: {
    backgroundColor: '#FFFFFF', 
  },
  curveContainer: {
    width: '100%',
    height: 50,
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    overflow: 'hidden',
    position: 'absolute',
    top: 0,
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2F9FFA',
    marginTop: 10,
    textAlign: 'center',
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
    marginBottom: 100, 
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
});

export default MainPanel;
