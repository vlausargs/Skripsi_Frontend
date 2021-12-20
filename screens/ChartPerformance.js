import React, { Component } from "react";
import { 
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Dimensions
} from "react-native";

import * as authAction from '../actions/authActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { COLORS, SIZES, FONTS, icons, images } from "../constants";
import { SafeAreaView } from "react-native";
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
  } from "react-native-chart-kit";

export const mapStateToProps = state => ({
    token: state.authReducer.token,
    users: state.authReducer.users,
    companyQuestion: state.authReducer.companyQuestion,
    listEmployee: state.authReducer.listEmployee,
  });
  
  export const mapDispatchToProps = dispatch => ({
    actionsAuth: bindActionCreators(authAction, dispatch),
  }); 

class ChartPerformance extends Component{
    constructor(props) {
        super(props)

        this.state = {

        }

      }

    render(){
        return (
            <SafeAreaView style={{flex: 1}}>
                <View>
  <Text>Bar Chart</Text>
  <BarChart
    data={{
      labels: ["January", "February", "March", "April", "May", "June"],
      datasets: [
        {
          data: [
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100,
            Math.random() * 100
          ]
        }
      ]
    }}
    width={Dimensions.get("window").width} // from react-native
    height={220}
    yAxisLabel="$"
    yAxisSuffix="k"
    yAxisInterval={1} // optional, defaults to 1
    chartConfig={{
      backgroundColor: "#e26a00",
      backgroundGradientFrom: "#fb8c00",
      backgroundGradientTo: "#ffa726",
      decimalPlaces: 2, // optional, defaults to 2dp
      color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
      style: {
        borderRadius: 16
      },
      propsForDots: {
        r: "6",
        strokeWidth: "2",
        stroke: "#ffa726"
      }
    }}
    bezier
    style={{
      marginVertical: 8,
      borderRadius: 16
    }}
  />
</View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: COLORS.lightGray4
    }
  });

export default connect(mapStateToProps, mapDispatchToProps)(ChartPerformance);