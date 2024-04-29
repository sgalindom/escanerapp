import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

const fondoEscanerImage = require('../imagenes/Login.jpg');
const logoImage = require('../imagenes/logorectangular.png');

const DescripcionEtapas = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { data } = route.params;
    const [loading, setLoading] = useState(true);
    const [totalScanTime, setTotalScanTime] = useState(null); 

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

    const calculateTotalScanTime = () => {
        if (!data) return;

        const firstStartTime = data.find(item => item.id === 'Entrada Transfer')?.scanTime;
        const lastEndTime = data.find(item => item.id === 'Finalización')?.scanTime;

        if (firstStartTime && lastEndTime) {
            const totalDuration = calculateTimeDifference(firstStartTime, lastEndTime);
            setTotalScanTime(`${totalDuration} minutos`);
        }
    };

    const renderCards = () => {
        if (!data) return null;

        const sortedData = [...data].sort((a, b) => {
            if (a.scanTime < b.scanTime) return -1;
            if (a.scanTime > b.scanTime) return 1;
            return 0;
        });

        return sortedData.map(item => (
            <View key={item.id} style={styles.card}>
                <Text style={styles.cardText}>Procedimiento: {item.id}</Text>
                <Text style={styles.cardText}>Área: {item.selectedArea}</Text>
                <Text style={styles.cardText}>Fecha del Escaneo: {item.scanDate}</Text>
                <Text style={styles.cardText}>Hora del Escaneo: {item.scanTime}</Text>
            </View>
        ));
    };

    const handleScanNewTime = () => {
        navigation.navigate('EscanerCX');
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
                            <TouchableOpacity style={styles.scanNewButton} onPress={handleScanNewTime}>
                                <Text style={styles.scanNewButtonText}>Escanear Nuevo Tiempo</Text>
                            </TouchableOpacity>
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
        paddingHorizontal:
 20,
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
});

export default DescripcionEtapas;
