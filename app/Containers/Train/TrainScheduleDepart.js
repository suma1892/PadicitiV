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
    CardTrain,
    Icon,
    getIcon,
    Touchable,
    Button,
    Modal,
    CardModalDate,
    Alert,
} from '../../Components/'
import { Metrics } from '../../Assets'
import { NavigationActions } from 'react-navigation';
import { JSONGetFile } from '../../Services/JsonService';
import { getURLTrain } from '../../Services/API';
import moment from 'moment';
import { setParamSchedule, scheduleSorting, scheduleFilter } from '../../Utils/TrainUtils';
import { Datedata } from '../../Utils/dummy';
import { STRING, Function} from '../../Utils'
// import reactotronReactNative from 'reactotron-react-native';

export default class TrainScheduleDepart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : [],
            backUpData :[],
            progressfetch: 0.9,
            sort_slug: 'seat_asc',
            class_value: null,
            time_value: null,
            train_value: null,
            train_name : [],
            depart_date : null,
            arr_date: [],
            dataIndex: 0,
            dateIndex : {id : 0}
        }
    }


    componentDidMount() {
        let { navigation } = this.props
        let { state } = navigation
        let { pax_list } = state.params
        let { origination, destination, depart_date } = pax_list
        this.setState({depart_date : depart_date}, () =>{
            this.getSchedule()
            this.ChangeDate(this.state.dataIndex)
        })
        
    }

    ChangeDate(nextMonth){
        var arr_date = Function.ButtomDate(nextMonth)
        this.setState({ arr_date: arr_date })
    }

    pressChangeDate(item){
        let { navigation } = this.props
        let { state } = navigation
        let { pax_list } = state.params
        let { type_trip, origination, destination, depart_date, return_date, pax_adult,pax_infant } = pax_list
        let pax_list2 = {
            type_trip   : type_trip,
            origination : origination,
            destination : destination,
            depart_date : item.fulldate,
            return_date : return_date,
            pax_adult   : pax_adult,
            pax_infant  : pax_infant,
        }
        this.setState({visibleModal : false, data : [],
            backUpData :[],
            progressfetch: 0.9,
            sort_slug: 'price_asc',
            class_value: null,
            time_value: null,
            train_value: null,
            train_name : [],
            depart_date : null,}, () => {
                this.setState({depart_date : Function.FormeteDate(item.fulldate, 'DD MMM YYYY', 'YYYY-MM-DD')}, () =>{
                    Function.SaveDataJson('SearchTrain1', Function.JsonString(pax_list2))
                    this.getSchedule()
                })
           
        })
    }

    getSchedule = () => {
        let { navigation } = this.props
        let { state } = navigation
        let { pax_list } = state.params
        let { origination, destination, depart_date } = pax_list

        let url = getURLTrain('get_schedule', {org: origination[0], des: destination[0], date: moment(this.state.depart_date, 'YYYY-MM-DD').format('YYYYMMDD')})  

        try {
            JSONGetFile(url, null).then((response) => {
                let schedule = response.schedule
                var ArraySchedule = []
                
                if (schedule){
                    schedule.map((item) => {
                        this.setState({progressfetch: 100}, () => { this.setState({progressfetch: 0.0}) })
                        item[6].map((items) => {
                            ArraySchedule.push(setParamSchedule(item, items, {origination, destination}))
                        })
                    })
    
                    this.setState({ data: [...this.state.data, ...ArraySchedule ],
                    backUpData : [...this.state.backUpData, ...ArraySchedule]}, () => this.setState({data: scheduleSorting(this.state.sort_slug, this.state.data)}, () =>{
                        var name_train = []
                        var i = 0
                        while (i < this.state.backUpData.length){
                            name_train.push({name : this.state.backUpData[i].train_name})
                            i++
                        }
    
                        this.setState({train_name : name_train})
                    }))
                } else {
                    this.setState({
                        progressfetch: 0.0
                    }, () => {Alert(STRING.Warrning.NoData)})
                }
            }).catch((err) => {
                console.log(err)
                this.setState({
                    progressfetch: 0.0
                }, () => {Alert(STRING.Warrning.NoData)})
            })
        } catch (error) {
            this.setState({
                progressfetch: 0.0
            }, () => {Alert(STRING.Warrning.NoData)})
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
                    sort_slug: value.value
                }, () => { this.setState({data: scheduleSorting(this.state.sort_slug, this.state.data)}) })
                break
            case 'filter':
                this.setState({
                    time_value: value.time_value,
                    class_value: value.class_value,
                    train_value: value.train_value
                }, () => { this.setState({ data: [] }, () => { this.setState({ data: scheduleFilter(this.state.time_value, this.state.class_value, this.state.train_value, this.state.backUpData) }) }) })
                break
            case 'depart_date':
                 return this.setState({ depart_date: value.depart_date,
                    data : [],
                    backUpData :[],
                    progressfetch: 0.5 * Math.random(), }, () =>{
                    this.getSchedule()
                 })
        }
    }

    render() {
        let { navigation } = this.props
        let { state } = navigation
        let { pax_list } = state.params

        return (
            <View style={s.container} >
                <Toolbar  
                    arrow_back
                    onPress ={ () => navigation.dispatch(NavigationActions.back({ key: "" }))}>
                    <View>
                        <Text style={s.toolbar_title}
                        ellipsizeMode='tail'
                        numberOfLines={1}>Kereta Pergi - {moment(this.state.depart_date, 'YYYY-MM-DD').format('dddd, DD MMM YYYY')}</Text>
                        <Text style={s.toolbar_subtitle}
                        ellipsizeMode='tail'
                        numberOfLines={1}>{pax_list.origination[1]} ({pax_list.origination[0]}) - {pax_list.destination[1]} ({pax_list.destination[0]})</Text>
                    </View>
                </Toolbar>
                <Modal
                    type={'more'}
                    active={this.state.visibleModal}
                    onClose={value => this.setState({ visibleModal: value })}
                >   
                <View style={{backgroundColor: 'rgba(0,0,0, 0.20)'}}>
                    <View style={s.headerModal}>
                        <Text style={[s.textHeader, {color : Colors.blue}]}>{STRING.Label.anotherDate}</Text>
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
                {(Platform.OS === 'android')
                    ? (this.state.progressfetch !== 0.0 && <ProgressBarAndroid   style={{height: Scale(3)}} styleAttr='Horizontal' color={Colors.tangerine} progress={this.state.progressfetch} indeterminate={false} />)
                    : (this.state.progressfetch !== 0.0 && <ProgressViewIOS   progressTintColor={Colors.pizzaz}  progress={this.state.progressfetch} />)
                }

                <FlatList
                    data={scheduleSorting(this.state.sort_slug, this.state.data)}
                    renderItem={({item, index}) => {
                        let ava = ""
                        if (item.availability >= 50 ){
                            ava = ""
                        }else{
                            ava = item.availability.toString()+" Kursi"
                        }

                        // console.log(this.state.class_value + ' || ' + item.class)
                        if (this.state.class_value === null || item.class === this.state.class_value) 
                            return (
                                <CardTrain
                                    key         = {String(index)}
                                    onPress     = {() => {
                                        if (pax_list.type_trip === 'roundtrip') navigation.navigate('TrainScheduleReturn', {pax_list, train_depart: item })
                                        else navigation.navigate('TrainCheckout', {pax_list, train_depart: item })
                                    }}
                                    onPressMore = {() => navigation.navigate('TrainDetail', {data: item})}
                                    name        = {item.train_name}
                                    seats       = {ava}
                                    price       = {item.price}
                                    strike_price= {item.availability}
                                    train_class = {item.class + ' - ' + item.subclass}
                                    depart_time = {item.dep_time}
                                    arrive_time = {item.arv_time}
                                    orgCode     = {item.org}
                                    desCode     = {item.des}
                                    duration    = {item.duration_string}
                                    stopover    = {'Langsung'}
                                    />
                            )
                    }}
                    ItemSeparatorComponent={ItemSeparator}
                    extraData={this.state}
                    keyExtractor={(item, index) => String(index)}
                    />
                <View style={s.filter_bar}>
                    <Touchable onPress={() => navigation.navigate('TrainSortFilter', {slug: 'sort', sort_value: this.state.sort_slug, ActivityResult: this.ActivityResult})}>
                        <View style={s.filter_item}>
                            <Icon size='small' style={s.custom_icon} source={getIcon('ic_filter')} />
                            <Text style={[s.filter_item_text]}>URUTKAN</Text>
                        </View>
                    </Touchable>

                    <View style={s.filter_separator}/> 

                    <Touchable onPress={() => navigation.navigate('TrainSortFilter', {slug: 'filter', time_value: this.state.time_value, class_value: this.state.class_value, train_value: this.state.train_value, ActivityResult: this.ActivityResult, train_name : this.state.train_name})}>
                        <View style={s.filter_item}>
                            <Icon size='small' style={s.custom_icon} source={getIcon('ic_sort')} />
                            <Text style={[s.filter_item_text]}>FILTER</Text>
                        </View>
                    </Touchable>

                    <View style={s.filter_separator}/> 

                    <Touchable onPress={()=> this.setState({visibleModal: true})}>
                        <View style={s.filter_item}>
                            <Icon 
                                onPress={()=> this.setState({visibleModal: true})}
                                size='small' style={s.custom_icon} source={getIcon('ic_calendar_2')} />
                            <Text style={[s.filter_item_text]}>GANTI TANGGAL</Text>
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

AppRegistry.registerComponent("padiciti", () => TrainScheduleDepart);
