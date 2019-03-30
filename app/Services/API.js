
import { Function, STRING, array } from '../Utils'
const API = {
    DOMAIN_INQWERY_1: 'https://inquiry2.padiciti.com/',
    DOMAIN_RESERVSTION_2: 'https://reservation2.padiciti.com/',
    DOMAIN_RESERVSTION_1: 'https://reservation1.padiciti.com/',
    DOMAIN_PADI_AIR: 'http://www.padiair.com/',
    DOMAIN_PLN: 'http://182.23.65.89:8888/',
    DOMAIN_TOUR: 'http://182.23.65.36:5555/'

}

const getURL = (slug, param) => {
    switch (slug) {
        case 'url_post_lower_price':
            return API.DOMAIN_RESERVSTION_2 +'padiciti-flightv2/service/flight/schedule/getMsScheduleFlightCheap'
        case 'url_post_get_group_flight':
            return API.DOMAIN_INQWERY_1 + 'inquiry-padiciti-flight/service/flight/schedule/getGroupFlightLst'
        case 'url_post_get_schedule_by_group_per_type':
            return API.DOMAIN_INQWERY_1 + 'inquiry-padiciti-flight/service/flight/schedule/getScheduleFlightByGroup'
        case 'url__post_booking_flight_2':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-flightv2/service/flight/booking/bookingFlightV2'
        case 'url_post_select_flight_2':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-flightv2/service/flight/booking/getSelectFlightVer2'
        case 'url_post_padipay_req':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-flightv2/service/padipay/request'
        case 'url_post_hotel_destination_by_param':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-hotel/service/hotelDestination/getDestinationByParam'
        case 'url_post_inquiry_paging_hotel':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-hotel/service/inquiry/getInguiryPaging'
        case 'url_post_inquiry_hotel':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-hotel/service/inquiry/getHotelAvail'
        case 'url_post_hotel_detail':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-hotel/service/inquiry/getViewHotelDetail'
        case 'url_post_book_hotel':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-hotel/service/hotel/booking/executeBookingHotel'
        case 'url_post_request_padipay_hotel':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-hotel/service/hotel/payment/padipay/reqPayment'
        case 'url_post_nonMember_Hotel':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-user/service/user/nonMember'
        case 'url_login_user':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-user/service/user/logonUser'
        case 'url_register_user':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-user/service/user/registerMember'
        case 'url_list_headlines':
            return API.DOMAIN_PADI_AIR + 'PadiTools/service/news/listHeadlines'
        case 'url_point':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-loyalty-service/webapp/loyalty/reward/point/getBalance.html'
        case 'url_inqweri_pln':
            return API.DOMAIN_PLN + 'pln-bukopin/service/bukopin/inquiry'
        case 'url_payment_request':
            return API.DOMAIN_PLN + 'pln-bukopin/service/bukopin/requestPayment'
        case 'url_get_org':
            return API.DOMAIN_INQWERY_1 + 'inquiry-padiciti-flight/service/airport/getOrg'
        case 'url_get_dest':
            return API.DOMAIN_INQWERY_1 + 'inquiry-padiciti-flight/service/airport/getDest'
        case 'url_get_resend_email_train':
            return API.DOMAIN_RESERVSTION_1 + 'ticketing-kai/service/booking/resendEmailItinerary'
        case 'url_get_resend_email_flight':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-flightv2/service/flight/transaction/resendMail'
        case 'url_get_all_city_tour':
            return API.DOMAIN_TOUR + 'PadiTour2/service/tour/getCity'
        case 'url_get_inqwery_tour':
        return API.DOMAIN_TOUR + 'PadiTour2/service/tour/getScheduleByPrm?'+'cityPrm='+ param.city
        case 'url_get_booking':
        return API.DOMAIN_TOUR + 'PadiTour2/service/booking/bookingTour?id_tour=48&id_user=650763&credential_code=padiciti&credential_pass=padiciti123&jumlah_peserta_adult=2&jumlah_peserta_child=0&start_date=20190101&end_date=20190103&typeDate=A&idAvailableDate=162&titleAdult_2=Mr&nama_peserta_2=dickyss8&birtd_date_2=05021995&email_2=dickydharmas5552%40gmail.com&titleAdult_1=Mr&nama_peserta_1=dickyDss8&birtd_date_1=05021995&no_hp_1=083083083&email_1=dickydharmas5552%40gmail.com'
        case 'url_get_detil_tour':
        return API.DOMAIN_TOUR + 'PadiTour2/service/tour/getDetailTour?idTour='+ param
        case 'url_get_all_review':
        return API.DOMAIN_TOUR + 'PadiTour2/service/reviewTour/getAllReview?id_tour='+param
        case 'url_booking_tour':
        return API.DOMAIN_TOUR +'PadiTour2/service/booking/bookingTour'+ param
        case 'url_post_req_payment_tour':
        return API.DOMAIN_TOUR +'PadiTour2/service/padipay/request'
        case 'url_review_tour':
        return API.DOMAIN_TOUR +'PadiTour2/service/reviewTour/insertReview'
        case 'url_forgot_pass':
        return API.DOMAIN_RESERVSTION_2 + 'padiciti-user/service/user/forgetenPass'

    }

}
export const getURlHistory = (slug, param) => {
    switch (slug) {
        case 'get_flight':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-flightv2/service/flight/transaction/getHistoryReservation' + "/?userId=" + param.userid
        case 'get_traint':
            return API.DOMAIN_RESERVSTION_1 + 'ticketing-kai/service/booking/getHistoryReservation' + "/?user_id=" + param.userid
        case 'get_traint_detail':
            return API.DOMAIN_RESERVSTION_1 + 'ticketing-kai/service/booking/getHistoryReservationV2/getDetail' + "/?transaction_code=" +param.transaction_code    
        case 'hotel':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-hotel/service/hotel/transaction/info/getHistoryBookingHotel'
        case 'get_flight_passanger':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-flightv2/service/flight/passenger/getHistoryPassengers/?userId=' + param.userid + '&passengerType=' + param.type_passanger
        case 'get_flight_passanger_int':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-flightv2/service/flight/passenger/getHistoryPassengersVer2/?userId=' + param.userid + '&passengerType=' + param.type_passanger
        case 'get_traint_passanger':
            return API.DOMAIN_RESERVSTION_1 + 'ticketing-kai/service/booking/getHistoryPassengers/?user_id=' + param.userid + '&passenger_type=' + param.type_passanger
        case 'url_non_member':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-user/service/user/nonMember'
        case 'get_railink':
            return API.DOMAIN_RESERVSTION_2 + 'padiciti-railink/service/getHistoryReservation'
        case 'get_bus':
            return API.DOMAIN_RESERVSTION_2 + 'Padiciti-redbus-service/service/getHistoryReservation/?user_id=' + param.userid + '&credential_code=' + param.credentialCode + '&credential_pass=' + param.credentialPass
        case 'pln':
            return API.DOMAIN_PLN + 'pln-bukopin/service/bukopin/historyTransactionByEmail'

    }
    
}


