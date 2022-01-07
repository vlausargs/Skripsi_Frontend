import AsyncStorage from "@react-native-community/async-storage";
import { Picker } from "@react-native-picker/picker";
import moment from "moment";
import React, { useState } from "react";
import { Linking, RefreshControl } from "react-native";
import { Modal } from "react-native";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert,
    ScrollView
} from "react-native";
import Icon from 'react-native-vector-icons/dist/FontAwesome';

import { api_path, COLORS, FONTS, SIZES } from "../constants";

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
    panelText: {
        ...FONTS.body2,
        paddingHorizontal: SIZES.padding
      },
})
const LeavePermissions = ({ navigation }) => {
    const [currToken, setToken] = useState(null);
    const [filter, setFilter] = useState({ 'type': "", 'status': "", 'employee': "" });
    const [permissionRule, setPermissionRule] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [leavePermissions, setLeavePermissions] = useState(null);
    const [isInitData, setisInitData] = useState(true);
    const [isRefreshing, setisRefreshing] = useState(false);
    const [userInfo, setUser] = useState(null);
    const [adminPermissions, setAdminPermissions] = useState(null);

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
                setUser(json.user)

            })
            .catch((error) => console.error(error))
            .finally(() => {});
    }
    function getPermissionRule() {
        fetch(api_path + '/api/permission/getPermissionLeft', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                'Accept': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((json) => {
                // console.log(json)
                setPermissionRule(json.result)

            })
            .catch((error) => console.error(error))
            .finally(() => { });
    }

    function getLeavePermissionList() {
        fetch(api_path + '/api/permission/all/personal', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                'Accept': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((json) => {
                // console.log(json);
                setLeavePermissions(json.permissions.map((item, key) => { return { ...item, "expand": false } }));
            })

            .catch((error) => console.error(error))
            .finally(() => { });
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
    function getAllPermissionCompany(){
        fetch(api_path + '/api/permission/getAllPermissionCompany', {
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
                setAdminPermissions(json.permission)
            })
            .catch((error) => console.error(error))
            .finally(() => { });
    }
    React.useEffect(() => {
        if (isInitData == true) {
            checkToken();
        }
    }, [isInitData]);
    React.useEffect(() => {
        if (isInitData == true && currToken) {
            getCurrUser();
            getLeavePermissionList();
            getPermissionRule();
            getAllEmployeeByCompany();
            setisInitData(false);
            setisRefreshing(false);
        }

    }, [isInitData, currToken]);

    React.useEffect(() => {
        if (isInitData == true && currToken && userInfo && userInfo.role == 1) {
            getAllPermissionCompany();
        }

    }, [isInitData, currToken, userInfo]);
    
    function refresh() {
        setisRefreshing(true);
        setisInitData(true);
    }
    function renderHeader() {
        return (
            <View style={{ ...styles.shadow, backgroundColor: COLORS.white, paddingBottom: SIZES.padding }}>

                <View style={{ flexDirection: 'row', height: 50 }}>
                    <TouchableOpacity
                        style={{

                            paddingLeft: SIZES.padding * 2,
                            justifyContent: 'center'
                        }}>

                    </TouchableOpacity>
                    <View style={{

                        paddingLeft: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}>
                        <Text style={{ ...FONTS.h2, fontWeight: 'bold' }}>
                            Leave Permission  
                            <Text style={{ ...FONTS.body3, fontWeight: 'bold' }}>
                                {userInfo && userInfo.role == 1?' (ADMIN)':' (EMPLOYEE)'}
                            </Text>
                        </Text>
                        
                    </View>
                </View>
            </View>

        )
    }
    function postPermissionApprove(id) {
        fetch(api_path + '/api/permission/permissionAccepted', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": id,
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                if (json.alert == "success") setisInitData(true)
            })
            .catch((error) => console.error(error))
            .finally(() => { });
    }
    function postPermissionReject(id) {
        fetch(api_path + '/api/permission/permissionRejected', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "id": id,
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                if (json.alert == "success") setisInitData(true)
            })
            .catch((error) => console.error(error))
            .finally(() => { });
    }
    function renderPermissionList() {

        // var new_array = leavePermissions.filter((item, key) => {

        //     if ((filter.type == "" || item.permission_type.id == filter.type) && (filter.employee == "" || item.user.id == filter.employee) && (filter.status == "" || item.status == filter.status))
        //         return item;
        // })

        return (

             leavePermissions.map((item, key) => {
                if ((filter.type == "" || item.permission_type.id == filter.type) && (filter.employee == "" || item.user.id == filter.employee) && (filter.status == "" || item.status == filter.status))
                return (
                    <View style={{ margin: 20 }} key={key}>
                        <TouchableOpacity style={{
                            ...styles.shadow, backgroundColor: COLORS.white, paddingVertical: SIZES.padding + 10, borderRadius: 20
                        }}
                            onPress={() => {

                                    const pref = [...leavePermissions]
                                    pref[key].expand = !pref[key].expand
                                    console.log(pref)
                                    setLeavePermissions(pref)
                                
                            }}>
                            <View style={{ marginVertical: 5 }}>
                               
                                <Text style={{ ...FONTS.h4, textAlign: 'left', fontWeight: '700', paddingHorizontal: SIZES.padding * 1.5, paddingBottom: SIZES.padding }}>
                                    {item.user.name} <Text style={{ ...FONTS.body3, textAlign: 'right', fontWeight: '700', }}> ({item.employee.nik}) </Text>
                                </Text>
                                <Text style={{ ...FONTS.h4, textAlign: 'left', fontWeight: '700', paddingHorizontal: SIZES.padding * 1.5 }}>
                                    {item.permission_type.leave_type} <Text style={{ ...FONTS.body3, textAlign: 'left', fontWeight: '700', }}> - {item.status == 0 ? 'Requested' : item.status == 1 ? 'Approved' : 'Rejected'}</Text>
                                </Text>
                            </View>
                            <View style={{ marginVertical: 10, flexDirection: 'row' }}>
                                <Text style={{ ...FONTS.body3, textAlign: 'left', fontWeight: '700', flex: 1, paddingHorizontal: SIZES.padding * 1.5 }}>
                                    From: {moment(item.start_date).format('DD/MM/YY')}
                                </Text>
                                <Text style={{ ...FONTS.body3, textAlign: 'right', fontWeight: '700', flex: 1, paddingHorizontal: SIZES.padding * 1.5 }}>
                                    To: {moment(item.end_date).format('DD/MM/YY')}
                                </Text>
                            </View>

                        </TouchableOpacity>
                        {item.expand && (<View style={{ ...styles.shadow, backgroundColor: COLORS.white, paddingVertical: SIZES.padding, borderRadius: 20, flexDirection: 'row', marginTop: 10 }} >
                            <View style={{ marginVertical:1}}>
                                    <Text style={{ ...FONTS.body3, textAlign: 'right', fontWeight: '700', flex: 1, paddingHorizontal: SIZES.padding * 1.5 }}>
                                    attachment: {item.file_path &&(<Text style={[styles.panelText, { color: COLORS.primary }]} onPress={() => {Linking.openURL(api_path+item.file_path)}}>LINK</Text>)}
                                    </Text>
                            </View>
                            {(userInfo && userInfo.role == 1 && item.status == 0) && (<View>
                                <TouchableOpacity
                                style={{
                                    ...styles.shadow,
                                    backgroundColor: COLORS.primary,
                                    paddingVertical: SIZES.padding * 1.5,
                                    marginVertical: SIZES.padding,
                                    marginHorizontal: SIZES.padding,
                                    maxWidth: 100,
                                    maxHeight: 100,
                                    borderRadius: 25,
                                    flex: 1
                                }}
                                onPress={() => {
                                    postPermissionApprove(item.id);
                                }}
                            >
                                <Text style={{ ...styles.inputContainer, textAlign: 'center', alignSelf: 'stretch', color: 'white' }}>Approve</Text>

                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    ...styles.shadow,
                                    backgroundColor: COLORS.primary,
                                    paddingVertical: SIZES.padding * 1.5,
                                    marginVertical: SIZES.padding,
                                    marginHorizontal: SIZES.padding,
                                    maxWidth: 100,
                                    maxHeight: 100,
                                    borderRadius: 25,
                                    flex: 1,

                                }}
                                onPress={() => {
                                    postPermissionReject(item.id);
                                }}
                            >
                                <Text style={{ ...styles.inputContainer, textAlign: 'center', alignSelf: 'stretch', color: 'white' }}>Reject</Text>

                            </TouchableOpacity>
                            </View>)}
                           

                        </View>)}
                    </View>
                )

            })
        )
    }
    function renderAdminPermissionList() {
        return (

             adminPermissions.map((item, key) => {
                if ((filter.type == "" || item.permission_type.id == filter.type) && (filter.employee == "" || item.user.id == filter.employee) && (filter.status == "" || item.status == filter.status))
                return (
                    <View style={{ margin: 20 }} key={key}>
                        <TouchableOpacity style={{
                            ...styles.shadow, backgroundColor: COLORS.white, paddingVertical: SIZES.padding + 10, borderRadius: 20
                        }}
                            onPress={() => {
                                if (userInfo && userInfo.role == 1 && item.status == 0) {
                                    const pref = [...adminPermissions]
                                    pref[key].expand = !pref[key].expand
                                    console.log(pref)
                                    setAdminPermissions(pref)
                                }
                            }}>
                            <View style={{ marginVertical: 5 }}>
                                <Text style={{ ...FONTS.h4, textAlign: 'left', fontWeight: '700', paddingHorizontal: SIZES.padding * 1.5, paddingBottom: SIZES.padding }}>
                                    {item.user.name} <Text style={{ ...FONTS.body3, textAlign: 'right', fontWeight: '700', }}> {item.nik} </Text>
                                </Text>
                                <Text style={{ ...FONTS.h4, textAlign: 'left', fontWeight: '700', paddingHorizontal: SIZES.padding * 1.5 }}>
                                    {item.permission_type.leave_type} <Text style={{ ...FONTS.body3, textAlign: 'left', fontWeight: '700', }}> - {item.status == 0 ? 'Requested' : item.status == 1 ? 'Approved' : 'Rejected'}</Text>
                                </Text>
                            </View>
                            <View style={{ marginVertical: 10, flexDirection: 'row' }}>
                                <Text style={{ ...FONTS.body3, textAlign: 'left', fontWeight: '700', flex: 1, paddingHorizontal: SIZES.padding * 1.5 }}>
                                    From: {moment(item.start_date).format('DD/MM/YY')}
                                </Text>
                                <Text style={{ ...FONTS.body3, textAlign: 'right', fontWeight: '700', flex: 1, paddingHorizontal: SIZES.padding * 1.5 }}>
                                    To: {moment(item.end_date).format('DD/MM/YY')}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {item.expand && (<View style={{ ...styles.shadow, backgroundColor: COLORS.white, paddingVertical: SIZES.padding, borderRadius: 20, flexDirection: 'row', marginTop: 10 }} >

                            <TouchableOpacity
                                style={{
                                    ...styles.shadow,
                                    backgroundColor: COLORS.primary,
                                    paddingVertical: SIZES.padding * 1.5,
                                    marginVertical: SIZES.padding,
                                    marginHorizontal: SIZES.padding,
                                    maxWidth: 100,
                                    maxHeight: 100,
                                    borderRadius: 25,
                                    flex: 1
                                }}
                                onPress={() => {
                                    postPermissionApprove(item.id);
                                }}
                            >
                                <Text style={{ ...styles.inputContainer, textAlign: 'center', alignSelf: 'stretch', color: 'white' }}>Approve</Text>

                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    ...styles.shadow,
                                    backgroundColor: COLORS.primary,
                                    paddingVertical: SIZES.padding * 1.5,
                                    marginVertical: SIZES.padding,
                                    marginHorizontal: SIZES.padding,
                                    maxWidth: 100,
                                    maxHeight: 100,
                                    borderRadius: 25,
                                    flex: 1,

                                }}
                                onPress={() => {
                                    postPermissionReject(item.id);
                                }}
                            >
                                <Text style={{ ...styles.inputContainer, textAlign: 'center', alignSelf: 'stretch', color: 'white' }}>Reject</Text>

                            </TouchableOpacity>

                        </View>)}
                    </View>
                )

            })
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
                    Alert.alert("Modal has been closed.");
                    setModalVisible(!modalVisible);
                }}
                onRequestClose={()=>{setModalVisible(!modalVisible)}}
            >
                <View style={styles.centeredView}>
                    <View style={{ ...styles.modalView, backgroundColor: COLORS.white, paddingBottom: SIZES.padding, marginBottom: SIZES.padding, flex: 1 }} >
                        <Text style={FONTS.h2}>Filter Data</Text>
                        <Picker
                            selectedValue={filter.type}
                            style={{
                                ...styles.shadow,
                                marginVertical: SIZES.padding,
                                marginHorizontal: SIZES.padding,
                                textAlign: 'center',
                                alignSelf: 'stretch',
                                backgroundColor: 'white',
                                borderColor: COLORS.lightGray,
                            }}
                            // itemStyle={{...FONTS.h1,}}
                            onValueChange={(itemValue, itemIndex) => changeFilter("type", itemValue)}
                        >
                            <Picker.Item label="Filter Types" color="black" value="" style={styles.inputContainer} />
                            {permissionRule.map((item, key) => {
                                return (
                                    <Picker.Item label={item.leave_type} color="black" value={item.id} style={styles.inputContainer} key={key} />
                                )
                            })}

                            {/* <Picker.Item label="Employee" color="blue" value="employee" style={styles.inputContainer} /> */}
                        </Picker>
                        <Picker
                            selectedValue={filter.status}
                            style={{
                                ...styles.shadow,
                                marginVertical: SIZES.padding,
                                marginHorizontal: SIZES.padding,
                                textAlign: 'center',
                                alignSelf: 'stretch',
                                backgroundColor: 'white',
                                borderColor: COLORS.lightGray
                            }}
                            // itemStyle={{...FONTS.h1,}}
                            onValueChange={(itemValue, itemIndex) => changeFilter("status", itemValue)}
                        >
                            <Picker.Item label="Filter Status" color="black" value="" style={styles.inputContainer} />
                            <Picker.Item label="Requested" color="black" value="0" style={styles.inputContainer} key="0" />
                            <Picker.Item label="Approved" color="black" value="1" style={styles.inputContainer} key="1" />
                            <Picker.Item label="Rejected" color="black" value="3" style={styles.inputContainer} key="3" />

                            {/* <Picker.Item label="Employee" color="blue" value="employee" style={styles.inputContainer} /> */}
                        </Picker>
                        {userInfo && userInfo.role == 1 &&
                            <Picker
                                selectedValue={filter.employee}
                                style={{
                                    ...styles.shadow,
                                    marginVertical: SIZES.padding,
                                    marginHorizontal: SIZES.padding,
                                    textAlign: 'center',
                                    alignSelf: 'stretch',
                                    backgroundColor: 'white',
                                    borderColor: COLORS.lightGray
                                }}
                                // itemStyle={{...FONTS.h1,}}
                                onValueChange={(itemValue, itemIndex) => changeFilter("employee", itemValue)}
                            >
                                <Picker.Item label="Filter Employee" color="black" value="" style={styles.inputContainer} />
                                {employees.map((item, key) => {
                                    return (
                                        <Picker.Item label={item.user.name + ' (' + item.nik + ')'} color="black" value={item.user.id} style={styles.inputContainer} key={key} />
                                    )
                                })}

                                {/* <Picker.Item label="Employee" color="blue" value="employee" style={styles.inputContainer} /> */}
                            </Picker>
                        }
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
                            onPress={() => { setModalVisible(false) }}
                        >
                            <Text style={{ ...FONTS.h4, color: 'white' }}>Done</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        )
    }
    return userInfo &&(
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            <View>
                {/* render loop  */}
                <Text>
                </Text>
            </View>
            <ScrollView
                refreshControl={
                    <RefreshControl refreshing={isRefreshing} onRefresh={() => refresh()} />
                }
            >
                <View style={{ 'flex': 1, alignItems: 'flex-end', marginRight: SIZES.padding * 2 }}>
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
                </View>
                <View style={styles.centeredView}>
                    {renderFilter()}
                </View>

                {leavePermissions &&  renderPermissionList() }
                {adminPermissions && renderAdminPermissionList()}
            </ScrollView>
            {userInfo.role === 2 && (<TouchableOpacity
                style={{
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    height: 50,
                    backgroundColor: '#fff',
                    borderRadius: 100,
                }}
                onPress={() => { navigation.navigate('CreateLeavePermisson') }}
            >
                <Icon name='plus' size={30} color='#000000' />
            </TouchableOpacity>)}
            
        </SafeAreaView>
    )
}

export default LeavePermissions;