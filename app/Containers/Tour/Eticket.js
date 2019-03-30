import React, { Component } from "react";
import { AsyncStorage, StyleSheet, ScrollView, Animated, Dimensions, Platform, Text, TouchableOpacity, View, Image } from "react-native";
import { TabNavigator } from 'react-navigation';
import { Colors, Metrics, Toolbar, TextView, Fonts, Touchable, LoadingFull, Alert } from '../../Components'
import { Body, Header, List, ListItem as Item, ScrollableTab, Tab, TabHeading, Tabs, Title } from "native-base";
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
import { NavigationActions } from 'react-navigation';
const finish = NavigationActions.back({ key: "" });
import { _OS } from '../../Assets';
import { JSONGetFile, JSONPostFile } from '../../Services/JsonService'
import { getURL } from '../../Services/API'
import { getIcon } from '../../Assets';
import { Function, STRING } from '../../Utils'
import { ListWrite } from '../../Utils/dummy';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_HEIGHT = Scale(250);
const HEADER_HEIGHT = Platform.OS === "ios" ? Scale(64) : Scale(50);
const SCROLL_HEIGHT = IMAGE_HEIGHT - HEADER_HEIGHT;
const THEME_COLOR = "#ffffff";
const FADED_THEME_COLOR = "rgba(85,186,255, 0.8)";
import Dash from 'react-native-dash';
const { height } = Dimensions.get('window');
import Slick from 'react-native-slick';
import moment from 'moment'

export default class DetilTour extends Component {

