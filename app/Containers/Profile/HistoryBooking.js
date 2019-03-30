
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
    Fonts,
    Container, 
    getIcon, 
    ToolbarV2 as Toolbar, 
    ItemField, 
    CalculateComponent, TextView as Text,
    Button, CardRecentSearch, Touchable, Modal, CardComponent, Scale} from '../../Components/index'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import {Function, STRING } from '../../Utils'
import Navbar from '../../Components/NavigationBottom'
import HistoryFlight from '../../Containers/Flight/History'
import HistoryTraint from '../../Containers/Train/History'
// import HistoryRailink from '../../Containers/Railink/History'
import HistoryHotel from '../../Containers/Hotel/History'
import HistoryPLN from '../../Containers/PLN/History'
import HistoryBUS from '../../Containers/Bus/History'
import HistoryIJDK from '../../Containers/IJDK/IJDKHistory'
const backAction = NavigationActions.back({key:''}) 

const ScreenA = props => (
    <View style={{flex:1}}>
        <ContentTab
            titleContent= 'Anda belum memilik transaksi'
        />
    </View>
)


const Icon = props => (
    <View style={[{justifyContent:'center'}]}>
        {props.image && <Image
            style={[{width : Metrics.icon.small, height: Metrics.icon.small, marginTop : 8}]}
            source={props.image}
            resizeMode = 'contain'
        />}
    </View>
)


const DetailProduk = TabNavigator({
    
    A    : { screen: HistoryFlight,
             navigationOptions: {
                tabBarIcon:() => {return (<Icon image={getIcon('ic_flight')}/> )},
                tabBarLabel: 'Flight',
                },
            },
    B   : { screen: HistoryTraint,
        navigationOptions: {
            tabBarIcon:() => {return (<Icon image={getIcon('ic_train')}/> )},
            tabBarLabel: 'Train',
            },
        },
    // C: {
    //     screen: HistoryRailink,
    //     navigationOptions: {
    //         tabBarIcon: () => { return (<Icon image={getIcon('ic_railink')} />) },
    //         tabBarLabel: 'Airport Train',
    //     },
    // },
    F: {
        screen: HistoryIJDK,
        navigationOptions: {
            tabBarIcon: () => { return (<Icon image={getIcon('ic_jetski')} />) },
            tabBarLabel: 'Jet Ski',
        },
    },
    C: {
        screen: HistoryHotel,
        navigationOptions: {
            tabBarIcon: () => { return (<Icon image={getIcon('ic_hotel')} />) },
            tabBarLabel: 'Hotel',
        },
    },
    D: {
        screen: HistoryBUS,
        navigationOptions: {
            tabBarIcon: () => { return (<Icon image={getIcon('ic_bus')} />) },
            tabBarLabel: 'Bus',
        },
    },
    E: {
        screen: HistoryPLN,
        navigationOptions: {
            tabBarIcon: () => { return (<Icon image={getIcon('ic_pln')} />) },
            tabBarLabel: 'PLN',
        },
    },
    },
{
    ...TabNavigator.Presets.AndroidTopTabs,
    tabBarPosition: 'top',
    swipeEnabled: true,
    animationEnabled: true,
    tabBarOptions: {
        style: {
            backgroundColor: Colors.white,
        },
        scrollEnabled: true,
        activeTintColor: '#ffffff',
        inactiveTintColor: '#ffffff',
        inactiveBackgroundColor: Colors.blue,
        activeBackgroundColor: Colors.blue,
        showIcon: true,
        upperCaseLabel: false,
        indicatorStyle: {
            borderBottomColor: Colors.blue,
            borderBottomWidth: 3,
        },
        
    labelStyle:{
        fontSize: Metrics.font.regular,
        justifyContent: 'center',
        alignItems: 'center',
        color : Colors.blue
    },
    tabStyle: {
        justifyContent: 'center',
        alignItems: 'center',
        width :Metrics.icon.large*2.5,
        height : Metrics.icon.large*1.1
    },
  },
  });

