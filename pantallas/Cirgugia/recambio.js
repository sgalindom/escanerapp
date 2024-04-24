import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ImageBackground, Image, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const fondoEscanerImage = require('../imagenes/Login.jpg');
const logoImage = require('../imagenes/logorectangular.png');

const Recambio = ({ route }) => {
  const navigation = useNavigation();
  const [selectedSala, setSelectedSala] = useState('');
  const [selectedInOut, setSelectedInOut] = useState('');
  const [motivo, setMotivo] = useState('');
  const [lastId, setLastId] = useState(0);

  useEffect(() => {
    const fetchLastId = async () => {
      try {
        const salaRef = firestore().collection('Recambio').doc(selectedSala).collection(selectedInOut);
        const snapshot = await salaRef.orderBy(firestore.FieldPath.documentId()).limitToLast(1).get();
        if (!snapshot.empty) {
          const lastDocument = snapshot.docs[0];
          const lastDocumentId = parseInt(lastDocument.id.substring(2));
          setLastId(lastDocumentId);
        } else {
          setLastId(0);
        }
      } catch (error) {
        console.error('Error fetching last ID:', error);
      }
    };

    if (selectedSala && selectedInOut) {
      fetchLastId();
    }
  }, [selectedSala, selectedInOut]);

  const handleRegister = async () => {
    if (!selectedSala || !selectedInOut || !motivo) {
      Alert.alert('Por favor complete todos los campos.');
      return;
    }

    try {
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${currentDate.getDate().toString().padStart(2, '0')}`;
      const formattedTime = `${currentDate.getHours().toString().padStart(2, '0')}:${currentDate.getMinutes().toString().padStart(2, '0')}`;
      const newId = lastId + 1;

      const salaRef = firestore().collection('Recambio').doc(selectedSala).collection(selectedInOut);
      await salaRef.doc(`ID${newId}`).set({
        fecha: formattedDate,
        hora: formattedTime,
        motivo: motivo,
      });

      // Actualizar contador de la sala
      const counterRef = firestore().collection('Counters').doc(`${selectedSala}${selectedInOut}`);
      const counterSnapshot = await counterRef.get();
      if (counterSnapshot.exists) {
        await counterRef.update({ count: newId });
      } else {
        await counterRef.set({ count: newId });
      }

      // Calcular y almacenar el tiempo libre
      if (selectedInOut === 'salida') {
        await calcularYAlmacenarTiempoLibre(selectedSala, formattedDate, formattedTime, newId);
      }

      Alert.alert(
        'Registro exitoso',
        'El recambio de sala se ha registrado correctamente.',
        [
          {
            text: 'Aceptar',
            onPress: () => navigation.navigate('EscanerCX'), // Navega a EscanerCX.js
          },
        ],
        { cancelable: false }
      );
    } catch (error) {
      console.error('Error al registrar el recambio de sala:', error);
      Alert.alert('Hubo un error al registrar el recambio de sala. Por favor, inténtelo de nuevo.');
    }
  };

  const calcularYAlmacenarTiempoLibre = async (sala, fecha, hora, id) => {
    try {
      // Obtener la última entrada de la sala para el día actual
      const entradaRef = firestore().collection('Recambio').doc(sala).collection('entrada');
      const entradaSnapshot = await entradaRef.where('fecha', '==', fecha).orderBy('hora', 'asc').get();
      const entradas = entradaSnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));

      // Obtener las salidas correspondientes a las entradas
      const salidaRef = firestore().collection('Recambio').doc(sala).collection('salida');
      const salidasSnapshot = await salidaRef.where('fecha', '==', fecha).orderBy('hora', 'asc').get();
      const salidas = salidasSnapshot.docs.map(doc => ({ id: doc.id, data: doc.data() }));

      // Calcular los tiempos libres
      const tiemposLibres = [];
      for (let i = 0; i < entradas.length - 1; i++) {
        const tiempoLibre = Math.round((new Date(`${fecha} ${salidas[i].data.hora}`) - new Date(`${fecha} ${entradas[i + 1].data.hora}`)) / (1000 * 60));
        tiemposLibres.push(tiempoLibre);
      }

      // Actualizar o crear el documento de tiempos libres en Firestore
      const tiemposLibresRef = firestore().collection('TiemposLibres').doc(fecha);
      const tiemposLibresSnapshot = await tiemposLibresRef.get();
      if (tiemposLibresSnapshot.exists) {
        const tiemposLibresData = tiemposLibresSnapshot.data();
        const tiemposLibresActualizados = { ...tiemposLibresData, [sala]: tiemposLibres };
        await tiemposLibresRef.update(tiemposLibresActualizados);
      } else {
        const tiemposLibresInicial = { [sala]: tiemposLibres };
        await tiemposLibresRef.set(tiemposLibresInicial);
      }
    } catch (error) {
      console.error('Error al calcular y almacenar el tiempo libre:', error);
    }
  };

  return (
    <ImageBackground source={fondoEscanerImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={logoImage} style={styles.logo} />

        <View style={styles.formContainer}>
          <Text style={styles.label}>Seleccione la Sala de cirugia:</Text>
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

          <Text style={styles.label}>Descripcion procedimiento:</Text>
          <TextInput
            style={styles.input}
            multiline
            placeholder="Ingrese la descripcion"
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
    backgroundColor: '#FF5722',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
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
