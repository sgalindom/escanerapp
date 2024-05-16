import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const TiemposUrgencias = () => {
  const [loading, setLoading] = useState(true);
  const [procedimientos, setProcedimientos] = useState([]);

  // Puedes ajustar `formattedDate` según tus necesidades
  const formattedDate = '2024-05-16'; // Ejemplo de fecha formateada

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('Seguimiento')
      .doc('Fecha')
      .collection(formattedDate)
      .doc('paciente1')
      .collection('procedimientosRegistrados')
      .onSnapshot(querySnapshot => {
        const procedimientosData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProcedimientos(procedimientosData);
        setLoading(false);
      }, error => {
        console.error('Error fetching document:', error);
        setLoading(false);
      });

    // Desuscribirse del listener al desmontar el componente
    return () => unsubscribe();
  }, [formattedDate]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={procedimientos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemText}>{item.id}</Text>
            <Text style={styles.itemText}>{item[item.id]}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
    color: 'black',
  },
});

export default TiemposUrgencias;
