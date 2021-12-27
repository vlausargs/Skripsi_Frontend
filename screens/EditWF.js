import React, { Component } from "react";
import { 
    View,
    Text,
    TouchableOpacity,
    StyleSheet
} from "react-native";

import * as authAction from '../actions/authActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import { SafeAreaView } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Picker } from "@react-native-picker/picker";

export const mapStateToProps = state => ({
    token: state.authReducer.token,
    users: state.authReducer.users,
    listEmployee: state.authReducer.listEmployee,
  });
  
  export const mapDispatchToProps = dispatch => ({
    actionsAuth: bindActionCreators(authAction, dispatch),
  });

  const workFrom =  [
    {
        key:"0",
        label: "Work From",
        value: ""
    },
    {
        key:"1",
        label: "Office",
        value: "Office"
    },
    {
        key:"2",
        label: "Home",
        value: "Home"
    }

]

class EditWF extends Component{
    constructor(props) {
        super(props)

        this.state = {
            employee: "584bd780-bf7f-41de-9759-bd80db230dc0",
            workFrom: ""
        }

        this.onSubmit = this.onSubmit.bind(this);
      }

    componentDidMount(){
        this.props.actionsAuth.getListEmployee(this.props.token);
    }

    onSubmit(){
        this.props.actionsAuth.editWorkFrom(
            this.props.token,
            this.state.employee,
            this.state.workFrom,
            message => alert(message),
          );;
          console.log(this.state.employee, this.state.workFrom, 'cek submiti')
    }

    renderHeader() {
        return (
            <View style={{flexDirection:'row',height:50}}>
                <TouchableOpacity 
                style={{
                    
                    paddingLeft:SIZES.padding*2,
                    justifyContent:'center'
                }}>
                    <Text style={{...FONTS.h2,fontWeight: 'bold'}}>
                        Edit Work From
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    render(){
        return (
            <SafeAreaView style={{flex: 1}}>
                {this.renderHeader()}
                <ScrollView>
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
                </ScrollView>    
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.lightGray4
    },
    panel:{
      height: 120,
      marginHorizontal: 20,
      marginVertical:10,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: COLORS.white,
      elevation: 5,
      shadowOpacity: 0.2,
      shadowOffset: {
          height: 1,
          width: 1
      },
      borderRadius: 10
  },
  panelText: {
      flex: 1,
      marginVertical: 5,
      marginLeft: 5
  },
  panelRow: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  button: {
    alignItems: 'center',
    marginTop: 50
},
textSign: {
    fontSize: 18,
    fontWeight: 'bold',
    color:COLORS.white
},
Login: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    width:150,
    height: 30
},

  });

export default connect(mapStateToProps, mapDispatchToProps)(EditWF);

