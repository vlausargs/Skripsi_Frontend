import React, { useState } from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity, 
    TextInput,
    Platform,
    StyleSheet ,
    StatusBar,
    Alert,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import BiometricPopup from "./components/Auth//Biometric/BiometricPopup"
import { useTheme } from 'react-native-paper';
// import { Input } from 'react-native-elements';
import { COLORS, SIZES, FONTS, icons, images } from "../constants";

import Wizard from './components/Register/Wizard'

const Register = ({navigation}) => {

   const [data, setData] = React.useState({
        steps: 1,
        type: '',
        company: '',
        check_textInputChange: false,
        secureTextEntry: true,
        isValidUser: true,
        isValidPassword: true,
    });
    const [user,setUser] = React.useState({
            name: '',
            email: '',
            username: '',
            password: '',
        });

    const [items, setItems] = useState([{label:'Owner', value:'owner'},{label:'Employee', value:'employee'}]);
    const [open, setOpen] = useState(false);
    const [value, setValue] = useState(null);
    const [showCompanyStartWH, setShowCompanyStartWH] = useState(false);
    const [showCompanyEndWH, setShowCompanyEndWH] = useState(false);
    return (
        <View style={styles.container}>
            <Wizard initialValues={{
                username: '',
                email:'',
                password:'',
                type:'',
                companyName: '',
                companyStartWH: new Date('2021-11-11T01:30'),
                companyEndWH: new Date('2021-11-11T10:30')
                }}>
                <Wizard.Step >
                    {({onChangeValue,values})=>
                        (
                            <View style={{flex:1,alignItems:'stretch',justifyContent:'center',}}>
                                <Text style={{
                                        ...FONTS.body3,
                                        // marginVertical:SIZES.padding,
                                        marginHorizontal:SIZES.padding,
                                        textAlign: 'center',
                                        alignSelf: 'stretch',
                                    }}
                                >
                                    Full Name
                                </Text> 
                                <TextInput
                                    placeholder= 'Name'
                                    style={styles.inputContainer}
                                    onChangeText={text=> onChangeValue('name',text)}  
                                    value={values.name}
                                />
                                <Text style={{
                                        ...FONTS.body3,
                                        // marginVertical:SIZES.padding,
                                        marginHorizontal:SIZES.padding,
                                        textAlign: 'center',
                                        alignSelf: 'stretch',
                                    }}
                                >
                                    Email
                                </Text> 
                                <TextInput
                                    placeholder= 'Email'
                                    style={styles.inputContainer}
                                    onChangeText={text=> onChangeValue('email',text)}  
                                    value={values.email}
                                />
                                <Text style={{
                                        ...FONTS.body3,
                                        // marginVertical:SIZES.padding,
                                        marginHorizontal:SIZES.padding,
                                        textAlign: 'center',
                                        alignSelf: 'stretch',
                                    }}
                                >
                                    Password
                                </Text> 
                                <TextInput
                                    placeholder= 'Password'
                                    style={styles.inputContainer}
                                    onChangeText={text=> onChangeValue('password',text)}  
                                    value={values.password}
                                />
                                <Text style={{
                                        ...FONTS.body3,
                                        // marginVertical:SIZES.padding,
                                        marginHorizontal:SIZES.padding,
                                        textAlign: 'center',
                                        alignSelf: 'stretch',
                                    }}
                                >
                                    Register As
                                </Text> 
                                <DropDownPicker
                                open={open}
                                value={value}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setItems}
                                items={items}
                                onChangeValue={(value) => {
                                    onChangeValue('type',value)
                                  }}
                                  style={{
                                    
                                    marginVertical:SIZES.padding,
                                    // marginHorizontal:SIZES.padding,
                                    textAlign: 'center',
                                    alignSelf: 'stretch',
                                    backgroundColor: COLORS.lightGray,
                                  
                                    
                                    }}
                                textStyle={{
                                    ...FONTS.body3,
                                }}
                                />
                                {/* <Picker
                                    selectedValue={values.type}
                                    itemStyle={{
                                        ...FONTS.body3,
                                        marginVertical:SIZES.padding,
                                        marginHorizontal:SIZES.padding,
                                        textAlign: 'center',
                                        alignSelf: 'stretch',
                                        backgroundColor: 'lightgrey',
                                        borderColor:COLORS.lightGray
                                    }}
                                    onValueChange={(itemValue, itemIndex) => onChangeValue('type',itemValue)}
                                > 
                                    <Picker.Item label="PLEASE CHOOSE ONE" color="blue" value="" style={styles.inputContainer}/>
                                    <Picker.Item label="Owner" color="blue" value="owner" style={styles.inputContainer}/>
                                    <Picker.Item label="Employee" color="blue" value="employee" style={styles.inputContainer} />
                                </Picker> */}
                            </View>
                        )
                    }
                </Wizard.Step>
                <Wizard.Step>
                    {({onChangeValue,values})=>values.type == 'employee'?(    
                            <View style={{flex:1,alignItems:'stretch',justifyContent:'center',}}>
                                    <Text style={{
                                            ...FONTS.body3,
                                            // marginVertical:SIZES.padding,
                                            marginHorizontal:SIZES.padding,
                                            textAlign: 'center',
                                            alignSelf: 'stretch',
                                        }}
                                    >
                                        Select Company
                                    </Text> 
                                    <TextInput
                                        placeholder= 'Company'
                                        style={styles.inputContainer}
                                        onChangeText={text=> onChangeValue('name',text)}  
                                        value={values.name}
                                    />
                            </View>
                        ):
                        (
                            <View style={{flex:1,alignItems:'stretch',justifyContent:'center',}}>
                            <Text style={{
                                    ...FONTS.body3,
                                    // marginVertical:SIZES.padding,
                                    marginHorizontal:SIZES.padding,
                                    textAlign: 'center',
                                    alignSelf: 'stretch',
                                }}
                            >
                                Company Name
                            </Text> 
                            <TextInput
                                placeholder= 'Company Name'
                                style={styles.inputContainer}
                                onChangeText={text=> onChangeValue('companyName',text)}  
                                value={values.companyName}
                            />
                            <Text style={{
                                    ...FONTS.body3,
                                    // marginVertical:SIZES.padding,
                                    marginHorizontal:SIZES.padding,
                                    textAlign: 'center',
                                    alignSelf: 'stretch',
                                }}
                            >
                                Start Working Hour
                            </Text>
                            <TouchableOpacity 
                                style={styles.inputContainer}
                                onPress={
                                    ()=>{
                                        setShowCompanyStartWH(true);
                                    }}
                            >
                                <Text
                                style={styles.inputContainer}
                                >{values.companyStartWH.toLocaleTimeString()}</Text>
                            </TouchableOpacity>
                  
                            {showCompanyStartWH && (<DateTimePicker
                            testID="dateTimePicker"
                            value={values.companyStartWH}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={
                                (event, selectedDate) => {
                                    const currentDate = selectedDate || values.companyStartWH;
                                    // setShow(Platform.OS === 'ios');
                                    onChangeValue('companyStartWH',currentDate);
                                    setShowCompanyStartWH(false);
                                  }
                                }
                            />) }
                            <Text style={{
                                    ...FONTS.body3,
                                    // marginVertical:SIZES.padding,
                                    marginHorizontal:SIZES.padding,
                                    textAlign: 'center',
                                    alignSelf: 'stretch',
                                }}
                            >
                                End Working Hour
                            </Text>
                            <TouchableOpacity 
                                style={styles.inputContainer}
                                onPress={
                                    ()=>{
                                        setShowCompanyEndWH(true);
                                    }}
                            >
                                <Text
                                style={styles.inputContainer}
                                >{values.companyEndWH.toLocaleTimeString()}</Text>
                            </TouchableOpacity>
                  
                            {showCompanyEndWH && (<DateTimePicker
                            testID="dateTimePicker"
                            value={values.companyEndWH}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={
                                (event, selectedDate) => {
                                    const currentDate = selectedDate || values.companyEndWH;
                                    // setShow(Platform.OS === 'ios');
                                    onChangeValue('companyEndWH',currentDate);
                                    setShowCompanyEndWH(false);
                                  }
                                }
                            />) }
                    </View>
                    )}
                </Wizard.Step>
                <Wizard.Step>
                    {()=>(
                        <View>
                            <Text>HELLO WORLD </Text>
                            <BiometricPopup onAuthenticate={()=>{console.log("sukses")}}></BiometricPopup> 
                        </View>
                    )}
                </Wizard.Step>
            </Wizard>
        </View>
    );
    
    
};

export default Register;

const styles = StyleSheet.create({
    container: {
      flex: 1,
    //   justifyContent: 'space-evenly',
      backgroundColor:COLORS.white
    },
    textInput: {
        alignItems:'center',
        justifyContent: 'center'
        // justifyContent: 'center'
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    Login: {
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        width:150
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color:COLORS.white
    },
    inputContainer:{
        ...FONTS.body3,
        marginVertical:SIZES.padding,
        marginHorizontal:SIZES.padding,
        textAlign: 'center',
        alignSelf: 'stretch',
        backgroundColor: COLORS.lightGray,
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