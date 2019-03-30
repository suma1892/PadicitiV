import React, { Component } from 'react'
import {
    AsyncStorage,
    StyleSheet,
    View,
    ScrollView,
    Image, Platform, Dimensions, AppRegistry, TouchableWithoutFeedback, TouchableNativeFeedback, Linking, Share, BackHandler
} from 'react-native'
import { Function, STRING, array, navigateTo } from '../../Utils'
import { API, getURL } from '../../Services/API'
import { Fonts, Alert, Colors, CalendarsScreen, Metrics, Container, getAirlineLogo, Toolbar, CardComponentReview, TextView, FrameRadiusComponent, CountDown, getIcon } from '../../Components'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import moment from 'moment'
import { Parameter } from '../../Services/Parameter'
import { Text } from 'react-native-animatable';
import { JSONPostFile } from '../../Services/JsonService'
import { DotsLoader } from 'react-native-indicator';
const finish = NavigationActions.back({ key: "" });
const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
import QRCode from 'react-native-qrcode'
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
export default class DetilPemesanan extends Component {
    constructor(props) {
        super(props);
        this.state = {
            term_condition: false,
            search_param: null,
            passanger: [{
                name: 'Mr.Budi Santoso',
                email: 'budi@gmail.com',
                phone: '08567989999',
                Bagasi: 'Baggage 25kg'
            }],
            transactionCode: null,
            flightDepart: {
                book_code: null,
                airline: null,
                airlineGroup: null,
                flightNo: null,
                orgCity: null,
                desCity: null,
                depDate: null,
                airline: null,
                depTime: null,
                arrvTime: null,
                infoTransit: null,
                totalCost: null,
                flightRspDetailJsons : null

            }, flightReturn: {
                book_code: null,
                airline: null,
                airlineGroup: null,
                flightNo: null,
                orgCity: null,
                desCity: null,
                depDate: null,
                airline: null,
                depTime: null,
                arrvTime: null,
                infoTransit: null,
                totalCost: null,
                flightRspDetailJsons : null

            },
            trn_status: 'n',
            trn_Code: null

        }
    }

    departData() {
        const { params } = this.props.navigation.state;
        switch (params.slug) {
            case 'history':

                var Depart = [{
                    transaction_code :  params.data.transaction_code,
                    airlineGroup: params.data.bookings[0].flightNo.substr(0, 2).toLowerCase(),
                    depDate: params.data.bookings[0].depDate,
                    depTime: params.data.bookings[0].depTime,
                    orgCity: params.data.bookings[0].orgCity,
                    orgCode: params.data.bookings[0].orgCode,
                    desCity: params.data.bookings[0].destCity,
                    desCode: params.data.bookings[0].destCode,
                    orgAirport: params.data.bookings[0].orgAirport,
                    arrvTime: params.data.bookings[0].arvTime,
                    arrvDate: params.data.bookings[0].arvDate,
                    infoTransit: params.data.bookings[0].infoTransit,
                    desAirport: params.data.bookings[0].destAirport,
                    flightRspDetailJsons : params.data.bookings[0].flightRspDetailJson
                }]
                return Depart
            default:

                var Depart = [{
                    transaction_code : params.data.transaction_code,
                    airlineGroup: params.DataJson.flightDepart.flightNo.substr(0, 2).toLowerCase(),
                    depDate: params.DataJson.flightDepart.depDate,
                    depTime: params.DataJson.flightDepart.depTime,
                    orgCity: params.DataJson.flightDepart.orgCity,
                    orgCode: params.DataJson.flightDepart.orgCode,
                    desCity: params.DataJson.flightDepart.desCity,
                    desCode: params.DataJson.flightDepart.desCode,
                    orgAirport: params.DataJson.flightDepart.orgAirport,
                    arrvTime: params.DataJson.flightDepart.arrvTime,
                    arrvDate: params.DataJson.flightDepart.arrvDate,
                    infoTransit: params.DataJson.flightDepart.infoTransit,
                    desAirport: params.DataJson.flightDepart.desAirport,
                    flightRspDetailJsons : params.DataJson.flightDepart.flightRspDetailJson

                }]
                return Depart
        }
    }

    returnData() {
        const { params } = this.props.navigation.state;
        switch (params.slug) {
            case 'history':

                var Return = [{
                    airlineGroup: params.data.bookings[1].flightNo.substr(0, 2).toLowerCase(),
                    depDate: params.data.bookings[1].depDate,
                    depTime: params.data.bookings[1].depTime,
                    orgCity: params.data.bookings[1].orgCity,
                    orgCode: params.data.bookings[1].orgCode,
                    desCity: params.data.bookings[1].destCity,
                    desCode: params.data.bookings[1].destCode,
                    orgAirport: params.data.bookings[1].orgAirport,
                    arrvTime: params.data.bookings[1].arvTime,
                    arrvDate: params.data.bookings[1].arvDate,
                    infoTransit: params.data.bookings[1].infoTransit,
                    desAirport: params.data.bookings[1].destAirport,
                    flightRspDetailJsons : params.data.bookings[1].flightRspDetailJson
                }]
                return Return
            default:

                var Return = [{
                    airlineGroup: params.DataJson.flightReturn.flightNo.substr(0, 2).toLowerCase(),
                    depDate: params.DataJson.flightReturn.depDate,
                    depTime: params.DataJson.flightReturn.depTime,
                    orgCity: params.DataJson.flightReturn.orgCity,
                    orgCode: params.DataJson.flightReturn.orgCode,
                    desCity: params.DataJson.flightReturn.desCity,
                    desCode: params.DataJson.flightReturn.desCode,
                    orgAirport: params.DataJson.flightReturn.orgAirport,
                    arrvTime: params.DataJson.flightReturn.arrvTime,
                    arrvDate: params.DataJson.flightReturn.arrvDate,
                    infoTransit: params.DataJson.flightReturn.infoTransit,
                    desAirport: params.DataJson.flightReturn.desAirport,
                    flightRspDetailJsons : params.DataJson.flightReturn.flightRspDetailJson
                }]
                return Return
        }
    }

