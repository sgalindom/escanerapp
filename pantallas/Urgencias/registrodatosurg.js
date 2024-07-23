import React, { useState, useEffect } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBarcode } from '../BarcodeContext';
import Icon from 'react-native-vector-icons/FontAwesome5';

const backgroundImage = require('../imagenes/Login.jpg');
const logoImage = require('../imagenes/logoblanco.png');

const RegistroDatosURG = ({ route }) => {
    const { barcode } = useBarcode();
    const [selectedArea, setSelectedArea] = useState(null);
    const [selectedProcedure, setSelectedProcedure] = useState(null);
    const [areas, setAreas] = useState([]);
    const [scanDate, setScanDate] = useState('');
    const [scanTime, setScanTime] = useState('');
    const [registeredProcedures, setRegisteredProcedures] = useState([]);
    const navigation = useNavigation();

    useEffect(() => {
        if (route.params && route.params.scanDateTime) {
            const [date, time] = route.params.scanDateTime.split(' ');
            setScanDate(date);
            setScanTime(time);
        }
    }, [route.params]);

    useEffect(() => {
        updateAreas(selectedProcedure);
    }, [selectedProcedure]);

    const isValidProcedure = (procedure) => {
        if (procedure === 'Salida') {
            return true;
        }

        const procedureOrder = [
            'Ingreso', 'Triage', 'Atencion Medicina General', 'Admin Medicamentos', 
            'Procedimientos', 'Laboratorios', 'Rayos X', 'Revaloración Medicina General', 
            'Atención Medicina especializada', 'Ordenes médicas Especializadas', 'Salida', 
            'Hospitalización', 'Cirugía', 'Remisión', 'Observación'
        ];

        const currentIndex = procedureOrder.indexOf(procedure);
        for (let i = 0; i < currentIndex; i++) {
            if (!registeredProcedures.includes(procedureOrder[i])) {
                return false;
            }
        }
        return true;
    };

    const updateAreas = (procedure) => {
        let newAreas = [];

        switch (procedure) {
            case 'Ingreso':
                newAreas = ['EPS', 'Soat', 'Arl', 'Poliza'];
                break;
            case 'Triage':
                newAreas = ['Triage 2', 'Triage 3', 'Triage 4', 'Triage 5'];
                break;
            case 'Atencion Medicina General':
                newAreas = ['Cosultorio 1', 'Consutorio 2'];
                break;
            case 'Admin Medicamentos':
                newAreas = ['Sala 1', 'Sala 2', 'Camilla 1', 'Camilla 2', 'Camilla 3', 'Camilla 4'];
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
            }

            if (!isValidProcedure(selectedProcedure)) {
                Alert.alert(
                    'Orden incorrecto',
                    'No puedes registrar este procedimiento sin registrar los anteriores.',
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                    { cancelable: false }
                );
                return;
            }
            await registerProcedure();
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

            // Aquí debes hacer la llamada a tu API para registrar el procedimiento
            const response = await fetch('https://yourapi.com/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    barcode,
                    selectedProcedure,
                    selectedArea,
                    scanDate: formattedDate,
                    scanTime: formattedTime,
                }),
            });

            if (!response.ok) {
                throw new Error('Error en el registro del procedimiento');
            }

            const updatedProcedures = [...registeredProcedures, selectedProcedure];
            setRegisteredProcedures(updatedProcedures);
            updateAreas(selectedProcedure);

            if (selectedProcedure === 'Salida') {
                navigation.navigate('recambio');
            } else {
                handleNavigateToDescription();
            }
        } catch (error) {
            console.error('Error al registrar el procedimiento:', error);
        }
    };

    const handleNavigateToDescription = async () => {
        try {
            // Aquí debes hacer la llamada a tu API para obtener la descripción de las etapas
            const response = await fetch(`https://yourapi.com/description?barcode=${barcode}`);
            if (!response.ok) {
                throw new Error('Error al obtener la información');
            }
            const dataList = await response.json();

            navigation.navigate('descripcionetapasurgencias', { data: dataList });
        } catch (error) {
            console.error('Error al obtener la información:', error);
        }
    };

    const renderOptions = (options, setSelectedOption, selectedOption) => {
        return options.map((option, index) => {
            const isOptionVisible = registeredProcedures.includes(option) ? false : true;

            return (
                <View style={{ marginBottom: 10 }} key={index}>
                    <TouchableOpacity
                        style={[
                            styles.option,
                            selectedOption === option && styles.selectedOption,
                            !isOptionVisible && styles.optionHidden,
                        ]}
                        onPress={() => setSelectedOption(option)}
                        disabled={!isOptionVisible}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                        <Icon name="check" size={20} color="white" style={styles.checkIcon} />
                    </TouchableOpacity>
                </View>
            );
        });
    };

    return (
        <ScrollView contentContainerStyle={styles.container} contentInsetAdjustmentBehavior="never">
            <ImageBackground source={backgroundImage} style={styles.backgroundImage}>
                <View style={styles.innerContainer}>
                    <Image source={logoImage} style={styles.logo} />
                    <View style={styles.headingContainer}>
                        <Text style={styles.heading}>Registro de Tiempos de Ingreso</Text>
                    </View>
                    <Text style={styles.barcode}>Folio Escaneado: {barcode}</Text>

                    {/* Selección de Procedimientos */}
                    <View style={styles.sectionContainer}>
                        <Text style={styles.sectionTitle}>Selecciona un Procedimiento</Text>
                        <ScrollView style={styles.optionsContainer} horizontal={true}>
                            {renderOptions(['Ingreso', 'Triage', 'Atencion Medicina General', 'Admin Medicamentos', 'Procedimientos', 'Laboratorios', 'Rayos X', 'Revaloración Medicina General', 'Atención Medicina especializada', 'Ordenes médicas Especializadas', 'Salida', 'Hospitalización', 'Cirugía', 'Remisión', 'Observación'], setSelectedProcedure, selectedProcedure)}
                        </ScrollView>
                    </View>

                    {/* Selección de Áreas */}
                    {selectedProcedure && (
                        <View style={[styles.sectionContainer, styles.areaSectionContainer]}>
                            <Text style={styles.sectionTitle}>Selecciona un Área</Text>
                            <ScrollView style={styles.optionsContainer}>
                                {renderOptions(areas, setSelectedArea, selectedArea)}
                            </ScrollView>
                        </View>
                    )}

                    {/* Botón de Registro */}
                    <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={!selectedProcedure || !selectedArea}>
                        <Text style={styles.registerButtonText}>Registrar</Text>
                    </TouchableOpacity>

                    {/* Botón de Descripción */}
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
        marginBottom: 20,
    },
    sectionContainer: {
        width: '100%',
        marginBottom: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        padding: 10,
    },
    areaSectionContainer: {
        marginTop: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 10,
    },
    optionsContainer: {
        maxHeight: 150,
        borderRadius: 5,
        padding: 5,
    },
    registerButton: {
        backgroundColor: '#004ba0',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
        marginBottom: 20,
    },
    registerButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    descriptionButton: {
        backgroundColor: '#0063b4',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 5,
    },
    descriptionButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    option: {
        backgroundColor: '#007bff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    optionText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
        marginRight: 2,
    },
    selectedOption: {
        backgroundColor: '#0056b3',
    },
    optionHidden: {
        opacity: 0.5,
    },
    checkIcon: {
        marginLeft: 'auto',
    },
});

export default RegistroDatosURG;
