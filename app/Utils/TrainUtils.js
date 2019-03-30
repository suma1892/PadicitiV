import moment from 'moment'
import { Animated } from 'react-native'
import { Alert } from '../Components';

export const setMoment = () => {
    moment().locale('id')
    return moment()
}


export const setActivityResult = (value) => {
    switch (value.slug) {
        case 'origination':
            return { origination: value.stationList }
        case 'destination':
            return { destination: value.stationList }
        case 'depart_date':
            return { depart_date: value.stationList }
        case 'return_date':
            return { depart_date: value.stationList, return_date: value }
    }
}


export const getTrainClass = (slug) => {
    switch (slug) {
        case 'E': return 'Eksekutif'
        case 'K': return 'Ekonomi'
        case 'B': return 'Bisnis'
        default: null
    }
}


export const setParamSchedule = (item_1, item_2, extras) => {
    let dep_time = moment(item_1[2] + item_1[4], 'YYYYMMDDHHmm')
    let arv_time = moment(item_1[3] + item_1[5], 'YYYYMMDDHHmm')
    let diff = moment.duration(arv_time.diff(dep_time))
   
    let schedule_item = {
        "org"           : extras.origination[1],
        "des"           : extras.destination[1],
        "org_code"      : extras.origination[0],
        "des_code"      : extras.destination[0],
        "train_no"      : item_1[0],
        "train_name"    : item_1[1],
        "dep_date"      : item_1[2],
        "dep_date_2"    : moment(item_1[2], 'YYYYMMDD').format('DD MMM YYYY'),
        "dep_date_full" : moment(item_1[2], 'YYYYMMDD').format('DDD, DD MMM YYYY'),
        "dep_time"      : dep_time.format('HH:mm'),
        "dep_time_"     : dep_time,
        "arv_date"      : item_1[3],
        "arv_date_2"    : moment(item_1[3], 'YYYYMMDD').format('DD MMM YYYY'),
        "arv_date_full" : moment(item_1[3], 'YYYYMMDD').format('DDD, DD MMM YYYY'),
        "arv_time"      : arv_time.format('HH:mm'),
        "arv_time_"     : arv_time,
        "duration"      : diff.seconds(),
        "duration_hour" : diff.hours(),
        "duration_minute": diff.minutes(),
        "duration_string": diff.hours() + 'j ' + diff.minutes() + 'm',
        "subclass"      : item_2[0],
        "price"         : item_2[3],
        "class"         : getTrainClass(item_2[2]),
        "class_code"    : item_2[2],
        "availability"  : item_2[1] && item_2[1] !== '-' ? item_2[1] : 0,
    }
    return schedule_item
}

export const scheduleSorting = (slug, obj_) => {
    switch (slug) {
        case 'seat_asc':
            return obj_.sort((a, b) => b.availability - a.availability)
        case 'price_asc':
            return obj_.sort((a, b) => a.price - b.price)
        case 'price_dsc':
            return obj_.sort((a, b) => b.price - a.price)
        case 'arr_asc':
            return obj_.sort((a, b) => a.arv_time_ - b.arv_time_)
        case 'arr_dsc':
            return obj_.sort((a, b) => b.arv_time_ - a.arv_time_)
        case 'dep_asc':
            return obj_.sort((a, b) => a.dep_time_ - b.dep_time_)
        case 'dep_dsc':
            return obj_.sort((a, b) => b.dep_time_ - a.dep_time_)
        case 'dur_asc':
            return obj_.sort((a, b) => a.diff - b.diff)
        case 'dur_dsc':
            return obj_.sort((a, b) => b.diff - a.diff)
        default:
            return obj_.sort((a, b) => a.price - b.price)
    }
}

export const scheduleFilter = (time_value, class_value, train_value, array_obj) => {
    let i = 0;
    let obj_array = []

    while (i < array_obj.length) {
        let SubTime = parseInt(array_obj[i].dep_time.substr(0, 2) + array_obj[i].dep_time.substr(3, 5))

        switch (time_value) {
            case 'time_1':
                if (SubTime <= 1101 && SubTime >= 4) {
                    obj_array.push(array_obj[i])
                }
                break;
            case 'time_2':
                if (SubTime <= 1501 && SubTime >= 1101) {
                    obj_array.push(array_obj[i])
                }
                break;

            case 'time_3':
                if (SubTime <= 1830 && SubTime >= 1501) {
                    obj_array.push(array_obj[i])
                }
                break;
            case 'time_4':
                if (SubTime <= 400) {
                } else if (SubTime >= 1830) {
                    obj_array.push(array_obj[i])
                }
                break;
            // default:
            // obj_array.push(array_obj[i])
            // break
        }
        i++
    }
    if (obj_array.length === 0) {
        return ClassFilter(class_value, train_value, array_obj)
    } else {
        return ClassFilter(class_value, train_value, obj_array)
    }
}

