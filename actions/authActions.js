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
                resultCB(json)
            })
            .catch((error) => {         
                resultCB(error)
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
                dispatch({ type: t.RECEIVE_USER, users: json.user });
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
                dispatch({ type: t.RECEIVE_COMPANY, company: json.company });
            })
            .catch((error) => {
                dispatch({ type: t.EMPTY_COMPANY });     
            })
    }
}

export function registerCompany(token, company, lat,long, start_working_hour, end_working_hour, resultCB) {

    var endpoint = "/api/company/store";
    
    let header = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json",
        'Content-Type': 'application/json' 
    };

    let body = {
        "name": company,
        "lat": lat,
        "long":long,
        "start_working_hour": start_working_hour.toLocaleTimeString().substring(0, start_working_hour.toLocaleTimeString().length - 3),
        "end_working_hour": end_working_hour.toLocaleTimeString().substring(0, end_working_hour.toLocaleTimeString().length - 3)
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                console.log(json)
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

export function registerEmployee(token, nik, company, position, resultCB) {

    var endpoint = "/api/employee/store";
    
    let header = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json",
        'Content-Type': 'application/json' 
    };

    let body = {
        "nik": nik,
        "company_id": company,
        "position_id": position,
    };

    return dispatch => {
        return fetchAPI(endpoint, 'POST', header, JSON.stringify(body))
            .then((json) => {
                console.log(json.message,'cek reg')
                resultCB(json.message)
            })
            .catch((error) => {  
                console.log(error.message,'cek err reg')       
                resultCB(error.message)
            })
    }
}


export function sumbitMeeting(token, id, title, date_time, meeting_type, place, description, link, resultCB) {

    var endpoint = "/api/meeting/create";
    
    let header = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json",
        'Content-Type': 'application/json'
        
    };

    let body = {
        "id": id,
        "title": title,
        "date_time": date_time,
        "meeting_type": meeting_type,
        "place": place,
        "decription": description,
        "link": link
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

export function getMeetingList (token) {
    var endpoint = "/api/meeting/getMeetingList";

    let header = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header)
            .then((json) => {          
                dispatch({ type: t.RECEIVE_MEETING, meeting: json.meeting });
            })
            .catch((error) => {
                dispatch({ type: t.EMPTY_MEETING });    
            })
    }
}

export function attendaceCreate(token, status, lati,long, resultCB) {

    var endpoint = "/api/attendance/create";
    
    let header = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json",
        'Content-Type': 'application/json' 
    };

    let body = {
        "status": status,
        "lang": lati,
        "long": long
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
export function getMeetingType (token) {
    var endpoint = "/api/meetingType/getMeetingType";

    let header = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header)
            .then((json) => {          
                dispatch({ type: t.RECEIVE_MEETINGTYPE, meetingType: json.meeting_type });
            })
            .catch((error) => {
                dispatch({ type: t.EMPTY_MEETINGTYPE });    
            })
    }
}

export function getCompanyQuestion (token) {
    var endpoint = "/api/companyQuestion/getCompanyQuestion";

    let header = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header)
            .then((json) => {          
                dispatch({ type: t.RECEIVE_COMPANYQUESTION, companyQuestion: json.companyQuestion });
            })
            .catch((error) => {
                dispatch({ type: t.EMPTY_COMPANYQUESTION });    
            })
    }
}

export function getListEmployee (token) {
    var endpoint = "/api/companyQuestion/scoreCompanyQuestion/getUnscoredEmployee";

    let header = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header)
            .then((json) => {          
                dispatch({ type: t.RECEIVE_LISTEMPLOYEE, listEmployee: json.employee });
            })
            .catch((error) => {
                dispatch({ type: t.EMPTY_LISTEMPLOYEE });    
            })
    }
}

export function scoreEmployee(token, employee_id, month, score, resultCB) {

    var endpoint = "/api/companyQuestion/scoreCompanyQuestion/store";
    
    let header = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json",
        'Content-Type': 'application/json' 
    };

    let body = {
        "employee_id": employee_id,
        "month": month,
        "score": score
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

export function getEmployeeScore (token) {
    var endpoint = "/api/companyQuestion/scoreCompanyQuestion/getEmployeeScore";

    let header = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header)
            .then((json) => {          
                dispatch({ type: t.RECEIVE_EMPLOYEESCORE, employeeScore: json.data });
            })
            .catch((error) => {
                dispatch({ type: t.EMPTY_EMPLOYEESCORE});    
            })
    }
}

export function editWorkFrom(token, employee_id, work_from, resultCB) {

    var endpoint = "/api/employee/editWorkFromUser";
    
    let header = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json",
        'Content-Type': 'application/json' 
    };

    let body = {
        "employee_id": employee_id,
        "work_from": work_from
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

export function getEmployeeByCompany (token) {
    var endpoint = "/api/employee/getAllByCompany";

    let header = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header)
            .then((json) => {          
                dispatch({ type: t.RECEIVE_LISTEMPLOYEECOMPANY, listEmployeeCompany: json.employees });
            })
            .catch((error) => {
                dispatch({ type: t.EMPTY_LISTEMPLOYEECOMPANY });    
            })
    }
}

export function getMeetAttendaceList (token, meeting_id) {
    var endpoint = "/api/meetingAttandance/getAttandaceList/" + meeting_id;

    let header = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json"
    };

    return dispatch => {
        return fetchAPI(endpoint, 'GET', header)
            .then((json) => {          
                dispatch({ type: t.RECEIVE_MEETINGATT, meetingAtt: json.meeting_absents });
                console.log(json.meeting_absents)
            })
            .catch((error) => {
                dispatch({ type: t.EMPTY_MEETINGATT });   
            })
    }
}

export function deleteMeeting(token, id, resultCB) {

    var endpoint = "/api/meeting/delete";
    
    let header = {
        "Authorization": "Bearer " + token,
        "Accept": "application/json",
        'Content-Type': 'application/json' 
    };

    let body = {
        "id": id
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