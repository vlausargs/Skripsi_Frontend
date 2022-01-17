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
    companyQuestion: state.authReducer.companyQuestion,
    listEmployee: state.authReducer.listEmployee,
  });
  
  export const mapDispatchToProps = dispatch => ({
    actionsAuth: bindActionCreators(authAction, dispatch),
  });

const score =  [
    {
        key:"0",
        label: "Score",
        value: 0
    },
    {
        key:"1",
        label: "1",
        value: 1
    },
    {
        key:"2",
        label: "2",
        value: 2
    },
    {
        key:"3",
        label: "3",
        value: 3
    },
    {
        key:"4",
        label: "4",
        value: 4
    },
    {
        key:"5",
        label: "5",
        value: 5
    },

]

const month = [
    {
        key:1,
        label: "January",
        value: 1
    },
    {
        key:2,
        label: "February",
        value: 2
    },
    {
        key:3,
        label: "March",
        value: 3
    },
    {
        key:4,
        label: "April",
        value: 4
    },
    {
        key:5,
        label: "May",
        value: 5
    },
    {
        key:6,
        label: "June",
        value: 6
    },
    {
        key:7,
        label: "July",
        value: 7
    },
    {
        key:8,
        label: "August",
        value: 8
    },
    {
        key:9,
        label: "September",
        value: 9
    },
    {
        key:10,
        label: "October",
        value: 10
    },
    {
        key:11,
        label: "November",
        value: 11
    },
    {
        key:12,
        label: "December",
        value: 12
    },
]
  

class Survey extends Component{
    constructor(props) {
        super(props)

        this.state = {
            employee: "584bd780-bf7f-41de-9759-bd80db230dc0",
            date: null,
            rating: [],
            arrRating:[]
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onClickDropdown = this.onClickDropdown.bind(this);
      }

    componentDidMount(){
        this.props.actionsAuth.getCompanyQuestion(this.props.token);
        this.props.actionsAuth.getListEmployee(this.props.token);
        this.props.actionsAuth.getUserInfo(this.props.token);
    }

    onSubmit(){
        const array = this.state.rating;
        let sum = 0;

        for (let i = 0; i < array.length; i++) {
            sum += array[i];
        }
        console.log(sum);
        this.props.actionsAuth.scoreEmployee(
            this.props.token,
            this.state.employee,
            this.state.date,
            sum,
            (message) => {
                
                alert(message)
                if(message == 'success')this.props.navigation.goBack();
            },
          );;
    }

    renderHeader() {
        if(this.props.users.role === 1){
          return (     
            <View style={{flexDirection: 'row', height: 50}}>
              <TouchableOpacity
                style={{
                  paddingLeft: SIZES.padding * 2,
                  justifyContent: 'center',
                }}>
                <Text style={{...FONTS.h2, fontWeight: 'bold'}}>Performance Survey (ADMIN)</Text>
              </TouchableOpacity>
            </View>
          );
        }
        else if(this.props.users.role === 2){
          return (     
            <View style={{flexDirection: 'row', height: 50}}>
              <TouchableOpacity
                style={{
                  paddingLeft: SIZES.padding * 2,
                  justifyContent: 'center',
                }}>
                <Text style={{...FONTS.h2, fontWeight: 'bold'}}>Performance Survey (EMPLOYEE)</Text>
              </TouchableOpacity>
            </View>
          );
        }  
      }
    onClickDropdown(value,indexPicker,indexQuestion){
        let selectValue = this.state.rating;
        selectValue[indexQuestion] = value;
        this.setState({
            rating: selectValue
        });
      }
    renderQuestion(){
        let panels = []
          this.props.companyQuestion.map((item, index) => {
            panels.push(
                <View key={index} style={styles.panel}>
                    <View style={styles.panelRow}>
                        <Text style={styles.panelText}>{item.question}</Text>
                        <Picker
                            selectedValue={this.state.rating[index]}
                            style={styles.panelText}
                            onValueChange={(itemValue, itemIndex) => this.onClickDropdown(itemValue, itemIndex, index)}>
                            {
                                score.map((item, key) => (
                                    <Picker.Item label={item.label} value={item.value} key={item.key} />
                            ))}
                        </Picker> 
                    </View>
                </View>
            );
          })
        return panels;
    }

    render(){
        console.log(this.state.rating, 'cek rating')
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
                        selectedValue={this.state.date}
                        style={{
                            marginVertical: SIZES.padding,
                            marginHorizontal: SIZES.padding,
                            textAlign: 'center',
                            alignSelf: 'stretch',
                            backgroundColor: COLORS.white,
                          }}
                        onValueChange={(itemValue, itemIndex) =>
                            this.setState({date: itemValue})
                        }>
                            <Picker.Item label=" Select Month" value="" />
                        {
                            month.map((item, key) => (
                                <Picker.Item label={item.label} value={item.value} key={item.key} />
                            ))}
                    </Picker> 
                    {this.renderQuestion()}
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

export default connect(mapStateToProps, mapDispatchToProps)(Survey);

