import React, { PureComponent } from 'react'
import { 
    View,
    Text,
    StyleSheet,
    Alert,
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
export default class CompanyMarker extends PureComponent {
    componentDidMount() {

    }

    async _getTokenValue(){
        var value = await AsyncStorage.getItem('token')
        return value
    }
    checkToken(){
        _getTokenValue().then(token => {
            console.log('Bearer ' + token) 
            // token = null
            if (!token) {
                return Alert.alert(
                    "ERROR!!!",
                    "TOKEN EXPIRED",
                    [
                      { text: "OK", onPress: () => navigation.navigate('Login') }
                    ]
                  );
                
                
            }
            this.setState({...this.state,token:token})
        })
    }
    componentDidUpdate(prevProps, prevState, snapshot){
        if (this.state.currToken && !prevState.user){
            fetch('http://f22a-118-99-110-241.ap.ngrok.io/api/user/getUser',{
                method: 'GET',
                headers:{
                    'Authorization': 'Bearer ' + currToken,
                    'Accept': 'application/json'
                }
            })
              .then((response) => response.json())
              .then((json) => {
                console.log(json)
                register(json.user)
                this.setState({...this.state,user:json.user})
                
              })
              .catch((error) => console.error(error))
              .finally(() => setLoading(false));
        }
    }
    render() {
        return (
            <View style={{flex:1}}>
                <Marker coordinate={{latitude:this.state.user.company_info.lat,longitude: this.state.user.company_info.long}}/>
            </View>
        )
    }
}

