import React, { Component } from 'react'
import {
    AppRegistry,
    View,
    StyleSheet,
    ScrollView,
    Animated,
    AsyncStorage
} from 'react-native'
import moment from 'moment'
import {
    TextView as Text,
    Toolbar,
    Icon,
    TrainRadio,
    TrainButton,
    TrainStepper,
    TrainForm,
    CardRecentSearch
} from '../../Components/'
import { Colors, Scale, getIcon, Metrics, _OS} from '../../Assets'
import { STRING_TR, Function, STRING, navigateTo } from '../../Utils';
import { AnimatedValue, toCapitalize } from '../../Utils/TrainUtils';

export default class TrainReservation extends Component {
    constructor(props) {
        super(props);
        this.state = {
            origination : ['GMR', 'Gambir'],
            destination : ['BD', 'Bandung'],
            pax_adult   : 1,
            pax_infant  : 0,
            type_trip   : 'roundtrip',
            depart_date : this.getDate('depart_date'),
            return_date : this.getDate('return_date'),
            animated    : new Animated.Value(0)
        }
    }

    getDate = (slug) => {
        switch (slug) {
            case 'depart_date': return moment(new Date()).format('YYYY-MM-DD')
            // case 'depart_date': return moment(new Date()).add(3, 'day').format('YYYY-MM-DD')
            case 'return_date': return moment(new Date()).add(3, 'day').format('YYYY-MM-DD')
        }
    }

    setPax = (target, value) => {
        this.setState({[target]: value}, () => {
            if (this.state.pax_infant > this.state.pax_adult)
                this.setPax('pax_infant', this.state.pax_adult)
        })
    }

    ActivityResult = (data) => {
        let { navigation } = this.props
        switch (data.slug) {
            case 'origination': 
                return this.setState({origination: data.stationList})
            case 'destination': 
                return this.setState({destination: data.stationList})
            case 'depart_date':
                let {
                type_trip
            } = this.state

                this.setState({ depart_date: data.depart_date, return_date: moment(data.depart_date).add(2, 'day').format('YYYY-MM-DD') }, () => {
                    type_trip !== 'oneway' && this.props.navigation.navigate('TrainCalendar', { slug: 'return_date', type_trip, depart_date: data.depart_date, return_date: moment(data.depart_date).add(2, 'day').format('YYYY-MM-DD'), ActivityResult: this.ActivityResult })
                })
                break
            case 'return_date': 
                return this.setState({return_date: data.return_date }, () => {
                let range = moment(this.state.return_date, 'YYYY-MM-DD').diff(moment(this.state.depart_date, 'YYYY-MM-DD'), 'days')
                    range < 1 && this.setState({return_date: data.depart_date})
                })
        }
    }


    toggle_animate = () => {
        Animated.timing(this.state.animated,{ toValue: this.state.type_trip === 'roundtrip' ? 0 : 1,duration: 500 }).start()
    }

    reserveAction = () => {
        let pax_list = {
            type_trip   : this.state.type_trip,
            origination : this.state.origination,
            destination : this.state.destination,
            depart_date : this.state.depart_date,
            return_date : this.state.return_date,
            pax_adult   : this.state.pax_adult,
            pax_infant  : this.state.pax_infant,
        }

        if (this.state.type_trip === 'roundtrip') pax_list = {...pax_list, return_date: this.state.return_date }
        console.log("JSON STRINGIFY TYPE TRIP : "+JSON.stringify(pax_list))
        Function.SaveDataJson('SearchTrain1', Function.JsonString(pax_list))
        this.props.navigation.navigate('TrainScheduleDepart', { pax_list } )
    }

