import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image, Dimensions, AppRegistry, AsyncStorage, Alert as Confirmation
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

import { API, getURlHistory , getURL} from '../../Services/API'
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
            //    this.state.parameter.userid = Function.JsonParse(UserData).clientId 
                this.AuthPost('pln')
               
            } 
        })
        
    }
    
    handleRefresh = () => {
        this.setState({
            data :[],
            loading : true
        }, ()=> {
            this.AuthPost('pln')
        })
}

AuthPost = (type, parameter) => {
    let navigation = this.props.screenProps.navigation
    try {
        this.setState({ loading: true })
        let url =  type === 'url_payment_request' ? getURL('url_payment_request') : getURlHistory(type)

        JSONPostFile(url, parameter ? parameter : this.state.parameterPost).then((response) => {
            
            switch (type) {
                case 'pln':
                    var history = []
                    var Item = null
                    // console.log(response)
                    response.historyList && response.historyList.map((item, i) => (
                        Item = item,
                        Item['slug'] = 'hotel',
                        history.push(Item)
                    ))
                    this.setState({ data: [...this.state.data, ...history] }, () => {
                        this.setState({ loading: false })
                    })
                    break;

                    case 'url_payment_request':
                    this.setState({ loading: false }, ()=>{
                        console.log('response')
                        navigation.navigate('PaymentPLN', {DataJson : response})
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

reserveAction(item) {
    console.log(item)
    Confirmation.alert(
        'Detail Transaksi ' ,
        'Tanggal Transaksi : ' + Function.FormeteDate(item.transactionDate.split('.')[0], 'YYYY-MM-DD HH:mm:ss', 'DD MMM YYYY') +'\n\nNo. Meter / ID Pel : ' + item.customerID + '\n\nNama : '+ item.customerName+ '\n\nNominal : Rp '+ Function.convertToPrice(item.nominalBuyer.split('.')[0])  + (item.token ? '\n\nToken : '+ item.token : ''),
        
        [
          {text: 'Close', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
         
          
          {text: item.trnStatus !== 'P' && item.trnStatus !== 'C' && item.trnStatus !== 'X' && item.trnStatus !== 'Y' ? 'Ya, Lanjutkan' : null, onPress: () =>  item.trnStatus !== 'P' && item.trnStatus !== 'C' && item.trnStatus !== 'X' && item.trnStatus !== 'Y' ? this.AuthPost('url_payment_request', {
          credentialCode : 'padiciti', 
          credentialPass : 'padiciti123', 
          email : this.state.parameterPost.email,
          transactionCode : item.transactionCode, 
          languageVer : 'ID', 
          transactionCode : item.transactionCode,
          // token : item.token, 
          payment_amount : item.totalAmount}) : console.log ('null')} 
        ],
        { cancelable: false }
      )
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
                                    // date={Function.FormeteDate(item.bookingHotelItem.dateFrom, 'YYYYMMDD','dddd, DD MMM YYYY')}
                                    type={'kereta'}
                                    status = {item.trnStatus}
                                    img={getIcon('ic_pln')}
                                    // img_maskapai={'ic_kereta_api'}
                                    nameArmada={item.customerName}
                                    checkin_time={'Token listrik Rp '+ Function.convertToPrice(item.nominalBuyer.split('.')[0])}
                                    // from={item.tarifPwr}
                                    // airport_from={item.tarifPwr}
                                    checkout_time={item.tarifPwr}
                                    // to={item.bookingHotelItem[0].des_name + ' ('+item.bookingHotelItem[0].dest_code+') '}
                                    // airport_to={item.bookings[0].destAirport}
                                    onPress ={() => this.reserveAction(item)
                                }
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

