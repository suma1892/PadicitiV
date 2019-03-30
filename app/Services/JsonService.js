import { Platform, AsyncStorage} from "react-native";
import {RealmQuery} from '../Utils'
import axios from 'axios'
import qs from 'qs'

const JSONPostFile = (action, params) => {
    url  = action
    let   FETCH_TIMEOUT = 180000;
    let formBody = [];
    for (let property in params) {
        let encodedKey = encodeURIComponent(property);
        let encodedValue = encodeURIComponent(params[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    console.log('URL ', url)
    console.log('BODY ', formBody)
    
    return new Promise(((resolve, reject) => {
        var timeout = setTimeout(() => {
            reject(new Error('Request timed out'));
        }, FETCH_TIMEOUT);

     return   fetch(url, {
            method: "POST",
            headers: {
                // 'Content-Type': 'application/json',
                'Content-Type':   'application/x-www-form-urlencoded; charset=UTF-8',
                'Cache'        : 'no-cache'
            },
          
            // credentials: 'same-origin',
            body: formBody,
        }).then((response) => {
            clearTimeout(timeout);
            if (response && response.status === 200) return response.json()
            else reject(new Error('Response error'))
        }).then((responseObject) => {
            resolve(responseObject)
        }).catch((err) => {
            reject(err)
        })
    }))
}

const JSONAxioPostFile = (action, params) => {
    console.log('URL ', action)
    console.log('BODY ', params)
    return axios({
        method: 'post',
        url: action,
        timeout: 180000, // Let's say you want to wait at least 4 mins
        data: qs.stringify(params),
        headers: {
            'Content-Type':   'application/x-www-form-urlencoded; charset=UTF-8',
            'Cache'        : 'no-cache'
        },
      });
}

const JSONGetFile = (action, params) => {
    let   FETCH_TIMEOUT = 180000;
    console.log('URL ', action)
    
    return new Promise(((resolve, reject) => {
        var timeout = setTimeout(() => {
            reject(new Error('Request timed out'));
        }, FETCH_TIMEOUT);

     return fetch(action, {
        method: "GET",
        headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
        },
     }).then((response) => {
            clearTimeout(timeout);
            if (response && response.status === 200) return response.json()
            else reject(new Error('Response error'))
        }).then((responseObject) => {
            resolve(responseObject)
        }).catch((err) => {
            reject(err)
        })
    }))
    
}

const JSONGetFilexxxx = (action, params) => {
    let   FETCH_TIMEOUT = 180000;
    console.log('URL ', action)
    
    return new Promise(((resolve, reject) => {
        var timeout = setTimeout(() => {
            reject(new Error('Request timed out'));
        }, FETCH_TIMEOUT);

     return fetch(action, {
        method: "GET",
        headers: {
            'Content-Type': 'text/plain;charset=UTF-8',
        },
     }).then((response) => {
            clearTimeout(timeout);
            if (response && response.status === 200) return response.json()
            else reject(new Error('Response error'))
        }).then((responseObject) => {
            resolve(responseObject)
        }).catch((err) => {
            reject(err)
        })
    }))
    
}


const JSONGetFile1 = (action, train_depart, pax_list, client_email) => {
    // constructor() {
        this.state = {
            dataSource         : null,
            client_email        : null,
            client_phone        : null
            
        }
    // }

    let listBooking=[]
    for (let x = 0;x< train_depart.lst.length;x++){
        let tamp = {eventId:train_depart.InvEvId,scheduleId:train_depart.lst[x].ScheduleId}
        listBooking.push(tamp)
    }
    // console.log("JSON pax list : "+JSON.stringify(pax_list))
    let trnType = train_depart.lst.length > 1 ? 'multiple-book' : 'single-book'
    // console.log("Email ooo : "+client_email)
    // console.lof
    let JsonBook = {      
            detailBooks: listBooking, 
            email: client_email,
            numPaxAdult:pax_list.Adult,
            numPaxChild:pax_list.Child,
            numPaxInfant:pax_list.Infant,
            trnType : trnType
        }
    console.log("JSON BOOK :"+JSON.stringify(JsonBook))
    console.log("Action aaa : "+action)
    return fetch(action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
            
            detailBooks: listBooking, 
            email: client_email,
            numPaxAdult:pax_list.Adult,
            numPaxChild:pax_list.Child,
            numPaxInfant:pax_list.Infant,
            trnType : trnType
        })
  })
  .then((response) => response.text())
  .then((responseJson) => {
    return responseJson
    this.setState({
    //   isLoading: false,
      dataSource: responseJson.Data,
    }, function(){

    });

  })
  .catch((error) =>{
    console.error(error);
  });
}


const JSONPost_ = (url, params) => {
    const options = {
        method  : 'POST',
        timeout : 90000,
        headers : { 'content-type': 'application/x-www-form-urlencoded' },
        data    : qs.stringify(params),
        url,
    };
    return axios(options)
}

const JSONGet_ = (url, params) => {
    console.log(url)
    console.log(params)
    const options = {
        method  : 'GET',
        timeout : 120000,
        headers : { 'content-type': 'application/x-www-form-urlencoded' },
        data    : qs.stringify(params),
        url,
    };

    console.log(axios(options))
    return axios(options)
}

export { JSONGetFile1, JSONPostFile, JSONGetFile, JSONPost_, JSONGet_, JSONAxioPostFile } 

