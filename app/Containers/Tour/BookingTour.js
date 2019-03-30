import React, { Component } from 'react'
import {
    AsyncStorage,
    TextInput,
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image,
    Platform, WebView,
    Dimensions, AppRegistry, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableOpacity, BackHandler, Linking, Alert as Confirmation
} from 'react-native'
import { Colors, Metrics, Toolbar, TextView, Modal, Touchable,LoadingFull, Alert } from '../../Components'

import { NavigationActions } from 'react-navigation';
import moment from 'moment'
import { Function, STRING, navigateTo } from '../../Utils'
import { getIcon } from '../../Assets';
import { Parameter } from '../../Services/Parameter';
import { getURL, getURlHistory } from '../../Services/API'
import { JSONGetFile, JSONPostFile } from '../../Services/JsonService'
const finish = NavigationActions.back({ key: "" });
const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
export default class TourReservation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id_tour: 0,
            clientId : null,
            contact_name: null,
            phonde_num: null,
            email: null,
            adult : 1,
            child : 0,
            travelerAdult: [],
            travelerChild: [],
            depart_date : null,
            return_date : null,
            totalPrice : 0,
            msAvailableDate : null,
            typeDate: null,
            loading : false
        }
    }
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())

        let { navigation } = this.props
        let { state } = navigation
        let { total_adult, total_child, price_adult, price_child, depart_date, return_date } = state.params
        this.setState({
            adult: total_adult,
            depart_date : depart_date,
            return_date : return_date,
            child: total_child, totalPrice: Function.convertToPrice(((total_adult * price_adult) + (total_child * price_child)))
        }, () => {
                var i = 0;
                var arrAdult = []
                var j = 0;
                var arrChild = []
                while (i < this.state.adult) {
                    arrAdult.push({ title: 'Mr', name: null, gander: null, email: null, phone_num: null })
                    i++
                }

                while (j < this.state.child) {
                    arrChild.push({ title: 'Mr', name: null, gander: null, email: null, phone_num: null })
                    j++
                }
                this.setState({ travelerChild: arrChild, travelerAdult: arrAdult }, () => {
                    const { params } = this.props.navigation.state;
                    this.setState({ id_tour: params.idTour, typeDate : params.typeDate, msAvailableDate : params.msAvailableDate }, () => {
                        AsyncStorage.getItem('UserData', (err, UserData) => {
                            if (UserData) {
                                this.setState({ contact_name: Function.JsonParse(UserData).client_name, email: Function.JsonParse(UserData).client_email, phonde_num: Function.JsonParse(UserData).client_phone, clientId: Function.JsonParse(UserData).clientId })
                            } else {

                                AsyncStorage.getItem('CustomerData', (err, CustomerData) => {
                                    if (CustomerData !== null) {
                                        this.setState({ clientId: Function.JsonParse(CustomerData).clientId, contact_name: Function.JsonParse(CustomerData).client_name, email: Function.JsonParse(CustomerData).client_email, phonde_num: Function.JsonParse(CustomerData).client_phone })
                                    }
                                })
                            }
                        })
                    })
                })
            })
    }

    Confirmation() {
        Confirmation.alert(
            'Pesanan Anda sudah benar ?',
            'Anda tidak akan bisa mengubah detail pesanan setelah melanjutkan kehalaman pembayaran. Tetap lanjutkan ?',
            [
              {text: 'Periksa Kembali', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Ya, Lanjutkan', onPress: () => this.GotoPayment()},
            ],
            { cancelable: false }
          )
    }


    CheckUser (){
        const { params } = this.props.navigation.state;
        this.setState({id_tour : params.idTour}, ()=>{
            AsyncStorage.getItem('UserData', (err, UserData) => {
                this.GetBooking()
                if (UserData) {
                    this.setState({ contact_name: Function.JsonParse(UserData).client_name, email: Function.JsonParse(UserData).client_email, phonde_num: Function.JsonParse(UserData).client_phone, clientId: Function.JsonParse(UserData).clientId }, () => {
                        this.GetBooking()
                    })
                } else {
    
                    AsyncStorage.getItem('CustomerData', (err, CustomerData) => {
                        if (CustomerData !== null) {
                            this.setState({clientId : Function.JsonParse(CustomerData).clientId , contact_name: Function.JsonParse(CustomerData).client_name, email: Function.JsonParse(CustomerData).client_email, phonde_num: Function.JsonParse(CustomerData).client_phone }, () => {
                                this.GetBooking()
                            })
                        } else {
                            this.AuthPost()
                        }
                    })
                }
            })
        })
    }

    ActivityResult = (data) => {
        switch (data.slug) {
            case 'adult':
                var arrayAdult = this.state.travelerAdult
                arrayAdult[data.position] = data.data
                this.setState({ travelerAdult: [] }, () => {
                    this.setState({ travelerAdult: arrayAdult })
                })
                break
            case 'child':
                var arrayChild = this.state.travelerChild
                arrayChild[data.position] = data.data
                this.setState({ travelerChild: [] }, () => {
                    this.setState({ travelerChild: arrayChild })
                })
                break
            case 'login':
               
                this.setState({id_tour: 0,
            clientId : null,
            contact_name: null,
            phonde_num: null,
            email: null,
            adult : 1,
            child : 0,
            travelerAdult: [],
            travelerChild: [],
            totalPrice : 0,})
                break
        }
    }

    backAndroid() {
        this.props.navigation.dispatch(finish)
        return true
    }

    GotoPayment() {
        var i =0;
        var j =0;
        var Status = true
        let { contact_name, email, phonde_num } = this.state
        this.setState({
            full_name_error : null,
            phone_num_error : null,
            email_error : null
        })
        let regex_alphabet = /^[a-z ,.'-]+$/i,
            regex_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        if (!contact_name) {
            Status = false
            this.setState({ full_name_error: 'Nama harus diisi' })}
        if (!(regex_alphabet.test(contact_name))) {
            Status = false
            this.setState({ full_name_error: 'Nama harus alfabet' })}
        if (!email) {
            Status = false
            this.setState({ email_error: 'Email harus diisi' })}
        if (!(regex_email.test(email))){
            Status = false
            this.setState({ email_error: 'Format Email salah' })}
        if (!phonde_num){
            Satus = false
            this.setState({ phone_num_error: 'No. Handphone harus diisi' })}

        while (i < this.state.adult){
           this.setState({['err_adult_'+i] : null})
           if(!this.state.travelerAdult[i].name) {
               this.setState({['err_adult_'+i] : 'Silakan lengkapi data Travelers Anda'})
               Status = false
            }
            i ++ 
        }

        while (j < this.state.child){
            this.setState({['err_child_'+j] : null})
            if(!this.state.travelerChild[j].name) {
                this.setState({['err_child_'+j] : 'Silakan lengkapi data Travelers Anda'})
                Status = false}
            j ++ 
        }

        if (Status) {

            this.CheckUser()
             
        }
    }

    AuthPost = (type, parameter) => {
        console.log('Asuuu non Member')
        const { params } = this.props.navigation.state;
        try {
            this.setState({ loading: true })
            let url = getURlHistory('url_non_member')
            JSONPostFile(url, {email: this.state.email, 
                fullName: this.state.contact_name, 
                phoneNumber: this.state.phonde_num, 
                deviceRegistered: Platform.OS == 'ios' ? 'IOS' : 'Android', }).then((Respone) => {
                switch (Respone.respCode) {

                    case '0':
                        this.setState({ loading: false }, () => {
                          
                            Function.SaveDataJson('CustomerData', Function.JsonString({
                                clientId: Respone.userId,
                                client_name: Respone.fullName,
                                client_email: Respone.email,
                                client_phone: Respone.phoneNumber,
                            }))

                            this.CheckUser ()
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

    GetBooking(){
        var passenger = ''
        let parameter = null
        var url='?id_tour='+this.state.id_tour+'&'+'id_user='+this.state.clientId+'&'+'credential_code=padiciti&'+'credential_pass=padiciti123&'+'jumlah_peserta_adult='+this.state.adult +'&'+'jumlah_peserta_child='+this.state.child+'&'+'start_date='+Function.FormeteDate(this.state.depart_date,"DD MMM YYYY", 'YYYYMMDD')+ '&' +'end_date='+Function.FormeteDate(this.state.return_date,"DD MMM YYYY", 'YYYYMMDD')+'&'+'typeDate='+this.state.typeDate+'&idAvailableDate='+this.state.msAvailableDate.idAvailableDate+'&'
        
        this.state.travelerAdult.map((item, i)=> {
        passenger +='titleAdult_'+(i+1)+'='+item.title+'&'+'nama_peserta_'+(i+1)+'='+item.name+'&'+'no_hp_'+(i+1)+'='+item.phone_num+'&'+'email_'+(i+1)+'='+item.email+((i+1) !== this.state.travelerAdult.length ? '&' :'')
        })

        this.state.travelerChild.map((item, i)=> {
            passenger +='&titleChild_'+(this.state.travelerChild.length+i+1)+'='+item.title+'&' + 'nama_peserta_'+(this.state.travelerChild.length+i+1)+'='+item.name+'&'+'no_hp_'+(this.state.travelerChild.length+i+1)+'='+item.phone_num+'&'+'email_'+(this.state.travelerChild.length+i+1)+'='+item.email+((i+1) !== this.state.travelerChild.length ? '&' :'')
            })
        url = url + passenger

        let openurl = getURL('url_booking_tour', url)
        this.setState({ loading: true })
        JSONGetFile(openurl)
        .then((respone) => {
            switch (respone.respCode) {
                case '0':
                console.log('Booking')
                console.log(respone)
                this.setState({ loading: false }, () =>{
                    this.props.navigation.navigate('EticketTour', {
                        dataBooking : respone, travelerAdult : this.state.travelerAdult, travelerChild : this.state.travelerChild,
                        ActivityResult: this.ActivityResult, depart_date : this.state.depart_date, return_date : this.state.return_date })
                })
               
                // this.reqPayment({transactionCode: respone.transactionCode}, 'req_payment')
                    break
                default:

                    this.setState({ loading: false }, () =>{
                        Alert(STRING.Warrning.no_connection)
                    })
                    break}
        }).catch((error) => {
            this.setState({ loading: false }, () => {
                Alert(STRING.Warrning.no_connection)
            })
        })
       
    }

    render() {
        const { params } = this.props.navigation.state;
        return (
            <View style={styles.frame} >
                <View style={{ width: Metrics.screenWidth, height: Scale(130), backgroundColor: '#3b65d6' }} >

                    <Toolbar
                        arrow_back
                        style={{ backgroundColor: 'transparent' }}
                        onPress={() => this.backAndroid()}
                        View={<TextView
                            style={styles.lableTitle}
                            text={"Booking Form"}
                        />}
                    />
                    <TouchableComponent onPress={() =>  navigateTo('TourReservation' ,this.props.dispatch,this.props.navigation,null )}>
                        <View style={{ flexDirection: 'row', height: Scale(45), borderRadius: Scale(4), backgroundColor: "#ffffff", marginTop: Scale(6), margin: Scale(16), padding: Scale(8) }}>
                            <View style={{ width: Metrics.screenWidth / 2 }}>
                                <TextView style={{ fontSize: Scale(12), color: "#000000" }}>{params.destinination.city_name}</TextView>
                                <TextView style={{ fontSize: Scale(10), color: "#666666" }}>{Function.FormeteDate(params.date, 'DD MMM YYYY', 'DD MMM YYYY')}</TextView>
                               
                            </View>
                            <View style={{ flex: Metrics.screenWidth / 2.5, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Image
                                    style={{ tintColor:Colors.gray,height: Scale(20), width: Scale(20) }}
                                    resizeMode='contain'
                                    source={getIcon('ic_arrow_right')}
                                />
                            </View>
                        </View>
                    </TouchableComponent>
                </View>
                <ScrollView style={{ flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <View style={{ backgroundColor: Colors.whitesmoke }}>
                            {!this.state.clientId && <GoToLogin
                                onPress={() => this.props.navigation.navigate('Login')} />}
                            {!this.state.clientId && <View style={{ backgroundColor: Colors.gray, height: Scale(1), marginBottom: Scale(8), marginTop: Scale(8), width: Metrics.screenWidth }} />}
                            <View style={{ padding: Scale(8), backgroundColor: Colors.whitesmoke }}>
                                <View style={{ flexDirection: 'row', }}>
                                    <View style={{ width: Metrics.screenWidth / 2 }}>
                                        <TextView style={{ fontSize: Scale(14), color: "#aaaaaa" }}>Contact Info</TextView>
                                    </View>
                                    {/* <View style={{ flex: Metrics.screenWidth / 2.5, justifyContent: 'center', alignItems: 'flex-end' }}>
                                        <TextView style={{ fontSize: Scale(14), color: "#00c783" }}>Booking ID 332343235</TextView>
                                    </View> */}
                                </View>
                            </View>
                        </View>

                        <CententsContactInfo
                            onChangeTextFullName={(e) => { this.setState({ contact_name: e }) }}
                            valueFullName={this.state.contact_name}
                            placeholderFullName={'Full Name'}
                            onPressClearName ={() => { this.setState({ contact_name: null })}}
                            onChangeTextNumber={(e) => { this.setState({ phonde_num: e }) }}
                            placeholderNumber={'Number'}
                            valueNumber={this.state.phonde_num}
                            onChangeTextEmail={(e) => { this.setState({ email: e }) }}
                            valueEmail={this.state.email}
                            placeholderEmail={'Email'}
                            full_name_error ={this.state.full_name_error}
                            phone_num_error ={this.state.phone_num_error}
                            email_error ={this.state.email_error}
                        />
                        <View style={{ marginTop: Scale(16) }}>
                            <TextView style={{ fontSize: Scale(14), color: "#666666", marginLeft: Scale(16) }}>Traveler Info</TextView>
                        { this.state.travelerAdult.length !== 0 && 
                        this.state.travelerAdult.map((item, i) =><TravelInfo
                            TravelName={(i+1) + '. '+ (item.name ? item.name + ' Adult' : 'Travelers Adult')}
                            onPress={() => this.props.navigation.navigate('DetilTraveler', {slug:'adult', position : i, ActivityResult : this.ActivityResult, data : item})}
                            error ={this.state['err_adult_'+i]} />
                        )}

                        { this.state.travelerChild.length !== 0 && 
                        this.state.travelerChild.map((item, i) =>
                        <TravelInfo
                            TravelName={(this.state.travelerAdult.length+i+1) + '. '+ (item.name ? item.name + ' Child' : 'Traveler Child')}
                            onPress={() => this.props.navigation.navigate('DetilTraveler', { slug:'child', position : i, ActivityResult : this.ActivityResult, data : item})} 
                            error ={this.state['err_child_'+i]}/>
                           
                        )}
                        </View>
                        <View style={{ backgroundColor: Colors.white, padding: Scale(8), marginTop: Scale(16) }}>
                            <View style={{ flexDirection: 'row', padding: Scale(8), marginTop: Scale(16), marginBottom: Scale(8) }}>
                                <View style={{ flex: Metrics.screenWidth / 2 }}>
                                    <TextView style={{ fontSize: Scale(14), color: "#000000" }}>{'Total Price'}</TextView>
                                </View>

                                <View style={{ flex: Metrics.screenWidth / 2, alignItems: 'flex-end' }}>
                                    <TextView style={{ fontSize: Scale(14), color: "#4778fb", marginLeft: Scale(8) }}>{'IDR ' + this.state.totalPrice}</TextView>
                                </View>
                            </View>
                            <View style ={{marginLeft : Scale(8), marginRight : Scale(8),borderStyle: "solid", borderWidth: 1, borderColor: "#dddddd"}}/>

                        </View>
                        <TouchableComponent onPress={() => this.Confirmation()}>
                        <View style={{ height: Scale(50), borderRadius: 29.5, backgroundColor: "#00c783", margin: Scale(8), justifyContent: 'center', alignItems: 'center' }}>
                            <TextView style={{ fontSize: Scale(14), color: "#ffffff", marginLeft: Scale(16) }}>BOOKING</TextView>
                        </View>
                        </TouchableComponent>

                         <TextView style={{ fontSize: Scale(12), color: "#999999", margin: Scale(16), textAlign : 'center' }}>{'By tapping the button, you have agreed to padiciti Terms & Conditions and Privacy Policy'}</TextView>
                    </View>
                </ScrollView>

                <LoadingFull
                    visible={this.state.loading}
                    title={STRING.Label.please_wait}
                    sub_title={STRING.Label.page} />
            </View>


        );
    }
}
const GoToLogin = props => (
    <View style={{ padding: Scale(8), backgroundColor: Colors.whitesmoke }}>
        <TextView style={{ fontSize: Scale(14), color: "#000000" }}>Already a Padiciti.com member?</TextView>
        <View style={{ flexDirection: 'row', }}>
            <View style={{ width: Metrics.screenWidth / 2 }}>
                <TextView style={{ fontSize: Scale(12), color: "#aaaaaa" }}>Sign in to make booking easier!</TextView>
            </View>
            <TouchableComponent onPress={props.onPress}>
                <View style={{ flex: Metrics.screenWidth / 2.5, justifyContent: 'center', alignItems: 'flex-end' }}>
                    <TextView style={{ fontSize: Scale(12), color: "#00c783" }}>LOGIN</TextView>
                </View>
            </TouchableComponent>
        </View>
    </View>)

const CententsContactInfo = props =>(
    <View style={{ padding: Scale(8), backgroundColor: Colors.white }}>
                            <View style={{
                                borderRadius: Scale(6),
                                borderStyle: "solid",
                                borderWidth: Scale(2),
                                height: Scale(45),
                                borderColor: "#00c783",
                                flexDirection: 'row',
                                padding: Scale(8),
                                marginTop: Scale(8)
                            }} >
                                <View style={{ flexDirection: 'row', justifyContent: 'center', padding: Scale(8) }}>
                                    <View style={{ width: (Metrics.screenWidth / 2) + Scale(100), justifyContent: 'center' }}>
                                        <TextInput style={{ height: Scale(60), color: "#000000" }}
                                            onChangeText={props.onChangeTextFullName}
                                            value={props.valueFullName}
                                            placeholder={props.placeholderFullName}
                                            underlineColorAndroid='rgba(0,0,0,0)' />
                                    </View>
                                <Touchable onPress ={props.onPressClearName}>
                                    <View style={{ width: (Metrics.screenWidth / 2) - Scale(140), justifyContent: 'center', alignItems: 'flex-end' }}>
                                        <Image
                                            style={{ height: Scale(15), width: Scale(15), marginLeft: Scale(8) }}
                                            resizeMode='contain'
                                            tintColor={Colors.gray}
                                            source={getIcon('ic_close_')}
                                        />
                                    </View>
                                    </Touchable>
                                </View>

                            </View>
                            <View style={{ marginLeft: Scale(20), backgroundColor: Colors.white, position: 'absolute', marginTop: Scale(6) }}>
                                <TextView style={{ fontSize: Scale(12), color: "#00c783" }}>Contact Name</TextView>
                            </View>
                            {props.full_name_error && <TextView style={{ fontSize: Scale(12), color: Colors.red }}>{props.full_name_error}</TextView>}
                            <TextView style={{ fontSize: Scale(12), color: "#aaaaaa", margin: Scale(8) }}>As on ID Card/passport/driving license (without degree or special characters)</TextView>

                            <View style={{
                                height: Scale(45), borderRadius: Scale(6),
                                borderStyle: "solid", borderWidth: Scale(1), borderColor: "#dddddd", padding: Scale(8)
                            }}>

                                <View style={{ flex: Metrics.screenWidth / 6, flexDirection: 'row', alignItems: 'center' }}>
                                    <TextView style={{ fontSize: Scale(14), color: "#000000" }}>+62</TextView>
                                    <Image
                                        style={{tintColor:Colors.gray,height: Scale(15), width: Scale(15), marginLeft: Scale(8) }}
                                        resizeMode='contain'
                                        source={getIcon('ic_arrow_down')}
                                    />

                                    <View style={{ height: Scale(25), width: Scale(2), marginLeft: Scale(8), marginRight: Scale(8), backgroundColor: "#dddddd" }} />
                                    <TextInput style={{ height: Scale(60), width: (Metrics.screenWidth / 1.4), color: "#000000", marginRight: Scale(30) }}
                                        onChangeText={props.onChangeTextNumber}
                                        keyboardType={'numeric'}
                                        placeholder={props.placeholderNumber}
                                        value={props.valueNumber}
                                        underlineColorAndroid='rgba(0,0,0,0)' />
                                </View>
                            </View>
                            {props.phone_num_error && <TextView style={{ fontSize: Scale(12), color: Colors.red }}>{props.phone_num_error}</TextView>}
                            <TextView style={{ fontSize: Scale(12), color: "#aaaaaa", margin: Scale(8) }}>Padiciti.com will contact you if there is a problem with your booking.</TextView>

                            <View style={{
                                flex:1,
                                borderRadius: Scale(6),
                                borderStyle: "solid",
                                borderWidth: Scale(2),
                                paddingLeft : Scale(8),
                                borderColor: "#dddddd",
                            }} >
                                <TextInput style={{ height: Scale(40), color: "#000000" }}
                                    onChangeText={props.onChangeTextEmail}
                                    value={props.valueEmail}
                                    placeholder={props.placeholderEmail}
                                    keyboardType={'email-address'}
                                    underlineColorAndroid='rgba(0,0,0,0)' />
                            </View>
                            {props.email_error && <TextView style={{ fontSize: Scale(12), color: Colors.red }}>{props.email_error}</TextView>}
                            <TextView style={{ fontSize: Scale(12), color: "#aaaaaa", margin: Scale(8) }}>Padiciti.com will send your booking confirmation and check-in info to this email address.</TextView>
                        </View>
)

const TravelInfo = props => (
    <TouchableComponent onPress={props.onPress}>
    <View style={{backgroundColor : Colors.white, marginTop: Scale(8) }}>
        <View style={{ flexDirection: 'row', backgroundColor: Colors.white, padding: Scale(8),}}>
            <View style={{ width: Metrics.screenWidth /1.6}}>
                <TextView style={{fontSize: Scale(14), color: "#000000", marginLeft: Scale(8) }}
                ellipsizeMode='tail'
                numberOfLines={1}>{props.TravelName}</TextView>
            </View>

            <View style={{ flex: Metrics.screenWidth /2, alignItems: 'flex-end' }}>
                <TextView style={{ fontSize: Scale(14), color: "#00c783", marginLeft: Scale(8) }}>FILL IN DETAILS</TextView>
            </View>
        </View>
        <TextView style={{ fontSize: Scale(14), color: Colors.red, marginLeft : Scale(16) }}>{props.error}</TextView>
        </View>
    </TouchableComponent>
)

const styles = StyleSheet.create({
    frame: {
        flex: 1,
        backgroundColor: Colors.whitesmoke
    },
    lableTitle: {
        fontSize: Scale(18), color: Colors.white
    },
    titlePassanger: {
        fontSize: Scale(16),
        bottom: Scale(8),
        color: Colors.blue
    }
});
AppRegistry.registerComponent("padiciti", () => TourReservation);