    nScroll = new Animated.Value(0);
    scroll = new Animated.Value(0);
    textColor = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT / Scale(5), SCROLL_HEIGHT],
        outputRange: ['#4778fb', '#4778fb', "#4778fb"],
        extrapolate: "clamp"
    });
    tabBg = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT],
        outputRange: ["white", 'white'],
        extrapolate: "clamp"
    });
    tabY = this.nScroll.interpolate({
        inputRange: [0, Scale(245), Scale(245) + 1],
        outputRange: [0, 0, 1]
    });
    headerBg = this.scroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT, SCROLL_HEIGHT + 1],
        outputRange: ["transparent", "transparent", THEME_COLOR],
        extrapolate: "clamp"
    });
    imgScale = this.nScroll.interpolate({
        inputRange: [-25, 0],
        outputRange: [1.1, 1],
        extrapolateRight: "clamp"
    });
    imgOpacity = this.nScroll.interpolate({
        inputRange: [0, SCROLL_HEIGHT],
        outputRange: [1, 0],
    });

    heights = [Metrics.screenHeight, Metrics.screenHeight];
    constructor(props) {
        super(props);
        this.nScroll.addListener(Animated.event([{ value: this.scroll }], { useNativeDriver: false }));

        this.state = {
            tour_list: [],
            loading: false,
            tab_active: 'Price',
            total_adult: 1,
            total_child: 0,
            price_adult: 1000000,
            price_child: 1000000,
            countryName: null,
            nameTour: null,
            about_desc: null,
            TourInclude: [],
            TourExclude: [],
            Iternery: [],
            loading: true,
            screenHeight: 0,
            activeTab: 0,
            Image: [],
            height: Metrics.screenHeight,
            pop_up: false,
            review: [],
            contact_name:null,
            email: null,
            phonde_num:null,
            depart_date: this.getDate('depart_date'),
        }
    }

    backAndroid() {
        this.props.navigation.dispatch(finish)
        return true
    }

    getDate = (slug) => {
        switch (slug) {
            case 'depart_date': return Function.FormeteDate(Function.get_today(), "YYYY-MM-DD", 'DD MMM YYYY')
            // case 'return_date': return moment(new Date()).add(3, 'day').format('YYYY-MM-DD')
        }
    }

    componentDidMount() {
        this.GetData('booking');
        this. CheckUser();
    }

    CheckUser (){
        const { params } = this.props.navigation.state;
        this.setState({id_tour : params.idTour}, ()=>{
            AsyncStorage.getItem('UserData', (err, UserData) => {
                if (UserData) {
                    this.setState({ contact_name: Function.JsonParse(UserData).client_name, email: Function.JsonParse(UserData).client_email, phonde_num: Function.JsonParse(UserData).client_phone, clientId: Function.JsonParse(UserData).clientId }, () => {
                    })
                } else {
    
                    AsyncStorage.getItem('CustomerData', (err, CustomerData) => {
                        if (CustomerData !== null) {
                            this.setState({clientId : Function.JsonParse(CustomerData).clientId , contact_name: Function.JsonParse(CustomerData).client_name, email: Function.JsonParse(CustomerData).client_email, phonde_num: Function.JsonParse(CustomerData).client_phone }, () => {
                            })
                        }
                    })
                }
            })
        })
    }

    GotoBooking() {
        const { params } = this.props.navigation.state;
        if ((this.state.total_adult + this.state.total_child) > 20) {
            Alert("Jumlah penumpang tidak boleh lebih dari 20 orang")
        } else {

            this.props.navigation.navigate('BookingTour', {
                idTour: params.dataBooking.id_tour,
                date: this.state.depart_date,
                total_adult: this.state.total_adult,
                total_child: this.state.total_child,
                price_adult: this.state.price_adult,
                price_child: this.state.price_child
            })
        }
    }

    ActivityResult = (data) => {
        switch (data.slug) {
            case 'review':
                this.GetData('review')
                break
            case 'depart_date':
                this.setState({ depart_date: Function.FormeteDate(data.depart_date, "YYYY-MM-DD", 'DD MMM YYYY') }, () => { this.GotoBooking() })
                break
        }
    }


    Tab1 = (i, params) => <View style={{ flex: 1 }}>
   
        {this.state.activeTab === 0 && <View style={{ flex: 1 }}>
            {/* <CardImage
                Image={this.state.Image}
                onPress={() => this.setState({ pop_up: true })}
            /> */}
            <Price
                Adultminus={() => this.setState({ total_adult: this.state.total_adult != 1 ? this.state.total_adult - 1 : 1 })}
                Adultplus={() => this.setState({ total_adult: this.state.total_adult + 1 })}
                PriceAdult={Function.convertToPrice(this.state.price_adult)}
                TotalAdult={this.state.total_adult}
                Childminus={() => this.setState({ total_child: this.state.total_child != 0 ? this.state.total_child - 1 : 0 })}
                Childplus={() => this.setState({ total_child: this.state.total_child + 1 })}
                PriceChild={Function.convertToPrice(this.state.price_child)}
                TotalChild={this.state.total_child}
                no_transaction ={params.dataBooking.transactionCode}
                price ={Function.convertToPrice(params.dataBooking.total)}
                total_adult = {params.dataBooking.passengerAdult}
                price_adult= {Function.convertToPrice(params.dataBooking.priceAdultTot)}
                total_child={params.dataBooking.passengerChild}
                price_child={Function.convertToPrice(params.dataBooking.priceChildTot)}
                price_tour = {Function.convertToPrice(params.dataBooking.priceAdult)}
                travelerAdult ={params.travelerAdult}
                travelerChild ={params.travelerChild}
                cityTour={this.state.countryName}
                dateTour={Function.FormeteDate(params.depart_date,"DD MMM YYYY", 'dddd, DD') + '-'+ Function.FormeteDate(params.return_date,"DD MMM YYYY", 'DD MMM YYYY')}
                nameTour={this.state.nameTour}
                contact_detils_name={this.state.contact_name}
                contact_detils_email={this.state.email}
                contact_detils_no_tlp={this.state.phonde_num}
                
            Image={this.state.Image}
            onPress={() => this.setState({ pop_up: true })}
            />
        </View>}
    </View>;

    Tab2 = (i) => <View style={{ flex: 1, paddingTop: Scale(8) }}>
        {this.state.activeTab === 1 && <About
            city={this.state.countryName}
            description={this.state.about_desc}
            arrayHiglight={[]}
            LatLong={null} />}
    </View>;

    Tab3 = (i) => <View style={{ flex: 1, paddingTop: Scale(8) }}>
        {this.state.activeTab === 2 && <Itinerary
            Iternery={this.state.Iternery} />}
    </View>;

    Tab4 = (i) => <View style={{ flex: 1, paddingTop: Scale(8) }}>
        {this.state.activeTab === 3 && <Note
            TourInclude={this.state.TourInclude}
            TourExclude={this.state.TourExclude} />}
    </View>;

    GetData = (type) => {
        const { params } = this.props.navigation.state;
        this.setState({ loading: true })
        let url = getURL('url_get_detil_tour', params.dataBooking.id_tour)
        let parameter = null
        let data = []
        let arr_item = []
        
        JSONGetFile(url, parameter)
            .then((respone) => {

                switch (respone.respCode) {
                    case '0':
                    this.setState({loading: false })

                            this.setState({
                                price_adult: respone.tour[0].priceAdult,
                                price_child: respone.tour[0].priceChild,
                                countryName: respone.tour[0].nameTour + ' - ',
                                about_desc: respone.tour[0].aboutTour,
                                TourInclude: respone.tour[0].TourInclude,
                                TourExclude: respone.tour[0].TourExclude,
                                Iternery: respone.tour[0].msItenary,
                                Image: respone.tour[0].msTourImage,
                                nameTour : respone.nameTour
                            })

                        break
                    default:

                        this.setState({ loading: false }, () => {
                            if (type !== 'review') {
                                this.backAndroid()
                            }
                        })
                        break
                }
            }).catch((error) => {
                this.setState({ loading: false }, () => {
                    if (type !== 'review') {
                        this.backAndroid()
                    }
                })
            })
    }

    reqPayment(parameter){
        const { params } = this.props.navigation.state;
        this.setState({ loading: true })
        let url =  getURL('url_post_req_payment_tour')
        let param = parameter
        
        JSONPostFile(url, param).then((Respone) => {
            console.log(Respone)
            switch (Respone.respCode) {
                
                case '0':
                this.setState({ loading: false })

                this.props.navigation.navigate('PaymentTour', { DataJson: Respone })
                    break
                default:
                    this.setState({ loading: false }, () => {
                        Alert(STRING.Warrning.no_connection)
                    })
                   
                    break
            }

        }).catch((err) => {
            this.setState({ loading: false }, () => {
                // this.backAndroid()
                Alert(STRING.Warrning.no_connection)
            })
        })
    } 

    render() {
        const { params } = this.props.navigation.state;
        return (
            <View style={{ flex: 1, backgroundColor: '#4778fb' }}>

                <Toolbar
                        arrow_back
                        style={{ backgroundColor: '#4778fb' }}
                        onPress={() => this.backAndroid()}
                        View={
                            <View>
                                <TextView
                                    style={styles.lableTitle}
                                text={'Eticket Tour'}
                                />
                                <TextView
                                style={{ fontSize: Scale(14), color: Colors.white }}
                                text={"Booking ID 123454"}
                            />
                            </View>}
                    />

                    <View style={{ height: Scale(14), borderTopLeftRadius: Scale(16), borderTopRightRadius: Scale(16), backgroundColor: Colors.white }}/>
                    <Tabs
                        prerenderingSiblingsNumber={4}
                        onChangeTab={({ i }) => {
                            this.setState({ height: this.heights[i], activeTab: i })
                        }}
                        renderTabBar={(props) => <Animated.View
                            style={{ position: 'absolute', transform: [{ translateY: this.tabY }], zIndex: 1, width: "100%", backgroundColor: "white" }}>
                            <ScrollableTab {...props}
                                renderTab={(name, page, active, onPress, onLayout) => (
                                    <TouchableOpacity key={page}
                                        onPress={() => onPress(page)}
                                        onLayout={onLayout}
                                        activeOpacity={0.4}>
                                        <Animated.View
                                            style={{
                                                flex: 1,
                                                backgroundColor: this.tabBg,

                                            }}>
                                            <TabHeading scrollable
                                                style={{
                                                    backgroundColor: "transparent",
                                                    width: SCREEN_WIDTH / 4,
                                                    alignItems: 'center',
                                                    marginTop: Scale(10)

                                                }}
                                                active={active}>
                                                <Animated.Text style={{
                                                    color: active ? Colors.black : '#666666',
                                                    fontSize: Scale(14),
                                                    alignSelf: "center"
                                                }}>
                                                    {name}
                                                </Animated.Text>
                                            </TabHeading>
                                        </Animated.View>
                                    </TouchableOpacity>
                                )}
                                underlineStyle={{ backgroundColor: this.textColor }} />
                        </Animated.View>
                        }>
                        <Tab heading="Price">
                            {this.Tab1(0, params)}
                        </Tab>
                        <Tab heading="About">
                            {this.Tab2(1)}
                        </Tab>
                        <Tab heading={'Tour'}>
                            {this.Tab3(2)}
                        </Tab>
                        <Tab heading="Notes">
                            {this.Tab4(3)}
                        </Tab>

                    </Tabs>

                <View style={{ width: '100%', height: Scale(80), position: 'absolute', bottom: 0 }}>
                    <View style={{
                        width: Metrics.screenWidth, flexDirection: 'row',
                        height: Scale(80), borderTopColor: '#eeeeee', borderTopWidth: 2, alignItems: 'center',
                        backgroundColor: "#ffffff", padding: Scale(8)
                    }}>

                        <View>
                            <TextView
                                numberOfLines={1}
                                ellipsize={'tail'}
                                style={{ fontSize: Scale(12), color: "#666666" }}
                                text={'Total Price ' + (this.state.total_adult + this.state.total_child) + ' Traveler'}
                            />

                            <TextView
                                numberOfLines={1}
                                ellipsize={'tail'}
                                style={{ fontSize: Scale(14), color: "#666666" }}
                                text={'IDR ' + Function.convertToPrice(params.dataBooking.priceAdultTot)}
                            />
                        </View>

                        <Touchable
                            onPress={() => this.reqPayment({transactionCode: params.dataBooking.transactionCode})}>
                            <View style={{ flex: 1, alignItems: 'flex-end' }}>
                                <View style={{height: Scale(45), borderRadius: 8, backgroundColor: "#00c783", alignItems: 'center', justifyContent: 'center', padding : Scale(8) }}>
                                    <TextView
                                        numberOfLines={1}
                                        ellipsize={'tail'}
                                        style={{ fontSize: Scale(14), color: "#ffffff" }}
                                        text={'CONTINUE TO PAYMENT'}
                                    />
                                </View>
                            </View>
                        </Touchable>
                    </View>
                </View>

                {this.state.pop_up && <View style={{ height: Metrics.screenHeight, backgroundColor: 'rgba(0,0,0, 0.8)', position: 'absolute', position: 'absolute' }}>
                    <View style={{ height: Metrics.screenHeight, alignItems: 'center', justifyContent: 'center' }}>
                        <Slick
                            height={Scale(500)}

                            renderPagination={renderPagination}
                            paginationStyle={{
                                bottom: -23, left: null, right: Scale(60)
                            }} loop={false}>

                            {this.state.Image.map((item, i) =>
                                <View style={styles.slide}>
                                    <Image style={styles.image2} source={{ uri: item.imageUrl }} />
                                </View>)}

                        </Slick>
                    </View>

                    <Touchable onPress={() => this.setState({ pop_up: false })}>
                        <View style={{
                            width: Metrics.screenWidth, position: 'absolute', alignItems: 'flex-end'
                        }}>
                            <Image
                                style={{
                                    marginTop: _OS(Scale(80), Scale(70)), marginRight: Scale(4), width: Scale(25),
                                    tintColor: 'white',
                                    height: Scale(18)
                                }}
                                resizeMode='contain'
                                source={getIcon('ic_close')}
                            />
                        </View>
                    </Touchable>
                </View>}
                <LoadingFull
                    visible={this.state.loading}
                    title={STRING.Label.please_wait}
                    sub_title={STRING.Label.page} />
            </View>
        )
    }
}

