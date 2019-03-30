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
    Fonts, Touchable, CardMyTrip} from '../../Components/index'
import {NavigationActions } from 'react-navigation';
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
                credential_code : 'padiciti',
                credential_pass : 'padiciti123'
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
                this.AuthGet('get_bus')
               
            } 
        })
        
    }
    
    handleRefresh = () => {
        this.setState({
            data :[],
            loading : true
        }, ()=> {
            this.AuthGet('get_bus')
        })
}

    AuthGet = (type) => {
        try {
            this.setState({ loading: true })
            let url = getURlHistory(type,this.state.parameter)
            JSONGet_(url, null).then((response) => {
                response = response.data
                switch (type) {
                    case 'get_bus':
                    var history = []
                    var Item = null
                    response.transactions && response.transactions.map((item, i) => (
                        Item = item,
                        Item['slug'] = 'bus',
                        history.push(Item)
                    ))
                    this.setState({ loading: false , data: [...this.state.data, ...history] }, () => {
                        // this.AuthPost('hotel')
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
    

    passengers(pass){
        var arrPas =[]
        pass.map((item, index) => (
            arrPas.push({
                name : item.passenger_name,
                idNumber : item.passenger_identity_no,
                seatNames : [item.passenger_seat],
            })
        ))
        return arrPas
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
                                        date={Function.FormeteDate(item.bookings[0].dep_date, 'YYYYMMDD','dddd, DD MMM YYYY')}
                                        trn_code = {'Transaction Code : ' + item.transaction_code}
                                        type={'bus'}
                                        status = {item.trn_status}
                                        transactiontime ={moment.duration(moment(item.payment_limit_date, 'YYYYMMDDHHmm').diff(moment(new Date(), 'YYYYMMDDHHmm'))).hours() + ' : '
                                        + moment.duration(moment(item.payment_limit_date, 'YYYYMMDDHHmm').diff(moment(new Date(), 'YYYYMMDDHHmm'))).minutes() + ' : '
                                        + moment.duration(moment(item.payment_limit_date, 'YYYYMMDDHHmm').diff(moment(new Date(), 'YYYYMMDDHHmm'))).seconds()}
                                        img={getIcon('ic_bus')}
                                        // img_maskapai={getIcon('ic_bus')}
                                        nameArmada={item.bookings[0].travelNam}
                                        checkin_time={item.bookings[0].dep_time}
                                        from={item.bookings[0].org_name + ' ('+item.bookings[0].org_code+') '}
                                        // airport_from={item.bookings[0].orgAirport}
                                        checkout_time={item.bookings[0].arv_time}
                                        to={item.bookings[0].dest_name + ' ('+item.bookings[0].dest_code+') '}
                                        // airport_to={item.bookings[0].destAirport}
                                        onPress ={() =>  navigation.navigate((item.trn_status === 'Y' ? 'EtiketKereta' :  'BusReview'), {
                                        // onPress ={() =>  navigation.navigate((item.trn_status === 'Y' ? 'EtiketKereta' :  'TrainReview'), {
                                            // pax_list,
                                            slug : 'history',
                                            
                                            trn_status : item.trn_status,
                                            book_depart : {
                                                // ...train_depart,
                                                transactionCode : item.transaction_code,
                                                book_code : item.bookings[0].bookCode,
                                                org :item.bookings[0].org_name,
                                                des :item.bookings[0].dest_name,
                                                dep_date : item.bookings[0].dep_date,
                                                
                                                train_name  : item.bookings[0].train_name,
                                                train_no :item.bookings[0].train_no,
                                                book_code   : item.bookings[0].book_code,
                                                num_code    : item.bookings[0].num_code,
                                                pax_num     : [item.bookings[0].num_pax_adult, item.bookings[0].num_pax_child, item.bookings[0].num_pax_infant],
                                                pax_name    : paxNameHistory(item.bookings[0].passengers),
                                                seat        : paxSeatHistory(item.bookings[0].passengers),
                                                normal_sales: item.bookings[0].normal_sales,
                                                extra_fee   : item.bookings[0].extra_fee,
                                                discount    : item.bookings[0].discount,
                                                passengers : this.passengers(item.bookings[0].passengers),
                                                // book_balance: item.bookings[0].discount,
                                                booking_cost_all: item.bookings[0].normal_sales,
                                                // order_makan : item.bookings[0].order_makan

                                                dep_date_2   : moment(item.bookings[0].dep_date, 'YYYYMMDD').format('DD MMM YYYY'),
                                                dep_time      : moment(item.bookings[0].dep_time, 'HHmmss').format('HH:mm'),
                                                org_code : item.bookings[0].org_code,
                                                des_code : item.bookings[0].dest_code,
                                                num_pax_adult : item.bookings[0].num_pax_adult,
                                                num_pax_child : item.bookings[0].num_pax_child,
                                                num_pax_infant : item.bookings[0].num_pax_infant,
                                                price_adult : item.bookings[0].price_adult * item.bookings[0].num_pax_adult,
                                                price_child : item.bookings[0].price_child * item.bookings[0].num_pax_child,
                                                price_infant : item.bookings[0].price_infant * item.bookings[0].num_pax_infant,
                                                admin_fee : item.bookings[0].admin_fee,
                                                services_fee : item.bookings[0].services_fee,
                                                booking_type : item.bookings[0].booking_type,
                                                arv_time      : moment(item.bookings[0].arv_time, 'HHmmss').format('HH:mm'),
                                                duration_string :  moment.duration(moment(item.bookings[0].arv_date + item.bookings[0].arv_time, 'YYYYMMDDHHmm').diff(moment(item.bookings[0].dep_date+item.bookings[0].dep_time, 'YYYYMMDDHHmm'))).hours() + 'j '+ moment.duration(moment(item.bookings[0].arv_date + item.bookings[0].arv_time, 'YYYYMMDDHHmm').diff(moment(item.bookings[0].dep_date+item.bookings[0].dep_time, 'YYYYMMDDHHmm'))).minutes() + 'm',
                                                price : item.bookings[0].normal_sales
                                            }, 
                                            book_return : item.bookings.length > 1 && {
                                                // ...train_depart,
                                                book_code : item.bookings[1].bookCode,
                                                org :item.bookings[1].org_code,
                                                des :item.bookings[1].dest_code,
                                                dep_date : item.bookings[1].dep_date,
                                                train_name  : item.bookings[1].train_name,
                                                train_no :item.bookings[1].train_no,
                                                book_code   : item.bookings[1].book_code,
                                                num_code    : item.bookings[1].num_code,
                                                pax_num     : [item.bookings[1].num_pax_adult, item.bookings[1].num_pax_child, item.bookings[1].num_pax_infant],
                                                pax_name    : paxNameHistory(item.bookings[1].passengers),
                                                seat        : paxSeatHistory(item.bookings[1].passengers),
                                                normal_sales: item.bookings[1].normal_sales,
                                                extra_fee   : item.bookings[1].extra_fee,
                                                discount    : item.bookings[1].discount,
                                                // book_balance: item.bookings[0].discount,
                                                booking_cost_all: item.bookings[1].normal_sales,
                                                // order_makan : item.bookings[0].order_makan

                                                dep_date_2   : moment(item.bookings[1].dep_date, 'YYYYMMDD').format('DD MMM YYYY'),
                                                dep_time      : moment(item.bookings[1].dep_time, 'HHmmss').format('HH:mm'),
                                                org_code : item.bookings[1].org_code,
                                                des_code : item.bookings[1].dest_code,
                                                num_pax_adult : item.bookings[1].num_pax_adult,
                                                num_pax_child : item.bookings[1].num_pax_child,
                                                num_pax_infant : item.bookings[1].num_pax_infant,
                                                price_adult : item.bookings[1].price_adult,
                                                price_child : item.bookings[1].price_child,
                                                price_infant : item.bookings[1].price_infant,
                                                admin_fee : item.bookings[1].admin_fee,
                                                services_fee : item.bookings[1].services_fee,
                                                booking_type : item.bookings[1].booking_type,
                                                arv_time      : moment(item.bookings[1].arv_time, 'HHmmss').format('HH:mm'),
                                                duration_string :  moment.duration(moment(item.bookings[0].arv_date + item.bookings[0].arv_time, 'YYYYMMDDHHmm').diff(moment(item.bookings[0].dep_date+item.bookings[0].dep_time, 'YYYYMMDDHHmm'))).hours() + 'j '+ moment.duration(moment(item.bookings[0].arv_date + item.bookings[0].arv_time, 'YYYYMMDDHHmm').diff(moment(item.bookings[0].dep_date+item.bookings[0].dep_time, 'YYYYMMDDHHmm'))).minutes() + 'm',
                                                price : item.bookings[0].normal_sales
                                            }
                                        })}
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

