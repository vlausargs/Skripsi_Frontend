import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Alert,
  Switch,
  Linking,
  SafeAreaView,
  Image,
  ScrollView,
  RefreshControl
} from 'react-native';
import * as authAction from '../actions/authActions';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
//import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import {DataTable} from 'react-native-paper';
import Accordion from 'react-native-collapsible/Accordion';

import { COLORS, SIZES, FONTS, icons, api_path } from '../constants';

import moment from "moment";
import BiometricPopup from "./components/Auth//Biometric/BiometricPopup"
import Icon from 'react-native-vector-icons/dist/FontAwesome';

export const mapStateToProps = state => ({
  token: state.authReducer.token,
  users: state.authReducer.users,
  meeting: state.authReducer.meeting,
  meetingAtt: state.authReducer.meetingAtt,
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
      activeSection: [],
      refreshing: false,
      modalVisible: false,
      biometricActive:false,
      curr_section:null,
    };
    this.refresh = this.refresh.bind(this);
  }


  componentDidMount() {
    this.mounted = true;
    this.props.actionsAuth.getUserInfo(this.props.token);
    this.props.actionsAuth.getMeetingList(this.props.token);
    this.setState({ refreshing: false })
  }

  toggleSwitch = value => {
    this.setState({ toggled: value });
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
    if (this.props.users.role === 1) {
      return (
        <View style={{ ...styles.shadow,flexDirection: 'row',paddingVertical:SIZES.padding*1.5,backgroundColor:COLORS.white  }}>
          <TouchableOpacity
            style={{
              paddingLeft: SIZES.padding * 2,
              justifyContent: 'center',
            }}>
            <Text style={{...FONTS.h2, fontWeight: 'bold'}}>Meeting (ADMIN)</Text>
          </TouchableOpacity>
        </View>
      );
    }
    else if (this.props.users.role === 2) {
      return (
        <View style={{ ...styles.shadow,flexDirection: 'row',paddingVertical:SIZES.padding*1.5,backgroundColor:COLORS.white  }}>
          <TouchableOpacity
            style={{
              paddingLeft: SIZES.padding * 2,
              justifyContent: 'center',
            }}>
            <Text style={{...FONTS.h2, fontWeight: 'bold'}}>Meeting (EMPLOYEE)</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }
  _renderSectionTitle = (section) => {
    return (
      <View>
        <Text style={[styles.headerText, { color: COLORS.primary, fontWeight: 'bold' }]}>{section.date_time}</Text>
      </View>
    );
  };

  _renderHeader = (section) => {
    return (
      <View style={{ ...styles.content, backgroundColor: COLORS.p2_sandy_brown }}>
        <Text style={styles.headerText2}>{moment(section.date_time + 'Z').local().format('ddd DD/MM/YY (HH:mm)')}</Text>
        <Text style={styles.headerText}>{section.title}</Text>
      </View>
    );
  };

  _renderContent = (section) => {
    return (
      <View style={{ ...styles.content, backgroundColor: COLORS.white }}>
        <Text style={styles.panelText}>Place: {section.place}</Text>
        <Text style={styles.panelText}>Desc: {section.description}</Text>
          <View style={{flexDirection:'row', alignSelf:'center'}}>
            {section.link === null ? <Text style={[styles.panelText, { color: COLORS.primary }]} onPress={() => {
              this.setState({biometricActive:true,curr_section:section});
            }
            }>ATTEND</Text> : <Text style={[styles.panelText, { color: COLORS.primary }]} onPress={() => {
              this.setState({biometricActive:true,curr_section:section});
            }
            }>LINK</Text> }
            
            <Text style={[styles.panelText, { color: COLORS.primary }]} onPress={() => this.openModal(section)}>Attendees</Text>
            {this.props.users.role === 1 &&( <Text style={[styles.panelText, { color: COLORS.primary }]} onPress={() => this.deleteMeeting(section)}>Delete</Text>)}
          </View>
      </View>
    );
  };
  _logAttandance(id) {
    console.log(JSON.stringify({
      "meeting_id": id,
      "attendace_time": (new Date()).toLocaleString()
    }))
    fetch(api_path + '/api/meetingAttandance/create', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + this.props.token,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        "meeting_id": id,
        "attendance_time": (new Date()).toISOString()
      })
    })
      .then((response) => response.json())
      .then((json) => {
        console.log(json)
        // if (json.alert == "success") setisInitData(true)
      })
      .catch((error) => console.error(error))
      .finally(() => { });

  }
  _updateSections = (activeSection) => {
    this.setState({ activeSection });
  };

