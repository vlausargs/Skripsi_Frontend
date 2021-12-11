import React, { useState, useEffect} from "react";
import AsyncStorage from '@react-native-community/async-storage'
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
import { ReactReduxContext } from "react-redux";
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


const Home = ({navigation})=>{
    const [ClockState, setClockState] = useState();
    const [DateState, setDateState] = useState();
    const [isLoading, setLoading] = useState(true);
    const [UserInfo, setData] = useState(null);
    const [token, setToken] = useState([]);

    async function  _getTokenValue(){
        var value = await AsyncStorage.getItem('token')
        return value
    }
    React.useEffect(()=>{
        _getTokenValue().then(token => {
            console.log('Bearer ' + token) 
            // token = null
            if (!token) {
                return Alert.alert(
                    "ERROR!!!",
                    "TOKEN EXPIRED",
                    [
                      { text: "OK", onPress: () => navigation.navigate('Login') }
                    ]
                  );
                
                
            } 
            fetch('http://f22a-118-99-110-241.ap.ngrok.io/api/user/getUser',{
                method: 'GET',
                headers:{
                    'Authorization': 'Bearer ' + token,
                    'Accept': 'application/json'
                }
            })
              .then((response) => response.json())
              .then((json) => {
                register(json.user)
                setData(json.user)
                
              })
              .catch((error) => console.error(error))
              .finally(() => setLoading(false));
        })
       
          
        let isMounted = true;
        setInterval(()=>{
            if(isMounted){
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
            } 
        })
        return () => { isMounted = false }
    },[]);

    function register(user){
        console.log('cek user',user)
        if(user.role === 1){
            navigation.navigate('RegisterCompany')
        }
       else if( user.role === 2){
        navigation.navigate('RegisterEmployee')
        }
    }
   
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
    function renderCompanyInfo() {
        return (
            <View style={{ marginTop:30}}>
                <Text style={{...FONTS.h3,textAlign:'center'}}>
                    Valos
                </Text>
                <Text style={{...FONTS.h3,textAlign:'center'}}>
                    Hacker - Google Indonesia
                </Text>
            </View>
        )
    }
    function renderCurrAttandanceInfo() {
        return (
            <View style={{...styles.shadow,backgroundColor:COLORS.white,paddingVertical:SIZES.padding, margin:20,borderRadius:20}}>
                <View style={{marginVertical:5}}>
                    <Text style={{...FONTS.h2,textAlign:'center',fontWeight: 'bold'}}>
                      Office Location
                    </Text>    
                 </View>
                <View style={{marginVertical:5}}> 
                    <Text style={{...FONTS.h2,textAlign:'center'}}>
                        Distance to Office:
                    </Text>
                </View>
                <View style={{marginVertical:5}}> 
                    <Text style={{...FONTS.body,textAlign:'center'}}>
                        10 M  (within range)
                    </Text>
                </View>
                <View style={{marginVertical:5}}> 
                    <Text style={{...FONTS.h2,textAlign:'center'}}>
                        Office Hour:
                    </Text>
                </View>
                <View style={{marginVertical:5}}> 
                    <Text style={{...FONTS.body,textAlign:'center'}}>
                        09:00 - 17:00
                    </Text>
                </View>
                <View style={{marginVertical:5}}> 
                    <TouchableOpacity 
                    style={{
                        
                        ...styles.shadow,backgroundColor:'#71BC68',
                        justifyContent:'center',
                        marginHorizontal:SIZES.padding*5,
                        paddingVertical:SIZES.padding/2,
                        borderRadius:20
                    }}>
                        <Text style={{...FONTS.h2,fontWeight: 'bold' ,textAlign:'center'}}>
                            Check In
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
    function renderActLog() {
        return (
            <View style={{flex:1,marginHorizontal:10}}>
                <Text style={{...FONTS.h4,textAlign:'left'}}>
                    Activity Log
                </Text>
                {/* loop activity log */}
                <View style={{
                    
                    paddingLeft:SIZES.padding*2,
                    paddingRight:SIZES.padding*2,
                    marginHorizontal:20,
                    justifyContent:'center', flexDirection:'row'
                }}>
                    <View style={{flex: 1}}>
                        <Text style={{...FONTS.h4,textAlign:'left'}}>
                            {ClockState}
                        </Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{...FONTS.h4,textAlign:'left'}}>
                            Check In
                        </Text>
                    </View>
                </View>
                <View style={{
                    
                    paddingLeft:SIZES.padding*2,
                    paddingRight:SIZES.padding*2,
                    marginHorizontal:20,
                    justifyContent:'center', flexDirection:'row'
                }}>
                    <View style={{flex: 1}}>
                        <Text style={{...FONTS.h4,textAlign:'left'}}>
                            {ClockState}
                        </Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{...FONTS.h4,textAlign:'left'}}>
                            Check Out
                        </Text>
                    </View>
                </View>
                <View style={{
                    
                    paddingLeft:SIZES.padding*2,
                    paddingRight:SIZES.padding*2,
                    marginHorizontal:20,
                    justifyContent:'center', flexDirection:'row'
                }}>
                    <View style={{flex: 1}}>
                        <Text style={{...FONTS.h4,textAlign:'left'}}>
                            {ClockState}
                        </Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{...FONTS.h4,textAlign:'left'}}>
                            Check In
                        </Text>
                    </View>
                </View>
                <View style={{
                    
                    paddingLeft:SIZES.padding*2,
                    paddingRight:SIZES.padding*2,
                    marginHorizontal:20,
                    justifyContent:'center', flexDirection:'row'
                }}>
                    <View style={{flex: 1}}>
                        <Text style={{...FONTS.h4,textAlign:'left'}}>
                            {ClockState}
                        </Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{...FONTS.h4,textAlign:'left'}}>
                            Check Out
                        </Text>
                    </View>
                </View>
                <View style={{
                    
                    paddingLeft:SIZES.padding*2,
                    paddingRight:SIZES.padding*2,
                    marginHorizontal:20,
                    justifyContent:'center', flexDirection:'row'
                }}>
                    <View style={{flex: 1}}>
                        <Text style={{...FONTS.h4,textAlign:'left'}}>
                            {ClockState}
                        </Text>
                    </View>
                    <View style={{flex: 1}}>
                        <Text style={{...FONTS.h4,textAlign:'left'}}>
                            Check In
                        </Text>
                    </View>
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
          {renderCompanyInfo()}
          {renderCurrAttandanceInfo()}
          {renderActLog()}
      </SafeAreaView>
    )
}


export default Home;