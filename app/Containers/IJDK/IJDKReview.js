import React, { Component } from 'react'

import { ScrollView,AppRegistry, Text, View,Alert, StyleSheet, KeyboardAvoidingView, Alert as Confirmation} from 'react-native';
// import { Constants } from 'expo';
import { NavigationActions } from 'react-navigation';
import { _OS, Metrics } from '../../Assets';
// You can import from local files
// import AssetExample from './components/AssetExample';
import { CardSortTrain,CardShortPax } from '../../Components/TrainCardComponent';
import {CardSortV3,  CardSortTrain1, CardSortIJDK } from '../../Components/IJDKCardComponent';
import { STRING, Function, navigateTo } from '../../Utils';

// or any pure javascript modules available in npm
// import { Card } from 'react-native-paper';
import {
    // TextView as Text,
    Toolbar,
    Scale,
    Colors,
    Fonts,
    Button,
    Loading,
    Touchable
} from '../../Components/'
export default class IJDKReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            DataJon:[]
        }
    }
    CancelConfirmation (){
        Confirmation.alert(
            'Yakin ingin membatalkan pesanan Anda ?',
            '',
            [
                { text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                {
                    text: 'Ya, Lanjutkan', onPress: () => this.setState({ select_seat: this.state.select_seat, current_seat: this.state.current_seat }, () => {
                        this.CancelAction()
                    })
                },
            ],
            { cancelable: false }
        )

    }

    CancelAction() {
        const { navigation } = this.props
        const { params } = navigation.state
        const { book_depart, book_return } = params
        this.setState({ loading: true })
        JSONGetFile(getURLTrain('cancel', { type: book_return ? 'round-trip' : 'one-way', depBookCode: book_depart.book_code, retBookCode: book_return ? book_return.book_code : '' }), null).then((responses) => {
            console.log(responses)
            this.setState({ loading: true }, () => {
                switch (responses.err_code) {
                    case 0:
                    Alert('Berhasil membatalkan pesanan Anda.')
                    navigateTo('TrainReservation' ,this.props.dispatch,this.props.navigation,null )
                        break
                    default:
                        if (responses.err_msg) this.setState({ loading: false}, () =>{
                            Alert(responses.err_msg)
                        })
                }
            })
        }).catch((errors) => {
            this.setState({ loading: false }, () => {
                console.log('error', errors)
            })
        })
    }


    async CheckSeat() {
        let { navigation } = this.props
        let { state } = navigation
        let { pax_list } = state.params
        let {  EventDateStart, EventDateUntil,Adult,Child,Infant } = pax_list
        return fetch('http://182.23.65.29:8888/free-0.0.1/sch-invev/get', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
          
            "Adult": Adult,
            "Child": Child,
            "EventDateStart": EventDateStart,
            "EventDateUntil": EventDateUntil,
            "Infant": Infant
            })
      })
      .then((response) => response.json())
      .then((responseJson) => {

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


    backAndroid() {
        const { params } = this.props.navigation.state;
        // if (params.slug === 'history') {
            this.props.navigation.dispatch(finish)
        // } else {
            this.CancelConfirmation()
           
        // }
        return true
    }

  render() {
    let { navigation } = this.props
    let { state } = navigation
    let {pax_list, response,statue ,TampEmail, response1} = state.params
    let { type_trip, origination, destination, depart_date, return_date, Adult,pax_infant } = pax_list
    const ComponentView = _OS(KeyboardAvoidingView, View)
    let jsonParse = []
    if (statue==="nonmember"){
        jsonParse = JSON.parse(response1)
    }else{
        jsonParse = JSON.parse(response)        
    }
    // console.log("Pax list : "+ JSON.stringify(pax_list))
    // console.log("responese : "+ response)
    return (
        <ComponentView style={s.container} behavior='padding'>
        <Toolbar  
        arrow_back
        onPress ={ () => navigation.dispatch(NavigationActions.back({ key: "" }))}>
        <View>
        <Text style ={s.toolbar_title}>IJBA EVENT SCHEDULE</Text>
        </View>
    </Toolbar>
            <ScrollView keyboardShouldPersistTaps='always'>
            <View style={s.section_}>
                        <CardSortTrain1
                             alldetil
                            //  onPress = {() => navigation.navigate('QrCode', {book_code: book_depart.book_code})}
                            // onPressDetil = {() => navigation.navigate('TrainDetail', {data: book_depart, title : 'Kereta Pergi'})}
                            title       = {"Get Ready For Event"}
                            route       ={""}
                            date        ={"Hi, "+ jsonParse.userName}
                            BookConfirm  ={"Your booking has been confirmed. Please continue Payment"}/>
                    </View>
                    <View style={s.section_}>
                        <CardSortIJDK
                             alldetil
                            //  onPress = {() => navigation.navigate('QrCode', {book_code: book_depart.book_code})}
                            onPressDetil = {() => navigation.navigate('IJDKDetail', {pax_list,response, statue,response1,TampEmail})}
                            title       = {jsonParse.listBooking[0].eventName}
                            route       ={jsonParse.email}
                            date        ={"Transaction Code "+jsonParse.transactionCode}
                            train_name  ={"IDR "+Function.convertToPrice(jsonParse.bookBalance)}
                            discount    ={jsonParse.discount}/>
                    </View>
                    <View style={s.section_}>
                    <CardSortV3
                         alldetil
                        //  onPress = {() => navigation.navigate('QrCode', {book_code: book_depart.book_code})}
                        // onPressDetil = {() => navigation.navigate('IJDKDetail', {pax_list,response, TampEmail})}
                        title       = {"Payment Limit "+jsonParse.paymentLimitDate}
                        route       ={"Total Seat : "+ pax_list.Adult}
                        date        ={" "}
                        train_name  ={" "}/>
                </View>
                <Button onPress={() => navigation.navigate('PaymentIJDK', {pax_list,response, TampEmail})}>
                        {STRING.Label.more}
                </Button>
            </ScrollView>
      </ComponentView>

    );
  }
}

const s = StyleSheet.create({
    text_agreement: {
        paddingRight: Scale(16),
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    toolbar_title: {
        fontSize: Scale(18),
        color: Colors.white
    },
    toolbar_subtitle: {
        ...Fonts.bold,
        fontSize: Scale(14),
        color: Colors.white,
    },

    section_: {
        borderBottomColor: Colors.border,
        borderBottomWidth: Scale(1),
        paddingVertical: Scale(8),
    },
    title_section: {
        paddingHorizontal: Scale(16),
        paddingVertical: Scale(8),
        fontSize: Scale(14),
        letterSpacing: 0,
        textAlign: "left",
        color: Colors.warm_grey
    }
});

AppRegistry.registerComponent("padiciti", () => IJDKReview);
