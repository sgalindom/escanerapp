import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

const fondoEscanerImage = require('./imagenes/Login.jpg');
const logoImage = require('./imagenes/logorectangular.png');

const DescripcionEtapas = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { data } = route.params;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(false);
    }, []);

    const calculateTimeDifference = (start, end) => {
        if (!start || !end) return null;

        const startTime = new Date(`2024-01-01T${start}`);
        const endTime = new Date(`2024-01-01T${end}`);
        const difference = endTime.getTime() - startTime.getTime();

        const minutes = Math.floor(difference / (1000 * 60));

        return `${minutes} minutos`;
    };

    const renderCards = () => {
        if (!data) return null;
        return data.map(item => (
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

    const tiempo1 = data.length > 1 ? calculateTimeDifference(data[0].scanTime, data[1].scanTime) : 'No disponible';
    const tiempo2 = data.length > 2 ? calculateTimeDifference(data[1].scanTime, data[2].scanTime) : 'No disponible';
    const tiempo3 = data.length > 3 ? calculateTimeDifference(data[2].scanTime, data[3].scanTime) : 'No disponible';

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
                            {renderCards()}
                            <View style={styles.timeSummary}>
                                <Text style={styles.summaryText}>Tiempo 1: {tiempo1}</Text>
                                <Text style={styles.summaryText}>Tiempo 2: {tiempo2}</Text>
                                <Text style={styles.summaryText}>Tiempo 3: {tiempo3}</Text>
                            </View>
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
    timeSummary: {
        backgroundColor: 'rgba(255, 255, 255, 0.8)',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        width: '100%',
    },
    summaryText: {
        fontSize: 16,
        color: 'black',
        marginBottom: 5,
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
});

export default DescripcionEtapas;
