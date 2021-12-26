import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Keyboard,
  Alert,
} from 'react-native';

import * as authAction from '../actions/authActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {Input} from 'react-native-elements';
import {COLORS, FONTS, SIZES} from '../constants';
import {NavigationContainer} from '@react-navigation/native';
import BiometricPopup from './components/Auth//Biometric/BiometricPopup';
import DatePicker from 'react-native-datepicker';
import {Picker} from '@react-native-picker/picker';

export const mapStateToProps = state => ({
  token: state.authReducer.token,
  users: state.authReducer.users,
  meetingType: state.authReducer.meetingType,
});

export const mapDispatchToProps = dispatch => ({
  actionsAuth: bindActionCreators(authAction, dispatch),
});

class MeetingForm extends React.Component {
  constructor() {
    super();
    this.state = {
      id: '',
      title: '',
      date_time: '',
      meeting_type: '',
      place: '',
      description: '',
      link: '',
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.actionsAuth.getUserInfo(this.props.token);
    this.props.actionsAuth.getMeetingType(this.props.token);
    console.log(this.props.users.id);
    this.setState({
      id: this.props.users.id,
    });
  }
  onSubmit() {
    this.props.actionsAuth.sumbitMeeting(
      this.props.token,
      this.state.id,
      this.state.title,
      this.state.date_time,
      this.state.meeting_type,
      this.state.place,
      this.state.description,
      this.state.link,
      message => alert(message),
    );
  }

  render() {
    let minDate = new Date();
    minDate.setDate(minDate.getDate());
    return (
      <KeyboardAvoidingView style={styles.container}>
        <View style={{left: 20, bottom: 25}}>
          <Text style={{...FONTS.h2, fontWeight: 'bold'}}>Meeting Form</Text>
        </View>
        <View style={styles.textInput}>
          <Input
            placeholder="Title"
            inputStyle={{textAlign: 'center'}}
            placeholderTextColor={COLORS.black}
            inputContainerStyle={styles.inputContainer}
            disableFullscreenUI={true}
            autoCapitalize="none"
            onChangeText={val => this.setState({title: val})}
            value={this.state.title}
          />
          <DatePicker
            style={{width: '93%', height: '12%', marginVertical: 10}}
            customStyles={{
              dateInput: {
                backgroundColor: COLORS.lightGray,
                borderWidth: 0,
                alignItems: 'flex-start',
                alignSelf: 'center',
              },
              placeholderText: {
                color: COLORS.black,
              },
              dateText: {
                color: COLORS.black,
              },
            }}
            date={this.state.date_time}
            mode="datetime"
            placeholder="Start Date"
            format="YYYYMMDD"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            showIcon={false}
            minDate={minDate}
            onDateChange={date => {
              this.setState({date_time: date});
            }}
          />

          <Picker
            selectedValue={this.state.meeting_type}
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
            {this.props.meetingType.map((item, key) => (
              <Picker.Item label={item.name} value={item.id} key={item.id} />
            ))}
          </Picker>

          <Input
            placeholder="Place"
            inputStyle={{textAlign: 'center'}}
            placeholderTextColor={COLORS.black}
            inputContainerStyle={styles.inputContainer}
            disableFullscreenUI={true}
            autoCapitalize="none"
            onChangeText={val => this.setState({place: val})}
            value={this.state.place}
          />
          <Input
            placeholder="Link"
            inputStyle={{textAlign: 'center'}}
            placeholderTextColor={COLORS.black}
            inputContainerStyle={styles.inputContainer}
            disableFullscreenUI={true}
            autoCapitalize="none"
            onChangeText={val => this.setState({link: val})}
            value={this.state.link}
          />

          <View style={styles.button}>
            <TouchableOpacity
              style={styles.Login}
              onPress={() => {
                this.onSubmit(
                  this.state.title,
                  this.state.date_time,
                  this.state.meeting_type,
                  this.state.place,
                  this.state.description,
                  this.state.link,
                );
              }}>
              <Text style={styles.textSign}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingForm);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: COLORS.white,
  },
  textInput: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 50,
    marginBottom: 60,
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
    height: 30,
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
