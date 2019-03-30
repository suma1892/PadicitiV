import { Dimensions, AsyncStorage } from 'react-native'
import {STRING} from '../Utils'
import moment from 'moment'
import { Colors } from '../Assets';
// import { retry } from './C:/Users/prime/AppData/Local/Microsoft/TypeScript/2.6/node_modules/@types/async';

export const Function = {
    onScroll(e) {
        try {
            var windowHeight = Dimensions.get('window').height,
                height = e.nativeEvent.contentSize.height,
                offset = e.nativeEvent.contentOffset.y;
            if (windowHeight + offset >= height) {
                console.log('HeightV >> ' + windowHeight + offset)
                return false
            } else {
                return true
            }

        } catch (error) {
            console.log('error')
        }

    }, onScroll_check_window() {
        try {
            var windowHeight = Dimensions.get('window').height;
            if (windowHeight <= 592) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.log('error')
        }

    }, get_today() {
        try {
            var today = new Date();
            var dd = today.getDate();
            var mm = today.getMonth() + 1; //January is 0!
            var yyyy = today.getFullYear();

            if (dd < 10) {
                dd = '0' + dd
            }

            if (mm < 10) {
                mm = '0' + mm
            }

            today = yyyy + '-' + mm + '-' + dd;
            return today.toString()
            // document.write(today);
        } catch (error) {

        }
    }, get_next_two_today(Today) {
        try {
            var day = new Date(Today);
            var today = new Date(day);
            today.setDate(day.getDate() + 3);

            return today
            // document.write(today);
        } catch (error) {

        }
    }, get_last_date() {
        var date = new Date();
        // var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
        var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
        return lastDay
    }, OnchangesText(ArrayObject, Index, Value) {
        try {
            console.log('Tambah >>> ')

            ArrayObject[Index] = { [Object.keys(ArrayObject[Index])[0]]: Value }
            console.log(ArrayObject)
            return ArrayObject
        } catch (error) {
            console.log('error', error)
        }

    },
    ObjectNull(target, s) {
        s = s.split('.');
        var obj = target[s.shift()];
        while (obj && s.length) obj = obj[s.shift()];
        obj = obj === undefined ? null : obj
        return obj;
    },
    SubstringTime(time) {
        return time.substring(0, 2) + ':' + time.substring(2, 4)
    },
    CalculateTime(departTime, returnTime) {

        let dep_time = moment(departTime, 'YYYYMMDDHHmm')
        let arv_time = moment(returnTime, 'YYYYMMDDHHmm')
        let diff = moment.duration(arv_time.diff(dep_time))
       
        return diff.hours() + 'j ' + diff.minutes() + 'm'

    },
    convertToPrice(angka) {
        var rupiah = '';
        var angkarev = angka.toString().split('').reverse().join('');
        for (var i = 0; i < angkarev.length; i++) if (i % 3 == 0) rupiah += angkarev.substr(i, 3) + '.';
        return rupiah.split('', rupiah.length - 1).reverse().join('');
    },
    JsonParse(Json) {
        try {
            return JSON.parse(Json)
        } catch (error) {

        }
    },
    JsonString(Json) {
        try {
            return JSON.stringify(Json)
        } catch (error) {

        }
    }, SaveDataJson(Param, Value) {
        return AsyncStorage.setItem(Param, Value);
    }, AddObject(propertyName, Value) {
        var getProperty = function (propertyName) {
            return obj[propertyName] = Value;
        };
    }, FormeteDate(Date, formatDate, Format) {
        return moment(Date, formatDate).format(Format).toString()
    }, sortByPriceAsc(objectPrice) {
        return objectPrice.sort((a, b) => (a.price - b.price))
    }, sortByPriceDesc(objectPrice) {
        return objectPrice.sort((a, b) => (b.price - a.price))
    }, sortByDepartTimeDesc(objectDepartTime) {
        return objectDepartTime.sort((a, b) => (b.depTime - a.depTime))
    }, sortByDepartTimeAsc(objectDepartTime) {
        return objectDepartTime.sort((a, b) => (a.depTime - b.depTime))
    }, sortByReturnTimeDesc(objectReturnTime) {
        return objectReturnTime.sort((a, b) => (b.arvTime - a.arvTime))
    }, sortByReturnTimeAsc(objectReturnTime) {
        return objectReturnTime.sort((a, b) => (a.arvTime - b.arvTime))
    }, sortByDurationAsc(objectDuration) {
        return objectDuration.sort((a, b) => (this.CalculateTime(this.SubstringTime(a.depTime), this.SubstringTime(a.arvTime)) - this.CalculateTime(this.SubstringTime(b.depTime), this.SubstringTime(b.arvTime))))
    }, sortByDurationDesc(objectDuration) {
        return objectDuration.sort((a, b) => (this.CalculateTime(this.SubstringTime(b.depTime), this.SubstringTime(b.arvTime)) - this.CalculateTime(this.SubstringTime(a.depTime), this.SubstringTime(a.arvTime))))
    }, StarsHotel(categoryCode) {
        var str;
        str = categoryCode.replace("[^-?,_0-9,a-zA-Z]+", "");
        // console.log(str)
        if (!str) {
            str = "1";
        }
        // console.log(str.replace("/[^a-zA-Z]+/g",""))
        if (str.length === 3) {
            str = str.substring(0, 1);

        }
        return str
    }, getAdultPerRoom(room, guest) {
        var number = guest / room
        var fritter = guest % room
        var txt = ''

        for (var i = 0; i < room; i++) {
            if (Number.isInteger(number)) {
                if (room === i + 1) {
                    if (i > 0) txt += ','
                    if (i > 0) {
                        txt += number + fritter
                    } else {
                        txt += number + fritter
                    }
                } else {
                    if (i > 0) txt += ','
                    txt += number
                }
            }
            else {
                var num = number.toString().split('.')[0]
                if (room === i + 1) {
                    if (i > 0) txt += ','
                    if (i > 0) {
                        txt += parseInt(num) + fritter
                    } else {
                        txt += parseInt(num) + fritter
                    }
                } else {
                    if (i > 0) txt += ','
                    txt += parseInt(num)
                }
            }
        }

        return txt
    }, getChildPerRoom(room, guest) {
        var txt = ''
        for (var i = 0; i < room; i++) {
            if (i > 0) txt += ','
            txt += 0
        }
        return txt
    }, DeleteAsyncStorage(Param) {
        return AsyncStorage.multiRemove(Param);
    },
    getTime() {
        return new moment().format("hh:mm");
    },
    ButtomDate(nextMonth) {

        
        // var current = moment().startOf('day');
        var current = moment().add(nextMonth, 'month').startOf('day');
        var currentMonth = moment(current).add(nextMonth, 'month').endOf('month');
        var TotalDays = moment.duration(currentMonth.diff(current)).asDays()
        var DaysTotal = Math.round(TotalDays,1)
        console.log('DaysTotal >> ' + DaysTotal)
        // if (TotalDays.toString().split('.').length === 2){

        //     DaysTotal = TotalDays.toString().split('.')[0]
        // } else {
        //     DaysTotal =TotalDays.toString()
        // }

        var i =0
        var ArrayDate = []
        while (i< parseInt(DaysTotal)){

            if (i === 0){
                ArrayDate.push({
                    id: i,
                    dayName: moment(new Date()).format('dddd'),
                    date : moment(new Date()).format('DD'),
                    month : moment(new Date()).format('MMM'),
                    price :'-',
                    fulldate : moment(new Date()).format('DD MMM YYYY')
                    })
            } else {
                ArrayDate.push({
                    id: i,
                    dayName: moment(new Date()).add(i, 'day').format('dddd'),
                    date : moment(new Date()).add(i, 'day').format('DD'),
                    month : moment(new Date()).add(i, 'day').format('MMM'),
                    price :'-',
                    fulldate : moment(new Date()).add(i, 'day').format('DD MMM YYYY')
                    })
            }
            

            i++
        }
        return ArrayDate;
    }, TimeTitle() {
        var d = new Date().getHours();
        var t = new Date().getMinutes();
        var time = new moment().format("HHmm")
        console.log(time)
        // time = time.split(':')[0].toString() + time.split(':')[1].toString()

        if (parseInt(time) >= parseInt('0400') && 1000 >= parseInt(time)) {
            return 'Good Morning,'
        }
        else if (parseInt(time) >= 1000 && 1400 >= parseInt(time)) {
            return 'Good Afternoon,'
        }
        else if (parseInt(time) >= 1400 && 1830 >= parseInt(time)) {
            return 'A Good Afternoon,'
        }
        else if (parseInt('0400') >= parseInt(time)) {
            return 'Good Evening'
        } else if (parseInt(time) >= 1830) {
            return 'Good Evening'
        }
    }, find_duplicate_in_array(dupObj) {
        var uniq = new Set(dupObj.map(e => JSON.stringify(e)));
        uniq = Array.from(uniq).map(e => JSON.parse(e));
console.log('Duplicated ASUU')
console.log(uniq)
        return uniq;
    },
    filter_Flight(flightArray, flightName, time, transit) {
        var i = 0;
        var a = 0;
        var b = 0;
        var c = 0;
        var FlightName = [];
        var Time = [];
        var Transit = [];

        if (flightName && time && transit) {
            while (i < flightArray.length) {
                if (flightArray[i].airlineCode.toLowerCase() === flightName.toLowerCase()) {
                    FlightName.push(flightArray[i])
                }
                while (a < FlightName.length) {

                    var SubTime = FlightName[a].depTime.substr(0, 2) === '00' ? 24 : parseInt(FlightName[a].depTime.substr(0, 2))
                    switch (time) {
                        case 'time_1':
                            if (11 >= SubTime && SubTime >= 4) {
                                Time.push(FlightName[a])
                            }
                            break;
                        case 'time_2':
                            if (15 >= SubTime && SubTime >= 11) {
                                Time.push(FlightName[a])
                            }
                            break;

                        case 'time_3':
                            if (1830 >= parseInt(FlightName[a].depTime.substr(0, 4)) && parseInt(FlightName[a].depTime.substr(0, 4)) >= 1500) {
                                Time.push(FlightName[a])
                            }
                            break;
                        case 'time_4':
                            if (400 >= parseInt(FlightName[a].depTime.substr(0, 4))) {
                            } else if (parseInt(FlightName[a].depTime.substr(0, 4)) >= 1830) {
                                Time.push(FlightName[a])
                            }
                            break;
                    }

                    while (b < Time.length) {
                        var transit_or_no = Time[b].infoTransit
                        var length_transit = Time[b].flightRspDetailJsons.length
                        switch (transit) {
                            case 'transit_1':
                                if (transit_or_no == '') {
                                    Transit.push(Time[b])
                                }
                                break;
                            case 'transit_2':
                                if (length_transit === 2) {
                                    Transit.push(Time[b])
                                }
                                break;

                            case 'transit_3':
                                if (length_transit === 3) {
                                    Transit.push(Time[b])
                                }
                                break;
                        }
                        b++
                    }

                    a++
                }
                i++
            }
            return Transit

        } else if (flightName && time) {
            while (i < flightArray.length) {
                if (flightArray[i].airlineCode.toLowerCase() === flightName.toLowerCase()) {
                    FlightName.push(flightArray[i])
                }
                while (a < FlightName.length) {

                    var SubTime = FlightName[a].depTime.substr(0, 2) === '00' ? 24 : parseInt(FlightName[a].depTime.substr(0, 2))
                    switch (time) {
                        case 'time_1':
                            if (11 >= SubTime && SubTime >= 4) {
                                Time.push(FlightName[a])
                            }
                            break;
                        case 'time_2':
                            if (15 >= SubTime && SubTime >= 11) {
                                Time.push(FlightName[a])
                            }
                            break;

                        case 'time_3':
                            if (1830 >= parseInt(FlightName[a].depTime.substr(0, 4)) && parseInt(FlightName[a].depTime.substr(0, 4)) >= 1500) {
                                Time.push(FlightName[a])
                            }
                            break;
                        case 'time_4':
                            if (400 >= parseInt(FlightName[a].depTime.substr(0, 4))) {
                            } else if (parseInt(FlightName[a].depTime.substr(0, 4)) >= 1830) {
                                Time.push(FlightName[a])
                            }
                            break;
                    }
                    a++
                }
                i++
            }

            return Time

        } else if (flightName && transit) {

            while (i < flightArray.length) {
                if (flightArray[i].airlineCode.toLowerCase() === flightName.toLowerCase()) {
                    FlightName.push(flightArray[i])
                }
                while (b < FlightName.length) {
                    var transit_or_no = FlightName[b].infoTransit
                    var length_transit = FlightName[b].flightRspDetailJsons.length
                    switch (transit) {
                        case 'transit_1':
                            if (transit_or_no == '') {
                                Transit.push(FlightName[b])
                            }
                            break;
                        case 'transit_2':
                            if (length_transit === 2) {
                                Transit.push(FlightName[b])
                            }
                            break;

                        case 'transit_3':
                            if (length_transit === 3) {
                                Transit.push(FlightName[b])
                            }
                            break;
                    }
                    b++
                }
                i++
            }
            return Transit


        } else if (time && transit) {

            while (a < flightArray.length) {

                var SubTime = flightArray[a].depTime.substr(0, 2) === '00' ? 24 : parseInt(flightArray[a].depTime.substr(0, 2))
                switch (time) {
                    case 'time_1':
                        if (11 >= SubTime && SubTime >= 4) {
                            Time.push(flightArray[a])
                        }
                        break;
                    case 'time_2':
                        if (15 >= SubTime && SubTime >= 11) {
                            Time.push(flightArray[a])
                        }
                        break;

                    case 'time_3':
                        if (1830 >= parseInt(flightArray[a].depTime.substr(0, 4)) && parseInt(flightArray[a].depTime.substr(0, 4)) >= 1500) {
                            Time.push(flightArray[a])
                        }
                        break;
                    case 'time_4':
                        if (400 >= parseInt(flightArray[a].depTime.substr(0, 4))) {
                        } else if (parseInt(flightArray[a].depTime.substr(0, 4)) >= 1830) {
                            Time.push(flightArray[a])
                        }
                        break;
                }

                while (b < Time.length) {
                    var transit_or_no = Time[b].infoTransit
                    var length_transit = Time[b].flightRspDetailJsons.length
                    switch (transit) {
                        case 'transit_1':
                            if (transit_or_no == '') {
                                Transit.push(Time[b])
                            }
                            break;
                        case 'transit_2':
                            if (length_transit === 2) {
                                Transit.push(Time[b])
                            }
                            break;

                        case 'transit_3':
                            if (length_transit === 3) {
                                Transit.push(Time[b])
                            }
                            break;
                    }
                    b++
                }

                a++
            }
            return Transit
        } else if (flightName) {

            while (i < flightArray.length) {
                if (flightArray[i].airlineCode.toLowerCase() === flightName.toLowerCase()) {
                    FlightName.push(flightArray[i])
                }
                i++
            }
            console.log('Masuk Fligt Name')
            return FlightName
        } else if (time) {
            while (a < flightArray.length) {

                var SubTime = flightArray[a].depTime.substr(0, 2) === '00' ? 24 : parseInt(flightArray[a].depTime.substr(0, 2))
                switch (time) {
                    case 'time_1':
                        if (11 >= SubTime && SubTime >= 4) {
                            Time.push(flightArray[a])
                        }
                        break;
                    case 'time_2':
                        if (15 >= SubTime && SubTime >= 11) {
                            Time.push(flightArray[a])
                        }
                        break;

                    case 'time_3':
                        if (1830 >= parseInt(flightArray[a].depTime.substr(0, 4)) && parseInt(flightArray[a].depTime.substr(0, 4)) >= 1500) {
                            Time.push(flightArray[a])
                        }
                        break;
                    case 'time_4':
                        if (400 >= parseInt(flightArray[a].depTime.substr(0, 4))) {
                        } else if (parseInt(flightArray[a].depTime.substr(0, 4)) >= 1830) {
                            Time.push(flightArray[a])
                        }
                        break;
                }
                a++
            }
            return Time

        } else if (transit) {
            while (b < flightArray.length) {
                var transit_or_no = flightArray[b].infoTransit
                var length_transit = flightArray[b].flightRspDetailJsons.length
                switch (transit) {
                    case 'transit_1':
                        if (transit_or_no == '') {
                            Transit.push(flightArray[b])
                        }
                        break;
                    case 'transit_2':
                        if (length_transit === 2) {
                            Transit.push(flightArray[b])
                        }
                        break;

                    case 'transit_3':
                        if (length_transit === 3) {
                            Transit.push(flightArray[b])
                        }
                        break;
                }
                b++
            }
            return Transit
        } else {
            return flightArray
        }


    }
}


export const getSundayList = (type = 'day', count = 90) => {
    let format_date = 'YYYY-MM-DD'

    let start = moment(new Date()), 
        end   = moment(new Date()).add(count, type),
        day   = 0,
        result = {}

    let current = start.clone();

    while (current.day(7 + day).isBefore(end)) {
        let date_result = current.clone().format(format_date)
        result = {...result, [date_result]: {textColor: Colors.red}}
    }
    return result
}

export const Validaton = {
    Email(e) {
        try {
            let regex_email     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            if (!regex_email.test(e)) {return STRING.Warrning.field_wrong_email}
            else { return null}
        } catch (error) {
            console.log('error')
        }

    },
    Character(e) {
        try {
            let regex     = /^[a-zA-Z ]+$/
            if (!regex.test(e)) {return STRING.Warrning.field_wrong_character}
            else { 
                return null}
        } catch (error) {
            console.log('error')
        }

    },
    Number(e) {
        try {
            let regex     = /^[0-9 ]+$/
            if (!regex.test(e)) {return STRING.Warrning.field_wrong_number}
            else {
                return null}
        } catch (error) {
            console.log('error')
        }

    },
}