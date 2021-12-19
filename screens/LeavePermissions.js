import AsyncStorage from "@react-native-community/async-storage";
import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Alert
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
                setLeavePermissions(json.permissions)
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
    function renderPermissionList() {
        console.log(leavePermissions.map((item, key) => { return item.permission_type }))

        return (
            leavePermissions.map((item, key) => {
                return (
                    <View style={{
                        ...styles.shadow, backgroundColor: COLORS.white, paddingVertical: SIZES.padding + 10, margin: 20, borderRadius: 20
                    }} key={key}>
                        <View style={{ marginVertical: 5 }}>
                            <Text style={{ ...FONTS.h3, textAlign: 'center', fontWeight: '700' }}>
                                {item.permission_type.leave_type} {(new Date(item.start_date)).toLocaleDateString()} {(new Date(item.end_date)).toLocaleDateString()}
                            </Text>
                        </View>
                    </View>)
            })
        )
    }
    function addLeavePermission() {

    }
    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            <View>
                {/* render loop  */}
                <Text>

                    list all Leave Permission approved or rejected  with create new button
                </Text>
            </View>
            {leavePermissions ? renderPermissionList() : <Text>you dont have any leave request for this period</Text>}
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