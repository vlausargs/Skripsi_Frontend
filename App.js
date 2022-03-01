/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */


import React, { useEffect } from 'react';
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
import RootStackScreen from './screens/RootStackScreen';

import { connect, Provider } from 'react-redux';
import { bindActionCreators } from 'redux';
import store from './redux/store';
import { Alert, Appearance, Linking, PermissionsAndroid, Platform } from 'react-native';
import IntentLauncher, { IntentConstant  } from 'react-native-intent-launcher';

const Stack = createStackNavigator();

const App = () => {
  // Appearance.set({ colorScheme: 'light' });
   /* const loginReducer = (prevState, action) => {
        switch( action.type ) {
          case 'RETRIEVE_TOKEN': 
            return {
              ...prevState,
              userToken: action.token,
              isLoading: false,
            };
          case 'LOGIN': 
            return {
              ...prevState,
              userName: action.id,
              userToken: action.token,
              isLoading: false,
            };
          case 'LOGOUT': 
            return {
              ...prevState,
              userName: null,
              userToken: null,
              isLoading: false,
            };
          case 'REGISTER': 
            return {
              ...prevState,
              userName: action.id,
              userToken: action.token,
              isLoading: false,
            };
        }
      };
    
      const [loginState, dispatch] = React.useReducer(loginReducer, initialLoginState);
    
      const authContext = React.useMemo(() => ({
        signIn: async(foundUser) => {
          // setUserToken('fgkj');
          // setIsLoading(false);
          const userToken = String(foundUser[0].userToken);
          const userName = foundUser[0].username;
          
          try {
            await AsyncStorage.setItem('userToken', userToken);
          } catch(e) {
            console.log(e);
          }
          // console.log('user token: ', userToken);
          dispatch({ type: 'LOGIN', id: userName, token: userToken });
        },
        signOut: async() => {
          // setUserToken(null);
          // setIsLoading(false);
          try {
            await AsyncStorage.removeItem('userToken');
          } catch(e) {
            console.log(e);
          }
          dispatch({ type: 'LOGOUT' });
        },
        signUp: () => {
          // setUserToken('fgkj');
          // setIsLoading(false);
        },
        toggleTheme: () => {
          setIsDarkTheme( isDarkTheme => !isDarkTheme );
        }
      }), []);
    
      useEffect(() => {
        setTimeout(async() => {
          // setIsLoading(false);
          let userToken;
          userToken = null;
          try {
            userToken = await AsyncStorage.getItem('userToken');
          } catch(e) {
            console.log(e);
          }
          // console.log('user token: ', userToken);
          dispatch({ type: 'RETRIEVE_TOKEN', token: userToken });
        }, 1000);
      }, []); 


      return (
        <NavigationContainer>
            { loginState.userToken !== null ? (
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
            ) :
            
            <RootStackScreen />
}
        </NavigationContainer>
      )
       */
      useEffect(() => {
        requestLocationPermission();

      });
    const  requestLocationPermission = async () => {
      const  status  = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);    
      if (status === PermissionsAndroid.RESULTS.GRANTED) {
        //console.pass
      } else {
        // Alert Message if user does not allow permissions
        Alert.alert("Location Permission", "Location permission need to be enabled from setting", [
          {
            text: 'Open Settings',
            onPress: () => goToSettings(),
            style: 'cancel',
          }
        ]);
      }
    };
    const  goToSettings = () => {

      IntentLauncher.startActivity({
        action: 'android.settings.APPLICATION_DETAILS_SETTINGS',
        data: 'package:com.skripsi_frontend'
      })
        
    };
    return (
      
        <NavigationContainer>
          <Provider store={store}> 
          <RootStackScreen />
          </Provider>
            
        </NavigationContainer>
    )
}

export default App;
