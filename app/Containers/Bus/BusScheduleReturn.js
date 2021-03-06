import React, { Component } from 'react'
import {
    AppRegistry,
    View,
    StyleSheet,
    FlatList,
    ProgressBarAndroid,
    ProgressViewIOS,
    Platform
} from 'react-native'
import {
    TextView as Text, 
    Toolbar,
    Scale,
    Colors,
    Fonts,
    CardBus,
    Icon,
    getIcon,
    Touchable,
    Button,
    Modal,
    CardModalDate,
} from '../../Components/'
import { Metrics } from '../../Assets'
import { NavigationActions } from 'react-navigation';
import { JSONGetFile } from '../../Services/JsonService';
import { getURLBus } from '../../Services/API';
import {Function, STRING} from '../../Utils'
import moment from 'moment';
import {scheduleFilter, scheduleSorting } from '../../Utils/TrainUtils';
import {setParamSchedule } from '../../Utils/BusUtils';
import { Datedata } from '../../Utils/dummy';

export default class BusScheduleReturn extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            backUpData :[],
            progressfetch: 0.5 * Math.random(),
            sort_slug: 'price_asc',
            class_value: null,
            time_value: null,
            train_value: null,
            train_name : [],
            return_date : null,
            arr_date: [],
            dataIndex: 0,
            dateIndex : {id : 0}
        }
    }

    componentDidMount() {
        let { navigation } = this.props
        let { state } = navigation
        let { pax_list } = state.params
        let { origination, destination, return_date } = pax_list
        this.setState({return_date : return_date}, () =>{
            this.getSchedule()
            this.ChangeDate(this.state.dataIndex)
        })
    }


    ChangeDate(nextMonth){
        var arr_date = Function.ButtomDate(nextMonth)
        this.setState({ arr_date: arr_date })
    }

    pressChangeDate(item){
        console.log('depart_date')
        console.log(depart_date)
        let { navigation } = this.props
        let { state } = navigation
        let { pax_list } = state.params
        let { type_trip, origination, destination, depart_date, return_date, pax_adult,pax_infant } = pax_list
        let pax_list2 = {
            type_trip   : type_trip,
            origination : origination,
            destination : destination,
            depart_date : depart_date,
            return_date : item.fulldate,
            pax_adult   : pax_adult,
            pax_infant  : pax_infant,
        }
        console.log(return_date)
        this.setState({visibleModal : false, data : [],
            backUpData :[],
            progressfetch: 0.9,
            sort_slug: 'price_asc',
            class_value: null,
            time_value: null,
            train_value: null,
            train_name : [],
            depart_date : null,}, () => {
                this.setState({return_date : Function.FormeteDate(item.fulldate, 'DD MMM YYYY', 'YYYY-MM-DD')}, () =>{
                    Function.SaveDataJson('SearchRBus', Function.JsonString(pax_list2))
                    this.getSchedule()
                })
           
        })
    }

    getSchedule = () => {
        let { navigation } = this.props
        let { state } = navigation
        let { pax_list } = state.params
        let { origination, destination, return_date } = pax_list

        let url = getURLBus('get_schedule', {org: destination.id, des: origination.id, date: moment(this.state.return_date, 'YYYY-MM-DD').format('YYYYMMDD')})  
        try {
            JSONGetFile(url, null).then((response) => {
                console.log(response)
                switch(response.errorCode){
                    case '0':
                    response.availableTrips.map((item ,i ) =>(
                        this.setState({progressfetch: 100}, () => { this.setState({progressfetch: 0.0, 
                            data: Function.ObjectNull(response,'availableTrips') && [...this.state.data, setParamSchedule(item)],
                            backUpData : Function.ObjectNull(response,'availableTrips') && [...this.state.backUpData, setParamSchedule(item)]}) })
                    ))
                    break
                    default:
                    this.setState({progressfetch: 0.0})
                    break
                }
            }).catch((err) => {
                console.log(err)
                this.setState({
                    progressfetch: 0.0
                })
            })
        } catch (error) {
            this.setState({
                progressfetch: 0.0
            })
        }
    }

    ActivityResult = (value) => {
        let { navigation } = this.props
        let { state } = navigation
        let { pax_list } = state.params
        let { origination, destination, depart_date } = pax_list
        console.log(value)
        switch (value.slug) {
            case 'sort':
                this.setState({
                    sort_slug: value.value,
                    data : []
                }, () => { this.setState({data: scheduleSorting(this.state.sort_slug, this.state.backUpData)}) })
                break
            case 'filter':
                this.setState({
                    time_value: value.time_value,
                    class_value: value.class_value,
                    train_value: value.train_value
                }, () => { this.setState({ data: [] }, () => { this.setState({ data: scheduleFilter(this.state.time_value, this.state.class_value, this.state.train_value, this.state.backUpData) }) }) })
                break
            case 'depart_date':
                 return this.setState({ return_date: value.return_date }, () =>{
                    this.getSchedule()
                 })
        }
    }

    render() {
        let { navigation } = this.props
        let { state } = navigation
        let { pax_list, bus_depart } = state.params

        return (
            <View style={s.container} >
                <Toolbar  
                    arrow_back
                    onPress ={ () => navigation.dispatch(NavigationActions.back({ key: "" }))}>
                    <View>
                        <Text style={s.toolbar_title}>{STRING.Label.dep_bus} - {moment(this.state.return_date, 'YYYY-MM-DD').format('dddd, DD MMM YYYY')}</Text>
                        <Text style={s.toolbar_subtitle}>{pax_list.destination.name} - {pax_list.origination.name}</Text>
                    </View>
                </Toolbar>
                <Modal
                    type={'more'}
                    active={this.state.visibleModal}
                    onClose={value => this.setState({ visibleModal: value })}
                >   
                <View style={{backgroundColor: 'rgba(0,0,0, 0.20)'}}>
                    <View style={s.headerModal}>
                        <Text style={[s.textHeader,{color : Colors.blue}]}>{STRING.Label.anotherDate}</Text>
                    </View>
                    <View>
                        <View style={s.ContainerModal}>
                        <FlatList
                        onEndReached={() => this.setState({dataIndex : this.state.dataIndex+1}, () => {this.ChangeDate(this.state.dataIndex)})}
                            horizontal
                            contentContainerStyle={{ paddingHorizontal: Metrics.padding.small }}
                            showsHorizontalScrollIndicator={false}
                            data={this.state.arr_date}
                            keyExtractor={(item, index) => `key-${index}`}
                            renderItem   = {({item, index} ) => (
                                <View style={{justifyContent:'center', paddingHorizontal: Metrics.padding.tiny}}>
                                    <CardModalDate
                                        dayName ={item.dayName}
                                        date ={item.date}
                                        month ={item.month}
                                        price={item.price}
                                        onPress = {() => this.setState({dateIndex : item})}
                                        overlay = {this.state.dateIndex.id === item.id}
                                    />
                                </View>
                            )}/>
                        </View>
                        <View style={{backgroundColor :Colors.white}}>
                            <Button 
                                    style ={s.closebutton}
                                    onPress={()=> this.pressChangeDate(this.state.dateIndex)}
                                    text =  {STRING.Label.closeButton}
                                />
                        </View>
                    </View>
                    </View>
                </Modal>

                <Touchable
                        onPress={() => navigation.dispatch(NavigationActions.back({ key: "" }))}>
                        <View animation={"lightSpeedIn"} iterationCount={1} style={{ height: Scale(35), backgroundColor: "#f7f8fb", flexDirection: 'row', alignItems: 'center', padding: Scale(8) }}>

                            <Text style={{ color: Colors.black, fontSize: Scale(9), fontWeight: "bold" }}>{'DEPARTURE'}</Text>
                            <Text style={{ flex: 1, color: Colors.black, fontSize: Scale(9), marginRight: Scale(8), marginLeft: Scale(8) }} numberOfLines={1} ellipsizeMode={'tail'}>{pax_list.origination.name} - {pax_list.destination.name} {moment(pax_list.depart_date, 'YYYY-MM-DD').format('dddd, DD MMM YYYY')}</Text>

                            <View style={{
                                width: Scale(55),
                                height: Scale(20),
                                borderRadius: Scale(4),
                                borderStyle: "solid",
                                borderWidth: Scale(1),
                                borderColor: Colors.tangerine, justifyContent: 'center', alignItems: 'center'
                            }}>
                                <Text style={{ color: Colors.tangerine, fontSize: Scale(10), fontWeight: "bold" }}>{'CHANGE'}</Text>

                            </View>
                        </View>
                    </Touchable>
                    { (Platform.OS === 'android')
                    ? (this.state.progressfetch !== 0.0 && <ProgressBarAndroid styleAttr='Horizontal' style={{height: Scale(3)}} color={Colors.tangerine} progress={this.state.progressfetch} indeterminate={false} />)
                    : (this.state.progressfetch !== 0.0 && <ProgressViewIOS   progressTintColor={Colors.pizzaz}  progress={this.state.progressfetch} />)
                }

                <FlatList
                    data={scheduleSorting(this.state.sort_slug, this.state.data)}
                    renderItem={({item, index}) => (
                        <CardBus
                            onPress     = {() => navigation.navigate('BusCheckout', {pax_list, bus_depart, bus_return: item })}
                            onPressMore = {() => navigation.navigate('BusDetil', {title:'Bus Pulang',data: item})}
                            name        = {item.travelName}
                            price       = {item.price}
                            depart_time = {item.dep_time}
                            arrive_time = {item.arv_time}
                            duration ={item.duration_string}
                            orgCode     = {item.org}
                            desCode     = {item.des}
                            stopover    = {'Langsung'}
                            />
                    )}
                    keyExtractor={(item, index) => index}
                    ItemSeparatorComponent={ItemSeparator} 
                    />
                <View style={s.filter_bar}>
                    <Touchable onPress={() => navigation.navigate('BusSortFilter', {slug: 'sort', sort_value: this.state.sort_slug, ActivityResult: this.ActivityResult})}>
                        <View style={s.filter_item}>
                            <Icon size='small' style={s.custom_icon} source={getIcon('ic_filter')} />
                            <Text style={[s.filter_item_text]}>{STRING.Function_name.sort}</Text>
                        </View>
                    </Touchable>

                    <View style={s.filter_separator}/> 

                    <Touchable onPress={() => navigation.navigate('BusSortFilter', {slug: 'filter', time_value: this.state.time_value, class_value: this.state.class_value, train_value: this.state.train_value, ActivityResult: this.ActivityResult, train_name : this.state.train_name})}>
                        <View style={s.filter_item}>
                            <Icon size='small' style={s.custom_icon} source={getIcon('ic_sort')} />
                            <Text style={[s.filter_item_text]}>{STRING.Function_name.filter}</Text>
                        </View>
                    </Touchable>

                    <View style={s.filter_separator}/> 

                    <Touchable onPress={()=> this.setState({visibleModal: true})}>
                        <View style={s.filter_item}>
                            <Icon 
                                onPress={()=> this.setState({visibleModal: true})}
                                size='small' style={s.custom_icon} source={getIcon('ic_calendar_2')} />
                            <Text style={[s.filter_item_text]}>{STRING.Function_name.date_change}</Text>
                        </View>
                    </Touchable>
                </View>
            </View>
        )
    }
}


