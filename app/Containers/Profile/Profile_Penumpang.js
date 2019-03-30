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
    Fonts, Touchable, CardPessanger
} from '../../Components/index'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import { Function, STRING } from '../../Utils'
import { listCreditCard } from '../../Utils/dummy';
import { API, getURlHistory } from '../../Services/API'
import { Parameter } from '../../Services/Parameter'
import { JSONGetFile } from '../../Services/JsonService'
const backAction = NavigationActions.back({ key: '' })

const listNamePassanger = [
    { name: 'Vivi Nababan' },
    { name: 'Vivi Nababan' },
    { name: 'Vivi Nababan' },
]

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            data: [],
            loading: true,
        });
    }
    componentDidMount() {

        const { params } = this.props.navigation.state;
        // this.setState({sort_value : params.sort_value})
        AsyncStorage.getItem('UserData', (err, UserData) => {
            if (UserData) {
                this.setState({ id: Function.JsonParse(UserData).clientId })
                this.AuthGet('get_flight_passanger', { userid: this.state.id, type_passanger: 'ADULT' })
            }
        })

    }

    handleRefresh = () => {
        this.setState({
            data: [],
            loading: true
        }, () => {
            this.AuthGet('get_flight_passanger', { userid: this.state.id, type_passanger: 'ADULT' })
        })
    }


    AuthGet = (type, passengers) => {
        const { params } = this.props.navigation.state;
        try {
            this.setState({ loading: true })
            let url = getURlHistory(type, passengers)
            JSONGetFile(url, null).then((response) => {
                switch (type) {
                    case 'get_flight_passanger':
                        var history = []
                        var Item = null
                        var A = 0;
                        var AD = 0

                        while (A < response.passengers.length) {
                            history.push({ title: response.passengers[A][0], full_name: response.passengers[A][1] + ' ' + response.passengers[A][2] })
                            A++
                        }
                        this.setState({ data: [...this.state.data, ...history] }, () => {
                            switch (passengers.type_passanger) {
                                case 'ADULT':
                                    this.AuthGet('get_flight_passanger', { userid: this.state.id, type_passanger: 'CHILD' })
                                    break
                                case 'CHILD':
                                    this.AuthGet('get_flight_passanger', { userid: this.state.id, type_passanger: 'INFANT' })
                                    break
                                default:
                                this.setState({loading : false})
                                break;

                            }
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
        const { dispatch, navigate } = this.props.navigation;
        return (
            <Container style={s.container}>
                <Toolbar
                    add
                    onPressAdd={() => console.log('')}
                    centerTitle
                    style={s.toolbar}
                    type={next => this.setState({ next })}
                    title={STRING.Label.costumer_profile}
                    barStyle={s.toolbar}
                    left={[{
                        icon: 'ic_arrow_back',
                        onPress: () => dispatch(backAction)
                    }]}
                />

                <View style={{ flex: 1, backgroundColor: Colors.whitesmoke }
                }>
                    <FlatList
                        data={this.state.data}
                        keyExtractor={(item, index) => `key-${index}`}
                        renderItem={({ item }) => (
                            <View style={{ marginBottom: Metrics.padding.small }}>
                                <CardPessanger
                                    name={item.full_name}
                                    onPressEdit={() => console.log('Hapus')}
                                />
                            </View>
                        )
                        }
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

