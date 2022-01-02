import React, {useState} from 'react';
import { 
    View, 
    Text, 
    TouchableOpacity,
    Platform,
    StyleSheet, 
    Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import { Input } from 'react-native-elements';
import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import * as authAction from '../actions/authActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

export const mapStateToProps = state => ({
    token: state.authReducer.token,
    users: state.authReducer.users,
    company: state.authReducer.company,
});
  
//Maps actions from authActions to Login's props
export const mapDispatchToProps = (dispatch) => ({
    actionsAuth: bindActionCreators(authAction, dispatch)
});


class RegisterCompany extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          name: "",
          lat1: null,
          long1: null,
          startH: new Date(),
          endH: new Date(),
          mode: 'time',
          showStart: false,
          showEnd: false,
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.onGoBack = this.onGoBack.bind(this);
    }
    
    setStartH = (event, startH) => {
        startH = startH || this.state.startH;
    
        this.setState({
          showStart: Platform.OS === 'ios' ? true : false,
          startH,
        });
      }
      setEndH = (event, endH) => {
        endH = endH || this.state.endH;
    
        this.setState({
          showEnd: Platform.OS === 'ios' ? true : false,
          endH,
        });
      }

    showStart = mode => {
        this.setState({
          showStart: true,
          mode,
        });
      }

    showEnd = mode => {
        this.setState({
          showEnd: true,
          mode,
        });
      }
    
    endHPicker = () => {
        this.showEnd('time');
      }
    
    startHPicker = () => {
        this.showStart('time');
      }

    componentDidMount(){
        this.props.actionsAuth.getCompanyList(this.props.token)
        console.log(this.props.company,'cek company')
    }
      onSubmit(){
        this.props.actionsAuth.registerCompany(this.props.token, this.state.name, this.state.lat1,this.state.long1, 
            this.state.startH, this.state.endH, (message) => {
              if(message==='success'){
                Alert.alert(
                  "SUCCESS!!!",
                  "",
                  [
                      { text: "OK", onPress: () => this.props.navigation.reset({
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
                
              }else{
                Alert.alert("ERROR!!!","please retry",[{text: "OK"}])
              }  
              
              console.log(message)
            });
            console.log('cek lokasi',this.props.lat1, this.props.lat2)
      }
      onGoBack(data){
      this.setState({lat1:data.lat,long1:data.long});
    }
    render(){
        const { showStart, showEnd, startH, endH, mode } = this.state;
        return (
            <View style={styles.container}>
                <View style={{ marginTop: SIZES.padding, marginHorizontal: SIZES.padding }}>
                <Text style={{ ...FONTS.h4, fontWeight: 'bold' }}>Company</Text>
                <Input 
                          placeholder= 'Company'
                          inputStyle={{ textAlign: 'center' }}
                          placeholderTextColor={COLORS.black}
                          inputContainerStyle={styles.inputContainer}
                          disableFullscreenUI={true}
                          autoCapitalize = 'none'
                          onChangeText={(val) => this.setState({ name : val })}
                          value={this.state.name}           
                      /> 
              
                        <Text style={{ ...FONTS.h4, fontWeight: 'bold' }}>Address</Text>   
                        <TouchableOpacity style={{
                                 backgroundColor: COLORS.lightGray,
                                 padding:SIZES.padding*1.5,
                                marginVertical: SIZES.padding,
                                marginHorizontal: SIZES.padding
                            }}
                            onPress={() => this.props.navigation.navigate('MapRegisterView',{onGoBack:this.onGoBack})}>
                            <Text style={styles.inputContainer}>
                                {this.state.lat1} , {this.state.long1}
                            </Text>  
                        </TouchableOpacity>
                        <Text style={{ ...FONTS.h4, fontWeight: 'bold' }}>Start Working Hour</Text>
                        <TouchableOpacity style={{
                                 backgroundColor: COLORS.lightGray,
                                 padding:SIZES.padding*1.5,
                                marginVertical: SIZES.padding,
                                marginHorizontal: SIZES.padding
                            }}
                            onPress={this.startHPicker}>
                            <Text style={styles.inputContainer}>
                                {this.state.startH.toLocaleTimeString()}
                            </Text>  
                        </TouchableOpacity> 
                        <View>
                        {showStart && <DateTimePicker value={startH}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={this.setStartH} />
                        }
                    </View>
                    <Text style={{ ...FONTS.h4, fontWeight: 'bold' }}>End Working Hour</Text>
                        <TouchableOpacity style={{
                                 backgroundColor: COLORS.lightGray,
                                 padding:SIZES.padding*1.5,
                                marginVertical: SIZES.padding,
                                marginHorizontal: SIZES.padding
                            }}
                            onPress={this.endHPicker}>
                            <Text style={styles.inputContainer}>
                                {this.state.endH.toLocaleTimeString()}
                            </Text>  
                        </TouchableOpacity> 
                        <View>
                        {showEnd && <DateTimePicker value={endH}
                        mode={mode}
                        is24Hour={true}
                        display="default"
                        onChange={this.setEndH} />
                        }
                    </View>
                  <View style={styles.button}>
                      <TouchableOpacity style={styles.Login} onPress={this.onSubmit}>
                          <Text style={styles.textSign}>Submit</Text>
                      </TouchableOpacity>
                  </View>

                </View>
            </View>
          );  
}
}



export default connect(mapStateToProps, mapDispatchToProps)(RegisterCompany);

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor:COLORS.white,
      marginVertical: SIZES.padding,
        justifyContent: 'center'
    },
    button: {
        alignItems: 'center',
        marginTop: 50
    },
    Login: {
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        width:150,
        height: 30
    },
    textSign: {
        fontSize: 18,
        fontWeight: 'bold',
        color:COLORS.white
    },
    inputContainer:{
        alignSelf: 'center',
        backgroundColor: COLORS.lightGray,
        borderBottomWidth: 0,
        
    }
    
  });