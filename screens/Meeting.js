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
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import DataTable, {COL_TYPES} from 'react-native-datatable-component';

import { COLORS } from "../constants";
import { Input } from "react-native-elements";

export const mapStateToProps = state => ({
    token: state.authReducer.token,
    users: state.authReducer.users,
    meeting: state.authReducer.meeting
});
  
export const mapDispatchToProps = (dispatch) => ({
    actionsAuth: bindActionCreators(authAction, dispatch)
});

class Meeting extends Component{
    constructor(props) {
        super(props)
        this.state = {
            role: 1
        }
      }

    componentDidMount(){
        this.mounted = true;
        this.props.actionsAuth.getUserInfo(this.props.token)
        this.props.actionsAuth.getMeetingList(this.props.token)
        console.log(this.props.meeting,'meeting')
    }

    renderMeeting(){
        let panels=[]
        Object.keys(this.props.meeting).map((key, index) =>{
            panels.push(
                <View key={index} style={styles.itemContainer}>
                    <TouchableOpacity> 
                        <Text>{this.props.meeting[key].date_time}</Text>
                        <Text>{this.props.meeting[key].title}</Text>
                    </TouchableOpacity>
                </View>
            )
        })
    }

    renderItems(){
        let items =[];
        this.props.meeting.map((key, index) => {
            items[this.props.meeting[key].date_time] = {
                name: this.props.meeting[key].title
        };
    });
    }

    render(){
        let markedDay = {};
        this.props.meeting.map((item) => {
            markedDay[item.date_time] = {
                selected: true,
                marked: true,
                selectedColor: "purple",
        };
    });
        return (
            <View style={styles.container}>
                {this.props.users.role === 1 ? <TouchableOpacity style={styles.button} onPress={() => this.props.navigation.navigate('MeetingForm')}>                   
                    <Text style={{color: COLORS.white}}>
                        Add Meeting
                    </Text>  
                </TouchableOpacity>  : <View/>
                }
                <Agenda
                items={{
                    '2021-12-06': [{name: ''}],
                    '2021-12-07': [{name: ''}],
                    '2021-12-09': [{name: ''}, {name: ''}]
                  }}
                  renderItem={(item, firstItemInDay) => {return (
                            <View style={styles.itemContainer}>
                                <TouchableOpacity> 
                                    <Text>meeting</Text>
                                </TouchableOpacity>   
                            </View>
                            );}}
                  renderEmptyDate={() => <View />}
                  markedDates={{
                    '2021-12-06': {marked: true},
                    '2021-12-07': {marked: true},
                    '2021-12-08': {disabled: true},

                  }}/>

            </View>
        )
    }
    
}

const styles = StyleSheet.create({
    container:{
        flex: 1,
        backgroundColor: COLORS.white
    },
    button: {
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        width:100,
        height: 30
    },
    itemContainer: {
        backgroundColor: 'white',
        margin: 5,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
      },
});

export default connect(mapStateToProps, mapDispatchToProps)(Meeting);