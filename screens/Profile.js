import React from "react";
import { 
    View,
    Text,
    StyleSheet,
    Image,
    SafeAreaView,
    TouchableOpacity
} from "react-native";
import { COLORS, SIZES, FONTS, icons } from "../constants";

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

const Profile = ()=>{
    function header() {
        return (
            <View style={{...styles.shadow, ...styles.header}}>
                <TouchableOpacity 
                style={{
                    paddingLeft:SIZES.padding*2,
                    justifyContent:'center'
                }}>
                    <Text style={{...FONTS.h2,fontWeight: 'bold'}}>
                        Profile
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

    function renderPanel(){
        return(
            <View style={styles.panel}>
                <View style={{flex: 1}}>
                    <View style={styles.panelRow}>
                        <Text style={styles.panelText}>Name</Text>
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
            {header()}
            <View style={{marginTop: 20}}>
                {renderPanel()}
            </View>
            
            <View style={{marginVertical: 30}}>
                <TouchableOpacity style={{marginVertical: 5}}> 
                    <View style={styles.panel2}>
                        <View style={styles.panelRow}>
                            <Text style={styles.panelText2}>Attendance Information</Text>
                            <Image source={icons.arrow} resizeMode="contain" />
                        </View>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity style={{marginVertical: 5}}> 
                    <View style={styles.panel2}>
                        <View style={styles.panelRow}>
                            <Text style={styles.panelText2}>Leave Permission</Text>
                            <Image source={icons.arrow} resizeMode="contain" />
                        </View>
                    </View>
                </TouchableOpacity>
            </View>
            <View style={{ marginVertical: 50}}> 
                    <TouchableOpacity style={{     
                        backgroundColor: COLORS.red,
                        justifyContent:'center',
                        marginHorizontal:SIZES.padding * 10,
                        paddingVertical:SIZES.padding/2,
                        borderRadius:20
                    }}>
                        <Text style={{...FONTS.h3,fontWeight: 'bold' ,textAlign:'center'}}>
                            Logout
                        </Text>
                    </TouchableOpacity>
                </View>
           
        </SafeAreaView>
    )
}

export default Profile;