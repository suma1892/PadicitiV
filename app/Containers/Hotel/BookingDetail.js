import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image, Dimensions, AppRegistry, TouchableWithoutFeedback, TouchableNativeFeedback,Platform
} from 'react-native'

import s from '../../Components/Styles'
import QRCode from 'react-native-qrcode'
import {
    Colors, Fonts,
    Metrics,
    Container,
    getIcon,
    ToolbarV2 as Toolbar,
    ItemField,
    TextView as Text, NearPlace, CardReviewHotel,
    Button, CheckBox,
    Touchable, LoadingFull
} from '../../Components/index'
import {NavigationActions } from 'react-navigation';
import { NearDestination, HotelType } from '../../Utils/dummy'
import { Function, STRING, array, navigateTo } from '../../Utils'
import { API, getURL } from '../../Services/API'
import { Parameter } from '../../Services/Parameter'
import { JSONPostFile } from '../../Services/JsonService'
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
const backAction = NavigationActions.back({ key: '' })

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            guest: null,
            loading: false,
            dataHotel:{
                bookingCode : null,
                hotelName: null,
                contactAddress: null,
                offerTypeName: null,
                roomCount: null,
                totalPrice: null,
            },
            trnStatus : 'n',
            parameter : null

        });
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;

        switch(params.slug){
            case 'history':
               
                var bookingRoomItemsLst = params.data.bookingHotelItem.bookingRoomItemsLst
                var i = 0
                var j = 0
                var ArrayPassangger = []
                while (i< bookingRoomItemsLst.length){
                    var guestHotels = bookingRoomItemsLst[i].guestHotels
                    // while (j< guestHotels.length){
                        ArrayPassangger.push({
                            name_client: guestHotels[i].firstName+' '+guestHotels[i].lastName,
                            // adultCount : bookingRoomItemsLst[i].adultCount,
                            // roomName :  bookingRoomItemsLst[i].roomName,
                            
                        })
                                            j++
                                        // }
                    i++
                }
                this.setState({
                    guest : ArrayPassangger,
                    dataHotel:{
                        bookingCode : params.data.bookingHotelItem.bookingCode,
                        hotelName: params.data.bookingHotelItem.hotelName,
                        contactAddress: params.data.bookingHotelItem.contactAddress,
                        offerTypeName: params.data.bookingHotelItem.bookingRoomItemsLst[0].roomName,
                        roomCount: params.data.bookingHotelItem.roomCount,
                        totalPrice: params.data.bookingHotelItem.totalPrice,
                    },
                    trnStatus : params.data.trnStatus,
                    parameter :{
                        transactionCode : params.data.transactionCode,
                        userEmail : params.data.userEmail
                    }  
                })

                break;
            default:
                var ArrayPassangger = []
                for (let A = 0; A < params.dataParam.roomCount; A++) {
                    ArrayPassangger.push({
                        name_client: params.state['adult_full_name' + (A + 1)],
                        // email_client : null,
                        // phone_client :  null,
                    })
                }
                this.setState({ guest: ArrayPassangger,
                    dataHotel:{
                        hotelName: params.data.bookingHotelItem.hotelName,
                        contactAddress: params.data.bookingHotelItem.contactAddress,
                        offerTypeName: params.dataPlus.offerTypeName,
                        roomCount: params.dataParam.roomCount,
                        totalPrice: params.data.bookingHotelItem.totalPrice,
                    },
                    parameter :  params.data
                 })
                break;
        }

        
    }

    Auth = () => {
        const { params } = this.props.navigation.state;
        try {
            this.setState({ loading: true })
            let url = getURL('url_post_request_padipay_hotel')
            let param = Parameter.PaymentHotel(this.state.parameter)
            JSONPostFile(url, param).then((Respone) => {

                this.setState({ loading: false, priceTotSales: Respone.priceTotSales })
                console.log(Respone)
                switch (Respone.respCode) {
                    case '0':
                        this.setState({ loading: false }, () => {
                            this.props.navigation.navigate('PaymentHotel', { DataJson: Respone })
                        })
                        break
                    default:
                        this.setState({ loading: false })
                        break;
                }

            }).catch((err) => {
                console.log('err >> ' + err)
                this.setState({ loading: false })
            })
        } catch (Error) {
            console.log('Error >> ' + Error)
            this.setState({ loading: false })
        }

    }

    backAndroid() {
        const { params } = this.props.navigation.state;
        if (params.slug === 'history') {
            this.props.navigation.dispatch(backAction)
        } else {
            navigateTo('LandingPageHotel' ,this.props.dispatch,this.props.navigation,null )
        }
        return true
    }

    render() {
        const { dispatch, navigate } = this.props.navigation;
        const { params } = this.props.navigation.state;
        return (
            <View style={{flex:1, backgroundColor: Colors.white}}>
                <Toolbar
                    style={s.toolbar}
                    type={next => this.setState({ next })}
                    title= {STRING.Label.detil_payment}
                    barStyle={s.toolbar}
                    left={[{
                        icon: 'ic_arrow_back',
                        onPress: () => this.backAndroid() 
                    }]}
                />
                <ScrollView style={{flex:1}}>
                <TouchableComponent
                    onPress ={ () => this.state.trnStatus.toLowerCase() === 'y' ? this.props.navigation.navigate('qrcode',{book_code : this.state.dataHotel.bookingCode}) : console.log('')}>
                    <View style={[style.section]}>
                        <Headertitle
                            title={this.state.dataHotel.item_booking}
                        />
                        <View style ={{flexDirection : 'row'}}>
                            <View >
                                <Text style={[s.valueNormal, {ellipsizeMode : 'tail', width : Metrics.screenWidth/2}]}>{this.state.dataHotel.hotelName}</Text>
                                <Text style={[s.fontGrayNormal, {ellipsizeMode : 'tail', width : Metrics.screenWidth/2}]}>{this.state.dataHotel.contactAddress}</Text>
                                <View style={s.lineHeightFix}>
                                    <Text style={[s.fontGrayNormal, {ellipsizeMode : 'tail', width : Metrics.screenWidth/2}]}>{this.state.dataHotel.offerTypeName}</Text>
                                </View>
                            </View>

                            {this.state.trnStatus.toLowerCase() === 'y' && <View style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center' }}>
                                <Text style={s.valueNormal}>{'Kode Boking'}</Text>
                                <View style={{ flex: 1, paddingVertical: Metrics.padding.small }}>
                                    <QRCode
                                        value={this.state.dataHotel.bookingCode}
                                        size={60}
                                        bgColor='#000'
                                        fgColor='#FFF'
                                    />
                                </View>
                                <Text style={[s.valueNormal, { fontSize: Scale(16), color: Colors.tangerine }]}>{this.state.dataHotel.bookingCode}</Text>
                            </View>}
                        </View>
                        
                    </View>
                    </TouchableComponent>
                    <View style={style.section}>
                        <HeaderGray
                            title= {STRING.Passanger.guest}
                        />
                        {this.state.guest && this.state.guest.map((item, i) => (
                            i <= 1 &&
                            <View key={i} style={[s.row, { marginVertical: Metrics.padding.small }]}>
                                <ItemField
                                    type='viewGuest'
                                    number={(i + 1) + '. '}
                                    name={item.name_client}
                                // email ={item.email_client}
                                // phone_client ={item.phone_client}
                                />
                            </View>
                        ))}
                    </View>
                    <View style={style.section}>
                        <HeaderGray
                            title={STRING.Passanger.payment_title}
                        />
                        <ItemFields
                            label={this.state.dataHotel.offerTypeName + ' ( x' + this.state.dataHotel.roomCount + ')'}
                            text={this.state.dataHotel.totalPrice && Function.convertToPrice(this.state.dataHotel.totalPrice)}
                             />
                        {/* <ItemFields 
                                    label={this.state.price_service_label}
                                    text ={this.state.price_service}/> */}
                    </View>
                    <View style={s.marginNormal}>
                        <Totals
                            text={this.state.dataHotel.totalPrice && Function.convertToPrice(this.state.dataHotel.totalPrice)}
                        />
                    </View>

                </ScrollView>
               {(this.state.trnStatus.toLowerCase() !== 'p' && this.state.trnStatus.toLowerCase() !== 'c' && this.state.trnStatus.toLowerCase() !== 'x' && this.state.trnStatus.toLowerCase() !== 'y') && 
                <Button
                        style={style.button}
                        onPress={() => this.Auth()}
                        text={STRING.Label.payment_method}
                    />
                    }
                <LoadingFull
                    visible={this.state.loading}
                    title={STRING.Label.please_wait}
                    sub_title={STRING.Label.page} />
            </View>
        )
    }
}

