import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BarcodeProvider } from '../escaner/pantallas/BarcodeContext';
import { DataProvider } from './pantallas/DataContext'; 
import firebase from 'firebase/app';
import 'firebase/firestore';

import Login from './pantallas/login';
import MainPanel from './pantallas/MainPanel';
import EscanerCX from './pantallas/escanercx';
import Registrocx from './pantallas/registrocx';
import RegistroDatosCX from './pantallas/registrodatoscx';

import Descripcion from './pantallas/descripcioetapas';

import Admin from './pantallas/paneladmin';
import Recambio from './pantallas/recambio';
import Vertiempos from './pantallas/vertiempos';


const Stack = createStackNavigator();

function App() {
  return (
    <BarcodeProvider>
      <DataProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="MainPanel" component={MainPanel} />
            <Stack.Screen name="EscanerCX" component={EscanerCX} />
            <Stack.Screen name="Registrocx" component={Registrocx} />
            <Stack.Screen name="registrodatoscx" component={RegistroDatosCX} />
            <Stack.Screen name="descripcionetapas" component={Descripcion} />
            <Stack.Screen name="recambio" component={Recambio} />
            <Stack.Screen name="vertiempos" component={Vertiempos} />
            
            <Stack.Screen name="paneladmin" component={Admin} />

          </Stack.Navigator>
        </NavigationContainer>
      </DataProvider>
    </BarcodeProvider>
  );
}

function LoginScreen({ navigation }) {
  return <Login navigation={navigation} />;
}

export default App;