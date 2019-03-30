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
                this.AuthGet('get_flight')
               
            } 
        })
        
    }
    
    handleRefresh = () => {
        this.setState({
            data :[],
            loading : true
        }, ()=> {
            this.AuthGet('get_flight')
        })
}

    AuthGet = (type) => {
        try {
            this.setState({ loading: true })
            let url = getURlHistory(type,this.state.parameter)
            JSONGet_(url, null).then((response) => {
                response = response.data
                switch (type) {
                    case 'get_flight':
                        var history = []
                        var Item = null
                        response.transactions && response.transactions.map((item, i) => (
                            Item = item,
                            Item['slug'] = 'flight',
                            history.push(Item)
                        ))
                        this.setState({ data: [...this.state.data, ...history]}, ()=> {
                            this.AuthGet('get_traint')
                        })
                        break;
                    case 'get_traint':
                        var history = []
                        var Item = null
                        response.transactions && response.transactions.map((item, i) => (
                            Item = item,
                            Item['slug'] = 'traint',
                            history.push(Item)
                        ))
                        this.setState({ data: [...this.state.data, ...history] }, () => {
                            this.AuthPost('hotel')
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

    AuthPost = (type) => {
        try {
            this.setState({ loading: true })
            let url = getURlHistory(type)
            JSONPostFile(url, type === 'get_railink' ? {user_id : this.state.parameter.userid, credentialCode : "padiciti", credentialPass : "padiciti123"} : this.state.parameterPost ).then((response) => {
                
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
                            this.AuthPost('get_railink')
                        })
                        break;
                    case 'get_railink':
                        var history = []
                        var Item = null
                        // console.log(response)
                        response.transactions.map((item, i) => (
                            Item = item,
                            Item['slug'] = 'railink',
                            history.push(Item)
                        ))
                        this.setState({ data: [...this.state.data, ...history] }, () => {
                            this.setState({ loading: false })
                            // this.AuthGet('get_railink')
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
        // const {navigate } = this.props.navigation;
        // let { navigation, dispatch} = this.props
        return (
            <Container style={s.container}>
                    <View style={{flex:1, marginBottom : Metrics.navbar}}> 
                        <FlatList
                            data = {this.state.data}
                            keyExtractor={(item, index) => `key-${index}`}
                            renderItem ={({ item }) => (
                                <View style={{marginBottom: Metrics.padding.normal}}>
                                         <View>
                                        {item.slug === 'flight' ?
                                        <View>
                                       
                                        <CardMyTrip
                                        date={Function.FormeteDate(item.bookings[0].depDate, 'YYYYMMDD','dddd, DD MMM YYYY')}
                                        type={'penerbangan'}
                                        
                                        img={getIcon('ic_flight')}
                                        img_maskapai={getAirlineLogo(item.bookings[0].flightNo.substr(0,2).toLowerCase())}
                                        nameArmada={item.bookings[0].airline}
                                        checkin_time={Function.SubstringTime(item.bookings[0].depTime)}
                                        from={item.bookings[0].orgCity + ' ('+item.bookings[0].orgCode+') '}
                                        airport_from={item.bookings[0].orgAirport}
                                        checkout_time={Function.SubstringTime(item.bookings[0].arvTime)}
                                        to={item.bookings[0].destCity + ' ('+item.bookings[0].destCode+') '}
                                        airport_to={item.bookings[0].destAirport}
                                        // onPress ={() => this.props.navigation.navigate('DetilPemesanan',{slug : 'history', data : item})}
                                    />
                                    </View>

                                        : item.slug === 'traint' ? 
                                        
                                        <CardMyTrip
                                        date={Function.FormeteDate(item.bookings[0].dep_date, 'YYYYMMDD','dddd, DD MMM YYYY')}
                                        type={'kereta'}
                                        
                                        img={getIcon('ic_train')}
                                        img_maskapai={getIcon('ic_kereta_api')}
                                        nameArmada={item.bookings[0].train_name}
                                        checkin_time={Function.SubstringTime(item.bookings[0].dep_time)}
                                        from={item.bookings[0].org_name + ' ('+item.bookings[0].org_code+') '}
                                        // airport_from={item.bookings[0].orgAirport}
                                        checkout_time={Function.SubstringTime(item.bookings[0].arv_time)}
                                        to={item.bookings[0].dest_name + ' ('+item.bookings[0].dest_code+') '}
                                        // airport_to={item.bookings[0].destAirport}
                                        // onPress ={() =>  this.props.navigation.navigate('TrainReview', {
                                        //     // pax_list,
                                        //     transaction_code : item.transaction_code,
                                        //     trn_status : item.trn_status,
                                        //     book_depart : {
                                        //         // ...train_depart,
                                        //         org :item.bookings[0].org_code,
                                        //         des :item.bookings[0].dest_code,
                                        //         dep_date : item.bookings[0].dep_date,
                                        //         train_name  : item.bookings[0].train_name,
                                        //         train_no :item.bookings[0].train_no,
                                        //         book_code   : item.bookings[0].book_code,
                                        //         num_code    : item.bookings[0].num_code,
                                        //         pax_num     : [item.bookings[0].num_pax_adult, item.bookings[0].num_pax_child, item.bookings[0].num_pax_infant],
                                        //         pax_name    : paxNameHistory(item.bookings[0].passengers),
                                        //         seat        : paxSeatHistory(item.bookings[0].passengers),
                                        //         normal_sales: item.bookings[0].normal_sales,
                                        //         extra_fee   : item.bookings[0].extra_fee,
                                        //         discount    : item.bookings[0].discount,
                                        //         // book_balance: item.bookings[0].discount,
                                        //         booking_cost_all: item.bookings[0].normal_sales,
                                        //         // order_makan : item.bookings[0].order_makan
                                        //     }, 
                                        //     book_return : item.bookings.length > 1 && {
                                        //         // ...train_depart,
                                        //         org :item.bookings[1].org_code,
                                        //         des :item.bookings[1].dest_code,
                                        //         dep_date : item.bookings[1].dep_date,
                                        //         train_name  : item.bookings[1].train_name,
                                        //         train_no :item.bookings[1].train_no,
                                        //         book_code   : item.bookings[1].book_code,
                                        //         num_code    : item.bookings[1].num_code,
                                        //         pax_num     : [item.bookings[1].num_pax_adult, item.bookings[0].num_pax_child, item.bookings[0].num_pax_infant],
                                        //         pax_name    : paxNameHistory(item.bookings[0].passengers),
                                        //         seat        : paxSeatHistory(item.bookings[1].passengers),
                                        //         normal_sales: item.bookings[1].normal_sales,
                                        //         extra_fee   : item.bookings[1].extra_fee,
                                        //         discount    : item.bookings[1].discount,
                                        //         // book_balance: item.bookings[0].discount,
                                        //         booking_cost_all: item.bookings[1].normal_sales,
                                        //         // order_makan : item.bookings[0].order_makan
                                        //     }
                                        // })}
                                    />  :  item.slug === 'hotel' ? 
                                    
                                    <CardMyTrip
                                    date={Function.FormeteDate(item.bookingHotelItem.dateFrom, 'YYYYMMDD','dddd, DD MMM YYYY')}
                                    type={'kereta'}
                                    
                                    img={getIcon('ic_hotel')}
                                    img_maskapai={'ic_kereta_api'}
                                    nameArmada={item.bookingHotelItem.hotelName}
                                    checkin_time={item.bookingHotelItem.bookingRoomItemsLst[0].roomName}
                                    // from={item.bookingHotelItem[0].org_name + ' ('+item.bookingHotelItem[0].org_code+') '}
                                    // airport_from={item.bookings[0].orgAirport}
                                    // checkout_time={Function.SubstringTime(item.bookingHotelItem[0].arv_time)}
                                    // to={item.bookingHotelItem[0].des_name + ' ('+item.bookingHotelItem[0].dest_code+') '}
                                    // airport_to={item.bookings[0].destAirport}
                                    // onPress ={() => this.props.navigation.navigate('BookingDetail',{slug : 'history', data : item})}
                                /> : item.slug === 'railink' ? 
                                
                                <CardMyTrip
                                date={Function.FormeteDate(item.bookings[0].dep_date, 'YYYYMMDD','dddd, DD MMM YYYY')}
                                type={'kereta'}
                                
                                img={getIcon('ic_railink')}
                                // img_maskapai={getIcon('ic_kereta_api')}
                                nameArmada={item.bookings[0].train_name + ' '+ item.bookings[0].train_no}
                                checkin_time={Function.SubstringTime(item.bookings[0].dep_time)}
                                from={item.bookings[0].org_name + ' ('+item.bookings[0].org_code+') '}
                                // airport_from={item.bookings[0].orgAirport}
                                checkout_time={Function.SubstringTime(item.bookings[0].arv_time)}
                                to={item.bookings[0].dest_name + ' ('+item.bookings[0].dest_code+') '}
                                // airport_to={item.bookings[0].destAirport}
                                // onPress ={() =>  this.props.navigation.navigate('RailinkReview', {
                                //     // pax_list,
                                   
                                //     trn_status : item.trn_status,
                                //     book_depart : {
                                //         // ...train_depart,
                                //         transactionCode : item.transaction_code,
                                //         org :item.bookings[0].org_code,
                                //         des :item.bookings[0].dest_code,
                                //         dep_date : item.bookings[0].dep_date,
                                //         train_name  : item.bookings[0].train_name,
                                //         train_no :item.bookings[0].train_no,
                                //         book_code   : item.bookings[0].book_code,
                                //         num_code    : item.bookings[0].num_code,
                                //         pax_num     : [item.bookings[0].num_pax_adult, item.bookings[0].num_pax_child, item.bookings[0].num_pax_infant],
                                //         pax_name    : paxNameHistory(item.bookings[0].passengers),
                                //         seat        : paxSeatHistory(item.bookings[0].passengers),
                                //         normal_sales: item.bookings[0].normal_sales,
                                //         extra_fee   : item.bookings[0].extra_fee,
                                //         discount    : item.bookings[0].discount,
                                //         book_balance: item.bookings[0].normal_sales,
                                //         booking_cost_all: item.bookings[0].normal_sales,
                                //         // order_makan : item.bookings[0].order_makan
                                //     }, 
                                //     book_return : item.bookings.length > 1 && {
                                //         // ...train_depart,
                                //         org :item.bookings[1].org_code,
                                //         des :item.bookings[1].dest_code,
                                //         dep_date : item.bookings[1].dep_date,
                                //         train_name  : item.bookings[1].train_name,
                                //         train_no :item.bookings[1].train_no,
                                //         book_code   : item.bookings[1].book_code,
                                //         num_code    : item.bookings[1].num_code,
                                //         pax_num     : [item.bookings[1].num_pax_adult, item.bookings[0].num_pax_child, item.bookings[0].num_pax_infant],
                                //         pax_name    : paxNameHistory(item.bookings[0].passengers),
                                //         seat        : paxSeatHistory(item.bookings[1].passengers),
                                //         normal_sales: item.bookings[1].normal_sales,
                                //         extra_fee   : item.bookings[1].extra_fee,
                                //         discount    : item.bookings[1].discount,
                                //         book_balance: item.bookings[0].normal_sales,
                                //         booking_cost_all: item.bookings[1].normal_sales,
                                //         // order_makan : item.bookings[0].order_makan
                                //     }
                                // })}
                            />  : null}
                                        
                                        
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

