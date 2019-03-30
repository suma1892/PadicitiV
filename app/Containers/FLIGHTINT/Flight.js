import React, { Component } from 'react'
import {
    AsyncStorage,
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image, Platform, Text, Dimensions, AppRegistry, TouchableWithoutFeedback, TouchableNativeFeedback, TouchableOpacity, BackHandler
} from 'react-native'
import { Function, STRING, array, navigateTo } from '../../Utils'
import {CardRecentSearch, TextView, Colors, CalendarsScreen, Metrics, Container, getIcon, Toolbar, CardComponent, RadioButtons, FrameRadiusComponent, DialogComponent, Fonts } from '../../Components'
import Navbar from '../../Components/NavigationBottom'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import moment from 'moment'
const finish = NavigationActions.back({ key: "" });
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
export default class Flight extends Component {
    constructor(props) {
        super(props);
        this._onScroll = this._onScroll.bind(this)
        this.state = {
            scroll: null,
            depart_date : this.getDate('depart_date'),
            return_date : this.getDate('return_date'),
            params: [{ adult: 1 },
            { child: 0 },
            { infant: 0 },
            { depart_date: Function.FormeteDate(Function.get_today(),"YYYY-MM-DD", 'DD MMM YYYY')},
            { return_date: Function.FormeteDate(Function.get_next_two_today(Function.get_today()),"YYYY-MM-DD", 'DD MMM YYYY')},
            {
                depart: {
                    code: 'CGK',
                    title: 'Jakarta (CGK)',
                    sub_title: 'Soekarno Hatta',
                    group_code :'SJ-MZ-JT-GA-QG-SY-KD-QZ-IL-MV-RI-1B'
                },

            },
            {
                return: {
                    code: 'SIN',
                    title: 'Singapore (SIN)',
                    sub_title: 'Changi Airport',
                    group_code : 'SJ-JT-QZ-RI'
                },
            },
            { airlineGroup: null },
            { selectedItem: '' }],
            radioItems:
                [
                    {
                        label: STRING.Label.one_way,
                        slug: 'one-way',
                        size: 20,
                        color: '#dddddd',
                        color_lable: Colors.black,
                        selected: false
                    },

                    {
                        label: STRING.Label.round_trip,
                        slug: 'round-trip',
                        color: '#dddddd',
                        color_lable: Colors.black,
                        size: 20,
                        selected: true,
                    }
                ]
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
        this.state.radioItems.map((item) => {
            if (item.selected == true) {
                this.setState({ params: Function.OnchangesText(this.state.params, 8, item.slug) });
            }
            var windowHeight = Dimensions.get('window').height;
            if (windowHeight < 592) {
                this.setState({
                    scroll: true
                });
            } else {
                this.setState({
                    scroll: false
                });
            }
        });
        AsyncStorage.getItem('SearchFlightInt', (err, SearchFlight) => {
            if (SearchFlight !== null) {
                this.setState({ params: Function.JsonParse(SearchFlight) })
            }
        })
        AsyncStorage.getItem('TripFlightInt', (err, TripFlight) => {
            if (TripFlight !== null) {
                this.setState({ radioItems: Function.JsonParse(TripFlight) })
            }
        })
    }

    backAndroid() {
        navigateTo('HomeScreen' ,this.props.dispatch,this.props.navigation,null )
        // this.props.navigation.dispatch(finish)
        return true
    }
    getDate = (slug) => {
        switch (slug) {
            case 'depart_date': return moment(new Date()).format('YYYY-MM-DD')
            // case 'depart_date': return moment(new Date()).add(3, 'day').format('YYYY-MM-DD')
            case 'return_date': return moment(new Date()).add(3, 'day').format('YYYY-MM-DD')
        }
    }
    ActivityResult = (data) => {
        switch (data.slug) {
            case 'depart_date':
                var value_depart_date =  Function.FormeteDate(data.depart_date,"YYYY-MM-DD", 'DD MMM YYYY')
                var value_return_date = Function.FormeteDate(Function.get_next_two_today(Function.FormeteDate(value_depart_date,"DD MMM YYYY", 'YYYY-MM-DD')),"YYYY-MM-DD", 'DD MMM YYYY')
                this.setState({ params: Function.OnchangesText(this.state.params,3, value_depart_date) }, () => {
                    this.setState({ params: Function.OnchangesText(this.state.params, 4, value_return_date) }, ()=>{
                        this.state.params[8].selectedItem === 'round-trip' && this.props.navigation.navigate('TrainCalendar', { depart_date: this.state.depart_date, return_date: this.state.return_date, slug: 'return_date', ActivityResult: this.ActivityResult })
                    })
                })
                break
            case 'return_date':
                var value_return_date =  Function.FormeteDate(data.return_date,"YYYY-MM-DD", 'DD MMM YYYY')
                this.setState({ params: Function.OnchangesText(this.state.params, 4, value_return_date) })
                break
            case 'depart':
                var value_depart = data.data
                this.setState({ params: Function.OnchangesText(this.state.params, 5, value_depart) })
                break
            case 'return':
                var value_return = data.data
                console.log('value_return')
                console.log(value_return)
                this.setState({ params: Function.OnchangesText(this.state.params, 6, value_return) })
                break
            case 'schedule':
            AsyncStorage.getItem('SearchFlightInt', (err, SearchFlight) => {
                if (SearchFlight !== null) {
                    this.setState({ params: Function.JsonParse(SearchFlight) })
                }
            })
            break
        }
    }
    _onScroll(e) {
        this.setState({
            scroll: Function.onScroll(e)
        });
    }

    changeActiveRadioButton(index) {
        this.state.radioItems.map((item) => {
            item.selected = false;
        });

        this.state.radioItems[index].selected = true;

        this.setState({ radioItems: this.state.radioItems }, () => {
            this.setState({ params: Function.OnchangesText(this.state.params, 8, this.state.radioItems[index].slug) });
        });
    }

    Calculate(value) {
        switch (value) {
            case 'adult_plus':
                switch (true) {
                    case this.state.params[0].adult <= 3:
                        var value = this.state.params[0].adult + 1
                        this.setState({ params: Function.OnchangesText(this.state.params, 0, value) })
                        break;
                }
                break
            case 'child_plus':
                switch (true) {
                    case this.state.params[1].child <= 3:
                        var value = this.state.params[1].child + 1
                        this.setState({ params: Function.OnchangesText(this.state.params, 1, value) })
                        break;
                }
                break
            case 'infant_plus':
                switch (true) {
                    case this.state.params[2].infant <= 3:
                        var valueInfant = this.state.params[2].infant + 1
                        this.setState({ params: Function.OnchangesText(this.state.params, 2, valueInfant) }, () => {
                            var valueAdult = this.state.params[2].infant > this.state.params[0].adult ? this.state.params[0].adult + 1 : this.state.params[0].adult
                            this.setState({ params: Function.OnchangesText(this.state.params, 0, valueAdult) })
                        })

                        break;
                }
                break
            case 'adult_minus':
                switch (true) {
                    case this.state.params[0].adult !== 1:
                        var valueAdult = this.state.params[0].adult - 1
                        this.setState({ params: Function.OnchangesText(this.state.params, 0, valueAdult) }, () => {
                            var valueInfant = this.state.params[2].infant !== 0 ? this.state.params[2].infant - 1 : this.state.params[2].infant
                            this.setState({ params: Function.OnchangesText(this.state.params, 2, valueInfant) })
                        })
                        break;
                }
                break
            case 'child_minus':
                switch (true) {
                    case this.state.params[1].child !== 0:
                        var value = this.state.params[1].child - 1
                        this.setState({ params: Function.OnchangesText(this.state.params, 1, value) })
                        break;
                }
                break
            case 'infant_minus':
                switch (true) {
                    case this.state.params[2].infant !== 0:

                        var valueMinusInfant = this.state.params[2].infant - 1
                        this.setState({ params: Function.OnchangesText(this.state.params, 2, valueMinusInfant) }, () => {
                            var valueMinusAdult = this.state.params[0].adult === 1 ? this.state.params[0].adult : this.state.params[0].adult - 1
                            this.setState({ params: Function.OnchangesText(this.state.params, 0, valueMinusAdult) })
                        })
                        break;
                }
                break
        }
    }

    switch() {
        var Depart = this.state.params[5].depart
        var valueDepart = this.state.params[5].depart = this.state.params[6].return
        this.setState({ params: Function.OnchangesText(this.state.params, 5, valueDepart) }, () => {
            var valueReturn = this.state.params[6].return = Depart
            this.setState({ params: Function.OnchangesText(this.state.params, 6, valueReturn) })
        })
    }

    action() {
        Function.SaveDataJson('SearchFlightInt', Function.JsonString(this.state.params))
        Function.SaveDataJson('TripFlightInt', Function.JsonString(this.state.radioItems))
        this.props.navigation.navigate('ScheduleFlightINT', { parameter: this.state.params, ActivityResult : this.ActivityResult })
    }
    render() {
        const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
        let { navigation } = this.props
        return (

            <View style={{ flex: 1, backgroundColor: Colors.white }} >
                <Toolbar
                    arrow_back
                    onPress={() => this.backAndroid()}
                    View={
                        <TextView style={styles.title}>Pesawat Internasional</TextView>
                    }
                />
                <ScrollView
                    onScroll={this._onScroll}>
                    <View >

                        <View style={{ flexDirection: 'row', margin: Metrics.normalPadding }}>
                            {this.state.radioItems.map((item, key) =>
                                (
                                    <View style={{ marginRight: Metrics.normalPadding }}
                                    key ={key}>
                                        <RadioButtons key={key} button={item} onClick={this.changeActiveRadioButton.bind(this, key)} />
                                    </View>
                                ))}
                        </View>

                        <View style={{ marginLeft: Metrics.normalPadding, marginRight: Metrics.normalPadding }}>
                            <TextView style={styles.lable}>{STRING.Label.org}</TextView>

                            <FrameRadiusComponent
                                View={
                                    <TouchableComponent style={styles.touchable}
                                        onPress={() => this.props.navigation.navigate('AirportList', { slug: 'depart', ActivityResult: this.ActivityResult })} >
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <Image
                                                style={[styles.flightFrom]}
                                                resizeMethod='scale'
                                                source={getIcon('ic_flight_from')}
                                            />
                                            <TextView style={styles.lable_value}>{this.state.params[5].depart.title}</TextView>
                                        </View>
                                    </TouchableComponent>
                                }
                            />
                        </View>
                        <View style={{ marginTop: Scale(6), marginRight: Scale(16) }}>
                            <TouchableComponent style={styles.touchable}
                                onPress={() => this.switch()} >
                                <View style={{ position: 'absolute', alignSelf: 'flex-end', paddingLeft: 18 }}>

                                    <Image
                                        style={[styles.switch]}
                                        resizeMethod='scale'
                                        source={getIcon('ic_switch')}
                                    />

                                </View>
                            </TouchableComponent>
                        </View>


                        <View style={{ marginTop: Scale(14), marginLeft: Scale(16), marginRight: Scale(16) }}>
                            <TextView style={styles.lable}>{STRING.Label.dep}</TextView>

                            <FrameRadiusComponent
                                View={
                                    <TouchableComponent style={styles.touchable}
                                        onPress={() => this.props.navigation.navigate('AirportListINT', { slug: 'return', ActivityResult: this.ActivityResult })}>
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <Image
                                                style={[styles.flightFrom]}
                                                resizeMethod='scale'
                                                source={getIcon('ic_flight_return')}
                                            />
                                            <TextView style={styles.lable_value}>{this.state.params[6].return.title}</TextView>
                                        </View>
                                    </TouchableComponent>
                                }
                            />
                        </View>

                        <View style={{ marginTop: Scale(14), marginLeft: Scale(16), marginRight: Scale(16) }}>
                            <TextView style={styles.lable}>{STRING.Label.org_date}</TextView>

                            <FrameRadiusComponent
                                View={
                                    <TouchableComponent style={styles.touchable}
                                    onPress     = {() => navigation.navigate('TrainCalendar', { slug: 'depart_date', type_trip:"oneway", depart_date:this.state.depart_date, ActivityResult: this.ActivityResult })} >
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <Image
                                                style={[styles.flightFrom]}
                                                resizeMethod='scale'
                                                source={getIcon('ic_calendar')}
                                            />
                                            <TextView style={styles.lable_value_calendar}>{this.state.params[3].depart_date}</TextView>
                                        </View>
                                    </TouchableComponent>
                                }
                            />
                        </View>

                        {this.state.params[8].selectedItem === 'round-trip' && <View style={{ marginTop: Scale(14), marginLeft: Scale(14), marginRight: Scale(14) }}>
                            <TextView style={styles.lable}>{STRING.Label.dep_date}</TextView>

                            <FrameRadiusComponent
                                View={
                                    <TouchableComponent style={styles.touchable}
                                    onPress     = {() => navigation.navigate('TrainCalendar', { slug: 'return_date', type_trip: "roundtrip", depart_date:this.state.depart_date, return_date:this.state.return_date, ActivityResult: this.ActivityResult })} >
                                        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
                                            <Image
                                                style={[styles.flightFrom]}
                                                resizeMethod='scale'
                                                source={getIcon('ic_calendar')}
                                            />
                                            <TextView style={styles.lable_value_calendar}>{this.state.params[4].return_date}</TextView>
                                        </View>
                                    </TouchableComponent>
                                }
                            />
                        </View>}

                        <View style={{ flexDirection: 'row', }}>

                            <View style={{ flex: 1, marginTop: Scale(14), marginLeft: Scale(16), width: Scale(90), }}>
                                <TextView style={styles.lable}>{STRING.Label.adult}</TextView>

                                <FrameRadiusComponent
                                    View={

                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <TouchableComponent style={styles.touchable}
                                                onPress={() => this.Calculate('adult_minus')} >
                                                <Image
                                                    style={[styles.plus_minus]}
                                                    resizeMethod='scale'
                                                    source={getIcon('ic_minus')}
                                                />
                                            </TouchableComponent>

                                            <TextView style={styles.lableNumber}>{this.state.params[0].adult}</TextView>

                                            <TouchableComponent style={styles.touchable}
                                                onPress={() => this.Calculate('adult_plus')} >
                                                <Image
                                                    style={[styles.plus_minus]}
                                                    resizeMethod='scale'
                                                    source={getIcon('ic_plus')}
                                                />
                                            </TouchableComponent>
                                        </View>
                                    }
                                />
                            </View>

                            <View style={{ flex: 1, marginTop: Scale(14), marginLeft: Scale(8), marginRight: Scale(8), }}>
                                <TextView style={styles.lable}>{STRING.Label.child}</TextView>

                                <FrameRadiusComponent
                                    View={

                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <TouchableComponent style={styles.touchable}
                                                onPress={() => this.Calculate('child_minus')} >
                                                <Image
                                                    style={[styles.plus_minus]}
                                                    resizeMethod='scale'
                                                    source={getIcon('ic_minus')}
                                                />
                                            </TouchableComponent>

                                            <TextView style={styles.lableNumber}>{this.state.params[1].child || '0'}</TextView>

                                            <TouchableComponent style={styles.touchable}
                                                onPress={() => this.Calculate('child_plus')} >
                                                <Image
                                                    style={[styles.plus_minus]}
                                                    resizeMethod='scale'
                                                    source={getIcon('ic_plus')}
                                                />
                                            </TouchableComponent>
                                        </View>
                                    }
                                />
                            </View>

                            <View style={{ flex: 1, marginTop: Scale(14), marginRight: Scale(16), width: Scale(90), }}>
                                <TextView style={styles.lable}>{STRING.Label.infant}</TextView>

                                <FrameRadiusComponent
                                    View={

                                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                            <TouchableComponent style={styles.touchable}
                                                onPress={() => this.Calculate('infant_minus')} >
                                                <Image
                                                    style={[styles.plus_minus]}
                                                    resizeMethod='scale'
                                                    source={getIcon('ic_minus')}
                                                />
                                            </TouchableComponent>

                                            <TextView style={styles.lableNumber}>{this.state.params[2].infant || '0'}</TextView>

                                            <TouchableComponent style={styles.touchable}
                                                onPress={() => this.Calculate('infant_plus')} >
                                                <Image
                                                    style={[styles.plus_minus]}
                                                    resizeMethod='scale'
                                                    source={getIcon('ic_plus')}
                                                />
                                            </TouchableComponent>
                                        </View>
                                    }
                                />
                            </View>
                        </View>

                        <TouchableComponent
                           
                            onPress={() => this.action()} >
                            <View style={styles.button}>
                                <TextView style={styles.TextButton}>{STRING.Label_Flight.search}</TextView>
                            </View>
                        </TouchableComponent>

                        {/* <View style ={{padding : Scale(16)}}>
                            <TextView style={{color : Colors.black}}>{STRING.Label.recent_Search}</TextView>
                            <CardRecentSearch
                                onPress={() => console.log('')}
                                destination={'Bali (DPS) - Singapore (SIN)'}
                                date={'13 November 2018'}
                                guest={'1 Dewasa, 1 Anak, 1 Bayi'}
                            />
                        </View> */}
                    </View>

                </ScrollView>
                {this.state.scroll && <View style={{
                    left: 0,
                    right: 0,
                    bottom: Scale(4),
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>

                    <View style={{ flex: 1, marginBottom: Scale(4) }}>
                        <Image
                            style={[styles.img_scroll_more]}
                            resizeMethod='scale'
                            source={getIcon('ic_scroll_more')}
                        />
                        {/* <Text style={[styles.allPromos]}>MORE</Text> */}
                    </View>
                </View>}


            </View>
        );
    }
}

const styles = StyleSheet.create({
    lable: {
        alignItems: 'center',
        fontSize: Scale(12),
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: "#6b7c93"
    },
    switch: {
        width: Scale(25),
        height: Scale(25),
    },
    touchable: {
        flex: 1,

    }, flightFrom: {
        marginRight: Metrics.normalPadding,
        marginLeft: Scale(8),
        resizeMode: 'contain',
        width: Scale(21.8),
        height: Scale(20)
    }, flightreturn: {
        marginRight: Metrics.normalPadding,
        marginLeft: Scale(8),
        width: Scale(21.8),
        height: Scale(20)
    }, lable_value: {
        height: Scale(20),
        fontSize: Metrics.font.regular,
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: Colors.warm_grey
    }
    , lable_value_calendar: {
        height: Scale(20),
        fontSize: Metrics.font.regular,
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: '#222222'
    },
    lableNumber: {
        fontSize: Metrics.font.regular,
        marginRight: Metrics.normalPadding,
        marginLeft: Metrics.normalPadding,
        alignItems: 'center',
        fontWeight: "600",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: "#222222"
    },
    plus_minus: {
        resizeMode: 'contain',

        width: Scale(20),
        height: Scale(20)
    },
    button: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Scale(16),
        marginLeft: Scale(16),
        marginTop: Scale(16),
        height: Scale(45),
        borderRadius: Scale(4),
        backgroundColor: Colors.tangerine
    }, TextButton: {
        fontSize: Fonts.size.large,
        fontWeight: "bold",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: Colors.white
    }, title: {
        height: Scale(25),
        fontSize: Scale(18),
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: "#ffffff"
    },
    img_scroll_more: {
        width: Scale(70),
        height: Scale(20)
    },
});
AppRegistry.registerComponent("padiciti", () => Flight);
