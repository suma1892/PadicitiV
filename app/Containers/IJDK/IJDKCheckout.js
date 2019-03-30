import React, { Component } from 'react'
import {
    AppRegistry,
    View,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform, AsyncStorage, Alert as Confirmation
} from 'react-native'
import {
    TextView as Text, 
    Toolbar,
    Scale,
    Colors,
    Fonts,
    Button,
    Touchable,
    // Alert,
    Loading,
    CardSortTrain1,
} from '../../Components/'

import { CardSortTrain } from '../../Components/TrainCardComponent';
import moment from 'moment';
import { STRING_TR, STRING, Function } from '../../Utils';
import {TrainDropdown, TrainInput, TrainForm, TrainInput2 } from '../../Components/TrainFormComponent';
import { _OS } from '../../Assets';
import { getURLTrain, getURL, getURLIJDK } from '../../Services/API';
import { JSONPostFile, JSONGetFile, JSONGetFile1 } from '../../Services/JsonService';
import { Parameter } from '../../Services/Parameter'

export default class IJDKCheckout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            client_name         : null,
            SourceEmail         :[],
            SourceCheckEmail    :[],
            SourceCheckEmail2   :[],
            client_email        : null,
            client_phone        : null,
            client_name_error   : null,
            client_email_error  : null,
            client_phone_error  : null,
            pax_adult           : this.countPax('adult', this.props.navigation.state.params.pax_list.pax_adult),
            pax_infant          : this.countPax('infant', this.props.navigation.state.params.pax_list.pax_infant),
            error_pax_adult     : [],
            error_pax_infant    : [],
            agreement           : false,
            result_book         : [],
            loading             : false,
            ScheduleId          : null
        }
    }

    GETEmail(url,stat){
        // 'https://reservation2.padiciti.com/padiciti-user/service/user/getCheckMail?email='+this.state.client_email+'&resCode=padiciti'
        // let url  = url
        return fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
      })
      .then((response) => response.text())
      .then((responseJson) => {
        // return responseJson

        if (stat=="T"){
        this.setState({
          SourceCheckEmail: responseJson,
        });
        }else{
        this.setState({
            SourceEmail: responseJson,
        });
        }
      })
      .catch((error) =>{
        console.error(error);
      });
        
    }

    componentDidMount() {
        let { navigation } = this.props
        let { state } = navigation
        let { pax_list, train_depart} = state.params
        let { type_trip, origination, destination, depart_date, return_date, Adult,pax_infant } = pax_list
        AsyncStorage.getItem('UserData', (err, UserData) => {
            if (UserData) {
               this.setState({client_name : Function.JsonParse(UserData).client_name, client_email : Function.JsonParse(UserData).client_email, client_phone: Function.JsonParse(UserData).client_phone })
            }
            else {
                // this.props.navigation.navigate('Login', { slug: 'profile' })
                AsyncStorage.getItem('CustomerData', (err, CustomerData) => {
                    if (CustomerData !== null) {
                        this.setState({ client_name: Function.JsonParse(CustomerData).client_name, client_email: Function.JsonParse(CustomerData).client_email, client_phone: Function.JsonParse(CustomerData).client_phone })
                    }
                })
            }
        })
    }


    countPax  = (slug, value) => {
        let pax_count = []
        for (let i = 0; i < value; i++) {
            let pax_adult = {
                name    : null,
                num_id  : null,
            }

            let pax_infant = {
                name        : null,
                birthdate   : moment(new Date()).subtract(0, 'year').format('YYYY-MM-DD')
            }
            
            pax_count.push(slug === 'adult' ? pax_adult : pax_infant) 
        }
        return pax_count
    }


    setPax = (source_state, index, obj_, value) => {
        let item = this.state[source_state]
        if (item[index] === undefined) item.push([])
        item[index][obj_] = value
        this.setState({[source_state]: item})
    }

    reserveValidate = () => {
        let { client_name, client_email, client_phone, pax_adult, pax_infant } = this.state
        // Alert.alert("Coba 1")
        this.setState({
            client_name_error   : null,
            client_email_error  : null,
            client_phone_error  : null,
            error_pax_adult     : [],
            error_pax_infant    : []
        })

        let regex_alphabet  = /^[a-z ,.'-]+$/i,
            regex_email     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            regex_number = /^[0-9 ]+$/


        if (!client_name){
            // Alert.alert("if 1") 
            this.setState({ 
            client_name_error: 'Nama harus diisi' 
            })}
        if (!(regex_alphabet.test(client_name))) this.setState({ client_name_error: 'Nama Pemesan harus alfabet.' })
        if (!client_email) this.setState({ client_email_error: 'Email harus diisi' })
        if (!(regex_email.test(client_email))) this.setState({ client_email_error: 'Format Email salah' })
        if (!client_phone) this.setState({ client_phone_error: 'No. Handphone harus diisi' })
        if (!(regex_number.test(client_phone))) this.setState({ client_phone_error: 'No. Handphone harus diisi angka' })
        pax_adult.map((item, index) => {
            if (!(regex_alphabet.test(item.name))) this.setPax('error_pax_adult', index, 'name', 'Nama harus di isi alfabet.')
            if (!item.name) this.setPax('error_pax_adult', index, 'name', 'Nama lengkap wajib diisi')
            if (item.name && item.name.length > 25) this.setPax('error_pax_adult', index, 'name', 'Maksimal 25 karakter.')
            if (!item.num_id) this.setPax('error_pax_adult', index, 'num_id', 'Silakan isi nomor identitas.')
            if (!(regex_number.test(item.num_id))) this.setPax('error_pax_adult', index, 'num_id', 'Nomor identitast harus di isi angka.')
        })

        pax_infant.map((item, index) => {
            if (!(regex_alphabet.test(item.name))) this.setPax('error_pax_infant', index, 'name', 'ama harus di isi alfabet.')
            if (!item.name) this.setPax('error_pax_infant', index, 'name', 'Nama lengkap wajib diisi.')
            if (item.name && item.name.length > 25) this.setPax('error_pax_infant', index, 'name', 'Maksimal 25 karakter.')
            if (!item.birthdate) this.setPax('error_pax_infant', index, 'num_id', 'Tanggal lahir wajib diisi.')
        })

        if ( !(this.state.client_name_error) &&
            !(this.state.client_email_error) &&
            !(this.state.client_phone_error) &&
            this.state.error_pax_adult.length === 0 &&
            this.state.error_pax_infant.length === 0) {

                AsyncStorage.getItem('UserData', (err, UserData) => {
                    if (UserData) {
                        // Alert.alert("UserData")
                        this.reserveAction()
                    } else {
                        // Alert.alert("NONMEMBER")
                        let url  = 'https://reservation2.padiciti.com/padiciti-user/service/user/getCheckMail?email='+this.state.client_email+'&resCode=padiciti'
                        return fetch(url, {
                            method: 'POST',
                            headers: {
                              'Content-Type': 'application/json',
                            },
                      })
                      .then((response) => response.text())
                      .then((responseJson) => {
                        // return responseJson
                        this.setState({
                        //   isLoading: false,
                          SourceCheckEmail: responseJson,
                        }, function(){
                            // console.log("NESTED AKU : "+(this.state.SourceCheckEmail))
                            var x = JSON.parse(this.state.SourceCheckEmail)
                                    let url  = 'https://reservation2.padiciti.com/padiciti-user/service/user/nonMember?email='+x.email+'&fullName='+this.state.client_name+'&phoneNumber='+this.state.client_phone+'&deviceRegistered=android&resCode=padiciti'
                                    return fetch(url, {
                                        method: 'POST',
                                        headers: {
                                        'Content-Type': 'application/json',
                                        },
                                })
                                .then((response) => response.text())
                                .then((responseJson) => {
                                    // return responseJson
                                    this.setState({
                                    //   isLoading: false,
                                    SourceEmail: responseJson,
                                    }, function(){
                                        // console.log("NESTED KAMU : "+JSON.stringify(this.state.SourceEmail))
                                        var y = JSON.parse(this.state.SourceEmail)
                                    let url  = 'https://reservation2.padiciti.com/padiciti-user/service/user/getCheckMail?email='+y.email+'&resCode=padiciti'
                                    return fetch(url, {
                                        method: 'POST',
                                        headers: {
                                        'Content-Type': 'application/json',
                                        },
                                })
                                .then((response) => response.text())
                                .then((responseJson) => {
                                    // return responseJson
                                    this.setState({
                                    //   isLoading: false,
                                    SourceCheckEmail2 : responseJson,
                                    }, function(){
                                        // console.log("NESTED KAU : "+(this.state.SourceCheckEmail2))
                                        var myJSON = JSON.parse(this.state.SourceCheckEmail2);
                                        // console.log("Sesuatu sekali yaa : "+(myJSON.email))
                                        var x = myJSON.email
                                        let { navigation } = this.props
                                        let { state } = navigation
                                        let { pax_list, train_depart, train_return } = state.params
                                        let TampEmail = this.state.client_email
                                        this.setState({loading: true})
                                        console.log("Email chekout "+this.state.client_email)
                                        JSONGetFile1(getURLIJDK('booking', null), train_depart, pax_list, this.state.client_email).then((response1) => {
                                            // console.log('response : '+ JSON.stringify(response))
                                            this.props.navigation.navigate('IJDKReview', {pax_list,response1, x, statue:"nonmember"}) 
                                                    }).catch((error) => {
                                            this.setState({loading: false}, () => {
                                                console.log('error', error)
                                            })
                                        })

                                    });
                                
                                })
                                .catch((error) =>{
                                    console.error(error);
                                });


                                    });
                                
                                })
                                .catch((error) =>{
                                    console.error(error);
                                });

                        });
                    
                      })
                      .catch((error) =>{
                        console.error(error);
                      }); 
                                             
                    }

                })
                
        } else {
            Alert.alert('Silakan lengkapi data terlebih dahulu.')
        }
    }




    createURL = (trip_data, pax_data, booking_type) => {
        let train_no            = trip_data.train_no,
            subclass            = trip_data.subclass,
            org                 = trip_data.org_code,
            des                 = trip_data.des_code,
            dep_date            = trip_data.dep_date,    
            pax_adult           = pax_data.pax_adult,
            pax_infant          = pax_data.pax_infant,
        
            url_adult_data      = '',
            url_infant_data     = '',
            url_client_email = '&caller=' + this.state.client_email,
            // url_client_email    = '&caller=emailhrs1212@gmail.com',
            url_device          = '&device_type=' + Platform.OS + Platform.Version,
            url_type            = '&booking_type='+booking_type
            
        
        let url = getURLIJDK('booking', 'null');

        this.state.pax_adult.map((item, index) => {
            url_adult_data = url_adult_data + "&adult_name_" + (index + 1) + "=" + (Platform.OS === 'IOS' ?item.name:item.name.replace(" ", "%20")) + "&adult_birthdate_" + (index + 1) + "=19780310&adult_mobile_" + (index + 1) + "=" + dep_date + index + "&adult_id_no_" + (index + 1) + "=" + item.num_id.replace(" ", "%20");
        })

        this.state.pax_infant.map((item, index) => {
            url_infant_data = url_infant_data + "&infant_name_" + (index + 1) + "=" + (Platform.OS === 'IOS' ?item.name:item.name.replace(" ", "%20"))+ "&infant_birthdate_" + (index + 1) + "=" + moment(item.birthdate, 'YYYY-MM-DD').format('YYYYMMDD');
        })

        url = url + url_adult_data + url_infant_data + url_client_email + url_device + url_type;
        return url.replace(" ", "%20");
    }

    auth_nonmember = () => {
        const { params } = this.props.navigation.state;
        try {
            this.setState({ loading: true })
            let url = getURL('url_post_nonMember_Hotel')
            let param = Parameter.Nonmember(this.state)
            
            JSONPostFile(url, param).then((Respone) => {
                console.log(Respone)
                switch (Respone.respCode) {

                    case '0':
                        this.setState({ loading: true }, ()=>{
                                Function.SaveDataJson('CustomerData', Function.JsonString({
                                    clientId: Respone.userId,
                                    client_name: Respone.fullName,
                                    client_email: Respone.email,
                                    client_phone: Respone.phoneNumber,
                                }))
                                this.reserveAction()
                           
                        })
                        break
                    default:
                        this.setState({ loading: false }, () => {
                        
                        })
                        // Alert(Respone.inRespMsg)
                        break
                }

            }).catch((err) => {
                this.setState({ loading: false }, () => {
                    // this.backAndroid()
                })

                console.log('err >>> ' + err)
            })
        } catch (error) {
            this.setState({ loading: false }, () => {
                // this.backAndroid()
            })
            console.log('Error >>> ', error)
        }

    }

    Confirmation() {
        Confirmation.alert(
            'Pesanan Anda sudah benar ?',
            'Anda tidak akan bisa mengubah detail pesanan setelah melanjutkan kehalaman pembayaran. Tetap lanjutkan ?',
            [
              {text: 'Periksa Kembali', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Ya, Lanjutkan', onPress: () => this.reserveValidate()},
            ],
            { cancelable: false }
          )
    }

    reserveAction = () => {
        let { navigation } = this.props
        let { state } = navigation
        let { pax_list, train_depart, train_return } = state.params
        let TampEmail = this.state.client_email
        this.setState({loading: true})
        console.log("Email chekout "+this.state.client_email)
        JSONGetFile1(getURLIJDK('booking', null), train_depart, pax_list, this.state.client_email).then((response) => {
            // console.log('response : '+ JSON.stringify(response))
            this.props.navigation.navigate('IJDKReview', {pax_list,response, TampEmail, statue:"member"}) 
                    }).catch((error) => {
            this.setState({loading: false}, () => {
                console.log('error', error)
            })
        })
    }

    ActivityResult = (data) => {
        console.log(this.data)
        switch (data.slug) {
            case 'passanger':
            if (data.type === 'ADULT') {
                this.state.pax_adult[data.key].name = data.data.full_name
                this.state.pax_adult[data.key].num_id = data.data.no_identity

                this.setState({pax_adult : this.state.pax_adult})
            } else if (data.type === 'INFANT') {
                this.state.pax_infant[data.key].name = data.data.full_name
                this.state.pax_infant[data.key].birthdate = moment(data.data.brithdate).subtract(0, 'year').format('YYYY-MM-DD')

                this.setState({pax_infant : this.state.pax_infant})
            }
                break
            default:

                break
        }
    }


    gotoPassanger(key, Pasanger) {
        let regex_alphabet  = /^[a-z ,.'-]+$/i,
        regex_email     = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        let { client_name, client_email, client_phone, pax_adult, pax_infant, agreement } = this.state
        var Status = true
        this.setState({
            client_name_error   : null,
            client_email_error  : null,
            client_phone_error  : null,
            error_pax_adult     : [],
            error_pax_infant    : []
        })

        if (!client_name){
            Status = false
            this.setState({ client_name_error: STRING.Warrning.field_name_error})}
        if (!(regex_alphabet.test(client_name))){
            Status = false
         this.setState({ client_name_error: STRING.Warrning.field_alfa_name_error })}
        if (!client_email) {
            Status = false
            this.setState({ client_email_error: STRING.Warrning.field_email_error })}
        if (!(regex_email.test(client_email))){
            Status = false
             this.setState({ client_email_error: STRING.Warrning.field_wrong_email })}
        if (!client_phone) {
            Status = false
            this.setState({ client_phone_error: STRING.Warrning.field_number_error })}

        
        if (Status) {
            this.props.navigation.navigate('DataPassanger', {
                parameter: { type_passanger: Pasanger }, nonMember: { email: this.state.client_email, fullName: this.state.client_name, phoneNumber: this.state.client_phone, deviceRegistered: Platform.OS == 'ios' ? 'IOS' : 'Android', },
                ActivityResult: this.ActivityResult, slug : 'train',
                Key: key
            })
        }
    }
    

    render() {
        let { navigation } = this.props
        let { state } = navigation
        let { pax_list, train_depart } = state.params
        let { type_trip, origination, destination, depart_date, return_date, pax_adult,pax_infant } = pax_list
        // let {ScheduleId} = TampItem
        const ComponentView = _OS(KeyboardAvoidingView, View)

        // console.log(params)
        return (
            <ComponentView style={s.container} behavior='padding'>
                <Toolbar  
                    arrow_back
                    onPress ={ () => navigation.goBack()}>
                    <View>
                        <Text style={s.toolbar_title}>Pemesan</Text>
                    </View>
                </Toolbar>
                <ScrollView keyboardShouldPersistTaps='always'>

                    <View style={s.border_big_bottom}>
                        {<CardSortTrain1
                            nodetail
                            // onPress     = {() => navigation.navigate('IJDKDetail', {title: STRING.Label.org_train, data: train_depart})}
                            title       = {train_depart.lst[0].EventName}
                            route       = {moment(train_depart.lst[0].EventDate).format("DD MMMM YYYY")}
                            date        = {train_depart.TicketType}
                            train_name  = {""}
                            />}
                    </View>

                    {/* <View style={{padding: Scale(16)}}>
                        <Text style={s.title_section}>{STRING_TR.CHECKOUT.ALERT.TITLE}</Text>
                        {STRING_TR.CHECKOUT.ALERT.LIST.map((item, index) => (
                                <View key={index} style={s.item_list}>
                                    <View style={s.item_list_icon}/>
                                    <Text style={s.item_list_txt}>{item}</Text>
                                </View>
                            ))}
                    </View> */}

                    <View style={{paddingHorizontal: Scale(16), paddingVertical: Scale(8), paddingTop: Scale(4), borderBottomWidth: Scale(2), borderBottomColor: Colors.border}}>  
                        <TrainInput 
                            autoCapitalize  = {'words'}
                            label       = {STRING.Label.client_name}
                            placeholder = {STRING.Label.client_name_holder}
                            value       = {this.state.client_name}
                            error       = {this.state.client_name_error}
                            onChangeText= {value => this.setState({client_name: value})}/>
                        
                        <TrainInput 
                            label       = {STRING.Label.client_email}
                            placeholder = {STRING.Label.client_email_holder}
                            value       = {this.state.client_email}
                            error       = {this.state.client_email_error}
                            onChangeText= {value => this.setState({client_email: value})}/>

                        <TrainInput
                            type        = {'number'}
                            label       = {STRING.Label.phone}
                            placeholder = {STRING.Label.client_phonde_holder}
                            value       = {this.state.client_phone}
                            error       = {this.state.client_phone_error}
                            onChangeText= {value => this.setState({client_phone: value})}/>
                    </View>


                    <View>
                        { this.state.pax_adult.map((item, index) => (
                            <View key={index} style={{ paddingHorizontal: Scale(16), paddingVertical: Scale(8), paddingTop: Scale(4), borderBottomWidth: Scale(2), borderBottomColor: Colors.border }}>
                                <Text style={s.title_section}>Penumpang Dewasa #{index + 1}</Text>

                                <TrainDropdown
                                    onPress={() => this.gotoPassanger(index, 'ADULT')}
                                    placeholder={STRING.Label.costumer_data}
                                />

                                <TrainInput 
                                    autoCapitalize  = {'words'}
                                    label       = {STRING.Label.full_name}
                                    placeholder = {STRING.Label.client_name_holder}
                                    value       = {this.state.pax_adult[index].name}
                                    error       = {this.state.error_pax_adult[index] && this.state.error_pax_adult[index].name}
                                    onChangeText= {value => this.setPax('pax_adult', index, 'name', value)}
                                    />
                                <TrainInput
                                    type        = {'number'}
                                    label       = {STRING.Label.card_number}
                                    value       = {this.state.pax_adult[index].num_id}
                                    error       = {this.state.error_pax_adult[index] && this.state.error_pax_adult[index].num_id}
                                    onChangeText= {value => this.setPax('pax_adult', index, 'num_id', value)}
                                    />
                            </View>
                            )) }

                        { this.state.pax_infant.map((item, index) => (
                            <View key={index} style={{paddingHorizontal: Scale(16), paddingVertical: Scale(8), paddingTop: Scale(4), borderBottomWidth: Scale(2), borderBottomColor: Colors.border}}>  
                                <Text style={s.title_section}>Penumpang Bayi #{index + 1}</Text>
                                
                                <TrainDropdown
                                    onPress={() => this.gotoPassanger(index, 'INFANT')}
                                    placeholder={STRING.Label.costumer_data}
                                />
                                <TrainInput 
                                    label       = {STRING.Label.full_name}
                                    value       = {this.state.pax_infant[index].name}
                                    placeholder = {STRING.Label.client_name_holder}
                                    error       = {this.state.error_pax_infant[index] && this.state.error_pax_infant[index].name}
                                    onChangeText= {value => this.setPax('pax_infant', index, 'name', value)}/>
                            
                                <TrainForm
                                    type        = 'date'
                                    icon_left   = 'ic_calendar'
                                    label       = {STRING.Label.brith_date}
                                    value       = {this.state.pax_infant[index].birthdate}
                                    placeholder = {'Contoh: DD/MM/YYYY'}
                                    onPress     = { date => this.setPax('pax_infant', index, 'birthdate', moment(date).subtract(0, 'year').format('YYYY-MM-DD'))}
                                    error       = {this.state.error_pax_infant[index] && this.state.error_pax_infant[index].birthdate}
                                    />
                            </View>
                            )) }
                    
                        {/* <View style={{padding: Scale(16)}}>
                            <Text style={s.title_section}>{STRING_TR.CHECKOUT.S_N_K.TITLE}</Text>
                        </View>
                        <View style={{padding: Scale(16), backgroundColor: Colors.yellow}}>
                            {STRING_TR.CHECKOUT.S_N_K.LIST.map((item, index) => (
                                    <View key={index} style={s.item_list}>
                                        <View style={s.item_list_icon}/>
                                        <Text style={[s.item_list_txt, {color: Colors.black}]}>{item}</Text>
                                    </View>
                                ))}
                        </View> */}
                            
                        {/* <Touchable onPress={() => this.setState({agreement: !this.state.agreement})}>
                            <View style={{padding: Scale(16), flexDirection: 'row'}}> 
                                <View style={[s.radio, this.state.agreement && s.radio_active]}>
                                    <View style={[s.radio_, this.state.agreement && s.radio_active_]} />
                                </View>
                                <Text style={s.text_agreement}>{STRING_TR.CHECKOUT.AGREEMENT}<Text style={{color: Colors.pizzaz}}>{STRING.Label.terms_and_conditions}</Text></Text>
                            </View>
                        </Touchable> */}
                    </View>

                    <Button onPress={() => this.Confirmation()}>
                        {STRING.Label.more}
                    </Button>

                </ScrollView>
            </ComponentView>
        )
    }
}

const s = StyleSheet.create({
    text_agreement:{
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

    item_list:{
        flexDirection: 'row',
        flex: 1,
        paddingRight: Scale(6),
    },
    item_list_icon:{
        backgroundColor: Colors.warm_grey,
        width: Scale(5),
        height: Scale(5),
        borderRadius: Scale(2.5),
        marginRight: Scale(6),
        marginTop: Scale(8),
    },
    item_list_txt:{
        ...Fonts.light,
        color: Colors.warm_grey,
        lineHeight: Scale(20)
    },
    title_section:{
        color: '#204a8b',
        fontSize: Scale(14),
        paddingVertical: Scale(4),
    },
    border_big_bottom:{
        borderBottomWidth: Scale(3),
        borderBottomColor: Colors.border
    },
    radio_frame: {
        flexDirection: 'row',
        borderRadius: Scale(3),
        marginTop: Scale(16)
    },
    radio: {
        width: Scale(18),
        height: Scale(18),
        backgroundColor: Colors.warm_grey,
        padding: 2,
        borderRadius: Scale(3),
        marginRight: Scale(8),
        marginTop: Scale(8)
    },
    radio_active: {
        backgroundColor: Colors.pizzaz,
    },
    radio_active_: {
        backgroundColor: Colors.transparent,
    },
    radio_: {
        borderRadius: Scale(2),
        flex: 1,
        borderColor: 'white',
        backgroundColor: Colors.white,
        borderWidth: 3,
    },
    radio_text: {
        fontSize: Fonts.size.medium
    },
});

AppRegistry.registerComponent("padiciti", () => IJDKCheckout);