const About = props => (
    <ScrollView style ={{flex  : 1}}>
    <View style={{ flex: 1, backgroundColor: Colors.white, padding: Scale(8), marginTop: Scale(40), marginBottom: Scale(80) }}>
        <TextView
            style={{ fontSize: Scale(14), color: "#666666", lineHeight: Scale(22) }}
            text={props.city + props.description}
        />

        {props.LatLong && <TextView
            style={{ marginTop: Scale(16), fontSize: Scale(16), color: "#666666" }}
            text={'Location'}
        />}

        {props.LatLong && <Image
            style={{ marginTop: Scale(16), height: Scale(160) }}
            source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqQEywCzXSGZgRLyOGKEzwBOBzIW_-3ANZETdo-Pmpnpzjit_5' }}
            resizeMode='stretch'
        />}

        {props.arrayHiglight.length !== 0 && <TextView
            style={{ marginTop: Scale(16), fontSize: Scale(16), color: "#666666" }}
            text={'Highlights: '}
        />}

        {props.arrayHiglight.length !== 0 && <View style={{ flexDirection: 'row' }}>
            <TextView
                style={{ marginTop: Scale(16), fontSize: Scale(14), color: "#666666" }}
                text={'• '}
            />

            <TextView
                style={{ marginTop: Scale(16), fontSize: Scale(14), color: "#666666" }}
                text={'Discover the weird and wonderful stone formations at Garuda Rocks.'}
            />
        </View>}
    </View>
    </ScrollView>
)

