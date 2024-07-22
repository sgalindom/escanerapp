import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const fondoEscanerImage = require('../imagenes/Login.jpg');
const logoImage = require('../imagenes/logoblanco.png');

const DescripcionEtapasUrgencias = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { data, userEmail } = route.params;
    const [loading, setLoading] = useState(true);
    const [totalScanTime, setTotalScanTime] = useState(null); 
    const [isLoadingNewTime, setIsLoadingNewTime] = useState(false);
    const [selectedProcedure, setSelectedProcedure] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedScanDate, setSelectedScanDate] = useState(null);
    const [selectedScanTime, setSelectedScanTime] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        if (data) {
            setLoading(false);
            calculateTotalScanTime();
        }
    }, [data]);

    const calculateTimeDifference = (start, end) => {
        if (!start || !end) return null;
    
        const [startHours, startMinutes] = start.split(':').map(Number);
        const [endHours, endMinutes] = end.split(':').map(Number);
    
        const startTimeInMinutes = startHours * 60 + startMinutes;
        const endTimeInMinutes = endHours * 60 + endMinutes;
    
        let differenceInMinutes = endTimeInMinutes - startTimeInMinutes;
    
        return differenceInMinutes;
    };

    const calculateTotalScanTime = async () => {
        if (!data) return;

        const firstStartTime = data.find(item => item.id === 'Ingreso')?.scanTime;
        const lastEndTime = data.find(item => item.id === 'Salida')?.scanTime;

        if (firstStartTime && lastEndTime) {
            const totalDuration = calculateTimeDifference(firstStartTime, lastEndTime);
            setTotalScanTime(`${totalDuration} minutos`);

            // Guardar el tiempo total en Firebase
            const barcode = route.params.barcode; // Obtén el barcode de los parámetros o de donde corresponda
            try {
                await firestore()
                    .collection('Foliosescaneadosurg')
                    .doc(barcode)
                    .collection('tiempototal')
                    .add({
                        totalDuration: totalDuration,
                        timestamp: firestore.FieldValue.serverTimestamp(),
                    });
                console.log('Tiempo total registrado en Firebase');
            } catch (error) {
                console.error('Error al registrar el tiempo total en Firebase:', error);
            }
        }
    };

    const handleScanNewTime = () => {
        setIsLoadingNewTime(true); 
        setTimeout(() => {
            setIsLoadingNewTime(false); 
            navigation.navigate('MainPanel');
        }, 2000); 
    };

    const handleCardPress = (procedure, area, scanDate, scanTime) => {
        setSelectedProcedure(procedure);
        setSelectedArea(area);
        setSelectedScanDate(scanDate);
        setSelectedScanTime(scanTime);
        setModalVisible(true);
    };

    const renderCards = () => {
        if (!data) return null;

        const sortedData = [...data].sort((a, b) => {
            if (a.scanTime < b.scanTime) return -1;
            if (a.scanTime > b.scanTime) return 1;
            return 0;
        });

        return sortedData.map(item => (
            <TouchableOpacity 
                key={item.id} 
                style={styles.card} 
                onPress={() => handleCardPress(item.id, item.selectedArea, item.scanDate, item.scanTime)}
            >
                <Text style={styles.cardText}>{item.id}</Text>
            </TouchableOpacity>
        ));
    };

    return (
        <ImageBackground source={fondoEscanerImage} style={styles.backgroundImage}>
            <ScrollView>
                <View style={styles.container}>
                    <Image source={logoImage} style={styles.logo} />
                    <View style={styles.headingContainer}>
                        <Text style={styles.heading}>Descripción de Etapas</Text>
                    </View>
                    {loading ? (
                        <Text style={styles.loadingText}>Cargando...</Text>
                    ) : (
                        <>
                            {totalScanTime !== null && (
                                <Text style={styles.totalScanTime}>
                                    Tiempo Total de Escaneo: {totalScanTime}
                                </Text>
                            )}
                            {renderCards()}
                            <TouchableOpacity
                                style={styles.scanNewButton}
                                onPress={handleScanNewTime}
                                disabled={isLoadingNewTime} 
                            >
                                {isLoadingNewTime ? ( 
                                    <ActivityIndicator size="small" color="white" />
                                ) : (
                                    <Text style={styles.scanNewButtonText}>Escanear Nuevo Tiempo</Text>
                                )}
                            </TouchableOpacity>
                            <Modal
                                animationType="slide"
                                transparent={true}
                                visible={modalVisible}
                                onRequestClose={() => {
                                    setModalVisible(false);
                                }}
                            >
                                <View style={styles.centeredView}>
                                    <View style={styles.modalView}>
                                        <Text style={styles.modalHeading}>Detalles del Procedimiento</Text>
                                        <Text style={styles.modalText}>Procedimiento: {selectedProcedure}</Text>
                                        <Text style={styles.modalText}>Área: {selectedArea}</Text>
                                        <Text style={styles.modalText}>Fecha del Escaneo: {selectedScanDate}</Text>
                                        <Text style={styles.modalText}>Hora del Escaneo: {selectedScanTime}</Text>
                                        <Text style={styles.modalText}>Correo del Usuario: <Text>{userEmail}</Text></Text>

                                        <TouchableOpacity
                                            style={styles.closeButton}
                                            onPress={() => setModalVisible(false)}
                                        >
                                            <Text style={styles.closeButtonText}>Cerrar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </Modal>
                        </>
                    )}  
                </View>
            </ScrollView>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    logo: {
        width: 200,
        height: 80,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    headingContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    heading: {
        fontSize: 28,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        width: '100%',
    },
    cardText: {
        fontSize: 16,
        color: 'black',
        marginBottom: 5,
    },
    loadingText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    scanNewButton: {
        backgroundColor: '#2F9FFA',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        elevation: 5,
        marginBottom: 10,
    },
    scanNewButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    totalScanTime: { 
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 20,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeading: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 20,
        fontWeight: 'bold',
    },
    modalText: {
        marginBottom: 10,
        fontSize: 16,
    },
    closeButton: {
        backgroundColor: '#2196F3',
        borderRadius: 5,
        padding: 10,
        elevation: 2,
        marginTop: 15,
    },
    closeButtonText: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
export default DescripcionEtapasUrgencias;
