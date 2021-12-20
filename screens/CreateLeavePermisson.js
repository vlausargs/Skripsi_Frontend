import React, { useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView
} from "react-native";
import Icon from 'react-native-vector-icons/dist/FontAwesome';

import { api_path, COLORS, FONTS, icons, SIZES } from "../constants";
import { Alert } from "react-native";
import { Image } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";



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
    inputContainer: {
        ...FONTS.h4,
    }
})
export default function CreateLeavePermisson({ navigation }) {
    const [currToken, setToken] = useState(null);
    const [permissionRule, setPermissionRule] = useState([]);
    const [isInitData, setisInitData] = useState(true);
    const [showDate, setShowDate] = useState({ start: false, end: false });
    const [userInput, setUserInput] = useState({
        'permission_type_id': null,
        'start_date': new Date(),
        'end_date': new Date(),
    });
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
                                index: 1,
                                routes: [
                                    {
                                        name: 'Settings',
                                        params: { someParam: 'Param1' },
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
                console.log(json)
                setPermissionRule(json.result)

            })
            .catch((error) => console.error(error))
            .finally(() => {  });
    }

    function postPermissionRule() {
        fetch(api_path + '/api/permission/create', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body:JSON.stringify({
                "permission_type_id":userInput.permission_type_id,
                "start_date":userInput.start_date.toLocaleDateString(),
                "end_date":userInput.end_date.toLocaleDateString()
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                if(json.alert =="success")navigation.goBack();
            })
            .catch((error) => console.error(error))
            .finally(() => {  });
    }

    React.useEffect(() => {
        if (isInitData == true) {
            checkToken();
        }
    }, [isInitData]);

    React.useEffect(() => {
        if (isInitData == true && currToken) {
            getPermissionRule();
        }
    }, [isInitData, currToken]);

    function renderHeader() {
        return (
            <View style={{ ...styles.shadow, backgroundColor: COLORS.white, paddingBottom: SIZES.padding }}>

                <View style={{ flexDirection: 'row', height: 50 }}>
                    <TouchableOpacity
                        style={{

                            paddingLeft: SIZES.padding * 2,
                            paddingTop: SIZES.padding,
                            justifyContent: 'center'

                        }}
                        onPress={() => {
                            navigation.goBack();
                        }}
                    >
                        <Image
                            source={icons.back}
                            resizeMode="contain"
                            style={{
                                width: 25,
                                height: 25,
                                tintColor: COLORS.primary
                            }}
                        />

                    </TouchableOpacity>
                    <View style={{

                        paddingLeft: SIZES.padding * 2,
                        justifyContent: 'center'
                    }}>
                        <Text style={{ ...FONTS.h2, fontWeight: 'bold' }}>
                            Create Leave Permission
                        </Text>
                    </View>
                </View>
            </View>

        )
    }
    function changeType(value) {
        console.log(userInput)
        setUserInput({ ...userInput, 'permission_type_id': value })
    }
    function renderForm() {
        return (
            <View style={{ ...styles.shadow, backgroundColor: COLORS.white, paddingBottom: SIZES.padding, marginVertical: SIZES.padding, flex: 1 }}>
                <View style={{ marginTop: SIZES.padding, marginHorizontal: SIZES.padding }}>
                    <Text style={{ ...FONTS.h3, fontWeight: 'bold' }}>
                        Types
                    </Text>
                    <View>
                        <Picker
                            selectedValue={userInput.permission_type_id}
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
                            onValueChange={(itemValue, itemIndex) => changeType(itemValue)}
                        >
                            <Picker.Item label="PLEASE CHOOSE ONE" color="black" value="" style={styles.inputContainer} />
                            {permissionRule.map((item, key) => {
                                return (
                                    <Picker.Item label={item.leave_type + " (" + item.left_permission + " days)"} color="black" value={item.id} style={styles.inputContainer} key={key} />
                                )
                            })}

                            {/* <Picker.Item label="Employee" color="blue" value="employee" style={styles.inputContainer} /> */}
                        </Picker>
                        {/* dropdown leave type */}
                    </View>
                    <Text style={{ ...FONTS.h3, fontWeight: 'bold' }}>
                        Start Date
                    </Text>
                    <View>
                        <TouchableOpacity
                            style={{
                                ...styles.shadow,
                                 backgroundColor: COLORS.white,
                                 padding:SIZES.padding*1.5,
                                marginVertical: SIZES.padding,
                                marginHorizontal: SIZES.padding
                            }}
                            onPress={() => {
                                setShowDate({...showDate,start:true})
                            }}
                        >
                           <Text style={styles.inputContainer}>{userInput.start_date.toLocaleDateString()}</Text>

                        </TouchableOpacity>
                        {showDate.start &&(<DateTimePicker
                            testID="startDate"
                            value={userInput.start_date}
                            mode="date"
                            display="default"
                            on
                            onChange={(e,selectedValue)=>{
                                setUserInput({...userInput,start_date:selectedValue||userInput.start_date})
                                setShowDate({...showDate,start:false})
                            }}
                        />)}
                        {/* dropdown leave type */}
                    </View>
                    <Text style={{ ...FONTS.h3, fontWeight: 'bold' }}>
                        End Date
                    </Text>
                    <View>
                    <TouchableOpacity
                            style={{
                                ...styles.shadow,
                                 backgroundColor: COLORS.white,
                                padding:SIZES.padding*1.5,
                                marginVertical: SIZES.padding,
                                marginHorizontal: SIZES.padding
                            }}
                            onPress={() => {
                                setShowDate({...showDate,end:true})
                            }}
                        >
                           <Text style={styles.inputContainer}>{userInput.end_date.toLocaleDateString()}</Text>

                        </TouchableOpacity>
                      
                        {showDate.end &&(<DateTimePicker
                            testID="endDate"
                            value={userInput.end_date}
                            mode="date"
                            display="default"
                            onChange={(e,selectedValue)=>{
                                setUserInput({...userInput,end_date:selectedValue||userInput.end_date})
                                setShowDate({...showDate,end:false})
                            }}
                        />)}
                        {/* dropdown leave type */}
                    </View>
                    <View>
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
                            }}
                            onPress={() => {
                                postPermissionRule();
                            }}
                        >
                           <Text style={{...styles.inputContainer,textAlign: 'center',alignSelf: 'stretch',color:'white'}}>Submit</Text>

                        </TouchableOpacity>
                        {/* dropdown leave type */}
                    </View>
                </View>
            </View>
        )
    }
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
                {renderHeader()}
                {renderForm()}

            </View>
        </SafeAreaView>
    )
}
