import React, { useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    Linking
} from "react-native";
import Icon from 'react-native-vector-icons/dist/FontAwesome';

import { api_path, COLORS, FONTS, icons, SIZES } from "../constants";
import { Alert } from "react-native";
import { Image } from "react-native-elements";
import { Picker } from "@react-native-picker/picker";
import DocumentPicker from 'react-native-document-picker';

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
    const [singleFile, setSingleFile] = useState(null);
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

    function postPermission() {
        // If file selected then create FormData
        if(userInput.permission_type_id == null){
            Alert.alert("Error","Leave Types cannot be empty")
            return 0;
        }
        const data = new FormData();
        if (singleFile != null) {
            const fileToUpload = singleFile[0];
            console.log(fileToUpload);
            data.append('image', fileToUpload);
        }
        data.append( "permission_type_id",userInput.permission_type_id)
        data.append( "start_date",userInput.start_date.toLocaleDateString())
        data.append( "end_date",userInput.end_date.toLocaleDateString())
        fetch(api_path + '/api/permission/create', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                'Content-Type': 'multipart/form-data;',
            },
            body:data
        })
            .then((response) => response.json())
            .then((json) => {
                console.log(json)
                if(json.alert =="success")navigation.goBack();
            })
            .catch((error) => {
                console.error(error)
                console.error(error.message)})
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
    async function selectFile(){
        // Opening Document Picker to select one file
        try {
          const res = await DocumentPicker.pick({
            // Provide which type of file you want user to pick
            type: [DocumentPicker.types.allFiles],
            // There can me more options as well
            // DocumentPicker.types.allFiles
            // DocumentPicker.types.images
            // DocumentPicker.types.plainText
            // DocumentPicker.types.audio
            // DocumentPicker.types.pdf
          });
          // Printing the log realted to the file
          console.log('res : ' + JSON.stringify(res));
          // Setting the state to show single file attributes
          setSingleFile(res);
        } catch (err) {
          setSingleFile(null);
          // Handling any exception (If any)
          if (DocumentPicker.isCancel(err)) {
            // If user canceled the document selection
            // alert('Canceled');
          } else {
            // For Unknown Error
            alert('Unknown Error: ' + JSON.stringify(err));
            throw err;
          }
        }
      };
    function changeType(value) {
        console.log(userInput)
        setUserInput({ ...userInput, 'permission_type_id': value })
    }
    function renderForm() {
        return (
            <View style={{ ...styles.shadow, backgroundColor: COLORS.white, paddingBottom: SIZES.padding, marginVertical: SIZES.padding, flex: 1 }}>
                <View style={{ marginTop: SIZES.padding, marginHorizontal: SIZES.padding }}>
                    
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
                                     Linking.openURL("https://kemenperin.go.id/kompetensi/UU_13_2003.pdf")
                                }}
                            >
                                <Text style={{ ...styles.inputContainer, textAlign: 'center', alignSelf: 'stretch', color: 'white' }}>View Regulation</Text>

                        </TouchableOpacity>
                    </View>
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
                                    <Picker.Item label={item.leave_type} color="black" value={item.id} style={styles.inputContainer} key={key} />
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
                        <Text style={{ ...FONTS.h3, fontWeight: 'bold' }}>
                            Attachment
                        </Text>
                        <TouchableOpacity
                            style={{
                                ...styles.shadow,
                                 backgroundColor: COLORS.white,
                                padding:SIZES.padding*1.5,
                                marginVertical: SIZES.padding,
                                marginHorizontal: SIZES.padding
                            }}
                            activeOpacity={0.5}
                            onPress={()=>{selectFile()}}>
                            <Text style={styles.inputContainer}> {singleFile?singleFile[0].name.length>30?singleFile[0].name.slice(0,29)+"...":singleFile[0].name:'Select File'}</Text>
                        </TouchableOpacity>
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
                            onPress={() => { Alert.alert(
                                "Confirmation",
                                "Are you sure want to request this permission?",
                                [
                                    {
                                    text: "Cancel",
                                    onPress: () => console.log("Cancel Pressed"),
                                    style: "cancel"
                                    },
                                    { text: "OK", onPress: () =>  { postPermission() }}
                                ]
                                ); }}
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
