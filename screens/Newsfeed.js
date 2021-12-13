import React, { useState } from "react";
import { 
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    SafeAreaView
} from "react-native";

import { COLORS,SIZES,FONTS } from "../constants";
import NewsfeedItemList from "./components/NewsfeedList";
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

const Newsfeed = ()=>{
    const [newsfeed, setNewsfeed] = useState([]);
    React.useEffect(()=>{
        let isMounted = true; 
        if(isMounted){
            setNewsfeed([
                {
                    id:1,
                    name:"spv",
                    news:"besok libur"
                },
                {
                    id:2,
                    name:"boss",
                    news:"lusa lembur"
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
                        SCHEDULE
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

     /* renderSeperator = () => {
        return(<View 
            style={{
                height: 1,
                width: '80%',
                backgroundColor: COLORS.black
            }}
        />);
        
    };*/

    return (
        <SafeAreaView style={styles.container}>
            {header()}
            <FlatList
                data={newsfeed}
                //ItemSeparatorComponent = {this.renderSeperator}
                renderItem={({ item }) => <NewsfeedItemList newsfeed={item} />}
                keyExtractor={(item) => item.id}
                
            />
        </SafeAreaView>
    )
}

export default Newsfeed;