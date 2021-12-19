import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as authAction from '../actions/authActions';

import Splash from './Splash';
import Login from './Login'
import Register from './Register';
import Tabs from '../navigation/tabs';
import { Attandance, Chat, LeavePermissions, Newsfeed, Profile } from '.';
import SelectMap from './SelectMap';
import Maps from './MapView';
import RegisterCompany from './RegisterCompany';
import Meeting from './Meeting';
import MeetingForm from './MeetingForm';
import RegisterEmployee from './RegisterEmployee';
import Survey from './Survey';

export const mapDispatchToProps = (dispatch) => ({
    actionsAuth: bindActionCreators(authAction, dispatch)
  });

const RootStack = createStackNavigator();

const RootStackScreen = ({navigation}) => (
<RootStack.Navigator headerMode='none'>
        <RootStack.Screen name="Splash" component={Splash}/>
        <RootStack.Screen name="Login" component={Login}/>
        <RootStack.Screen name="Register" component={Register}/>
        <RootStack.Screen name="RegisterCompany" component={RegisterCompany}/>
        <RootStack.Screen name="RegisterEmployee" component={RegisterEmployee}/>
        <RootStack.Screen name="Meeting" component={Meeting}/>
        <RootStack.Screen name="MeetingForm" component={MeetingForm}/>
        <RootStack.Screen name="Survey" component={Survey}/>
                <RootStack.Screen name="Home" component={Tabs} /> 
                <RootStack.Screen name="Chat" component={Chat} />
                <RootStack.Screen name="LeavePermissions" component={LeavePermissions} />
                <RootStack.Screen name="Newsfeed" component={Newsfeed} />
                <RootStack.Screen name="Attandance" component={Attandance} />
                <RootStack.Screen name="Profile" component={Profile} />
                <RootStack.Screen name="SelectMap" component={SelectMap} />
                <RootStack.Screen name="MapView" component={Maps} />
    </RootStack.Navigator>
    
    
);

export default connect(null, mapDispatchToProps)(RootStackScreen);