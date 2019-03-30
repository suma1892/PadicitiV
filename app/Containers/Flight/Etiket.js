import React, { Component } from 'react'
import { Alert, KeyboardAvoidingView,CardDetil,TextView as Text, RadioButtons, Colors, Scale, CalendarsScreen,Container, getIcon, Toolbar, CardComponentReview, TextView, FrameRadiusComponent, CheckBox, Loading, DialogComponent, Fonts, ItemField } from '../../Components'
import { CardSortTrain, CardShortPax } from '../../Components/TrainCardComponent';
import {
    AsyncStorage,
    TextInput,
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image, Platform, Dimensions, AppRegistry, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableOpacity, Linking,Alert as Confirmation
} from 'react-native'
import {NavigationActions } from 'react-navigation';
import moment from 'moment';
import {getURL } from '../../Services/API'
import { JSONGet_ } from '../../Services/JsonService'
import {  STRING,Function } from '../../Utils';
import { _OS, Metrics,getAirlineLogo } from '../../Assets';
import Barcode from 'react-native-barcode-builder'
const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
const backAction = NavigationActions.back({ key: '' })
import { setPaxSeats } from '../../Utils/TrainUtils';
export default class EtiketFlight extends Component {

    constructor(props) {
        super(props);
        this.state = {
            term_condition: false,
            search_param: null,
            loading : false,
            passanger: [{
                name: 'Mr.Budi Santoso',
                email: 'budi@gmail.com',
                phone: '08567989999',
                Bagasi: 'Baggage 25kg'
            }],
            transactionCode: null,
            actionGo : true,
            actionBack : true,
            trn_status: 'n',
            trn_Code: null

        }
        
    }

    componentDidMount(){
        const { params } = this.props.navigation.state;
        let i = 0
        let j = 0
        var ArrayPassangger = []
        var passanger = params.data.bookings[0].passengers
        console.log(params.data)
        while (i < passanger.length) {
           
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
    }

    SendReceipt () {
        this.setState({ loading: true })
        const { navigation } = this.props   
        const { params } = navigation.state
        let url = getURL('url_get_resend_email_flight')
        

        JSONGet_(url, '?transaction_code='+params.data.transaction_code)
            .then((respone) => {
                var Respone = respone.data
                console.log(Respone)
                this.setState({ loading: false })
            })
            .catch((error) => {
                console.log(error)
                this.setState({ loading: false })
                Alert(STRING.Warrning.no_connection)
            })
    }

    departData() {
        const { params } = this.props.navigation.state;
        console.log(params)
        switch (params.slug) {
            case 'history':

                var Depart = {
                    transaction_code : params.data.transaction_code,
                    book_code: params.data.bookings[0].bookCode,
                    flightNo : params.data.flightNo,
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
                    flightRspDetailJson : params.data.bookings[0].flightRspDetailJson,
                    price : params.data.bookings[0].totalCost,
                }
                return Depart
           
        }
    }

    returnData() {
        const { params } = this.props.navigation.state;
        switch (params.slug) {
            case 'history':

                var Return = {
                    book_code: params.data.bookings[1].bookCode,
                    flightNo : params.data.flightNo,
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
                    flightRspDetailJson : params.data.bookings[1].flightRspDetailJson,
                    price : params.data.bookings[1].totalCost,
                }
                return Return
    
        }
    }

    render() {
        const { dispatch, navigate } = this.props.navigation;
        const { params } = this.props.navigation.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#f4f6f9' }} >
                <Toolbar
                    arrow_back
                    onPress={() =>  this.props.navigation.dispatch(backAction)}
                    View={
                        <View>
                            <TextView style={{ fontSize: Scale(14), color: Colors.white }} text={this.departData().orgCity+'('+this.departData().orgCode+')' + ' - '+this.departData().desCity+'('+this.departData().desCode+')'} />
                            <TextView style={{ fontSize: Scale(14), color: Colors.white, fontWeight: 'bold' }} text={'Transaction Code : ' + this.departData().transaction_code} />
                        </View>
                    }
                />
                <ScrollView
                    style={{ flex: 1 }}>
                    <View style={{ margin: Scale(16) }}>

                        <View style={{ width: Metrics.screenWidth, alignItems: 'center' }}>
                            <TextView style={{ fontSize: Scale(14), color: '#666666', fontWeight: 'bold' }} text={"Flight E-Ticket"} />
                        </View>

                        <View style={[styles.frame, { justifyContent: 'center' }]}>
                            <View style={{width : Metrics.screenWidth/2,}}>
                                    <TextView style={{ fontSize: Scale(13), color: '#888888' }} text={"Airline Booking Code (PNR)"} />
                                    <TextView style={{ fontSize: Scale(14), color: 'black', fontWeight: 'bold' }} text={this.departData().book_code} />
                                </View>
                        </View>
                        

                        <View style={[styles.frame, { flex :1 }]}>
                            <TouchableComponent onPress={() => this.setState({actionGo : !this.state.actionGo })}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: Metrics.screenWidth / 2 }}>
                                        <TextView style={{ fontSize: Scale(16), color: Colors.blue, fontWeight: 'bold' }} text={"Penerbangan Pergi"} />
                                        <TextView style={{ fontSize: Scale(12), color: '#888888' }} text={moment(this.departData().depDate, 'YYYYMMDD').format('dddd, DD MMM YYYY')} />
                                    </View>
                                    <View style={{ width: Metrics.screenWidth / 3, alignItems: 'flex-end' }}>
                                        <Image
                                            source={getIcon('ic_arrow_down')}
                                            resizeMode='contain'
                                            style={{ height: Scale(20), width: Scale(20), tintColor: Colors.tangerine, marginRight: Scale(16) }} />
                                    </View>

