import React, {useState} from 'react';
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
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import BiometricPopup from "./components/Auth//Biometric/BiometricPopup"
import { useTheme } from 'react-native-paper';
// import { Input } from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';

import { Input } from 'react-native-elements';
import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import * as authAction from '../actions/authActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';


export const mapDispatchToProps = (dispatch) => ({
    actionsAuth: bindActionCreators(authAction, dispatch)
});

class Register extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          name: "",
          email: "",
          password: "",
          confirm_password:"",
          role:"1",
          secureText: true,

        }
        this.onSubmit = this.onSubmit.bind(this);

    }

      onSubmit(){
        this.props.actionsAuth.register(this.state.name, this.state.email, this.state.password, 
            this.state.confirm_password, this.state.role, ({message,token}) => {
                if(message!=='success') return alert(message)
                alert(message)
                return this.props.navigation.reset({
                    index: 0,
                    routes: [{ name: 'Login' }]
               })


        });
        console.log(this.state.name, this.state.email, this.state.password, 
            this.state.confirm_password, this.state.role)
      }

    render(){
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
                          onChangeText={(val) => this.setState({ name : val })}
                          value={this.state.name}           
                      />    
                      <Input 
                          placeholder= 'Email'
                          inputStyle={{ textAlign: 'center' }}
                          placeholderTextColor={COLORS.black}
                          inputContainerStyle={styles.inputContainer}
                          disableFullscreenUI={true}
                          autoCapitalize = 'none'
                          onChangeText={(val) => this.setState({ email : val })}
                          value={this.state.email}
                          keyboardType='email-address'              
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
      
                      <Input 
                          placeholder="Confirm Password"
                          inputStyle={{ textAlign: 'center' }}
                          placeholderTextColor={COLORS.black}
                          inputContainerStyle={styles.inputContainer}
                          disableFullscreenUI={true}
                          secureTextEntry={this.state.secureText ? true : false}
                          autoCapitalize="none"
                          onChangeText={(val) => this.setState({ confirm_password : val })}
                          value={this.state.confirm_password}
                      /> 
                      {/* <Picker
                        selectedValue={this.state.role}
                        style={{ 
                            marginHorizontal:SIZES.padding,
                            textAlign: 'center',
                            alignSelf: 'stretch',
                            backgroundColor: COLORS.lightGray,
                            }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ role: itemValue })
                        }>
                        <Picker.Item label="Role" value="0" />
                        <Picker.Item label="Admin" value="1" />
                        <Picker.Item label="Employee" value="2" />
                        </Picker>   */}
                  <View style={styles.button}>
                      <TouchableOpacity style={styles.Login} onPress={this.onSubmit}>
                          <Text style={styles.textSign}>Register</Text>
                      </TouchableOpacity>
                  </View>
              </View>
            </View>
          );  
}
}



export default connect(null, mapDispatchToProps)(Register);

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
        borderBottomWidth: 0
    }
    
  });