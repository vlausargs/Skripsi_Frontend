import React from 'react'
import { 
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    Alert,
} from "react-native";
import { COLORS,SIZES,FONTS } from "../constants";
import Maps from './MapView'
export default function CheckInOut() {
    const styles= StyleSheet.create({
        container: {
            flex:1,
            backgroundColor: COLORS.lightGray4
        },
        shadow:{
            shadowColor: "#000",
            shadowOffset:{
                width:0,
                height:3,
            },
            shadowOpacity:0.1,
            shadowRadius:3,
            elevation:10,
        }
    })

    return (
        <SafeAreaView style={styles.container}>
            <View style={{backgroundColor:"#E15C5C",flex:1}}>
                <Maps></Maps>
            </View>
            <View style={{backgroundColor:"#E1ACAA",flex:1}}>
                {/* <Text>show brief user information ,check in/out, time, submit button, if fingerprint exist ask one</Text> */}
            </View>
            
        </SafeAreaView>
    )
}
