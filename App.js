/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


import React from 'react';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from '@react-navigation/native';

import Tabs from './navigation/tabs'

import {
  Home,
  Chat,
  LeavePermissions,
  Newsfeed,
  Attandance,
  Profile,
} from './screens'


const Stack = createStackNavigator();

const App = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false
                }}
                initialRouteName={'Home'}
            >
                <Stack.Screen name="Home" component={Tabs} />
                <Stack.Screen name="Chat" component={Chat} />
                <Stack.Screen name="LeavePermissions" component={LeavePermissions} />
                <Stack.Screen name="Newsfeed" component={Newsfeed} />
                <Stack.Screen name="Attandance" component={Attandance} />
                <Stack.Screen name="Profile" component={Profile} />

            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default App;
