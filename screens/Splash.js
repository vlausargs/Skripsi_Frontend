import React from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    Dimensions,
    StyleSheet,
    StatusBar,
    Image,
    ImageBackground
} from 'react-native';


import { COLORS, SIZES, FONTS, icons, images } from "../constants";

const Splash = ({navigation}) => {

    return (
      <ImageBackground source={images.Background} style={styles.container}>
        <View style={styles.buttonRow}>
            <TouchableOpacity onPress={()=>navigation.navigate('Login')}
                style={styles.buttons}>
                    <Text style={{...FONTS.h3,fontWeight: 'bold' ,textAlign:'center', color: COLORS.white}}>
                        Login
                    </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>navigation.navigate('Register')}
                style={styles.buttons}>
                    <Text style={{...FONTS.h3,fontWeight: 'bold' ,textAlign:'center', color: COLORS.white}}>
                        Register
                    </Text>
            </TouchableOpacity>
        </View>
      </ImageBackground>
    );
};

export default Splash;

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  buttonRow:{
      justifyContent:'center',
      flexDirection:'row',
  },
  buttons:{
    backgroundColor: COLORS.primary,
    justifyContent:'center' ,
    borderRadius: 20,
    width: 130,
    height: 40,
    marginHorizontal: SIZES.padding * 2
  }
});