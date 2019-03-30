import React, { Component } from 'react'
import {
    AppRegistry,
    View,
    StyleSheet,
    ScrollView,
    Dimensions,
    Animated,
    AsyncStorage,
    Text
} from 'react-native'
import moment from 'moment'
import {
    TextView,
    Toolbar,
    Icon,
    TrainRadio,
    TrainButton,
    TrainStepper,
    TrainForm,
    IJDKForm,
    CardRecentSearch
} from '../../Components'
// import { Scale, Colors, getIcon, Fonts, Metrics } from '../Assets'

// import TextView from '../../../App/Components/TextView'

import {Fonts, Colors, Scale, getIcon, Metrics, _OS} from '../../Assets'
import { STRING_TR, Function, STRING, navigateTo } from '../../Utils';
import { AnimatedValue, toCapitalize } from '../../Utils/TrainUtils';
import DatePicker from 'react-native-datepicker'
const { width, height } = Dimensions.get('window')
export default class IJDKReservation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            animated    : new Animated.Value(0),
            Adult:1,
            Child:0,
            EventDateStart: "2019-03-28",
            EventDateUntil:"2019-03-28",
            Infant:0,
            // date:"2019-03-15"
        }
    }

    getDate = (slug) => {
        switch (slug) {
            case 'EventDateStart': return moment(new Date()).format('YYYY-MM-DD')
            // case 'EventDateStart': return moment(new Date()).add(3, 'day').format('YYYY-MM-DD')
            case 'EventDateUntil': return moment(new Date()).add(3, 'day').format('YYYY-MM-DD')
        }
    }

    setPax = (target, value) => {
        this.setState({[target]: value}, () => {
            if (this.state.Child > this.state.Adult)
                this.setPax('Child', this.state.Adult)
        })
    }

    ActivityResult = (data) => {
        let { navigation } = this.props
        switch (data.slug) {
            case 'origination': 
                return this.setState({origination: data.stationList})
            case 'destination': 
                return this.setState({destination: data.stationList})
            case 'EventDateStart':
                let {
                type_trip
            } = this.state

                this.setState({ EventDateStart: data.EventDateStart, EventDateUntil: moment(data.EventDateStart).add(2, 'day').format('YYYY-MM-DD') }, () => {
                    type_trip !== 'oneway' && this.props.navigation.navigate('TrainCalendar', { slug: 'EventDateUntil', type_trip, EventDateStart: data.EventDateStart, EventDateUntil: moment(data.EventDateStart).add(2, 'day').format('YYYY-MM-DD'), ActivityResult: this.ActivityResult })
                })
                break
            case 'EventDateUntil': 
                return this.setState({EventDateUntil: data.EventDateUntil }, () => {
                let range = moment(this.state.EventDateUntil, 'YYYY-MM-DD').diff(moment(this.state.EventDateStart, 'YYYY-MM-DD'), 'days')
                    range < 1 && this.setState({EventDateUntil: data.EventDateStart})
                })
        }
    }


    toggle_animate = () => {
        Animated.timing(this.state.animated,{ toValue: this.state.type_trip === 'roundtrip' ? 0 : 1,duration: 500 }).start()
    }

    reserveAction = () => {
        let pax_list = {
            Adult: this.state.Adult,
            Child: this.state.Child,
            EventDateStart: this.state.EventDateStart,
            EventDateUntil: this.state.EventDateUntil,
            Infant: this.state.Infant,
        }
        if (this.state.type_trip === 'roundtrip') pax_list = {...pax_list, EventDateUntil: this.state.EventDateUntil }
        console.log("JSON STRINGIFY TYPE TRIP : "+JSON.stringify(pax_list))
        Function.SaveDataJson('SearchIJDK1', Function.JsonString(pax_list))
        this.props.navigation.navigate('IJDKSchedule', { pax_list } )

    }

    componentDidMount() {
        AsyncStorage.getItem('SearchIJDK1', (err, SearchIJDK1) => {
            console.log("Search IJDK : "+ SearchIJDK1)
            if (SearchIJDK1 !== null) {
                let history_search = Function.JsonParse(SearchIJDK1),
                range_today = moment(history_search.EventDateStart, 'YYYY-MM-DD').diff(moment(new Date()).format('YYYY-MM-DD'), 'days')
                history_search.EventDateStart = range_today >= 0 ? history_search.EventDateStart : moment(new Date()).format('YYYY-MM-DD')

            let range       = moment(history_search.EventDateUntil, 'YYYY-MM-DD').diff(moment(this.state.EventDateStart, 'YYYY-MM-DD'), 'days')
                
            this.setState({
                    Adult: history_search.Adult,
                    Child: 0,
                    EventDateStart: history_search.EventDateStart,
                    Infant: history_search.Infant,
                    EventDateUntil : range < 1 ? moment(history_search.EventDateStart, 'YYYY-MM-DD').add('day', 1) : history_search.EventDateUntil,
                }, () => {
                    this.state.type_trip === 'roundtrip' && AnimatedValue(this.state.animated, 1)
                })
            }
        })
    }
    

    render() {
        let { ActivityResult } = this
        let { navigation } = this.props
        let {
            Adult,
            Child,
            EventDateStart,
            // EventDateUntil: history_search.EventDateUntil,
            Infant,
            EventDateUntil
        } = this.state
        
        const toggle_return     = this.state.animated.interpolate({inputRange: [0, 1], outputRange: [0, Metrics.screenHeight] })
        const toggle_return2    = this.state.animated.interpolate({inputRange: [0, 1], outputRange: [0, 1] })

        // const toggle_return = AnimatedInter(this.state.animated, [0,1], [0,undefined])
        let { props } = this
        return (
            <View style={s.container} >
                <Toolbar
                    arrow_back
                    onPress     ={() =>  navigateTo('HomeScreen' ,this.props.dispatch,this.props.navigation,null )}>
                    <Text style ={s.toolbar_title}>Jet Ski</Text>
                </Toolbar>
                <ScrollView  bounces={false} style={{ flex: 1 }}>
                    <View style={{ margin: Scale(16) }}>
                        <View><Text  style={{color: 'grey',fontSize:30}}>Jadwal Event</Text></View>
                        <View><Text></Text></View>
                        {/*  DATE SECTION */}
                        <TextView style={s.stepper_label}>{"Tanggal Mulai Event"} {props.extra_label && <TextView style={s.extra_label}>{props.extra_label}</TextView>}</TextView>

                        <View style={s.item_box}>
                        <DatePicker
                            style={{borderWidth: 1,
                                flex:1,
                                borderColor: Colors.border,
                                padding: Scale(2),
                                alignItems: 'center'}}
                            date={moment(this.state.EventDateStart).format("DD MMM YYYY")}
                            mode="date"
                            format="DD MMM YYYY"
                            minDate= "28 MARET 2019"
                            maxDate="31 MARET 2019"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 5,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36,
                            
                            }
                            // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(EventDateStart) => {this.setState({EventDateStart: moment(EventDateStart).format("YYYY-MM-DD"),Child:0})}}
                        />
                        </View>
                        <View>
                        <Text>  </Text>
                        </View>
                        <TextView style={s.stepper_label}>{"Tanggal Selesai Event"} {props.extra_label && <TextView style={s.extra_label}>{props.extra_label}</TextView>}</TextView>
                        
                        <View style={s.item_box}>
                        <DatePicker
                            style={{borderWidth: 1,
                            flex:1,
                            borderColor: Colors.border,
                            padding: Scale(2),
                            alignItems: 'center'}}
                            date={moment(this.state.EventDateUntil).format("DD MMM YYYY")}
                            mode="date"
                            format="DD MMM YYYY"
                            minDate= {moment(this.state.EventDateStart).format("DD MMM YYYY")}
                            maxDate="31 MARET 2019"
                            confirmBtnText="Confirm"
                            cancelBtnText="Cancel"
                            customStyles={{
                            dateIcon: {
                                position: 'absolute',
                                left: 0,
                                top: 5,
                                marginLeft: 0
                            },
                            dateInput: {
                                marginLeft: 36,
                            
                            }
                            // ... You can check the source to find the other keys.
                            }}
                            onDateChange={(EventDateUntil) => {this.setState({EventDateUntil: moment(EventDateUntil).format("YYYY-MM-DD"),Child:0})}}
                        />
                        </View>
                        {/* PAX SECTION */}
                        <View style={{ flexDirection: 'row' }}>
                        <TrainStepper
                            label   = {"Peserta"}
                            min     = {1}
                            max     = {50}
                            onPress = {value =>  this.setPax('Adult', value)}
                            value   = {Adult}
                            style   = {{ flex:1, marginRight: Scale(8)}}
                        />
                        <View style={{flex:1}}/> 
                    </View>
                    </View>
                    <TrainButton
                        onPress={() => this.reserveAction()} style={s.btn_reserve}>{"Cari Tempat Duduk"}</TrainButton>

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
            </View>
        )
    }
}

