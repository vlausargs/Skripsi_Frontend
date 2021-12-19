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

import { api_path, COLORS, FONTS, SIZES } from "../constants";
import { Alert } from "react-native";
export default function CreateLeavePermisson() {
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

    return (
        <View>
            create leave permission
        </View>
    )
}
