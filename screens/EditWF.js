import React, {Component} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Modal} from 'react-native';

import * as authAction from '../actions/authActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {COLORS, SIZES, FONTS, icons, images} from '../constants';
import {SafeAreaView} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Picker} from '@react-native-picker/picker';
//import DataTable, {COL_TYPES} from 'react-native-datatable-component';
import {DataTable} from 'react-native-paper';

export const mapStateToProps = state => ({
  token: state.authReducer.token,
  users: state.authReducer.users,
  listEmployee: state.authReducer.listEmployee,
});

export const mapDispatchToProps = dispatch => ({
  actionsAuth: bindActionCreators(authAction, dispatch),
});

const workFrom = [
  {
    key: '0',
    label: 'Work From',
    value: '',
  },
  {
    key: '1',
    label: 'Office',
    value: 'Office',
  },
  {
    key: '2',
    label: 'Home',
    value: 'Home',
  },
];

class EditWF extends Component {
  constructor(props) {
    super(props);

    this.state = {
      employee: '',
      workFrom: '',
      modalVisible: false,
      employeeName:'',
      employeeNIK:''
    };

    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.actionsAuth.getListEmployee(this.props.token);
    this.props.actionsAuth.getUserInfo(this.props.token)
  }

  onSubmit() {
    this.setState({modalVisible: false, workFrom:''})
    this.props.actionsAuth.editWorkFrom(
      this.props.token,
      this.state.employee,
      this.state.workFrom,
      message => alert(message),
    );
    console.log(this.state.employee, this.state.workFrom, 'cek submiti');
  }

  renderHeader() {
    return (
      <View style={{flexDirection: 'row', height: 50}}>
        <TouchableOpacity
          style={{
            paddingLeft: SIZES.padding * 2,
            justifyContent: 'center',
          }}>
          <Text style={{...FONTS.h2, fontWeight: 'bold'}}>List Employee</Text>
        </TouchableOpacity>
      </View>
    );
  }

  openModal (item) {
    this.setState({ modalVisible: true, employee: item.id });
  }
  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }
  
  render() {
    const { modalVisible } = this.state;
    return (
      <SafeAreaView style={{flex: 1}}>
        {this.renderHeader()}
        <ScrollView>
          {/*
                    <Picker
                        selectedValue={this.state.employee}
                        style={{
                            marginVertical: SIZES.padding,
                            marginHorizontal: SIZES.padding,
                            textAlign: 'center',
                            alignSelf: 'stretch',
                            backgroundColor: COLORS.white,
                          }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({employee: itemValue})
                        }>
                        <Picker.Item label="Select Employee" value=""  style={styles.panelText} />
                        {this.props.listEmployee.map((item, key) => (
                        <Picker.Item label={item.name} value={item.id} key={item.id} />
                        ))}
                    </Picker>
                    <Picker
                        selectedValue={this.state.workFrom}
                        style={{
                            marginVertical: SIZES.padding,
                            marginHorizontal: SIZES.padding,
                            textAlign: 'center',
                            alignSelf: 'stretch',
                            backgroundColor: COLORS.white,
                          }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({workFrom: itemValue})
                        }>
                        {
                            workFrom.map((item, key) => (
                                <Picker.Item label={item.label} value={item.value} key={item.key} />
                            ))}
                    </Picker> 
                    <View style={styles.button}>
                  <TouchableOpacity onPress={this.onSubmit} style={styles.Login}>
                      <Text style={styles.textSign}>Submit</Text>
                  </TouchableOpacity>
              </View> 
                    */}
                    {/*this.props.users.role === 1 ? (
          <DataTable>
          <DataTable.Header>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title numeric>Work From</DataTable.Title>
            <DataTable.Title numeric>Action</DataTable.Title>
          </DataTable.Header>
          {this.props.listEmployee.map((item, key) => (
            <DataTable.Row>
              <DataTable.Cell>{item.name}</DataTable.Cell>
              <DataTable.Cell>{item.work_from}</DataTable.Cell>
              <TouchableOpacity>
                  <DataTable.Cell>Action</DataTable.Cell>
              </TouchableOpacity>
            </DataTable.Row>
          ))}
        </DataTable>
        ) : (
          <View>
              <Text>Only owner can have access to this menu</Text>
        </View>
        )*/}
          <DataTable>
          <DataTable.Header>
            <DataTable.Title>NIK</DataTable.Title>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title numeric>Work From</DataTable.Title>
            <DataTable.Title numeric>Action</DataTable.Title>
          </DataTable.Header>
          <Modal animationType="slide"
                    transparent={true}
                    visible={modalVisible}>
                  <View style={styles.centeredView}>
                  <View style={styles.modalView}>
                    <Text>Change Work From</Text>
                      <Picker
                        selectedValue={this.state.workFrom}
                        style={{
                            marginVertical: SIZES.padding,
                            marginHorizontal: SIZES.padding,
                            textAlign: 'center',
                            alignSelf: 'stretch',
                            backgroundColor: COLORS.white,
                          }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({workFrom: itemValue})
                        }>
                        {
                            workFrom.map((item, key) => (
                                <Picker.Item label={item.label} value={item.value} key={item.key} />
                            ))}
                    </Picker>
                    <TouchableOpacity onPress={() => this.onSubmit()} style={styles.Login}>
                        <Text style={styles.textSign}>Submit</Text>
                      </TouchableOpacity>
                  </View>
                  </View>
              </Modal>
          {this.props.listEmployee.map((item, key) => (
            <DataTable.Row>
            <DataTable.Cell>{item.nik}</DataTable.Cell>
              <DataTable.Cell>{item.name}</DataTable.Cell>
              <DataTable.Cell>{item.work_from}</DataTable.Cell>
              <TouchableOpacity onPress={() => this.openModal(item)}>
                  <DataTable.Cell>Action</DataTable.Cell>
              </TouchableOpacity>
            </DataTable.Row>
          ))}
          </DataTable>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.lightGray4,
  },
  panel: {
    height: 120,
    marginHorizontal: 20,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    elevation: 5,
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 1,
      width: 1,
    },
    borderRadius: 10,
  },
  panelText: {
    flex: 1,
    marginVertical: 5,
    marginLeft: 5,
  },
  panelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    marginTop: 50,
  },
  textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  Login: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    width: 150,
    height: 30,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditWF);
