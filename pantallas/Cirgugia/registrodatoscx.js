import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useBarcode } from '../BarcodeContext';
import firestore from '@react-native-firebase/firestore';

const fondoEscanerImage = require('../imagenes/Login.jpg');
const logoImage = require('../imagenes/logorectangular.png');

const RegistroDatosCX = ({ route }) => {
    const { barcode } = useBarcode();
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedProcedure, setSelectedProcedure] = useState(null);
    const [areas, setAreas] = useState([]);
    const [procedureTimes, setProcedureTimes] = useState({
        'Entrada Transfer': null,
        'Entrada CX': null,
        'Salida CX': null,
    });
    const [finalizationEnabled, setFinalizationEnabled] = useState(false);
    const [scanDate, setScanDate] = useState('');
    const [scanTime, setScanTime] = useState('');
    const [patientId, setPatientId] = useState(null); 
    const navigation = useNavigation();

    useEffect(() => {
        updateAreas(selectedProcedure);
    }, [selectedProcedure]);

    useEffect(() => {
        if (route.params && route.params.scanDateTime) {
            const [date, time] = route.params.scanDateTime.split(' ');
            setScanDate(date);
            setScanTime(time);
        }

        generatePatientId(barcode); 
    }, [route.params]);

    const updateAreas = (procedure) => {
        if (procedure === 'Entrada Transfer') {
            setAreas(['Silla 1', 'Silla 2']);
        } else if (procedure === 'Entrada CX' || procedure === 'Salida CX') {
            setAreas(['Sala de CX 1', 'Sala de CX 2']);
        } else if (procedure === 'Finalización') {
            setAreas(['Hospitalización', 'Salida']);
        } else {
            setAreas([]);
        }
    };

    const generatePatientId = async (barcodeValue) => {
        try {
            const folioRef = firestore().collection('Foliosescaneados').doc(barcodeValue);
            const lastPatientSnapshot = await folioRef.collection('Procedimientosregistrados').orderBy('createdAt', 'desc').limit(1).get();
            let lastPatientNumber = 0;
            
            if (!lastPatientSnapshot.empty) {
                const lastPatientData = lastPatientSnapshot.docs[0].data();
                lastPatientNumber = parseInt(lastPatientData.patientId) || 0; 
            }
            
            const nextPatientNumber = lastPatientNumber + 1;
            setPatientId(nextPatientNumber); 
        } catch (error) {
            console.error('Error al generar el ID del paciente:', error);
        }
    };

    const handleRegister = async () => {
        try {
            if (!selectedArea || !selectedProcedure) {
                Alert.alert(
                    'Campos obligatorios',
                    'Debes seleccionar tanto el área como el procedimiento antes de registrar.',
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                    { cancelable: false }
                );
                return;
            }

            const currentDateTime = new Date();
            const currentHour = currentDateTime.getHours();
            const currentMinutes = currentDateTime.getMinutes();
            const currentSeconds = currentDateTime.getSeconds();
            const formattedDate = `${currentDateTime.getFullYear()}-${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}-${currentDateTime.getDate().toString().padStart(2, '0')}`;
            const formattedTime = `${currentHour.toString().padStart(2, '0')}:${currentMinutes.toString().padStart(2, '0')}`;

            setScanDate(formattedDate);
            setScanTime(formattedTime);

            const folioRef = firestore().collection('Foliosescaneados').doc(barcode);
            const documentSnapshot = await folioRef.collection('Procedimientosregistrados').doc(selectedProcedure).get();

            if (documentSnapshot.exists) {
                Alert.alert(
                    'Procedimiento ya registrado',
                    'Este procedimiento ya ha sido registrado previamente para este folio escaneado.',
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                    { cancelable: false }
                );
            } else {
                await folioRef.collection('Procedimientosregistrados').doc(selectedProcedure).set({
                    selectedArea: selectedArea,
                    scanDate: formattedDate,
                    scanTime: formattedTime,
                    patientId: patientId !== null ? patientId.toString() : '', 
                });

                if (selectedProcedure === 'Entrada CX' || selectedProcedure === 'Salida CX') {
                    navigation.navigate('recambio', { selectedProcedure, selectedArea }); 
                } else {
                    handleNavigateToDescription(); 
                }

                setProcedureTimes(prevState => ({
                    ...prevState,
                    [selectedProcedure]: formattedTime,
                }));

                if (selectedProcedure === 'Salida CX') {
                    const allTimesRegistered = Object.values(procedureTimes).every(time => time !== null);
                    setFinalizationEnabled(allTimesRegistered);
                }
            }
        } catch (error) {
            console.error('Error al registrar información:', error);
        }
    };

    const handleNavigateToDescription = async () => {
        try {
            const snapshot = await firestore().collection('Foliosescaneados').doc(barcode).collection('Procedimientosregistrados').get();
            const dataList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            navigation.navigate('descripcionetapas', { data: dataList });
        } catch (error) {
            console.error('Error al obtener la información:', error);
        }
    };

    const renderOptions = (options, setSelectedOption, selectedOption) => {
        return options.map((option, index) => (
            <TouchableOpacity
                key={index}
                style={[
                    styles.option,
                    selectedOption === option && styles.selectedOption,
                ]}
                onPress={() => setSelectedOption(option)}
            >
                <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
        ));
    };

    return (
        <ImageBackground source={fondoEscanerImage} style={styles.backgroundImage}>
            <View style={styles.container}>
                <Image source={logoImage} style={styles.logo} />
                <View style={styles.headingContainer}>
                    <Text style={styles.heading}>Registro de Tiempos de Ingreso</Text>
                </View>
                <Text style={styles.barcode}>Folio Escaneado: {barcode}</Text>
                <Text style={styles.scanDateTime}>Fecha del Escaneo: {scanDate}</Text>
                <Text style={styles.scanDateTime}>Hora del Escaneo: {scanTime}</Text>

                <View style={styles.dropdown}>
                    <Text style={styles.dropdownTitle}>Selecciona un Procedimiento</Text>
                    <ScrollView style={styles.dropdownOptions}>
                        {renderOptions(['Entrada Transfer', 'Entrada CX', 'Salida CX', 'Finalización'], setSelectedProcedure, selectedProcedure)}
                    </ScrollView>
                </View>

                {selectedProcedure && (
                    <View style={styles.dropdown}>
                        <Text style={styles.dropdownTitle}>Selecciona un Área</Text>
                        <ScrollView style={styles.dropdownOptions}>
                            {renderOptions(areas, setSelectedArea, selectedArea)}
                        </ScrollView>
                    </View>
                )}

                <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={!selectedProcedure || !selectedArea}>
                    <Text style={styles.registerButtonText}>Registrar</Text>
                </TouchableOpacity>

                {finalizationEnabled && (
                    <TouchableOpacity style={styles.finalizationButton} onPress={() => console.log('Finalización registrada')}>
                        <Text style={styles.finalizationButtonText}>Finalización</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.descriptionButton} onPress={handleNavigateToDescription}>
                    <Text style={styles.descriptionButtonText}>Ver Descripción de Etapas</Text>
                </TouchableOpacity>
            </View>
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
    barcode: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    scanDateTime: {
        fontSize: 16,
        color: 'white',
        marginBottom: 10,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    dropdown: {
        marginBottom: 20,
        width: '80%',
    },
    dropdownTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 5,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    dropdownOptions: {
        maxHeight: 150,
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 5,
    },
    option: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    selectedOption: {
        backgroundColor: '#2F9FFA',
    },
    optionText: {
        fontSize: 16,
        color: 'black',
    },
    registerButton: {
        backgroundColor: '#2F9FFA',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        elevation: 5,
        marginBottom: 10,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    finalizationButton: {
        backgroundColor: '#2F9FFA',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        elevation: 5,
        marginBottom: 10,
    },
    finalizationButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    descriptionButton: {
        backgroundColor: '#2F9FFA',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        elevation: 5,
    },
    descriptionButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
});

export default RegistroDatosCX;
