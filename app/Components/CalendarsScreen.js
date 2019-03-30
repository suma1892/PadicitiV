import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Platform,
  Dimensions,
  AppRegistry,
  FlatList,
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  BackHandler,Text, Image,
} from 'react-native'
import { TextView, Toolbar, getIcon } from '../Components'
import { Colors, Metrics } from '../Assets'
import { Function, array } from '../Utils'
import { LocaleConfig, CalendarList, Calendar } from 'react-native-calendars';
import { NavigationActions } from "react-navigation"
import { getSundayList } from '../Utils/Function';
import {HolidayDate} from '../Utils/dummy'
import moment, { monthsShort } from 'moment'

const finish = NavigationActions.back({ key: "" });

const Scale = (value) => {
  const { width } = Dimensions.get('window')
  const guidelineBaseWidth = 350;
  return width / guidelineBaseWidth * value
}

let format_date = 'YYYY-MM-DD'

LocaleConfig.locales['id'] = {
  monthNames: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agt', 'Sep', 'Okt', 'Nov', 'Des'],
  dayNames: ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'],
  dayNamesShort: ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab']
};

LocaleConfig.defaultLocale = 'id';

export default class CalendarScreen extends Component {
  constructor(props) {
    super(props);
    this._onScroll = this._onScroll.bind(this)
    this.state = {
      product: null,
      scroll: null,
      adult: 1,
      child: 0,
      infant: 0,
      ListChangemonth :  Function.FormeteDate(Function.get_today(),"YYYY-MM-DD", 'YYYY-MM')
    }
    this.ChagedMonthList = this.ChagedMonthList.bind(this);
    this.onDayPress = this.onDayPress.bind(this);
  }

  onDayPress(day) {
    const { params } = this.props.navigation.state;
    const { navigation } = this.props;
    if (params.slug === 'depart_date') {
      this.setState({
        selected_depart_date: day.dateString
      }, () => {
        navigation.goBack();
        this.props.navigation.state.params.ActivityResult({ depart_date: this.state.selected_depart_date, slug: 'depart_date' })

      });
    } else if (params.slug === 'return_date') {
      this.setState({
        selected_return_date: day.dateString,
        selected_depart_date: this.state.selected_depart_date
      }, () => {
        navigation.goBack();
        this.props.navigation.state.params.ActivityResult({ return_date: this.state.selected_return_date, slug: 'return_date' })

      });
    } else if (params.slug === 'brithdate') {
      this.setState({
        selected_brithdate: day.dateString,
      }, () => {
        navigation.goBack();
        this.props.navigation.state.params.ActivityResult({ birthdate: this.state.selected_brithdate, slug: 'brithdate' })

      });
    }
  }

  componentDidMount() {
    const { params } = this.props.navigation.state;
    BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
    if (params.slug === 'depart_date') {
      this.setState({
        ListChangemonth: Function.FormeteDate(params.depart_date, 'DD MMM YYYY', 'YYYY-MM-DD').toString(),
        selected_depart_date: Function.FormeteDate(params.depart_date, 'DD MMM YYYY', 'YYYY-MM-DD').toString(),
      });
    } else if (params.slug === 'return_date') {
      this.setState({
        ListChangemonth: Function.FormeteDate(params.return_date, 'DD MMM YYYY', 'YYYY-MM-DD').toString(),
        selected_return_date: Function.FormeteDate(params.return_date, 'DD MMM YYYY', 'YYYY-MM-DD').toString(),
        selected_depart_date: Function.FormeteDate(params.depart_date, 'DD MMM YYYY', 'YYYY-MM-DD').toString(),
      });
    } else {
      this.setState({
        ListChangemonth: Function.FormeteDate(params.brithdate, 'DD MMM YYYY', 'YYYY-MM-DD').toString(),
        selected_brithdate: Function.FormeteDate(params.brithdate, 'DD MMM YYYY', 'YYYY-MM-DD').toString(),

      });
    }
  }

  markedDates = () => {
    let { selected_depart_date, selected_return_date } = this.state,
      range = moment(selected_return_date, format_date).diff(moment(selected_depart_date, format_date), 'days'),
      data = {}
    for (let i = 1; i < range; i++) {
      let date = moment(selected_depart_date, format_date).add(i, 'day').format(format_date)
      if (date !== selected_depart_date && date !== selected_return_date) {
        let item = { [date]: { "selecter": true, color: '#eef5ff' } }
        data = { ...data, ...item }
      }
    }
    return data
  }

  holidayDate =()=>{
    data = {}
    for (let i = 0; i < HolidayDate.holidayDate.length; i++) {
    if (Function.FormeteDate(HolidayDate.holidayDate[i].date,"YYYY-MM-DD", 'YYYY-MM') === Function.FormeteDate(this.state.ListChangemonth,"YYYY-MM-DD", 'YYYY-MM') ){
        let item = { [HolidayDate.holidayDate[i].date]: { selected: Function.FormeteDate(HolidayDate.holidayDate[i].date,"YYYY-MM-DD", 'YYYYMMDD') > Function.FormeteDate(this.state.ListChangemonth,"YYYY-MM-DD", 'YYYYMMDD') ? true : false, endingDay: true, startingDay: true, disableTouchEvent: true, color: Function.FormeteDate(HolidayDate.holidayDate[i].date,"YYYY-MM-DD", 'YYYYMMDD') > Function.FormeteDate(this.state.ListChangemonth,"YYYY-MM-DD", 'YYYYMMDD') ? Colors.red : 'white'} }
        data = { ...data, ...item }}
    }
    return data
  }

