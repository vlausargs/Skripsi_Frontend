import React, { useState, useEffect } from "react";
import { 
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView,
    TouchableOpacity
} from "react-native";
import AsyncStorage from '@react-native-community/async-storage'
import { ScrollView } from "react-native-gesture-handler";
import { COLORS, SIZES, FONTS, icons, images, api_path } from "../constants";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.lightGray4
    },
    panel:{
      marginHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.white,
      elevation: 5,
      shadowOpacity: 0.2,
      shadowOffset: {
          height: 1,
          width: 1
      }
  },
  panel2:{
      borderRadius: 5,
      marginRight: 20,    
      marginHorizontal: 20,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: COLORS.white,
      elevation: 5,
      shadowOpacity: 0.2,
      shadowOffset: {
          height: 1,
          width: 1
      }
  },
  panelText: {
      flex: 0.37,
      marginVertical: 5,
      marginLeft: 5
  },
  panelText2: {
    marginVertical: 5,
    marginLeft: 5,
    flex: 1
},
  panelRow: {
      flexDirection: 'row',
      alignItems: 'center',
  },
  header:{
    backgroundColor:COLORS.white, 
    paddingHorizontal:SIZES.padding*2,
    flexDirection:'row',
    height:60
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

  });

const Profile = ({navigation})=>{

    const [isInitData, setisInitData] = useState(true);
    const [isLoading, setLoading] = useState(true);
    const [userInfo, setUser] = useState(null);
    const [currToken, setToken] = useState(null);

    const controller = new AbortController();

    React.useEffect(() => {
        if (isInitData == true) {
            checkToken();

        }
        return controller.abort();
    }, [isInitData]);

    React.useEffect(() => {
        if (isInitData == true && currToken) {
            getCurrUser();
        }
        return controller.abort();
    }, [isInitData, currToken]);
    React.useEffect(() => {
        if (isInitData == true && userInfo) {
            setisInitData(false);
        }
          
    }, [isInitData, userInfo]);

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
                            index: 0,
                            routes: [
                                {
                                    name: 'Login',
                                    params: { messages: 'TOKEN EXPIRED' },
                                },
                            ],
                        }) }
                    ]
                );


            }
            setToken(token)
        })
    }

    function renderHeader() {
        if (!userInfo) return;
        if (userInfo.role === 1){
            return (
                <View style={{ flexDirection: 'row', height: 50 }}>
                    <TouchableOpacity
                        style={{
                            paddingLeft: SIZES.padding * 2,
                            justifyContent: 'center'
                        }}>
                        <Text style={{ ...FONTS.h2, fontWeight: 'bold' }}>
                            Menu (Admin)
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }
        else if (userInfo.role === 2){
            return (
                <View style={{ flexDirection: 'row', height: 50 }}>
                    <TouchableOpacity
                        style={{
    
                            paddingLeft: SIZES.padding * 2,
                            justifyContent: 'center'
                        }}>
                        <Text style={{ ...FONTS.h2, fontWeight: 'bold' }}>
                            Menu (Employee)
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }

    function getCurrUser() {
        fetch(api_path + '/api/user/getUser', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + currToken,
                'Accept': 'application/json'
            }
        })
            .then((response) => response.json())
            .then((json) => {
                // console.log(json)
                setUser(json.user)

            })
            .catch((error) => console.error(error))
            .finally(() => setLoading(false));
    }

    function renderPanel(){
        return userInfo &&(
            <View style={styles.panel}>
                <View style={{flex: 1}}>
                    <View style={styles.panelRow}>
                        <Text style={styles.panelText}>{userInfo?userInfo.name:""}</Text>
                    </View>
                    <View style={styles.panelRow}>
                        <Text style={styles.panelText}>Division</Text> 
                    </View>
                    <View style={styles.panelRow}>
                        <Text style={styles.panelText}>Company</Text>
                    </View>
                    <View style={styles.panelRow}>
                        <Text style={styles.panelText}>Status</Text>
                    </View>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            {renderHeader()}
            {renderPanel()}
            <ScrollView >
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-evenly', marginVertical: 20}}>
                <TouchableOpacity onPress={() => navigation.navigate("Survey")}> 
                    <Image source={images.SurveyButton} style={{resizeMode:'contain', width:150, height: 150}}/>
                </TouchableOpacity>
                {/* <TouchableOpacity style={{marginVertical: 5}} onPress={() => navigation.navigate('LeavePermissions')}> 
                    <View style={styles.panel2}>
                        <View style={styles.panelRow}>
                            <Text style={styles.panelText2}>Leave Permission</Text>
                            <Image source={icons.arrow} resizeMode="contain" />
                        </View>
                    </View>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => navigation.navigate("ChartPerformance")}> 
                    <Image source={images.ReviewButton} style={{resizeMode:'contain', width:150, height: 150}}/>
                </TouchableOpacity>
            </View>
            <View style={{flex:1, flexDirection:'row', justifyContent:'space-evenly'}}>
                <TouchableOpacity onPress={() => navigation.navigate("LeavePermissions")}> 
                    <Image source={images.LeaveButton} style={{resizeMode:'contain', width:150, height: 150}}/>
                </TouchableOpacity>
                {userInfo && userInfo.role === 1 ? <TouchableOpacity onPress={() => navigation.navigate("EditWorkFrom")}> 
                    <Image source={images.EmployeeListButton} style={{resizeMode:'contain', width:150, height: 150}}/>
                </TouchableOpacity> : <View />}
                
            </View>
            </ScrollView>
            
            
            
            
           
        </SafeAreaView>
    )
}

export default Profile;