refresh() {
     this.setState({refreshing: true})
     this.props.actionsAuth.getMeetingList(this.props.token).then(() => {
       this.setState({refreshing: false})
     })
}

deleteMeeting(item){
  this.props.actionsAuth.deleteMeeting(this.props.token, item.id, (message) => {
    alert(message)
});
}

openModal (item) {
  this.setState({ modalVisible: true });
  this.props.actionsAuth.getMeetAttendaceList(this.props.token, item.id);
}
  render() {
    const { modalVisible } = this.state;
    let markedDay = {};
    this.props.meeting.map(item => {
      markedDay[item.date_time] = {
        selected: true,
        marked: true,
        selectedColor: 'purple',
      };
    });
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView refreshControl={
        <RefreshControl refreshing={this.state.refreshing} onRefresh={() => this.refresh()} />
      }>
        
        {this.renderHeader()}
        {this.state.toggled ? (
          <View
          />
        ) : (
          <Accordion
            sections={this.props.meeting}
            activeSections={this.state.activeSection}
            // renderSectionTitle={this._renderSectionTitle}
            renderHeader={this._renderHeader}
            renderContent={this._renderContent}
            onChange={this._updateSections}
          />
        )}
        <Modal  animationType="slide"
                transparent={true}
                visible={modalVisible}>
                  <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                    <DataTable>
                      <DataTable.Header>
                        <DataTable.Title>Name</DataTable.Title>
                        <DataTable.Title>Attendance Time</DataTable.Title>
                        </DataTable.Header>
                        {this.props.meetingAtt.map((item, key) => (
                            <DataTable.Row key={key}>
                            <DataTable.Cell>{item.user.name}</DataTable.Cell>
                              <DataTable.Cell>{moment(item.attendance_time).format('HH:MM:SS')}</DataTable.Cell>
                            </DataTable.Row>
                        ))}
                    </DataTable>
                    <Text style={{ color: COLORS.primary, marginTop: 20 }} 
                          onPress={() => this.setState({modalVisible: false})}>Close</Text>
                    </View>
                  </View>
                  
        </Modal>

        {this.state.biometricActive == true && (<BiometricPopup onAuthenticate={() => {
          // console.log(this.state.curr_section)
          this._logAttandance(this.state.curr_section.id)
          Linking.openURL(this.state.curr_section.link)
            this.setState({biometricActive:false,curr_section:null})
          }} onCancel={()=>{this.setState({biometricActive:false,destUrl:null})}}></BiometricPopup>)}
          
      </ScrollView>
      {this.props.users.role === 1 && (<TouchableOpacity
                style={{
                    borderWidth: 1,
                    borderColor: 'rgba(0,0,0,0.2)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 50,
                    position: 'absolute',
                    bottom: 10,
                    right: 10,
                    height: 50,
                    backgroundColor: '#fff',
                    borderRadius: 100,
                }}
                onPress={() => { this.props.navigation.navigate('CreateMeeting') }}
            >
                <Icon name='plus' size={30} color='#000000' />
            </TouchableOpacity>)}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
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
  container: {
    flex: 1,
    
    backgroundColor: COLORS.lightGray4,
    marginBottom: 40
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
  content: {
    paddingVertical: SIZES.padding,
    marginHorizontal: 20,
    backgroundColor: COLORS.lightGray,
    elevation: 3,
    shadowOpacity: 0.1,
    shadowOffset: {
      height: 1,
      width: 1
    },
    justifyContent: 'space-evenly',
    borderRadius: 10,
    marginTop: SIZES.padding,
    marginBottom: SIZES.padding
  },
  headerText: {
    ...FONTS.h3,
    fontWeight: 'bold',
    paddingHorizontal: SIZES.padding
  },
  headerText2: {
    ...FONTS.body3,
    fontWeight: 'bold',
    paddingHorizontal: SIZES.padding
  },
  panelText: {
    ...FONTS.body2,
    paddingHorizontal: SIZES.padding
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Meeting);
