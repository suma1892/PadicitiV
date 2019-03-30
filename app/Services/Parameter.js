
// import { createStore } from 'redux'
// import {ParamLogin} from '../Reducers'
// const storeLogin = createStore(ParamLogin)
import { Function, STRING, array } from '../Utils'
import { Platform, } from 'react-native'
import moment from 'moment'
let params = null
export const Parameter = {
    ScheduleFlight(param, type) {
        try {
            params = {
                trnType: param[8].selectedItem,
                org: param[5].depart.code,
                des: param[6].return.code,
                depDate: Function.FormeteDate(param[3].depart_date, 'DD MMM YYYY', 'YYYYMMDD'),
                returnDate: Function.FormeteDate(param[4].return_date, 'DD MMM YYYY', 'YYYYMMDD'),
                paxAdult: param[0].adult,
                paxChild: param[1].child,
                paxInfant: param[2].infant,
                deviceType: Platform.OS == 'ios' ? 'IOS' : 'android',
                airlineGroup: param[7].airlineGroup,
                credentialPass: 'padiciti123',
                credentialCode: 'padiciti',
                currency: 'IDR'
            }

            return params
        } catch (error) {
            console.log('error')
        }

    }, DetilFlight(param, type) {
        try {
            params = {
                logCode: param,
            }

            return params
        } catch (error) {
            console.log('error')
        }

    }, PostBooking2(Prameter) {
        try {

            params = {
                trnType: Prameter.dataReturn ? 'round-trip' : 'one-way',
                userEmail: Prameter.client_email,
                paxAdult: Prameter.search_param[0].adult,
                paxChild: Prameter.search_param[1].child,
                paxInfant: Prameter.search_param[2].infant,
                deviceType: Platform.OS == 'ios' ? 'IOS' : 'Android',
                resellerCode: 'padiciti',
                resellerPass: 'padiciti123',
            }

            if (Prameter.dataReturn) {
                params['logCodeReturn'] = Prameter.dataReturn.logCode
            }
            params['logCodeDepart'] = Prameter.dataDepart.logCode
            console.log('Prameter 1>>>  ')
            console.log(Prameter.dataDepart)
            for (var A = 0; A < Prameter.search_param[0].adult; A++) {
              
                params['titleAdult_' + A] = Prameter['adult_title' + (A + 1)].title
                params['firstNameAdult_' + A] = Prameter['adult_full_name' + (A + 1)].toString().split(' ').slice(0, -1).join(' ') ? Prameter['adult_full_name' + (A + 1)].toString().split(' ').slice(0, -1).join(' ') : Prameter['adult_full_name' + (A + 1)]
                params['lastNameAdult_' + A] = Prameter['adult_full_name' + (A + 1)].toString().split(' ').slice(-1).join(' ')
                params['genderAdult_' + A] = Prameter['adult_title' + (A + 1)].gender
                params['birthDateAdult_' + A] = '19760405'
                // Prameter['adult_brith_date'+A]
                params['identityNumAdult_' + A] = '679809070894586'
                // params['phoneNumAdult_' + A] = "+628122214018"
                params['phoneNumAdult_' + A] = "08558214018"
                params['nationalityAdult_' + A] = 'ID'
                
                if (Prameter.dataDepart.classType === 'INT'){
                    params['noPassportAdult_'+ A] = Prameter['adult_passport' + (A + 1)]
                params['issuingCountryAdult_' + A] = 'ID'
                params['expiryPassportAdult_' + A] = Function.FormeteDate(Prameter['adult_expiryPassport' + (A + 1)], 'DD MMM YYYY', 'YYYYMMDD')
                }
                
            }
            console.log('Prameter2 >>>  ')
            console.log(params)
            for (var C = 0; C < Prameter.search_param[1].child; C++) {
                params['titleChild_' + C] = Prameter['child_title' + (C + 1)].title
                params['firstNameChild_' + C] = Prameter['child_full_name' + (C + 1)].toString().split(' ').slice(0, -1).join(' ') ? Prameter['child_full_name' + (C + 1)].toString().split(' ').slice(0, -1).join(' ') : Prameter['child_full_name' + (C + 1)]
                params['lastNameChild_' + C] = Prameter['child_full_name' + (C + 1)].toString().split(' ').slice(-1).join(' ')
                params['genderChild_' + C] = Prameter['child_title' + (C + 1)].gender
                params['birthDateChild_' + C] = Function.FormeteDate(Prameter['child_brith_date' + (C + 1)], 'DD MMM YYYY', 'YYYYMMDD')
                params['nationalityChild_' + C] = 'ID'
                
                if (Prameter.dataDepart.classType === 'INT'){
                params['noPassportChild_'+ C] = Prameter['child_passport' + (C + 1)]
                params['issuingCountryChild_'+ C]  = 'ID'
                params['expiryPassportChild_'+ C] = Function.FormeteDate(Prameter['child_expiryPassport' + (C + 1)], 'DD MMM YYYY', 'YYYYMMDD')
                }
                
            }
            console.log('Prameter3 >>>  ')
            console.log(params)
            for (var I = 0; I < Prameter.search_param[2].infant; I++) {
                params['titleInfant_' + I] = Prameter['infant_title' + (I + 1)].title
                params['firstNameInfant_' + I] = Prameter['infant_full_name' + (I + 1)].toString().split(' ').slice(0, -1).join(' ') ? Prameter['infant_full_name' + (I + 1)].toString().split(' ').slice(0, -1).join(' ') : Prameter['infant_full_name' + (I + 1)]
                params['lastNameInfant_' + I] = Prameter['infant_full_name' + (I + 1)].toString().split(' ').slice(-1).join(' ')
                params['genderInfant_' + I] = Prameter['infant_title' + (I + 1)].gender
                params['birthDateInfant_' + I] = Function.FormeteDate(Prameter['infant_brith_date' + (I + 1)], 'DD MMM YYYY', 'YYYYMMDD')
                params['nationalityInfant_' + I] = 'ID'
                params['adultassocInfant_' + I] = I
                
                if (Prameter.dataDepart.classType === 'INT'){
                    params['noPassportInfant_'+I]= Prameter['infant_passport' + (I + 1)]
                params['issuingCountryInfant_'+I]= 'ID'
                params['expiryPassportInfant_'+I]= Function.FormeteDate(Prameter['infant_expiryPassport' + (I + 1)], 'DD MMM YYYY', 'YYYYMMDD')
                }
                
            }
            console.log('Prameter4 >>>  ')
            console.log(params)
            return params
        } catch (error) {
            console.log(error)
        }

    }, Payment(param, type) {
        try {
            params = {
                transactionCode: param,
                languageVer: 'ID'
            }

            return params
        } catch (error) {
            console.log('error')
        }

    }, DestHotel(param, type) {
        try {
            params = {
                findData: param,
                languageVer: 'ID'
            }

            return params
        } catch (error) {
            console.log('error')
        }

    }, inqweryPagingHotel(param, type) {
        try {

            params = {
                credentialCode: 'padiciti',
                credentialPass: 'padiciti123',
                languageCode: 'IND',
                srchGroupCode: param[2].destination.groupCode,
                srchValueCode: param[2].destination.code,
                checkInDate: Function.FormeteDate(param[3].checkInDate, 'YYYY-MM-DD', 'YYYYMMDD'),
                checkOutDate: Function.FormeteDate(param[4].checkOutDate, 'YYYY-MM-DD', 'YYYYMMDD'),
                roomCount: param[5].room,
                adultPerRoom: Function.getAdultPerRoom(param[5].room, param[1].guest),
                childPerRoom: Function.getChildPerRoom(param[5].room, param[1].guest),

            }
            if (type) {

                params['sessionId'] = type.sessionId
                params['pageNumber'] = type.pageNumber
                params['itemsPerPage'] = type.itemsPerPage
            }


            return params
        } catch (error) {
            console.log('error')
        }

    }, DetilHotel(param, type) {
        try {

            params = {
                credentialCode: 'padiciti',
                credentialPass: 'padiciti123',
                languageCode: 'IND',
                srchGroupCode: param[2].destination.groupCode,
                srchValueCode: param[2].destination.code,
                checkInDate: Function.FormeteDate(param[3].checkInDate, 'YYYY-MM-DD', 'YYYYMMDD'),
                checkOutDate: Function.FormeteDate(param[4].checkOutDate, 'YYYY-MM-DD', 'YYYYMMDD'),
                roomCount: param[5].room,
                adultPerRoom: Function.getAdultPerRoom(param[5].room, param[1].guest),
                childPerRoom: Function.getChildPerRoom(param[5].room, param[1].guest),
                sessionId: type.sesionid,
                hotelCode: type.hotelCode

            }
            return params
        } catch (error) {
            console.log('error')
        }

    }, Nonmember(param, type) {
        try {

            params = {
                email: param.client_email,
                fullName: param.client_name,
                phoneNumber: param.client_phone,
                deviceRegistered: Platform.OS == 'ios' ? 'IOS' : 'Android'

            }
            return params
        } catch (error) {
            console.log('error')
        }

    }, CheckOutHotel(param, guest) {
        try {
            var i = 0;
            var g = 0;
            params = {
                credentialCode: 'padiciti',
                credentialPass: 'padiciti123',
                languageCode: 'IND',
                email: guest.client_email,
                sessionId: param.sesionid,
                roomIdLst: param.roomIdLst,
                dateFrom: param.dateFrom,
                dateTo: param.dateTo,
                hotelCode: param.hotelCode,
                roomCount: param.roomCount,
                deviceType: param.deviceType,

            }

            while (i < param.roomCount) {
                params['roomId_' + (i + 1)] = param.roomIdLst
                i++;
            }
            while (g < param.roomCount) {
                params['firstNameRoom_' + (g + 1)] = guest['adult_full_name' + (g + 1)].toString().split(' ').slice(0, -1).join(' ') ? guest['adult_full_name' + (g + 1)].toString().split(' ').slice(0, -1).join(' ') : guest['adult_full_name' + (g + 1)].toString().split(' ').slice(-1).join(' ')
                params['lastNameRoom_' + (g + 1)] = guest['adult_full_name' + (g + 1)].toString().split(' ').slice(-1).join(' ')
                g++;
            }



            return params
        } catch (error) {
            console.log('error')
        }

    }, PaymentHotel(param, type) {
        try {
            params = {
                credentialCode: 'padiciti',
                credentialPass: 'padiciti123',
                email: param.userEmail,
                transactionCode: param.transactionCode,
                languageVer: 'ID',
            }

            return params
        } catch (error) {
            console.log('error')
        }

    }, Login(param){
        try {
            params = {
                email: 'email',
                password: 'password',
            }

            return params
        } catch (error) {
            console.log('error')
        }
    }
}