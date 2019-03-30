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
    Fonts,Metrics
} from '../../Components/'
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import { getSundayList } from '../../Utils/Function';

let format_date = 'YYYY-MM-DD'

LocaleConfig.locales['id'] = {
  monthNames: ['Januari','Februari','Maret','April','Mei','Juni','Juli','Agustus','September','Oktober','November','Desember'],
  monthNamesShort: ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agt','Sep','Okt','Nov','Des'],
  dayNames: ['Minggu','Senin','Selasa','Rabu','Kamis','Jumat','Sabtu'],
  dayNamesShort: ['Min','Sen','Sel','Rab','Kam','Jum','Sab']
};

LocaleConfig.defaultLocale = 'id';

export default class BusCalendar extends Component {
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
            selected        : null
        }
    }

    componentDidMount() {
        let { navigation } = this.props
        let { params } = navigation.state
        
        switch (params.slug) {
            case 'depart_date':
                return this.setState({
                    slug        : params.slug,
                    type_trip   : params.type_trip,
                    page_title  : 'Tanggal Keberangkatan',
                    selected    : params.depart_date || moment().format(format_date),
                }) 
            case 'return_date':
                let range = moment(params.return_date, format_date).diff(moment(params.depart_date, format_date), 'days')
                return this.setState({
                    slug        : params.slug,
                    type_trip   : params.type_trip,
                    depart_date : params.depart_date || moment().format(format_date),
                    return_date : params.return_date || moment().format(format_date),
                    page_title  : 'Tanggal Pulang',
                    selected    : range < 1 ? params.depart_date : params.return_date || moment().format(format_date),
                    // selected    : params.depart_date || moment().format(format_date),
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
        const { ActivityResult, slug } = state.params
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
        let { params } = navigation.state
        return (
            <View style={s.container}>
               <Toolbar
                    arrow_back
                    onPress     ={() => navigation.goBack()}>
                    <Text style ={s.toolbar_title}>{this.state.page_title}</Text>
                </Toolbar>
                <View style={{flex:1}}>
                <CalendarList
                    hideExtraDays       = {false}
                    minDate     ={this.state.slug === 'return_date' ? moment(this.state.depart_date, 'YYYY-MM-DD').add(1, 'day').format(format_date) : this.state.minDate}
                    maxDate     ={this.state.maxDate}
                    markedDates ={{   
                            ...getSundayList('year', 2),
                            ...this.markedDates(),
                            [this.state.selected]: {selected: true, color: Colors.blue, textColor: Colors.white, fontWeight: 'bold', startingDay: true, endingDay: true},
                            [this.state.depart_date]: params.slug === 'return_date' && {selected: true, color: Colors.blue, textColor: Colors.white, fontWeight: 'bold', startingDay: true, endingDay: true}
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
        fontSize: Scale(18),
        width : Metrics.screenWidth-16,
        color: Colors.white
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

AppRegistry.registerComponent("padiciti", () => BusCalendar);
