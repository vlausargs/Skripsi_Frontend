import React, { Component } from "react";
import { 
    View,
    Text,
    TouchableOpacity
} from "react-native";

export default class Meeting extends Component{
    constructor() {
        super()
      }
    render(){
        return (
            <View style={{alignItems: 'center', justifyContent:'center'}}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('MeetingForm')}>
                    <Text>
                        Form Meeting
                    </Text>  
                </TouchableOpacity>       
            </View>
        )
    }
    
}
