import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ImageBackground, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const fondoEscanerImage = require('./imagenes/Login.jpg');
const logoImage = require('./imagenes/logorectangular.png');

const Admin = () => {
  const [folios, setFolios] = useState([]);

  useEffect(() => {
    const fetchFolios = async () => {
      try {
        const foliosSnapshot = await firestore()
          .collection('Foliosescaneados')
          .get();

        const foliosData = foliosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFolios(foliosData);
      } catch (error) {
        console.error('Error al obtener los folios:', error);
      }
    };

    fetchFolios();
  }, []);

  return (
    <ImageBackground source={fondoEscanerImage} style={styles.backgroundImage}>
      <View style={styles.container}>
        <Image source={logoImage} style={styles.logo} />
        <Text style={[styles.heading, { color: 'black' }]}>Panel de Administración</Text>
        <Text style={[styles.subheading, { color: 'black' }]}>Folios Escaneados:</Text>
        <FlatList
          data={folios}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardText}>{`ID: ${item.id}`}</Text>
              <Text style={styles.cardText}>{`Fecha de Escaneo: ${item.scanDateTime}`}</Text>
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  logo: {
    width: 200,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subheading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    width: '80%',
    alignSelf: 'center',
  },
  cardText: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
  },
});

export default Admin;
