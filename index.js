import { AppRegistry, StatusBar, View } from 'react-native'
import React, { Component } from 'react'
import { StackNavigator } from 'react-navigation'
import FlightScreenINT from './app/Containers/FLIGHTINT/Flight';
import AirportListINT from './app/Containers/FLIGHTINT/ListAirport'
import ScheduleFlightINT from './app/Containers/FLIGHTINT/Schedule'
import ReviewINT from './app/Containers/FLIGHTINT/Review'
import detilINT from './app/Containers/FLIGHTINT/detil'
import DetilPemesananINT from './app/Containers/FLIGHTINT/DetilPemesanan'
import ScheduleReturnINT from './app/Containers/FLIGHTINT/ScheduleReturn'
import FlightSortFilterINT from './app/Containers/FLIGHTINT/FlightSortFilter'
import PaymentFlightINT from './app/Containers/FLIGHTINT/Payment'

import FlightScreen from './app/Containers/Flight/Flight';
import HomeScreen from './app/Containers/Home';
import AirportList from './app/Containers/Flight/ListAirport'
import ScheduleFlight from './app/Containers/Flight/Schedule'
import Review from './app/Containers/Flight/Review'
import detil from './app/Containers/Flight/detil'
import DetilPemesanan from './app/Containers/Flight/DetilPemesanan'
import ScheduleReturn from './app/Containers/Flight/ScheduleReturn'
import FlightSortFilter from './app/Containers/Flight/FlightSortFilter'
import PaymentFlight from './app/Containers/Flight/Payment'
import TrainReservation from './app/Containers/Train/TrainReservation';
import TrainStationList from './app/Containers/Train/TrainStationList'
import TrainCalendar from './app/Containers/Train/TrainCalendar'
import TrainScheduleDepart from './app/Containers/Train/TrainScheduleDepart';
import TrainScheduleReturn from './app/Containers/Train/TrainScheduleReturn';
import TrainDetail from './app/Containers/Train/TrainDetail';
import TrainCheckout from './app/Containers/Train/TrainCheckout'
import TrainSortFilter from './app/Containers/Train/TrainSortFilter'
import TrainReview from './app/Containers/Train/TrainReview'
import TrainPayment from './app/Containers/Train/Payment'
// import PelniReservation from './app/Containers/Pelni/PelniReservation'
// import PelniRevervationv2 from './app/Containers/Pelni/PelniRevervationv2'
// import PelniScheduleDepart from './app/Containers/Pelni/PelniScheduleDepart'
// import PelniShipDetail from './app/Containers/Pelni/PelniShipDetail'
// import PelniDetail from './app/Containers/Pelni/PelniDetail'
// import PelniCheckOut from './app/Containers/Pelni/PelniCheckOut'
import BusReservation from './app/Containers/Bus/BusReservation';
import BusTerminalList from './app/Containers/Bus/BusTerminalList'
import BusScheduleDepart from './app/Containers/Bus/BusScheduleDepart'
import BusScheduleReturn from './app/Containers/Bus/BusScheduleReturn'
import BusSortFilter from './app/Containers/Bus/BusSortFilter'
import BusDetil from './app/Containers/Bus/BusDetil'
import BusCheckout from './app/Containers/Bus/BusCheckOut'
import BusCalendar from './app/Containers/Bus/BusCalendar'
import LandingPageHotel from './app/Containers/Hotel/LandingPageHotel'
import ListHotel from './app/Containers/Hotel/ListHotel'
import HotelCalendar from './app/Containers/Hotel/HotelCalendar'
import CheckOutHotel from './app/Containers/Hotel/CheckOutHotel'
import BookingDetail from './app/Containers/Hotel/BookingDetail'
import PaymentHotel from './app/Containers/Hotel/Payment'
import Call from './app/Containers/Profile/Call'
import TrainSeatSelection from './app/Containers/Train/SeatSelection'
import HistoryBooking from './app/Containers/Profile/HistoryBooking'
import Tour from './app/Containers/Tour/TourReservation'
import PlnReservation from './app/Containers/PLN/PlnReservation'
import PaymentPLN from './app/Containers/PLN/Payment'
import SelectTour from './app/Containers/Tour/SelectTour'
import ListHotelDestination from './app/Containers/Hotel/ListHotelDestination'
import ReviewHotel from './app/Containers/Hotel/ReviewHotel'
import Urutkan from './app/Containers/Hotel/Urutkan'
import FilterHotel from './app/Containers/Hotel/FilterHotel'
import HistoryMyTrip from './app/Containers/Profile/HistoryMyTrip'
import QrCode from './app/Containers/qrcode'