const CardImage = props => (
    <Touchable
        onPress={props.onPress}>
        <View style ={{marginBottom : Scale(8), marginTop : Scale(16)}}> 
            {props.Image.length >= 3 && <View style={{ flexDirection: 'row', marginRight: Scale(16), marginBottom: Scale(16), marginLeft: Scale(16), height: Scale(210) }}>
                <Image
                    source={{ uri: props.Image[0].imageUrl }}
                    resizeMode='stretch'
                    style={{ borderRadius: Scale(8), width: Metrics.screenWidth / 2.5, height: Scale(224) }}
                />
                <View style={{ marginRight: Scale(16), marginLeft: Scale(16) }}>
                    <Image
                        source={{ uri: props.Image[1].imageUrl }}
                        resizeMode='stretch'
                        style={{ borderRadius: Scale(8), width: Metrics.screenWidth / 2.5, height: Scale(140) }}
                    />
                    <View style={{ paddingTop: Scale(8) }}>
                        <Image
                            source={{ uri: props.Image[2].imageUrl }}
                            resizeMode='stretch'
                            style={{ borderRadius: Scale(8), width: Metrics.screenWidth / 2.5, height: Scale(76) }}
                        />
                        <View style={{ borderRadius: Scale(8), width: Metrics.screenWidth / 2.5, height: Scale(76), backgroundColor: 'rgba(52, 52, 52, 0.8)', position: 'absolute', alignItems: 'center', justifyContent: 'center', marginTop: Scale(8) }}>
                            <TextView
                                style={{ fontSize: Scale(14), color: '#ffffff' }}
                                text={'+' + props.Image.length}
                            />
                        </View>
                    </View>
                </View>

            </View>}

        </View>
    </Touchable>

)

