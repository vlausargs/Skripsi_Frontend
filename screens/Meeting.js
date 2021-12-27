import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Switch,
  Linking,
} from 'react-native';
import * as authAction from '../actions/authActions';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {Calendar, CalendarList, Agenda} from 'react-native-calendars';
import DataTable, {COL_TYPES} from 'react-native-datatable-component';
import Accordion from 'react-native-collapsible/Accordion';

import {COLORS, SIZES, FONTS, icons} from '../constants';
import {Input} from 'react-native-elements';

export const mapStateToProps = state => ({
  token: state.authReducer.token,
  users: state.authReducer.users,
  meeting: state.authReducer.meeting,
});

export const mapDispatchToProps = dispatch => ({
  actionsAuth: bindActionCreators(authAction, dispatch),
});

class Meeting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      role: 1,
      toggled: false,
      data: [],
      activeSection:[]
    };
  }
  

  componentDidMount() {
    this.mounted = true;
    this.props.actionsAuth.getUserInfo(this.props.token);
    this.props.actionsAuth.getMeetingList(this.props.token);
    console.log(this.props.meeting, 'meeting');
  }

  toggleSwitch = value => {
    this.setState({toggled: value});
  };

  renderMeeting() {
    let panels = [];
    Object.keys(this.props.meeting).map((key, index) => {
      panels.push(
        <View key={index} style={styles.itemContainer}>
          <TouchableOpacity>
            <Text>{this.props.meeting.date_time}</Text>
            <Text>{this.props.meeting.title}</Text>
          </TouchableOpacity>
        </View>,
      );
    });
  }

  renderItems() {
    let items = [];
    this.props.meeting.map((key, index) => {
      items[this.props.meeting.date_time] = {
        name: this.props.meeting.title,
      };
    });
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
                    Meeting Schedule
                </Text>
            </TouchableOpacity>
        </View>
    )
}
  _renderSectionTitle = (section) => {
    return (
      <View>
        <Text style={[styles.headerText, {color:COLORS.primary, fontWeight:'bold'}]}>{section.date_time}</Text>
      </View>
    );
  };

  _renderHeader = (section) => {
    return (
      <View style={styles.content}>
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
    );
  };

  _renderContent = (section) => {
    return (
      <View style={styles.content}>
        <Text style={styles.panelText}>{section.place}</Text>
        <Text style={styles.panelText}>{section.description}</Text>
        <Text style={[ styles.panelText, {color:COLORS.primary}]}onPress={() => Linking.openURL(section.link)}>LINK</Text>
      </View>
    );
  };

  _updateSections = (activeSection) => {
    this.setState({ activeSection });
  };

  render() {
    let markedDay = {};
    this.props.meeting.map(item => {
      markedDay[item.date_time] = {
        selected: true,
        marked: true,
        selectedColor: 'purple',
      };
    });
    return (
      <View style={styles.container}>
        {this.renderHeader()}
        {this.props.users.role === 2 ? (
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.props.navigation.navigate('MeetingForm')}>
            <Image source={icons.add}/>
          </TouchableOpacity>
        ) : (
          <View />
        )}
        <Switch
          onValueChange={this.toggleSwitch}
          value={this.state.toggled}
          trackColor={{true: COLORS.primary, false: 'grey'}}
        />
        {this.state.toggled ? (
          <Agenda
            items={this.renderItems()}
            renderItem={this.renderMeeting()}
            renderEmptyDate={() => <View />}
            markedDates={this.props.meeting.date_time}
          />
        ) : (
          /*<FlatList
            data={this.props.meeting}
            renderItem={({item}) => (
              <View style={styles.tableContainer}>
                <Text style={styles.row}>{item.date_time}</Text>
                <Text style={styles.row}>{item.title}</Text>
                <Text style={styles.row}>{item.place}</Text>
                <Text style={styles.row}>{item.description}</Text>
                <Text
                  style={styles.row}
                  onPress={() => Linking.openURL(item.link)}>
                  {item.link}
                </Text>
                <TouchableOpacity>
                  <Text style={styles.row}>Open</Text>
                </TouchableOpacity>
              </View>
            )}
          />*/
          <Accordion
            sections={this.props.meeting}
            activeSections={this.state.activeSection}
            renderSectionTitle={this._renderSectionTitle}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            onChange={this._updateSections}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  tableTitleContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 1,
    backgroundColor: COLORS.primary,
  },
  tableContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    borderBottomWidth: 1,
  },
  row: {
    flex: 1,
    paddingHorizontal: 0.5,
    paddingVertical: 20,
  },
  button: {
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    width: 100,
    height: 30,
  },
  itemContainer: {
    backgroundColor: 'white',
    margin: 5,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  content:{
    height: 70,
    marginHorizontal: 20,
    backgroundColor: COLORS.lightGray,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowOffset: {
        height: 1,
        width: 1
    },
    justifyContent:'space-evenly'
},
headerText: {
  fontSize:SIZES.h2
},
panelText:{
  fontSize:SIZES.body2
}
});

export default connect(mapStateToProps, mapDispatchToProps)(Meeting);