    millisecound(){
        const { params } = this.props.navigation.state;
        let Payment = moment(params.data.payment_limit_date ? (params.data.payment_limit_date + params.data.payment_limit_time) : (params.DataJson.paymentLimitDate + params.DataJson.paymentLimitTime)  , 'YYYYMMDDHHmmss')
        let Transaction = moment(new Date(), 'YYYYMMDDHHmmss')
        let m = moment.duration(Payment.diff(Transaction))
        console.log(' ininini > ',Payment.format('DD MM YYYY HH:mm') , ' >><< ' , Transaction.format('DD MM YYYY HH:mm') )
        return (m.seconds() + 60 * (m.minutes() + 60 * m.hours()))
    }


    ShareMessage (){
        var Passanger =[]
        this.state.passanger.map((item, i) => (
            Passanger.push(item.name)
        ))
            Share.share(
            {
                
              message: 'Pemesanan Tiket Pesawat \n' +  (this.state.flightReturn.airlineGroup? 
              ('Jadwal Penerbangan Pergi \n' + this.state.flightDepart.orgCity + ' - ' + this.state.flightDepart.desCity
             +'\nKode Transaksi : '+ this.state.flightDepart.transaction_code + '\nPesawat : ' +this.state.flightDepart.airline + ' - ' + this.state.flightDepart.flightNo 
             +'\nTanggal Keberangkatan : '+ Function.CalculateTime(this.state.flightDepart.depDate+this.state.flightDepart.depTime, this.state.flightDepart.arrvDate+this.state.flightDepart.arrvTime)
             +'\nJumlah Penumpang : ' + (this.state.flightDepart.paxAdult + this.state.flightDepart.paxChild + this.state.flightDepart.paxInfant) 
             +'\n Penumpang : '  + Passanger.toString()
             +'\n Total Harga Pergi : '  + this.state.flightDepart.totalCost
             +'\n\nJadwal Penerbangan Pulang \n' + this.state.flightReturn.orgCity + ' - ' + this.state.flightReturn.desCity
             +'\nKode Transaksi : '+ this.state.flightReturn.transaction_code + '\nPesawat : ' +this.state.flightReturn.airline + ' - ' + this.state.flightReturn.flightNo 
             +'\nTanggal Pulang : '+ Function.CalculateTime(this.state.flightReturn.depDate+this.state.flightReturn.depTime, this.state.flightReturn.arrvDate+this.state.flightReturn.arrvTime) 
             +'\nJumlah Penumpang : ' + (this.state.flightReturn.paxAdult + this.state.flightReturn.paxChild + this.state.flightReturn.paxInfant) 
             +'\n Total Harga Pulang : '  + this.state.flightReturn.totalCost ) :
             ('Jadwal Penerbangan Pergi \n' + this.state.flightDepart.orgCity + ' - ' + this.state.flightDepart.desCity
             +'\nKode Transaksi : '+ this.state.flightDepart.transaction_code + '\nPesawat : ' +this.state.flightDepart.airline + ' - ' + this.state.flightDepart.flightNo 
             +'\nTanggal Keberangkatan : '+ Function.CalculateTime(this.state.flightDepart.depDate+this.state.flightDepart.depTime, this.state.flightDepart.arrvDate+this.state.flightDepart.arrvTime)
             +'\nJumlah Penumpang : ' + (this.state.flightDepart.paxAdult + this.state.flightDepart.paxChild + this.state.flightDepart.paxInfant) 
             +'\n Penumpang : '  + Passanger.toString()
             +'\n Total Harga Pergi : '  + this.state.flightDepart.totalCost)
             )
            }).then(result => console.log(result)).catch(errorMsg => console.log(errorMsg));
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        console.log(params)
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())

