import React, { Component } from 'react'
import {
    AppRegistry,
    View,
    Button,
    StyleSheet,
    FlatList,
    ProgressBarAndroid,
    ProgressViewIOS,
    TouchableOpacity,
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
    CardIJDK,
    getIcon,
    Touchable,
    // Button,
    Modal,
    CardModalDate,
    Alert,
} from '../../Components'
import { Metrics } from '../../Assets'
import { NavigationActions } from 'react-navigation';
import { JSONGetFile } from '../../Services/JsonService';
import { getURLIJDK } from '../../Services/API';
import moment from 'moment';
import { setParamSchedule, scheduleSorting, scheduleFilter } from '../../Utils/TrainUtils';
import { Datedata } from '../../Utils/dummy';
import { STRING, Function} from '../../Utils'
// import reactotronReactNative from 'reactotron-react-native';
import axios from 'axios';
export default class IJDKSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text:'aku error kamu error',
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
            dataIndex: 1,
            dateIndex : {id : 0},
            dataSource:[],
            JsonParse1:""
        }
    }
    

    async componentDidMount() {
        let { navigation } = this.props
        let { state } = navigation
        let { pax_list } = state.params
        let {  EventDateStart, EventDateUntil,Adult,Child,Infant } = pax_list
        return fetch('http://182.23.65.29:8888/free-0.0.1/sch-invev/get', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
          
            "Adult": Adult,
            "Child": Child,
            "EventDateStart": EventDateStart,
            "EventDateUntil": EventDateUntil,
            "Infant": Infant
            })
      })
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson.Data,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });
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
                    Function.SaveDataJson('SearchIJDK1', Function.JsonString(pax_list2))
                    this.getSchedule()
                })
           
        })
    }

    getSchedule = () => {
        let { navigation } = this.props
        let { state } = navigation
        let { pax_list } = state.params
        let { Adult, Child, EventDateStart,Infant,EventDateUntil } = pax_list

        let url = getURLIJDK('get_schedule', {Adult: Adult, Child: Child, EventDateStart:EventDateStart, EventDateUntil:EventDateUntil, Infant:Infant})  
        console.log("URL bla : " +url)
        // this.handlePress()
        // let xxx = []
        // xxx=JSON.parse(this.state.JsonParse1)
        console.log("asjkldfh :" + JSON.stringify((this.state.JsonParse1)))
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
        let bla = []
        // bla = this.handlePress.bind(this)
        console.log("Data source : " +JSON.stringify(this.state.dataSource))
        
        return (
            <View style={s.container} >
                <Toolbar  
                    arrow_back
                    onPress ={ () => navigation.dispatch(NavigationActions.back({ key: "" }))}>
                    <View>
                    <Text style ={s.toolbar_title}>IJBA EVENT SCHEDULE</Text>
                    </View>
                </Toolbar>
                { (Platform.OS === 'android')
                    ? (this.state.progressfetch !== 0.0 && <ProgressBarAndroid styleAttr='Horizontal' style={{height: Scale(3)}} color={Colors.tangerine} progress={this.state.progressfetch} indeterminate={false} />)
                    : (this.state.progressfetch !== 0.0 && <ProgressViewIOS  progressTintColor={Colors.pizzaz}  progress={this.state.progressfetch} />)
                }

                <FlatList
                    data={this.state.dataSource}
                        renderItem={({item, index}) => {
                            let tampx = item
                            let tampDate = ""
                            if(item.lst.length > 1 ){
                                tampDate = moment(item.lst[0].EventDate).format("DD")+" - "+moment(item.lst[item.lst.length-1].EventDate).format("DD MMM YYYY")
                            }else{
                                tampDate = moment((item.lst[0]).EventDate).format("DD MMM YYYY")
                            }
                            return (
                                <CardIJDK
                                    key         = {index}
                                    onPress     = {() => {
                                         navigation.navigate('IJDKCheckout', {pax_list,train_depart: item })
                                    }}
                                    onPressMore = {() => navigation.navigate('IJDKDetail', {title:'Bus Pergi', data: item})}
                                    name        = {item.TicketType}
                                    price       = {item.lst[0].PriceAdult}
                                    seats= {item.lst[0].AvailableSeat}
                                    depart_time = {item.lst[0].EventName}
                                    arrive_time = {tampDate}
                                    
                                    />
                            )
                    }}
                    ItemSeparatorComponent={ItemSeparator}
                    extraData={this.state}
                    keyExtractor={(item, index) => index}
                    />
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

AppRegistry.registerComponent("padiciti", () => IJDKSchedule);
