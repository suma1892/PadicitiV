import React, { Component } from 'react'
import {
    AppRegistry,
    View,
    StyleSheet,
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
    Alert,
    Loading,
    Metrics,CardSortTrain,
    TrainInput, TrainOption, TrainForm, RadioButtons, DialogComponent
} from '../../Components/'

import moment from 'moment';
import { STRING_TR, STRING, Function } from '../../Utils';
import { _OS } from '../../Assets';
import { getURLBus, getURL } from '../../Services/API';
import { JSONPostFile, JSONGetFile, JSONGet_ } from '../../Services/JsonService';
import { Parameter } from '../../Services/Parameter'
import array from '../../Utils/array'

export default class BusCheckout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            client_name         : null,
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
            filterActive        : false,
            radioItems          : array.TitleAdult(),
            index               : 0,
            dept_seat  : [],
            ret_seat :[]
        }
    }

    componentDidMount(){
        
        AsyncStorage.getItem('UserData', (err, UserData) => {
            if (UserData) {
               this.setState({client_name : Function.JsonParse(UserData).client_name, client_email : Function.JsonParse(UserData).client_email, client_phone: Function.JsonParse(UserData).client_phone })
            } else {

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
                title   : array.TitleAdult()[0],
                name    : null,
                num_id  : null,
                birthdate : moment(new Date()).format('YYYY-MM-DD')
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
        let { client_name, client_email, client_phone, pax_adult, pax_infant, agreement } = this.state
        let { navigation } = this.props
        let { state } = navigation
        let { pax_list, bus_depart, bus_return } = state.params
        
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


        if (!client_name) this.setState({ client_name_error: STRING.Warrning.field_name_error })
        if (!(regex_alphabet.test(client_name))) this.setState({ client_name_error: STRING.Warrning.field_alfa_name_error})
        if (!client_email) this.setState({ client_email_error: STRING.Warrning.field_email_error })
        if (!(regex_email.test(client_email))) this.setState({ client_email_error: STRING.Warrning.field_wrong_email })
        if (!client_phone) this.setState({ client_phone_error: STRING.Warrning.field_number_error })
        if (!(regex_number.test(client_phone))) this.setState({ client_phone_error: 'No. Handphone harus diisi angka' })

        pax_adult.map((item, index) => {
            if (!(regex_alphabet.test(item.name))) this.setPax('error_pax_adult', index, 'name', 'Nama harus di isi alfabet.')
            if (!item.name) this.setPax('error_pax_adult', index, 'name', 'Nama lengkap wajib diisi')
            if (!item.num_id) this.setPax('error_pax_adult', index, 'num_id', 'Silakan isi nomor identitas.')
            if (!(regex_number.test(item.num_id))) this.setPax('error_pax_adult', index, 'num_id', 'Nomor identitast harus di isi angka.')
        })


        if ( !(this.state.client_name_error) &&
            !(this.state.client_email_error) &&
            !(this.state.client_phone_error) &&
            this.state.error_pax_adult.length === 0 
            //&&
            // this.state.error_pax_infant.length === 0 &&
            // agreement
        ) {
            this.createURL(pax_list, bus_depart, bus_return)
        
                AsyncStorage.getItem('UserData', (err, UserData) => {
                    if (UserData) {
                        this.get_seat()
                        // this.reserveAction()
                    } else {
        
                        AsyncStorage.getItem('CustomerData', (err, CustomerData) => {
                            if (CustomerData) {
                                this.get_seat()
                            //     // this.reserveAction()
                            } else {
                                this.auth_nonmember()
                            }
                        })
                    }
                })

                
        } else {
           
            Alert('Silakan lengkapi data terlebih dahulu.')
        }
    }

    createURL = (pax_list, bus_depart, bus_return ) => {
        var dept_seat = []
        var ret_seat =[]

        for (var i =0 ; i< pax_list.pax_adult ; i++){
            dept_seat.push(this.state.dept_seat[i])
        }
     
        var UrlRet = ''
        var trip_type = "one-way"
        if (bus_return){
            for (var i =0 ; i< pax_list.pax_adult ; i++){
                ret_seat.push(this.state.ret_seat[i])
            }
            trip_type = "round-way"
            UrlRet = "&return_source=" + bus_return.org_code
            + "&return_destination=" + bus_return.des_coden+
            "&return_doj=" + bus_return.dep_date+
            "&return_boarding_point_id=" + bus_return.boardingTimesDetails[0].id +
            "&return_dropping_point_id=" + bus_return.droppingTimesDetails[0].id +
            "&return_boarding_time=" + bus_return.boardingTimesDetails[0].time +
            "&return_dropping_time=" + bus_return.droppingTimesDetails[0].time +
            "&return_available_trip_id=" + bus_return.availableTripId +
            "&return_fare=" + bus_return.price;
        }
        

        let url = getURLBus('check_out') + "?trip_type=" + trip_type
                        + "&credential_code=" + 'padiciti'
                        + "&credential_pass=" + 'padiciti123'
                        + "&phone_number=" +'02122214018'
                        + "&email=" + this.state.client_email
                        + "&address=" + this.state.client_email
                        + "&depart_source=" + bus_depart.org_code
                        + "&depart_destination=" + bus_depart.des_code
                        + "&depart_doj=" + bus_depart.dep_date
                        + "&depart_boarding_point_id=" + bus_depart.boardingTimesDetails[0].id
                        + "&depart_dropping_point_id=" + bus_depart.droppingTimesDetails[0].id
                        + "&depart_boarding_time=" + bus_depart.boardingTimesDetails[0].time
                        + "&depart_dropping_time=" + bus_depart.droppingTimesDetails[0].time
                        + "&depart_available_trip_id=" + bus_depart.availableTripId
                        + "&depart_fare=" + bus_depart.price
                        + "&num_pax_adult=" + pax_list.pax_adult;
        let url_adult_data      = ''
        this.state.pax_adult.map((item, index) => {
           
            url_adult_data = url_adult_data + "&passenger_name_" + (index + 1) + "=" + item.name.replace(" ", "%20") +
            "&passenger_id_" + (index + 1) + "=" + item.num_id.replace(" ", "%20") + 
            "&passenger_id_type_" + (index + 1) + "=" +'KTP'+
            "&passenger_age_" + (index + 1) + "=" + (isNaN(Math.floor(moment(new Date()).diff(moment(item.birthdate,"MM/DD/YYYY"),'years',true))) ? 0 : Math.floor(moment(new Date()).diff(moment(item.birthdate,"MM/DD/YYYY"),'years',true)))+
            // moment(moment(new Date(), 'YYYYMMDD').diff(moment(item.birthdate, 'YYYYMMDD'))).dayOfYear()
            "&passenger_gender_" + (index + 1) + "=" + item.title.gender+
            "&passenger_seat_name_" + (index + 1) + "[]" + "=" + dept_seat[index]+
            (bus_return ? ("&passenger_seat_name_" + (index + 1)  + "[]" + "=" + ret_seat[index]): '')
            
        })

        

        url = url +UrlRet+ url_adult_data;
        console.log('<< ininini url >> ')
        console.log(url)
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
                        this.setState({ loading: false }, ()=>{
                                Function.SaveDataJson('CustomerData', Function.JsonString({
                                    clientId: Respone.userId,
                                    client_name: Respone.fullName,
                                    client_email: Respone.email,
                                    client_phone: Respone.phoneNumber,
                                }))
                                this.get_seat()
                                // Alert('Tentative Booking failed')
                                // this.reserveAction()
                           
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
        } catch (Error) {
            this.setState({ loading: false }, () => {
                // this.backAndroid()
            })
            console.log('Error >>> ', Error)
        }

    }

    get_seat = (type) => {
        var dept_seat =[]
        var ret_seat=[]
        const { navigation } = this.props
        const { params } = navigation.state
        const { pax_list, bus_depart, bus_return } = params
        // console.log('bus_depart')
        // console.log(bus_depart)
        try {
            this.setState({ loading: true })
            let url = getURLBus('get_seat', {available_trip_id : type ? bus_return.availableTripId : bus_depart.availableTripId})
            
            JSONGet_(url, null).then((Respone) => {
                
                Respone = Respone.data
                switch (Respone.errorCode) {
                    case '0':
                        this.setState({ loading: false }, ()=>{
                           
                            if(type){
        
                                Respone.seats.map((item, index) =>{
                                    if(item[3] === '0'){
                                        ret_seat.push(item[0])
                                    }
                                })
                                this.setState({ret_seat : ret_seat}, () => {
                                    this.reserveAction()
                                })

                                
                            }
                            else {
                                if (bus_return){
                                    console.log('masuk ke return')
                                    Respone.seats.map((item, index) =>{
                                        if(item[3] === '0'){
                                            dept_seat.push(item[0])
                                        }
                                    })
                                    this.setState({dept_seat : dept_seat}, ()=>{
                                        this.get_seat('return')
                                    })
                                    
                                } else {
                                    Respone.seats.map((item, index) =>{
                                        if(item[3] === '0'){
                                            dept_seat.push(item[0])
                                        }
                                    })
                                    this.setState({dept_seat : dept_seat}, ()=>{
                                        this.reserveAction()
                                    })
                                    
                                }
                            
                            }
                                
                           
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
        } catch (Error) {
            this.setState({ loading: false }, () => {
                // this.backAndroid()
            })
            console.log('Error >>> ', Error)
        }

    }

    Confirmation(){
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
        let { pax_list, bus_depart, bus_return } = state.params

        this.setState({loading: true})
        JSONGetFile( this.createURL(pax_list, bus_depart, bus_return), null).then((response) => {
            // console.log('response', response)
            switch (response.errorCode) {
                case '0':
                this.setState({loading: false})
                console.log(' <<< JSONBOOKING >>>')
                console.log(response)
                if (bus_return){
                    this.props.navigation.navigate('BusReview', {
                        pax_list,
                        book_depart : {
                            ...bus_depart,
                            transactionCode : response.transactionCode,
                            passengers : response.listPassenger,
                            // pax_num: response.pax_num,
                            pax_name: this.state.pax_adult.concat(this.state.pax_infant),
                            num_pax_adult : response.numpaxAdult,              
                            price_adult : response.mapDepart.depart_fare,
                            
                        }, 
                        book_return : {
                            ...bus_return,
                            num_pax_adult : response.numpaxAdult,                  
                            price_adult : response.mapDepart.return_fare,  
                            
                    }, booking_cost_all: response.totalFare,})
                } else {
                    this.props.navigation.navigate('BusReview', {
                        pax_list,
                        book_depart : {
                            ...bus_depart,
                            transactionCode : response.transactionCode,
                            // pax_num: response.pax_num,
                            passengers : response.listPassenger,
                            pax_name: this.state.pax_adult.concat(this.state.pax_infant),
                            num_pax_adult : response.numpaxAdult,              
                            price_adult : response.mapDepart.depart_fare,
                            
                        }, booking_cost_all: response.totalFare,})
                }
                
                    break
                default:
                    this.setState({loading: false}, () => {
                        if (response.errorMessage) Alert(response.errorMessage)
                    })
            }
        }).catch((error) => {
            this.setState({loading: false}, () => {
                console.log('error', error)
            })
        })
    }
    setdataModal(){
        var ArrayradioItems = this.state.radioItems
        ArrayradioItems.map((item, index) => {
            item.selected = false
            if (this.state.pax_adult[this.state.index].title.label === item.label) 
            ArrayradioItems[index].selected = true
        });
        return ArrayradioItems
         
         
    }
    changeActiveRadioButton(index) {
        var ArrayradioItems = this.state.radioItems
        this.setState({ filterActive: false })
        ArrayradioItems.map((item) => {
            item.selected = false;
        });
        this.state.radioItems[index].selected = true;

        this.setPax('pax_adult', this.state.index, 'title', this.state.radioItems[index])


    }

    render() {
        const { navigation } = this.props
        const { params } = navigation.state
        const { bus_depart, bus_return } = params

        const ComponentView = _OS(KeyboardAvoidingView, View)

        // console.log(params)
        return (
            <ComponentView style={s.container} behavior='padding'>
                <Toolbar  
                    arrow_back
                    onPress ={ () => navigation.goBack()}>
                    <View>
                        <Text style={s.toolbar_title}>Penumpang dan Pemesan</Text>
                    </View>
                </Toolbar>
                <ScrollView keyboardShouldPersistTaps='always'>

                    <View style={s.border_big_bottom}>
                        {bus_depart && <CardSortTrain
                            nodetail
                            onPress     = {() => navigation.navigate('BusDetil', {title: STRING.Label.org_bus, data: bus_depart})}
                            title       = {STRING.Label.org_bus}
                            route       = {bus_depart.org + ' - ' + bus_depart.des}
                            date        = {moment(bus_depart.dep_date, 'YYYY-MM-DD').format('DD MMM')}
                            train_name  = {bus_depart.travelName}
                            />}
                        {bus_return && <View>
                            <View style={{borderBottomColor: Colors.border, borderBottomWidth: 1, marginHorizontal: Scale(16)}} />
                            <CardSortTrain
                                nodetail
                                onPress     = {() => navigation.navigate('BusDetil', {title: STRING.Label.dep_bus, data: bus_return})}
                                title       = {STRING.Label.dep_bus}
                                route       = {bus_return.org + ' - ' + bus_return.des}
                                date        = {moment(bus_depart.dep_date, 'YYYY-MM-DD').format('DD MMM')}
                                train_name  = {bus_return.travelName}
                                />
                        </View>}
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
                            label       = {STRING.Label.client_name}
                            placeholder = {STRING.Label.fit_idcard}
                            value       = {this.state.client_name}
                            error       = {this.state.client_name_error}
                            onChangeText= {value => this.setState({client_name: value})}/>
                        
                        <TrainInput 
                            label       = {STRING.Label.email_subscribers}
                            placeholder = {STRING.Label.ex_email}
                            value       = {this.state.client_email}
                            error       = {this.state.client_email_error}
                            onChangeText= {value => this.setState({client_email: value})}/>

                        <TrainInput
                            type        = {'number'}
                            label       = {STRING.Label.no_telp}
                            placeholder = {STRING.Label.ex_telp}
                            value       = {this.state.client_phone}
                            error       = {this.state.client_phone_error}
                            onChangeText= {value => this.setState({client_phone: value})}/>
                    </View>


                    <View>
                        { this.state.pax_adult.map((item, index) => (
                            <View key={index} style={{paddingHorizontal: Scale(16), paddingVertical: Scale(8), paddingTop: Scale(4), borderBottomWidth: Scale(2), borderBottomColor: Colors.border}}>  
                                <Text style={s.title_section}>Penumpang Dewasa #{index + 1}</Text>
                                <TrainOption
                                    onPress     ={() => this.setState({ filterActive: true, index : index})}
                                    tintColor   = {Colors.tangerine}
                                    label       = {'Title'}
                                    icon_right  = {'ic_arrow_down'}
                                    value       = {this.state.pax_adult[index].title.label}
                                    error       = {this.state.error_pax_adult[index] && this.state.error_pax_adult[index].title}
                                    />
                                <TrainInput 
                                    label       = {STRING.Label.full_name}
                                    placeholder = {STRING.Label.fit_idcard}
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

                                <TrainForm
                                    type        = 'date'
                                    icon_left   = 'ic_calendar'
                                    label       = {STRING.Label.brith_date}
                                    value       = {this.state.pax_adult[index].birthdate}
                                    placeholder = {'Contoh: DD/MM/YYYY'}
                                    minYear     = {-80}
                                    // maxYear     = {-18}
                                    onPress     = { date => this.setPax('pax_adult', index, 'birthdate', moment(date).subtract(0, 'year').format('DD-MM-YYYY'))}
                                    error       = {this.state.error_pax_adult[index] && this.state.error_pax_adult[index].birthdate}
                                    />
                            </View>
                            )) }
                        
                    </View>

                    <Button onPress={() => this.Confirmation()}>
                        Selanjutnya
                    </Button>

                </ScrollView>

                <Loading
                    text={STRING.Label.waitting_for_Booking}
                    visible={this.state.loading} />
                    <DialogComponent
                            active={this.state.filterActive}
                            open={() => this.setState({ filterActive: true })}
                            close={() => this.setState({ filterActive: false })}
                            title={'Title'}
                            // action  = {() => this.Confirmation()} 
                            position='center'
                        >
                            {this.setdataModal().map((item, key) => (
                                <View style={{ padding: Metrics.sizePad }}>
                                    <RadioButtons key={key} button={item}
                                        onClick={this.changeActiveRadioButton.bind(this, key)}
                                    />
                                </View>
                            ))}

                        </DialogComponent>
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
        width : Metrics.screenWidth,
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

AppRegistry.registerComponent("padiciti", () => BusCheckout);
