// Login.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '@react-native-firebase/auth';

const backgroundImage = require('./imagenes/Login.jpg');
const logoImage = require('./imagenes/logo_2.png');

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      // Si el usuario tiene un token de sesión guardado
      // Consultar el rol del usuario o cualquier otra información necesaria para determinar si es administrador
      const isAdmin = false; // Aquí debes implementar la lógica para determinar si el usuario es administrador

      if (isAdmin) {
        // Si el usuario es administrador, navegar al panel de administrador
        navigation.replace('paneladmin');
      } else {
        // Si no es administrador, navegar al panel principal
        navigation.replace('MainPanel');
      }
    }
  };

  const handleLogin = async () => {
    setIsLoading(true);

    try {
      const response = await firebase.auth().signInWithEmailAndPassword(email, password);

      if (response.user) {
        console.log('Inicio de sesión exitoso');
        await AsyncStorage.setItem('userToken', response.user.uid);
        if (email === 'admin@gmail.com') {
          navigation.replace('paneladmin'); // Redireccionar al panel de administrador
        } else {
          navigation.replace('MainPanel');
        }
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setError('Ocurrió un error al iniciar sesión');
    }

    setIsLoading(false);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} />
        </View>
        <Text style={styles.welcomeText}>Bienvenido</Text>
        <TextInput
          placeholder="Correo electrónico"
          placeholderTextColor="black"
          onChangeText={(text) => setEmail(text)}
          value={email}
          style={styles.input}
        />
        <TextInput
          placeholder="Contraseña"
          placeholderTextColor="black"
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          value={password}
          style={styles.input}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <TouchableOpacity onPress={handleLogin} style={styles.button}>
          <Text style={styles.buttonText}>Iniciar sesión</Text>
        </TouchableOpacity>
      </View>
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2F9FFA" />
        </View>
      )}
    </ImageBackground>
  );
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 24,
    paddingTop: 50,
  },
  logoContainer: {
    marginBottom: 20,
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    width: '100%',
    marginBottom: 16,
    padding: 12,
    backgroundColor: 'white',
    color: 'black',
  },
  button: {
    backgroundColor: '#2F9FFA',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
  errorText: {
    color: 'red',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 10,
  },  
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center', 
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default Login;