const Totals = props => (
    <View style={[{ flex: 1, marginVertical: Metrics.padding.tiny }]}>
        <View style={s.row}>
            <Text style={style.totalLabel}>TOTAL</Text>
            {props.text && <Text style={style.valueTotal}> IDR {props.text ? props.text : ' - '}</Text>}
        </View>
    </View>
)

const ItemFields = props => (
    <View style={[style.item_field_row, { flex: 1, marginTop: Metrics.padding.tiny }]}>
        <View style={[s.row]}>
            {props.label && <Text style={[style.item_label_row, { width: Metrics.screenWidth / 2 }]} ellipsize>{props.label}</Text>}
            {props.text && <Text style={[style.item_value_row, { width: Metrics.screenWidth / 2 }]}> IDR {props.text ? props.text : ' - '}</Text>}
        </View>
    </View>
)

const Headertitle = props => (
    <View style={style.paddingV}>
        {props.title &&
            <Text
                ellipsizeMode='tail'
                numberOfLines={1}
                style={style.fontBlue}>{props.title}</Text>}
    </View>
)

const HeaderGray = props => (
    <View style={style.paddingV}>
        {props.title &&
            <Text
                ellipsizeMode='tail'
                numberOfLines={1}
                style={style.fontGray}>{props.title}</Text>}
    </View>
)


