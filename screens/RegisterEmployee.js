import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
  ScrollView,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Input } from 'react-native-elements';
import { COLORS, SIZES, FONTS, icons, images } from '../constants';
import * as authAction from '../actions/authActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

export const mapStateToProps = state => ({
  token: state.authReducer.token,
  users: state.authReducer.users,
  company: state.authReducer.company,
  position: state.authReducer.position,
});

//Maps actions from authActions to Login's props
export const mapDispatchToProps = dispatch => ({
  actionsAuth: bindActionCreators(authAction, dispatch),
});

class RegisterEmployee extends React.Component {
  constructor() {
    super();
    this.state = {
      email:'',
      nik: '',
      name: '',
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.actionsAuth.getPositionList(this.props.token);
    this.props.actionsAuth.getCompanyList(this.props.token)
  }

  onSubmit() {
    this.props.actionsAuth.registerEmployee(
      this.props.token,
      this.state.nik,
      this.state.name,
      this.state.email,
      (message) => {
        Alert.alert(
          "SUCCESS!!!",
          "",
          [
            {
              text: "OK", onPress: () =>{
                this.props.navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Home',
                      params: { messages: 'TOKEN EXPIRED' },
                    },
                  ],
                })
              } 
            }
          ]
        );

        console.log(message)
      });
    console.log(this.state.nik, this.state.name, this.state.position)
  }

  render() {
    return (
      <View style={styles.container}>
        <ScrollView style={{ marginTop: SIZES.padding, marginHorizontal: SIZES.padding }}>

          <Text style={{ ...FONTS.h4, fontWeight: 'bold' }}>Email</Text>
          <Input
            placeholder="Email"
            placeholderTextColor={COLORS.black}
            inputContainerStyle={styles.inputContainer}
            disableFullscreenUI={true}
            autoCapitalize="none"
            onChangeText={val => this.setState({ email: val })}
            value={this.state.email}
          />
          <Text style={{ ...FONTS.h4, fontWeight: 'bold' }}>Name</Text>
          <Input
            placeholder="Name"
            placeholderTextColor={COLORS.black}
            inputContainerStyle={styles.inputContainer}
            disableFullscreenUI={true}
            autoCapitalize="none"
            onChangeText={val => this.setState({ name: val })}
            value={this.state.name}
          />
          <Text style={{ ...FONTS.h4, fontWeight: 'bold' }}>NIK</Text>
          <Input
            placeholder="NIK"
            placeholderTextColor={COLORS.black}
            inputContainerStyle={styles.inputContainer}
            disableFullscreenUI={true}
            autoCapitalize="none"
            onChangeText={val => this.setState({ nik: val })}
            value={this.state.nik}
          />
          {/* <Text style={{ ...FONTS.h4, fontWeight: 'bold' }}>Company</Text>
          <Picker
            selectedValue={this.state.name}
            style={{
              marginVertical: SIZES.padding,
              marginHorizontal: SIZES.padding,
              textAlign: 'center',
              alignSelf: 'stretch',
              backgroundColor: COLORS.lightGray,
            }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ name: itemValue })
            }>
            <Picker.Item label="Select Company" value="" />
            {this.props.company.map((item, key) => (
              <Picker.Item label={item.name} value={item.id} key={item.id} />
            ))}
          </Picker> */}
          {/* <Text style={{ ...FONTS.h4, fontWeight: 'bold' }}>Position</Text>
          <Picker
            selectedValue={this.state.position}
            style={{
              marginVertical: SIZES.padding,
              marginHorizontal: SIZES.padding,
              textAlign: 'center',
              alignSelf: 'stretch',
              backgroundColor: COLORS.lightGray,
            }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ position: itemValue })
            }>
            <Picker.Item label="Select Position" value="" />
            {this.props.position.map((item, key) => (
              <Picker.Item label={item.name} value={item.id} key={item.id} />
            ))}
          </Picker> */}

          <View style={styles.button}>
            <TouchableOpacity style={styles.Login} onPress={this.onSubmit}>
              <Text style={styles.textSign}>Submit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

      </View>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterEmployee);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: COLORS.white,
    justifyContent: 'center',
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  Login: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    width: 150,
    height: 30
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  inputContainer: {
    alignSelf: 'center',
    backgroundColor: COLORS.lightGray,
    borderBottomWidth: 0,
  },
});
