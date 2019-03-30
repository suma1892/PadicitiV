import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image, Dimensions, AppRegistry, AsyncStorage
} from 'react-native'
import {CardIJDK}  from '../../Components'
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
      airport_to:'Nugrah Rai Int',
    },
]

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            dataSource:[],
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
            loading : false,
        });
    }

    async componentDidMount(){
        console.log("Helo world")
        AsyncStorage.getItem('UserData', (err, UserData) => {
            if (UserData) {
               this.state.parameterPost.email = Function.JsonParse(UserData).client_email
               this.state.parameter.userid = Function.JsonParse(UserData).clientId 
                console.log("PAX LIST : "+ JSON.stringify(Function.JsonParse(UserData).client_email))
            } 
        let tampJSON = JSON.stringify(Function.JsonParse(UserData).client_email)
        let   FETCH_TIMEOUT = 10000;
        return fetch('http://182.23.65.29:8888/free-0.0.1/his/get-by-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                "Email": Function.JsonParse(UserData).client_email,
                "Status": "",
                "email": Function.JsonParse(UserData).client_email,
                "status": ""
              })
      }).then((response) => response.json())
      .then((responseJson) => {
          console.log("respone jason====================================================> : "+responseJson.Data[0].TransactionCode)
        //   console.log("respone jason ddd====================================================> : "+ responseJson.codeMessages)
        this.setState({
          isLoading: false,
          dataSource: responseJson.Data,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
    }
        )}
    handleRefresh = () => {
        this.setState({
            data :[],
            loading : true
        }, ()=> {
            this.AuthGet('get_traint')
        })
}

    AuthGet = (type) => {
        try {
            this.setState({ loading: true })
            let url = getURlHistory(type,this.state.parameter)
            JSONGet_(url, null).then((response) => {
                response = response.data
                switch (type) {
                    case 'get_traint':
                    var history = []
                    var Item = null
                    response.transactions && response.transactions.map((item, i) => (
                        Item = item,
                        Item['slug'] = 'traint',
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

    render() {
        let navigation = this.props.screenProps.navigation
        // console.log("DATA SUMA : "+JSON.stringify(this.state.dataSource))
        console.log("TIME HAS COME : "+JSON.stringify(this.state.dataSource))
    
        return (
            <Container style={[s.container,{backgroundColor : Colors.whitesmoke}]}>
                    <View style={{flex:1, marginBottom : Metrics.navbar}}> 
                        <FlatList
                            data = {this.state.dataSource}
                            keyExtractor={(item, index) => `key-${index}`}
                            
                            renderItem ={({ item }) => (
                                <View style={{marginBottom: Metrics.padding.normal}}>
                                         <View style ={{backgroundColor : Colors.white}}>
                                         <CardMyTrip
                                        date={"Transaction Date : "+Function.FormeteDate(item.TransactionDate, 'YYYYMMDD','dddd, DD MMM YYYY')}
                                        trn_code = {'Transaction Code : ' + item.TransactionCode}
                                        type={'kereta'}
                                        status = {item.StatusTransaction}
                                        transactiontime ={moment(item.PaymentLimit).format("DD MMM YYYY HH:MM:SS")}
                                        img={getIcon('ic_jetski')}
                                        img_maskapai={getIcon('ic_jetski')}
                                        nameArmada={" "}
                                        checkin_time={"IDR "+Function.convertToPrice(item.Amount)}
                                        from={" "}
                                        // airport_from={item.bookings[0].orgAirport}
                                        checkout_time={" "}
                                        to={" "}
                                        // airport_to={item.bookings[0].destAirport}
                                        onPress ={() =>  navigation.navigate(('DetailEtiket'), {
                                            // pax_list,
                                            slug : 'history',
                                            transaction_code : item.TransactionCode,
                                            trn_status : item.StatusTransaction,
                                            Email : item.Email,
                                            

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

