import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Modal, ImageBackground, Image } from 'react-native';
import firestore from '@react-native-firebase/firestore';

const fondoEscanerImage = require('../imagenes/Login.jpg');
const logoImage = require('../imagenes/logorectangular.png');

const TiempoUrgenciaScreen = () => {
    const [foliosData, setFoliosData] = useState([]);
    const [selectedFolio, setSelectedFolio] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchFolios = async () => {
            try {
                const formattedDate = '2024-05-17'; // falta modificar la fecha para qeu sea general y no por fecha especifica
                
                const seguimientoRef = firestore().collection('Seguimiento').doc(formattedDate).collection('Folios');

                const unsubscribe = seguimientoRef.onSnapshot(snapshot => {
                    const folios = [];
                    snapshot.forEach(doc => {
                        folios.push({
                            id: doc.id,
                            data: doc.data()
                        });
                    });
                    setFoliosData(folios);
                });

                return () => unsubscribe();
            } catch (error) {
                console.error('Error al obtener los folios:', error);
            }
        };

        fetchFolios();
    }, []);

    const handleFolioPress = (folio) => {
        setSelectedFolio(folio);
        setModalVisible(true);
    };

    return (
        <ImageBackground source={fondoEscanerImage} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Image source={logoImage} style={styles.logo} />
                <Text style={styles.title}>Folios</Text>
                <FlatList
                    data={foliosData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity onPress={() => handleFolioPress(item)}>
                            <View style={styles.folioItem}>
                                <Text style={styles.folioText}>Folio: {item.id}</Text>
                            </View>
                        </TouchableOpacity>
                    )}
                />
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Detalles del Folio</Text>
                            {selectedFolio && Object.entries(selectedFolio.data).map(([key, value]) => (
                                <View key={key} style={styles.fieldContainer}>
                                    <Text style={styles.fieldName}>{key}</Text>
                                    <View style={styles.fieldLine} />
                                    <Text style={styles.fieldValue}>Área: {value.Area}</Text>
                                    <View style={styles.fieldLine} />
                                    <Text style={styles.fieldValue}>Hora: {value.Hora}</Text>
                                </View>
                            ))}
                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.closeButtonText}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
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
        padding: 20,
        alignItems: 'center',
    },
    logo: {
        width: 200,
        height: 80,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    folioItem: {
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        padding: 20,
        borderRadius: 10,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    folioText: {
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    fieldContainer: {
        marginBottom: 15,
    },
    fieldName: {
        fontWeight: 'bold',
    },
    fieldLine: {
        height: 1,
        backgroundColor: '#ccc',
        marginBottom: 5,
    },
    fieldValue: {
        marginBottom: 5,
    },
    closeButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
        marginTop: 20,
        alignSelf: 'center',
    },
    closeButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});

export default TiempoUrgenciaScreen;
