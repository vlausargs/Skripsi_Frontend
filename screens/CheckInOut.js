import React, { useState, useEffect } from 'react'
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
} from "react-native";
import { COLORS, SIZES, FONTS } from "../constants";
import Maps from './MapView';
import AsyncStorage from '@react-native-community/async-storage'
import { api_path } from '../constants';
import Geolocation from 'react-native-geolocation-service';
import { distance_calc } from '../utils/distance_calc';

export default function CheckInOut({ route, navigation }) {
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: COLORS.lightGray4
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
        }
    })
    const [isInitData, setisInitData] = useState(true);
    const [user, setUser] = useState(null)
    const [currToken, setCurrToken] = useState(null)
    const [CurrLocation, setCurrLocation] = useState({});

    useEffect(() => {
        if (isInitData == true) getUserInfo();
    }, [isInitData])

    function _getTokenValue() {
        var value = AsyncStorage.getItem('token')
        return value
    }

    function getUserInfo() {
        _getTokenValue().then(token => {
            console.log('Bearer ' + token)
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
            }
            setCurrToken(token);
        })
    }
    function fetchUser() {
        fetch(api_path + '/api/user/getUser', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                'Accept': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((json) => {
                setUser(json.user)
            })
            .catch((error) => console.error(error))
            .finally(() => { setisInitData(false) });
    }
    function postAttandance() {
        console.log(route.params.type)
        fetch(api_path + '/api/attendance/create', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                "Accept": "application/json",
                'Content-Type': 'application/json' 
            },
            body:JSON.stringify({
                "status":"Present",
                "lat":CurrLocation.latitude,
                "long":CurrLocation.longitude,
                "type":route.params.type,
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                if(json.create){
                    navigation.goBack();
                }else{
                    Alert.alert('ERROR', 'Try again!', [
                        {text: 'Okay'}
                    ]);
                    
                }
            })
            .catch((error) => console.error(error))
            .finally(() => { });
    }
    React.useEffect(() => {
        if (user) {
            calculateDistance();
        }

    }, [user]);
    React.useEffect(() => {
        if (currToken) {
            fetchUser();
        }
    }, [currToken])
    function calculateDistance() {
        Geolocation.getCurrentPosition(position => {
            var dist = distance_calc(position.coords.latitude, position.coords.longitude, user.company_info.lat, user.company_info.long)
            setCurrLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                distance: dist,
                error: null
            })
        }, error => setCurrLocation({ latitude: null, longitude: null, error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 })
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ backgroundColor: "#E15C5C", flex: 1 }}>
                <Maps user={user} currToken={currToken}></Maps>
            </View>
            <View style={{ backgroundColor: "#E1ACAA", flex: 1 }}>
                <View style={{ ...styles.shadow, backgroundColor: COLORS.white, paddingVertical: SIZES.padding + 10, margin: 20, borderRadius: 20 }}>
                    {/* <View style={{marginVertical:5}}>
                    <Text style={{...FONTS.h2,textAlign:'center',fontWeight: 'bold'}}>
                      Office Location
                    </Text>    
                 </View> */}
                    <View style={{ marginVertical: 5 }}>
                        <Text style={{ ...FONTS.h2, textAlign: 'center' }}>
                            Distance to Office:
                        </Text>
                    </View>
                    <View style={{ marginVertical: 5 }}>
                        <Text style={{ ...FONTS.body, textAlign: 'center' }}>
                            {CurrLocation.distance} M ( {CurrLocation.distance < 100 ? 'within range' : 'not in range'} )
                        </Text>
                    </View>
                    <View style={{ marginVertical: 5 }}>
                        <TouchableOpacity
                            disabled={(CurrLocation.distance < 100) }
                            style={{

                                ...styles.shadow, backgroundColor:  "#71BC68",
                                justifyContent: 'center',
                                marginHorizontal: SIZES.padding * 5,
                                paddingVertical: SIZES.padding / 2,
                                borderRadius: 20
                            }} onPress={() => { postAttandance() }}>
                            <Text style={{ ...FONTS.h2, fontWeight: 'bold', textAlign: 'center' }}>
                                 Submit
                            </Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </View>

        </SafeAreaView>
    )
}
