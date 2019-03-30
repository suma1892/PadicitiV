import React, { Component } from 'react'

import { FlatList, ScrollView,AppRegistry, Text, View, StyleSheet, KeyboardAvoidingView, Alert as Confirmation} from 'react-native';
// import { Constants } from 'expo';
import { _OS, Metrics } from '../../Assets';
// You can import from local files
// import AssetExample from './components/AssetExample';
import { CardSortTrain,CardShortPax } from '../../Components/TrainCardComponent';
import {  CardSortTrain1 } from '../../Components/IJDKCardComponent';
import { NavigationActions } from 'react-navigation';

// or any pure javascript modules available in npm
// import { Card } from 'react-native-paper';
import moment from 'moment';

import {
    // TextView as Text, 
    Toolbar,
    Scale,
    Colors,
    Fonts,
    CardTrain,
    Icon,
    CardIJDK,
    CardIJDKV2,
    getIcon,
    Touchable,
    // Button,
    Modal,
    CardModalDate,
    Alert,
} from '../../Components'
export default class IJDKDetail extends Component {
    // CancelConfirmation (){
    //     Confirmation.alert(
    //         'Yakin ingin membatalkan pesanan Anda ?',
    //         '',
    //         [
    //             { text: 'Tidak', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
    //             {
    //                 text: 'Ya, Lanjutkan', onPress: () => this.setState({ select_seat: this.state.select_seat, current_seat: this.state.current_seat }, () => {
    //                     this.CancelAction()
    //                 })
    //             },
    //         ],
    //         { cancelable: false }
    //     )

    // }

    // CancelAction() {
    //     const { navigation } = this.props
    //     const { params } = navigation.state
    //     const { book_depart, book_return } = params
    //     this.setState({ loading: true })
    //     JSONGetFile(getURLTrain('cancel', { type: book_return ? 'round-trip' : 'one-way', depBookCode: book_depart.book_code, retBookCode: book_return ? book_return.book_code : '' }), null).then((responses) => {
    //         console.log(responses)
    //         this.setState({ loading: true }, () => {
    //             switch (responses.err_code) {
    //                 case 0:
    //                 Alert('Berhasil membatalkan pesanan Anda.')
    //                 navigateTo('TrainReservation' ,this.props.dispatch,this.props.navigation,null )
    //                     break
    //                 default:
    //                     if (responses.err_msg) this.setState({ loading: false}, () =>{
    //                         Alert(responses.err_msg)
    //                     })
    //             }
    //         })
    //     }).catch((errors) => {
    //         this.setState({ loading: false }, () => {
    //             console.log('error', errors)
    //         })
    //     })
    // }

    // backAndroid() {
    //     const { params } = this.props.navigation.state;
    //     if (params.slug === 'history') {
    //         this.props.navigation.dispatch(finish)
    //     } else {
    //         this.CancelConfirmation()
           
    //     }
    //     return true
    // }


  render() {
    let { navigation } = this.props
    let { state } = navigation
    let {pax_list, response1,response, statue, TampEmail} = state.params
    let { type_trip, origination, destination, depart_date, return_date, Adult,pax_infant } = pax_list
    const ComponentView = _OS(KeyboardAvoidingView, View)
    let jsonParse = []
    if (statue==="nonmember"){
        jsonParse = JSON.parse(response1)
    }else{
        jsonParse = JSON.parse(response)        
    }
    // let jsonParse = JSON.parse(response)
    // console.log("Pax list : "+ JSON.stringify(pax_list))
    console.log("responese : "+ jsonParse.email)
    return (
        <ComponentView style={s.container} behavior='padding'>

                <Toolbar  
                    arrow_back
                    onPress ={ () => navigation.dispatch(NavigationActions.back({ key: "" }))}>
                    <View>
                    <Text style ={s.toolbar_title}>Detail Schedule</Text>
                    </View>
                </Toolbar>
            <FlatList
                    data={jsonParse.listBooking}
                        renderItem={({item, index}) => {
                            let tampDate1 = jsonParse.listBooking
                           
                            return (
                                <CardIJDKV2
                                    key         = {index}
                                    name        = {"Seat  "+item.seats}
                                    price       = {item.priceAdult}
                                    seats= {" "}
                                    depart_time = {item.ticketType}
                                    arrive_time = {" "}
                                    />
                            )
                    }}
                    extraData={this.state}
                    keyExtractor={(item, index) => index}
                    />
      </ComponentView>

    );
  }
}
const ItemSeparator = () => <View style={{height: StyleSheet.hairlineWidth, flex:1, backgroundColor: Colors.border}}/>

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

AppRegistry.registerComponent("padiciti", () => IJDKDetail);
