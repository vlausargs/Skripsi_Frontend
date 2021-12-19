import React, { useState } from "react";
import AsyncStorage from "@react-native-community/async-storage";
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
export default function CreateLeavePermisson({ navigation }) {
    const [currToken, setToken] = useState(null);
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
                        { text: "OK", onPress: () => navigation.reset({
                            index: 1,
                            routes: [
                              {
                                name: 'Settings',
                                params: { someParam: 'Param1' },
                              },
                            ],
                          }) }
                    ]
                );


            }
            setToken(token)
        })
    }

    React.useEffect(() => {
        if (isInitData == true) {
            checkToken();
        }
    }, [isInitData]);
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
                        onPress={()=>{
                            navigation.goBack();
                        }}
                        >
                        <Image
                            source={icons.back}
                            resizeMode="contain"
                            style={{
                                width: 25,
                                height: 25,
                                tintColor:  COLORS.primary 
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
    return (
        <View>
            {renderHeader()}
            <Text>
                create leave permission
            </Text>
        </View>
    )
}
