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

  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View>
          <Text>Performance Chart</Text>
          <BarChart
            data={{
              labels: this.props.employeeScore.map(item => {
                return item.month;
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
              backgroundColor: COLORS.black,
              backgroundGradientFrom: COLORS.primary,
              backgroundGradientTo: COLORS.primary,
              decimalPlaces: 2, // optional, defaults to 2dp
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
