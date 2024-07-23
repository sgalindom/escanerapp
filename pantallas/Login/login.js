import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator, ImageBackground, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { login, storeTokens } from '../services/authService';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const background = require('../imagenes/Login.jpg');
const logo = require('../imagenes/logorectangular.png');

const LoginScreen = () => {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const checkLoggedIn = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        if (token) {
          navigation.navigate('MainPanel');
        }
      } catch (error) {
        console.error('Error checking login status', error);
      }
    };
    checkLoggedIn();
  }, [navigation]);

  const handleLogin = async () => {
    if (usuario === '' || clave === '') {
      showAlert('Por favor ingresa tu usuario y contraseña completos.', 'error');
      return;
    }

    setLoading(true);
    try {
      const response = await login(usuario, clave, 'HIS');
      console.log('API Response:', response);
      const { tokens, error } = response;

      if (tokens && tokens.accessToken) {
        await storeTokens(tokens);
        navigation.navigate('MainPanel');
      } else {
        showAlert('Usuario o contraseña incorrectos. Inténtalo de nuevo.', 'error');
      }
    } catch (error) {
      showAlert('Hubo un problema al intentar conectar con el servidor. Inténtalo más tarde.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (message, type) => {
    const iconName = type === 'error' ? 'exclamation-circle' : 'check-circle';
    const iconColor = type === 'error' ? 'red' : 'green';
    
    Alert.alert(
      '',
      message,
      [{ text: 'OK' }],
      {
        cancelable: false,
        onDismiss: () => {},
      }
    );

    // Customize Alert based on type
    Alert.alert(
      '',
      message,
      [
        { text: 'OK' }
      ],
      {
        cancelable: false,
        onDismiss: () => {},
        style: { flexDirection: 'row', alignItems: 'center' },
        icon: (
          <Icon
            name={iconName}
            size={20}
            color={iconColor}
            style={{ marginRight: 10 }}
          />
        )
      }
    );
  };

  return (
    <ImageBackground source={background} style={styles.backgroundImage}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.logoContainer}>
            <Image source={logo} style={styles.logo} />
          </View>
          <Text style={styles.welcomeText}>Bienvenido</Text>
          <View style={styles.inputContainer}>
            <Icon name="user" size={20} color="gray" style={styles.icon} />
            <TextInput
              placeholder="Usuario"
              placeholderTextColor="#888"
              onChangeText={(text) => setUsuario(text)}
              value={usuario}
              style={styles.input}
            />
          </View>
          <View style={styles.inputContainer}>
            <Icon name="lock" size={20} color="gray" style={styles.icon} />
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#888"
              secureTextEntry={!showPassword}
              onChangeText={(text) => setClave(text)}
              value={clave}
              style={styles.input}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIconContainer}>
              <MaterialCommunityIcons
                name={showPassword ? "eye-off" : "eye"}
                size={20}
                color="gray"
              />
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
            <Text style={styles.buttonText}>{loading ? 'Cargando...' : 'Iniciar sesión'}</Text>
          </TouchableOpacity>
          {loading && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2F9FFA" />
            </View>
          )}
        </View>
      </View>
    </ImageBackground>
  );
};

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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
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
    color: 'black',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 15,
    borderRadius: 30,
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
  eyeIconContainer: {
    marginLeft: 10,
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

export default LoginScreen;