const style = StyleSheet.create({
    button: {
        marginVertical: Metrics.padding.normal
    },
    valueTotal: {
        fontFamily: Fonts.regular.fontFamily,
        fontSize: Fonts.size.large,
        flex: 1,
        textAlign: 'right',
        color: Colors.tangerine
    },
    totalLabel: {
        fontFamily: Fonts.regular.fontFamily,
        fontSize: Fonts.size.medium,
    },
    item_value_row: {
        fontFamily: Fonts.light.fontFamily,
        fontSize: Fonts.size.regular,
        flex: 1,
        textAlign: 'right',
        color: Colors.warm_grey
    },
    item_field_row: {

        marginBottom: Metrics.padding.tiny
    },
    item_label_row: {
        fontFamily: Fonts.light.fontFamily,
        fontSize: Fonts.size.regular,
        color: Colors.warm_grey
    },
    fontBlue: {
        fontFamily: Fonts.regular.fontFamily,
        fontSize: Fonts.size.medium,
        color: Colors.blue
    },
    fontGray: {
        fontFamily: Fonts.regular.fontFamily,
        fontSize: Fonts.size.medium,
        color: Colors.warm_grey
    },
    check_box: {
        flex: 1,
        paddingVertical: Metrics.padding.normal,
        //paddingHorizontal: Metrics.padding.normal
    },
    sectionCondition: {
        flex: 1,
        paddingVertical: Metrics.padding.small,
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: Metrics.border
    },
    detailContainer: {
        flex: 1,
        flexDirection: 'row'
    },
    detail: {
        flex: 1,
        justifyContent: 'center'
    },
    paddingV: {
        marginBottom: Metrics.padding.tiny,

    },
    address: {
        paddingHorizontal: Metrics.padding.normal,
        paddingVertical: Metrics.padding.small
    },
    headertitle: {
        alignItems: 'center'
    },
    section: {
        paddingHorizontal: Metrics.padding.normal,
        paddingVertical: Metrics.padding.small,
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 2
    },

})

