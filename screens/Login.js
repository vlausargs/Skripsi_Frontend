import React, { Component } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    KeyboardAvoidingView,
    Platform,
    StyleSheet ,
    Keyboard,
    Alert
} from 'react-native';

import * as authAction from '../actions/authActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Input } from 'react-native-elements';
import { COLORS, FONTS } from '../constants';
import { NavigationContainer } from '@react-navigation/native';


export const mapStateToProps = state => ({
    token: state.authReducer.token
});
  
//Maps actions from authActions to Login's props
export const mapDispatchToProps = (dispatch) => ({
    actionsAuth: bindActionCreators(authAction, dispatch)
});

class Login extends React.Component {

    constructor() {
      super();
      this.state = {
        email: "",
        password: "",
        loading: false,
        secureText: true
      }
  
      this.onLogin = this.onLogin.bind(this);
      this.onFinish = this.onFinish.bind(this);
    }
     

    /*
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

  

     textInputChange = (val) => {
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

     handlePasswordChange = (val) => {
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
    */

    onLogin (email, password) {
        if ( this.state.email.length === 0 || this.state.password.length === 0 ) {
            Alert.alert('Wrong Input!', 'email or password field cannot be empty.', [
                {text: 'Okay'}
            ]);
            return;
        }
        else {
            this.props.actionsAuth.login(this.state.email, this.state.password, (token) => this.onFinish(token));
            this.setState({ email : '', password : ''});
            Keyboard.dismiss(); 
        }
          
    }

    onFinish(token) {
        console.log(this.props)
        if (token){
            this.props.navigation.navigate("Home");
        }
    }


        
render(){
    return (
        <KeyboardAvoidingView style={styles.container}>
            <View style={{left: 20, bottom: 25}}>
                <Text style={{...FONTS.h2,fontWeight: 'bold'}}>Login</Text>
            </View>
          <View style={styles.textInput}>
                  <Input 
                      placeholder= 'Email'
                      inputStyle={{ textAlign: 'center' }}
                      placeholderTextColor={COLORS.black}
                      inputContainerStyle={styles.inputContainer}
                      disableFullscreenUI={true}
                      autoCapitalize = 'none'
                      onChangeText={(val) => this.setState({ email: val })} 
                      value={this.state.email}     
                  />   
   
                  <Input 
                      placeholder="Password"
                      inputStyle={{ textAlign: 'center' }}
                      placeholderTextColor={COLORS.black}
                      inputContainerStyle={styles.inputContainer}
                      disableFullscreenUI={true}
                      secureTextEntry={this.state.secureText ? true : false}
                      autoCapitalize="none"
                      onChangeText={(val) => this.setState({ password : val })}
                      value={this.state.password}
                  />
              
              <View style={styles.button}>
                  <TouchableOpacity style={styles.Login} onPress={() => {this.onLogin( this.state.email, this.state.password )}}>
                      <Text style={styles.textSign}>Login</Text>
                  </TouchableOpacity>
              </View>
          </View>
        </KeyboardAvoidingView>
      );
}
    
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-evenly',
      backgroundColor:COLORS.white,
    },
    textInput: {
        alignItems:'center',
        justifyContent: 'center',
        marginHorizontal: 50,
        marginBottom: 60
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    Login: {
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        width:150,
        height: 30
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color:COLORS.white
    },
    inputContainer:{
        alignSelf: 'center',
        backgroundColor: COLORS.lightGray,
        borderBottomWidth: 0
    }
    
  });