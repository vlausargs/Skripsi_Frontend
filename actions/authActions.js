import { Alert, AsyncStorage } from 'react-native';
//import { AsyncStorage } from '@react-native-community/async-storage'
var stringify = require('qs-stringify');

import * as t from './actionTypes/authTypes';
import { fetchAPI } from '../utils/fetch';
import errors from '../json/errors.json';

export function login(email, password, finishCB) {

    var endpoint = "/api/login";
    
    let header = {
        "Accept": "application/json"
    };

    let body = {
        "email": email,
        "password": password
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, stringify(body))
            .then((json) => {
                AsyncStorage.setItem('token', json.token);
                dispatch({ type: t.LOGGED_IN, token: json.token});
                finishCB(json.token);
                console.log('tes token',json.token)
            })
            .catch((error) => {
                console.log('cek error',error)
                if (errors[error] === undefined)
                    Alert.alert(errors['Unknown Error'].name, errors['Unknown Error'].message);
                else if (errors[error].login !== undefined)
                    Alert.alert(errors[error].login[0], errors[error].login[1]);
                else
                    Alert.alert(errors[error].name, errors[error].message);
                finishCB(null);
            })
    }
}