const Price = props => (
    
    <ScrollView style ={{flex  : 1}}>
    <View style={{ flex: 1, backgroundColor: Colors.white, marginTop: Scale(40), marginBottom: Scale(80) }}>
    <CardImage
                Image={props.Image}
                onPress={props.onPress}
            />
        
        <View style={styles.bgToolbar}>
            <TextView
                style={styles.textToolbar}
                text={"Transaction ID"}
            />
        </View>
        <View style={styles.bgValue}>

            <TextView
                style={styles.textTitle}
                text={props.no_transaction}
            />
        </View>

        <View style={styles.bgToolbar}>
            <TextView
                style={styles.textToolbar}
                text={"Tour"}
            />
        </View>

        <View style={styles.bgValue}>
            <TextView
                style={styles.textTitle}
                text={props.cityTour}
            />
            <TextView
                style={styles.textDesc}
                text={props.dateTour}
            />
            <TextView
                style={styles.textDesc}
                text={props.nameTour}
            />
        </View>


        <View style={styles.bgToolbar}>
            <TextView
                style={styles.textToolbar}
                text={"Contact Detail"}
            />
        </View>

        <View style={styles.bgValue}>

            <TextView
                style={styles.textTitle}
                text={props.contact_detils_name}
            />

            <TextView
                style={styles.textDesc}
                text={props.contact_detils_email}
            />

            <TextView
                style={styles.textDesc}
                text={props.contact_detils_no_tlp}
            />
        </View>

        <View style={styles.bgToolbar}>
            <TextView
                style={styles.textToolbar}
                text={"Traveler Details"}
            />
            </View>

            {props.travelerAdult.map((item, i) => {
                return (<TravelDetil
                    name={item.title + ' ' + item.name}
                    email={item.email}
                    no_tlp={item.phone_num}
                    type={'Adult'} />)
            })}

            {props.travelerChild.length !== 0 && props.travelerChild.map((item, i) => {
                return (<TravelDetil
                    name={item.title + ' ' + item.name}
                    email={item.email}
                    no_tlp={item.phone_num}
                    type={'Child'} />)
            })}

        
       


        <View style={styles.bgToolbar}>
            <TextView
                style={styles.textToolbar}
                text={"Price Details"}
            />
        </View>

       
        <View style={[{ flex: 1}, styles.bgValue]}>

            <View style={{ flex: 1, flexDirection: 'row' }}>

                <View style={{ flex: 1, width: (Metrics.screenWidth / 2) + Scale(100) }}>
                    <TextView
                        style={[styles.textDesc, {lineHeight: Scale(20)}]}
                        text={props.cityTour}
                    />
                </View>

                <View style={{ flex: 1, width: (Metrics.screenWidth / 2) + Scale(140), alignItems: 'flex-end' }}>
                        <TextView
                            style={styles.textDesc}
                            text={"IDR " + props.price_tour}
                        />
                    </View>
            </View>

                <View style={{ flex: 1, flexDirection: 'row' }}>

                    <View style={{ flex: 1, width: (Metrics.screenWidth / 2) + Scale(100) }}>
                        <TextView
                            style={styles.textDesc}
                            text={props.total_adult +"x Adult"}
                        />
                    </View>

                    <View style={{ flex: 1, width: (Metrics.screenWidth / 2) + Scale(140), alignItems: 'flex-end' }}>
                        <TextView
                            style={styles.textDesc}
                            text={"IDR " + props.price_adult}
                        />
                    </View>
                </View>

                { props.total_child !== '0' && <View style={{ flex: 1, flexDirection: 'row' }}>

                    <View style={{ flex: 1, width: (Metrics.screenWidth / 2) + Scale(100) }}>
                        <TextView
                            style={styles.textDesc}
                            text={props.total_child +"x Child"}
                        />
                    </View>

                    <View style={{ flex: 1, width: (Metrics.screenWidth / 2) + Scale(140), alignItems: 'flex-end' }}>
                        <TextView
                            style={styles.textDesc}
                            text={"IDR " + props.price_child}
                        />
                    </View>
                </View>}



            <View style={{ flex: 1, flexDirection: 'row' }}>

                <View style={{ flex: 1, width: (Metrics.screenWidth / 2) + Scale(100) }}>
                    <TextView
                        style={styles.textDesc}
                        text={"Tax"}
                    />
                </View>

                <View style={{ flex: 1, width: (Metrics.screenWidth / 2) + Scale(140), alignItems: 'flex-end' }}>
                    <TextView
                        style={styles.textDesc}
                        text={"Free"}
                    />
                </View>
            </View>

            <View style={{ flex: 1, flexDirection: 'row' }}>

                <View style={{ flex: 1, width: (Metrics.screenWidth / 2) + Scale(100) }}>
                    <TextView
                        style={styles.textDesc}
                        text={"Service Charge"}
                    />
                </View>

                <View style={{ flex: 1, width: (Metrics.screenWidth / 2) + Scale(140), alignItems: 'flex-end' }}>
                    <TextView
                        style={[styles.textDesc, {color: "#00c783"}]}
                        text={"-IDR 0"}
                    />
                </View>
            </View>
        </View>

    </View>
    </ScrollView>
)

