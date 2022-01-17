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
import Icon from 'react-native-vector-icons/dist/FontAwesome';

export const mapStateToProps = state => ({
  token: state.authReducer.token,
  users: state.authReducer.users,
  listEmployeeCompany: state.authReducer.listEmployeeCompany,
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
    this.props.actionsAuth.getEmployeeByCompany(this.props.token);
    this.props.actionsAuth.getUserInfo(this.props.token)
    console.log(this.props.listEmployeeCompany,'employee company')
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
    if(this.props.users.role === 1){
      return (     
        <View style={{ ...styles.shadow,flexDirection: 'row',paddingVertical:SIZES.padding*1.5,backgroundColor:COLORS.white }}>
          <TouchableOpacity
            style={{
              paddingLeft: SIZES.padding * 2,
              justifyContent: 'center',
            }}>
            <Text style={{...FONTS.h2, fontWeight: 'bold'}}>List Employee (ADMIN)</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else if(this.props.users.role === 2){
      return (     
        <View style={{ ...styles.shadow,flexDirection: 'row',paddingVertical:SIZES.padding*1.5,backgroundColor:COLORS.white }}>
          <TouchableOpacity
            style={{
              paddingLeft: SIZES.padding * 2,
              justifyContent: 'center',
            }}>
            <Text style={{...FONTS.h2, fontWeight: 'bold'}}>List Employee (EMPLOYEE)</Text>
          </TouchableOpacity>
        </View>
      );
    }  
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
          {this.props.users.role === 1 ? (
          <DataTable>
          <DataTable.Header>
            <DataTable.Title>NIK</DataTable.Title>
            <DataTable.Title>Name</DataTable.Title>
            <DataTable.Title numeric>Work From</DataTable.Title>
            {/* <DataTable.Title numeric>Action</DataTable.Title> */}
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
                    <View style={{flexDirection:'row', alignContent:'center'}}>
                    <Text style={[styles.panelText, { color: COLORS.primary,  }]} 
                          onPress={() => this.setState({modalVisible: false})}>Cancel</Text>
                    <Text style={[styles.panelText, { color: COLORS.primary }]} 
                          onPress={() => this.onSubmit()}>Submit</Text>
                    </View>
                  </View>
                  </View>
              </Modal>
          {this.props.listEmployeeCompany.map((item, key) => (
            <DataTable.Row key={key}>
            <DataTable.Cell>{item.nik}</DataTable.Cell>
              <DataTable.Cell>{item.user.name}</DataTable.Cell>
              <DataTable.Cell>{item.work_from}</DataTable.Cell>
              {/* <TouchableOpacity onPress={() => {}}>
              <TouchableOpacity onPress={() => this.openModal(item)}> 
                  <DataTable.Cell><Text style={{color:COLORS.primary}}>
                  Action</Text></DataTable.Cell>
              </TouchableOpacity> */}
            </DataTable.Row>
          ))}
          </DataTable>
        ) : (
          <View>
              <Text>Only admin can have access to this menu</Text>
        </View>
        )}
        </ScrollView>
              {this.props.users.role === 1 && (<TouchableOpacity
                style={{
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    height: 50,
                    backgroundColor: '#fff',
                    borderRadius: 100,
                }}
                onPress={() => { this.props.navigation.navigate('RegisterEmployee') }}
            >
                <Icon name='plus' size={30} color='#000000' />
            </TouchableOpacity>)}
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
    marginVertical: 5,
    marginHorizontal: 20,
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditWF);
