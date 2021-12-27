import React, { useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    TextInput,
    ScrollView
} from "react-native";
import Icon from 'react-native-vector-icons/dist/FontAwesome';

import { api_path, COLORS, FONTS, icons, SIZES } from "../constants";
import { Alert } from "react-native";
import { Image, Input } from "react-native-elements";
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
export default function CreateMeeting({ navigation }) {
    const [currToken, setToken] = useState(null);
    const [meetingType, setMeetingType] = useState([]);
    const [mode, setMode] = useState('date');
    const [isInitData, setisInitData] = useState(true);
    const [showDate, setShowDate] = useState({ start: false, end: false });
    const [userInput, setUserInput] = useState({ 'date': new Date(), 'time': new Date() });
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

    function getMeetingType() {
        fetch(api_path + '/api/meetingType/getMeetingType', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                'Accept': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                setMeetingType(json.result)

            })
            .catch((error) => console.error(error))
            .finally(() => { });
    }

    function postPermission() {
        fetch(api_path + '/api/meeting/create', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "meeting_type_id": userInput.meeting_type_id,
                "title": userInput.title,
                "place": userInput.place,
                "description": userInput.description,
                "link": userInput.link,
                "date_time": userInput.date.toLocaleDateString() + 'T' + userInput.time.toLocaleTimeString(),
            })
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                if (json.alert == "success") navigation.goBack();
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
            getMeetingType();
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
        setUserInput({ ...userInput, 'meeting_type_id': value })
    }
    function renderForm() {
        return (
            <ScrollView style={{ ...styles.shadow, backgroundColor: COLORS.white, paddingBottom: SIZES.padding, marginVertical: SIZES.padding, flex: 1 }}>
                <View style={{ marginTop: SIZES.padding, marginHorizontal: SIZES.padding }}>
                    <Text style={{ ...FONTS.h3, fontWeight: 'bold' }}>
                        Types
                    </Text>
                    <View>
                        <Picker
                            selectedValue={userInput.meeting_type_id}
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
                            {meetingType && meetingType.map((item, key) => {
                                return (
                                    <Picker.Item label={item.name} color="black" value={item.id} style={styles.inputContainer} key={key} />
                                )
                            })}

                            {/* <Picker.Item label="Employee" color="blue" value="employee" style={styles.inputContainer} /> */}
                        </Picker>
                        {/* dropdown leave type */}
                    </View>
                    <Text style={{ ...FONTS.h3, fontWeight: 'bold' }}>
                        Title
                    </Text>
                    <View>
                        <Input
                            placeholder='Title'
                            inputStyle={{ textAlign: 'center' }}
                            placeholderTextColor={COLORS.black}
                            inputContainerStyle={styles.inputContainer}
                            disableFullscreenUI={true}
                            autoCapitalize='none'
                            onChangeText={(val) => setUserInput({ ...userInput, title: val })}
                            value={userInput.title}
                        ></Input>
                        {/* dropdown leave type */}
                    </View>
                    <Text style={{ ...FONTS.h3, fontWeight: 'bold' }}>
                        Date Time
                    </Text>
                    <View>
                        <TouchableOpacity
                            style={{
                                ...styles.shadow,
                                backgroundColor: COLORS.white,
                                padding: SIZES.padding * 1.5,
                                marginVertical: SIZES.padding,
                                marginHorizontal: SIZES.padding
                            }}
                            onPress={() => {
                                setShowDate({ ...showDate, start: true })
                            }}
                        >
                            <Text style={styles.inputContainer}>{userInput.date.toLocaleDateString()}T{userInput.time.toLocaleTimeString()}</Text>

                        </TouchableOpacity>

                        {showDate.start && (<DateTimePicker
                            testID="startDate"
                            value={userInput.date}
                            mode={mode}
                            display="default"
                            onChange={(e, selectedValue) => {
                                setShowDate({ ...showDate, start: Platform.OS === 'ios' })
                                if (mode == 'date') {
                                    const currentDate = selectedValue || new Date();
                                    setUserInput({ ...userInput, date: currentDate });
                                    setMode('time');
                                    setShowDate({ ...showDate, start: Platform.OS !== 'ios' }) // to show time
                                } else {
                                    const selectedTime = selectedValue || new Date();
                                    setUserInput({ ...userInput, time: selectedTime });
                                    setShowDate({ ...showDate, start: Platform.OS === 'ios' }) // to hide back the picker
                                    setMode('date'); // defaulting to date for next open
                                }
                                // setUserInput({...userInput,date_time:selectedValue||userInput.date_time})
                                // setShowDate({...showDate,start:false})
                            }}
                        />)}
                        {/* dropdown leave type */}
                    </View>
                    <Text style={{ ...FONTS.h3, fontWeight: 'bold' }}>
                        Place
                    </Text>
                    <View>
                        <Input
                            placeholder='Place'
                            inputStyle={{ textAlign: 'center' }}
                            placeholderTextColor={COLORS.black}
                            inputContainerStyle={styles.inputContainer}
                            disableFullscreenUI={true}
                            autoCapitalize='none'
                            onChangeText={(val) => setUserInput({ ...userInput, place: val })}
                            value={userInput.place}
                        ></Input>
                        {/* dropdown leave type */}
                    </View>
                    <View>
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
                            }}
                            onPress={() => {
                                postPermission();
                            }}
                        >
                            <Text style={{ ...styles.inputContainer, textAlign: 'center', alignSelf: 'stretch', color: 'white' }}>Submit</Text>

                        </TouchableOpacity>
                        {/* dropdown leave type */}
                    </View>
                </View>
            </ScrollView>
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
