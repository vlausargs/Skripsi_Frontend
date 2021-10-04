import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

import { useTheme } from 'react-native-paper';
import { Input } from 'react-native-elements';
import { COLORS } from '../constants';


const Register = ({navigation}) => {

   const [data, setData] = React.useState({
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
    }
    
  });