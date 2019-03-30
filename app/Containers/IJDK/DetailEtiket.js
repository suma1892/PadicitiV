import React, { Component } from 'react'
import {    TrainButton, Alert, KeyboardAvoidingView,TextView as Text, RadioButtons, Colors, Scale, CalendarsScreen,Container, getIcon, Toolbar, CardComponentReview,CardQR, CardIJDK, TextView, FrameRadiusComponent, CheckBox, Loading, DialogComponent, Fonts, ItemField } from '../../Components'
import { CardSortTrain, CardShortPax } from '../../Components/TrainCardComponent';
import {
    AsyncStorage,
    TextInput,
    StyleSheet,
    ProgressBarAndroid,
    ProgressViewIOS,
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
export default class DetailEtiket extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showTheThing:false,
            dataSource:[],
            dataSourceV2:[],
            pax_data_depart: [],
            pax_data_return : [],
            // title   : this.props.navigation.state.params.title,
            // data    : this.props.navigation.state.params.data,
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

   async componentDidMount(){
    let { navigation } = this.props
    let { state } = navigation
    let {  transaction_code, trn_status, Email } = state.params

        return fetch('http://182.23.65.29:8888/free-0.0.1/his/get-detail', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "Email": Email,
                "Status": trn_status,
                "TransactionCode": transaction_code,
                "email": Email,
                "status": trn_status,
                "transactionCode": transaction_code,
              })
      }).then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSourceV2:responseJson.Data.Details,
          dataSource: responseJson.Data,
        }, function(){
            if(this.state.dataSource.StatusTransaction === "N"){
                this.setState({showTheThing:true})
            }else{
                this.setState({showTheThing:false})
        }
        });

      })
      .catch((error) =>{
        console.error(error);
      });        
    }

    SendReceipt () {
        this.setState({ loading: true })
        const { navigation } = this.props   
        const { params } = navigation.state
        let url = getURL('url_get_resend_email_train')
        

        JSONGet_(url, '/?transaction_code='+params.transaction_code)
            .then((respone) => {
                var Respone = respone.data
                // console.log(Respone)
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
        let { navigation } = this.props
        let { state } = navigation
        let {  transaction_code, trn_status } = state.params
        // let { type_trip, origination, destination, depart_date, return_date, pax_adult,pax_infant } = pax_list
        const ComponentView = _OS(KeyboardAvoidingView, View)
        // console.log("HALLO SAKAMU : "+ JSON.stringify(this.state.dataSourceV2))
        console.log("HALLO ALBAROH : "+ JSON.stringify(this.state.dataSource))

        return (
            <View style={s.container} >
                <Toolbar  
                    arrow_back
                    onPress ={ () => navigation.dispatch(NavigationActions.back({ key: "" }))}>
                    <View>
                    <Text style ={s.toolbar_title}>Detail Payment</Text>
                    </View>
                </Toolbar>
                { (Platform.OS === 'android')
                    ? (this.state.progressfetch !== 0.0 && <ProgressBarAndroid styleAttr='Horizontal' style={{height: Scale(3)}} color={Colors.tangerine} progress={this.state.progressfetch} indeterminate={false} />)
                    : (this.state.progressfetch !== 0.0 && <ProgressViewIOS  progressTintColor={Colors.pizzaz}  progress={this.state.progressfetch} />)
                }

                <FlatList
                    data={this.state.dataSourceV2}
                        renderItem={({item, index}) => {
                        let tampQR = " "
                        if (item.StatusTransaction==="N"){
                            tampQR =null
                        }else{
                            tampQR = item.Status
                        }   
                        var res1 = ""                
                        var xxx = JSON.stringify(item.Seats)   
                        if (xxx.includes("TR")=== true){
                            res1 = xxx.replace(/TR/gi, "TRIBUN");
                            res1 = JSON.parse(res1) 
                        }else{
                            res1 = xxx;
                            res1 = JSON.parse(res1)
                        }
                                return (
                                <CardQR
                                    key         = {index}
                                    onPress     = {() => {
                                    }}
                                    onPressMore = {() => navigation.navigate('IJDKDetail', {title:'Bus Pergi', data: item})}
                                    name        = {item.TicketType}
                                    price       = {" "}
                                    seats= {" IDR "+Function.convertToPrice(item.AmountPerPax)}
                                    depart_time = {item.EventName}
                                    arrive_time = {item.BookingCode}
                                    status = {this.state.dataSource.StatusTransaction}
                                    eventDate = {item.EventDate}
                                    Seats = {res1}
                                    // Discount = {item.discount}
                                    />
                                   
                            )
                    }}
                    ItemSeparatorComponent={ItemSeparator}
                    extraData={this.state}
                    keyExtractor={(item, index) => index}
                    />
                    {this.state.showTheThing && <View>
                    <TrainButton
                    onPress={() => navigation.navigate(('PaymentSecondWay'), {transaction_code : this.state.dataSource.TransactionCode,
                        })} style={s.btn_reserve}>{"Payment"}</TrainButton></View>}
            </View>
        )
    }
}
const ItemSeparator = () => <View style={{height: StyleSheet.hairlineWidth, flex:1, backgroundColor: Colors.border}}/>

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