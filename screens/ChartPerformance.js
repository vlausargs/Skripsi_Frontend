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

    this.state = {};
  }

  componentDidMount() {
    this.mounted = true;
    // if(this.props.users.role === 1){
    //   this.props.actionsAuth.getEmployeeScore_admin(this.props.token,this.state.employee);
    // }else{
      // this.props.actionsAuth.getEmployeeScore(this.props.token);
    // }
    this.props.actionsAuth.getEmployeeByCompany(this.props.token);
    this.props.actionsAuth.getUserInfo(this.props.token)
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

  render() {
    var months = this.props.employeeScore.month
    return (
      <SafeAreaView style={{flex: 1}}>
        <View>
        {this.renderHeader()}
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
              labels: this.props.employeeScore.map(item => {
                return this.checkMonthName(item.month);
              }),
              datasets: [
                {
                  data: this.props.employeeScore.map(item => {
                    return item.score;
                  }),
                },
              ],
            }}
            width={Dimensions.get('window').width+30} // from react-native
            height={220}
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
              fillShadowGradientOpacity:1,
              backgroundColor: COLORS.black,
              backgroundGradientFrom: COLORS.primary,
              backgroundGradientTo: COLORS.primary,
              decimalPlaces: 0, // optional, defaults to 2dp
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              barPercentage: this.props.employeeScore.length<3?.6:this.props.employeeScore.length<6?.5:.4,
              style: {
                borderRadius: 16,
                
                
              },
              propsForDots: {
                r: '6',
                strokeWidth: '2',
                stroke: COLORS.white,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
              marginLeft:-30,
              paddingright:40
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.lightGray4,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ChartPerformance);