        AsyncStorage.getItem('SearchFlight', (err, SearchFlight) => {
            if (SearchFlight !== null) {
                this.setState({ search_param: Function.JsonParse(SearchFlight) }, () => {

                })
            }

            switch (params.slug) {
                case 'history':
                    this.setState({
                        flightDepart: {
                            transaction_code : params.data.transaction_code,
                            book_code: params.data.bookings[0].bookCode,
                            airline: params.data.bookings[0].airline,
                            airlineGroup: params.data.bookings[0].flightNo.substr(0, 2).toLowerCase(),
                            flightNo: params.data.bookings[0].flightNo,
                            orgCity: params.data.bookings[0].orgCity,
                            desCity: params.data.bookings[0].destCity,
                            depDate: params.data.bookings[0].depDate,
                            depTime: params.data.bookings[0].depTime,
                            arrvTime: params.data.bookings[0].arvTime,
                            arrvDate : params.data.bookings[0].arrvDate,
                            infoTransit: params.data.bookings[0].infoTransit,
                            totalCost: params.data.bookings[0].totalCost,

                            paxAdult: params.data.bookings[0].paxAdult,
                            paxChild: params.data.bookings[0].paxChild,
                            paxInfant: params.data.bookings[0].paxInfant,
                            priceAdult: params.data.bookings[0].priceTotAdult,
                            priceChild: params.data.bookings[0].priceTotChild,
                            priceInfant: params.data.bookings[0].priceTotInfant,
                            priceTax: params.data.bookings[0].priceTax,
                            priceInsurance: params.data.bookings[0].priceInsurance,
                            extraFee: params.data.bookings[0].extraFee,
                            adminFee: params.data.bookings[0].adminFee,
                            discount: params.data.bookings[0].discount,
                            flightRspDetailJsons : params.data.bookings[0].flightRspDetailJson



                        },
                        trn_status: params.data.trn_status,
                        trn_Code: params.data.transaction_code
                    })

                    // console.log(params.data.bookings.length )

                    params.data.bookings.length > 1 && this.setState({
                        flightReturn: {
                            transaction_code : params.data.transaction_code,
                            book_code: params.data.bookings[1].bookCode,
                            airline: params.data.bookings[1].airline,
                            airlineGroup: params.data.bookings[1].flightNo.substr(0, 2).toLowerCase(),
                            flightNo: params.data.bookings[1].flightNo,
                            orgCity: params.data.bookings[1].orgCity,
                            desCity: params.data.bookings[1].destCity,
                            depDate: params.data.bookings[1].depDate,
                            depTime: params.data.bookings[1].depTime,
                            arrvDate : params.data.bookings[1].arrvDate,
                            arrvTime: params.data.bookings[1].arvTime,
                            infoTransit: params.data.bookings[1].infoTransit,
                            totalCost: params.data.bookings[1].totalCost,

                            paxAdult: params.data.bookings[1].paxAdult,
                            paxChild: params.data.bookings[1].paxChild,
                            paxInfant: params.data.bookings[1].paxInfant,
                            priceAdult: params.data.bookings[1].priceTotAdult,
                            priceChild: params.data.bookings[1].priceTotChild,
                            priceInfant: params.data.bookings[1].priceTotInfant,
                            priceTax: params.data.bookings[1].priceTax,
                            priceInsurance: params.data.bookings[1].priceInsurance,
                            extraFee: params.data.bookings[1].extraFee,
                            adminFee: params.data.bookings[1].adminFee,
                            discount: params.data.bookings[1].discount,
                            flightRspDetailJsons : params.data.bookings[1].flightRspDetailJson

                        },
                    })
                    let i = 0
                    let j = 0
                    var ArrayPassangger = []
                    var passanger = params.data.bookings[0].passengers

                    while (i < passanger.length) {
                        console.log(passanger)
                        ArrayPassangger.push({
                            type :passanger[i].passengerType,
                            name: passanger[i].tittle + ' ' + passanger[i].firstName + ' ' + passanger[i].lastName,
                            email: '-',
                            phone: passanger[i].mobilePhone ? passanger[i].mobilePhone : '679809070894586' ,
                            birthdate: (passanger[i].passengerType === 'CHILD' || passanger[i].passengerType === 'INFANT') ? passanger[i].birthdate : '',
                            bagasi: 'Bagasi 25 kg'
                        })

                        i++
                    }
                    this.setState({ passanger: ArrayPassangger })
                    break
                default:
                console.log('ininini' ,params.DataJson.flightDepart.arrvDate, params.DataJson.flightDepart.arrvTime)
                    this.setState({
                        flightDepart: {
                            transaction_code : params.DataJson.transactionCode,
                            airline: params.DataJson.flightDepart.airline,
                            airlineGroup: params.DataJson.flightDepart.flightNo.substr(0, 2).toLowerCase(),
                            flightNo: params.DataJson.flightDepart.flightNo,
                            orgCity: params.DataJson.flightDepart.orgCity,
                            desCity: params.DataJson.flightDepart.desCity,
                            depDate: params.DataJson.flightDepart.depDate,
                            depTime: params.DataJson.flightDepart.depTime,
                            arrvDate: params.DataJson.flightDepart.arrvDate,
                            arrvTime: params.DataJson.flightDepart.arrvTime,
                            infoTransit: params.DataJson.flightDepart.infoTransit,
                            totalCost: params.DataJson.flightDepart.totalCost,

                            paxAdult: params.DataJson.flightDepart.paxAdult,
                            paxChild: params.DataJson.flightDepart.paxChild,
                            paxInfant: params.DataJson.flightDepart.paxInfant,
                            priceAdult: params.DataJson.flightDepart.priceTotAdult,
                            priceChild: params.DataJson.flightDepart.priceTotChild,
                            priceInfant: params.DataJson.flightDepart.priceTotInfant,
                            priceTax: params.DataJson.flightDepart.priceTax,
                            priceInsurance: 0,
                            extraFee: params.DataJson.flightDepart.extraFee,
                            adminFee: params.DataJson.flightDepart.adminFee,
                            discount: params.DataJson.flightDepart.discount,
                            flightRspDetailJsons : params.DataJson.flightDepart.flightRspDetailJson
                        }, trn_Code: params.DataJson.transactionCode
                    })
                    var ArrayPassangger = []
                    for (let A = 0; A < this.state.search_param[0].adult; A++) {
                        ArrayPassangger.push({
                            type : 'Adult',
                            name: params.data['titleAdult_' + A] + ' ' + params.data['firstNameAdult_' + A] + ' ' + params.data['lastNameAdult_' + A],
                            email: '',
                            phone: '679809070894586',
                            bagasi: 'Bagasi 25 kg'
                        })
                    }
                    for (let c = 0; c < this.state.search_param[1].child; c++) {
                        ArrayPassangger.push({
                            name: params.data['titleChild_' + c] + ' ' + params.data['firstNameChild_' + c] + ' ' + params.data['lastNameChild_' + c],
                            type : 'Child',
                            email: '',
                            phone: '679809070894586',
                            bagasi: 'Bagasi 25 kg'
                        })
                    }
                    for (let i = 0; i < this.state.search_param[2].infant; i++) {
                        ArrayPassangger.push({
                            type : 'Infant',
                            name: params.data['titleInfant_' + i] + ' ' + params.data['firstNameInfant_' + i] + ' ' + params.data['lastNameInfant_' + i],
                            email: '',
                            phone: '679809070894586',
                            bagasi: 'Bagasi 25 kg'
                        })
                    }
                    this.setState({ passanger: ArrayPassangger })

                    Function.ObjectNull(params.DataJson, 'flightReturn') && this.setState({
                        flightReturn: {
                            transaction_code : params.DataJson.transactionCode,
                            airline: params.DataJson.flightReturn.airline,
                            airlineGroup: params.DataJson.flightReturn.flightNo.substr(0, 2).toLowerCase(),
                            flightNo: params.DataJson.flightReturn.flightNo,
                            orgCity: params.DataJson.flightReturn.orgCity,
                            desCity: params.DataJson.flightReturn.desCity,
                            depDate: params.DataJson.flightReturn.depDate,
                            depTime: params.DataJson.flightReturn.depTime,
                            arrvDate: params.DataJson.flightReturn.arrvDate,
                            arrvTime: params.DataJson.flightReturn.arrvTime,
                            infoTransit: params.DataJson.flightReturn.infoTransit,
                            totalCost: params.DataJson.flightReturn.totalCost,


                            paxAdult: params.DataJson.flightReturn.paxAdult,
                            paxChild: params.DataJson.flightReturn.paxChild,
                            paxInfant: params.DataJson.flightReturn.paxInfant,
                            priceAdult: params.DataJson.flightReturn.priceTotAdult,
                            priceChild: params.DataJson.flightReturn.priceTotChild,
                            priceInfant: params.DataJson.flightReturn.priceTotInfant,
                            priceTax: params.DataJson.flightReturn.priceTax,
                            priceInsurance: 0,
                            extraFee: params.DataJson.flightReturn.extraFee,
                            adminFee: params.DataJson.flightReturn.adminFee,
                            discount: params.DataJson.flightReturn.discount,
                            flightRspDetailJsons : params.DataJson.flightReturn.flightRspDetailJson
                        }
                    })
                    break
            }



        })


    }
    backAndroid() {
        const { params } = this.props.navigation.state;
        if (params.slug === 'history') {
            this.props.navigation.dispatch(finish)
        } else {
            navigateTo('FlightScreen', this.props.dispatch, this.props.navigation, null)
        }
        return true
    }
    ActivityResult = (data) => {
        switch (data.slug) {
            case 'depart_date':

                break
        }
    }

    Auth = () => {
        const { params } = this.props.navigation.state;
        try {

            this.setState({ loading: true })
            let url = getURL('url_post_padipay_req')
            let param = Parameter.Payment(this.state.trn_Code)

            JSONPostFile(url, param).then((Respone) => {
                console.log('Respone')
                console.log(Respone)
                this.setState({ loading: false })

                switch (Respone.respCode) {

                    case '0':
                        this.setState({ loading: false }, () => {
                            this.props.navigation.navigate('PaymentFlightINT', { DataJson: Respone })


                        })
                        break
                    default:
                        Alert(Respone.inRespMsg)
                        break
                }

            }).catch((err) => {
                console.log('err >>> ' + err)
            })
        } catch (Error) {
            console.log('Error >>> ', Error)
        }

    }

    render() {

        const { params } = this.props.navigation.state;

        return (
            <View style={styles.frame} >
                <Toolbar
                    arrow_back
                    onPress={() => this.backAndroid()}
                    View={
                        <TextView
                            style={styles.lableTitle}
                            text={STRING.Label.detil_payment}
                        />
                    }
                />
                <ScrollView style={{ flex: 1, }}>
                    <View style={{ backgroundColor: Colors.whitesmoke }} >
                    <View style ={{height : Scale(70),backgroundColor : Colors.white, padding : Scale(16), marginBottom : Scale(2)}}>
                    <TextView style={{fontSize : Scale(12),color: "#59af1c", textAlign: "center", }}> {'Harga telah dikonfirmasi oleh maskapai, mohon cek kembali pesanan Anda sebelum lanjut ke pembayaran'} </TextView>
                    </View>
                    
                        <View style={{ backgroundColor: Colors.white, }}>
                            <TouchableComponent
                                onPress={() => this.props.navigation.navigate('detil', {
                                    data: {
                                        flightNo: Function.ObjectNull(params,'DataJson') ? params.DataJson.flightDepart.flightNo : params.data.bookings[0].flightNo,
                                        airline: Function.ObjectNull(params,'DataJson')  ? params.DataJson.flightDepart.airline : params.data.bookings[0].airline,
                                        currency: 'IDR',
                                        price:Function.ObjectNull(params,'DataJson')  ? params.DataJson.flightDepart.totalCost : params.data.bookings[0].totalCost,
                                        infoTransit:Function.ObjectNull(params,'DataJson')  ? params.DataJson.flightDepart.infoTransit : params.data.bookings[0].infoTransit,
                                        flightRspDetailJsons: this.departData()[0].flightRspDetailJsons
                                    },
                                    airlineGroup: this.departData()[0].airlineGroup,
                                    slug: 'depart'
                                })}>
                                <View style={{ flex: 1, paddingTop: Metrics.normalPadding, paddingLeft: Metrics.normalPadding, paddingRight: Metrics.normalPadding, flexDirection: 'row', justifyContent: 'center' }}>
                                    <View style={{ flex: 1 }}>
                                        <TextView
                                            style={[styles.titlePassanger, {bottom : Scale(4)}]}> {STRING.Label_Flight.lbl_org_flight} </TextView>
                                            <TextView
                                            style={{fontSize : Scale(12), bottom : Scale(4)}}> {Function.FormeteDate(this.state.flightDepart.depDate, 'YYYYMMDD', 'dddd ,DD MMM YYYY')} </TextView>
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <TextView
                                            style={[styles.titlePassanger,{color : Colors.tangerine}]}> {STRING.Label.detil} </TextView>
                                    </View>
                                </View>
                            </TouchableComponent>

                           <View>
                                    <View style={{ backgroundColor: Colors.white, paddingLeft: Metrics.normalPadding, paddingRight: Metrics.normalPadding}} >
                                        <CardComponentReview
                                            image={getAirlineLogo(this.state.flightDepart.airlineGroup && this.state.flightDepart.airlineGroup.toLowerCase())}
                                            width ={Metrics.screenWidth}
                                            txt_food ={this.state.flightReturn.airlineGroup && this.state.flightReturn.airlineGroup.toLowerCase()}
                                            img_food ={this.state.flightReturn.airlineGroup && this.state.flightReturn.airlineGroup.toLowerCase()}
                                            // flightNo={this.state.flightDepart.flightNo}
                                            city={this.state.flightDepart.orgCity + ' - ' + this.state.flightDepart.desCity}
                                            // date={Function.FormeteDate(this.state.flightDepart.depDate, 'YYYYMMDD', 'dddd ,DD MMM YYYY')}
                                            transport={this.state.flightDepart.airline + ' - ' + this.state.flightDepart.flightNo}
                                            trafic={this.state.flightDepart.depTime &&Function.CalculateTime(this.state.flightDepart.depDate+this.state.flightDepart.depTime, this.state.flightDepart.arrvDate+this.state.flightDepart.arrvTime)}
                                        />
                                    </View>
                                </View>
                        </View>



                        {this.state.flightReturn.airlineGroup &&
                            <View style={{ backgroundColor: Colors.white }}>
                                <TouchableComponent
                                    onPress={() => this.props.navigation.navigate('detil', { data: { 
                                    flightNo: Function.ObjectNull(params,'DataJson') ? params.DataJson.flightReturn.flightNo :params.data.bookings[1].flightNo, 
                                    airline: Function.ObjectNull(params,'DataJson') ? params.DataJson.flightReturn.airline :params.data.bookings[1].airline, 
                                    infoTransit: Function.ObjectNull(params,'DataJson') ? params.DataJson.flightReturn.infoTransit : params.data.bookings[1].infoTransit, 
                                    currency: 'IDR', 
                                    price: Function.ObjectNull(params,'DataJson') ? params.DataJson.flightReturn.totalCost : params.data.bookings[1].totalCost, 
                                    flightRspDetailJsons: this.returnData()[0].flightRspDetailJsons }, 
                                    airlineGroup: this.departData()[0].airlineGroup, slug: 'return' })}>
                                    <View style={{ flex: 1, paddingTop: Metrics.normalPadding, paddingLeft: Metrics.normalPadding, paddingRight: Metrics.normalPadding, flexDirection: 'row' }}>
                                        <View>
                                            <TextView
                                                style={styles.titlePassanger}> {STRING.Label_Flight.lbl_dep_flight} </TextView>

                                                <TextView
                                            style={{fontSize : Scale(12), bottom : Scale(4)}}> {Function.FormeteDate(this.state.flightReturn.depDate, 'YYYYMMDD', 'dddd ,DD MMM YYYY')} </TextView>
                                        </View>
                                        <View style={{ flex: 1, alignItems: 'flex-end', }}>
                                            <TextView
                                            style={[styles.titlePassanger, { color: Colors.tangerine }]}> {STRING.Label.detil} </TextView>
                                        </View>

                                    </View>
                                </TouchableComponent>

                                
                                    <View style={{ backgroundColor: Colors.white, paddingLeft: Metrics.normalPadding, paddingRight: Metrics.normalPadding}} >
                                        <View>
                                            <CardComponentReview
                                                image={getAirlineLogo(this.state.flightReturn.airlineGroup && this.state.flightReturn.airlineGroup.toLowerCase())}
                                                // flightNo={this.state.flightReturn.flightNo}
                                                txt_food ={this.state.flightReturn.airlineGroup && this.state.flightReturn.airlineGroup.toLowerCase()}
                                                img_food ={this.state.flightReturn.airlineGroup && this.state.flightReturn.airlineGroup.toLowerCase()}
                                                width ={Metrics.screenWidth}
                                                // city={this.state.flightReturn.orgCity + ' - ' + this.state.flightReturn.desCity}
                                                date={Function.FormeteDate(this.state.flightReturn.depDate, 'YYYYMMDD', 'dddd ,DD MMM YYYY')}
                                                transport={this.state.flightReturn.airline + ' - ' + this.state.flightReturn.flightNo}
                                                trafic={this.state.flightReturn.depTime && Function.CalculateTime(this.state.flightReturn.depDate+this.state.flightReturn.depTime, this.state.flightReturn.arrvDate+this.state.flightReturn.arrvTime)}
                                            />

                                        </View>

                                        
                                    </View>
                            </View>

                        }

                        <View style={{ backgroundColor: Colors.white, padding: Metrics.normalPadding, marginTop: 4 }} >
                            <TextView
                                style={[styles.titlePassanger, { color: Colors.warm_grey }]}
                                text={STRING.Passanger.title}
                            />


                            {this.state.passanger.map((item, i) => (
                                <View style={{ flexDirection: 'row', marginTop: 8 }}>
                                    <View style={{ width : Metrics.screenWidth/2, flexDirection: 'row'}}>
                                    <View>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: 13, color: Colors.black }]}
                                            text={(i + 1) + '.'}
                                        />
                                    </View>

                                    <View style={{ marginLeft: 4 }}>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: 13, color: Colors.black,  }]}
                                            text={item.name}
                                        />

                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: 13, color: '#bbbbbb' }]}
                                            text={(item.phone ? item.phone + '\n' : '679809070894586'+ '\n')+ (item.birthdate ?  Function.FormeteDate(item.birthdate, 'YYYYMMDD','DD MMM YYYY')+ '\n' : '')+ item.bagasi }
                                        />
                                    </View>
                                    </View>

                                    <View style={{ width : Metrics.screenWidth/2.5, justifyContent : 'flex-start', alignItems: 'flex-end', bottom: Scale(8) }}>
                                    <View style ={{width : Scale(60),borderWidth: 1,borderRadius : Scale(6), borderColor : '#bbbbbb', justifyContent : 'center', alignItems : 'center'}}>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: 13, color: '#bbbbbb', bottom: Scale(0) }]}
                                            text={item.type}
                                        />
                                         </View>
                                    </View>
                                </View>
                            ))}

                        </View>

                        <View style={{ backgroundColor: Colors.white, padding: Metrics.normalPadding, marginTop: 4 }} >
                            <TextView
                                style={[styles.titlePassanger, { color: Colors.warm_grey }]}
                                text={STRING.Passanger.price_go}
                            />

                            <View style={{ flexDirection: 'row', marginTop: Scale(8) }}>
                                <View>

                                    <TextView
                                        style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                        text={STRING.Passanger.adult + ' (' + this.state.flightDepart.paxAdult + 'x)'}
                                    />
                                </View>

                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <TextView
                                        style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                        text={this.state.flightDepart.priceAdult && ('IDR ' + Function.convertToPrice(this.state.flightDepart.priceAdult))}
                                    />
                                </View>
                            </View>


                            {this.state.flightDepart.priceChild !== 0 && <View style={{ flexDirection: 'row', marginTop: Scale(8) }}>
                                <View>
                                    <TextView
                                        style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                        text={this.state.flightDepart.paxChild && STRING.Passanger.child + ' (' + this.state.flightDepart.paxChild + 'x)'}
                                    />
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <TextView
                                        style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                        text={this.state.flightDepart.priceChild && ('IDR ' + Function.convertToPrice(this.state.flightDepart.priceChild))}
                                    />
                                </View>
                            </View>}

                            {this.state.flightDepart.priceInfant !== 0 && <View style={{ flexDirection: 'row', marginTop: Scale(8) }}>
                                <View>
                                    <TextView
                                        style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                        text={this.state.flightDepart.paxInfant && STRING.Passanger.infant + ' (' + this.state.flightDepart.paxInfant + 'x)'}
                                    />
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <TextView
                                        style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                        text={this.state.flightDepart.priceInfant && ('IDR ' + Function.convertToPrice(this.state.flightDepart.priceInfant))}
                                    />
                                </View>
                            </View>}

                            {this.state.flightDepart.priceTax !== 0 && <View style={{ flexDirection: 'row', marginTop: Scale(8) }}>
                                <View>
                                    <TextView
                                        style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                        text={this.state.flightDepart.priceTax && STRING.Passanger.tax}
                                    />
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <TextView
                                        style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                        text={this.state.flightDepart.priceTax && ('IDR ' + Function.convertToPrice(this.state.flightDepart.priceTax))}
                                    />
                                </View>
                            </View>}


                            {this.state.flightDepart.priceInsurance !== 0 && <View style={{ flexDirection: 'row', marginTop: Scale(8) }}>
                                <View>
                                    <TextView
                                        style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                        text={this.state.flightDepart.priceInsurance && STRING.Passanger.Insurance}
                                    />
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <TextView
                                        style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                        text={this.state.flightDepart.priceInsurance && ('IDR ' + Function.convertToPrice(this.state.flightDepart.priceInsurance))}
                                    />
                                </View>
                            </View>}

                            {this.state.flightDepart.adminFee !== 0 && <View style={{ flexDirection: 'row', marginTop: Scale(8) }}>
                                <View>
                                    <TextView
                                        style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                        text={this.state.flightDepart.adminFee && STRING.Passanger.adminFee}
                                    />
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <TextView
                                        style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                        text={this.state.flightDepart.adminFee && ('IDR ' + Function.convertToPrice(this.state.flightDepart.adminFee))}
                                    />
                                </View>
                            </View>}

                            {this.state.flightDepart.discount !== 0 && <View style={{ flexDirection: 'row', marginTop: Scale(8) }}>
                                <View>
                                    <TextView
                                        style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                        text={this.state.flightDepart.discount && STRING.Passanger.discount}
                                    />
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <TextView
                                        style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                        text={this.state.flightDepart.discount && ('IDR ' + Function.convertToPrice(this.state.flightDepart.discount))}
                                    />
                                </View>
                            </View>}

                            {/* ==================================== */}

                            {this.state.flightReturn.airline && <View>
                                <View style={styles.line} />

                                <TextView
                                    style={[styles.titlePassanger, { color: Colors.warm_grey }]}
                                    text={STRING.Passanger.price_goback}
                                />

                                <View style={{ flexDirection: 'row', marginTop: Scale(8) }}>
                                    <View>

                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                            text={this.state.flightReturn.paxAdult && STRING.Passanger.adult + ' (' + this.state.flightReturn.paxAdult + 'x)'}
                                        />
                                    </View>

                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                            text={this.state.flightReturn.priceAdult && ('IDR ' + Function.convertToPrice(this.state.flightReturn.priceAdult))}
                                        />
                                    </View>
                                </View>


                                {this.state.flightReturn.priceChild !== 0 && <View style={{ flexDirection: 'row', marginTop: Scale(8) }}>
                                    <View>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                            text={this.state.flightReturn.paxChild && STRING.Passanger.child + ' (' + this.state.flightReturn.paxChild + 'x)'}
                                        />
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                            text={this.state.flightReturn.priceChild && ('IDR ' + Function.convertToPrice(this.state.flightReturn.priceChild))}
                                        />
                                    </View>
                                </View>}

                                {this.state.flightReturn.priceInfant !== 0 && <View style={{ flexDirection: 'row', marginTop: Scale(8) }}>
                                    <View>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                            text={this.state.flightReturn.paxInfant && STRING.Passanger.child + ' (' + this.state.flightReturn.paxInfant + 'x)'}
                                        />
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                            text={this.state.flightReturn.priceInfant && ('IDR ' + Function.convertToPrice(this.state.flightReturn.priceInfant))}
                                        />
                                    </View>
                                </View>}

                                {this.state.flightReturn.priceTax !== 0 && <View style={{ flexDirection: 'row', marginTop: Scale(8) }}>
                                    <View>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                            text={this.state.flightReturn.priceTax && STRING.Passanger.tax}
                                        />
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                            text={this.state.flightReturn.priceTax && ('IDR ' + Function.convertToPrice(this.state.flightReturn.priceTax))}
                                        />
                                    </View>
                                </View>}


                                {this.state.flightReturn.priceInsurance !== 0 && <View style={{ flexDirection: 'row', marginTop: Scale(8) }}>
                                    <View>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                            text={this.state.flightReturn.priceInsurance && STRING.Passanger.Insurance}
                                        />
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                            text={this.state.flightReturn.priceInsurance && ('IDR ' + Function.convertToPrice(this.state.flightReturn.priceInsurance))}
                                        />
                                    </View>
                                </View>}

                                {this.state.flightReturn.extraFee !== 0 && <View style={{ flexDirection: 'row', marginTop: Scale(8) }}>
                                    <View>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                            text={this.state.flightReturn.extraFee && STRING.Passanger.extraFee}
                                        />
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                            text={this.state.flightReturn.extraFee && ('IDR ' + Function.convertToPrice(this.state.flightReturn.extraFee))}
                                        />
                                    </View>
                                </View>}


                                {this.state.flightReturn.adminFee !== 0 && <View style={{ flexDirection: 'row', marginTop: Scale(8) }}>
                                    <View>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                            text={this.state.flightReturn.adminFee && STRING.Passanger.adminFee}
                                        />
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                            text={this.state.flightReturn.adminFee && ('IDR ' + Function.convertToPrice(this.state.flightReturn.adminFee))}
                                        />
                                    </View>
                                </View>}

                                {this.state.flightReturn.discount !== 0 && <View style={{ flexDirection: 'row', marginTop: Scale(8) }}>
                                    <View>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                            text={this.state.flightReturn.discount && STRING.Passanger.discount}
                                        />
                                    </View>
                                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(14), color: '#222222' }]}
                                            text={this.state.flightReturn.discount && ('IDR ' + Function.convertToPrice(this.state.flightReturn.discount))}
                                        />
                                    </View>
                                </View>}
                            </View>}
                            {/* ==================================== */}

                            <View style={styles.line} />

                            <View style={{ flex: 1, flexDirection: 'row', marginTop: Scale(8) }}>
                                <View>
                                    <TextView
                                        style={[styles.titlePassanger, { fontSize: Scale(16), color: '#222222' }]}
                                        text={STRING.payment.total}
                                    />
                                </View>

                                <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                    <TextView
                                        style={[styles.titlePassanger, { fontSize: Scale(20), color: Colors.tangerine }]}
                                        text={this.state.flightDepart.totalCost && ('IDR ' + Function.convertToPrice(this.state.flightReturn.totalCost ? (parseInt(this.state.flightDepart.totalCost) + parseInt(this.state.flightReturn.totalCost)) : this.state.flightDepart.totalCost))}
                                    />
                                </View>
                            </View>
                        </View>

                         {/* ==== */}
                    <View style={[styles.frame_dua]}>
                    <TouchableComponent
                    onPress ={ () =>  Linking.openURL('tel://'+'021-2221 4018')}>
                        <View style={{ flexDirection: 'row' }}>

                        <View>
                                <View>
                                <Image
                                source={getIcon('ic_headset')}
                                resizeMode='contain'
                                style={{height : Scale(30), width : Scale(30), tintColor : Colors.gray, marginRight : Scale(16)}}
                            />
                                </View>
                            </View>
                            <View style={{marginLeft : Scale(4) }}>
                                <TextView style={{ fontSize: Scale(14), color: Colors.black,fontWeight: 'bold' }} text={"Customer Service"} />
                                <TextView style={{ fontSize: Scale(14), color: "#666666", fontWeight: 'bold' }} text={"021-2221 4018"} />
                            </View>
                            
                        </View>
                        </TouchableComponent>
                    </View>


