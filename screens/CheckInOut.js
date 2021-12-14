import React, { useState,useEffect } from 'react'
import { 
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
} from "react-native";
import { COLORS,SIZES,FONTS } from "../constants";
import Maps from './MapView';
import AsyncStorage from '@react-native-community/async-storage'
import { api_path } from '../constants';
import Geolocation from 'react-native-geolocation-service';
import { distance_calc } from '../utils/distance_calc';
export default function CheckInOut() {
    const styles= StyleSheet.create({
        container: {
            flex:1,
            backgroundColor: COLORS.lightGray4
        },
        shadow:{
            shadowColor: "#000",
            shadowOffset:{
                width:0,
                height:3,
            },
            shadowOpacity:0.1,
            shadowRadius:3,
            elevation:10,
        }
    })
    const [isInitData, setisInitData] = useState(true);
    const [user, setUser] = useState(null)
    const [currToken, setCurrToken] = useState(null)
    const [CurrLocation, setCurrLocation] = useState({});
    useEffect(()=>{
        if(isInitData==true) getUserInfo();
    },[isInitData])
    function _getTokenValue(){
        var value =  AsyncStorage.getItem('token')
        return value
    }
    
    function getUserInfo(){
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
                
                
            }else{
                
                setCurrToken(token);
                fetch(api_path+'/api/user/getUser',{
                    method: 'GET',
                    headers:{
                        'Authorization': 'Bearer ' + token,
                        'Accept': 'application/json'
                    }
                })
                  .then((response) => response.json())
                  .then((json) => {
                    // console.log(json)
                    // register(json.user)
                    setUser(json.user)
                    console.log("test2")
                    console.log(json)
                  })
                  .catch((error) => console.error(error))
                  .finally(() =>{setisInitData(false)});
                
            }
        })
    }
    React.useEffect(()=>{
        if (user){
            calculateDistance();
        }

    },[user]);

    function calculateDistance(){
        Geolocation.getCurrentPosition(position => {
            var dist=distance_calc(position.coords.latitude,position.coords.longitude,user.company_info.lat,user.company_info.long)
            setCurrLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                distance: dist,
                error: null
            })
        }, error => setCurrLocation({latitude:null,longitude:null,error: error.message}),
        {enableHighAccuracy: true, timeout: 20000, maximumAge: 2000})
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={{backgroundColor:"#E15C5C",flex:1}}>
                <Maps user={user} currToken={currToken}></Maps>
            </View>
            <View style={{backgroundColor:"#E1ACAA",flex:1}}>
                <Text>show brief user information ,check in/out, time, submit button, if fingerprint exist ask one</Text>
            </View>
            
        </SafeAreaView>
    )
}