  backAndroid() {
    this.props.navigation.dispatch(finish)
    return true // Needed so BackHandler knows that you are overriding the default action and that it should not close the app
  }

  _onScroll(e) {
    this.setState({
      scroll: Function.onScroll(e)
    });
  }

  

   renderArrow(direction) {
    if (direction === 'left') { return (
    <Image
      source={getIcon('ic_arrow_left')}
      style={{marginHorizontal : Metrics.padding.small,
        resizeMode: 'contain',
        width: Metrics.icon.small,
        tintColor:'black',
        height: Metrics.icon.small}}
      resizeMode='contain'
  />
  ) } else return (
  <Image
    source={getIcon('ic_arrow_right')}
    style={{marginHorizontal : Metrics.padding.small,
      resizeMode: 'contain',
      width: Metrics.icon.small,
      tintColor:'black',
      height: Metrics.icon.small}}
    resizeMode='contain'
/>
);
 }

 ChagedMonthList(ChangeM){
   this.setState({ListChangemonth : ChangeM.dateString}, () => {this.holidayDate()})
 }

  render() {
    const { params } = this.props.navigation.state;
    return (

      <View style={{ flex: 1, backgroundColor: Colors.white }} >
        {/* <ScrollView style={styles.container}> */}
        <Toolbar
          arrow_back
          onPress={() => this.backAndroid()}
          View={
            <TextView style={styles.title}>{'Kalender'}</TextView>
          }
        />
        <Calendar
          onDayPress={this.onDayPress}
          style={styles.calendar}
          current={this.state.ListChangemonth}
          minDate={params.slug === 'return_date' ? this.state.selected_depart_date :Function.get_today()}
          maxDate={'2090-06-07'}
          markingType={'period'}
          theme={{
            calendarBackground: 'white',
            textSectionTitleColor: 'gray',
            dayTextColor: 'gray',
            todayTextColor: 'blue',
            selectedDayTextColor: 'white',
            monthTextColor: 'black',
            selectedDayBackgroundColor: 'white',
            'stylesheet.calendar.header': {
              week: {
                marginTop: 5,
                flexDirection: 'row',
                justifyContent: 'space-between'
              }
            }
          }}
          onMonthChange={this.ChagedMonthList.bind(this)}
          // onVisibleMonthsChange = {(month) => this.ChagedMonthList(month[0].dateString)}
        
          
          markedDates={{
            // [this.state.selected]: {selected: true, disableTouchEvent: true, selectedDotColor: 'orange'}}}
            ...getSundayList('year', 2),
            ...this.markedDates(),
            ...this.holidayDate(),
            [this.state.selected_brithdate]: { selected: true, endingDay: true, startingDay: true, disableTouchEvent: true, color: Colors.blue },
            [this.state.selected_depart_date]: { selected: true, endingDay: true, startingDay: true, disableTouchEvent: true, color: Colors.blue },
            [this.state.selected_return_date]: { selected: true, endingDay: true, startingDay: true, disableTouchEvent: true, color: Colors.blue },
          }}
          renderArrow={(direction) => (this.renderArrow(direction))}
      
        />

        <FlatList
          style ={{padding: Scale(8)}}
          contentContainerStyle={{ marginHorizontal: Scale(4) }}
          scrollEnabled={false}
          data={HolidayDate.holidayDate}

          renderItem={({ item }) => (

            <View style={{ flex: 1 }}>
              {Function.FormeteDate(item.date, "YYYY-MM-DD", 'YYYY-MM') === Function.FormeteDate(this.state.ListChangemonth, "YYYY-MM-DD", 'YYYY-MM') && <TextView style={{ color: Colors.red }}>{Function.FormeteDate(item.date, "YYYY-MM-DD", 'D')} {item.note}</TextView>}
            </View>
          )}
          keyExtractor={(item, index) => index}
          numColumns={1} />
       {/* </ScrollView> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  calendar: {
    borderTopWidth: Scale(1),
    paddingTop: Scale(5),
    borderBottomWidth: Scale(1),
    borderColor: '#eee',
  },
  text: {
    textAlign: 'center',
    borderColor: '#bbb',
    padding: Scale(10),
    backgroundColor: '#eee'
  },
  container: {
    flex: 1,
    backgroundColor: 'gray'
  },
  title: {
    height: Scale(25),
    fontSize: Scale(18),
    marginLeft: Scale(8),
    fontWeight: "500",
    fontStyle: "normal",
    letterSpacing: 0,
    textAlign: "left",
    color: "#ffffff"
  },
});
AppRegistry.registerComponent("padiciti", () => CalendarScreen);
