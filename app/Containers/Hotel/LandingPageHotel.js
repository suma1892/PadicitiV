import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image,  Dimensions, AppRegistry, AsyncStorage
} from 'react-native'

import s from '../../Components/Styles'
import { Colors, 
    Metrics, 
    Container, 
    getIcon, 
    ToolbarV2 as Toolbar, 
    ItemField, 
    CalculateComponent, TextView as Text,
    Button, CardRecentSearch, Touchable} from '../../Components/index'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import {Function, STRING, navigateTo } from '../../Utils'
import { ListRecentSearch } from '../../Utils/dummy';
import moment from 'moment'
const backAction = NavigationActions.back({key:''}) 

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
                    params: [{ durasi: 1 },
                            { guest: 2 },
                        {destination : {
                            code: "ID|JAV",
                            groupCode: "BY_DEST",
                            title: "Jakarta,indonesia",
                            sub_title: '388'
                        }, }, 
                        {checkInDate : this.getDate('depart_date') },
                        {checkOutDate : this.getDate('return_date') },
                    {room : 1}],
               
                data_list : ListRecentSearch.product,
        });
    }
    getDate = (slug) => {
        switch (slug) {
            case 'depart_date': return moment(new Date()).format('YYYY-MM-DD')
            case 'return_date': return moment(new Date()).add(1, 'day').format('YYYY-MM-DD')
        }
    }
    componentDidMount(){
        AsyncStorage.getItem('SearchHotel', (err, SearchHotel) => {
            if (SearchHotel !== null) {
                this.setState({ params: Function.JsonParse(SearchHotel) })
            }
        })
    }
    ActivityResult = (data) => {
        switch (data.slug) {
            case 'destination':
                this.setState({ params: Function.OnchangesText(this.state.params, 2, data.data)})
                break
            case 'depart_date':
            var range = moment(data.depart_date, 'YYYY-MM-DD').diff(moment(this.state.params[4].checkOutDate, 'YYYY-MM-DD'), 'days')
                this.setState({ params: Function.OnchangesText(this.state.params, 3,data.depart_date), 
                    params: Function.OnchangesText(this.state.params, 4, moment(this.state.params[3].checkInDate).add(this.state.params[0].durasi, 'day').format('YYYY-MM-DD')),
                    }, () =>{ this.props.navigation.navigate('HotelCalendar', { slug: 'return_date',  type_trip : 'roundtrip', depart_date: data.depart_date, return_date: moment(data.depart_date).add(this.state.params[0].durasi, 'day').format('YYYY-MM-DD'), ActivityResult: this.ActivityResult })})
                break
            case 'return_date':
            var range = moment(data.return_date, 'YYYY-MM-DD').diff(moment(this.state.params[3].checkInDate, 'YYYY-MM-DD'), 'days')
                this.setState({ params: Function.OnchangesText(this.state.params, 4, data.return_date),
                    params: Function.OnchangesText(this.state.params, 0, range), })
                break
            default:
            AsyncStorage.getItem('SearchHotel', (err, SearchHotel) => {
                if (SearchHotel !== null) {
                    this.setState({ params: Function.JsonParse(SearchHotel) })
                }
            })
            break
        }
    }
    action() {
        Function.SaveDataJson('SearchHotel', Function.JsonString(this.state.params))
        this.props.navigation.navigate('ListHotel', { param: this.state.params, ActivityResult : this.ActivityResult})
    }
    Calculate(value) {
        var number = this.state.params[1].guest % this.state.params[5].room
   
        switch (value) {
            case 'durasi_plus':
            switch (true) {
                case this.state.params[0].durasi !== 20:
                        var value = this.state.params[0].durasi + 1
                        var ValueDate = moment(this.state.params[3].checkInDate,'YYYY-MM-DD').add(value, 'day').format('YYYY-MM-DD')
                        this.setState({params: Function.OnchangesText(this.state.params,0, value), params: Function.OnchangesText(this.state.params,4,ValueDate) })
                        break
                    }
                break
            case 'guest_plus':
            switch (true) {
                case this.state.params[1].guest !== 8:
                    var value = this.state.params[1].guest + 1
                    this.setState({params: Function.OnchangesText(this.state.params,1, value) })
                     break
                    }
                break
            case 'room_plus':
            switch (true) {
                case this.state.params[5].room < this.state.params[1].guest && this.state.params[5].room !== 8:
                    var valueroom = this.state.params[5].room + 1
                    this.setState({params: Function.OnchangesText(this.state.params,5, valueroom) })
               break
            }
                    break
            case 'durasi_minus':
                switch (true) {
                    case this.state.params[0].durasi !== 1:
                    var valueDurasi = this.state.params[0].durasi - 1
                    var ValueDate = moment(this.state.params[3].checkInDate,'YYYY-MM-DD').add(valueDurasi, 'day').format('YYYY-MM-DD')
                    this.setState({params: Function.OnchangesText(this.state.params,0, valueDurasi),  params: Function.OnchangesText(this.state.params,4,ValueDate)  })
                        break;
                }
                break
            case 'guest_minus':
                switch (true) {
                    case this.state.params[1].guest !== 1:
                    var value = this.state.params[1].guest - 1
                    this.setState({params: Function.OnchangesText(this.state.params,1, value) })
                        break;
                }
                break
            case 'room_minus':
                switch (true) {
                    case this.state.params[5].room !== 1:

                   var valueMinusGuest = this.state.params[1].guest - 1
                    var valueMinusroom = this.state.params[5].room - 1
                    this.setState({params: Function.OnchangesText(this.state.params,5, valueMinusroom), 
                        params: this.state.params[1].guest === this.state.params[5].room ? Function.OnchangesText(this.state.params,1, valueMinusGuest) : Function.OnchangesText(this.state.params,1, this.state.params[1].guest)})
                        break;
                }
                break
        }
    }

    
  
    render() {

        const { dispatch , navigate} = this.props.navigation;
        return (
            <Container style={s.container}>
                 
                 <Toolbar
                        style       = {s.toolbar}
                        type        = {next => this.setState({next})}
                        title       = 'Hotel'
                        barStyle    = {s.toolbar}
                        left        = {[{
                                        icon: 'ic_arrow_back',
                                        onPress : () =>  navigateTo('HomeScreen' ,this.props.dispatch,this.props.navigation,null )
                                    }]}
                    />
                    <ScrollView>
                    <ItemField
                        type ='option'
                        label ={STRING.Label.dep}
                        placeholder = {this.state.params[2].destination.title}
                        images = {getIcon('ic_hotel_2')}
                        onPress = {() =>this.props.navigation.navigate('ListHotelDestination', {ActivityResult : this.ActivityResult})}
                    />
                    <ItemField
                        type ='option'
                        label ={STRING.Label.checkIn_date}
                        value = {Function.FormeteDate(this.state.params[3].checkInDate, 'YYYY-MM-DD', 'DD MMM YYYY' )}
                        images = {getIcon('ic_calendar')}
                        onPress = {() =>this.props.navigation.navigate('HotelCalendar', {ActivityResult : this.ActivityResult, type_trip : 'oneway', depart_date : this.state.params[3].checkInDate, slug : 'depart_date'})}
                    />
                        <View style={[style.margin]}>
                            <Text style={[s.label,{marginBottom: Metrics.padding.small}]}>{STRING.Label.duration}</Text>
                            <View style={[{flexDirection :'row'}, style.rectangel]}>
                                <View style={{alignSelf:'center'}}>
                                    <CalculateComponent
                                        //border ={style.borderSide}
                                        style={style.widthCalculate}
                                        onPressMinus = {() => this.Calculate('durasi_minus')}
                                        number = {this.state.params[0].durasi +' Night'} 
                                        onPressPlus = {() => this.Calculate('durasi_plus')}
                                    />
                                </View>
                                <Touchable
                                onPress ={() =>this.props.navigation.navigate('HotelCalendar', {ActivityResult : this.ActivityResult, type_trip : 'roundtrip', depart_date : this.state.params[3].checkInDate,return_date : this.state.params[4].checkOutDate, slug : 'return_date'})}>
                                <View style={[ style.center]}>
                                    <Text style={s.fontGraysmall}>{STRING.Label.check_out}</Text>
                                    <Text style={s.fontGraytiny}>{Function.FormeteDate(this.state.params[4].checkOutDate, 'YYYY-MM-DD', 'DD MMM YYYY' )}</Text>
                                </View>
                                </Touchable>
                            </View>
                        </View>
                    <View>
                        <View style={style.calculate}>
                                <CalculateComponent
                                    border ={style.borderSide}
                                    label ={STRING.Label.guest}
                                    style={style.widthNormal}
                                    onPressMinus = {() => this.Calculate('guest_minus')}
                                    number = {this.state.params[1].guest.toString()} 
                                    onPressPlus = {() => this.Calculate('guest_plus')}
                                />
                                <CalculateComponent
                                    border ={style.borderSides}
                                    label ={STRING.Label.numberOf_room}
                                    style={[style.widthNormals]}
                                    onPressMinus = {() => this.Calculate('room_minus')}
                                    number = {this.state.params[5].room} 
                                    onPressPlus = {() => this.Calculate('room_plus')}
                                />
                        </View>
                    </View>
                    <Button
                        style ={style.button}
                        onPress={()=> this.action()}
                        text = {STRING.Label_Flight.seach_hotel}
                    />
                    {/* <View style={s.marginNormal}>
                        <Text>{STRING.Label.recent_Search}</Text>
                        <View>
                        <FlatList
                            data = {this.state.data_list}
                            keyExtractor={(item, index) => `key-${index}`}
                            renderItem ={({ item }) => (
                                <CardRecentSearch
                                    onPress={()=> console.log('Test')}
                                    destination={item.destination}
                                    date={item.date}
                                    guest={item.guest}
                                />
                            )}
                            />

                        </View>
                    </View> */}
                    </ScrollView>
             </Container>
        )
    }
}

