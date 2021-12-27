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

export const mapStateToProps = state => ({
  token: state.authReducer.token,
  employeeScore: state.authReducer.employeeScore,
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
    this.props.actionsAuth.getEmployeeScore(this.props.token);
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
    if(month == 1)  monthName = "January"
    else if(month == 2) monthName = "February" 
    else if(month == 3) monthName = "March"
    else if(month == 4) monthName = "April"
    else if(month == 5) monthName = "May"
    else if(month == 6) monthName = "June"
    else if(month == 7) monthName = "July"
    else if(month == 8) monthName = "August"
    else if(month == 9) monthName = "September"
    else if(month == 10) monthName = "October"
    else if(month == 11) monthName = "November"
    else if(month == 12) monthName = "December"
    
    return monthName;
}

  render() {
    var months = this.props.employeeScore.month
    return (
      <SafeAreaView style={{flex: 1}}>
        <View>
        {this.renderHeader()}
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
            width={Dimensions.get('window').width} // from react-native
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
