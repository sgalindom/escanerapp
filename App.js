import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { BarcodeProvider } from '../escaner/pantallas/BarcodeContext';
import { DataProvider } from './pantallas/DataContext'; 
import firebase from 'firebase/app';
import 'firebase/firestore';

import Login from './pantallas/Login/login';
import MainPanel from './pantallas/Panel Principal/MainPanel';
import EscanerCX from './pantallas/Cirgugia/escanercx';
import Registrocx from './pantallas/Cirgugia/registrocx';
import RegistroDatosCX from './pantallas/Cirgugia/registrodatoscx';

import Descripcion from './pantallas/Cirgugia/descripcioetapas';

import Admin from './pantallas/Administrador/paneladmin';
import Recambio from './pantallas/Cirgugia/recambio';
import Vertiempos from './pantallas/Administrador/vertiempos';
import Proximamente from './pantallas/proximamente';




import EscanerURG from './pantallas/Urgencias/escanerurg';
import Registrourg from './pantallas/Urgencias/registrourg';

import RegistroDatosURG from './pantallas/Urgencias/registrodatosurg';


import TiemposUrgencias from './pantallas/Administrador/tiemposurgencias';





const Stack = createStackNavigator();

function App() {
  return (
    <BarcodeProvider>
      <DataProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login" screenOptions={{ headerShown: false }}>


            
            <Stack.Screen name="vertiempos" component={Vertiempos} />
            <Stack.Screen name="proximamente" component={Proximamente} />
            <Stack.Screen name="paneladmin" component={Admin} />

           
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="MainPanel" component={MainPanel} />

            

          
            <Stack.Screen name="EscanerCX" component={EscanerCX} />
            <Stack.Screen name="Registrocx" component={Registrocx} />
            <Stack.Screen name="registrodatoscx" component={RegistroDatosCX} />
            <Stack.Screen name="descripcionetapas" component={Descripcion} />
            <Stack.Screen name="recambio" component={Recambio} />


          

            <Stack.Screen name="escanerurg" component={EscanerURG} />
            <Stack.Screen name="registrourg" component={Registrourg} />
            <Stack.Screen name="registrodatosurg" component={RegistroDatosURG} />
            

            <Stack.Screen name="tiemposurgencias" component={TiemposUrgencias} />

            


            

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