import EtiketHotel from './app/Containers/Hotel/Etiket'
import EtiketKereta from './app/Containers/Train/Etiket'
import EtiketFlight from './app/Containers/Flight/Etiket'
import Login from './app/Containers/Profile/Login'
import Profile_KartuKredit from './app/Containers/Profile/Profile_KartuKredit'
import Profile_Penumpang from './app/Containers/Profile/Profile_Penumpang'
import LandingPageProfile from './app/Containers/Profile/LandingPageProfile'
import More from './app/Containers/More/More'
import Country from './app/Containers/More/Country'
import Promos from './app/Containers/Profile/Promos'
import Register from './app/Containers/Profile/Register'
import CalendarScreen from './app/Components/CalendarsScreen'
import Calendar from './app/Components/Calendar'
import DataPassanger  from './app/Containers/Passanger/DataPassanger'
import DestenationTour from './app/Containers/Tour/DestenationTour'
import DetilTour from './app/Containers/Tour/DetilTour'
import ReviewTour from './app/Containers/Tour/Review'
import ListTour from './app/Containers/Tour/ListTour'
import PaymentTour from './app/Containers/Tour/Payment'
import TourReservation from './app/Containers/Tour/TourReservation'
import DetilTraveler from './app/Containers/Tour/DetilTraveler'
import BookingTour from './app/Containers/Tour/BookingTour'
import BusReview from './app/Containers/Bus/BusReview'
import Test from './app/Containers/Tour/Test'
import ForgotPassword from './app/Containers/Profile/ForgotPassword'
import EticketTour from './app/Containers/Tour/Eticket'

import IJDKReservation from './app/Containers/IJDK/IJDKReservation';
import IJDKSchedule from './app/Containers/IJDK/IJDKSchedule'
import IJDKDetail from './app/Containers/IJDK/IJDKDetail'
import IJDKCheckout from './app/Containers/IJDK/IJDKCheckout'
import IJDKReview from './app/Containers/IJDK/IJDKReview'
import Kosong from './app/Containers/IJDK/Kosong'
import PaymentIJDK from './app/Containers/IJDK/PaymentIJDK'
import moment from 'moment'
import DetailEtiket from './app/Containers/IJDK/DetailEtiket'
import PaymentDetail from './app/Containers/IJDK/PaymentDetail'
import PaymentSecondWay from './app/Containers/IJDK/PaymentSecondWay'
import 'moment/locale/id'
moment().locale('id')