                                </View>
                            </TouchableComponent>

                            {this.state.actionGo && <View style={{ height: Scale(2), backgroundColor: '#dddddd', marginTop: Scale(16) }} />}
                            {this.state.actionGo &&<FlatList
                                scrollEnabled={false}
                                style={{ backgroundColor: Colors.white }}
                                data={this.departData().flightRspDetailJson}
                                keyExtractor={(item, index) => `key-${index}`}
                                renderItem={({ item, index }) => (
                                    <View style ={{paddingRight : Scale (16)}}>
                                        <CardDetil
                                        icon={getAirlineLogo(item.flightNo.substr(0, 2).toLowerCase())}
                                        FlightNo={item.flightNo}
                                        transport_name={params.data.airline}
                                        org_time={Function.SubstringTime(item.depTime)}
                                        org={Function.FormeteDate(item.depDate, 'YYYYMMDD', 'DD MMM')}
                                        detil_org={item.orgCity + ' (' + item.orgCode + ')'}
                                        bandara_org={item.orgAirport}
                                        widthBandaraAirport ={Scale(100)}
                                        dest_time={Function.SubstringTime(item.arrvTime)}
                                        dest={Function.FormeteDate(item.arrvDate, 'YYYYMMDD', 'DD MMM')}
                                        transport_time={Function.CalculateTime(item.depDate + item.depTime, item.arrvDate + item.arrvTime)}
                                        detil_des={item.desCity + ' (' + item.desCode + ')'}
                                        bandara_dest={item.desAirport}
                                        widthBandara_dest ={Scale(100)}
                                        total_index={this.departData().flightRspDetailJson.length}
                                        index={index + 1}
                                        transit={index + 1 !== this.departData().flightRspDetailJson.length ? this.departData().flightRspDetailJson[index + 1].orgCity + ' (' + this.departData().flightRspDetailJson[index + 1].orgCode + ') ' + STRING.Label_Flight.for + Function.CalculateTime(this.departData().flightRspDetailJson[index].arrvDate + this.departData().flightRspDetailJson[index].arrvTime, this.departData().flightRspDetailJson[index + 1].depDate + this.departData().flightRspDetailJson[index + 1].depTime) : null}

                                    />

                                    </View>)}
                            />}
                        </View>