const style = StyleSheet.create({
    borderSide:{
        borderColor: Colors.borderColor,
        borderWidth: 2,
        borderRadius: 4,
    },
    borderSides:{
        borderColor: Colors.borderColor,
        borderWidth: 2,
        borderRadius: 4,
        paddingHorizontal: Metrics.padding.tiny,
    },
    button:{
        marginVertical : Metrics.padding.normal
    },
    widthNormals:{
        width : Metrics.screen.width/3,
        marginLeft : Metrics.padding.medium,
        alignItems: 'flex-start',
    },
    widthNormal:{
        width : Metrics.screen.width/4,
    },
    calculate:{
        marginHorizontal : Metrics.padding.normal,
        marginVertical : Metrics.padding.small,
        flexDirection :'row'
    },
    widthCalculate:{
        width : Metrics.screen.width/2.7,
        alignSelf: 'center',
        //height: Metrics.icon.normal*1.3,
    },
    center :{
        flex: 1,
        justifyContent: 'center',
        paddingHorizontal : Metrics.padding.small,
        borderStyle: "solid",
        borderLeftColor: Colors.borderColor,
        borderLeftWidth: 2,
    },
    margin:{
        marginHorizontal: Metrics.padding.normal,
        marginVertical : Metrics.padding.small
    },
    rectangel:{
        height: Metrics.icon.normal*1.3,
        borderRadius: 4,
        borderStyle: "solid",
        borderColor : Colors.borderColor,
        borderWidth :2,
        alignContent: 'center',
    },

})

