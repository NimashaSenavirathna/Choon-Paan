import React from 'react';
import { NavigationContainer } from '@react-navigation/native';  // v5+
import { createStackNavigator } from '@react-navigation/stack';  // v5+
import Login from './components/Login';
import Register from './components/Register';
import Loading from './components/Loading';
import ForgotPassword from './components/ForgotPassword';
import Welcome from './components/Welcome';

import DriverHome from './components/DriverHome';
import AdminHome from './components/AdminHome';
import UserHome from './components/UserHome';

import { initializeApp } from "firebase/app";
import { LogBox } from 'react-native';

// Ignore warnings
LogBox.ignoreLogs(['Warning: ...']);
LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['Warning: ...'], (isAffected, bundle) => {
  return isAffected || bundle.includes('example.js');
});

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBJOqCp0CnuS6b9u98gkKnyUbLXLTzSgP4",
  authDomain: "choon-paan-a632c.firebaseapp.com",
  projectId: "choon-paan-a632c",
  storageBucket: "choon-paan-a632c.appspot.com",
  messagingSenderId: "837744118873",
  appId: "1:837744118873:web:8c20b5fb51d70541d2f548",
  measurementId: "G-KKT0B0GW7J"
};

// Initialize Firebase
initializeApp(firebaseConfig);

// Create stack navigator
const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Loading">
        {/* Auth Screens */}
        <Stack.Screen name="Loading" component={Loading} />
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword} />

        {/* Role-Based Screens */}
        <Stack.Screen name="DriverHome" component={DriverHome} />
        <Stack.Screen name="AdminHome" component={AdminHome} />
        <Stack.Screen name="UserHome" component={UserHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
