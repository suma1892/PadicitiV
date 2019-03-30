import React, { Component } from 'react'
import { Alert, getAirlineLogo, RadioButtons, Colors, Scale, CalendarsScreen, Metrics, Container, getIcon, Toolbar, CardComponentReview, TextView, FrameRadiusComponent, CheckBox, Loading, DialogComponent, Fonts, ItemField } from '../../Components'
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
import { JSONAxioPostFile } from '../../Services/JsonService'
import moment from 'moment';
import { Function } from '../../Utils';
const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
const backAction = NavigationActions.back({ key: '' })
export default class EtiketHotel extends Component {

    constructor(props) {
        super(props);
        this.state = ({
            guest: [],
            loading: false,
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
            trnStatus : 'n',
            parameter : null

        });
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        console.log('Eticket >>>>')
        console.log(params.data)
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
                            adultCount : bookingRoomItemsLst[i].adultCount,
                            roomName :  bookingRoomItemsLst[i].roomName,
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
                        dateFrom:  params.data.bookingHotelItem.dateFrom,
                        dateTo: params.data.bookingHotelItem.dateTo,
                        zoneName : params.data.bookingHotelItem.zoneName,
                    },
                    trnStatus : params.data.trnStatus,
                    parameter :{
                        transactionCode : params.data.transactionCode,
                        userEmail : params.data.userEmail
                    }  
                })

                break;
           
        }

        
    }

    SendReceipt = () => {
        this.setState({ loading_date: true })
        let url = getURL('url_post_lower_price')
        let parameter = {
            Org: this.state.parameter[5].depart.code,
            Des: this.state.parameter[6].return.code,
            Tgl1: date,
        }

        JSONAxioPostFile(url, parameter)
            .then((respone) => {
                var Respone = respone.data
                this.setState({ loading_date: false })
                switch (Respone.respCode) {
                    case '0':
                        

                        break
                    default:
                        
                        break
                }
            })
            .catch((error) => {
                this.setState({ loading_date: false })

                for (var i = 0; i < this.state.lowprice.length; i++) {
                    for (var j = 0; j < arr_date.length; j++) {
                        if (Function.FormeteDate(arr_date[j].fulldate, 'DD MMM YYYY', 'YYYY-MM-DD') === this.state.lowprice[i][2]) {
                            arr_date[j].price = this.state.lowprice[i][3]
                        }
                        if (arr_date[j].fulldate === this.state.parameter[3].depart_date) {
                            this.state.dataIndex = {id : arr_date[j].id}
                        }
                    }
                }

                this.setState({ arr_date: arr_date })

            })
    }
    render() {
        return (
            <View style={{ flex: 1, backgroundColor: '#f4f6f9' }} >
                <Toolbar
                    arrow_back
                    onPress={() =>  this.props.navigation.dispatch(backAction)}
                    View={
                        <View>
                            <TextView style={{ fontSize: Scale(14), color: Colors.white }} text={this.state.dataHotel.zoneName} />
                            <TextView style={{ fontSize: Scale(14), color: Colors.white, fontWeight: 'bold' }} text={"Booking ID, " + this.state.dataHotel.bookingCode} />
                        </View>
                    }
                />
                <ScrollView
                    style={{ flex: 1 }}>
                    <View style={{ margin: Scale(16) }}>

                        <View style={{ width: Metrics.screenWidth, alignItems: 'center' }}>
                            <TextView style={{ fontSize: Scale(14), color: '#666666', fontWeight: 'bold' }} text={"Hotel E-Ticket"} />
                        </View>

                        <View style={[styles.frame, { justifyContent: 'center' }]}>
                            <TextView style={{ fontSize: Scale(13), color: '#888888' }} text={"Itinerary ID"} />
                            <TextView style={{ fontSize: Scale(14), color: 'black', fontWeight: 'bold' }} text={this.state.dataHotel.bookingCode} />
                        </View>

                        <View style={[styles.frame, { height: Scale(190) }]}>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: Metrics.screenWidth / 2 }}>   
                                    <TextView style={{ fontSize: Scale(16), color: Colors.blue, fontWeight: 'bold' }} text={"Check-in"} />
                                    <TextView style={{ fontSize: Scale(12), color: '#888888' }} text={moment(this.state.dataHotel.dateFrom, 'YYYYMMDD').format('dddd, DD MMM YYYY')} />
                                </View>
                                <View style={{ width: Metrics.screenWidth / 2 }}>
                                    <TextView style={{ fontSize: Scale(16), color: Colors.blue, fontWeight: 'bold' }} text={"Check-out"} />
                                    <TextView style={{ fontSize: Scale(12), color: '#888888' }} text={moment(this.state.dataHotel.dateTo, 'YYYYMMDD').format('dddd, DD MMM YYYY')} />
                                </View>
                            </View>

                            <View style={{ height: Scale(2), backgroundColor: '#dddddd', marginTop: Scale(16) }} />
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: Metrics.screenWidth / 2, marginTop: Scale(16) }}>
                                    <TextView style={{ fontSize: Scale(16), color: Colors.black, }} text={this.state.dataHotel.hotelName} />
                                    <TextView
                                        numberOfLines={2}
                                        ellipsize={'tail'}
                                        style={{ fontSize: Scale(13), color: '#888888' }} text={this.state.dataHotel.contactAddress} />
                                </View>

                                <View style={{flex : 1, alignItems: 'flex-end', justifyContent: 'flex-end'}}>
                                    <TouchableComponent
                                        onPress={() => console.log(' <<>>')}>
                                        <View style={styles.border_button}>
                                            <TextView
                                                style={{ fontSize: Scale(13), color: Colors.tangerine, }} text={"See Maps"} />
                                        </View>
                                    </TouchableComponent>
                                </View>
                            </View>
                        </View>

                        <View style={{ width: Metrics.screenWidth, alignItems: 'center', marginTop: Scale(12),marginBottom: Scale(12) }}>
                            <TextView style={{ fontSize: Scale(14), color: '#666666', fontWeight: 'bold' }} text={"Room Info"} />
                        </View>

                        <View style={[styles.frame, {flex : 1,}]}>

                            <View style={{ flexDirection: 'row' }}>
                                
                                    <View style={{ width: Metrics.screenWidth / 2 }}>
                                    {this.state.guest && this.state.guest.map((item, i) => (
                                        <View>
                                            <TextView style={{ fontSize: Scale(14), color: Colors.black, fontWeight: 'bold' }} numberOfLines={1}
                                                ellipsize={'tail'} text={i + 1 + '. ' + item.roomName} />
                                            <TextView style={{ fontSize: Scale(12), color: '#888888' }} numberOfLines={1}
                                                ellipsize={'tail'} text={"     " + item.adultCount + ' Guest'} />
                                        </View>
                                    ))}
                                        </View>
                                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                <View style={[styles.border_button, {borderColor : '#dddddd'}]}>
                                    <TextView
                                        style={{ fontSize: Scale(13), color: '#dddddd', }} text={ this.state.guest.length+ " Room"} />
                                </View>
                            </View>
                            </View>

                         
                        </View>

                        <View style={[styles.frame]}>

                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ width: Metrics.screenWidth / 2 }}>
                                    <TextView style={{ fontSize: Scale(14), color: Colors.black,  }} text={"Total Price"} />
                                    <TextView style={{ fontSize: Scale(14), color: Colors.tangerine, fontWeight: 'bold' }} text={"IDR " + Function.convertToPrice(this.state.dataHotel.totalPrice)} />
                                </View>
                                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center' }}>
                                <TouchableComponent
                    onPress ={ () => console.log(' <<>>')}>
                                    <View style={[styles.border_button, {width : Scale(101)}]}>
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
                    </View>
{/* ==== */}
                    <View style={[styles.frame]}>
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
                    <View style={[styles.frame]}>
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
                    <View style={[styles.frame]}>
                    <TouchableComponent
                    onPress ={ () =>  Linking.openURL('mailto:cs@padiciti.com?subject=Hallo&body=body')}>
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
                </ScrollView>
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