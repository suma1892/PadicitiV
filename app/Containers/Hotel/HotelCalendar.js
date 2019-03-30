import React, { Component } from 'react'
import {
    AppRegistry,
    View,
    StyleSheet,
} from 'react-native'
import moment from 'moment'
import {
    TextView as Text,
    Toolbar,
    Scale,
    Colors,
    Fonts,
    Touchable,
} from '../../Components/'
import { CalendarList } from 'react-native-calendars';
import { getSundayList } from '../../Utils/Function';

let format_date = 'YYYY-MM-DD'
export default class HotelCalendar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            minDate         : moment(new Date()).format(format_date),
            maxDate         : moment(new Date()).add(2, 'year').format(format_date),
            depart_date     : moment().format(format_date),
            return_date     : moment().day(3).format(format_date),
            select_type     : 'depart',
            type_trip       : 'roundtrip',
            markedDates     : {},
            page_title      : '',
            selected        : null,
            selectedDepart : null,
            selectedReturn : null
        }
    }

    componentDidMount() {
        let { navigation } = this.props
        let { params } = navigation.state

        switch (params.slug) {
            case 'depart_date':
                return this.setState({
                    type_trip       : params.type_trip,
                    page_title      : 'Tanggal Check In',
                    selectedDepart  : params.depart_date || moment().format(format_date),
                }) 
            case 'return_date':
                return this.setState({
                    type_trip       : params.type_trip,
                    selectedDepart  : params.depart_date || moment().format(format_date),
                    depart_date     : params.depart_date || moment().format(format_date),
                    return_date     : params.return_date || moment().format(format_date),
                    page_title      : 'Tanggal Check Out',
                    selectedReturn  : params.return_date || moment().format(format_date),

                })
        }   
    }
    
    markedDates = () => {
        let { depart_date, return_date } = this.state,
            range = moment(return_date, format_date).diff(moment(depart_date, format_date), 'days'),
            data = {}
        for (let i = 1; i < range; i++) {
            let date    = moment(depart_date, format_date).add(i, 'day').format(format_date)
            if (date !== depart_date && date !== return_date) {
                let item    = {[date]: {"selecter": true, color: '#eef5ff'}}
                    data    = {...data, ...item}
            }
        }
        return data
    }

    setDate = (value) => {
        const { navigation } = this.props
        const { state, goBack } = navigation
        const { ActivityResult, slug, depart_date, return_date } = state.params

        console.log(value)
        switch (slug) {
            case 'depart_date': 
                goBack()
                ActivityResult({slug, depart_date: value.dateString})
                break
            case 'return_date':
                goBack()
                ActivityResult({slug, return_date: value.dateString})
        }
    }

    render() {
        let { navigation } = this.props

        return (
            <View style={s.container}>
               <Toolbar
                    arrow_back
                    onPress     ={() => navigation.goBack()}>
                    <Text style ={s.toolbar_title}>{this.state.page_title}</Text>
                </Toolbar>
                <View style={{flex:1}}>
                <CalendarList
                    minDate     ={this.state.select_type === 'return' ? moment(this.state.depart_date, 'YYYY-MM-DD').add(1, 'day').format(format_date) : this.state.minDate}
                    maxDate     ={this.state.maxDate}
                    markedDates ={{   
                            ...getSundayList('year', 2),
                            ...this.markedDates(),
                            [this.state.selectedDepart]: {selecter: true, color: Colors.blue, textColor: Colors.white, fontWeight: 'bold', startingDay: true, endingDay: true},
                            [this.state.selectedReturn]: {selecter: true, color: Colors.blue, textColor: Colors.white, fontWeight: 'bold', startingDay: true, endingDay: true}
                        }}
                    markingType ={'period'}
                    onDayPress  ={day => this.setDate(day)}
                    />
                </View>
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
        fontSize: 18,
        color: 'white',
    },
    startingDay:{
        backgroundColor: Colors.blumine,
        width: Scale(32),
        height: Scale(32),
        borderRadius: Scale(32),
        justifyContent: 'center',
        alignItems: 'center',
    },
    start_frame:{
        borderBottomLeftRadius: Scale(32),
        borderTopLeftRadius: Scale(32),
    },
    end_frame:{
        borderBottomRightRadius: Scale(32),
        borderTopRightRadius: Scale(32)
    },
    calendar_day_field: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    calendar_day:{
        ...Fonts.regular,
        fontSize: Fonts.size.regular
    },
    icon_switch: {
        position: 'absolute',
        alignSelf: 'center',
        alignItems: 'center',
        top: -6,
        right: 0
    },
});

AppRegistry.registerComponent("padiciti", () => HotelCalendar);
