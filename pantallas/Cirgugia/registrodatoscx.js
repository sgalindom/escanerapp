import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBarcode } from '../BarcodeContext';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const fondoEscanerImage = require('../imagenes/Login.jpg');
const logoImage = require('../imagenes/logoblanco.png');

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
    const [isLoading, setIsLoading] = useState(false);
    const [registeredProcedures, setRegisteredProcedures] = useState([]);
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
        fetchRegisteredProcedures(barcode); // Fetch registered procedures when component mounts
    }, [route.params]);

    const fetchRegisteredProcedures = async (barcodeValue) => {
        try {
            const folioRef = firestore().collection('Foliosescaneados').doc(barcodeValue);
            const snapshot = await folioRef.collection('Procedimientosregistrados').get();
            const procedures = snapshot.docs.map(doc => doc.id);
            setRegisteredProcedures(procedures);
        } catch (error) {
            console.error('Error fetching registered procedures:', error);
        }
    };

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
            setIsLoading(true);

            if (!selectedArea || !selectedProcedure) {
                Alert.alert(
                    'Campos obligatorios',
                    'Debes seleccionar tanto el área como el procedimiento antes de registrar.',
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                    { cancelable: false }
                );
                setIsLoading(false);
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

            const currentUser = auth().currentUser;
            const userEmail = currentUser.email;

            const folioRef = firestore().collection('Foliosescaneados').doc(barcode);
            const documentSnapshot = await folioRef.collection('Procedimientosregistrados').doc(selectedProcedure).get();

            if (documentSnapshot.exists) {
                Alert.alert(
                    'Procedimiento ya registrado',
                    'Este procedimiento ya ha sido registrado previamente para este folio escaneado.',
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                    { cancelable: false }
                );
                setIsLoading(false);
            } else {
                await folioRef.collection('Procedimientosregistrados').doc(selectedProcedure).set({
                    selectedArea: selectedArea,
                    scanDate: formattedDate,
                    scanTime: formattedTime,
                    patientId: patientId !== null ? patientId.toString() : '', 
                    userEmail: userEmail,
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

                // Update registered procedures list
                setRegisteredProcedures(prevProcedures => [...prevProcedures, selectedProcedure]);
            }
        } catch (error) {
            console.error('Error al registrar información:', error);
            setIsLoading(false);
        }
    };

    const handleNavigateToDescription = async () => {
        try {
            const snapshot = await firestore().collection('Foliosescaneados').doc(barcode).collection('Procedimientosregistrados').get();
            const dataList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            navigation.navigate('descripcionetapas', { data: dataList });
        } catch (error) {
            console.error('Error al obtener la información:', error);
            setIsLoading(false);
        }
    };

    const renderOptions = (options, setSelectedOption, selectedOption) => {
        return options.map((option, index) => {
            const isRegistered = registeredProcedures.includes(option);
            return (
                <TouchableOpacity
                    key={index}
                    style={[
                        styles.option,
                        selectedOption === option && styles.selectedOption,
                        isRegistered && styles.disabledOption,
                    ]}
                    onPress={() => !isRegistered && setSelectedOption(option)}
                    disabled={isRegistered}
                >
                    <Text style={[styles.optionText, isRegistered && styles.disabledOptionText]}>
                        {option} {isRegistered ? '(Registrado)' : ''}
                    </Text>
                </TouchableOpacity>
            );
        });
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
                    {isLoading ? (
                        <ActivityIndicator size="small" color="white" />
                    ) : (
                        <Text style={styles.registerButtonText}>Registrar</Text>
                    )}
                </TouchableOpacity>

                {finalizationEnabled && (
                    <TouchableOpacity style={styles.finalizationButton} onPress={() => console.log('Finalización registrada')}>
                        <Text style={styles.finalizationButtonText}>Finalización</Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.descriptionButton} onPress={handleNavigateToDescription}>
                    <Text style={styles.descriptionButtonText}>Descripción de Etapas</Text>
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
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: 20,
        borderRadius: 10,
        width: '90%',
        alignItems: 'center',
    },
    logo: {
        width: 150,
        height: 50,
        resizeMode: 'contain',
        marginBottom: 20,
    },
    headingContainer: {
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#2c3e50',
    },
    barcode: {
        fontSize: 18,
        color: '#2c3e50',
        marginBottom: 5,
    },
    scanDateTime: {
        fontSize: 16,
        color: '#2c3e50',
        marginBottom: 10,
    },
    dropdown: {
        width: '100%',
        marginBottom: 20,
    },
    dropdownTitle: {
        fontSize: 18,
        color: '#34495e',
        marginBottom: 10,
    },
    dropdownOptions: {
        maxHeight: 150,
        backgroundColor: 'white',
        borderRadius: 5,
        elevation: 3,
    },
    option: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ecf0f1',
    },
    selectedOption: {
        backgroundColor: '#2980b9',
    },
    optionText: {
        fontSize: 16,
        color: '#2c3e50',
    },
    disabledOption: {
        backgroundColor: '#bdc3c7',
    },
    disabledOptionText: {
        color: '#7f8c8d',
    },
    registerButton: {
        backgroundColor: '#27ae60',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    finalizationButton: {
        backgroundColor: '#c0392b',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        marginTop: 20,
    },
    finalizationButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    descriptionButton: {
        backgroundColor: '#2980b9',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 3,
        marginTop: 20,
    },
    descriptionButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default RegistroDatosCX;
