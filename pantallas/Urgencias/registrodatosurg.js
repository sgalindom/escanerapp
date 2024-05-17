import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBarcode } from '../BarcodeContext';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const fondoEscanerImage = require('../imagenes/Login.jpg');
const logoImage = require('../imagenes/logorectangular.png');

const RegistroDatosURG = ({ route }) => {
    const { barcode } = useBarcode();
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedProcedure, setSelectedProcedure] = useState(null);
    const [areas, setAreas] = useState([]);
    const [scanDate, setScanDate] = useState('');
    const [scanTime, setScanTime] = useState('');
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
    }, [route.params]);

    const updateAreas = (procedure) => {
        let newAreas = [];

        switch (procedure) {
            case 'Ingreso':
                newAreas = ['Soat', 'Arl', 'Poliza'];
                break;
            case 'Triage':
                newAreas = ['Silla 1', 'Silla 2'];
                break;
            case 'Atencion Medicina General':
                newAreas = ['Area 1', 'Area 2'];
                break;
            case 'Admin Medicamentos':
                newAreas = ['Sala 1', 'Sala 2', 'Sala 3'];
                break;
            case 'Procedimientos':
                newAreas = ['Quirófano 1', 'Quirófano 2'];
                break;
            case 'Laboratorios':
                newAreas = ['Análisis de Sangre', 'Análisis de Orina', 'Otros'];
                break;
            case 'Rayos X':
                newAreas = ['Miembro Superior', 'Miembro Inferior', 'Columna'];
                break;
            case 'Revaloración Medicina General':
                newAreas = ['Consulta 1', 'Consulta 2'];
                break;
            case 'Atención Medicina especializada':
                newAreas = ['Consulta Especializada 1', 'Consulta Especializada 2'];
                break;
            case 'Ordenes médicas Especializadas':
                newAreas = ['Orden Especializada 1', 'Orden Especializada 2'];
                break;
            case 'Salida':
                newAreas = ['Finalización'];
                break;
            case 'Hospitalización':
                newAreas = ['Habitación 1', 'Habitación 2'];
                break;
            case 'Cirugía':
                newAreas = ['Sala de Operaciones 1', 'Sala de Operaciones 2'];
                break;
            case 'Remisión':
                newAreas = ['Remisión 1', 'Remisión 2'];
                break;
            case 'Observación':
                newAreas = ['Observación 1', 'Observación 2'];
                break;
            default:
                newAreas = [];
        }

        setAreas(newAreas);
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
            } else {
                await registerProcedure();
            }
        } catch (error) {
            console.error('Error al registrar información:', error);
        }
    };





    const registerProcedure = async () => {
        try {
            const currentDateTime = new Date();
            const formattedDate = `${currentDateTime.getFullYear()}-${(currentDateTime.getMonth() + 1).toString().padStart(2, '0')}-${currentDateTime.getDate().toString().padStart(2, '0')}`;
            const formattedTime = `${currentDateTime.getHours().toString().padStart(2, '0')}:${currentDateTime.getMinutes().toString().padStart(2, '0')}`;
    
            setScanDate(formattedDate);
            setScanTime(formattedTime);
    
            const folioRef = firestore().collection('Foliosescaneadosurg').doc(barcode);
            const documentSnapshot = await folioRef.collection('Procedimientosregistrados').doc(selectedProcedure).get();
    
            console.log("Document Snapshot:", documentSnapshot.exists);
    
            if (documentSnapshot.exists) {
                Alert.alert(
                    'Procedimiento ya registrado',
                    'Este procedimiento ya ha sido registrado previamente para este folio escaneado.',
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                    { cancelable: false }
                );
            } else {
                const user = auth().currentUser;
                const userEmail = user ? user.email : 'Correo no disponible';
    
                await folioRef.collection('Procedimientosregistrados').doc(selectedProcedure).set({
                    selectedArea: selectedArea,
                    scanDate: formattedDate,
                    scanTime: formattedTime,
                    userEmail: userEmail,
                });
    
                if (selectedProcedure === 'Salida CX') {
                    navigation.navigate('recambio');
                } else {
                    handleNavigateToDescription();
                }
            }
    
            // Guardar información en la colección de seguimiento
            const seguimientoFolioRef = firestore().collection('Seguimiento').doc(formattedDate).collection('Folios').doc(barcode); // Utilizamos el número de folio como documento
    
            // Obtener los procedimientos existentes del documento del folio
            const existingProcedures = (await seguimientoFolioRef.get()).data() || {};
    
            // Agregar el nuevo procedimiento al objeto de procedimientos existentes
            const procedimientoData = {
                ...existingProcedures,
                [selectedProcedure]: {
                    Area: selectedArea,
                    Hora: formattedTime
                }
            };
    
            await seguimientoFolioRef.set(procedimientoData); // Guardar los procedimientos actualizados en el documento del folio
        } catch (error) {
            console.error('Error al registrar el procedimiento:', error);
        }
    };
    
    
    






    const handleNavigateToDescription = async () => {
        try {
            const user = auth().currentUser;
            const userEmail = user ? user.email : 'Correo no disponible'; // Obtén el correo del usuario
        
            const snapshot = await firestore().collection('Foliosescaneadosurg').doc(barcode).collection('Procedimientosregistrados').get();
            const dataList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            navigation.navigate('descripcionetapas', { data: dataList, userEmail: userEmail }); // Pasa el correo electrónico como parámetro
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
        <ScrollView contentContainerStyle={styles.container} contentInsetAdjustmentBehavior="never">
            <ImageBackground source={fondoEscanerImage} style={styles.backgroundImage}>
                <View style={styles.innerContainer}>
                    <Image source={logoImage} style={styles.logo} />
                    <View style={styles.headingContainer}>
                        <Text style={styles.heading}>Registro de Tiempos de Ingreso</Text>
                    </View>
                    <Text style={styles.barcode}>Folio Escaneado: {barcode}</Text>
                    {/* <Text style={styles.scanDateTime}>Fecha del Escaneo: {scanDate}</Text> */}
                    {/* <Text style={styles.scanDateTime}>Hora del Escaneo: {scanTime}</Text> */}

                    <View style={styles.dropdown}>
                        <Text style={[styles.dropdownTitle, styles.largerText]}>Selecciona un Procedimiento</Text>
                        <ScrollView style={styles.dropdownOptions}>
                            {renderOptions(['Ingreso','Triage', 'Atencion Medicina General', 'Admin Medicamentos', 'Procedimientos', 'Laboratorios', 'Rayos X', 'Revaloración Medicina General', 'Atención Medicina especializada', 'Ordenes médicas Especializadas', 'Salida', 'Hospitalización', 'Cirugía', 'Remisión', 'Observación'], setSelectedProcedure, selectedProcedure)}
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
                    
                    <TouchableOpacity style={styles.descriptionButton} onPress={handleNavigateToDescription}>
                        <Text style={styles.descriptionButtonText}>Ver Descripción de Etapas</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center',
    },
    innerContainer: {
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
    largerText: {
        fontSize: 24, // Tamaño de texto aumentado
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

export default RegistroDatosURG;

