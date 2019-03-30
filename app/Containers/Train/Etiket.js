import React, { Component } from 'react'
import { Alert, KeyboardAvoidingView,TextView as Text, RadioButtons, Colors, Scale, CalendarsScreen,Container, getIcon, Toolbar, CardComponentReview, TextView, FrameRadiusComponent, CheckBox, Loading, DialogComponent, Fonts, ItemField } from '../../Components'
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
import {getURL } from '../../Services/API'
import moment from 'moment';
import {  STRING,Function } from '../../Utils';
import { JSONGet_ } from '../../Services/JsonService'
import { _OS, Metrics } from '../../Assets';
import Barcode from 'react-native-barcode-builder'
import QRCode from 'react-native-qrcode';
const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
const backAction = NavigationActions.back({ key: '' })
import { setPaxSeats } from '../../Utils/TrainUtils';
export default class EtiketKereta extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pax_data_depart: [],
            pax_data_return : [],
            title   : this.props.navigation.state.params.title,
            data    : this.props.navigation.state.params.data,
            actionGo : true,
            actionBack : true,
            loading : false,
            dataHotel:{
                dateFrom: '20180816',
                dateTo: '20180816',
                zoneName : null,
                bookingCode : null,
                hotelName: null,
                contactAddress: null,
                offerTypeName: null,
                roomCount: null,
                totalPrice: 0,
            },
        }
        
    }

    componentDidMount(){
        const { navigation } = this.props
        const { params } = navigation.state
        const { book_depart, book_return, trn_status } = params
        this.setState({pax_data_depart : setPaxSeats(book_depart.pax_num, book_depart.pax_name, book_depart.seat) ,pax_data_return : book_return ? setPaxSeats(book_return.pax_num, book_return.pax_name, book_return.seat) :[]})
        
    }

    SendReceipt () {
        this.setState({ loading: true })
        const { navigation } = this.props   
        const { params } = navigation.state
        let url = getURL('url_get_resend_email_train')
        

        JSONGet_(url, '/?transaction_code='+params.transaction_code)
            .then((respone) => {
                var Respone = respone.data
                console.log(Respone)
                this.setState({ loading: false })
                switch (Respone.err_code.toString()) {
                    case '0':
                        
                    Alert('Berhasil mengirim kembali ke email anda')
                        break
                    default:
                    Alert(STRING.Warrning.no_connection)
                        break
                }
            })
            .catch((error) => {
                this.setState({ loading: false })
                Alert(STRING.Warrning.no_connection)
            })
    }

    render() {
        const { navigation } = this.props
        const { params } = navigation.state
        const { book_depart, book_return, trn_status, pax_list} = params
        let {pax_data_depart,pax_data_return} = this.state
        const ComponentView = _OS(KeyboardAvoidingView, View)

        return (
            <View style={{ flex: 1, backgroundColor: '#f4f6f9' }} >
                <Toolbar
                    arrow_back
                    onPress={() =>  this.props.navigation.dispatch(backAction)}
                    View={
                        <View>
                            <TextView style={{ fontSize: Scale(14), color: Colors.white }} text={book_depart.org+'('+book_depart.org_code+')'+' - ' + book_depart.des+'('+book_depart.des_code+')'} />
                            <TextView style={{ fontSize: Scale(14), color: Colors.white, fontWeight: 'bold' }} text={'Transaction Code : ' + params.transaction_code} />
                        </View>
                    }
                />
                <ScrollView
                    style={{ flex: 1 }}>
                    <View style={{ margin: Scale(16) }}>

                        <View style={{ width: Metrics.screenWidth, alignItems: 'center' }}>
                            <TextView style={{ fontSize: Scale(14), color: '#666666', fontWeight: 'bold' }} text={"Train E-Ticket"} />
                        </View>

                        <View style={[styles.frame, { justifyContent: 'center' }]}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{width : Metrics.screenWidth/2,}}>
                                    <TextView style={{ fontSize: Scale(13), color: '#888888' }} text={"Booking Code"} />
                                    <TextView style={{ fontSize: Scale(14), color: 'black', fontWeight: 'bold' }} text={book_depart.book_code} />
                                </View>

                                <View style={{width: Metrics.screenWidth / 3, alignItems : 'center', backgroundColor : Colors.white}}>
                                <View style={{ height: Scale(60), width: Metrics.screenWidth / 3, alignItems: 'flex-end'}}>
                                <QRCode
                                value={book_depart.book_code}
                                size={60}
                                bgColor='#000'
                                fgColor='#FFF'
                            />
                                    {/* <Barcode value={book_depart.book_code} format="CODE128" /> */}
                                </View>
                            </View>
                            </View>
                        </View>
                        

                        <View style={[styles.frame, { height: Scale( this.state.actionGo ? 220 : 70) }]}>
                            <TouchableComponent onPress={() => this.setState({actionGo : !this.state.actionGo })}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: Metrics.screenWidth / 2 }}>
                                        <TextView style={{ fontSize: Scale(16), color: Colors.blue, fontWeight: 'bold' }} text={"Kereta Pergi"} />
                                        <TextView style={{ fontSize: Scale(12), color: '#888888' }} text={moment(book_depart.dep_date, 'YYYYMMDD').format('dddd, DD MMM YYYY')} />
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

                            {this.state.actionGo && <View>
                                <Text style={s.short_type}>{book_depart.train_name} {book_depart.train_no}</Text>

                                <View style={[s.route_section, { marginTop: Scale(8) }]}>
                                    <View style={s.separator_start}>
                                        <View style={s.circle_outline} />
                                        <View style={[s.route_line, { flex: 0.5 }]} />
                                    </View>
                                    <View style={s.route_time_date}>
                                        <Text style={s.route_time}>{book_depart.dep_time}</Text>
                                        <Text style={s.route_date}>{moment(book_depart.dep_date, 'YYYYMMDD').format('DD MMM')}</Text>
                                    </View>
                                    <View>
                                        <Text style={s.route_station}>{STRING.Label.station} {book_depart.org} ({book_depart.org_code})</Text>
                                    </View>
                                </View>
                                <View style={s.route_section}>
                                    <View style={s.separator_middle}>
                                        <View style={s.route_line} />
                                    </View>
                                    <Text style={s.route_duration}>{book_depart.duration_string}, {STRING.Label.directly}</Text>
                                </View>
                                <View style={s.route_section}>
                                    <View style={s.separator_end}>
                                        <View style={[s.route_line, { flex: 0.5 }]} />
                                        <View style={[s.circle_outline, { backgroundColor: Colors.blumine }]} />
                                    </View>
                                    <View style={s.route_time_date}>
                                        <Text style={s.route_time}>{book_depart.arv_time}</Text>
                                        <Text style={s.route_date}>{moment(book_depart.dep_date, 'YYYYMMDD').format('DD MMM')}</Text>
                                    </View>
                                    <View>
                                        <Text style={s.route_station}>{STRING.Label.station} {book_depart.des} ({book_depart.des_code})</Text>
                                    </View>
                                </View>
                            </View>}


                        </View>

                        {/* ===================== */}

                        {book_return && <View style={[styles.frame, { justifyContent: 'center' }]}>
                            <View style={{ flex: 1, flexDirection: 'row' }}>
                                <View style={{ width: Metrics.screenWidth / 2, }}>
                                    <TextView style={{ fontSize: Scale(13), color: '#888888' }} text={"Booking Code"} />
                                    <TextView style={{ fontSize: Scale(14), color: 'black', fontWeight: 'bold' }} text={book_return.book_code} />
                                </View>

                                <View style={{ width: Metrics.screenWidth / 3, alignItems: 'center', backgroundColor: Colors.white }}>
                                    <View style={{ height: Scale(60), width: Metrics.screenWidth / 3, alignItems: 'flex-end' }}>
                                    <QRCode
                                value={book_return.book_code}
                                size={60}
                                bgColor='#000'
                                fgColor='#FFF'
                            />
                                        {/* <Barcode value={book_return.book_code} format="CODE128" /> */}
                                    </View>
                                </View>
                            </View>
                        </View>}
                        {book_return && <View style={[styles.frame, { height:  Scale( this.state.actionBack ? 220 : 70) }]}>



                            <TouchableComponent onPress={() => this.setState({actionBack : !this.state.actionBack })}>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={{ width: Metrics.screenWidth / 2 }}>
                                        <TextView style={{ fontSize: Scale(16), color: Colors.blue, fontWeight: 'bold' }} text={"Kereta Pulang"} />
                                        <TextView style={{ fontSize: Scale(12), color: '#888888' }} text={moment(book_return.dep_date, 'YYYYMMDD').format('dddd, DD MMM YYYY')} />
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

                            {this.state.actionBack &&  <View>
                                <Text style={s.short_type}>{book_return.train_name} {book_return.train_no}</Text>

                                <View style={[s.route_section, { marginTop: Scale(8) }]}>
                                    <View style={s.separator_start}>
                                        <View style={s.circle_outline} />
                                        <View style={[s.route_line, { flex: 0.5 }]} />
                                    </View>
                                    <View style={s.route_time_date}>
                                        <Text style={s.route_time}>{book_return.dep_time}</Text>
                                        <Text style={s.route_date}>{moment(book_return.dep_date, 'YYYYMMDD').format('DD MMM')}</Text>
                                    </View>
                                    <View>
                                        <Text style={s.route_station}>{STRING.Label.station} {book_return.org} ({book_return.org_code})</Text>
                                    </View>
                                </View>
                                <View style={s.route_section}>
                                    <View style={s.separator_middle}>
                                        <View style={s.route_line} />
                                    </View>
                                    <Text style={s.route_duration}>{book_return.duration_string}, {STRING.Label.directly}</Text>
                                </View>
                                <View style={s.route_section}>
                                    <View style={s.separator_end}>
                                        <View style={[s.route_line, { flex: 0.5 }]} />
                                        <View style={[s.circle_outline, { backgroundColor: Colors.blumine }]} />
                                    </View>
                                    <View style={s.route_time_date}>
                                        <Text style={s.route_time}>{book_return.arv_time}</Text>
                                        <Text style={s.route_date}>{moment(book_return.dep_date, 'YYYYMMDD').format('DD MMM')}</Text>
                                    </View>
                                    <View>
                                        <Text style={s.route_station}>{STRING.Label.station} {book_return.des} ({book_return.des_code})</Text>
                                    </View>
                                </View>
                            </View>}
                        </View>}

                        {/* =========== */}

                         <View style={{ width: Metrics.screenWidth, alignItems: 'center', marginTop: Scale(12),marginBottom: Scale(12) }}>
                            <TextView style={{ fontSize: Scale(14), color: '#666666', fontWeight: 'bold' }} text={"Passenger(s)"} />
                        </View>

                        <View style={[styles.frame, { flex: 1,padding : 0 }]}>
                            {   pax_data_depart &&
                                pax_data_depart.map((item, index) => (
                                    <View style={{paddingRight :Scale(8) }}>
                                        <CardShortPax
                                            key={index}
                                            index={index + 1}
                                            name={item.name}
                                            widthDest ={Metrics.screenWidth/2.6}
                                            widthSeat ={Metrics.screenWidth/2.6}
                                            num_id={item.identity ? item.identity : Function.FormeteDate(item.brith_date, 'YYYYMMDD', 'DD MMMMM YYYY') }
                                            org ={book_depart.org_code + ' - ' + book_depart.des_code + (book_return ? '\n' + book_depart.des_code + ' - ' + book_depart.org_code : '' )}
                                            seat = {item.identity ?item.seat + (book_return ?'\n' +pax_data_return[index].seat : '' ) : item.seat + (book_return ?pax_data_return[index].seat : '' )}
                                            birthday={item.birthday} />
                                    </View>


                                ))
                            }
                        </View>

                        <View style={[styles.frame]}>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: Metrics.screenWidth / 2 }}>
                                    <TextView style={{ fontSize: Scale(14), color: Colors.black, }} text={"Total Price"} />
                                    <TextView style={{ fontSize: Scale(14), color: Colors.tangerine, fontWeight: 'bold' }} text={"IDR " + Function.convertToPrice(book_depart.price)} />
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

                        {/* ======= */}

                        <View style={[styles.frame]}>
                            <TouchableComponent
                                onPress={() => Linking.openURL('tel://' + '021-2221 4018')}>
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


                        {/* ==== */}
                        <View style={[styles.frame]}>
                            <TouchableComponent
                                onPress={() => Linking.openURL('whatsapp://send?phone=' + '628558214018')}>
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
                        <View style={[styles.frame]}>
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