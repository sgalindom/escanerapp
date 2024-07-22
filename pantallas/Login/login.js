import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ImageBackground, StyleSheet, Dimensions, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebase } from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/FontAwesome';

const backgroundImage = require('../imagenes/Login.jpg');
const logoImage = require('../imagenes/logorectangular.png');

function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    checkUserLoggedIn();
  }, []);

  const checkUserLoggedIn = async () => {
    const userToken = await AsyncStorage.getItem('userToken');
    if (userToken) {
      const isAdmin = false; // Implementa la lógica para determinar si el usuario es administrador
      if (isAdmin) {
        navigation.replace('paneladmin');
      } else {
        navigation.replace('MainPanel');
      }
    }
  };

  const showAlert = (title, message) => {
    Alert.alert(title, message, [{ text: 'OK' }], { cancelable: false });
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Error', 'Por favor, ingrese su correo y contraseña');
      return;
    }

    setIsLoading(true);
    try {
      const response = await firebase.auth().signInWithEmailAndPassword(email, password);
      if (response.user) {
        await AsyncStorage.setItem('userToken', response.user.uid);
        if (email === 'admin@gmail.com') {
          navigation.replace('paneladmin');
        } else {
          navigation.replace('MainPanel');
        }
      }
    } catch (error) {
      let errorMessage = 'Ocurrió un error al iniciar sesión';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Correo electrónico inválido';
          break;
        case 'auth/user-disabled':
          errorMessage = 'Usuario deshabilitado';
          break;
        case 'auth/user-not-found':
          errorMessage = 'Usuario no encontrado';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Contraseña incorrecta';
          break;
        default:
          break;
      }
      showAlert('Error', errorMessage);
    }
    setIsLoading(false);
  };

  return (
    <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={logoImage} style={styles.logo} />
          </View>
          <Text style={styles.welcomeText}>Bienvenido</Text>
          <View style={styles.inputContainer}>
            <Icon name="envelope" size={20} color="gray" style={styles.icon} />
            <TextInput
              placeholder="Usuario"
              placeholderTextColor="#888"
              onChangeText={(text) => setEmail(text)}
              value={email}
              style={styles.input}
              keyboardType="email-address"
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="gray" style={styles.icon} />
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#888"
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
              value={password}
              style={styles.input}
            />
          </View>
          <TouchableOpacity onPress={handleLogin} style={styles.button}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
          {isLoading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2F9FFA" />
            </View>
          )}
        </View>
      </View>
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Cambia el color de fondo del overlay a negro con transparencia
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fondo blanco con algo de transparencia
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  logoContainer: {
    marginBottom: 0,
    alignItems: 'center',
  },
  logo: {
    width: 300,
    height: 200,
    resizeMode: 'contain',
  },
  welcomeText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'black', // Cambia el color del texto de bienvenida a blanco
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    borderRadius: 30, // Bordes más redondeados
    paddingHorizontal: 15,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 40,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#2F9FFA',
    padding: 15,
    borderRadius: 30,
    width: '100%',
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Login;
