import React, { useState } from 'react';
import { View, TouchableOpacity, Text, ImageBackground, Image, StyleSheet, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const fondoEscanerImage = require('./imagenes/Login.jpg');
const logoImage = require('./imagenes/logorectangular.png');

function EscanerCX() {
  const navigation = useNavigation();
  const [folio, setFolio] = useState('');

  const handleScan = () => {
    navigation.navigate('Registrocx');
  };

  const handleProcedureSelection = (procedure) => {
    // Aquí puedes realizar acciones adicionales con la opción seleccionada
    console.log('Procedimiento seleccionado:', procedure);
  };

  return (
    <ImageBackground source={fondoEscanerImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <Image source={logoImage} style={styles.logo} />
        </View>

        <TouchableOpacity onPress={handleScan} style={styles.button}>
          <Text style={styles.buttonText}>Escanear</Text>
        </TouchableOpacity>

        <View style={styles.separator}></View>

        <View style={styles.procedureContainer}>
          <Text style={styles.procedureText}>Entrada transfer:</Text>
          <TouchableOpacity onPress={() => handleProcedureSelection('Entrada Transfer')} style={styles.input}></TouchableOpacity>
        </View>

        <View style={styles.procedureContainer}>
          <Text style={styles.procedureText}>Salida transfer:</Text>
          <TouchableOpacity onPress={() => handleProcedureSelection('Salida Transfer')} style={styles.input}></TouchableOpacity>
        </View>

        <View style={styles.procedureContainer}>
          <Text style={styles.procedureText}>Entrada CX:</Text>
          <TouchableOpacity onPress={() => handleProcedureSelection('Entrada CX')} style={styles.input}></TouchableOpacity>
        </View>

        <View style={styles.procedureContainer}>
          <Text style={styles.procedureText}>Salida CX:</Text>
          <TouchableOpacity onPress={() => handleProcedureSelection('Salida CX')} style={styles.input}></TouchableOpacity>
        </View>

        <View style={styles.procedureContainer}>
          <Text style={styles.procedureText}>Dado de alta:</Text>
          <TouchableOpacity onPress={() => handleProcedureSelection('Dado de Alta')} style={styles.input}></TouchableOpacity>
        </View>

        <View style={styles.folioContainer}>
          <Text style={styles.folioText}>Folio n°:</Text>
          <TextInput
            style={styles.folioInput}
            placeholder="Ingrese el número de folio"
            placeholderTextColor="#FFFFFF"
            onChangeText={(text) => setFolio(text)}
            value={folio}
          />
        </View>

        <View style={styles.bottomContainer}>
          <TouchableOpacity style={styles.sendButton}>
            <Text style={styles.sendButtonText}>Enviar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 50, // Ajuste para colocar el contenido en la parte superior
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 100,
    resizeMode: 'contain',
  },
  button: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 40,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#2F9FFA',
    fontSize: 20,
    fontWeight: 'bold',
  },
  procedureContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  procedureText: {
    marginRight: 10,
    fontSize: 18,
    color: '#FFFFFF',
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: 30,
    borderRadius: 5,
  },
  separator: {
    height: 20, // Espacio entre el botón y la primera línea
  },
  folioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  folioText: {
    marginRight: 10,
    fontSize: 18,
    color: '#FFFFFF',
  },
  folioInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: 30,
    borderRadius: 5,
    paddingHorizontal: 10,
    color: '#FFFFFF',
  },
  bottomContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20, // Espacio entre las líneas anteriores y este contenedor
  },
  sendButton: {
    backgroundColor: '#2F9FFA',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EscanerCX;