                        {params.data.bookings.length > 1 && <View style={[styles.frame, { justifyContent: 'center' }]}>
                            <View style={{width : Metrics.screenWidth/2,}}>
                                    <TextView style={{ fontSize: Scale(13), color: '#888888' }} text={"Airline Booking Code (PNR)"} />
                                    <TextView style={{ fontSize: Scale(14), color: 'black', fontWeight: 'bold' }} text={this.returnData().book_code} />
                                </View>
                        </View>}
                        

                        {params.data.bookings.length > 1 && <View style={[styles.frame, { flex :1 }]}>
                            <TouchableComponent onPress={() => this.setState({actionBack : !this.state.actionBack })}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: Metrics.screenWidth / 2 }}>
                                        <TextView style={{ fontSize: Scale(16), color: Colors.blue, fontWeight: 'bold' }} text={"Penerbangan Pulang"} />
                                        <TextView style={{ fontSize: Scale(12), color: '#888888' }} text={moment(this.returnData().depDate, 'YYYYMMDD').format('dddd, DD MMM YYYY')} />
                                    </View>
                                    <View style={{ width: Metrics.screenWidth / 3, alignItems: 'flex-end' }}>
                                        <Image
                                            source={getIcon('ic_arrow_down')}
                                            resizeMode='contain'
                                            style={{ height: Scale(20), width: Scale(20), tintColor: Colors.tangerine, marginRight: Scale(16) }} />
                                    </View>

                                </View>
                            </TouchableComponent>

                            {this.state.actionBack && <View style={{ height: Scale(2), backgroundColor: '#dddddd', marginTop: Scale(16) }} />}
                            {this.state.actionBack &&<FlatList
                                scrollEnabled={false}
                                style={{ backgroundColor: Colors.white }}
                                data={this.returnData().flightRspDetailJson}
                                keyExtractor={(item, index) => `key-${index}`}
                                renderItem={({ item, index }) => (
                                    <View style ={{paddingRight : Scale (16)}}>
                                        <CardDetil
                                        icon={getAirlineLogo(item.flightNo.substr(0, 2).toLowerCase())}
                                        FlightNo={item.flightNo}
                                        transport_name={params.data.airline}
                                        org_time={Function.SubstringTime(item.depTime)}
                                        org={Function.FormeteDate(item.depDate, 'YYYYMMDD', 'DD MMM')}
                                        detil_org={item.orgCity + ' (' + item.orgCode + ')'}
                                        bandara_org={item.orgAirport}
                                        widthBandaraAirport ={Scale(100)}
                                        dest_time={Function.SubstringTime(item.arrvTime)}
                                        dest={Function.FormeteDate(item.arrvDate, 'YYYYMMDD', 'DD MMM')}
                                        transport_time={Function.CalculateTime(item.depDate + item.depTime, item.arrvDate + item.arrvTime)}
                                        detil_des={item.desCity + ' (' + item.desCode + ')'}
                                        bandara_dest={item.desAirport}
                                        widthBandara_dest ={Scale(100)}
                                        total_index={this.returnData().flightRspDetailJson.length}
                                        index={index + 1}
                                        transit={index + 1 !== this.returnData().flightRspDetailJson.length ? this.returnData().flightRspDetailJson[index + 1].orgCity + ' (' + this.returnData().flightRspDetailJson[index + 1].orgCode + ') ' + STRING.Label_Flight.for + Function.CalculateTime(this.returnData().flightRspDetailJson[index].arrvDate + this.returnData().flightRspDetailJson[index].arrvTime, this.returnData().flightRspDetailJson[index + 1].depDate + this.returnData().flightRspDetailJson[index + 1].depTime) : null}

                                    />

                                    </View>)}
                            />}
                        </View>}

