import React, { useState, useEffect } from "react";
import { View, Text, ImageBackground, Image, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';

const fondoEscanerImage = require('./imagenes/Login.jpg'); // Agrega esta línea
const logoImage = require('./imagenes/logorectangular.png'); // Agrega esta línea

const DescripcionEtapas = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const { data } = route.params; // Obtenemos los datos de la ruta
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        setLoading(false); 
    }, []);

    const renderCards = () => {
        if (!data) return null; // Si no hay datos, no renderizar nada
        return data.map(item => (
            <View key={item.id} style={styles.card}>
                <Text style={styles.cardText}>Procedimiento: {item.id}</Text>
                <Text style={styles.cardText}>Área: {item.selectedArea}</Text>
                <Text style={styles.cardText}>Fecha y Hora del Escaneo: {item.scanDateTime}</Text>
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
                        renderCards()
                    )}
                    <TouchableOpacity onPress={handleScanNewTime} style={styles.button}>
                        <Text style={styles.buttonText}>Escanear nuevo tiempo</Text>
                    </TouchableOpacity>
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
        paddingTop: 50,
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
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        marginBottom: 20,
        elevation: 5,
        width: '90%',
    },
    cardText: {
        fontSize: 16,
        color: 'black',
        marginBottom: 5,
    },
    loadingText: {
        fontSize: 18,
        color: 'white',
    },
    button: {
        backgroundColor: '#2F9FFA',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DescripcionEtapas;
