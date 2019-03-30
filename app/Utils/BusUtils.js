import moment from 'moment'
import { Animated } from 'react-native'


export const setMoment = () => {
    moment().locale('id')
    return moment()
}

export const setParamSchedule = (item) => {
    let dep_time    = moment(item.boardingDate+item.departTime, 'YYYYMMDDHHmm')
    let arv_time    = moment(item.droppingDate+item.arrivalTime, 'YYYYMMDDHHmm')
    let diff        = moment.duration(arv_time.diff(dep_time))
    let schedule_item = {
        "availableTripId"   : item.availableTripId,
        "org"               : item.departLocationName,
        "des"               : item.arrivalLocationName,
        "org_code"          : item.departLocationCode,
        "des_code"          : item.arrivalLocationCode,
        "travelName"        : item.travelName,
        "price"             : item.fare,
        "dep_date"          : item.boardingDate,
        "dep_date_2"        : moment(item.boardingDate, 'YYYY-MM-DD').format('DD MMM YYYY'),
        "dep_date_full"     : moment(item.boardingDate, 'YYYY-MM-DD').format('DDD, DD MMM YYYY'), 
        "dep_time"          : dep_time.format('HH:mm'),
        "dep_time_"         : dep_time,
        "arv_date"          : item.droppingDate,
        "arv_date_2"        : moment(item.droppingDate, 'YYYY-MM-DD').format('DD MMM YYYY'),
        "arv_date_full"     : moment(item.droppingDate, 'YYYY-MM-DD').format('DDD, DD MMM YYYY'), 
        "arv_time"          : arv_time.format('HH:mm'),
        "arv_time_"         : arv_time,
        "duration"          : diff,
        "duration_hour"     : diff.hours(),
        "duration_minute"   : diff.minutes(),
        "duration_string"   : diff.hours() + 'j ' + diff.minutes() + 'm',
        "boardingTimesDetails" : item.boardingTimesDetails,
        "droppingTimesDetails" : item.droppingTimesDetails,
    }
    
    return schedule_item
}