{/* ==== */}
                    <View style={[styles.frame_dua]}>
                    <TouchableComponent
                    onPress ={ () => Linking.openURL('whatsapp://send?phone='+ '628558214018')}>
                        <View style={{ flexDirection: 'row' }}>

                            <View>
                                <View>
                                    <Image
                                        source={getIcon('ic_whatsapp')}
                                        resizeMode='contain'
                                        style={{ height: Scale(30), width: Scale(30), tintColor: Colors.gray, marginRight: Scale(16) }}
                                    />
                                </View>
                            </View>

                            <View style={{ marginLeft: Scale(4) }}>
                                <TextView style={{ fontSize: Scale(14), color: Colors.black, fontWeight: 'bold' }} text={"Whatsapp"} />
                                <TextView style={{ fontSize: Scale(14), color: "#666666", fontWeight: 'bold' }} text={"+62 8558 2140 18"} />
                            </View>

                        </View>
                        </TouchableComponent>
                    </View>
                    {/* ==== */}
                        <View style={[styles.frame_dua]}>
                            <TouchableComponent
                                onPress={() => Linking.openURL('mailto:cs@padiciti.com?subject=Hallo&body=body')}>
                                <View style={{ flexDirection: 'row' }}>

                                    <View>
                                        <View>
                                            <Image
                                                source={getIcon('ic_email')}
                                                resizeMode='contain'
                                                style={{ height: Scale(30), width: Scale(30), tintColor: Colors.gray, marginRight: Scale(16) }}
                                            />
                                        </View>
                                    </View>

                                    <View style={{ marginLeft: Scale(4) }}>
                                        <TextView style={{ fontSize: Scale(14), color: Colors.black, fontWeight: 'bold' }} text={"Email"} />
                                        <TextView style={{ fontSize: Scale(14), color: "#666666", fontWeight: 'bold' }} text={"cs@padiciti.com"} />
                                    </View>

                                </View>
                            </TouchableComponent>
                        </View>

                        {/* ===== */}

                        <View style={[styles.frame_dua]}>
                            <TouchableComponent
                                onPress={() => this.ShareMessage()}>
                                <View style={{ flexDirection: 'row' }}>

                                    <View>
                                        <View>
                                            <Image
                                                source={getIcon('ic_share')}
                                                resizeMode='contain'
                                                style={{ height: Scale(30), width: Scale(30), tintColor: Colors.gray, marginRight: Scale(16) }}
                                            />
                                        </View>
                                    </View>

                                    <View style={{ marginLeft: Scale(4) }}>
                                        <TextView style={{ fontSize: Scale(14), color: Colors.black, fontWeight: 'bold' }} text={"Share"} />
                                    </View>

                                </View>
                            </TouchableComponent>
                        </View>

                        {(this.state.trn_status.toLowerCase() !== 'p' && this.state.trn_status.toLowerCase() !== 'c' && this.state.trn_status.toLowerCase() !== 'x' && this.state.trn_status.toLowerCase() !== 'y') && 
                         <View style ={{padding : Scale(16) , backgroundColor : Colors.white, top : Scale(16),}}>
                        <TouchableComponent
                            onPress={() => this.Auth()} >
                            <View style={{
                                flex: 1, justifyContent: 'center',
                                alignItems: 'center',
                                marginTop: Scale(16),
                                height: Scale(45),
                                borderRadius: Scale(4),
                                backgroundColor: Colors.tangerine
                            }}>
                                <Text style={{ color: Colors.white, fontSize: Fonts.size.large, }}>{STRING.payment.chouse}</Text>
                            </View>
                        </TouchableComponent>
                        <View style ={{ flex : 1, flexDirection : 'row', alignItems : 'center', justifyContent : 'center', marginTop : Scale(8), height : Scale(40)}}>
                            </View>                        
                        </View>}
                    </View>
                </ScrollView>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    frame: {
        flex: 1,
        backgroundColor: Colors.whitesmoke
    },
    frame_dua: {
      marginRight : Scale(16),
      marginLeft : Scale(16),
        borderRadius: Scale(6),
        padding : Scale(16),
        marginTop : Scale(4),
        backgroundColor: "#ffffff"
    },
    lableTitle: {
        fontSize: Scale(18), color: Colors.white
    },
    titlePassanger: {
        fontSize: Scale(14),
        bottom: Scale(8),
        color: Colors.blue
    },
    titleLable: {
        marginTop: Scale(16),
        fontSize: Scale(16),
        color: Colors.warm_grey
    },
    frameTextInput: {
        height: Scale(40),
        justifyContent: 'center'
    }, line: {
        marginTop: Scale(16),
        marginBottom: Scale(16),
        height: Scale(2),
        backgroundColor: Colors.whitesmoke,
    },
});
AppRegistry.registerComponent("padiciti", () => Review);
