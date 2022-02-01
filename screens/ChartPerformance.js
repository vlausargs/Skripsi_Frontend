import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';

import * as authAction from '../actions/authActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {COLORS, SIZES, FONTS, icons, images} from '../constants';
import {SafeAreaView} from 'react-native';
import {
  BarChart,
} from 'react-native-chart-kit';
import { Picker } from '@react-native-picker/picker';

export const mapStateToProps = state => ({
  token: state.authReducer.token,
  employeeScore: state.authReducer.employeeScore,
  users: state.authReducer.users,
  listEmployeeCompany: state.authReducer.listEmployeeCompany,
});

export const mapDispatchToProps = dispatch => ({
  actionsAuth: bindActionCreators(authAction, dispatch),
});

class ChartPerformance extends Component {
  constructor(props) {
    super(props);

    this.state = {
      init:true,
    };
  }

  componentDidMount() {
    this.mounted = true;
    // if(this.props.users.role === 1){
    //   this.props.actionsAuth.getEmployeeScore_admin(this.props.token,this.state.employee);
    // }else{
      // this.props.actionsAuth.getEmployeeScore(this.props.token);
    // }
    // this.props.employeeScore= undefined
    if(this.state.init == true){
      this.props.actionsAuth.clearEmployeeScore();
      this.props.actionsAuth.clearUserInfo();
      this.props.actionsAuth.getEmployeeByCompany(this.props.token);
      this.props.actionsAuth.getUserInfo(this.props.token);
      this.state.init = false;
    } 
  }

  componentDidUpdate(prevProps) {
    if (prevProps.users.role != this.props.users.role){
      if(this.props.users.role === 1 ){
          this.props.actionsAuth.getEmployeeScore_admin(this.props.token,this.state.employee);
        }else{
          this.props.actionsAuth.getEmployeeScore(this.props.token);
        }
        
    }
  }
  renderHeader() {
    return (
        <View style={{flexDirection:'row',height:50}}>
            <TouchableOpacity 
            style={{
                
                paddingLeft:SIZES.padding*2,
                justifyContent:'center'
            }}>
                <Text style={{...FONTS.h2,fontWeight: 'bold'}}>
                    Performance Chart
                </Text>
            </TouchableOpacity>
        </View>
    )
}

checkMonthName =(month)=>{
  var monthName ;
    if(month == 1)  monthName = "Jan"
    else if(month == 2) monthName = "Feb" 
    else if(month == 3) monthName = "Mar"
    else if(month == 4) monthName = "Apr"
    else if(month == 5) monthName = "May"
    else if(month == 6) monthName = "Jun"
    else if(month == 7) monthName = "Jul"
    else if(month == 8) monthName = "Aug"
    else if(month == 9) monthName = "Sept"
    else if(month == 10) monthName = "Oct"
    else if(month == 11) monthName = "Nov"
    else if(month == 12) monthName = "Dec"
    
    return monthName;
}
  calc_avg = ()=>{
    const array = this.props.employeeScore.map(item => {return item.score;});
    if (array.length >0)
    return (array.reduce((a, b) => a + b) / array.length).toFixed(2);
     
  }
  render() {
    var months = this.props.employeeScore.month
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={{ ...styles.shadow, backgroundColor: COLORS.white, paddingBottom: SIZES.padding }}>
          {this.renderHeader()}

        </View>
        <View>
        {this.props.users.role === 1 &&(<Picker
                        selectedValue={this.state.employee}
                        style={{
                            marginVertical: SIZES.padding,
                            marginHorizontal: SIZES.padding,
                            textAlign: 'center',
                            alignSelf: 'stretch',
                            backgroundColor: COLORS.white,
                          }}
                        onValueChange={(itemValue, itemIndex) =>{
                          this.setState({employee: itemValue})
                          this.props.actionsAuth.getEmployeeScore_admin(this.props.token,itemValue);
                        }
                        }>
                        <Picker.Item label="Select Employee" value=""  style={styles.panelText} />
                        {this.props.listEmployeeCompany.map((item, key) => {
                          return(
                        <Picker.Item label={item.user.name} value={item.id} key={item.id} />
                        )})}
                    </Picker>)}
          <BarChart
            data={{
              labels: this.props.employeeScore?this.props.employeeScore.map(item => {
                return this.checkMonthName(item.month);
              }):[],
              datasets: [
                {
                  data: this.props.employeeScore?this.props.employeeScore.map(item => {
                    return item.score;
                  }):[],
                  colors: 
                  this.props.employeeScore?this.props.employeeScore.map(item => {return item.score < 25?(opacity = 1) => `#FF322A`:item.score < 50?(opacity = 1) => `#ffdc2a`:(opacity = 1) => `#50ad4f`;
                  }):[],
                    
                },
              ],
            }}
            width={Dimensions.get('window').width+30} // from react-native
            height={220}
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              // backgroundGradientFrom: "#fff",
              // backgroundGradientTo: "#fff",
              // height:5000,
              // fillShadowGradient: `rgba(1, 122, 205, 1)`,
              // fillShadowGradientOpacity: 1,
              // decimalPlaces: 0, // optional, defaults to 2dp
              // color: (opacity = 1) => `rgba(1, 122, 205, 1)`,
              // labelColor: (opacity = 1) => `rgba(0, 0, 0, 1)`,
              barPercentage: this.props.employeeScore.length<3?.6:this.props.employeeScore.length<6?.5:.4,

              fillShadowGradientOpacity:1,
              backgroundColor: COLORS.black,
              backgroundGradientFrom: COLORS.primary,
              backgroundGradientTo: COLORS.primary,
              fillShadowGradient: `rgba(255, 255, 255, 255)`,
              
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `#FFFFFF`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, 255)`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: COLORS.white,
              },
            }}
            fromZero={true}
            withCustomBarColorFromData={true}
            flatColor={true}
            withInnerLines={true}
            showBarTops={false}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
              marginLeft:-30,
              paddingright:40
            }}
          />
          {this.props.employeeScore.length>0 &&(
            <View style={{margin:SIZES.padding}}>
              <Text style={{...FONTS.body3}}>Performa kerja {this.props.users.role === 2?this.props.users.name:''} {this.props.users.role === 1 && this.state.employee!=null &&  this.props.listEmployeeCompany.length>0 ?this.props.listEmployeeCompany.find(obj=>obj.id ==this.state.employee).user.name:''} tahun {new Date().getFullYear() } berdasarkan hasil penilaian dari atasan.</Text>
              <Text style={{...FONTS.body3,marginTop:10}}>Diperloeh nilai tertinggi {Math.max(...this.props.employeeScore.map(item => {return item.score;}))} dan nilai terendah {Math.min(...this.props.employeeScore.map(item => {return item.score;}))} dengan rata-rata {this.calc_avg()} selama {this.props.employeeScore.map(item => {return item.score;}).length} bulan dari batas minimum 50 
              </Text>
              <Text style={{...FONTS.body3,marginTop:10}}>{this.calc_avg() <25?"Perlu pengangan khusus, coaching & konseling.":this.calc_avg() <50?"Perlu pemantauan/bimbingan, coaching & mentoring.":"Siap development dengan penugasan/tanggung jawab lebih luas."} </Text>
            </View>
          )

          }
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightGray4,
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
        width: 0,
        height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 10,
},
});

export default connect(mapStateToProps, mapDispatchToProps)(ChartPerformance);
