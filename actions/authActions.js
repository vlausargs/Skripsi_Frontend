import { Alert } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage'
var stringify = require('qs-stringify');

import * as t from './actionTypes/authTypes';
import { fetchAPI } from '../utils/fetch';
import errors from '../json/errors.json';



export function checkToken(finishCB) {
    return dispatch => {
       return  AsyncStorage.getItem("token").then((value) => {
           if (!value) {
               finishCB(null);

           }else{
               dispatch({ type: t.LOGGED_IN, token: value});
               finishCB(value);
           }
        });
    }
}
export function login(email, password, finishCB) {

    var endpoint = "/api/login";
    
    let header = {
        "Accept": "application/json",
        'Content-Type': 'application/json', 
        'User-Agent' : 'PostmanRuntime/7.26.3'
    };

    let body = {
        "email": email,
        "password": password
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
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

export function register(name, email, password, password_confirmation, role, resultCB) {

    var endpoint = "/api/register";
    
    let header = {
        "Accept": "application/json",
        'Content-Type': 'application/json' 
    };

    let body = {
        "name": name,
        "email": email,
        "password": password,
        "password_confirmation": password_confirmation,
        "role": role

    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                resultCB(json.message)
            })
            .catch((error) => {         
                resultCB(error.message)
            })
    }
}

export function getUserInfo (token) {
    var endpoint = "/api/user/getUser";

    let header = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header)
            .then((json) => {          
                dispatch({ type: t.RECEIVE_USER, users: { id: json.data.user.id, name: json.user.name, email: json.user.email, 
                    role: json.user.role
                } });
            })
            .catch((error) => {
                    dispatch({ type: t.EMPTY_USER });     
            })
    }
}

export function getCompanyList (token) {
    var endpoint = "/api/company/getCompanyList";

    let header = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header)
            .then((json) => {          
                dispatch({ type: t.RECEIVE_COMPANY, company: json.datas });
            })
            .catch((error) => {
                    dispatch({ type: t.EMPTY_COMPANY });     
            })
    }
}

export function registerCompany(company, country, address, start_working_hour, end_working_hour, resultCB) {

    var endpoint = "/api/register";
    
    let header = {
        "Accept": "application/json",
        'Content-Type': 'application/json' 
    };

    let body = {
        "company": company,
        "country": country,
        "address": address,
        "start_working_hour": start_working_hour,
        "end_working_hour": end_working_hour
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                resultCB(json.message)
            })
            .catch((error) => {         
                resultCB(error.message)
            })
    }
}

export function getPositionList (token) {
    var endpoint = "/api/position/getPositionList";

    let header = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header)
            .then((json) => {          
                dispatch({ type: t.RECEIVE_POSITION, position: json.position });
            })
            .catch((error) => {
                    dispatch({ type: t.EMPTY_POSITION });     
            })
    }
}