const ItemSeparator = () => <View style={{height: StyleSheet.hairlineWidth, flex:1, backgroundColor: Colors.border}}/>

const s = StyleSheet.create({
    closebutton: {
        marginTop: Metrics.padding.normal,
        backgroundColor : Colors.blue,  
    },
    textHeader:{
        fontSize: Metrics.font.regular,
        fontFamily: Fonts.bold.fontFamily,
        fontWeight : "500",
        color : Colors.white
    },
    headerModal:{
        backgroundColor:'transparent',
        paddingHorizontal: Metrics.padding.normal,
        paddingVertical: Metrics.padding.small
    },
    ContainerModal:{
        backgroundColor :'#E0E0E2',
        paddingVertical: Metrics.padding.normal,
    },
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    toolbar_title: {
        fontSize: Scale(12),
        color: Colors.white
    },
    toolbar_subtitle: {
        ...Fonts.bold,
        fontSize: Scale(14),
        color: Colors.white,
    },
    custom_icon: {
        tintColor: Colors.white,
        marginRight: Scale(4)
    },
    radio_frame:{
        flexDirection: 'row',
    },
    radio:{
        width: Scale(16),
        height: Scale(16), 
        backgroundColor: Colors.tangerine,
        padding: 2,
        borderRadius: Scale(8)
    },
    radio_:{
        borderRadius: Scale(8),
        flex:1,
        borderColor: 'white',
        borderWidth: 2,
    },
    filter_bar:{
        backgroundColor: Colors.slate_gray,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filter_item:{
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Scale(8)
    },
    filter_item_text: {
        color: Colors.white,
        fontSize: Fonts.size.tiny
    },
    filter_separator:{
        width: StyleSheet.hairlineWidth,
        backgroundColor: Colors.white,
        height: Fonts.size.tiny * 1.5, 
    }
});

AppRegistry.registerComponent("padiciti", () => BusScheduleReturn);
