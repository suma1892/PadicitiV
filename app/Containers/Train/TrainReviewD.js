import React, { Component } from 'react'
import {
    AppRegistry,
    View,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
} from 'react-native'
import {
    TextView as Text,
    Toolbar,
    Scale,
    Colors,
    Fonts,
    Button,
    Loading,
    Alert
} from '../../Components/'

import { CardSortTrain, CardShortPax } from '../../Components/TrainCardComponent';
import { _OS, Metrics } from '../../Assets';
import moment from 'moment';
import { setPaxSeats } from '../../Utils/TrainUtils';
import { STRING, Function } from '../../Utils/index';
import { getURLTrain } from '../../Services/API';
import { JSONPostFile, JSONGetFile } from '../../Services/JsonService';


export default class TrainReview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
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
                            this.setState({ loading: false })
                        })
                        break
                    default:
                        if (responses.err_msg) Alert(responses.err_msg)
                }
            })
        }).catch((errors) => {
            this.setState({ loading: false }, () => {
                console.log('error', errors)
            })
        })
    }

    render() {
        const { navigation } = this.props
        const { params } = navigation.state
        const { book_depart, book_return, trn_status } = params
        let pax_data = setPaxSeats(book_depart.pax_num, book_depart.pax_name, book_depart.seat)
        const ComponentView = _OS(KeyboardAvoidingView, View)
        return (
            <ComponentView style={s.container} behavior='padding'>
                <Toolbar
                    arrow_back
                    onPress={() => navigation.goBack()}>
                    <View>
                        <Text style={s.toolbar_title}>Detail Pemesanan</Text>
                    </View>
                </Toolbar>
                <ScrollView keyboardShouldPersistTaps='always'>
                    <View style={s.section_}>
                        <CardSortTrain
                            nodetail
                            title={'Kereta Pergi'}
                            bookCode={trn_status === 'Y' ? book_depart.book_code : null}
                            route={book_depart.org + ' - ' + book_depart.des}
                            date={moment(book_depart.dep_date, 'YYYYMMDD').format('dddd, DD MMM YYYY')}
                            train_name={book_depart.train_name + ' - ' + book_depart.train_no}
                            onPress={() => (trn_status === 'Y' ? this.props.navigation.navigate('qrcode', { book_code: book_depart.book_code }) : console.log('TEST'))}
                        />

                        {book_return && <CardSortTrain
                            nodetail
                            title={'Kereta Pulang'}
                            bookCode    ={trn_status === 'Y'  ?  book_return.book_code : null}
                            route={book_return.org + ' - ' + book_return.des}
                            date={moment(book_return.dep_date, 'YYYYMMDD').format('dddd, DD MMM YYYY')}
                            train_name={book_return.train_name + ' - ' + book_return.train_no}
                            onPress={() => (trn_status === 'Y' ? this.props.navigation.navigate('qrcode', { book_code: book_return.book_code }) : console.log('TEST'))}
                        />}
                    </View>


                    <View style={s.section_}>
                        <Text style={s.title_section}>Passanger</Text>
                        {pax_data && pax_data.map((item, index) => (
                            <CardShortPax
                                key={index}
                                index={index + 1}
                                name={item.name}
                                num_id={item.num_id}
                                birthday={item.birthday} />
                        ))}
                    </View>

                    <View style={s.section_}>
                        <Text style={s.title_section}>{STRING.Passanger.payment_title}</Text>
                        <View style={[{flex:1, flexDirection: 'row'}]}>
                            <Text style={[s.title_section, { color: Colors.black, flex: 2 }]} ellipsize>{book_depart.train_name + ' - ' + book_depart.train_no}</Text>
                            <Text style={[s.title_section, { color: Colors.black, flex: 1, textAlign: 'right', }]}>{'IDR ' + Function.convertToPrice(book_depart.booking_cost_all)}</Text>
                        </View>

                        {book_return && <View style={[{flex:1, flexDirection: 'row'}]}>
                            <Text style={[s.title_section, { color: Colors.black, flex: 2 }]} ellipsize>{book_return.train_name + ' - ' + book_return.train_no}</Text>
                            <Text style={[s.title_section, { color: Colors.black, flex: 1, textAlign: 'right', }]}>{'IDR ' + Function.convertToPrice(book_return.booking_cost_all)}</Text>
                        </View>}
                        {/* <View style={{ flexDirection: 'row', flex: 1, }}>
                            
                            <View style={{width:200}}>
                                <Text style={[s.title_section, { color: Colors.black }]} ellipsizeMode>{book_depart.train_name + ' - ' + book_depart.train_no}</Text>
                                {book_return && <Text style={[s.title_section, { color: Colors.black }]}  ellipsizeMode>{book_return.train_name + ' - ' + book_return.train_no}</Text>}
                            </View>
                            <View>
                                <View>
                                    <Text style={[s.title_section, { color: Colors.black }]}>{'IDR ' + Function.convertToPrice(book_depart.booking_cost_all)}</Text>
                                    {book_return && <Text style={[s.title_section, { color: Colors.black }]}>{'IDR ' + Function.convertToPrice(book_return.booking_cost_all)}</Text>}
                                </View>
                            </View>
                        </View> */}
                    </View>

                    <View
                        style={[s.section_, { flexDirection: 'row' }]}>
                        <Text style={[s.title_section, { color: Colors.black, fontSize: Scale(18), }]}>{'Total'}</Text>
                        <View style={{ flex: 1, alignItems: 'flex-end' }}>
                            <Text style={[s.title_section, { color: Colors.tangerine, fontSize: Scale(18), }]}>{book_return ? 'IDR ' + Function.convertToPrice(parseInt(book_depart.booking_cost_all) + parseInt(book_return.booking_cost_all)) : 'IDR ' + Function.convertToPrice(parseInt(book_depart.booking_cost_all))}</Text>
                        </View>
                    </View>

                    {(trn_status !== 'P' && trn_status !== 'C' && trn_status !== 'X' && trn_status !== 'Y' && trn_status !== 'FB') && <Button onPress={() => this.checkOutAction()}>
                        Selanjutnya
                    </Button>}

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
