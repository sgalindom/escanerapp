import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const backgroundImage = require('./imagenes/Login.jpg');
const logoImage = require('./imagenes/logo_2.png');

const API_URL = 'http://192.168.11.247:2001/api/auth/loginMenus';

function Login({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
      setIsLoading(true);

      try {
        const response = await axios.post(API_URL, {
          usuario: username,
          clave: password,
          modulo: 'HIS'
        });

        if (response.data.tokens.accessToken) {
          console.log('Token recibido:', response.data.tokens.accessToken); 
          await AsyncStorage.setItem('accessToken', response.data.tokens.accessToken);
          navigation.navigate('MainPanel', { username: username });
        } else {
          setError('Usuario o contraseña incorrectos');
        }
      } catch (error) {
        console.error('Error de red:', error);

        if (error.response) {
          console.error('Respuesta del servidor:', error.response.data);
          console.error('Código de estado:', error.response.status);
          Alert.alert('Error', 'Ocurrió un error en la solicitud. Por favor, inténtalo de nuevo más tarde.');
        } else if (error.request) {
          console.error('No se recibió respuesta del servidor');
          Alert.alert('Error', 'No se recibió respuesta del servidor. Por favor, verifica tu conexión a internet.');
        } else {
          console.error('Error al configurar la solicitud:', error.message);
          Alert.alert('Error', 'Ocurrió un error al procesar la solicitud. Por favor, inténtalo de nuevo más tarde.');
        }

        setError('Ocurrió un error al procesar la solicitud');
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
          placeholder="Usuario"
          placeholderTextColor="black"
          onChangeText={(text) => setUsername(text)}
          value={username}
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
