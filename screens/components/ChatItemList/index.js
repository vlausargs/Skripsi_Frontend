import React, {useEffect, useState} from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import styles from "./style";
import { COLORS,SIZES,FONTS } from "../../../constants";

export type ChatRoom = {
    id: Integer;
    name: String;
    lastMessage: String;
}
export type ChatItemListProps = {
    chatRoom: ChatRoom;
}

const ChatItemList = (props: ChatItemListProps)=>{
    const { chatRoom } = props;
    React.useEffect(()=>{
        let isMounted = true; 
        if(isMounted){
            // do something
            console.log(chatRoom)
        }
        return () => { isMounted = false }
    },[]);
    return (
   
        <TouchableOpacity  style={{...styles.shadow}}>
            <View style={{...styles.container}}>
                <Text style={{...FONTS.h4,fontWeight: 'bold'}}>
                    {chatRoom.name}
                </Text>
                <Text>10:19</Text>
                <Text>
                    {chatRoom.lastMessage}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

export default ChatItemList;
