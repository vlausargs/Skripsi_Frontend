import React, { useState, useEffect } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert,
    BackHandler
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import { useTheme } from 'react-native-paper';
import { Input } from 'react-native-elements';
import { COLORS, SIZES, FONTS, icons, images } from "../constants";


const Register = ({navigation}) => {

   const [data, setData] = React.useState({
        steps: 1,
        type: '',
        name: '',
        email: '',
        username: '',
        password: '',
        company: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });
    const handleBackButton= ()=>{
        // console.log(data.steps)
        switch(data.steps) {
            case 1:
                // navigation.goBack(null);
                return false;
                break;
            case 2:
                prev_step();
                return true;
                break;
        }

    }
    useEffect(() => {
        BackHandler.addEventListener('hardwareBackPress', handleBackButton);
        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
          };
    });

    /*const textInputChange = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                username: val,
                check_textInputChange: true,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                username: val,
                check_textInputChange: false,
                isValidUser: false
            });
        }
    }

    const handlePasswordChange = (val) => {
        if( val.trim().length >= 8 ) {
            setData({
                ...data,
                password: val,
                isValidPassword: true
            });
        } else {
            setData({
                ...data,
                password: val,
                isValidPassword: false
            });
        }
    }

    const updateSecureTextEntry = () => {
        setData({
            ...data,
            secureTextEntry: !data.secureTextEntry
        });
    }

    const handleValidUser = (val) => {
        if( val.trim().length >= 4 ) {
            setData({
                ...data,
                isValidUser: true
            });
        } else {
            setData({
                ...data,
                isValidUser: false
            });
        }
    }

    const loginHandle = (userName, password) => {

        const foundUser = Users.filter( item => {
            return userName == item.username && password == item.password;
        } );

        if ( data.username.length == 0 || data.password.length == 0 ) {
            Alert.alert('Wrong Input!', 'Username or password field cannot be empty.', [
                {text: 'Okay'}
            ]);
            return;
        }

        if ( foundUser.length == 0 ) {
            Alert.alert('Invalid User!', 'Username or password is incorrect.', [
                {text: 'Okay'}
            ]);
            return;
        }
        signIn(foundUser);
    }*/
    const next_step = ()=>{
        const steps = data.steps
        setData({
            ...data,
            steps:steps+1
        })
        // console.log("masuk1")
    }
    const prev_step = ()=>{
        const steps = data.steps;
        setData({
            ...data,
            steps:steps-1
        })
        // console.log("masuk2")
    }

    const step1button = (val) =>{
        const steps = data.steps;
        setData({
            ...data,
            steps:steps+1,
            type:val
        });
        console.log(val)
    }
    switch (data.steps) {
        case 1:
            return (
                <View style={styles.container}>
                    {/* <Text>step 1 register</Text> */}
                    <View style={styles.buttonRow}>
                        <TouchableOpacity onPress={()=>{step1button('employee')}}
                            style={styles.buttons}>
                                <Text style={{...FONTS.h3,fontWeight: 'bold' ,textAlign:'center', color: COLORS.white}}>
                                    Employee
                                </Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>{step1button('owner')}}
                            style={styles.buttons}>
                                <Text style={{...FONTS.h3,fontWeight: 'bold' ,textAlign:'center', color: COLORS.white}}>
                                    Owner
                                </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
            break;
        case 2:
            switch(data.type){
                case 'employee':
                    return (
    
                        <View style={styles.container}>
                          <View style={styles.textInput}>
                                  <Input 
                                      placeholder= 'Name'
                                      inputStyle={{ textAlign: 'center' }}
                                      placeholderTextColor={COLORS.black}
                                      inputContainerStyle={styles.inputContainer}
                                      disableFullscreenUI={true}
                                      autoCapitalize = 'none'           
                                  />  
                                  <Input 
                                      placeholder= 'Username'
                                      inputStyle={{ textAlign: 'center' }}
                                      placeholderTextColor={COLORS.black}
                                      inputContainerStyle={styles.inputContainer}
                                      disableFullscreenUI={true}
                                      autoCapitalize = 'none'           
                                  />   
                                  <Input 
                                      placeholder= 'Email'
                                      inputStyle={{ textAlign: 'center' }}
                                      placeholderTextColor={COLORS.black}
                                      inputContainerStyle={styles.inputContainer}
                                      disableFullscreenUI={true}
                                      autoCapitalize = 'none'           
                                  />  
                   
                                  <Input 
                                      placeholder="Password"
                                      inputStyle={{ textAlign: 'center' }}
                                      placeholderTextColor={COLORS.black}
                                      inputContainerStyle={styles.inputContainer}
                                      disableFullscreenUI={true}
                                      secureTextEntry={data.secureTextEntry ? true : false}
                                      autoCapitalize="none"
                                  />
                  
                                  <Input 
                                      placeholder= 'Company'
                                      inputStyle={{ textAlign: 'center' }}
                                      placeholderTextColor={COLORS.black}
                                      inputContainerStyle={styles.inputContainer}
                                      disableFullscreenUI={true}
                                      autoCapitalize = 'none'           
                                  />  
                              
                              <View style={styles.button}>
                                  <TouchableOpacity style={styles.Login}>
                                      <Text style={styles.textSign}>Register</Text>
                                  </TouchableOpacity>
                              </View>
                          </View>
                        </View>
                      );
                      break;
                    case 'owner':
                        return (
                            <View style={styles.container}>

                            </View>
                        );
                        break;
                    default:
                        return (
                            <View style={styles.container}>

                            </View>
                        );
                        break;
            }
           
            break;
    
        default:
            break;
    }
    
};

export default Register;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-evenly',
      backgroundColor:COLORS.white,
    },
    textInput: {
        alignItems:'center',
        justifyContent: 'center'
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    Login: {
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width:150
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color:COLORS.white
    },
    inputContainer:{
        alignSelf: 'center',
        backgroundColor: COLORS.lightGray,
    },
    buttonRow:{
        justifyContent:'center',
        flexDirection:'row',
    },
    buttons:{
      backgroundColor: COLORS.primary,
      justifyContent:'center' ,
      borderRadius: 20,
      width: 130,
      height: 40,
      marginHorizontal: SIZES.padding * 2
    }
    
  });