const s = StyleSheet.create({
    stepper_label: {
        color: Colors.slate_gray,
        marginBottom: Scale(4),
        fontSize: Fonts.size.regular
    }, extra_label:{
        color: Colors.slate_gray,
        fontSize: Fonts.size.small
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    toolbar_title: {
        fontSize: Scale(18),
        color: 'white',
    },
    hairline: {
        backgroundColor: '#A2A2A2',
        height: 2,
        width: 165
      },
      
    icon_switch: {
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        top: -6,
        right: 0
    },iconArrowdown:{
        height:Metrics.icon.small,
        width: Metrics.icon.small
    },
    styleDropdown:{
        flexDirection:'row',
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Scale(4),
        paddingHorizontal: Metrics.padding.small,
    },
    dropdownTextStyle:{
        padding: Scale(8),
        color: 'red',
        fontSize: 27,
    },
    item_inputs:{
        flex: 1,
        paddingVertical: Scale(8),
        color: Colors.gray,
        fontSize: Fonts.size.regular,
    },
    drowdownStyle:{
        width : Metrics.screenWidth/1.2,
        height : Metrics.icon.large*1.55,
        borderWidth: Metrics.border,
        borderColor: Colors.border
    },
    containerDropdown:{
        // borderWidth: 1,
        // borderColor: Colors.border,
        // borderRadius: Scale(4),
        // paddingHorizontal: Metrics.padding.tiny,
        justifyContent: 'center',
        flex:1,
    },
    item_error:{
        color: Colors.red,
        fontStyle: 'italic'
    },  
    item_frame: {
        marginVertical: Scale(8),
    },
    item_label: {
        color: Colors.slate_gray,
        marginBottom: Scale(4),
        fontSize: Fonts.size.regular
    },
    item_label_input: {
        color: Colors.warm_grey,
        marginBottom: Scale(4),
        fontSize: Fonts.size.regular,
    },
    item_placeholder: {
        color: Colors.warm_grey,
        fontSize: Fonts.size.medium
    },
    item_placeholder_input: {
        color: Colors.black,
        fontSize: Fonts.size.medium
    },
    item_value: {
        fontSize: Fonts.size.medium
    },
    item_box: {
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Scale(4),
        backgroundColor: Colors.white,
        padding: Scale(8),
        flexDirection: 'row',
        alignItems: 'center'
    },
    item_box_input:{
        borderWidth: 1,
        borderColor: Colors.border,
        borderRadius: Scale(4),
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center'
    },
    item_input:{
        flex: 1,
        padding: Scale(8),
    },
    item_icon: {
        tintColor  : Colors.slate_gray,
        marginRight: Scale(8),
    },
});

AppRegistry.registerComponent("padiciti", () => IJDKReservation);
