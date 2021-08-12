import React, { useState } from "react";
import { 
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    FlatList
} from "react-native";

import { COLORS,SIZES,FONTS } from "../constants";
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


const Home = ()=>{
    const [ClockState, setClockState] = useState();
    const [DateState, setDateState] = useState();
    React.useEffect(()=>{
        setInterval(()=>{
            const date = new Date();
            Date.prototype.toShortFormat = function() {

                let monthNames =["Jan","Feb","Mar","Apr",
                                  "May","Jun","Jul","Aug",
                                  "Sep", "Oct","Nov","Dec"];
                
                let day = this.getDate();
                
                let monthIndex = this.getMonth();
                let monthName = monthNames[monthIndex];
                
                let year = this.getFullYear();
                
                return `${day} ${monthName} ${year}`;  
            }
            setClockState(date.toLocaleTimeString());
            setDateState(date.toShortFormat())
        })
    },[]);
   
    function renderHeader() {
        return (
            <View style={{flexDirection:'row',height:50}}>
                <TouchableOpacity 
                style={{
                    
                    paddingLeft:SIZES.padding*2,
                    justifyContent:'center'
                }}>
                    <Text style={{...FONTS.h2,fontWeight: 'bold'}}>
                        Attandance
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
    function renderTodayDateTime() {
   
  
    
        return (
            <View style={{
                
                paddingLeft:SIZES.padding*2,
                paddingRight:SIZES.padding*2,
                justifyContent:'center', flexDirection:'row'
            }}>
                <View style={{flex: 1}}>
                    <Text style={{...FONTS.h3,textAlign:'left'}}>
                        {DateState}
                    </Text>
                </View>
                <View style={{flex: 1}}>
                    <Text style={{...FONTS.h3,textAlign:'right'}}>
                        {ClockState}
                    </Text>
                </View>
            </View>
        )
    }
    
    return (
      <SafeAreaView style={styles.container}>
          <View style={{...styles.shadow,backgroundColor:COLORS.white, paddingBottom:SIZES.padding}}>
            {renderHeader()}
            {renderTodayDateTime() }

          </View>
      </SafeAreaView>
    )
}


export default Home;