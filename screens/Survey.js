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
        value: "0"
    },
    {
        key:"1",
        label: "1",
        value: "1"
    },
    {
        key:"2",
        label: "2",
        value: "2"
    },
    {
        key:"3",
        label: "3",
        value: "3"
    },
    {
        key:"4",
        label: "4",
        value: "4"
    },
    {
        key:"5",
        label: "5",
        value: "5"
    },

]
  

class Survey extends Component{
    constructor(props) {
        super(props)

        this.state = {
            employee: null,
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
    }

    onSubmit(){
        this.props.actionsAuth.scoreEmployee(
            this.props.token,
            this.state.employee,
            this.state.date,
            this.state.rating,
            message => alert(message),
          );;
          console.log('submit')
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
                        Performance Review
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
    onClickDropdown(value, indexPicker, indexQuestion){
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
                        <Picker.Item label="Month" value="0" />
                        <Picker.Item label="January" value="1" />
                        <Picker.Item label="February" value="2" />
                        <Picker.Item label="March" value="3" />
                        <Picker.Item label="April" value="4" />
                        <Picker.Item label="May" value="5" />
                        <Picker.Item label="June" value="6" />
                        <Picker.Item label="July" value="7" />
                        <Picker.Item label="August" value="8" />
                        <Picker.Item label="September" value="9" />
                        <Picker.Item label="October" value="10" />
                        <Picker.Item label="November" value="11" />
                        <Picker.Item label="December" value="12" />
                    </Picker> 
                    {this.renderQuestion()}
                    <View style={styles.button}>
                  <TouchableOpacity onpress={() => this.onSubmit()} style={styles.Login}>
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