{/* ===================== */}
                        

                        {/* =========== */}

                         <View style={{ width: Metrics.screenWidth, alignItems: 'center', marginTop: Scale(12),marginBottom: Scale(12) }}>
                            <TextView style={{ fontSize: Scale(14), color: '#666666', fontWeight: 'bold' }} text={"Passenger(s)"} />
                        </View>

                        <View style={[styles.frame, { flex: 1,padding : Scale(16) }]}>
                        {this.state.passanger.map((item, i) => (
                                <View style={{ flexDirection: 'row', marginTop: Scale(8) }}>
                                    <View style={{ width : Metrics.screenWidth/2, flexDirection: 'row'}}>
                                    <View>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(13), color: Colors.black }]}
                                            text={(i + 1) + '.'}
                                        />
                                    </View>

                                    <View style={{ marginLeft: Scale(4) }}>
                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: Scale(13), color: Colors.black,  }]}
                                            text={item.name}
                                        />

                                        <TextView
                                            style={[styles.titlePassanger, { fontSize: 13, color: '#bbbbbb' }]}
                                            text={(item.phone ? item.phone + '\n' : '679809070894586'+ '\n')+ (item.birthdate ?  Function.FormeteDate(item.birthdate, 'YYYYMMDD','DD MMM YYYY')+ '\n' : '')+ item.bagasi }
                                        />
                                    </View>
                                    </View>

                                    <View style={{ width : Metrics.screenWidth/3, justifyContent : 'flex-start', alignItems: 'flex-end', bottom: Scale(8) }}>
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

                        <View style={[styles.frame]}>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: Metrics.screenWidth / 2 }}>
                                    <TextView style={{ fontSize: Scale(14), color: Colors.black, }} text={"Total Price"} />
                                    <TextView style={{ fontSize: Scale(14), color: Colors.tangerine, fontWeight: 'bold' }} text={params.data.bookings.length > 1 ? ("IDR " + Function.convertToPrice(this.departData().price + this.returnData().price)):("IDR " + Function.convertToPrice(this.departData().price))} />
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                    <TouchableComponent
                                        onPress={() => this.SendReceipt()}>
                                        <View style={[styles.border_button, { width: Scale(101) }]}>
                                            <TextView
                                                style={{ fontSize: Scale(13), color: Colors.tangerine, }} text={"Send Receipt"} />
                                        </View>
                                    </TouchableComponent>
                                </View>
                            </View>
                        </View>

                        <View style={{ width: Metrics.screenWidth, alignItems: 'center', marginTop: Scale(12) }}>
                            <TextView style={{ fontSize: Scale(14), color: '#666666', fontWeight: 'bold' }} text={"Manage Booking"} />
                        </View>

                        {/* ==== */}
                        <View style={[styles.frame]}>
                            <TouchableComponent
                                onPress={() => navigate('Call')}>
                                <View style={{ flexDirection: 'row' }}>

                                    <View>
                                        <View>
                                            <Image
                                                source={getIcon('refund')}
                                                resizeMode='contain'
                                                style={{ height: Scale(30), width: Scale(30), marginRight: Scale(16) }}
                                            />
                                        </View>
                                    </View>

                                    <View style={{ marginLeft: Scale(4) }}>
                                        <TextView style={{ fontSize: Scale(14), color: Colors.black, fontWeight: 'bold' }} text={"Refund"} />
                                    </View>

                                </View>
                            </TouchableComponent>
                        </View>
                        
                        {/* ==== */}
                        <View style={[styles.frame]}>
                            <TouchableComponent
                                onPress={() => navigate('Call')}>
                                <View style={{ flexDirection: 'row' }}>

                                    <View>
                                        <View>
                                            <Image
                                                source={getIcon('calendar')}
                                                resizeMode='contain'
                                                style={{ height: Scale(30), width: Scale(30), marginRight: Scale(16) }}
                                            />
                                        </View>
                                    </View>

                                    <View style={{ marginLeft: Scale(4) }}>
                                        <TextView style={{ fontSize: Scale(14), color: Colors.black, fontWeight: 'bold' }} text={"Reschedule"} />
                                    </View>

                                </View>
                            </TouchableComponent>
                        </View>

                        {/* ======= */}

                        <View style={[styles.frame]}>
                            <TouchableComponent
                                onPress={() => Linking.openURL('tel://'+'021-2221 4018')}>
                                <View style={{ flexDirection: 'row' }}>

                                    <View>
                                        <View>
                                            <Image
                                                source={getIcon('ic_headset')}
                                                resizeMode='contain'
                                                style={{ height: Scale(30), width: Scale(30), tintColor: Colors.gray, marginRight: Scale(16) }}
                                            />
                                        </View>
                                    </View>
                                    <View style={{ marginLeft: Scale(4) }}>
                                        <TextView style={{ fontSize: Scale(14), color: Colors.black, fontWeight: 'bold' }} text={"Customer Service"} />
                                        <TextView style={{ fontSize: Scale(14), color: "#666666", fontWeight: 'bold' }} text={"021-2221 4018"} />
                                    </View>

                                </View>
                            </TouchableComponent>
                        </View>
                    </View>
                </ScrollView>
                <Loading
                    text={'Harap tunggu sedang mengirim ke email Anda.'}
                    visible={this.state.loading } />

            </View>
        ) 
    }
}

