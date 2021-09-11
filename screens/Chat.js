import React, { useState } from "react";
import { 
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    View,
    Text,
    FlatList,
} from "react-native";
import { Header } from "react-native/Libraries/NewAppScreen";
import { COLORS,SIZES,FONTS } from "../constants";
import ChatItemList from "./components/ChatItemList";
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
    },
    header:{
        backgroundColor:COLORS.white, 
        paddingHorizontal:SIZES.padding*2,
        flexDirection:'row',
        height:60
    }
})

const Chat = ()=>{
    const [chatRooms, setchatRooms] = useState([]);
    React.useEffect(()=>{
        let isMounted = true; 
        if(isMounted){
            setchatRooms([
                {
                    id:1,
                    name:"udin",
                    lastMessage:"hello"
                },
                {
                    id:2,
                    name:"mid",
                    lastMessage:"x"
                },
                {
                    id:3,
                    name:"top",
                    lastMessage:"y"
                },
                {
                    id:4,
                    name:"bot",
                    lastMessage:"z"
                }
            ])
        }
        return () => { isMounted = false }
    },[]);
    function header() {
        return (
            <View style={{...styles.shadow,...styles.header}}>
                <TouchableOpacity 
                style={{
                    paddingLeft:SIZES.padding*2,
                    justifyContent:'center'
                }}>
                    <Text style={{...FONTS.h2,fontWeight: 'bold'}}>
                        Chat
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {header()}
            <FlatList
                style={{width: '100%'}}
                data={chatRooms}
                renderItem={({ item }) => <ChatItemList chatRoom={item} />}

                keyExtractor={(item) => item.id}
            />
            
            
        </SafeAreaView>
    )
}

export default Chat;