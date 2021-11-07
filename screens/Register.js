import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {Picker} from '@react-native-picker/picker';

import { useTheme } from 'react-native-paper';
// import { Input } from 'react-native-elements';
import { COLORS, SIZES, FONTS, icons, images } from "../constants";

import Wizard from './components/Register/Wizard'

const Register = ({navigation}) => {

   const [data, setData] = React.useState({
        steps: 1,
        type: '',
        company: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });
    const [user,setUser] = React.useState({
            name: '',
            email: '',
            username: '',
            password: '',
        });

    return (
        <View style={styles.container}>
            <Wizard initialValues={{
                username: '',
                email:'',
                password:'',
                type:''
                }}>
                <Wizard.Step >
                    {({onChangeValue,values})=>
                        (
                            <View style={{flex:1,alignItems:'stretch',justifyContent:'center',}}>
                                <Text style={{
                                        ...FONTS.body3,
                                        // marginVertical:SIZES.padding,
                                        marginHorizontal:SIZES.padding,
                                        textAlign: 'center',
                                        alignSelf: 'stretch',
                                    }}
                                >
                                    Full Name
                                </Text> 
                                <TextInput
                                    placeholder= 'Name'
                                    style={styles.inputContainer}
                                    onChangeText={text=> onChangeValue('name',text)}  
                                    value={values.name}
                                />
                                <Text style={{
                                        ...FONTS.body3,
                                        // marginVertical:SIZES.padding,
                                        marginHorizontal:SIZES.padding,
                                        textAlign: 'center',
                                        alignSelf: 'stretch',
                                    }}
                                >
                                    Email
                                </Text> 
                                <TextInput
                                    placeholder= 'Email'
                                    style={styles.inputContainer}
                                    onChangeText={text=> onChangeValue('email',text)}  
                                    value={values.email}
                                />
                                <Text style={{
                                        ...FONTS.body3,
                                        // marginVertical:SIZES.padding,
                                        marginHorizontal:SIZES.padding,
                                        textAlign: 'center',
                                        alignSelf: 'stretch',
                                    }}
                                >
                                    Password
                                </Text> 
                                <TextInput
                                    placeholder= 'Password'
                                    style={styles.inputContainer}
                                    onChangeText={text=> onChangeValue('password',text)}  
                                    value={values.password}
                                />
                                <Text style={{
                                        ...FONTS.body3,
                                        // marginVertical:SIZES.padding,
                                        marginHorizontal:SIZES.padding,
                                        textAlign: 'center',
                                        alignSelf: 'stretch',
                                    }}
                                >
                                    Register As
                                </Text> 
                                <Picker
                                    selectedValue={values.type}
                                    itemStyle={{
                                        ...FONTS.body3,
                                        marginVertical:SIZES.padding,
                                        marginHorizontal:SIZES.padding,
                                        textAlign: 'center',
                                        alignSelf: 'stretch',
                                        backgroundColor: 'lightgrey',
                                        borderColor:COLORS.lightGray
                                    }}
                                    onValueChange={(itemValue, itemIndex) => onChangeValue('type',itemValue)}
                                > 
                                    <Picker.Item label="PLEASE CHOOSE ONE" color="blue" value="" style={styles.inputContainer}/>
                                    <Picker.Item label="Owner" color="blue" value="owner" style={styles.inputContainer}/>
                                    <Picker.Item label="Employee" color="blue" value="employee" style={styles.inputContainer} />
                                </Picker>
                            </View>
                        )
                    }
                </Wizard.Step>
                <Wizard.Step>
                   
                    {({onChangeValue,values})=>
                        (
                            <View style={{flex:1,alignItems:'stretch',justifyContent:'center',}}>
                                <View style={styles.buttonRow}>
                                    <TouchableOpacity onPress={()=>{onChangeValue('type','employee')}}
                                        style={styles.buttons}>
                                            <Text style={{...FONTS.h3,fontWeight: 'bold' ,textAlign:'center', color: COLORS.white}}>
                                                Employee
                                            </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={()=>{onChangeValue('type','owner')}}
                                        style={styles.buttons}>
                                            <Text style={{...FONTS.h3,fontWeight: 'bold' ,textAlign:'center', color: COLORS.white}}>
                                                Owner
                                            </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )
                    }
                </Wizard.Step>
                <Wizard.Step>
                    {()=>(
                        <Text>HELLO WORLD</Text>
                    )}
                </Wizard.Step>
            </Wizard>
        </View>
    );
    
    
};

export default Register;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    //   justifyContent: 'space-evenly',
      backgroundColor:COLORS.white
    },
    textInput: {
        alignItems:'center',
        justifyContent: 'center'
        // justifyContent: 'center'
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
        ...FONTS.body3,
        marginVertical:SIZES.padding,
        marginHorizontal:SIZES.padding,
        textAlign: 'center',
        alignSelf: 'stretch',
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