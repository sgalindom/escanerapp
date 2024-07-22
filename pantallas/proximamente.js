import React from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const fondoMainImage = require('./imagenes/Login.jpg');
const logoImage = require('./imagenes/logoblanco.png');


function Proximamente() {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <ImageBackground source={fondoMainImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={styles.text}>¡Próximamente!</Text>
        <TouchableOpacity style={styles.button} onPress={handleGoBack}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFFFFF',
  },
  button: {
    backgroundColor: '#2F9FFA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    marginTop: 50,
  },
});

export default Proximamente;
