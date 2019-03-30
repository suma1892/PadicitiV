import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image, Dimensions, AppRegistry, AsyncStorage
} from 'react-native'

import s from '../../Components/Styles'
import {
    Colors,
    Metrics,
    Container,
    getIcon,
    ToolbarV2 as Toolbar,
    ItemField,
    TextView as Text,
    Button,
    Fonts, Touchable, CardMyTrip, getAirlineLogo
} from '../../Components/index'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import { Function, STRING } from '../../Utils'
import { paxNameHistory, paxSeatHistory } from '../../Utils/TrainUtils'
import { listCreditCard } from '../../Utils/dummy';
import Navbar from '../../Components/NavigationBottom'

import { API, getURlHistory } from '../../Services/API'
import { Parameter } from '../../Services/Parameter'
import { JSONGetFile, JSONPostFile, JSONPost_, JSONGet_ } from '../../Services/JsonService'
import moment from 'moment'
const backAction = NavigationActions.back({ key: '' })

const listNamePassanger = [
    {
        date: 'Sabtu, 29 Apr 2017',
        type: 'penerbangan',
        img: getIcon('ic_flight'),
        nameArmada: 'Lion Air',
        checkin_time: '13.20',
        from: 'Jakarta(CKG)',
        airport_from: 'Bandara Soekarno Hatta',
        checkout_time: '16.10',
        to: 'Bali(DPS)',
        airport_to: 'Nugrah Rai Int'
    },
    {
        date: 'Sabtu, 29 Apr 2017',
        type: 'kereta',
        img: getIcon('ic_train'),
        nameArmada: 'Garuda',
        checkin_time: '13.20',
        from: 'Jakarta(CKG)',
        airport_from: 'Bandara Soekarno Hatta',
        checkout_time: '16.10',
        to: 'Bali(DPS)',
        airport_to: 'Nugrah Rai Int'
    },
    {
        date: 'Sabtu, 29 Apr 2017',
        type: 'hotel',
        img: getIcon('ic_hotel'),
        nameArmada: 'Lion Air',
        checkin_time: '13.20',
        from: 'Jakarta(CKG)',
        airport_from: 'Bandara Soekarno Hatta',
        checkout_time: '16.10',
        to: 'Bali(DPS)',
        airport_to: 'Nugrah Rai Int'
    },

]
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            listName: listNamePassanger,
            parameter: {
                userid: null,
            },
            parameterPost: {
                email: null,
                credentialCode: "padiciti",
                credentialPass: "padiciti123",
                // email : "IND"
            },
            data: [],
            loading: true,
        });
    }

    componentDidMount() {
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
            data: [],
            loading: true
        }, () => {
            this.AuthGet('get_flight')
        })
    }

    AuthGet = (type) => {
        try {
            this.setState({ loading: true })
            let url = getURlHistory(type, this.state.parameter)
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
                        this.setState({ loading: false, data: [...this.state.data, ...history] }, () => {

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
        console.log("LIMIT DATE : "+ JSON.stringify(this.state.data))
        return (
            <Container style={[s.container, { backgroundColor: Colors.whitesmoke }]}>
                <View style={{ flex: 1, marginBottom: Metrics.navbar }}>
                    <FlatList
                        data={this.state.data}
                        keyExtractor={(item, index) => `key-${index}`}
                        renderItem={({ item }) => (
                            <View style={{ marginBottom: Metrics.padding.normal }}>
                                <View style={{ backgroundColor: Colors.white }}>
                                    <CardMyTrip
                                        date={Function.FormeteDate(item.bookings[0].depDate, 'YYYYMMDD', 'dddd, DD MMM YYYY')}
                                        trn_code = {'Transaction Code : ' + item.transaction_code}
                                        type={'penerbangan'}
                                        status={item.trn_status}
                                        transactiontime={moment(item.payment_limit_date).format("DD MMM YYYY")+moment(item.payment_limit_time).format(" HH:MM:SS")}
                                        img={getIcon('ic_flight')}
                                        img_maskapai={getAirlineLogo(item.bookings[0].flightNo.substr(0, 2).toLowerCase())}
                                        nameArmada={item.bookings[0].airline}
                                        checkin_time={Function.SubstringTime(item.bookings[0].depTime)}
                                        from={item.bookings[0].orgCity + ' (' + item.bookings[0].orgCode + ') '}
                                        airport_from={item.bookings[0].orgAirport}
                                        checkout_time={Function.SubstringTime(item.bookings[0].arvTime)}
                                        to={item.bookings[0].destCity + ' (' + item.bookings[0].destCode + ') '}
                                        airport_to={item.bookings[0].destAirport ? item.bookings[0].destAirport : null}
                                        onPress={() => navigation.navigate((item.trn_status.toLowerCase() === 'y' ? 'EtiketFlight' : 'DetilPemesanan'), { slug: 'history', data: item })}
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

