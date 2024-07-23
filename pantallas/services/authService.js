import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'http://192.168.11.247:2001/api/auth/loginMenus';

export const login = async (usuario, clave, modulo) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ usuario, clave, modulo }),
    });

    if (!response.ok) {
      throw new Error('Error en la solicitud de login');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en el login:', error);
    throw error;
  }
};

export const storeTokens = async (tokens) => {
  try {
    await AsyncStorage.setItem('accessToken', tokens.accessToken);
    await AsyncStorage.setItem('refreshToken', tokens.refreshToken);
  } catch (error) {
    console.error('Error al guardar tokens:', error);
  }
};
