import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-community/async-storage'
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
    RefreshControl,
    ScrollView,
} from "react-native";

import { COLORS, SIZES, FONTS, api_path } from "../constants";
import { ReactReduxContext } from "react-redux";
import Geolocation from 'react-native-geolocation-service';
import { distance_calc } from '../utils/distance_calc';
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


const Home = ({ navigation }) => {
    const [isInitData, setisInitData] = useState(true);
    const [ClockState, setClockState] = useState();
    const [DateState, setDateState] = useState();
    const [isLoading, setLoading] = useState(true);
    const [isRefreshing, setisRefreshing] = useState(false);
    const [isCheckIn, setIsCheckIn] = useState(false);
    const [isCheckOut, setIsCheckOut] = useState(false);

    const [userInfo, setUser] = useState(null);
    const [attandaceActivity, setActivity] = useState(null);
    const [currToken, setToken] = useState(null);
    const [CurrLocation, setCurrLocation] = useState({
        latitude: 0,
        longitude: 0,
        distance: 0,
        error: null
    });
    const controller = new AbortController();

    React.useEffect(() => {
        if (isInitData == true) {
            checkToken();

        }
        return controller.abort();
    }, [isInitData]);

    React.useEffect(() => {
        if (isInitData == true && currToken) {
            getCurrUser();
            getActivity();
        }
        return controller.abort();
    }, [isInitData, currToken]);
    React.useEffect(() => {
        if (isInitData == true && userInfo) {
            // calculateDistance();
            visualizeDummy();
            setisInitData(false);
            setisRefreshing(false);
        }
        return function cleanup() {
            console.log("cleaning up");
            clearInterval(visualizeDummy());
          };
          
    }, [isInitData, userInfo]);

    function refresh() {
        setisRefreshing(true);
        setisInitData(true);
    }
    function calculateDistance() {
        Geolocation.getCurrentPosition(position => {
            var dist = distance_calc(position.coords.latitude, position.coords.longitude, userInfo.company_info.lat, userInfo.company_info.long)
            setCurrLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                distance: dist,
                error: null
            })
        }, error => setCurrLocation({ latitude: null, longitude: null, error: error.message }),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 2000 })
    }
    function getCurrUser() {
        fetch(api_path + '/api/user/getUser', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                'Accept': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((json) => {
                // console.log(json)
                register(json.user)
                setUser(json.user)

            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }
    function getActivity() {
        fetch(api_path + '/api/attendance/activity', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                'Accept': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((json) => {
                // console.log(json)
                setActivity(json.activity)
            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }
    function visualizeDummy() {
        let isMounted = true;
        setInterval(() => {
            if (isMounted) {
                const date = new Date();
                Date.prototype.toShortFormat = function () {

                    let monthNames = ["Jan", "Feb", "Mar", "Apr",
                        "May", "Jun", "Jul", "Aug",
                        "Sep", "Oct", "Nov", "Dec"];

                    let day = this.getDate();

                    let monthIndex = this.getMonth();
                    let monthName = monthNames[monthIndex];

                    let year = this.getFullYear();

                    return `${day} ${monthName} ${year}`;
                }
                setClockState(date.toLocaleTimeString());
                setDateState(date.toShortFormat())
                renderButton(date.toLocaleTimeString());
            }
        })
        return () => { isMounted = false }
    }
    async function _getTokenValue() {
        var value = await AsyncStorage.getItem('token')
        return value
    }
    function checkToken() {
        _getTokenValue().then(token => {
            console.log('Bearer ' + token)
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


            }
            setToken(token)
        })
    }


    function register(user) {
        console.log('cek user', user)
        if (!user) return;
    if (user.role == 1 && !user.company_info) {
            navigation.navigate('RegisterCompany')
        }
        else if (user.role == 2 && !user.employee_info) {
            navigation.navigate('RegisterEmployee')
        }
    }

    function renderHeader() {
        if (!userInfo) return;
        if (userInfo.role === 1){
            return (
                <View style={{ flexDirection: 'row', height: 50 }}>
                    <TouchableOpacity
                        style={{
                            paddingLeft: SIZES.padding * 2,
                            justifyContent: 'center'
                        }}>
                        <Text style={{ ...FONTS.h2, fontWeight: 'bold' }}>
                            Attendance (Admin)
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else if (userInfo.role === 2){
            return (
                <View style={{ flexDirection: 'row', height: 50 }}>
                    <TouchableOpacity
                        style={{
    
                            paddingLeft: SIZES.padding * 2,
                            justifyContent: 'center'
                        }}>
                        <Text style={{ ...FONTS.h2, fontWeight: 'bold' }}>
                            Attendance (Employee)
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
    function renderTodayDateTime() {
        return (
            <View style={{

                paddingLeft: SIZES.padding * 2,
                paddingRight: SIZES.padding * 2,
                justifyContent: 'center', flexDirection: 'row'
            }}>
                <View style={{ flex: 1 }}>
                    <Text style={{ ...FONTS.h3, textAlign: 'left' }}>
                        {DateState}
                    </Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={{ ...FONTS.h3, textAlign: 'right' }}>
                        {ClockState}
                    </Text>
                </View>
            </View>
        )
    }
    function renderCompanyInfo() {
        return (
            <View style={{ marginTop: 40 }}>
                {/* <Text style={{ ...FONTS.h3, textAlign: 'center' }}>
                    nama
                </Text>
                <Text style={{ ...FONTS.h3, textAlign: 'center' }}>
                    jabatan - tempat kerja
                </Text> */}
            </View>
        )
    }
    function renderButton(curr_time) {
        if (userInfo && userInfo.company_info) {

            var endDay = "23:59:59"
            var startWorkHour = userInfo.company_info.start_working_hour + ":00"
            var endWorkHour = userInfo.company_info.end_working_hour + ":00"
            // var checkInLimit= new Date(((new Date(new Date().toDateString()+"T"+startWorkHour)).getTime()+(30*60*1000))).toLocaleTimeString()
            var checkInLimit = new Date((new Date(new Date().toDateString() + " " + startWorkHour).getTime() + (30 * 60 * 1000))).toLocaleTimeString()
            // console.log(curr_time>startWorkHour && curr_time < checkInLimit)

            setIsCheckIn((curr_time > startWorkHour && curr_time < checkInLimit))
            setIsCheckOut((curr_time > endWorkHour && curr_time < endDay))
        }

    }
    function renderCurrAttandanceInfo() {
        return userInfo && userInfo.company_info &&(
            <View style={{ ...styles.shadow, backgroundColor: COLORS.white, paddingVertical: SIZES.padding + 10, margin: 20, borderRadius: 20 }}>
                {/* <View style={{marginVertical:5}}>
                    <Text style={{...FONTS.h2,textAlign:'center',fontWeight: 'bold'}}>
                      Office Location
                    </Text>    
                 </View> */}
                {/* <View style={{ marginVertical: 5 }}>
                    <Text style={{ ...FONTS.h2, textAlign: 'center' }}>
                        
                    </Text>
                </View>
                <View style={{ marginVertical: 5 }}>
                    <Text style={{ ...FONTS.body, textAlign: 'center' }}>
                        {CurrLocation.distance} M ( {CurrLocation.distance < 100 ? 'within range' : 'not in range'} )
                    </Text>
                </View> */}
                <View style={{ marginVertical: 5 }}>
                    <Text style={{ ...FONTS.h3, textAlign: 'center' ,fontWeight: '700' }}>
                        Halo, {userInfo?userInfo.name:""}
                    </Text>
                </View>
                {/* <View style={{ marginVertical: 5 }}>

                    <Text style={{ ...FONTS.h3, textAlign: 'center' ,fontWeight: '700' }}>
                        {userInfo?userInfo.employee_info.position:""} - {userInfo?userInfo.company_info.name:""}
                    </Text>
                </View> */}
                <View style={{ marginVertical: 5 }}>
                    <Text style={{ ...FONTS.h3, textAlign: 'center', textAlign: 'center', fontWeight: '700' }}>
                        Office Hour {userInfo?userInfo.company_info.name:""} 
                    </Text>
                </View>
                <View style={{ marginVertical: 10 }}>
                    <Text style={{ ...FONTS.h4, textAlign: 'center' }}>
                        {userInfo ? userInfo.company_info.start_working_hour : ''}- {userInfo ? userInfo.company_info.end_working_hour : ''}
                    </Text>
                </View>
                <View style={{ marginVertical: 5 }}>
                    <TouchableOpacity
                        disabled={!isCheckIn && !isCheckOut}
                        style={{

                            ...styles.shadow, backgroundColor: (isCheckIn || isCheckOut) ? "#71BC68" : "#808080",
                            justifyContent: 'center',
                            marginHorizontal: SIZES.padding * 5,
                            paddingVertical: SIZES.padding / 2,
                            borderRadius: 20
                        }} onPress={() => { navigation.navigate('CheckInOut',{type:(isCheckIn || (isCheckIn == false && isCheckOut == false) ? "Check In" : "Check Out")}) }}>
                        <Text style={{ ...FONTS.h2, fontWeight: 'bold', textAlign: 'center' }}>
                            {isCheckIn || (isCheckIn == false && isCheckOut == false) ? "Check In" : "Check Out"}
                        </Text>
                    </TouchableOpacity>

                </View>
            </View>
        )
    }
    function renderActLog() {
        return (
            <View style={{ flex: 1, marginHorizontal: 10 }}>
                <Text style={{ ...FONTS.h4, textAlign: 'left' }}>
                    Activity Log
                </Text>
                {/* loop activity log */}
                { attandaceActivity?attandaceActivity.map((item, key)=>(
                    <View style={{

                        paddingLeft: SIZES.padding * 2,
                        paddingRight: SIZES.padding * 2,
                        marginHorizontal: 20,
                        justifyContent: 'center', flexDirection: 'row'
                    }} key={key}>
                        <View style={{ flex: 1 }}>
                            <Text style={{ ...FONTS.h4, textAlign: 'left' }}>
                                {new Date(item.created_at).toLocaleTimeString()}
                            </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={{ ...FONTS.h4, textAlign: 'left' }}>
                                {item.type}
                            </Text>
                        </View>
                    </View>
                )
                ):<View></View>}
               
                
            </View>
        )
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={{ ...styles.shadow, backgroundColor: COLORS.white, paddingBottom: SIZES.padding }}>
                {renderHeader()}
                {renderTodayDateTime()}
            </View>
            <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={isRefreshing} onRefresh={()=>refresh()} />
                      }
            >
            {renderCompanyInfo()}
            {renderCurrAttandanceInfo()}
            {renderActLog()}

            </ScrollView>
        </SafeAreaView>
    )
}


export default Home;