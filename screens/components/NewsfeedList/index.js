import React, {useEffect, useState} from 'react';
import { Text, View } from 'react-native';
import styles from "./style";
import { COLORS,SIZES,FONTS } from "../../../constants";

export type Newsfeed = {
    id: Integer;
    name: String;
    news: String;
}
export type NewsfeedListProps = {
    newsfeed: newsfeed;
}

const NewsfeedItemList = (props: NewsfeedItemListProps)=>{
    const { newsfeed } = props;
    React.useEffect(()=>{
        let isMounted = true; 
        if(isMounted){
            // do something
            console.log(newsfeed)
        }
        return () => { isMounted = false }
    },[]);
    return (
        <View style={{...styles.container}}>
            <Text style={{...FONTS.h4,fontWeight: 'bold'}}>
                {newsfeed.name}
            </Text>
            <Text>10:19</Text>
            <Text>
                {newsfeed.news}
            </Text>
        </View>
    )
}

export default NewsfeedItemList;
