import AsyncStorage from "@react-native-community/async-storage";
import React, { useState } from "react";
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
    }
})
const LeavePermissions = ({ navigation }) => {
    const [currToken, setToken] = useState(null);
    const [leavePermissions, setLeavePermissions] = useState(null);
    const [isInitData, setisInitData] = useState(true);

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
                console.log(json)
                setLeavePermissions(json.permissions.map((item, key) => { return {...item,"expand":false}}))
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
            getLeavePermissionList()
            setisInitData(false)
        }

    }, [isInitData, currToken]);
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
            body:JSON.stringify({
                "id":id,
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                if(json.alert =="success") setisInitData(true)
            })
            .catch((error) => console.error(error))
            .finally(() => {  });
    }
    function postPermissionReject(id) {
        fetch(api_path + '/api/permission/permissionRejected', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                "id":id,
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                if(json.alert =="success") setisInitData(true)
            })
            .catch((error) => console.error(error))
            .finally(() => {  });
    }
    function renderPermissionList() {
        console.log(leavePermissions.map((item, key) => { return item.permission_type }))

        return (
            leavePermissions.map((item, key) => {
                return (
                    <View style={{margin: 20}} key={key}>
                        <TouchableOpacity style={{
                            ...styles.shadow, backgroundColor: item.status==0?COLORS.white:item.status==1?COLORS.primary:COLORS.secondary, paddingVertical: SIZES.padding + 10, borderRadius: 20
                        }} 
                        onPress={()=>{
                            if (item.status== 0){
                                const pref= [...leavePermissions]
                                pref[key].expand = !pref[key].expand
                                console.log(pref)
                                setLeavePermissions(pref)
                            }
                        }}>
                            <View style={{ marginVertical: 5 }}>
                                <Text style={{ ...FONTS.h3, textAlign: 'left', fontWeight: '700',paddingHorizontal:SIZES.padding*1.5 }}>
                                    {item.permission_type.leave_type} 
                                </Text>
                            </View>
                            <View style={{ marginVertical: 10 ,flexDirection:'row'}}>
                                <Text style={{ ...FONTS.h3, textAlign: 'left', fontWeight: '700' ,flex:1 ,paddingHorizontal:SIZES.padding*1.5 }}>
                                    {(new Date(item.start_date)).toLocaleDateString()} 
                                </Text>
                                <Text style={{ ...FONTS.h3, textAlign: 'right', fontWeight: '700',flex:1 ,paddingHorizontal:SIZES.padding*1.5 }}>
                                    {(new Date(item.end_date)).toLocaleDateString()}
                                </Text>
                            </View>
                        </TouchableOpacity>
                        {item.expand && (<View style={{...styles.shadow, backgroundColor: COLORS.white, paddingVertical: SIZES.padding, borderRadius: 20,flexDirection:'row',marginTop:10}} >
                            
                            <TouchableOpacity
                                style={{
                                    ...styles.shadow,
                                    backgroundColor: COLORS.primary,
                                    paddingVertical:SIZES.padding*1.5,
                                    marginVertical: SIZES.padding,
                                    marginHorizontal: SIZES.padding,
                                    maxWidth:100,
                                    maxHeight:100,
                                    borderRadius: 25,
                                    flex:1
                                }}
                                onPress={() => {
                                    postPermissionApprove(item.id);
                                }}
                            >
                            <Text style={{...styles.inputContainer,textAlign: 'center',alignSelf: 'stretch',color:'white'}}>Approve</Text>

                            </TouchableOpacity>
                            <TouchableOpacity
                                style={{
                                    ...styles.shadow,
                                    backgroundColor: COLORS.primary,
                                    paddingVertical:SIZES.padding*1.5,
                                    marginVertical: SIZES.padding,
                                    marginHorizontal: SIZES.padding,
                                    maxWidth:100,
                                    maxHeight:100,
                                    borderRadius: 25,
                                    flex:1,
                                   
                                }}
                                onPress={() => {
                                    postPermissionReject(item.id);
                                }}
                            >
                            <Text style={{...styles.inputContainer,textAlign: 'center',alignSelf: 'stretch',color:'white'}}>Reject</Text>

                            </TouchableOpacity>
                            
                        </View>)}
                    </View>
                    )
                    
            })
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            <View>
                {/* render loop  */}
                <Text>
                </Text>
            </View>
            <ScrollView>
                {leavePermissions ? renderPermissionList() : <Text>you dont have any leave request for this period</Text>}
            </ScrollView>
            <TouchableOpacity
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
            </TouchableOpacity>
        </SafeAreaView>
    )
}

export default LeavePermissions;