export default class HistoryBooking extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            name : null,
            Banner : null,
            titleTime : null
        });
    }
    render() {

        const {navigate } = this.props.navigation;
        let { navigation, dispatch} = this.props
        return (
            <Container style={s.container}>
               
               <Toolbar
                        centerTitle
                        style       = {s.toolbar}
                        type        = {next => this.setState({next})}
                        title       ='My Booking'
                        barStyle    = {s.toolbar}
                    />
                <DetailProduk
                    style={{ flex: 1 }}
                    screenProps={{navigation: this.props.navigation}}
                />

                <Navbar active='my_trip'
                    navigation={navigation}
                    dispatch={dispatch} />
             </Container>
        )
    }
}

const ContentTab = props => (
    <View style={ss.containerContent}>
            {props.titleContent &&
                <Text style={ss.tittleContent}>{props.titleContent}</Text>
            }
            {/* <View style={ss.contentNotif}>
                    <Text style={ss.textnoActive}>{STRING.Label.bookingNonActive}</Text>
                    <View style={ss.itemNotif}>
                            <View>
                                    <Image
                                        source ={getIcon('ic_cash')}
                                        resizeMode ='contain'
                                        style= {ss.imgHistoryBooking}
                                    />
                            </View>
                            <View style={{flex :1}}>
                                <Text style={ss.itembooking}>{STRING.Label.itemBooking}</Text>
                            </View>
                    </View>
            </View> */}
            {/* <View style={ss.line}/> */}
            {/* <View>
                <ItemField
                        type ='optionMenu'
                        label='E-tiket Lama'
                        style={{borderRadius:4}}
                        onPress={()=> console.log('df')}
                    />
            </View> */}
    </View>

)

const ss = StyleSheet.create({
    line:{
        width: Metrics.screen.width*.9,
        height: 2,
        backgroundColor : Colors.gray,
        marginVertical : Metrics.padding.large
    },
    itembooking:{
        fontSize : Fonts.size.small,
        color: Colors.black,
        paddingHorizontal: Metrics.padding.normal
    },
    imgHistoryBooking:{
        width: Metrics.icon.large,
        height: Metrics.icon.large,
    },
    itemNotif:{
        flexDirection:'row',
        justifyContent      : 'center',
        alignItems          : 'center',
        paddingBottom : Metrics.padding.small
    },
    textnoActive:{
        fontSize : Fonts.size.regular,
        color: Colors.black,
        fontFamily : Fonts.bold.fontFamily,
        fontWeight: Fonts.bold.fontWeight,
        marginBottom : Metrics.padding.small
    },
    contentNotif:{
        backgroundColor : Colors.white,
        paddingHorizontal : Metrics.padding.normal,
        paddingVertical : Metrics.padding.small,
        borderRadius : 6,
        marginTop : Metrics.padding.small
    },
    titleContent:{
        fontSize : Fonts.size.regular,
        color: Colors.black
    },
    containerContent:{
        flex:1,
        alignItems : 'center',
        backgroundColor : '#D3DCE8',
        paddingHorizontal : Metrics.padding.normal,
        paddingVertical: Metrics.padding.normal
    },
    elips:{
        tintColor : Colors.white,
        width: Metrics.icon.small*.7,
        height: Metrics.icon.small*.7,
    },
    imgArray:{
        width: Metrics.icon.small,
        height: Metrics.icon.small,
    },
    center:{
        justifyContent      : 'center',
        alignItems          : 'center'
    },
    descLabel:{
        fontSize : Fonts.size.regular,
        color: Colors.gray
    },
    LabelBooking:{
        fontFamily : Fonts.regular.fontFamily,
        fontSize : Fonts.size.large,
        color: Colors.black
    },
    booking_img:{
        width : Metrics.icon.normalSmall,
        height : Metrics.icon.normalSmall
    },
    ContainerBooking:{
        backgroundColor : Colors.white,
        justifyContent:'center',
        flexDirection: 'row',
        paddingHorizontal: Metrics.padding.normal,
        paddingVertical: Metrics.padding.small,
        borderRadius: 8,
        marginBottom: Metrics.padding.small
    },
    logo_img:{
        width : Metrics.icon.large*2,
        height: Metrics.icon.normal
    },
    header:{
        //flex:1,
        flexDirection :'row',
        paddingVertical : Metrics.padding.normal,
        justifyContent:'center',
        marginBottom: Metrics.padding.small
    },
    ContainerHeader :{
        backgroundColor :Colors.blumine,
        paddingHorizontal: Metrics.padding.normal,
        maxHeight : Metrics.icon.large*3,
        flex:1
    },

})



