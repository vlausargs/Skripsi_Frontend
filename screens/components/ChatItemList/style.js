import { StyleSheet } from 'react-native';
import { COLORS,SIZES,FONTS } from "../../../constants";
const styles= StyleSheet.create({
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
    container: {
        backgroundColor:COLORS.white, 
        paddingHorizontal:SIZES.padding*2,
        margin:SIZES.padding,
        height:60, 
        justifyContent:'center',
        flexDirection: 'row',
        width: "100%",
        justifyContent: 'space-between',
        padding: 10,
    },
    header:{
        backgroundColor:COLORS.white, 
        paddingHorizontal:SIZES.padding*2,
        flexDirection:'row',
        height:60
    }
})

export default styles;