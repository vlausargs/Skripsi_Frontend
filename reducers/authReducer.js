import * as t from '../actions/actionTypes/authTypes';
import { Actions } from 'react-native-router-flux';

let initialState = { 
    isLoggedIn: false,

    token: null,
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
        default:
            return state;
    }
}