export const ClassFilter = (class_value, train_value, obj) => {
    let j = 0;
    let obj_array = []

    while (j < obj.length) {
        let Class = obj[j].class
        switch (class_value) {
            case 'Ekonomi':
                if (Class === class_value) {
                    obj_array.push(obj[j])
                }
                break
            case 'Bisnis':
                if (Class === class_value) {
                    obj_array.push(obj[j])
                }
                break
            case 'Eksekutif':
                if (Class === class_value) {
                    obj_array.push(obj[j])
                }
                break
            // default:
            // obj_array.push(obj[j])
            // break
        }
        j++
    }

    if (obj_array.length === 0) {
        return TrainFilter(train_value, obj)
    } else {
        return TrainFilter(train_value, obj_array)
    }
}

export const TrainFilter = (train_value, obj) => {
    let k = 0;
    let obj_array = [],
        TrainName = []
    while (k < obj.length) {
        TrainName = obj[k].train_name
        switch (train_value) {
            case TrainName:
                obj_array.push(obj[k])
                break
        }
        k++
    }

    if (obj_array.length === 0) {
        return obj
    } else {
        return obj_array
    }
}

export const AnimatedValue = (state, value) => Animated.timing(state, { toValue: value, duration: 500 }).start()

export const AnimatedInter = (state, input, output) => state.interpolate({ inputRange: input, outputRange: output })


export const setPaxSeats = (pax_num, pax_name, seat) => {
    let pax_adult = pax_num[0]
    let pax_child = pax_num[0] + pax_num[1]
    let pax_infant = pax_num[0] + pax_num[1] + pax_num[2]
    
    let result_ = []
    for (let i = 0; i < pax_adult; i++) {
        console.log('<<<< pax_name >>>>')
    console.log(pax_name[i].num_id)
        let item = { type: pax_name[i].type, name: pax_name[i].name, identity:  pax_name[i].identity ? 'KTP - '+pax_name[i].identity : 'KTP - '+ pax_name[i].num_id, seat: seat[i][0] !== 0 ? seat[i][0] +' '+ seat[i][1] +'/ Seat '+ seat[i][2]+ seat[i][3] : ' '}
        result_ = [...result_, item]
    }

    let child_result = []
    for (let i = pax_adult; i < pax_child; i++) {
        let item = { type: pax_name[i].type, identity: null, name: pax_name[i].name ? pax_name[i].name : pax_name[i], brith_date : pax_name[i].brith_date, seat: ' '  }
        result_ = [...result_, item]
    }

    let infant_result = []
    for (let i = pax_child; i < pax_infant; i++) {
        let item = { type: pax_name[i].type, name: pax_name[i].name,  identity: null, brith_date : pax_name[i].brith_date ? pax_name[i].brith_date : pax_name[i].birthdate, seat:  ' ' }
        result_ = [...result_, item]
    }
    return result_
}

export const paxNameHistory = (pax_name) => {
    let NamePax = []
    // Alert.alert(pax_name)

    console.log("pax Errorrrrr "+pax_name)
    pax_name.forEach((element) => {
        NamePax.push({name : element.passenger_name ? element.passenger_name : element.name, identity : element.passenger_identity_no ? element.passenger_identity_no : element.num_id, brith_date : element.passenger_birthdate ? element.passenger_birthdate : null, type : element.passenger_type});
    });
    return NamePax
}

export const paxSeatHistory = (pax_seat) => {
    let SeatPax = []
    pax_seat.forEach((element) => {
        SeatPax.push([element.wagon_code, element.wagon_no, element.seat_row, element.seat_column]);
    });
    return SeatPax
}

export const find_duplicate_in_array = (dupObj) => {
    let uniq = new Set(dupObj.map(e => JSON.stringify(e)));
    uniq = Array.from(uniq).map(e => JSON.parse(e));
    return uniq;
}

export const toCapitalize = str => str
        .toLowerCase()
        .split(' ')
        .map(word => word[0].toUpperCase() + word.substr(1))
        .join(' ')
