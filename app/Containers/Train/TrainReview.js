import React, { Component } from 'react'
import {
    AppRegistry,
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView, Alert as Confirmation
} from 'react-native'
import {
    TextView as Text,
    Toolbar,
    Scale,
    Colors,
    Fonts,
    Button,
    Loading,
    Alert,Touchable
} from '../../Components/'

import { CardSortTrain, CardShortPax } from '../../Components/TrainCardComponent';
import { _OS, Metrics } from '../../Assets';
import moment from 'moment';
import {NavigationActions } from 'react-navigation';
import { setPaxSeats } from '../../Utils/TrainUtils';
import { STRING, Function, navigateTo } from '../../Utils';
import { getURLTrain } from '../../Services/API';
import { JSONPostFile, JSONGetFile } from '../../Services/JsonService';

const finish = NavigationActions.back({ key: "" });
export default class TrainReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            pax_data_depart: [],
            pax_data_return : [],
            train_depart: {
                err_code: '0',
                org: 'GMR',
                des: 'BD',
                dep_date: '20180629',
                arv_date: '20180629',
                dep_time: '0505',
                arv_time: '0839',
                train_no: '20',
                book_code: 'EFFRR6',
                num_code: '9991014212508',
                pax_num: [2, 0, 1],
                pax_name: ['VIVI TIUR', 'ROZALI KURNIAWAN', 'ALSYIFA NURUL'],
                seat:
                    [['EKO_AC', '1', '2', 'A'],
                    ['EKO_AC', '1', '2', 'B'],
                    ['', '', '', '']],
                normal_sales: 160000,
                extra_fee: 0,
                discount: -7500,
                admin_fee: 7500,
                book_balance: 152500,
                booking_cost_all: 160000,
                order_makan: []
            },
            train_return: {
                err_code: '0',
                org: 'GMR',
                des: 'BD',
                dep_date: '20180629',
                arv_date: '20180629',
                dep_time: '0505',
                arv_time: '0839',
                train_no: '20',
                book_code: 'EFFRR6',
                num_code: '9991014212508',
                pax_num: [2, 0, 1],
                pax_name: ['VIVI TIUR', 'ROZALI KURNIAWAN', 'ALSYIFA NURUL'],
                seat:
                    [['EKO_AC', '1', '2', 'A'],
                    ['EKO_AC', '1', '2', 'B'],
                    ['', '', '', '']],
                normal_sales: 160000,
                extra_fee: 0,
                discount: -7500,
                admin_fee: 7500,
                book_balance: 152500,
                booking_cost_all: 160000,
                order_makan: []
            }
        }
    }

    componentDidMount(){
        const { navigation } = this.props
        const { params } = navigation.state
        const { book_depart, book_return, trn_status } = params
        this.setState({pax_data_depart : setPaxSeats(book_depart.pax_num, book_depart.pax_name, book_depart.seat) ,pax_data_return : book_return ? setPaxSeats(book_return.pax_num, book_return.pax_name, book_return.seat) :[]})
        console.log('<<< book_depart >>>')
        console.log(book_depart)

        console.log('<<< book_return >>>')
        console.log(book_return)
    }

    checkOutAction() {
        const { navigation } = this.props
        const { params } = navigation.state
        const { book_depart, book_return } = params
        this.setState({ loading: true })
        JSONGetFile(getURLTrain('check_out', { type: book_return ? 'round-trip' : 'one-way', depBookCode: book_depart.book_code, retBookCode: book_return ? book_return.book_code : '' }), null).then((responses) => {
            console.log(responses)
            this.setState({ loading: true }, () => {
                switch (responses.err_code) {
                    case 0:
                        JSONPostFile(getURLTrain('padipay'), {
                            transaction_code: responses.transaction_code,
                            languageVer: 'ID'
                        }).then((Respone) => {
                            console.log(Respone)
                            switch (Respone.err_code) {
                                case 0:
                                    this.setState({ loading: false }, () => {
                                        this.props.navigation.navigate('TrainPayment', { DataJson: Respone })
                                    })
                                    break
                                default:
                                    this.setState({ loading: false })
                                    break;
                            }
                        }).catch((err) => {
                            console.log('err >> ' + err)
                            this.setState({ loading: false}, () =>{
                                Alert(STRING.Warrning.no_connection)
                            })
                        })
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

    ActivityResult = (value) => {
        let {pax_data_depart,pax_data_return} = this.state
        console.log(value)
        switch (value.slug) {
            case 'pass_dept':
            this.setState({pax_data_depart : value.data, pax_data_return : value.data_return ? value.data_return : [] })
            break;
        }
        
    }

    backAndroid() {
        const { params } = this.props.navigation.state;
        if (params.slug === 'history') {
            this.props.navigation.dispatch(finish)
        } else {
            this.CancelConfirmation()
           
        }
        return true
    }

    render() {
        const { navigation } = this.props
        const { params } = navigation.state
        const { book_depart, book_return, trn_status, pax_list} = params
        let {pax_data_depart,pax_data_return} = this.state
        const ComponentView = _OS(KeyboardAvoidingView, View)
        return (
            <ComponentView style={s.container} behavior='padding'>
                <Toolbar
                    arrow_back
                    onPress={() => this.backAndroid() }>
                    <View>
                        <Text style={s.toolbar_title}>Detail Pemesanan</Text>
                    </View>
                </Toolbar>
                <ScrollView keyboardShouldPersistTaps='always'>
                    <View style={s.section_}>
                        <CardSortTrain
                             alldetil
                             onPress = {() => navigation.navigate('QrCode', {book_code: book_depart.book_code})}
                            onPressDetil = {() => navigation.navigate('TrainDetail', {data: book_depart, title : 'Kereta Pergi'})}
                            title       = {STRING.Label.org_train}
                            route       ={book_depart.org + ' - ' + book_depart.des}
                            date        ={moment(book_depart.dep_date, 'YYYYMMDD').format('dddd, DD MMM YYYY')}
                            train_name  ={book_depart.train_name + ' - ' + book_depart.train_no}/>

                        {book_return && <CardSortTrain
                            alldetil
                            onPress = {() => navigation.navigate('QrCode', {book_code: book_return.book_code})}
                            onPressDetil = {() => navigation.navigate('TrainDetail', {data: book_return, title : 'Kereta Pulang'})}
                            title       ={STRING.Label.dep_train}
                            route       ={book_return.org + ' - ' + book_return.des}
                            date        ={moment(book_return.dep_date, 'YYYYMMDD').format('dddd, DD MMM YYYY')}
                            train_name  ={book_return.train_name + ' - ' +  book_return.train_no}/>}
                    </View>


                    <View style={s.section_}>
                        <Text style={[s.title_section]}>Passenger</Text>
                        <View style={{ flexDirection: 'row' }}>
                            <View >
                                { 
                                    pax_data_depart &&
                                    pax_data_depart.map((item, index) => (
                                        <View>
                                            <CardShortPax
                                                key={index}
                                                index={index + 1}
                                                name={item.name}
                                                num_id={item.identity ? item.identity : Function.FormeteDate(item.brith_date, 'YYYYMMDD', 'DD MMMMM YYYY') }
                                                org ={book_depart.org_code + ' - ' + book_depart.des_code + (book_return ? '\n' + book_depart.des_code + ' - ' + book_depart.org_code : '' )}
                                                seat = {item.identity ?item.seat + (book_return ?'\n' +pax_data_return[index].seat : '' ) : item.seat + (book_return ?pax_data_return[index].seat : '' )}
                                                birthday={item.birthday} />
                                        </View>


                                    ))
                                }
                            </View>

                            {/* {<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                
                                <Touchable onPress={() => navigation.navigate('TrainSeatSelection', { data: book_depart, data_return : book_return, data_seat_return :pax_data_return , data_seat: pax_data_depart, ActivityResult: this.ActivityResult, slug: 'pass_dept' })}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{
                                            backgroundColor: Colors.transparent,
                                            borderColor: Colors.pizzaz,
                                            borderWidth: Scale(1),
                                            paddingHorizontal: Scale(8),
                                            paddingVertical: Scale(2),
                                            borderRadius: Scale(3),
                                        }}>
                                            <Text style={{ color: Colors.pizzaz }}>Pindah Kursi</Text>
                                        </View>
                                    </View>
                                </Touchable>
                            </View>} */}
                        </View>
                    </View>

                   {/* { book_return && 
                   <View style={s.section_}>
                        <Text style={[s.title_section]}>Passanger Pulang</Text>
                        <View style={{ flexDirection: 'row' }}>
                        <View >
                        {pax_data_return && pax_data_return.map((item, index) => (
                            <CardShortPax
                            // onPressChangeSeat = {!params.slug ? () => navigation.navigate('TrainSeatSelection',{data: book_return, seat : item.seat, name : item.name, ActivityResult: this.ActivityResult, slug : 'pass_ret'}) : null}
                            onPressChangeSeat = {!params.slug ? () => navigation.navigate('TrainSeatSelection',{data: book_return, seat : item.seat, name : item.name, ActivityResult: this.ActivityResult, slug : 'pass_ret'}) : null}
                                key={index}
                                index={index + 1}
                                name={item.name }
                                num_id={item.seat}
                                birthday={item.birthday} />
                        ))}
                        </View >

                        {<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                
                                <Touchable onPress={() => navigation.navigate('TrainSeatSelection', { data: book_return,  data_seat: pax_data_return, ActivityResult: this.ActivityResult, slug: 'pass_ret' })}>
                                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{
                                            backgroundColor: Colors.transparent,
                                            borderColor: Colors.pizzaz,
                                            borderWidth: Scale(1),
                                            paddingHorizontal: Scale(8),
                                            paddingVertical: Scale(2),
                                            borderRadius: Scale(3),
                                        }}>
                                            <Text style={{ color: Colors.pizzaz }}>Pindah Kursi</Text>
                                        </View>
                                    </View>
                                </Touchable>
                            </View>}


                    </View>
                    </View>} */}

                    <View style={s.section_}>
                        <Text style={s.title_section}>{STRING.Passanger.payment_go}</Text>
                        {(Function.ObjectNull(book_depart, 'num_pax_adult') && Function.ObjectNull(book_depart, 'num_pax_adult') !== 0) && <View style={[{ flex: 1, flexDirection: 'row' }]}>
                                <Text style={[s.title_section, { color: Colors.black, flex: 2, paddingVertical: Scale(0), }]} ellipsize>{STRING.Passanger.adult + ' (' + book_depart.num_pax_adult + 'x)'}</Text>
                                <Text style={[s.title_section, { color: Colors.black, flex: 1, textAlign: 'right', paddingVertical: Scale(0), }]}>{'IDR ' + Function.convertToPrice(book_depart.price_adult)}</Text>
                            </View>}

                            
                            {Function.ObjectNull(book_depart, 'num_pax_child') !== 0 && <View style={[{ flex: 1, flexDirection: 'row' }]}>
                                <Text style={[s.title_section, { color: Colors.black, flex: 2, paddingVertical: Scale(0), }]} ellipsize>{STRING.Passanger.child + ' (' + book_depart.num_pax_child + 'x)'}</Text>
                                <Text style={[s.title_section, { color: Colors.black, flex: 1, textAlign: 'right', paddingVertical: Scale(0), }]}>{'IDR ' + (book_depart.price_child !== 0 ? Function.convertToPrice(book_depart.price_child) : 0)}</Text>
                            </View>}

                            {Function.ObjectNull(book_depart, 'num_pax_infant') !== 0 && <View style={[{ flex: 1, flexDirection: 'row' }]}>
                                <Text style={[s.title_section, { color: Colors.black, flex: 2, paddingVertical: Scale(0), }]} ellipsize>{STRING.Passanger.infant + ' (' + book_depart.num_pax_infant + 'x)'}</Text>
                                <Text style={[s.title_section, { color: Colors.black, flex: 1, textAlign: 'right', paddingVertical: Scale(0), }]}>{'IDR ' + (book_depart.price_infant !== 0 ? Function.convertToPrice(book_depart.price_infant) : 0)}</Text>
                            </View>}

                            {Function.ObjectNull(book_depart, 'admin_fee') !== 0 && <View style={[{ flex: 1, flexDirection: 'row' }]}>
                            <Text style={[s.title_section, { color: Colors.black, flex: 2, paddingVertical: Scale(0), }]} ellipsize>{'Convenience Fee'}</Text>
                            <Text style={[s.title_section, { color: Colors.black, flex: 1, textAlign: 'right', paddingVertical: Scale(0), }]}>{'IDR ' + (book_depart.admin_fee !== 0 ? Function.convertToPrice(book_depart.admin_fee) : 0)}</Text>
                        </View>}

                        {Function.ObjectNull(book_depart, 'discount') !== 0 && <View style={[{ flex: 1, flexDirection: 'row' }]}>
                            <Text style={[s.title_section, { color: Colors.black, flex: 2, paddingVertical: Scale(0), }]} ellipsize>{'Discount Channel'}</Text>
                            <Text style={[s.title_section, { color: Colors.black, flex: 1, textAlign: 'right', paddingVertical: Scale(0), }]}>{'IDR ' + (book_depart.discount !== 0 ? Function.convertToPrice(book_depart.discount) : 0)}</Text>
                        </View>}
                    </View>

                    {/* ================================== */}
                    {book_return && <View style={[s.section_,{marginLeft : Scale(16), marginRight : Scale(16)}]}>
                        <Text style={[s.title_section, {paddingHorizontal: 0 }]}>{STRING.Passanger.payment_back}</Text>

                        {(Function.ObjectNull(book_return, 'num_pax_adult') && Function.ObjectNull(book_return, 'num_pax_adult') !== 0) && <View style={[{ flex: 1, flexDirection: 'row' }]}>
                            <Text style={[s.title_section, { color: Colors.black, flex: 2, paddingVertical: Scale(0), paddingHorizontal: 0 }]} ellipsize>{STRING.Passanger.adult + ' (' + book_return.num_pax_adult + 'x)'}</Text>
                            <Text style={[s.title_section, { color: Colors.black, flex: 1, textAlign: 'right', paddingVertical: Scale(0), paddingHorizontal: 0 }]}>{'IDR ' + (params.slug === 'history' ? Function.convertToPrice(book_return.price_adult * book_return.num_pax_adult) : Function.convertToPrice(book_return.price_adult))}</Text>
                        </View>}


                        {Function.ObjectNull(book_return, 'num_pax_child') !== 0 && <View style={[{ flex: 1, flexDirection: 'row' }]}>
                            <Text style={[s.title_section, { color: Colors.black, flex: 2, paddingVertical: Scale(0), paddingHorizontal: 0 }]} ellipsize>{STRING.Passanger.child + ' (' + book_return.num_pax_child + 'x)'}</Text>
                            <Text style={[s.title_section, { color: Colors.black, flex: 1, textAlign: 'right', paddingVertical: Scale(0), paddingHorizontal: 0 }]}>{'IDR ' + Function.convertToPrice(book_return.price_child)}</Text>
                        </View>}

                        {Function.ObjectNull(book_return, 'num_pax_infant') !== 0 && <View style={[{ flex: 1, flexDirection: 'row' }]}>
                            <Text style={[s.title_section, { color: Colors.black, flex: 2, paddingVertical: Scale(0), paddingHorizontal: 0 }]} ellipsize>{STRING.Passanger.infant + ' (' + book_return.num_pax_infant + 'x)'}</Text>
                            <Text style={[s.title_section, { color: Colors.black, flex: 1, textAlign: 'right', paddingVertical: Scale(0), paddingHorizontal: 0 }]}>{'IDR ' + Function.convertToPrice(book_return.price_infant)}</Text>
                        </View>}

                        {Function.ObjectNull(book_return, 'admin_fee') !== 0 && <View style={[{ flex: 1, flexDirection: 'row' }]}>
                            <Text style={[s.title_section, { color: Colors.black, flex: 2, paddingVertical: Scale(0), paddingHorizontal: 0 }]} ellipsize>{'Convenience Fee'}</Text>
                            <Text style={[s.title_section, { color: Colors.black, flex: 1, textAlign: 'right', paddingVertical: Scale(0), paddingHorizontal: 0}]}>{'IDR ' + Function.convertToPrice(book_return.admin_fee)}</Text>
                        </View>}

                        {Function.ObjectNull(book_return, 'discount') !== 0 && <View style={[{ flex: 1, flexDirection: 'row' }]}>
                            <Text style={[s.title_section, { color: Colors.black, flex: 2, paddingVertical: Scale(0), paddingHorizontal: 0 }]} ellipsize>{'Discount Channel'}</Text>
                            <Text style={[s.title_section, { color: Colors.black, flex: 1, textAlign: 'right', paddingVertical: Scale(0), paddingHorizontal: 0 }]}>{'IDR ' + Function.convertToPrice(book_return.discount)}</Text>
                        </View>}

                        

                    </View>}

                    <View
                        style={[s.section_, { flexDirection: 'row' , marginLeft : Scale(16), marginRight : Scale(16)}]}>
                        <Text style={[s.title_section, { color: Colors.black, fontSize: Scale(18), paddingHorizontal: 0}]}>{'Total'}</Text>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={[s.title_section, { color: Colors.tangerine, fontSize: Scale(18), paddingHorizontal: 0 }]}>{book_return ? 'IDR ' + Function.convertToPrice(parseInt(book_depart.booking_cost_all) + parseInt(book_return.booking_cost_all)) : 'IDR ' + Function.convertToPrice(parseInt(book_depart.booking_cost_all))}</Text>
                        </View>
                    </View>
                    { (trn_status !== 'P' && trn_status !== 'C' && trn_status !== 'X' && trn_status !== 'Y') &&<View>
                    {!params.slug && <Touchable onPress={() => navigation.navigate('TrainSeatSelection', { data: book_depart, data_return: book_return, data_seat_return: pax_data_return, data_seat: pax_data_depart, ActivityResult: this.ActivityResult, slug: 'pass_dept' })}>
                        <View style={{ flex: 1, alignItems: 'center', marginVertical: Scale(16) }}>
                            <Text style={{ fontSize: Scale(16), color: Colors.blue }}>Select Seat</Text>
                        </View>
                    </Touchable>}

                      <Button onPress={() => this.checkOutAction()}>
                        {STRING.Label.more}
                    </Button>
                    
                </View>}


                </ScrollView>
                <Loading
                    text={'Harap tunggu sedang menyiapkan halaman'}
                    visible={this.state.loading}
                />
            </ComponentView>
        )
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

AppRegistry.registerComponent("padiciti", () => TrainReview);