const TravelDetil = props => (


    <View style={styles.bgValue}>
        <TextView
            style={styles.textTitle}
            text={props.name}
        />

        <TextView
            style={styles.textDesc}
            text={props.email}
        />

        <View style={{ flex: 1, flexDirection: 'row' }}>

            <View style={{ flex: 1, width: (Metrics.screenWidth / 2) + Scale(100) }}>
                <TextView
                    style={styles.textDesc}
                    text={props.no_tlp}
                />
            </View>

            <View style={{ flex: 1, width: (Metrics.screenWidth / 2) + Scale(140), alignItems: 'flex-end' }}>
                <TextView
                    style={[styles.textDesc, {borderRadius: Scale(6), borderColor: '#dddddd',
                    borderWidth: Scale(1), paddingHorizontal: Scale(8),
                    paddingVertical: Scale(2),}]}
                    text={props.type}
                />
            </View>
        </View>


    </View>
)

const Itinerary = props => (
    <ScrollView style ={{flex  : 1}}>
    <View style={{ flex: 1, marginTop: Scale(40), marginBottom: Scale(80), backgroundColor: Colors.white, padding: Scale(8) }}>
        {props.Iternery.length !== 0 &&
            props.Iternery.map((item, i) =>
                <View>
                    <View style={{ backgroundColor: Colors.white }}>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ alignItems: 'center', paddingTop: Scale(3), }}>
                                {(i !== 0) && <Dash style={{ width: 1, flex: 1, flexDirection: 'column' }} />}
                                <View style={styles.oval} />
                            </View>
                            <TextView
                                style={{ marginLeft: Scale(8), fontSize: Scale(14), color: "#000000" }}
                                text={'day ' + (i + 1)}
                            />
                        </View>
                        <View style={{ flexDirection: 'row', marginLeft: Scale(5) }}>
                            <View style={{ alignItems: 'center' }}>
                                {props.Iternery.length !== (i + 1) && <Dash style={{ width: 1, flex: 1, flexDirection: 'column' }} />}
                            </View>
                            <View>
                                {item.img && <Image
                                    source={{ uri: item.img }}
                                    resizeMethod='scale'
                                    style={{ marginLeft: Scale(8), borderRadius: Scale(8), width: Metrics.width, height: Scale(160) }}
                                />}
                                <TextView
                                    style={{ paddingBottom: Scale(8), marginLeft: Scale(8), fontSize: Scale(14), color: "#666666", lineHeight: Scale(22) }}
                                    text={item.desriptionItenary}
                                />
                            </View>
                        </View>
                    </View>
                </View>)}
    </View>
    </ScrollView>
)

