import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Platform,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

import {Input} from 'react-native-elements';
import {COLORS, SIZES, FONTS, icons, images} from '../constants';
import * as authAction from '../actions/authActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

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
      nik:'',
      name: '',
      position: '',
    };
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.actionsAuth.getPositionList(this.props.token);
  }

  onSubmit() {
    this.props.actionsAuth.registerEmployee(
      this.state.name,
      this.state.position,
      message => alert(message),
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textInput}>
          <Input
            placeholder="NIK"
            inputStyle={{textAlign: 'center'}}
            placeholderTextColor={COLORS.black}
            inputContainerStyle={styles.inputContainer}
            disableFullscreenUI={true}
            autoCapitalize="none"
            onChangeText={val => this.setState({nik: val})}
            value={this.state.nik}
          />
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
              this.setState({name: itemValue})
            }>
            {this.props.company.map((item, key) => (
              <Picker.Item label={item.name} value={item.id} key={item.id} />
            ))}
          </Picker>
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
              this.setState({name: itemValue})
            }>
            {this.props.position.map((item, key) => (
              <Picker.Item label={item.name} value={item.level} key={item.id} />
            ))}
          </Picker>

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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterEmployee);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: COLORS.white,
  },
  textInput: {
    alignItems: 'center',
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
    borderRadius: 10,
    width: 150,
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
