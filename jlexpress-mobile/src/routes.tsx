import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';


import Login from './pages/login';
import Checklist from './pages/checklist/index';

const Stack = createStackNavigator();

const Routes = () => {
    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <Stack.Navigator
                    headerMode="float"
                    initialRouteName='Login'
                    screenOptions={{
                        headerStyle: {
                            backgroundColor: '#293d4b',
                            height: 80
                        },
                        headerTintColor: '#f28627',
                        headerTitleStyle: {
                            fontWeight: 'bold',
                        },
                        gestureEnabled: false,
                    }}
                >
                    <Stack.Screen name="Login" component={Login} />
                    <Stack.Screen name="Checklist" component={Checklist} />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaProvider>
    );
}

export default Routes;
