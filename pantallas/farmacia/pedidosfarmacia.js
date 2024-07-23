import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ImageBackground, Image, Alert } from 'react-native';
import CheckBox from '@react-native-community/checkbox'; // Asegúrate de instalar esta librería

const fondoMainImage = require('../imagenes/Login.jpg');
const logoImage = require('../imagenes/logoblanco.png');

function PedidosFarmacia({ route }) {
  const { medicamentos } = route.params;
  const [checkedItems, setCheckedItems] = useState({});

  const handleCheck = (item) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [item]: !prevCheckedItems[item],
    }));
  };

  const handleComplete = () => {
    const receivedMedicamentos = Object.keys(checkedItems).filter(item => checkedItems[item]);
    Alert.alert('Completado', `Medicamentos recibidos: ${receivedMedicamentos.join(', ')}`);
    // Aquí puedes agregar la lógica para procesar los medicamentos recibidos
  };

  return (
    <ImageBackground source={fondoMainImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={styles.title}>Medicamentos Consultados</Text>
        <FlatList
          data={medicamentos}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <CheckBox
                value={checkedItems[item] || false}
                onValueChange={() => handleCheck(item)}
                tintColors={{ true: '#FF6F61', false: '#FFFFFF' }}
              />
              <Text style={styles.item}>{item}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
        />
        <TouchableOpacity style={styles.completeButton} onPress={handleComplete}>
          <Text style={styles.completeButtonText}>Completado</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 100,
    resizeMode: 'contain',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textShadowColor: '#000000',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    width: '100%',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  item: {
    fontSize: 18,
    color: '#000000',
    marginLeft: 10,
  },
  completeButton: {
    backgroundColor: '#FF6F61',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  completeButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PedidosFarmacia;
