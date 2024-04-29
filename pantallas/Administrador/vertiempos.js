import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const fondoEscanerImage = require('../imagenes/Login.jpg');
const logoImage = require('../imagenes/logorectangular.png');

const Vertiempos = () => {
  const [fechas, setFechas] = useState([]); // Estado para almacenar las fechas disponibles
  const [selectedDate, setSelectedDate] = useState(''); // Estado para la fecha seleccionada
  const [tiempos, setTiempos] = useState({}); // Estado para los tiempos de la fecha seleccionada
  const [isVisible, setIsVisible] = useState(false); // Estado para controlar la visibilidad de la información

  useEffect(() => {
    const fetchFechas = async () => {
      try {
        const fechasRef = firestore().collection('TiemposLibres');
        const snapshot = await fechasRef.get();
        const fechasArray = snapshot.docs.map(doc => doc.id);
        setFechas(fechasArray);
      } catch (error) {
        console.error('Error fetching fechas:', error);
      }
    };

    fetchFechas();
  }, []);

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
        {/* Renderizar botones para cada fecha disponible */}
        {fechas.map(date => (
          <TouchableOpacity key={date} style={styles.button} onPress={() => handleDatePress(date)}>
            <Text style={styles.buttonText}>{date}</Text>
          </TouchableOpacity>
        ))}
        
        {isVisible && Object.entries(tiempos).map(([sala, tiemposSala]) => (
          <View key={sala}>
            <Text style={styles.subtitle}>{sala}</Text>
            {tiemposSala.map((tiempo, index) => (
              <Text key={index} style={styles.tiempoText}>  
                {`${index + 1}: ${tiempo} minutos`}
              </Text>
            ))}
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
    color: 'white',
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
    color: 'white',
  },
  tiempoText: {
    fontSize: 14,
    marginBottom: 5,
    color: 'white',
  },
  totalText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default Vertiempos;
