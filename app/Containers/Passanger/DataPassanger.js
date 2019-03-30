import React, { Component } from 'react'
import {
    AppRegistry,
    View,
    StyleSheet,
    Alert,
    ScrollView, AsyncStorage, FlatList
} from 'react-native'
import {
    TextView as Text,
    Toolbar,
    Scale,
    Colors,
    Fonts,
    Touchable,
} from '../../Components/'
import { sort_list, filter_time, filter_class } from '../../Services/JSON/Sort_Filter';
import { API, getURlHistory } from '../../Services/API'
import { Parameter } from '../../Services/Parameter'
import { JSONGetFile, JSONPostFile } from '../../Services/JsonService'
import { Function, STRING } from '../../Utils/index';
export default class DataPassanger extends Component {
    constructor(props) {
        super(props);
        this.state = {
            time_value: null,
            class_value: null,
            train_value: null,
            sort_value: null,
            data: [],
            loading : false
        }
    }

    componentDidMount() {
        
        this.checkData()
    }

    handleRefresh = () => {
        this.setState({
            data :[],
            loading : true
        }, ()=> {
            this.checkData()
        })
}

checkData(){
    const { params } = this.props.navigation.state;
    AsyncStorage.getItem('UserData', (err, UserData) => {
        console.log('<< UserData >>')
        console.log(UserData)
        if (UserData) {
            if (params.metod_flight === 'INT'){
                this.AuthGet('get_flight_passanger_int', {type_passanger : params.parameter.type_passanger, userid : Function.JsonParse(UserData).clientId})
            } else if (params.slug){
                this.AuthGet('get_traint_passanger', {type_passanger : params.parameter.type_passanger, userid : Function.JsonParse(UserData).clientId})
            }else {
                this.AuthGet('get_flight_passanger', {type_passanger : params.parameter.type_passanger, userid : Function.JsonParse(UserData).clientId})
            }
            
        } else {
            AsyncStorage.getItem('CustomerData', (err, CustomerData) => {
                
                if (CustomerData !== null) {
                    // this.AuthPost('url_non_member')
                    console.log( Function.JsonParse(CustomerData))
                    if (params.metod_flight === 'INT'){
                        this.AuthGet('get_flight_passanger_int', {type_passanger : params.parameter.type_passanger, userid : Function.JsonParse(UserData).clientId})
                    } else if (params.slug){
                        this.AuthGet('get_traint_passanger', {type_passanger : params.parameter.type_passanger, userid : Function.JsonParse(UserData).clientId})
                    }else {
                        this.AuthGet('get_flight_passanger', {type_passanger : params.parameter.type_passanger, userid : Function.JsonParse(UserData).clientId})
                    }
                } else {
                    this.AuthPost('url_non_member')
                }
            })
        }
    })
}

