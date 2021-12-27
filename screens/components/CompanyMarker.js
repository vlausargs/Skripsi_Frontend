import React, { PureComponent } from 'react'
import { 
    View,
    Text,
    StyleSheet,
    Alert,
} from "react-native";
import { Marker } from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage'
import { api_path } from '../../constants';
export default class CompanyMarker extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            user:{
                company_info:{
                    lat:0,
                    long:0
                },
            },
            currToken:null,
        }

    }
    componentDidMount() {
        this.checkToken();
    }

    _getTokenValue(){
        var value =  AsyncStorage.getItem('token')
        return value
    }
    checkToken(){
        this._getTokenValue().then(token => {
            
            // token = null
            if (!token) {
                return Alert.alert(
                    "ERROR!!!",
                    "TOKEN EXPIRED",
                    [
                      { text: "OK", onPress: () => navigation.reset({
                        index: 0,
                        routes: [
                            {
                                name: 'Login',
                                params: { messages: 'TOKEN EXPIRED' },
                            },
                        ],
                    }) }
                    ]
                  );
                
                
            }else{
                this.setState({...this.state,token:token})
                fetch(api_path+'/api/user/getUser',{
                    method: 'GET',
                    headers:{
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json'
                    }
                })
                  .then((response) => response.json())
                  .then((json) => {
                    this.setState({...this.state,user:json.user})
                  })
                  .catch((error) => console.error(error))
                  .finally(() =>{});
                
            }
        })
    }
    componentDidUpdate(){
           
    }
    render() {
        return (
            <View style={{flex:1}}>
                { this.state.user.company_info &&(<Marker coordinate={{latitude:parseFloat(this.state.user.company_info.lat),longitude: parseFloat(this.state.user.company_info.long)}}/>)}
            </View>
        )
    }
}