    componentDidMount() {
        AsyncStorage.getItem('SearchTrain1', (err, SearchTrain1) => {
            console.log("Search IJDK : "+ SearchTrain1)
            if (SearchTrain1 !== null) {
                let history_search = Function.JsonParse(SearchTrain1),
                range_today = moment(history_search.depart_date, 'YYYY-MM-DD').diff(moment(new Date()).format('YYYY-MM-DD'), 'days')

            // Change the depart_date if it's past from today
            history_search.depart_date = range_today >= 0 ? history_search.depart_date : moment(new Date()).format('YYYY-MM-DD')

            let range       = moment(history_search.return_date, 'YYYY-MM-DD').diff(moment(this.state.depart_date, 'YYYY-MM-DD'), 'days')
                
            this.setState({
                    origination : history_search.origination,
                    destination : history_search.destination,
                    pax_adult   : history_search.pax_adult,
                    pax_infant  : history_search.pax_infant,
                    type_trip   : history_search.type_trip,
                    depart_date : history_search.depart_date,
                    return_date : range < 1 ? moment(history_search.depart_date, 'YYYY-MM-DD').add('day', 1) : history_search.return_date,
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
                    onPress     ={() =>  navigateTo('HomeScreen' ,this.props.dispatch,this.props.navigation,null )}>
                    <Text style ={s.toolbar_title}>Kereta</Text>
                </Toolbar>
                <ScrollView  bounces={false} style={{ flex: 1 }}>
                    <View style={{ margin: Scale(16) }}>
                        <View style={{ flexDirection: 'row', marginVertical: Scale(8) }}>
                            <TrainRadio 
                                onPress     ={value => this.setState({ type_trip: value }, () => AnimatedValue(this.state.animated, 0))} 
                                currentValue={type_trip} 
                                value       ='oneway' 
                                text        ={STRING_TR.LABEL.ONEWAY} />
                            <TrainRadio 
                                onPress     ={value => this.setState({ type_trip: value }, () => AnimatedValue(this.state.animated, 1))} 
                                currentValue={type_trip} 
                                value       ='roundtrip' 
                                text        ={STRING_TR.LABEL.RETURN} />
                        </View>
                        <View>
                            <TrainForm
                                type        = {'option'}
                                label       = {'Kota Asal'}
                                value       = {(origination && toCapitalize(origination[1])) || null}
                                placeholder = {STRING.Label.org}
                                icon_left   = {'ic_train'}
                                onPress     = {() => { 
                                    navigation.navigate('TrainStationList', { slug: 'origination', ActivityResult: this.ActivityResult })
                                    }} />
                            <View>
                                <TrainForm
                                    type        = {'option'}
                                    label       = {STRING.Label.dep}
                                    value       = {(destination && toCapitalize(destination[1])) || null}
                                    placeholder = {STRING_TR.LABEL.ORG_PH}
                                    icon_left   = {'ic_train'}
                                    onPress     = {() => navigation.navigate('TrainStationList', { slug: 'destination', ActivityResult: this.ActivityResult })} />
                                <Icon size={'normal'} source={getIcon('ic_switch')} style={s.icon_switch} onPress={() => {
                                    [origination, destination] = [destination, origination]
                                    this.setState({origination, destination})
                                    }}/>
                            </View>
                        </View>

                        {/*  DATE SECTION */}
                        <TrainForm
                            type        = {'option'}
                            label       = {STRING_TR.LABEL.DEPART_DATE}
                            value       = {moment(depart_date).format('DD MMM YYYY')}
                            icon_left   = {'ic_calendar'}
                            onPress     = {() => navigation.navigate('TrainCalendar', { slug: 'depart_date', type_trip, depart_date, ActivityResult: this.ActivityResult })} />
                        <Animated.View style={{maxHeight: toggle_return, overflow: _OS('hidden',undefined), transform: [{ translateY: toggle_return2 }]}}>
                            <TrainForm
                                type        = {'option'}
                                label       = {STRING_TR.LABEL.RETURN_DATE}
                                value       = {moment(return_date).format('DD MMM YYYY')}
                                icon_left   = {'ic_calendar'}
                                onPress     = {() => navigation.navigate('TrainCalendar', { slug: 'return_date', type_trip, depart_date, return_date, ActivityResult: this.ActivityResult })} />
                        </Animated.View>

                        {/* PAX SECTION */}
                        <View style={{ flexDirection: 'row' }}>
                            <TrainStepper
                                label   = {STRING_TR.LABEL.PASSENGER.ADULT}
                                min     = {1}
                                max     = {4}
                                onPress = {value =>  this.setPax('pax_adult', value)}
                                value   = {pax_adult}
                                style   = {{ flex:1, marginRight: Scale(8)}}
                            />

                            <TrainStepper
                                label       = {STRING_TR.LABEL.PASSENGER.INFANT}
                                extra_label = {'(-2 thn)'}
                                min         = {0}
                                max         = {pax_adult}
                                onPress     = {value => this.setPax('pax_infant', value)}
                                value       = {pax_infant}
                                style       = {{ flex:1, marginRight: Scale(8)}}
                            />
                            <View style={{flex:1}}/> 
                        </View>
                    </View>
                    <TrainButton
                        onPress={() => this.reserveAction()} style={s.btn_reserve}>{STRING_TR.LABEL.BTN_SEARCH}</TrainButton>

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

AppRegistry.registerComponent("padiciti", () => TrainReservation);