const AppContent = StackNavigator({
    PaymentSecondWay:{screen:PaymentSecondWay},
    PaymentDetail:{screen:PaymentDetail},
    DetailEtiket:{screen : DetailEtiket},
    HomeScreen: { screen: HomeScreen },
    Kosong: { screen: Kosong },
    FlightScreen: { screen: FlightScreen },
    AirportList: { screen: AirportList },
    ScheduleFlight :{screen : ScheduleFlight},
    ScheduleReturn :{screen : ScheduleReturn},
    FlightSortFilter :{screen : FlightSortFilter},
    PaymentFlight :{screen : PaymentFlight},
    Review :{screen : Review},
    detil :{screen : detil},
    DetilPemesanan : { screen: DetilPemesanan },
    TrainReservation : { screen: TrainReservation },
    TrainScheduleDepart : { screen: TrainScheduleDepart },
    TrainScheduleReturn : { screen: TrainScheduleReturn },
    TrainDetail : { screen: TrainDetail },
    TrainCheckout : { screen: TrainCheckout },
    IJDKCheckout : { screen: IJDKCheckout },
    TrainSortFilter : { screen: TrainSortFilter },
    TrainStationList : { screen: TrainStationList },
    TrainCalendar : { screen: TrainCalendar },
    TrainReview : { screen: TrainReview },
    TrainPayment : { screen: TrainPayment },
    TrainSeatSelection: { screen: TrainSeatSelection },
    Tour : {screen : Tour},
    QrCode : {screen : QrCode},
    HistoryBooking :{screen : HistoryBooking},
    IJDKReview:{screen:IJDKReview},
    IJDKReservation:{screen : IJDKReservation},
    IJDKSchedule : {screen : IJDKSchedule},
    IJDKDetail : {screen : IJDKDetail},
    BusSortFilter : { screen: BusSortFilter },
    BusReservation : { screen: BusReservation },
    BusTerminalList : { screen: BusTerminalList },
    BusScheduleDepart : { screen: BusScheduleDepart },
    BusScheduleReturn : { screen: BusScheduleReturn },
    BusDetil : { screen: BusDetil },
    BusCheckout : { screen: BusCheckout },
    BusCalendar : { screen: BusCalendar },
    BusReview : {screen: BusReview},
    ListHotel : { screen: ListHotel },
    ListHotelDestination  : { screen: ListHotelDestination },
    HotelCalendar : { screen: HotelCalendar },
    CheckOutHotel : { screen: CheckOutHotel },
    FilterHotel : { screen: FilterHotel },
    Urutkan : { screen: Urutkan },
    BookingDetail : { screen: BookingDetail },
    ReviewHotel : { screen: ReviewHotel },
    LandingPageHotel : { screen: LandingPageHotel },
    PaymentHotel : { screen: PaymentHotel },
    Login : { screen: Login },
    Profile_KartuKredit  : { screen: Profile_KartuKredit },
    Profile_Penumpang : { screen: Profile_Penumpang },
    Call : { screen: Call },
    Promos : { screen: Promos },
    LandingPageProfile : { screen: LandingPageProfile },
    Register : { screen: Register },
    CalendarScreen: { screen: CalendarScreen },
    Calendar : { screen: Calendar },
    HistoryMyTrip: { screen: HistoryMyTrip },
    DataPassanger: { screen: DataPassanger },
    PlnReservation: {screen: PlnReservation},
    PaymentPLN: {screen: PaymentPLN},
    More: { screen: More },
    SelectTour :{screen: SelectTour },
    Country : { screen: Country },

    FlightScreenINT :{screen : FlightScreenINT},
    AirportListINT :{screen : AirportListINT},
    ScheduleFlightINT :{screen : ScheduleFlightINT},
    ReviewINT :{screen : ReviewINT},
    detilINT :{screen : detilINT},
    DetilPemesananINT :{screen : DetilPemesananINT},
    ScheduleReturnINT :{screen : ScheduleReturnINT},
    FlightSortFilterINT :{screen : FlightSortFilterINT},
    PaymentFlightINT :{screen : PaymentFlightINT},
    EtiketHotel :{screen : EtiketHotel},
    EtiketKereta :{screen : EtiketKereta},
    EtiketFlight :{screen : EtiketFlight},
    DestenationTour :{screen : DestenationTour},
    DetilTour :{screen : DetilTour},
    TourReservation :{screen : TourReservation},
    DetilTraveler :{screen : DetilTraveler},
    BookingTour :{screen : BookingTour},
    ReviewTour :{screen : ReviewTour},
    PaymentTour :{screen : PaymentTour},
    PaymentIJDK:{screen:PaymentIJDK},
    ListTour :{screen : ListTour},
    Test :{screen : Test},
    ForgotPassword :{screen : ForgotPassword},
    EticketTour :{screen : EticketTour},
}, {
        initialRouteName: 'HomeScreen',
        navigationOptions: { header: null },
        transitionConfig: () => ({
            transitionSpec: {
                duration: 0,
            }
        }),
    })

    const App = () =>
    <View style={{ flex: 1, backgroundColor: 'transparent', }}>
    <StatusBar barStyle="light-content" backgroundColor="#062d68" />
    <AppContent />
    </View>

AppRegistry.registerComponent('Padiciti', () => App);