const styles = StyleSheet.create({
    frame: {
      
        borderRadius: Scale(6),
        padding : Scale(16),
        marginTop : Scale(8),
        backgroundColor: "#ffffff"
    },
    titlePassanger: {
        fontSize: Scale(14),
        bottom: Scale(8),
        color: Colors.blue
    },
    border_button : {
        width: 80,
        height: 25,
        borderRadius: 12.5,
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: Colors.tangerine, 
        alignItems: 'center'
    }
})

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    toolbar_title: {
        fontSize: Scale(16),
        color: Colors.white
    },
    short_type: {
        fontSize: Scale(16),
        color: Colors.black,
        marginTop: Scale(8),
    },
    toolbar_subtitle: {
        ...Fonts.bold,
        fontSize: Scale(14),
        color: Colors.white,
    },


    train_section:{
        margin: Scale(14),
        marginBottom: 0,
        paddingBottom: Scale(14),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.warm_grey,
    },
    title_section:{
        fontSize: Fonts.size.large,
        color: Colors.blumine
    },
    train_route:{
        color: Colors.warm_grey
    },  
    route_section:{
        // margin: Scale(8),
        flexDirection: 'row',
    },
    train_routes_section:{
        padding: Scale(14)
    },
    train_name:{
        fontSize: Fonts.size.large,
        marginBottom: Scale(4)
    },
    route_time:{
        fontSize: Fonts.size.medium
    },
    route_date:{
        fontSize: Fonts.size.small,
        color: Colors.warm_grey
    },
    item_route:{
        flexDirection: 'row'
    },
    route_station:{
        fontSize: Fonts.size.medium
    },
    route_time_date:{
        minWidth: Metrics.screenWidth / 6,
    },


    summary_section:{
        flexDirection: 'row',
        // justifyContent: 'center',
        backgroundColor: Colors.concrete,
        padding: Scale(16)
    },
    summary_title_desc:{
        fontSize: Fonts.size.medium * .9
    },
    summary_price:{
        alignSelf: 'flex-end',
        fontSize: Fonts.size.xtra,  
        color: Colors.pizzaz,
        ...Fonts.bold
    },

    circle_outline:{
        height: Metrics.icon.tiny / 1.5,
        width: Metrics.icon.tiny / 1.5,
        borderRadius: Metrics.icon.tiny / 3,
        borderWidth: 1,
        borderColor: Colors.blumine,
    },

    route_line: {
        width: 1,
        backgroundColor: Colors.blumine,
        flex: 1
    },

    separator_start: {
        width: Scale(20),  
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    separator_middle: {
        width: Scale(20),
        justifyContent: 'center',
        alignItems: 'center',
    },
    separator_end: {
        width: Scale(20),
        justifyContent: 'flex-start',
        alignItems: 'center',
    },  
    route_duration:{
        color: Colors.blumine,
        marginVertical: Scale(8),
    }
});