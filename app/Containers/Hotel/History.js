import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image, Dimensions, AppRegistry, AsyncStorage
} from 'react-native'

import s from '../../Components/Styles'
import { Colors, 
    Metrics, 
    Container, 
    getIcon, 
    ToolbarV2 as Toolbar, 
    ItemField, 
    TextView as Text,
    Button,
    Fonts, Touchable, CardMyTrip, getAirlineLogo} from '../../Components/index'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import {Function, STRING } from '../../Utils'
import {paxNameHistory,paxSeatHistory} from '../../Utils/TrainUtils'
import { listCreditCard } from '../../Utils/dummy';
import Navbar from '../../Components/NavigationBottom'

import { API, getURlHistory } from '../../Services/API'
import { Parameter } from '../../Services/Parameter'
import { JSONGetFile, JSONPostFile, JSONPost_, JSONGet_ } from '../../Services/JsonService'
import moment from 'moment'
const backAction = NavigationActions.back({key:''}) 

const listNamePassanger = [
    { date:'Sabtu, 29 Apr 2017',
      type:'penerbangan',
      img :getIcon('ic_flight'),
      nameArmada:'Lion Air',
      checkin_time:'13.20',
      from :'Jakarta(CKG)',
      airport_from:'Bandara Soekarno Hatta',
      checkout_time:'16.10',
      to :'Bali(DPS)',
      airport_to:'Nugrah Rai Int'
    },
    { date:'Sabtu, 29 Apr 2017',
      type :'kereta',
      img :getIcon('ic_train'),
      nameArmada:'Garuda',
      checkin_time:'13.20',
      from :'Jakarta(CKG)',
      airport_from:'Bandara Soekarno Hatta',
      checkout_time:'16.10',
      to :'Bali(DPS)',
      airport_to:'Nugrah Rai Int'
    },
    { date:'Sabtu, 29 Apr 2017',
      type:'hotel',
      img :getIcon('ic_hotel'),
      nameArmada:'Lion Air',
      checkin_time:'13.20',
      from :'Jakarta(CKG)',
      airport_from:'Bandara Soekarno Hatta',
      checkout_time:'16.10',
      to :'Bali(DPS)',
      airport_to:'Nugrah Rai Int'
    },
    
]
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            listName : listNamePassanger,
            parameter : {
                userid : null,
            },
            parameterPost : {
                email : null,
                credentialCode : "padiciti",
                credentialPass: "padiciti123",
                // email : "IND"
            },
            data : [],
            loading : true,
        });
    }

    componentDidMount(){
        AsyncStorage.getItem('UserData', (err, UserData) => {
            if (UserData) {
               this.state.parameterPost.email = Function.JsonParse(UserData).client_email
               this.state.parameter.userid = Function.JsonParse(UserData).clientId 
                this.AuthPost('hotel')
               
            } 
        })
        
    }
    
    handleRefresh = () => {
        this.setState({
            data :[],
            loading : true
        }, ()=> {
            this.AuthPost('hotel')
        })
}

AuthPost = (type) => {
    try {
        this.setState({ loading: true })
        let url = getURlHistory(type)
        JSONPostFile(url,  this.state.parameterPost).then((response) => {
            
            switch (type) {
                case 'hotel':
                    var history = []
                    var Item = null
                    // console.log(response)
                    response.transactions.map((item, i) => (
                        Item = item,
                        Item['slug'] = 'hotel',
                        history.push(Item)
                    ))
                    this.setState({ data: [...this.state.data, ...history] }, () => {
                        this.setState({ loading: false })
                    })
                    break;
               
            }
        }).catch((err) => {
            console.log(err)
        })
    } catch (Error) {
        this.setState({ loading: false }, () => {
            // this.backAndroid()
        })
        console.log('Error >>> ', Error)
    }

}

    render() {
        let navigation = this.props.screenProps.navigation
        return (
            <Container style={[s.container,{backgroundColor : Colors.whitesmoke}]}>
                    <View style={{flex:1, marginBottom : Metrics.navbar}}> 
                        <FlatList
                            data = {this.state.data}
                            keyExtractor={(item, index) => `key-${index}`}
                            renderItem ={({ item }) => (
                                <View style={{marginBottom: Metrics.padding.normal}}>
                                        <View style ={{backgroundColor : Colors.white}}>
                                         <CardMyTrip
                                    date={Function.FormeteDate(item.bookingHotelItem.dateFrom, 'YYYYMMDD','dddd, DD MMM YYYY')}
                                    trn_code = {'Transaction Code : ' + item.transactionCode}
                                    type={'kereta'}
                                    status = {item.trnStatus}
                                    transactiontime ={moment.duration(moment(item.paymentLimitDate + item.transactionTime, 'YYYYMMDDHHmm').diff(moment(new Date(), 'YYYYMMDDHHmm'))).hours() + ' : '
                                    + moment.duration(moment(item.paymentLimitDate + item.transactionTime, 'YYYYMMDDHHmm').diff(moment(new Date(), 'YYYYMMDDHHmm'))).minutes() + ' : '
                                    + moment.duration(moment(item.paymentLimitDate + item.transactionTime, 'YYYYMMDDHHmm').diff(moment(new Date(), 'YYYYMMDDHHmm'))).seconds()}
                                    img={getIcon('ic_hotel')}
                                    // img_maskapai={'ic_kereta_api'}
                                    nameArmada={item.bookingHotelItem.hotelName}
                                    checkin_time={item.bookingHotelItem.bookingRoomItemsLst[0].roomName}
                                    // from={item.bookingHotelItem[0].org_name + ' ('+item.bookingHotelItem[0].org_code+') '}
                                    // airport_from={item.bookings[0].orgAirport}
                                    // checkout_time={Function.SubstringTime(item.bookingHotelItem[0].arv_time)}
                                    // to={item.bookingHotelItem[0].des_name + ' ('+item.bookingHotelItem[0].dest_code+') '}
                                    // airport_to={item.bookings[0].destAirport}
                                    // onPress ={() => navigation.navigate('BookingDetail',{slug : 'history', data : item})}
                                    onPress ={() => navigation.navigate((item.trnStatus.toLowerCase() === 'y' ?'EtiketHotel': 'BookingDetail'),{slug : 'history', data : item})}
                                />
                                </View>    
                                </View> 
                            )}

                        refreshing={this.state.loading}
                        onRefresh={this.handleRefresh}
                        />
                    </View>
             </Container>
        )
    }
}

const ss = StyleSheet.create({


})

