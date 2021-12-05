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
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Input } from 'react-native-elements';
import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import * as authAction from '../actions/authActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

export const mapStateToProps = state => ({
    token: state.authReducer.token,
    users: state.authReducer.users
});
  
//Maps actions from authActions to Login's props
export const mapDispatchToProps = (dispatch) => ({
    actionsAuth: bindActionCreators(authAction, dispatch)
});


class RegisterCompany extends React.Component{
    constructor() {
        super();
        this.state = {
          name: "",
          country: "",
          address: "",
          startH:"",
          endH:"",
          secureText: true,

        }
        this.onSubmit = this.onSubmit.bind(this);
    }

      onSubmit(){
        this.props.actionsAuth.registerCompany(this.props.token, this.state.name, this.state.country, this.state.address, 
            this.state.startH, this.state.endH, (message) => alert(message));
      }

    render(){
        return (
            <View style={styles.container}>
              <View style={styles.textInput}>
              <Picker
                        selectedValue={this.state.name}
                        style={{
                            marginVertical:SIZES.padding, 
                            marginHorizontal:SIZES.padding,
                            textAlign: 'center',
                            alignSelf: 'stretch',
                            backgroundColor: COLORS.lightGray,
                            }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({ name: itemValue })
                        }>
                        <Picker.Item label="Company" value="0" />
                        </Picker>   
                      <Input 
                          placeholder= 'Country'
                          inputStyle={{ textAlign: 'center' }}
                          placeholderTextColor={COLORS.black}
                          inputContainerStyle={styles.inputContainer}
                          disableFullscreenUI={true}
                          autoCapitalize = 'none'
                          onChangeText={(val) => this.setState({ country : val })}
                          value={this.state.country}           
                      />  
       
                      <Input 
                          placeholder="Address"
                          inputStyle={{ textAlign: 'center' }}
                          placeholderTextColor={COLORS.black}
                          inputContainerStyle={styles.inputContainer}
                          disableFullscreenUI={true}
                          autoCapitalize="none"
                          onChangeText={(val) => this.setState({ address : val })}
                          value={this.state.address}
                      />
                      <Input 
                          placeholder="Start Working Hour"
                          inputStyle={{ textAlign: 'center' }}
                          placeholderTextColor={COLORS.black}
                          inputContainerStyle={styles.inputContainer}
                          disableFullscreenUI={true}
                          autoCapitalize="none"
                          onChangeText={(val) => this.setState({ startH : val })}
                          value={this.state.startH}
                      /> 
                      <Input 
                          placeholder="End Working Hour"
                          inputStyle={{ textAlign: 'center' }}
                          placeholderTextColor={COLORS.black}
                          inputContainerStyle={styles.inputContainer}
                          disableFullscreenUI={true}
                          autoCapitalize="none"
                          onChangeText={(val) => this.setState({ endH : val })}
                          value={this.state.endH}
                      /> 
                      <DateTimePicker
                        value={new Date()}
                        mode={"time"}
                        display="default"
                        />
                       
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



export default connect(mapStateToProps, mapDispatchToProps)(RegisterCompany);

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