    AuthPost = (type, parameter) => {
        // Alert.alert("TYPE POST : "+type)
        const { params } = this.props.navigation.state;
        try {
            this.setState({ loading: true })
            let url = getURlHistory(type)
            console.log("URLSS : "+url)
            JSONPostFile(url, params.nonMember).then((Respone) => {
                switch (Respone.respCode) {

                    case '0':
                        this.setState({ loading: false }, () => {
                          
                            Function.SaveDataJson('CustomerData', Function.JsonString({
                                clientId: Respone.userId,
                                client_name: Respone.fullName,
                                client_email: Respone.email,
                                client_phone: Respone.phoneNumber,
                            }))

                            AsyncStorage.getItem('CustomerData', (err, CustomerData) => {
                                
                                if (CustomerData !== null) {
                                    // this.AuthPost('url_non_member')
                                    console.log( Function.JsonParse(CustomerData))
                                    this.AuthGet('get_flight_passanger', {type_passanger : params.parameter.type_passanger, userid : Function.JsonParse(CustomerData).clientId})
                                } 
                            })
                            // this.AuthGet('get_flight_passanger', { type_passanger: params.parameter.type_passanger, userid: Respone.userId })
                        })
                        break
                
                    default:
                        this.setState({ loading: false }, () => {
                            Alert(Respone.inRespMsg)
                        })
                        // Alert(Respone.inRespMsg)
                        break
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

    AuthGet = (type, parameter) => {
        // Alert.alert("TYPE : "+type)
        // Alert.alert("Parameter : "+ parameter)
        
        try {
            this.setState({ loading: true })
            let url = getURlHistory(type, parameter)
            JSONGetFile(url, null).then((response) => {
                this.setState({ loading: false })
                var history = []
                switch (type) {
                    case 'get_flight_passanger':
                       
                        var Item = null
                        var A = 0;
                        var AD = 0
                            if (response.passengers.length){ while (A < response.passengers.length) {
                                history.push({ title: response.passengers[A][0], 
                                    full_name: response.passengers[A][1] + ' ' + response.passengers[A][2],
                                    brithdate : response.passengers[A][4],
                                    no_identity : response.passengers[A][6]  
                                  })
                                A++
                            }}
            
                        this.setState({data: [...this.state.data, ...history] })
                        break;
                    case 'get_flight_passanger_int':
                        var Item = null
                        var A = 0;
                        var AD = 0

                    if (response.passengers.length){ while (A < response.passengers.length) {
                        // if (response.passengers[A][7]){
                            history.push({ 
                                title: response.passengers[A][0], 
                                        full_name: response.passengers[A][1] + ' ' + response.passengers[A][2],
                                        brithdate : response.passengers[A][4],
                                        no_identity : response.passengers[A][6],
                                        no_pasport : response.passengers[A][7]})
                        // }
                        A++
                    }}
                    this.setState({data: [...this.state.data, ...history] })

                    break;

                    case 'get_traint_passanger':
                        var Item = null
                        var A = 0;
                        var AD = 0
                        console.log('Traint')
                        console.log(response.passengers)
                    if (response.passengers.length){ while (A < response.passengers.length) {
                        
                        if (response.passengers){
                            history.push({ 
                                title: "",
                                        full_name: response.passengers[A][0],
                                        brithdate : response.passengers[A][2],
                                        no_identity : response.passengers[A][1],
                                        // no_pasport : response.passengers[A][7]
                                    })
                        }
                       
                        A++
                    }}
                    this.setState({data: [...this.state.data, ...history] })

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
        const { navigation } = this.props
        const { state, goBack } = navigation
        const { params } = this.props.navigation.state;
        // console.log("DATA PASSANGER : "+ (this.state.data))
        //Alert.alert(JSON.stringify(this.state.data))
        
        return (
            <View style={s.container}>
                <Toolbar
                    arrow_back
                    onPress={() => goBack()}>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                        <Text style={s.toolbar_title}>{STRING.Label.costumer_data}</Text>
                    </View>
                </Toolbar>

                <FlatList
                    data={this.state.data}
                    keyExtractor={(item, index) => `key-${index}`}
                    renderItem={({ item, index }) => (
                        <ItemListCheck
                            key={index}
                            onPress={() => this.setState({ sort_value: item }, () => {
                                navigation.goBack();
                                this.props.navigation.state.params.ActivityResult({ slug: 'passanger', data: this.state.sort_value, type: params.parameter.type_passanger, key: params.Key })

                            })}
                            title={item.title + ' ' + item.full_name}
                            subtitle={item.subtitle}
                            slug={item.full_name}
                            active={this.state.sort_value === item} />
                    )}

                    refreshing={this.state.loading}
                    onRefresh={this.handleRefresh}
                />
            </View>
        )
    }
}

class ItemListCheckBox extends Component {
    render() {
        let { props } = this
        return (
            <Touchable onPress={props.onPress}>
                <View style={s.item_frame}>
                    {props.title && <Text style={s.item_title}>{props.title}</Text>}
                    {props.subtitle && <Text style={s.item_subtitle}>{props.subtitle}</Text>}
                    <View style={[s.checkbox, props.active && { borderColor: Colors.pizzaz }]}>
                        <View style={props.active && s.checkbox_active} />
                    </View>

                </View>
            </Touchable>
        )
    }
}

class ItemListCheck extends Component {
    render() {
        let { props } = this
        return (
            <Touchable onPress={props.onPress}>
                <View style={s.item_frame}>
                    {props.title && <Text style={s.item_title}>{props.title}</Text>}
                    {props.subtitle && <Text style={s.item_subtitle}>{props.subtitle}</Text>}
                    <View style={[s.check, props.active && { borderColor: Colors.pizzaz }]} />

                </View>
            </Touchable>
        )
    }
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    toolbar_title: {
        fontSize: Scale(16),
        color: Colors.white,
        flex: 1,
    },
    toolbar_subtitle: {
        ...Fonts.bold,
        fontSize: Scale(14),
        color: Colors.white,
    },

    title_section: {
        ...Fonts.bold,
        fontSize: Fonts.size.medium,
        paddingHorizontal: Scale(16),
        paddingVertical: Scale(8),
    },
    checkbox: {
        backgroundColor: Colors.white,
        borderColor: Colors.border,
        borderWidth: Scale(2.5),
        width: Scale(17.5),
        height: Scale(17.5),
        borderRadius: Scale(4),
        padding: Scale(2),
    },

    check: {
        backgroundColor: Colors.white,
        borderColor: Colors.transparent,
        borderBottomWidth: Scale(2),
        borderRightWidth: Scale(2),
        width: Scale(10),
        height: Scale(20),
        transform: [{ rotate: '45deg' }]
    },

    checkbox_active: {
        backgroundColor: Colors.pizzaz,
        flex: 1,
        borderRadius: Scale(2)
    },
    item_frame: {
        backgroundColor: Colors.white,
        paddingHorizontal: Scale(16),
        paddingVertical: Scale(11),
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    item_title: {
        fontSize: Fonts.size.regular,
        flex: 1,
    },
    item_subtitle: {
        flex: 4,
        fontSize: Fonts.size.regular,
        color: Colors.warm_grey
    },

    btn_reset: {
        borderWidth: 1,
        borderColor: Colors.pizzaz,
        borderRadius: Scale(3),
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: Scale(8),
        paddingVertical: Scale(4),
    },
    btn_reset_txt: {
        color: Colors.pizzaz,
    },

    btn_apply: {
        backgroundColor: Colors.pizzaz,
        paddingHorizontal: Scale(8),
        paddingVertical: Scale(16),
        justifyContent: 'center',
        alignItems: 'center',
    },
    btn_apply_txt: {
        fontSize: Fonts.size.medium,
        color: Colors.white
    }
})

AppRegistry.registerComponent("padiciti", () => TrainSortFilter);
