import { combineReducers } from 'redux';

import authReducer from "../reducers/authReducer"

// Combine all the reducers
const rootReducer = combineReducers({ authReducer });

export default rootReducer;
