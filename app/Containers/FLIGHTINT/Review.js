import React, { Component } from 'react'
import {
    AsyncStorage,
    TextInput,
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Alert,
    Image, Platform, Dimensions, AppRegistry, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableOpacity, BackHandler,Alert as Confirmation
} from 'react-native'
import { Function, STRING,Validaton } from '../../Utils'
import array     from '../../Utils/array';
import { API, getURL } from '../../Services/API'
import { getAirlineLogo, RadioButtons, Colors, CalendarsScreen, Metrics, Container, getIcon, Toolbar, CardComponentReview, TextView, FrameRadiusComponent, CheckBox, Loading, DialogComponent, Fonts, ItemField } from '../../Components'

import Navbar from '../../Components/NavigationBottom'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import moment from 'moment'
import { Parameter } from '../../Services/Parameter'
import { Text } from 'react-native-animatable';
import { JSONPostFile } from '../../Services/JsonService'
import { DotsLoader } from 'react-native-indicator';
import DateTimePicker from 'react-native-modal-datetime-picker';
const finish = NavigationActions.back({ key: "" });
const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
export default class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            term_condition: false,
            search_param: null,
            dataDepart: null,
            dataReturn: null,
            FiledDataPassanger: array.FiledDataPassangerInter(),
            radioItems: array.TitleAdult(),
            radioItemsAdult: array.TitleAdult(),
            radioItemsChild: array.TitleChild(),
            radioItemsInfant: array.TitleInfant(),
            item_passanger: null,
            loading: false,
            filterActive: false,
            isDateTimePickerVisible: false
        }
    }

    componentDidMount() {
        const { params } = this.props.navigation.state;
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())

        AsyncStorage.getItem('SearchFlightInt', (err, SearchFlight) => {
            if (SearchFlight !== null) {
                this.setState({ search_param: Function.JsonParse(SearchFlight) }, () => {
                    for (let a = 0; a < this.state.search_param[0].adult; a++) {
                        this.setState({
                            [array.FiledDataPassangerInter()[1].name + (a + 1)]: array.TitleAdult()[0],
                            [array.FiledDataPassangerInter()[4].name + (a + 1)]: moment(new Date()).subtract(6, 'month').format('DD MMM YYYY')
                        })
                    }
                    for (let c = 0; c < this.state.search_param[1].child; c++) {
                        this.setState({
                            [array.FiledDataChildInter()[1].name + (c + 1)]: array.TitleChild()[0],
                            [array.FiledDataChildInter()[3].name + (c + 1)]: moment(new Date()).subtract(2, 'year').format('DD MMM YYYY'),
                            [array.FiledDataChildInter()[5].name + (c + 1)]: moment(new Date()).subtract(6, 'month').format('DD MMM YYYY')
                        })
                    }
                    for (let i = 0; i < this.state.search_param[2].infant; i++) {
                        this.setState({
                            [array.FiledDataInfantInter()[1].name + (i + 1)]: array.TitleInfant()[0],
                            [array.FiledDataInfantInter()[3].name + (i + 1)]: moment(new Date()).format('DD MMM YYYY'),
                            [array.FiledDataInfantInter()[5].name + (i + 1)]: moment(new Date()).subtract(6, 'month').format('DD MMM YYYY')
                        })
                    }
                })
            }
this.CheckUser()
            console.log(params.dataDepart)
            this.setState({ dataDepart: params.dataDepart, dataReturn: params.dataReturn })
        })

    }

    CheckUser (){
        AsyncStorage.getItem('UserData', (err, UserData) => {
            if (UserData) {
                this.setState({ client_name: Function.JsonParse(UserData).client_name, client_email: Function.JsonParse(UserData).client_email, client_phone: Function.JsonParse(UserData).client_phone, clientId: Function.JsonParse(UserData).clientId })
            } else {

                AsyncStorage.getItem('CustomerData', (err, CustomerData) => {
                    if (CustomerData !== null) {
                        this.setState({clientId : Function.JsonParse(CustomerData).clientId , client_name: Function.JsonParse(CustomerData).client_name, client_email: Function.JsonParse(CustomerData).client_email, client_phone: Function.JsonParse(CustomerData).client_phone })
                    }
                })
            }
        })
    }
    _showDateTimePicker = (item) => this.setState({ isDateTimePickerVisible: true, maxDate: item.name === 'child_brith_date' ? 2 : item.name === 'infant_brith_date' ? 0: null, minDate: item.name === 'child_brith_date' ? 11 : item.name === 'infant_brith_date' ? 2:2 });

    _hideDateTimePicker = () => this.setState({ isDateTimePickerVisible: false });

    _handleDatePicked = (date) => {
        this.setState({ [this.state.item_passanger]: moment(date).format('DD MMM YYYY').toString() })
        this._hideDateTimePicker();
    };

    changeActiveRadioButton(index) {
        var ArrayradioItems = this.state.radioItems
        this.setState({ filterActive: false })
        ArrayradioItems.map((item) => {
            item.selected = false;
        });
        this.state.radioItems[index].selected = true;

        switch (this.state.radioItems[0].slug) {
            case 'Adult':
                this.setState({ [this.state.item_passanger]: this.state.radioItems[index], radioItemsAdult: ArrayradioItems })
                break
            case 'Child':
                this.setState({ [this.state.item_passanger]: this.state.radioItems[index], radioItemsChild: ArrayradioItems })
                break;
            case 'Infant':
                this.setState({ [this.state.item_passanger]: this.state.radioItems[index], radioItemsInfant: ArrayradioItems })
                break;
        }


    }
    backAndroid() {
        this.props.navigation.dispatch(finish)
        return true
    }
    ActivityResult = (data) => {
        console.log(this.state)
        switch (data.slug) {

            case 'brithdate':
                this.setState({ [this.state.item_passanger]: Function.FormeteDate(data.birthdate, 'YYYY-MM-DD', 'DD MMM YYYY') })
                break
            case 'passanger':
            const { params } = this.props.navigation.state;
            if (params.dataDepart.classType === 'INT') {

                this.setState({
                    [data.type === 'ADULT' ? 'adult_full_name' + data.key : data.type === 'CHILD' ? 'child_full_name' + data.key : 'infant_full_name' + data.key]: data.data.full_name,
                    [data.type === 'ADULT' ? 'adult_passport' + data.key : data.type === 'CHILD' ? 'child_passport' + data.key : 'infant_passport' + data.key]: data.data.no_pasport,
                    // [data.type === 'ADULT' ? 'adult_passport' + data.key : data.type === 'CHILD' ? 'child_expiryPassport' + data.key : 'infant_expiryPassport' + data.key]: Function.FormeteDate(data.data.expiryPassport, 'YYYYMMDD', 'DD MMM YYYY'),
                    radioItems: data.type === 'ADULT' ? this.state.radioItemsAdult : data.type === 'CHILD' ? this.state.radioItemsChild : this.state.radioItemsInfant,
                    [data.type === 'ADULT' ? 'adult_brith_date' + data.key : data.type === 'CHILD' ? 'child_brith_date' + data.key : 'infant_brith_date' + data.key]: Function.FormeteDate(data.data.brithdate, 'YYYYMMDD', 'DD MMM YYYY'),
                    item_passanger: data.type === 'ADULT' ? 'adult_title' + data.key : data.type === 'CHILD' ? 'child_title' + data.key : 'infant_title' + data.key
                }, () => {
                    var ArrayradioItems = this.state.radioItems
                    ArrayradioItems.map((item, i) => {
                        if (item.title.toLowerCase() === data.data.title.toLowerCase()) {
                            this.changeActiveRadioButton(i)
                        }
                    })

                    this.CheckUser()

                })

            } else {
                this.setState({
                    [data.type === 'ADULT' ? 'adult_full_name' + data.key : data.type === 'CHILD' ? 'child_full_name' + data.key : 'infant_full_name' + data.key]: data.data.full_name
                    , radioItems: data.type === 'ADULT' ? this.state.radioItemsAdult : data.type === 'CHILD' ? this.state.radioItemsChild : this.state.radioItemsInfant,
                    [data.type === 'ADULT' ? 'adult_brith_date' + data.key : data.type === 'CHILD' ? 'child_brith_date' + data.key : 'infant_brith_date' + data.key]: Function.FormeteDate(data.data.brithdate, 'YYYYMMDD', 'DD MMM YYYY'),
                    item_passanger: data.type === 'ADULT' ? 'adult_title' + data.key : data.type === 'CHILD' ? 'child_title' + data.key : 'infant_title' + data.key
                }, () => {
                    var ArrayradioItems = this.state.radioItems
                    ArrayradioItems.map((item, i) => {
                        if (item.title.toLowerCase() === data.data.title.toLowerCase()) {
                            this.changeActiveRadioButton(i)
                        }
                    })

                    this.CheckUser()

                })
            }
               
                break
            default:

                break
        }
    }

    buttonChouse(item, index) {
        this.setState({ item_passanger: item.name + index }, () => {
            item.slug === 'option_brithdate' ?
                this._showDateTimePicker(item)
                : this.setState({ filterActive: true, radioItems: item.name === 'adult_title' ? this.state.radioItemsAdult : item.name === 'child_title' ? this.state.radioItemsChild : this.state.radioItemsInfant })
        })

    }

    View(key, ArrayView, Pasanger) {
        return (
            <View key={key} style={{ backgroundColor: Colors.white, paddingRight: Scale(16), paddingLeft: Scale(16), paddingTop: Scale(16), marginTop: Scale(4), paddingBottom: Scale(16) }} >
                <TextView
                    style={styles.titlePassanger}
                    text={ArrayView.length !== 0 && ArrayView[0].title + ' ' + (key + 1)} />
                {ArrayView.length !== 0 && ArrayView.map((item, i) => (
                    <View>
                        {i === 0 && <ItemField
                            style={{ marginHorizontal: 0, marginVertical: 0, }}
                            type='option'
                            label={null}
                            value={STRING.Function_name.choose_custumerdata}
                            onPress={() => this.gotoPassanger((key + 1), Pasanger)}
                        />}


                        {i !== 0 && <View
                            key={i}
                            style={{ marginTop: Scale(8) }}>
                            {item.slug === 'input' &&
                                <ItemField
                                    type='input'
                                    label={item.title}
                                    holder={item.holder}
                                    value={this.state[item.name + (key + 1)]}
                                    onChangeText={text => this.setState({ [item.name + (key + 1)]: text })}
                                    error={this.state[item.name + '_error'+(key + 1)]} />
                            }

                            {item.slug !== 'input' &&
                                <ItemField
                                    style={{ marginHorizontal: 0, marginVertical: 0, }}
                                    type='option'
                                    label={item.title}
                                    holder={item.holder}
                                    value={this.state[item.name + (key + 1)] && this.state[item.name + (key + 1)].label ? this.state[item.name + (key + 1)].label : this.state[item.name + (key + 1)]}
                                    onPress={() => this.buttonChouse(item, (key + 1))}
                                    error={this.state[item.name + '_error'+(key + 1)]} />

                            }
                        </View>}
                    </View>
                ))}
            </View>
        )
    }


    gotoPassanger(key, Pasanger) {
        // Alert.alert("URLLL : "+key)
        const { params } = this.props.navigation.state;
        var Status = true
        for (let i = 0; i < array.FiledDataClient().length; i++) {
            this.setState({[array.FiledDataClient()[i].name+ '_error'] : null})
            if ( !this.state[array.FiledDataClient()[i].name]) {
                Status = false
                this.setState({[array.FiledDataClient()[i].name+ '_error'] : STRING.Label.please_fill_in})
            }
        }

        
        // if (Status) {
        //     this.props.navigation.navigate('DataPassanger', {
        //         metod_flight : params.dataDepart.classType, parameter: { type_passanger: Pasanger }, nonMember: {email: this.state.client_email, fullName: this.state.client_name, phoneNumber: this.state.client_phone, deviceRegistered: Platform.OS == 'ios' ? 'IOS' : 'Android', },
        //         ActivityResult: this.ActivityResult,
        //         Key: key
        //     })
        // }
        if (Status) {
            this.props.navigation.navigate('DataPassanger', {
                metod_flight : params.dataDepart.classType, parameter: { type_passanger: Pasanger }, nonMember: {email: this.state.client_email, fullName: this.state.client_name, phoneNumber: this.state.client_phone, deviceRegistered: Platform.OS == 'ios' ? 'IOS' : 'Android', },
                ActivityResult: this.ActivityResult,
                Key: key
            })
        }
    }

    Confirmation(){
        console.log(this.state)
        Confirmation.alert(
            'Pesanan Anda sudah benar ?',
            'Anda tidak akan bisa mengubah detail pesanan setelah melanjutkan kehalaman pembayaran. Tetap lanjutkan ?',
            [
              {text: 'Periksa Kembali', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
              {text: 'Ya, Lanjutkan', onPress: () => this.Action()},
            ],
            { cancelable: false }
          )
    }

    Action() {
        var Status = true
        const { params } = this.props.navigation.state;
        for (let a = 0; a < this.state.search_param[0].adult; a++) {
            this.setState({
                ['adult_full_name_error' + (a + 1)]: null,
                ['adult_passport_error' + (a + 1)]: null
            })
            if (!this.state['adult_full_name' + (a + 1)] || (this.state['adult_full_name' + (a + 1)]).length > 25) {
                Status = false
                this.setState({ ['adult_full_name_error' + (a + 1)]: (this.state['adult_full_name' + (a + 1)] && this.state['adult_full_name' + (a + 1)].length > 25) ? 'Tidak boleh lebih dari 25 karakter':STRING.Label.please_fill_in })
            }

            if (params.dataDepart.classType === 'INT') {
                if (!this.state['adult_passport' + (a + 1)]) {
                    Status = false
                    this.setState({ ['adult_passport_error' + (a + 1)]: STRING.Label.please_fill_in })
                }
            }

            if (Validaton.Character(this.state['adult_full_name' + (a + 1)])) {
                Status = false
                this.setState({ ['adult_full_name_error' + (a + 1)]: Validaton.Character(this.state['adult_full_name' + (a + 1)]) })
            }
        }

        for (let c = 0; c < this.state.search_param[1].child; c++) {
            this.setState({
                ['child_full_name_error' + (c + 1)]: null,
                ['child_passport_error' + (c + 1)]: null
            })
            if (!this.state['child_full_name' + (c + 1)] || this.state['child_full_name' + (c + 1)].length > 25) {
                Status = false
                this.setState({ ['child_full_name_error' + (c + 1)]: (this.state['child_full_name' + (c + 1)] && this.state['child_full_name' + (c + 1)].length > 25 )? 'Tidak boleh lebih dari 25 karakter': STRING.Label.please_fill_in })
            }
            if (params.dataDepart.classType === 'INT') {
                if (!this.state['child_passport' + (c + 1)]) {
                    Status = false
                    this.setState({ ['child_passport_error' + (c + 1)]: STRING.Label.please_fill_in })
                }
            }

            if (Validaton.Character(this.state['child_full_name' + (c + 1)])) {
                Status = false
                this.setState({ ['child_full_name_error' + (c + 1)]: Validaton.Character(this.state['child_full_name' + (c + 1)]) })
            }
        }

        for (let i = 0; i < this.state.search_param[2].infant; i++) {
            this.setState({
                ['infant_full_name_error' + (i + 1)]: null,
                ['infant_passport_error' + (i + 1)]: null
            })
            if (!this.state['infant_full_name' + (i + 1)] || this.state['infant_full_name' + (i + 1)].length > 25) {
                Status = false
                this.setState({ ['infant_full_name_error' + (i + 1)]:( this.state['infant_full_name' + (i + 1)] && this.state['infant_full_name' + (i + 1)].length > 25) ? 'Tidak boleh lebih dari 25 karakter': STRING.Label.please_fill_in })
            }
            if (params.dataDepart.classType === 'INT') {
                if (!this.state['infant_passport' + (i + 1)]) {
                    Status = false
                    this.setState({ ['infant_passport_error' + (i + 1)]: STRING.Label.please_fill_in })
                }
            }
            if (Validaton.Character(this.state['infant_full_name' + (i + 1)])) {
                Status = false
                this.setState({ ['infant_full_name_error' + (i + 1)]: Validaton.Character(this.state['infant_full_name' + (i + 1)]) })
            }
        }

        for (let i = 0; i < array.FiledDataClient().length; i++) {
            this.setState({ [array.FiledDataClient()[i] + '_error']: null })
            if (!this.state[array.FiledDataClient()[i].name]) {
                Status = false
                this.setState({ [array.FiledDataClient()[i].name + '_error']: STRING.Label.please_fill_in })
            }

            if (array.FiledDataClient()[i].name === 'client_email') {
                console.log(Validaton.Email(this.state[array.FiledDataClient()[i].name]))
                if (Validaton.Email(this.state[array.FiledDataClient()[i].name])) {
                    Status = false
                    this.setState({ [array.FiledDataClient()[i].name + '_error']: Validaton.Email(this.state[array.FiledDataClient()[i].name]) })
                }
            }

            if (array.FiledDataClient()[i].name === 'client_name') {

                if (Validaton.Character(this.state[array.FiledDataClient()[i].name])) {
                    Status = false
                    this.setState({ [array.FiledDataClient()[i].name + '_error']: Validaton.Character(this.state[array.FiledDataClient()[i].name]) })
                }
            }
        }

        if (Status) {
            // Alert.alert("STAUS")
            console.log("SRTAUSSSSSSSSSSSSSS")
            this.Auth()
        }
    }

    Auth = () => {
        const { params } = this.props.navigation.state;
        try {
            // Function.SaveDataJson('CustomerData', Function.JsonString({ client_name: this.state['client_name'], client_email: this.state['client_email'], client_phone: this.state['client_phone'] }))
            this.setState({ loading: true })
            let url = getURL('url__post_booking_flight_2')
            let param = Parameter.PostBooking2(this.state)
            console.log("URLINTL : "+url)
            console.log("PARAM INTL : "+JSON.stringify(param))
            
            JSONPostFile(url, param).then((Respone) => {
                console.log('Respone')
                console.log("RESPONES : "+JSON.stringify(Respone))
                console.log("RESPCOD : "+Respone.respCode)
                this.setState({ loading: false })

                switch (Respone.respCode) {
                    
                    case '0':
                        console.log("AUTH : >>>>>>>>>>>>>>>>>>"+respone)
                        this.setState({ loading: false }, () => {
                            this.props.navigation.navigate('DetilPemesananINT', { DataJson: Respone, airlineGroupDepart: Function.ObjectNull(params, 'dataDepart.airlineCode'), airlineGroupReturn: Function.ObjectNull(params, 'dataReturn.airlineCode'), data: param })
                        })
                        break
                    case '82204':
                    Alert.alert("Silahkan Pilih Jadwal yang Lain")
                        break
                    default:
                        Alert(Respone.inRespMsg)
                        break
                }

            }).catch((err) => {
                this.setState({ loading: false })
                console.log('err >>> ' + err)
            })
        } catch (Error) {
            this.setState({ loading: false })
            console.log('Error >>> ', Error)
        }

    }

    render() {

        const { params } = this.props.navigation.state;
        let AdultView = []
        let ChildView = []
        let InfantView = []

        if (this.state.search_param !== null) {

            if (params.dataDepart.classType === 'INT'){
                for (let a = 0; a < this.state.search_param[0].adult; a++) {

                    AdultView.push(this.View(a, array.FiledDataPassangerInter(), 'ADULT'))
                }
                for (let c = 0; c < this.state.search_param[1].child; c++) {
                    ChildView.push(this.View(c, array.FiledDataChildInter(), 'CHILD'))
                }
                for (let i = 0; i < this.state.search_param[2].infant; i++) {
                    InfantView.push(this.View(i, array.FiledDataInfantInter(), 'INFANT'))
                }

            } else {
                for (let a = 0; a < this.state.search_param[0].adult; a++) {

                    AdultView.push(this.View(a, array.FiledDataPassanger(), 'ADULT'))
                }
                for (let c = 0; c < this.state.search_param[1].child; c++) {
                    ChildView.push(this.View(c, array.FiledDataChild(), 'CHILD'))
                }
                for (let i = 0; i < this.state.search_param[2].infant; i++) {
                    InfantView.push(this.View(i, array.FiledDataInfant(), 'INFANT'))
                }
            }

            


        }
        return (
            <View style={styles.frame} >
                <Toolbar
                    arrow_back
                    onPress={() => this.backAndroid()}
                    View={
                        <TextView
                            style={styles.lableTitle}
                            text={"Penumpang dan Pemesan"}
                        />
                    }
                />
                <ScrollView style={{ flex: 1, }}>
                    <View style={{ backgroundColor: Colors.whitesmoke }} >
                        <View style={{ backgroundColor: Colors.white, padding: 16, }} >
                            <TextView
                                style={styles.titlePassanger}
                                text={STRING.Label_Flight.lbl_org_flight}
                            />

                            <CardComponentReview
                                image={getAirlineLogo(Function.ObjectNull(params, 'dataDepart.airlineCode').toLowerCase())}
                                // flightNo={Function.ObjectNull(params, 'dataDepart.flightNo')}
                                city={this.state.search_param && (this.state.search_param[5].depart.title + ' - ' + this.state.search_param[6].return.title)}
                                // date={this.state.search_param && this.state.search_param[3].depart_date}
                                // transport={Function.ObjectNull(params, 'dataDepart.airline')}
                                onpress_detil={() => this.props.navigation.navigate('detilINT', { data: Function.ObjectNull(params, 'dataDepart'), airlineGroup: Function.ObjectNull(params, 'dataDepart.airlineGroup'), slug: 'depart' })}
                            />
                            {Function.ObjectNull(params, 'dataReturn') && <View style={styles.line} >
                            </View>}
                            {Function.ObjectNull(params, 'dataReturn') && <TextView
                                style={styles.titlePassanger}
                                text={STRING.Label_Flight.lbl_dep_flight}
                            />}
                            {Function.ObjectNull(params, 'dataReturn') && <CardComponentReview
                                image={getAirlineLogo(Function.ObjectNull(params, 'dataReturn.airlineCode').toLowerCase())}
                                // flightNo={Function.ObjectNull(params, 'dataReturn.flightNo')}
                                city={this.state.search_param && (this.state.search_param[6].return.title) + ' - ' + this.state.search_param[5].depart.title}
                                // date={this.state.search_param && this.state.search_param[4].return_date}
                                // transport={Function.ObjectNull(params, 'dataReturn.airline')}
                                onpress_detil={() => this.props.navigation.navigate('detilINT', { data: Function.ObjectNull(params, 'dataReturn'), airlineGroup: Function.ObjectNull(params, 'dataReturn.airlineGroup'), slug: 'return' })}
                            />}
                        </View>
                        <View style={{ backgroundColor: Colors.white, paddingRight: 16, paddingLeft: 16, paddingTop: 16, marginTop: 4, paddingBottom: 16 }} >

                            <TextView
                                style={{
                                    fontSize: Scale(16), bottom: Scale(8), color: Colors.blue
                                }}
                                text={STRING.Label.client} />

                            {/* {array.DataPemesan().map((item, i) => (
                                <View style={{ flexDirection: 'row' }} >
                                    <TextView
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: 16, color: Colors.warm_grey,
                                        }}
                                        text={'• '}
                                    />
                                    <TextView
                                        style={{
                                            fontSize: Scale(12), color: Colors.warm_grey
                                        }}
                                        text={item.title}
                                    />
                                </View>

                            ))} */}
                            {array.FiledDataClient().map((item, i) => (
                                <View
                                    key={i}
                                    style ={{marginTop : Metrics.padding.normal}}>

                                    <ItemField
                                        numeric={item.slug === 'number' ? true : false}
                                        type='input'
                                        label={item.title}
                                        holder={item.holder}
                                        value={this.state[item.name]}
                                        onChangeText={text => this.setState({ [item.name]: text })}
                                        error={this.state[item.name + '_error']} />
                                </View>
                            ))}
                        </View>
                        {AdultView}
                        {ChildView}
                        {InfantView}
                        {/* <View style={{ backgroundColor: Colors.white, paddingTop: Scale(16), paddingLeft: Scale(16), paddingRight: Scale(16) }}>
                            <TextView
                                style={{
                                    fontSize: 16, bottom: 8, color: Colors.blue
                                }}
                                text={STRING.Label.terms_and_conditions}
                            />

                        </View> */}
                        {/* <View style={{ backgroundColor: "#fff8d2", paddingTop: Scale(16), paddingLeft: Scale(16), paddingRight: Scale(16), }}> */}
                            {/* {array.TermAndCondition().map((item, i) => (
                                <View style={{ flexDirection: 'row' }} >
                                    <TextView
                                        style={{
                                            fontWeight: "bold",
                                            fontSize: Scale(16), color: Colors.warm_grey,
                                        }}
                                        text={'• '}
                                    />
                                    <TextView
                                        style={{
                                            fontSize: Scale(12), color: Colors.warm_grey, marginBottom: 8
                                        }}
                                        text={item.title}
                                    />
                                </View>

                            ))} */}
                        {/* </View> */}
                        <View style={{ backgroundColor: Colors.white, paddingTop: Scale(16), paddingBottom: Scale(16) }}>
                            {/* <CheckBox
                                onPress={() => this.setState({ term_condition: !this.state.term_condition })}
                                label={STRING.Label.check_box}
                                Bordererror = {this.state.term_condition_error}
                                labelCondition={'Syarat & Ketentuan'}
                                value={this.state.term_condition} /> */}

                            <TouchableComponent
                                onPress={() => this.Confirmation()} >
                                <View style={{
                                    flex: 1, justifyContent: 'center',
                                    alignItems: 'center',
                                    marginRight: Scale(16),
                                    marginLeft: Scale(16),
                                    marginTop: Scale(16),
                                    height: Scale(45),
                                    borderRadius: Scale(4),
                                    backgroundColor: Colors.tangerine
                                }}>
                                    <TextView style={{ color: Colors.white }}>{STRING.Label.more}</TextView>
                                </View>
                            </TouchableComponent>
                        </View>

                    </View>
                </ScrollView>
                <Loading
                    text={STRING.Label.waitting_for_Booking}
                    visible={this.state.loading}
                />

                <DialogComponent
                    active={this.state.filterActive}
                    open={() => this.setState({ filterActive: true })}
                    close={() => this.setState({ filterActive: false })}
                    title={'Title'}
                    // action  = {() => this.Confirmation()} 
                    position='center'
                >
                    {this.state.radioItems.map((item, key) => (
                        <View style={{ padding: Metrics.sizePad }}>
                            <RadioButtons key={key} button={item}
                                onClick={this.changeActiveRadioButton.bind(this, key)}
                            />
                        </View>
                    ))}

                </DialogComponent>
                {(this.state.maxDate === 0 || this.state.maxDate) ? <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    minimumDate={moment(new Date()).subtract(this.state.minDate, 'year').toDate()}
                    maximumDate={this.state.maxDate ? moment(new Date()).subtract(this.state.maxDate, 'year').toDate() : moment(new Date()).toDate()}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                /> : 
                <DateTimePicker
                    isVisible={this.state.isDateTimePickerVisible}
                    onConfirm={this._handleDatePicked}
                    onCancel={this._hideDateTimePicker}
                />}
            </View>
        );
    }
}

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
    },
    titleLable: {
        marginTop: Scale(16),
        fontSize: Scale(16),
        color: Colors.warm_grey
    },
    frameTextInput: {
        height: Scale(40),
        justifyContent: 'center'
    }, line: {
        marginTop: Scale(16),
        marginBottom: Scale(16),
        height: Scale(2),
        backgroundColor: Colors.whitesmoke,
        marginRight: Scale(14),
        marginLeft: Scale(14)
    },
});
AppRegistry.registerComponent("padiciti", () => Review);