const Note = props => (
    <ScrollView style ={{flex  : 1}}>
    <View style={{ flex: 1, marginTop: Scale(40), backgroundColor: Colors.white, marginBottom: Scale(80) }}>
        {props.TourInclude.length !== 0 && <TextView
            style={{ marginLeft: Scale(8), marginTop: Scale(4), fontSize: Scale(16), color: "#000000" }}
            text={'Included'}
        />}
        {
            props.TourInclude.map((item, i) =>
                <View style={{ backgroundColor: Colors.white, flexDirection: 'row', alignItems: 'center' }}>
                    {/* <TextView
                style={{ marginLeft: Scale(8), fontSize: Scale(16), tecolor: "#00c783" }}
                text={'✔'}
            /> */}

                    <Image
                        style={{ tintColor: "#00c783", height: Scale(16), width: Scale(16), marginLeft: Scale(8) }}
                        source={getIcon('ic_checked')} />

                    <TextView
                        style={{ marginLeft: Scale(8), marginTop: Scale(4), fontSize: Scale(14), color: "#000000" }}
                        text={item.incude}
                    />
                </View>
            )}

        <View style={{
            marginTop: Scale(16), marginLeft: Scale(8), marginRight: Scale(8), borderStyle: "solid",
            borderWidth: 1,
            borderColor: "#eeeeee"
        }} />

        {props.TourExclude.length !== 0 && <TextView
            style={{ marginLeft: Scale(8), marginRight: Scale(8), marginTop: Scale(16), fontSize: Scale(16), color: "#000000" }}
            text={'Excluded'}
        />}
        {props.TourExclude.length !== 0 &&

            props.TourExclude.map((item, i) => <View style={{ backgroundColor: Colors.white, flexDirection: 'row', alignItems: 'center', marginBottom: Scale(16) }}>
                {/* <TextView
                style={{ marginLeft: Scale(8), fontSize: Scale(16), color: "#00c783" }}
                text={'✔'}
            /> */}
                <Image
                    style={{ tintColor: "#00c783", height: Scale(16), width: Scale(16), marginLeft: Scale(8) }}
                    source={getIcon('ic_checked')} />

                <TextView
                    style={{ marginLeft: Scale(8), marginTop: Scale(4), fontSize: Scale(14), color: "#000000" }}
                    text={item.exclude}
                />
            </View>)}
    </View>
    </ScrollView>
)

