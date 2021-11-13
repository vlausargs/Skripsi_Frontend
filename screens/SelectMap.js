import React, { Component } from "react";
import { 
    View,
    Text,
    TouchableOpacity
} from "react-native";

export default class SelectMap extends Component{
    constructor() {
        super()
      }
    render(){
        return (
            <View style={{alignItems: 'center', justifyContent:'center'}}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('MapView')}>
                    <Text>
                        Open Maps
                    </Text>  
                </TouchableOpacity>       
            </View>
        )
    }
    
}
