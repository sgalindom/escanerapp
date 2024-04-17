import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const fondoEscanerImage = require('./imagenes/Login.jpg');
const logoImage = require('./imagenes/logorectangular.png');

const Recambio = () => {
  const navigation = useNavigation();
  const [selectedSala, setSelectedSala] = useState('');
  const [selectedInOut, setSelectedInOut] = useState('');
  const [motivo, setMotivo] = useState('');
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    const fetchCounter = async () => {
      try {
        const counterRef = firestore().collection('Counters').doc(selectedSala + selectedInOut);
        const doc = await counterRef.get();
        if (doc.exists) {
          setCounter(doc.data().count);
        } else {
          await counterRef.set({ count: 0 });
          setCounter(0);
        }
      } catch (error) {
        console.error('Error fetching counter:', error);
      }
    };

    if (selectedSala && selectedInOut) {
      fetchCounter();
    }
  }, [selectedSala, selectedInOut]);

  const handleRegister = async () => {
    if (!selectedSala || !selectedInOut || !motivo) {
      alert('Por favor complete todos los campos.');
      return;
    }

    try {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
      const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
      
      const newId = counter + 1; // Increment the counter to get the new ID
      const salaRef = firestore().collection('Recambio').doc(selectedSala).collection(selectedInOut);
      await salaRef.doc(`ID${newId}`).set({
        fecha: formattedDate,
        hora: formattedTime,
        motivo: motivo,
      });

      const counterRef = firestore().collection('Counters').doc(selectedSala + selectedInOut);
      await counterRef.update({ count: newId });

      Alert.alert(
        'Registro exitoso',
        'El recambio de sala se ha registrado correctamente.',
        [
          {
            text: 'Aceptar',
            onPress: () => navigation.goBack(),
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error al registrar el recambio de sala:', error);
      alert('Hubo un error al registrar el recambio de sala. Por favor, inténtelo de nuevo.');
    }
  };

  return (
    <ImageBackground source={fondoEscanerImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={logoImage} style={styles.logo} />

        <View style={styles.formContainer}>
          <Text style={styles.label}>Seleccione Sala:</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, selectedSala === 'Salacx1' && styles.selectedButton]}
              onPress={() => setSelectedSala('Salacx1')}
            >
              <Text style={styles.buttonText}>Sala de CX 1</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, selectedSala === 'Salacx2' && styles.selectedButton]}
              onPress={() => setSelectedSala('Salacx2')}
            >
              <Text style={styles.buttonText}>Sala de CX 2</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Seleccione Entrada/Salida:</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.button, selectedInOut === 'entrada' && styles.selectedButton]}
              onPress={() => setSelectedInOut('entrada')}
            >
              <Text style={styles.buttonText}>Entrada</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, selectedInOut === 'salida' && styles.selectedButton]}
              onPress={() => setSelectedInOut('salida')}
            >
              <Text style={styles.buttonText}>Salida</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Motivo:</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Ingrese el motivo"
            value={motivo}
            onChangeText={setMotivo}
          />

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>Registrar</Text>
          </TouchableOpacity>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2F9FFA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#0F69FF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    minHeight: 100,
  },
  registerButton: {
    backgroundColor: '#2F9FFA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  registerButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Recambio;
    