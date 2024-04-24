import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const fondoEscanerImage = require('../imagenes/Login.jpg');
const logoImage = require('../imagenes/logorectangular.png');

const Vertiempos = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [tiempos, setTiempos] = useState({});
  const [isVisible, setIsVisible] = useState(false); // Estado para controlar la visibilidad de la información

  useEffect(() => {
    const fetchTiempos = async () => {
      try {
        if (selectedDate) {
          const tiemposRef = firestore().collection('TiemposLibres').doc(selectedDate);
          const doc = await tiemposRef.get();
          if (doc.exists) {
            setTiempos(doc.data());
          } else {
            setTiempos({});
          }
        }
      } catch (error) {
        console.error('Error fetching tiempos:', error);
      }
    };

    fetchTiempos();
  }, [selectedDate]);

  const handleDatePress = (date) => {
    if (selectedDate === date) {
      setIsVisible(!isVisible); // Alternar la visibilidad de la información
    } else {
      setSelectedDate(date);
      setIsVisible(true); // Mostrar la información al seleccionar una fecha diferente
    }
  };

  return (
    <ImageBackground source={fondoEscanerImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={styles.label}>Seleccione una fecha:</Text>
        <TouchableOpacity style={styles.button} onPress={() => handleDatePress('2024-04-24')}>
          <Text style={styles.buttonText}>24 de abril de 2024</Text>
        </TouchableOpacity>
        {/* Agrega más botones para otras fechas si es necesario */}
        
        {isVisible && Object.entries(tiempos).map(([sala, tiemposSala]) => (
          <View key={sala}>
            <Text style={styles.subtitle}>{sala}</Text>
            {tiemposSala.map((tiempo, index) => (
              <Text key={index} style={styles.tiempoText}>  
                {`${index + 1}: ${tiempo} minutos`}
              </Text>
            ))}
            {/* Calcula el tiempo libre total para la sala */}
            <Text style={styles.totalText}>
              Tiempo libre total: {tiemposSala.reduce((acc, curr) => acc + curr, 0)} minutos
            </Text>
          </View>
        ))}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white', // Cambio de color de texto
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
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    color: 'white', // Cambio de color de texto
  },
  tiempoText: {
    fontSize: 14,
    marginBottom: 5,
    color: 'white', // Cambio de color de texto
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white', // Cambio de color de texto
  },
});

export default Vertiempos;
