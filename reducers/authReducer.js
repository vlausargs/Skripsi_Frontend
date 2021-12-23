import * as t from '../actions/actionTypes/authTypes';
import { Actions } from 'react-native-router-flux';

let initialState = { 
    isLoggedIn: false,

    token: null,

    userReceived: false,
    companyReceived: false,
    positionReceived: false,
    meetingReceived: false,
    meetingTypeReceived: false,
    companyQuestionReceived: false,
    listEmployeeReceived: false,
    employeeScoreReceived: false,

    users: [],
    company:[],
    position:[],
    meeting:[],
    meetingType:[],
    companyQuestion:[],
    listEmployee:[],
    employeeScore:[],
};

/**
 * Updates store's state based on actionTypes
 * @param {Object} state: initial/current state of the reducer 
 * @param {Object} action: simple object containing actionType and update on states
 */
export default function authReducer(state = initialState, action) {
    switch (action.type) {
        case t.LOGGED_IN:
            return Object.assign({}, state, { isLoggedIn: true, token: action.token });
        case t.LOGGED_OUT:
            return Object.assign({}, state, initialState);
        case t.RECEIVE_USER:
            return Object.assign({}, state, { userReceived: true, users: action.users });
        case t.EMPTY_USER:
            return Object.assign({}, state, { userReceived: false, users:[] });
        case t.RECEIVE_COMPANY:
            return Object.assign({}, state, { companyReceived: true, company: action.company });
        case t.EMPTY_COMPANY:
            return Object.assign({}, state, { companyReceived: false, company:[] });
        case t.RECEIVE_POSITION:
            return Object.assign({}, state, { positionReceived: true, position: action.position });
        case t.EMPTY_POSITION:
            return Object.assign({}, state, { positionReceived: false, position:[] });
        case t.RECEIVE_MEETING:
            return Object.assign({}, state, { meetingReceived: true, meeting: action.meeting });
        case t.EMPTY_MEETING:
            return Object.assign({}, state, { meetingReceived: false, meeting:[] });
        case t.RECEIVE_MEETINGTYPE:
            return Object.assign({}, state, { meetingTypeReceived: true, meetingType: action.meetingType });
        case t.EMPTY_MEETINGTYPE:
            return Object.assign({}, state, { meetingTypeReceived: false, meetingType:[] });
        case t.RECEIVE_COMPANYQUESTION:
            return Object.assign({}, state, { companyQuestionReceived: true, companyQuestion: action.companyQuestion });
        case t.EMPTY_COMPANYQUESTION:
            return Object.assign({}, state, { companyQuestionReceived: false, companyQuestion:[] });
        case t.RECEIVE_LISTEMPLOYEE:
            return Object.assign({}, state, { listEmployeeReceived: true, listEmployee: action.listEmployee });
        case t.EMPTY_LISTEMPLOYEE:
            return Object.assign({}, state, { listEmployeeReceived: false, listEmployee:[] });
        case t.RECEIVE_EMPLOYEESCORE:
            return Object.assign({}, state, { employeeScoreReceived: true, employeeScore: action.employeeScore });
        case t.EMPTY_EMPLOYEESCORE:
            return Object.assign({}, state, { employeeScoreReceived: false, employeeScore:[] });
        default:
            return state;
    }
}