export const getURLIJDK = (slug, param)=>{
    switch (slug){
        case 'get_schedule' :
        return 'http://182.23.65.29:8888/free-0.0.1/sch-invev/get?Adult='+ param.Adult+ '&Child='+param.Child+'&EventDateStart='+param.EventDateStart+'&EventDateUntil='+param.EventDateUntil+'&Infent='+param.Infant+''
        case 'booking' :
            return 'http://182.23.65.29:8888/free-0.0.1/service/booking'
        }
    }


    export const getURLTrain = (slug, param) => {
        switch (slug) {
            case 'get_schedule':
                return 'https://inquiry1.padiciti.com/schedule-kai/service/train/getScheduleAvailabilityVer2/?org=' + param.org + '&des=' + param.des + '&dep_date=' + param.date + ''
            case 'booking':
                return 'https://reservation1.padiciti.com/ticketing-kai/service/booking/bookingProcessWithArrv'
            case 'check_out':
                return 'https://reservation1.padiciti.com/ticketing-kai/service/booking/checkOutBooking' + "/?transaction_type=" + param.type + "&booking_code_depart=" + param.depBookCode + "&booking_code_return=" + param.retBookCode
            case 'seat':
                return 'https://reservation1.padiciti.com/ticketing-kai/service/train/getSeatMapPerSubClass' + "/?org=" + param.org + "&des=" + param.des + "&train_no=" + param.train_no + "&dep_date=" + param.dep_date+"&subclass="+param.subclass
            case 'change_seat':
                return 'https://reservation1.padiciti.com/ticketing-kai/service/train/manualSeatProcess' + "/?book_code=" + param.book_code + "&wagon_code=" + param.wagon_code + "&wagon_no=" + param.wagon_no + "&seat=" + param.seat
            case 'padipay':
                return 'http://reservation1.padiciti.com/ticketing-kai/service/payment/padipay/reqPadipayLoyalty'
            case 'cancel':
                return 'https://reservation1.padiciti.com/ticketing-kai/service/booking/cancelBookingByUser' + "/?transaction_type=" + param.type + "&booking_code_depart=" + param.depBookCode + "&booking_code_return=" + param.retBookCode
        }
    }
    
export const postURLRailink = (slug, param) => {
    switch (slug) {
        case 'get_schedule':
            return 'http://reservation2.padiciti.com/padiciti-railink/service/getSchedule'
        case 'booking':
            return 'http://reservation2.padiciti.com/padiciti-railink/service/bookingProses'
        case 'padipay':
            return 'http://reservation2.padiciti.com/padiciti-railink/service/reqPayment'
    }
}

export const getURLBus = (slug, param) => {
    // http://182.23.65.89:8888/
    switch (slug) {
        case 'get_schedule':
            return 'https://reservation2.padiciti.com/Padiciti-redbus-service/service/availableTrips/?org_code=' + param.org + '&des_code=' + param.des + '&dep_date=' + Function.FormeteDate(param.date, 'YYYYMMDD', 'YYYY-MM-DD') + ''
        case 'booking':
            return 'https://reservation2.padiciti.com/Padiciti-redbus-service/service/reqPayment'
        case 'get_seat':
            return 'https://reservation2.padiciti.com/Padiciti-redbus-service/service/seatLayout' + "/?available_trip_id=" + param.available_trip_id
       case 'check_out':
            return 'https://reservation2.padiciti.com/Padiciti-redbus-service/service/booking/bus2'
        case 'padipay':
            return 'https://reservation2.padiciti.com/Padiciti-redbus-service/service/reqPayment'
    }
}
export { API, getURL }  