import React, { Component } from 'react'
import {
    AppRegistry,
    View,
    StyleSheet,
    ScrollView,
    Animated,
    AsyncStorage, Alert as Confirmation
} from 'react-native'
import moment from 'moment'
import {
    TextView as Text,
    Toolbar,
    Icon,
    TrainRadio,
    TrainButton,
    TrainStepper,
    TrainForm, TrainInput,
    CardRecentSearch, DialogComponent, Alert, Loading
} from '../../Components/'

import { Colors, Scale, getIcon, Metrics, _OS} from '../../Assets'
import { STRING_TR, Function, STRING } from '../../Utils';
import { AnimatedValue } from '../../Utils/TrainUtils';
import { getURLTrain, getURL } from '../../Services/API';
import { JSONPostFile, JSONGetFile } from '../../Services/JsonService';
import { Parameter } from '../../Services/Parameter'
export default class PlnReservation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title : null,
            slug : null,
            email : null,
            number_id : null,
            nominal : 20000,
            filterActive : false,
            loading: false,
            radioItems : [{id : 0, nominal : 20000, label : 'Rp 20.000'},
            {id : 1, nominal : 50000, label : 'Rp 50.000'},
            {id : 2, nominal : 100000, label : 'Rp 100.000'},
            {id : 3, nominal : 200000, label : 'Rp 200.000'},
            {id : 4, nominal : 500000, label : 'Rp 500.000'},
            {id : 5, nominal : 1000000, label : 'Rp 1000.000'},
            {id : 6, nominal : 5000000, label : 'Rp 5000.000'}],
            type_trip   : 'token_listrik',
            animated    : new Animated.Value(0)
        }
    }

    toggle_animate = () => {
        Animated.timing(this.state.animated,{ toValue: this.state.type_trip === 'oneway' ? 0 : 1,duration: 500 }).start()
    }

    reserveAction = (Respone) => {
        Confirmation.alert(
            'Detail Anda sudah benar ?',
            'Anda tidak dapat mengubah detail pesanan setelah melanjutkan kehalaman pembayaran.\n\n No. Meter / ID Pel : ' + this.state.number_id + '\n Token Listrik : Rp '+ Function.convertToPrice(this.state.nominal)+ '\n Nama : ' + Respone.customerName,
            
            [
              {text: 'Periksa Kembali', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Ya, Lanjutkan', onPress: () => this.requestData(Respone)}
            ],
            { cancelable: false }
          )
    }

    reserveValidate = () => {
        let {email, number_id} = this.state

        this.setState({
            email_error  : null,
            number_id_error  : null,
            error_pax_adult     : [],
            error_pax_infant    : []
        })

        let regex_alphabet  = /^[a-z ,.'-]+$/i,
            regex_email     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
       
        if (!email) this.setState({ email_error: 'Email harus diisi' })
        if (!(regex_email.test(email))) this.setState({ email_error: 'Format Email salah' })
        if (!number_id) this.setState({ number_id_error: 'Id Pelanggan harus diisi' })
        
        if (email && number_id) {
            this.requestData()
        }
    }

    componentDidMount() { 
        AsyncStorage.getItem('PlnEmail', (err, PlnEmail) => {
            if (PlnEmail !== null) {
                this.setState({email: Function.JsonParse(PlnEmail).client_email})
            }
            else {
                AsyncStorage.getItem('UserData', (err, UserData) => {
                    if (UserData) {
                        this.setState({email : Function.JsonParse(UserData).client_email})
                     } 
                })
            }
        })
    }

    requestData (Type) {
        const { params } = this.props.navigation.state;
        try {
            this.setState({ loading: true })
            let url = Type ? getURL('url_payment_request') :getURL('url_inqweri_pln')
            var param = Type ? {credentialCode : 'padiciti', 
            credentialPass : 'padiciti123', 
            email : this.state.email, 
            transactionCode : Type.transactionCode, 
            languageVer : 'ID', 
            token : Type.token, 
            payment_amount : Type.totalAmount}
            :{credentialCode : 'padiciti', 
            credentialPass : 'padiciti123', 
            email : this.state.email, 
            nominal : this.state.nominal, 
            inputType : '0', 
            msn : this.state.number_id, 
            id_pelanggan : '000000000000'}
            
            JSONPostFile(url, param).then((Respone) => {
                console.log(Respone)
                if (!Type){
                    switch (Respone.respCode) {
                        case '00':
                            this.setState({ loading: false }, ()=>{
                                console.log(Respone)
                                Function.SaveDataJson('PlnEmail', Function.JsonString({
                                    client_email: this.state.email
                                })) 
                                this.reserveAction(Respone)
                                
                            })
                            break
                        default:
                            this.setState({ loading: false }, () => {
                            
                            })
                            // Alert(Respone.inRespMsg)
                            break
                    }

                } else {
                    this.setState({ loading: false }, ()=>{
                        this.props.navigation.navigate('PaymentPLN', {DataJson : Respone})
                    })
                }
                

            }).catch((err) => {
                this.setState({ loading: false }, () => {
                    // this.backAndroid()
                })

                console.log('err >>> ' + err)
            })
        } catch (Error) {
            this.setState({ loading: false }, () => {
                // this.backAndroid()
            })
            console.log('Error >>> ', Error)
        }

    }
    

    render() {
        let { ActivityResult } = this
        let { navigation } = this.props
        let {
            origination,
            destination,
            depart_date,
            return_date,
            pax_adult,
            pax_infant,
            type_trip
        } = this.state
        
        const toggle_return     = this.state.animated.interpolate({inputRange: [0, 1], outputRange: [0, Metrics.screenHeight] })
        const toggle_return2    = this.state.animated.interpolate({inputRange: [0, 1], outputRange: [0, 1] })

        // const toggle_return = AnimatedInter(this.state.animated, [0,1], [0,undefined])

        return (
            <View style={s.container} >
                <Toolbar
                    arrow_back
                    onPress     ={() => navigation.goBack()}>
                    <Text style ={s.toolbar_title}>PLN</Text>
                </Toolbar>

                <DialogComponent
                    active={this.state.filterActive}
                    open={() => this.setState({ filterActive: true })}
                    close={() => this.setState({ filterActive: false })}
                    title={this.state.title}
                    // action  = {() => this.Confirmation()} 
                    position='center'
                >
                    {this.state.radioItems.map((item, key) => (
                        
                            <TrainRadio 
                                onPress     ={value => this.setState({ nominal: value, filterActive : false }, () => AnimatedValue(this.state.animated, 0))} 
                                currentValue={this.state.nominal} 
                                value       = {item.nominal}
                                text        ={item.label} />
                    ))}

                </DialogComponent>

                <ScrollView  bounces={false} style={{ flex: 1 }}>
                    <View style={{ margin: Scale(16) }}>
                        <View style={{ flexDirection: 'row', marginVertical: Scale(8) }}>
                            <TrainRadio 
                                onPress     ={value => this.setState({ type_trip: value }, () => AnimatedValue(this.state.animated, 0))} 
                                currentValue={type_trip} 
                                value       ='token_listrik' 
                                text        ={STRING.Label.token} />
                            <TrainRadio 
                                // onPress     ={value => this.setState({ type_trip: value }, () => AnimatedValue(this.state.animated, 1))} 
                                onPress     ={value => console.log('')} 
                                currentValue={type_trip} 
                                value       ='tagihan_listrik' 
                                text        ={STRING.Label.tag} />
                        </View>
                        <View>
                        <TrainInput
                                type        = {'input'}
                                label       = {'Email'}
                                error       = {this.state.email_error}
                                value       = {this.state.email}
                                placeholder = {'Masukan Email Anda'}
                                onChangeText= {value => this.setState({email: value})}
                                 />

                            <TrainInput
                                type        = {'number'}
                                label       = {'No. Meter/ID Pel'}
                                value       = {this.state.number_id}
                                error       = {this.state.number_id_error}
                                placeholder = {'No. Meter atau ID Pelanggan'}
                                onChangeText= {value => this.setState({number_id: value})}
                                 />

                            <View>
                                <TrainForm
                                    type        = {'option'}
                                    label       = {'Nominal'}
                                    value       = {'Rp ' +Function.convertToPrice(this.state.nominal)}
                                    placeholder = {'Rp ' +Function.convertToPrice(this.state.nominal)}
                                    onPress     = {() => this.setState({filterActive : true, title : 'NOMINAL', slug : 'nominal'})} />
                              
                            </View>
                        </View>
                    </View>
                    <TrainButton
                        onPress={() => this.reserveValidate()} style={s.btn_reserve}>Beli</TrainButton>

                    {/* <View style={{ padding: Scale(16) }}>
                        <Text style={{ color: Colors.black }}>{STRING.Label.recent_Search}</Text>
                        <CardRecentSearch
                            onPress={() => console.log('')}
                            destination={'Bandung (BD) - Gambir (GMR)'}
                            date={'13 November 2018'}
                            guest={'1 Dewasa, 1 Bayi'}
                        />
                    </View> */}
                </ScrollView>
                <Loading
                    text={'Harap tunggu sedang menyiapkan halaman'}
                    visible={this.state.loading}
                />
            </View>
        )
    }
}

const s = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    toolbar_title: {
        fontSize: Scale(18),
        color: 'white',
    },

    icon_switch: {
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        top: -6,
        right: 0
    },
});

AppRegistry.registerComponent("padiciti", () => PlnReservation);
