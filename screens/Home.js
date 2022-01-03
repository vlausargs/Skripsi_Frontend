import React, { useState, useEffect } from "react";
import AsyncStorage from '@react-native-community/async-storage'
import DateTimePicker from "@react-native-community/datetimepicker";
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
    Modal,
} from "react-native";
import moment from "moment";
import { COLORS, SIZES, FONTS, api_path } from "../constants";
import { ReactReduxContext } from "react-redux";
import Geolocation from 'react-native-geolocation-service';
import { distance_calc } from '../utils/distance_calc';
import { Picker } from "@react-native-picker/picker";
import Icon from 'react-native-vector-icons/dist/FontAwesome';
import { DataTable } from "react-native-paper";

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
    },
    centeredView: {
        flex: 1,
        backgroundColor: COLORS.darkgray
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
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
    const [employees, setEmployees] = useState([]);
    const [notification, setNotification] = useState([]);
    const [missing_attandance, setMissing_attandance] = useState(null);
    const [filter, setFilter] = useState({ 'start_date': new Date(), 'end_date': new Date(), 'user_id': "" });
    const [modalVisible, setModalVisible] = useState(false);
    const [showDate, setShowDate] = useState({ start: false, end: false });

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
            getAllEmployeeByCompany();
            getNotification();
            // if(filter.start_date !=""&& filter.end_date!="")getMissingAttandace();
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
    function getNotification() {
        fetch(api_path + '/api/notification/getNotifLogged', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                'Accept': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((json) => {
                // console.log(json)

                if (json.employeeNotif) {
                    json.employeeNotif.map((item, key) => {
                        return (Alert.alert(
                            "Notification From Admin",
                            item.desc,
                            [
                                {
                                    text: "OK", onPress: () => { }
                                }
                            ]
                        ));
                    })
                }


            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }
    function getMissingAttandace() {
        fetch(api_path + '/api/attendance/get_missing_attandance', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "start_date": filter.start_date.toLocaleDateString("en-US"),
                "end_date": filter.end_date.toLocaleDateString("en-US"),
                "user_id": filter.user_id
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)

                setMissing_attandance(json.users.map((item, key) => { return { ...item, "expand": false } }))

            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }
    function postNotification(item) {
        fetch(api_path + '/api/notification/store', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "user_id": item.mis_user_id,
                "desc": "Missing " + item.mis_type + " (" + item.mis_day + ") please contact Admin/HR !",
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                if (json.employeeNotif) {
                    Alert.alert("Success")
                } else {
                    Alert.alert("error")
                }


            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    function getAllEmployeeByCompany() {
        fetch(api_path + '/api/employee/getAllByCompany', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                setEmployees(json.employees)
            })
            .catch((error) => console.error(error))
            .finally(() => { });
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
                        {
                            text: "OK", onPress: () => navigation.reset({
                                index: 0,
                                routes: [
                                    {
                                        name: 'Login',
                                        params: { messages: 'TOKEN EXPIRED' },
                                    },
                                ],
                            })
                        }
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
        if (userInfo.role === 1) {
            return (
                <View style={{ flexDirection: 'row', height: 50 }}>
                    <TouchableOpacity
                        style={{
                            paddingLeft: SIZES.padding * 2,
                            justifyContent: 'center'
                        }}>
                        <Text style={{ ...FONTS.h2, fontWeight: 'bold' }}>
                            Attendance (ADMIN)
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else if (userInfo.role === 2) {
            return (
                <View style={{ flexDirection: 'row', height: 50 }}>
                    <TouchableOpacity
                        style={{

                            paddingLeft: SIZES.padding * 2,
                            justifyContent: 'center'
                        }}>
                        <Text style={{ ...FONTS.h2, fontWeight: 'bold' }}>
                            Attendance (EMPLOYEE)
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
                    {userInfo && userInfo.role == 2 &&
                        (<Text style={{ ...FONTS.h3, textAlign: 'left' }}>
                            {DateState}
                        </Text>
                        )}
                </View>
                <View style={{ flex: 1 }}>
                    {userInfo && userInfo.role == 2 &&
                        (<Text style={{ ...FONTS.h3, textAlign: 'right' }}>

                            {ClockState}
                        </Text>
                        )}
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
        return userInfo && userInfo.company_info && (
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
                    <Text style={{ ...FONTS.h3, textAlign: 'center', fontWeight: '700' }}>
                        Halo, {userInfo ? userInfo.name : ""}
                    </Text>
                </View>
                {/* <View style={{ marginVertical: 5 }}>

                    <Text style={{ ...FONTS.h3, textAlign: 'center' ,fontWeight: '700' }}>
                        {userInfo?userInfo.employee_info.position:""} - {userInfo?userInfo.company_info.name:""}
                    </Text>
                </View> */}
                <View style={{ marginVertical: 10 }}>
                    <Text style={{ ...FONTS.h3, textAlign: 'center', textAlign: 'center', fontWeight: '700' }}>
                        Office Hour {userInfo ? userInfo.company_info.name : ""}
                    </Text>
                </View>
                <View style={{ marginVertical: 5 }}>
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
                        }} onPress={() => { navigation.navigate('CheckInOut', { type: (isCheckIn || (isCheckIn == false && isCheckOut == false) ? "Check In" : "Check Out") }) }}>
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
                {attandaceActivity ? attandaceActivity.map((item, key) => (
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
                ) : <View></View>}


            </View>
        )
    }
    function renderEmplLog() {
        // console.log(missing_attandance)
        return (
            <View style={{ flex: 1 }}>
                {missing_attandance && (
                    <View>

                        <View style={{ flex: 1, flexDirection: 'row' }}>
                            <Text style={{ ...FONTS.h3, textAlign: 'left', fontWeight: '700', paddingHorizontal: SIZES.padding * 1.5, paddingBottom: SIZES.padding }}>
                                From:{moment(filter.start_date.toISOString()).format('DD/MM/YY')}
                            </Text>
                            <Text style={{ ...FONTS.h3, textAlign: 'right', fontWeight: '700', flex: 1, paddingHorizontal: SIZES.padding * 1.5 }}>
                                To: {moment(filter.end_date.toISOString()).format('DD/MM/YY')}


                            </Text>

                        </View>

                        <ScrollView style={{...styles.shadow, margin: 10, flex: 1,backgroundColor:COLORS.white }} >
                            <DataTable>
                                <DataTable.Header>
                                    <DataTable.Title>Name</DataTable.Title>
                                    <DataTable.Title>Total Missing Attandance</DataTable.Title>

                                    <DataTable.Title numeric>Action</DataTable.Title>
                                </DataTable.Header>
                                {missing_attandance.map((item, key) => {
                                    return (
                                        <DataTable.Row key={key}>
                                            <DataTable.Cell>{item.name}</DataTable.Cell>
                                            <DataTable.Cell>{item.missing_attandance.length}</DataTable.Cell>

                                            <TouchableOpacity onPress={() => {
                                                const pref = [...missing_attandance]
                                                pref[key].expand = !pref[key].expand
                                                console.log(pref)
                                                setMissing_attandance(pref)
                                            }}>
                                                <DataTable.Cell>show detail</DataTable.Cell>
                                            </TouchableOpacity>
                                        </DataTable.Row>
                                    )
                                })}
                            </DataTable>
                            {missing_attandance && missing_attandance.map((item, key) => {
                                return (
                                    item.expand && (
                                        //modal
                                        <Modal
                                            animationType="fade"
                                            transparent={true}
                                            visible={item.expand}
                                            onRequestClose={() => {
                                                const pref = [...missing_attandance]
                                                pref[key].expand = !pref[key].expand
                                                console.log(pref)
                                                setMissing_attandance(pref)
                                            }}
                                            onRequestClose={() => {
                                                const pref = [...missing_attandance]
                                                pref[key].expand = !pref[key].expand
                                                console.log(pref)
                                                setMissing_attandance(pref)
                                            }}
                                        key={key}>
                                            <ScrollView style={styles.centeredView}>
                                                <View style={{ ...styles.modalView, backgroundColor: COLORS.white, paddingBottom: SIZES.padding, marginBottom: SIZES.padding, flex: 1, alignItems: 'center' }} >
                                                    <Text style={{ ...FONTS.h2, fontWeight: '700' }}>List Missing Attandance</Text>
                                                    <Text style={{ ...FONTS.h3 }}>{item.name}</Text>
                                                    <DataTable>
                                                        <DataTable.Header>
                                                            <DataTable.Title>Date</DataTable.Title>
                                                            <DataTable.Title>Type</DataTable.Title>

                                                            <DataTable.Title numeric>Action</DataTable.Title>
                                                        </DataTable.Header>
                                                        {item.missing_attandance.map((item2, key2) => (
                                                            <DataTable.Row key={key2}>
                                                                <DataTable.Cell>{item2.mis_day}</DataTable.Cell>
                                                                <DataTable.Cell>{item2.mis_type}</DataTable.Cell>

                                                                <TouchableOpacity onPress={() => { postNotification(item2) }}>
                                                                    <DataTable.Cell>send notif</DataTable.Cell>
                                                                </TouchableOpacity>
                                                            </DataTable.Row>
                                                        ))}
                                                    </DataTable>

                                                </View>
                                            </ScrollView>

                                        </Modal>))

                            })}
                        </ScrollView>
                    </View>

                )}
            </View>
        )
    }
    function changeFilter(key, value) {
        setFilter({ ...filter, [key]: value })
    }
    function renderFilter() {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
                onRequestClose={() => { setModalVisible(!modalVisible) }}
            >
                <View style={styles.centeredView}>
                    <View style={{ ...styles.modalView, backgroundColor: COLORS.white, paddingBottom: SIZES.padding, marginBottom: SIZES.padding, flex: 1 }} >
                        <Text style={{ ...FONTS.h2 }}>Filter Data</Text>
                        <View style={{ marginTop: SIZES.padding }}>

                            <Text style={FONTS.h4}>Filter Employee</Text>


                            <Picker
                                selectedValue={filter.user_id}
                                style={{
                                    ...styles.shadow,
                                    marginVertical: SIZES.padding,
                                    marginHorizontal: SIZES.padding,
                                    textAlign: 'center',
                                    alignSelf: 'stretch',
                                    backgroundColor: 'white',
                                    borderColor: COLORS.lightGray,
                                    width: 200
                                }}
                                // itemStyle={{...FONTS.h1,}}
                                onValueChange={(itemValue, itemIndex) => changeFilter("user_id", itemValue)}
                            >
                                <Picker.Item label="Select Employee" color="black" value="" style={styles.inputContainer} />
                                {employees.map((item, key) => {
                                    return (
                                        <Picker.Item label={item.user.name + ' (' + item.nik + ')'} color="black" value={item.user.id} style={styles.inputContainer} key={key} />
                                    )
                                })}

                                {/* <Picker.Item label="Employee" color="blue" value="employee" style={styles.inputContainer} /> */}
                            </Picker>
                        </View>
                        <View>
                            <Text style={FONTS.h4}>Filter Start Date</Text>
                            <TouchableOpacity
                                style={{
                                    ...styles.shadow,
                                    backgroundColor: COLORS.white,
                                    padding: SIZES.padding * 1.5,
                                    marginVertical: SIZES.padding,
                                    marginHorizontal: SIZES.padding,
                                    width: 200
                                }}
                                onPress={() => {
                                    setShowDate({ ...showDate, start: true })
                                }}
                            >
                                <Text style={styles.inputContainer}>{filter.start_date.toLocaleDateString("en-US")}</Text>

                            </TouchableOpacity>
                        </View>
                        <View>
                            <Text style={FONTS.h4}>Filter End Date</Text>
                            <TouchableOpacity
                                style={{
                                    ...styles.shadow,
                                    backgroundColor: COLORS.white,
                                    padding: SIZES.padding * 1.5,
                                    marginVertical: SIZES.padding,
                                    marginHorizontal: SIZES.padding,
                                    width: 200
                                }}
                                onPress={() => {
                                    setShowDate({ ...showDate, end: true })
                                }}
                            >
                                <Text style={styles.inputContainer}>{filter.end_date.toLocaleDateString("en-US")}</Text>

                            </TouchableOpacity>
                        </View>

                        {React.useMemo(() => {
                            return showDate.start && (<DateTimePicker
                                testID="startDate"
                                value={filter.start_date}
                                mode="date"
                                display="default"
                                onChange={(e, selectedValue) => {
                                    const currentDate = selectedValue || filter.start_date;
                                    setFilter({ ...filter, start_date: currentDate });
                                    setShowDate({ ...showDate, start: false }) // to show time
                                    // setUserInput({...userInput,date_time:selectedValue||userInput.date_time})
                                    // setShowDate({...showDate,start:false})

                                }}
                            />)
                        }, [showDate.start])}
                        {React.useMemo(() => {
                            return showDate.end && (<DateTimePicker
                                testID="endDate"
                                value={filter.end_date}
                                mode="date"
                                display="default"
                                onChange={(e, selectedValue) => {
                                    const currentDate = selectedValue || filter.end_date;
                                    setFilter({ ...filter, end_date: currentDate });
                                    setShowDate({ ...showDate, end: false }) // to show time
                                    // setUserInput({...userInput,date_time:selectedValue||userInput.date_time})
                                    // setShowDate({...showDate,start:false})

                                }}
                            />)
                        }, [showDate.end])}

                        <TouchableOpacity
                            style={{
                                ...styles.shadow,
                                borderWidth: 1,
                                borderColor: 'rgba(0,0,0,0.2)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 100,
                                height: 50,
                                backgroundColor: COLORS.primary,
                                borderRadius: 20,
                            }}
                            onPress={() => {
                                setModalVisible(false)
                                getMissingAttandace();
                            }}
                        >
                            <Text style={{ ...FONTS.h4, color: 'white' }}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
                    <RefreshControl refreshing={isRefreshing} onRefresh={() => refresh()} />
                }
            >
                {userInfo && userInfo.role == 1 &&
                    <View style={{ alignItems: 'flex-end', marginRight: SIZES.padding * 2, marginVertical: SIZES.padding }}>
                        <TouchableOpacity
                            style={{
                                borderWidth: 1,
                                borderColor: 'rgba(0,0,0,0.2)',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 50,
                                height: 50,
                                backgroundColor: '#fff',
                                borderRadius: 100,
                            }}
                            onPress={() => { setModalVisible(true) }}
                        >
                            <Icon name='filter' size={30} color='#000000' />
                        </TouchableOpacity>
                    </View>}
                {userInfo && userInfo.role == 1 && renderEmplLog()}
                <View style={styles.centeredView}>
                    {renderFilter()}
                </View>
                {renderCompanyInfo()}
                {userInfo && userInfo.role == 2 && renderCurrAttandanceInfo()}
                {userInfo && userInfo.role == 2 && renderActLog()}
            </ScrollView>
        </SafeAreaView>
    )
}


export default Home;