const renderPagination = (index, total, context) => {
    return (
        <View style={{
            position: 'absolute',
            bottom: 10,
            right: 10
        }}>
            <TextView style={{ color: 'white' }}>
                <TextView style={{
                    color: 'white',
                    fontSize: 20
                }}>{index + 1}</TextView>/{total}
            </TextView>
        </View>
    )
}


const styles = StyleSheet.create({
    frame: {
        flex: 1,
        backgroundColor: Colors.whitesmoke
    },
    lableTitle: {
        fontSize: Scale(16), color: Colors.white
    },
    titlePassanger: {
        fontSize: Scale(16),
        bottom: Scale(8),
        color: Colors.blue
    },
    item_header: {
        paddingHorizontal: Scale(16),
        paddingVertical: Scale(8),
        // backgroundColor: Colors.concrete,
        fontSize: Scale(14),
        color: '#666666'
    },
    item_frame: {
        paddingHorizontal: Scale(16),
        paddingVertical: Scale(8),
    },
    item_name: {
        fontSize: Fonts.size.regular,
        color: Colors.black
    },
    item_code: {
        fontSize: Fonts.size.small,
        color: Colors.warm_grey,
    },
    oval: {
        width: Scale(11),
        height: Scale(11),
        borderStyle: "solid",
        borderWidth: Scale(3),
        borderRadius: Scale(8),
        borderColor: '#4778fb'
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'black'
    },
    text: {
        color: '#fff',
        fontSize: 30,
        fontWeight: 'bold'
    },

    image: {
        flex: 1
    },
    image2: {
        flex: 1,
        margin: Scale(30),
        resizeMode: 'stretch'
    },
    slide: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    text: {
        color: '#000000',
        fontSize: 30,
        fontWeight: 'bold'
    },
    bgToolbar: {
        height: Scale(48),
        justifyContent: 'flex-end',
        paddingLeft: Scale(16),
        paddingBottom: Scale(8),
        backgroundColor: "#f5f5f5"
    },
    textToolbar: {
        height: Scale(16),
        fontSize: Scale(14),
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#aaaaaa"
    },
    textTitle: {
        height: Scale(25),
        fontSize: Scale(16),
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        color: "#000000"
    },

    textDesc: {
        height: Scale(25),
        fontSize: Scale(14),
        fontWeight: "normal",
        fontStyle: "normal",
        letterSpacing: 0,
        color: Colors.brownis_gray
    },

    bgValue: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: Scale(16),
        backgroundColor: Colors.white
    },

});