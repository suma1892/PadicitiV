import React, {Component} from "react";
import {StyleSheet,ScrollView, Animated, Dimensions, Platform, Text, TouchableOpacity, View, Image} from "react-native";
import { TabNavigator} from 'react-navigation';
import { Colors, Metrics, Toolbar, TextView, Fonts, Touchable, LoadingFull, Alert} from '../../Components'
import {Body, Header, List, ListItem as Item, ScrollableTab, Tab, TabHeading, Tabs, Title} from "native-base";
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
import {NavigationActions } from 'react-navigation';
const finish = NavigationActions.back({ key: "" });
import { _OS} from '../../Assets';
import { JSONGetFile } from '../../Services/JsonService'
import { getURL } from '../../Services/API'
import {getIcon } from '../../Assets';
import {Function,STRING} from '../../Utils'
import { ListWrite } from '../../Utils/dummy';

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const IMAGE_HEIGHT = Scale(250);
const HEADER_HEIGHT = Platform.OS === "ios" ? Scale(64) : Scale(50);
const SCROLL_HEIGHT = IMAGE_HEIGHT - HEADER_HEIGHT;
const THEME_COLOR = "#ffffff";
const FADED_THEME_COLOR = "rgba(85,186,255, 0.8)";
import Dash from 'react-native-dash';
const {height} = Dimensions.get('window');
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
    this.nScroll.addListener(Animated.event([{value: this.scroll}], {useNativeDriver: false}));

    this.state = {
        tour_list: [],
        loading: false,
        tab_active : 'Price',
        total_adult : 1,
        total_child : 0,
        price_adult : 1000000,
        price_child : 1000000,
        countryName : null,
        about_desc : null,
        TourInclude : [],
        TourExclude : [],
        Iternery : [],
        loading: true,
        screenHeight :0,
        typeDate : null,
        msAvailableDate: null,
        activeTab: 0,
        Image : [],
        height: Metrics.screenHeight,
        pop_up : false,
        review:[],
        depart_date : Function.FormeteDate(Function.get_today(),"YYYY-MM-DD", 'DD MMM YYYY'),
        return_date : Function.FormeteDate(Function.get_next_two_today(Function.get_today()),"YYYY-MM-DD", 'DD MMM YYYY'),
    }
  }

  backAndroid() {
    this.props.navigation.dispatch(finish)
    return true
}


  componentDidMount(){
      this.GetData();
  }

  GotoBooking(){
    const { params } = this.props.navigation.state;
      if ((this.state.total_adult+this.state.total_child) > 20){
        Alert("Jumlah penumpang tidak boleh lebih dari 20 orang")
      } else {

        this.props.navigation.navigate('BookingTour', {
            idTour : params.idTour,
            date : this.state.depart_date, 
            destinination : params.destinination,
            total_adult :this.state.total_adult,
            total_child :this.state.total_child,
            price_adult :this.state.price_adult,
            price_child :this.state.price_child,
            depart_date : this.state.depart_date,
            return_date : this.state.return_date,
            typeDate : this.state.typeDate,
            msAvailableDate : this.state.msAvailableDate

             })
      }
  }

  ActivityResult = (data) => {
    switch (data.slug) {
        case 'review':
        this.GetData('review')
            break
            case 'depart_date':
            this.setState({depart_date : Function.FormeteDate(data.depart_date,"YYYY-MM-DD", 'DD MMM YYYY')}, () =>{this.props.navigation.navigate('CalendarScreen', {slug: 'return_date', return_date : Function.FormeteDate(Function.get_next_two_today(this.state.depart_date),"YYYY-MM-DD", 'DD MMM YYYY'), depart_date : this.state.depart_date, ActivityResult: this.ActivityResult})})
            break
            case 'return_date': 
            this.setState({return_date : Function.FormeteDate(data.return_date,"YYYY-MM-DD", 'DD MMM YYYY')}, () =>{this.GotoBooking()})
            break;
    }
}

  
    Tab1 = (i, params) =><View style={{flex : 1}}>
       { this.state.activeTab === 0 && <Price
            Adultminus={() => this.setState({ total_adult: this.state.total_adult != 1 ? this.state.total_adult - 1 : 1 })}
            Adultplus={() => this.setState({ total_adult: this.state.total_adult + 1 })}
            PriceAdult={Function.convertToPrice(this.state.price_adult)}
            TotalAdult={this.state.total_adult}
            Childminus={() => this.setState({ total_child: this.state.total_child != 0 ? this.state.total_child - 1 : 0 })}
            Childplus={() => this.setState({ total_child: this.state.total_child + 1 })}
            PriceChild={Function.convertToPrice(this.state.price_child)}
            TotalChild={this.state.total_child}
            Country ={params.destinination.city_name}
            onPressReview ={() => this.props.navigation.navigate('ReviewTour',{idTour : params.idTour, ActivityResult: this.ActivityResult, slug : 'review' })}
            ListReview={this.state.review}
            TotalReviews={this.state.review.length} />}
    </View>;

    Tab2 = (i) => <View style={{flex : 1 , paddingTop : Scale(8)}}>
      { this.state.activeTab === 1 &&  <About
            city={this.state.countryName}
            description={this.state.about_desc}
            arrayHiglight={[]}
      LatLong={null} /> }
    </View>;

    Tab3 = (i) => <View style={{flex : 1, paddingTop : Scale(8)}}>
        { this.state.activeTab === 2 && <Itinerary
            Iternery={this.state.Iternery} />}
    </View>;

    Tab4 = (i) => <View  style={{flex : 1 , paddingTop : Scale(8)}}>
        { this.state.activeTab === 3 && <Note
            TourInclude={this.state.TourInclude}
            TourExclude={this.state.TourExclude} />}
    </View>;

  GetData = (type) => {
    const { params } = this.props.navigation.state;
    this.setState({ loading: true })
    let url = type ? getURL('url_get_all_review', params.idTour) :getURL('url_get_detil_tour', params.idTour)
    let parameter = null
    let data = []
    let arr_item =[]
    JSONGetFile(url, parameter)
        .then((respone) => {
            console.log(respone.review)
            switch (respone.respCode) {
                case '0':
                   
                if (type ===  'review'){
                    this.setState({review : respone.review, loading: false})
                } else {
                    this.setState({price_adult : respone.tour[0].priceAdult,
                        price_child : respone.tour[0].priceChild,
                        countryName: respone.tour[0].countryName + ' - ',
                        about_desc : respone.tour[0].aboutTour, 
                        TourInclude : respone.tour[0].TourInclude,
                        TourExclude : respone.tour[0].TourExclude,
                        Iternery : respone.tour[0].msItenary,
                        typeDate :respone.tour[0].typeDate,
                        msAvailableDate : respone.tour[0].msAvailableDate[0],
                        Image :  respone.tour[0].msTourImage}, ()=>{ this.GetData('review')})
                }
                        
                    break
                default:

                    this.setState({ loading: false }, ()=>{
                        if(type !== 'review'){
                            this.backAndroid()
                        }
                    })
                    break}
        }).catch((error) => {
            this.setState({ loading: false }, () =>{
                if(type !== 'review'){
                    this.backAndroid()
                }
            })
        })
}
  
  render() {
    const { params } = this.props.navigation.state;
    return (
      <View style={{flex : 1, backgroundColor: '#4778fb'}}>
      
        <Animated.View style={{position: "absolute", width: "100%", backgroundColor: this.headerBg, zIndex: 1}}>
        <Toolbar
                    arrow_back
                    style={{ backgroundColor: '#4778fb' }}
                    onPress={() => this.backAndroid()}
                    View={
                        <View>
                            <TextView
                                style={styles.lableTitle}
                                text={params.destinination.city_name}
                            />
                            {/* <TextView
                                style={{ fontSize: Scale(14), color: Colors.white }}
                                text={Function.FormeteDate(params.date, 'DD MMM YYYY', 'DD MMM YYYY')}
                            /> */}
                        </View>}
                />
        </Animated.View>
        <View style={{ height: Scale(14),marginTop: _OS(Scale(70),Scale(55)), borderTopLeftRadius: Scale(16), borderTopRightRadius: Scale(16), backgroundColor: Colors.white }}/>
        <Animated.ScrollView
            ref="ListView"
          scrollEventThrottle={5}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.nScroll}}}], {useNativeDriver: true})}
          style={{zIndex: 0}}
          >
          <Animated.View style={{
            transform: [{translateY: Animated.multiply(this.nScroll, 0.65)}, {scale: this.imgScale}],
            backgroundColor: THEME_COLOR
          }}>
          <Animated.View style={{ width: "100%", opacity: this.imgOpacity, marginTop : Scale(4), backgroundColor: Colors.white}}>
         
          <CardImage
          Image ={this.state.Image}
          onPress={() => this.setState({pop_up : true})}
          />
          </Animated.View>
    
          </Animated.View>
          
          <Tabs  
                prerenderingSiblingsNumber={4}
                onChangeTab={({ i }) => {
                    this.setState({ height: this.heights[i], activeTab: i })
                }}
                renderTabBar={(props) => <Animated.View
                    style={{position:'absolute' ,transform: [{ translateY: this.tabY }], zIndex: 1, width: "100%", backgroundColor: "white"}}>
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
        </Animated.ScrollView>

        <View style={{width : '100%' , height : Scale(80), position :'absolute',bottom: 0 }}>
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
                            text={'IDR ' + Function.convertToPrice(((this.state.total_adult * this.state.price_adult) + (this.state.total_child * this.state.price_child)))}
                        />
                    </View>

                    <Touchable
                    onPress ={() =>  this.props.navigation.navigate('CalendarScreen', {slug: 'depart_date', depart_date : this.state.depart_date, ActivityResult: this.ActivityResult,})}>
                    <View style={{ flex: 1, alignItems: 'flex-end' }}>
                        <View style={{ width: 90, height: 45, borderRadius: 8, backgroundColor: "#00c783", alignItems: 'center', justifyContent: 'center' }}>
                            <TextView
                                numberOfLines={1}
                                ellipsize={'tail'}
                                style={{ fontSize: Scale(14), color: "#ffffff" }}
                                text={'SELECT'}
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

                <Touchable onPress={() => this.setState({pop_up : false})}>
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
                title = {STRING.Label.please_wait}
                sub_title = {STRING.Label.page}/>
      </View>
    )
  }
}

const About = props => (
    <View style={{flex : 1, backgroundColor: Colors.white, padding: Scale(8), marginTop:Scale(40), marginBottom:Scale(80) }}>
        <TextView
            style={{ fontSize: Scale(14), color: "#666666", lineHeight: Scale(22) }}
            text={props.city + props.description}
        />

        {props.LatLong && <TextView
            style={{ marginTop: Scale(16), fontSize: Scale(16), color: "#666666" }}
            text={'Location'}
        />}

        {props.LatLong &&  <Image
            style={{marginTop : Scale(16), height : Scale(160)}}
            source={{uri : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqQEywCzXSGZgRLyOGKEzwBOBzIW_-3ANZETdo-Pmpnpzjit_5'}}
            resizeMode='stretch'
        />}

         {props.arrayHiglight.length !==0 && <TextView
            style={{ marginTop: Scale(16), fontSize: Scale(16), color: "#666666" }}
            text={'Highlights: '}
        />}

        {props.arrayHiglight.length !==0 && <View style={{flexDirection : 'row'}}>
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
)

const CardImage = props =>(
    <Touchable
    onPress={props.onPress}>
    <View>
        {props.Image.length >= 3 && <View style={{ flexDirection: 'row', marginRight: Scale(16), marginBottom : Scale(16), marginLeft : Scale(16), height: Scale(210) }}>
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
             <View style={{flex:1, backgroundColor: Colors.white,marginTop:Scale(40),marginBottom:Scale(80)}}>
                 <View style={{ padding: Scale(8) }}>
                     <View style={{ flexDirection: 'row' }}>
                         <View style={{ height: Scale(80), width: Metrics.screenWidth / 2, justifyContent: 'center' }}>
                             <TextView
                                 numberOfLines={1}
                                 ellipsize={'tail'}
                                 style={{ fontSize: Scale(14), fontWeight: "500", color: Colors.black }}
                                 text={'Adult - Explore ' + props.Country}
                             />
                             <View style={{ flexDirection: 'row' }}>
                                 <TextView
                                     style={{ fontSize: Scale(14), fontWeight: "500", color: '#4778fb' }}
                                     text={'IDR ' + props.PriceAdult}
                                 />
                                 <TextView
                                     style={{ fontSize: Scale(14), fontWeight: "500", color: '#aaaaaa' }}
                                     text={'/pax'}
                                 />
                             </View>
                         </View>
 
                         <View style={{ height: Scale(90), width: Metrics.screenWidth / 2, justifyContent: 'center', alignItems: 'center' }}>
                             <TextView
                                 style={{ fontSize: Scale(12), fontWeight: "500", color: '#aaaaaa' }}
                                 text={'Traveler'}
                             />
                             <View style={{ flexDirection: 'row' }}>
                                 <Touchable onPress={props.Adultminus}>
                                     <Image
                                         source={getIcon('ic_minus')}
                                         resizeMode={'contain'}
                                         
                                         style={{tintColor: "#00c783", marginTop: Scale(14), width: Scale(24), height: Scale(24) }}
                                     />
                                 </Touchable>
                                 <TextView style={{ height: Scale(60), paddingTop: Scale(12), paddingLeft: Scale(8), paddingRight: Scale(8), fontSize: Scale(18), color: "#000000" }}>{props.TotalAdult.toString()}</TextView>
                                 <Touchable onPress={props.Adultplus}>
                                     <Image
                                         source={getIcon('ic_plus')}
                                         resizeMode={'contain'}
                                         style={{tintColor: "#00c783", marginTop: Scale(14), width: Scale(24), height: Scale(24) }}
                                     />
                                 </Touchable>
                             </View>
                         </View>
                     </View>
 
                     <View style={{ height: 2, borderStyle: "solid", borderWidth: 1, borderColor: "#eeeeee" }} />
 
                     <View style={{ flexDirection: 'row' }}>
                         <View style={{ height: Scale(80), width: Metrics.screenWidth / 2, justifyContent: 'center' }}>
                             <TextView
                                 numberOfLines={1}
                                 ellipsize={'tail'}
                                 style={{ fontSize: Scale(14), fontWeight: "500", color: Colors.black }}
                                 text={'Child - Explore ' + props.Country}
                             />
                             <View style={{ flexDirection: 'row' }}>
                                 <TextView
                                     style={{ fontSize: Scale(14), fontWeight: "500", color: '#4778fb' }}
                                     text={'IDR ' + props.PriceChild}
                                 />
                                 <TextView
                                     style={{ fontSize: Scale(14), fontWeight: "500", color: '#aaaaaa' }}
                                     text={'/pax'}
                                 />
                             </View>
                         </View>
 
                         <View style={{ height: Scale(90), width: Metrics.screenWidth / 2, justifyContent: 'center', alignItems: 'center' }}>
                             <TextView
                                 style={{ fontSize: Scale(12), fontWeight: "500", color: '#aaaaaa' }}
                                 text={'Traveler'}
                             />
                             <View style={{ flexDirection: 'row' }}>
                                 <Touchable onPress={props.Childminus}>
                                     <Image
                                         source={getIcon('ic_minus')}
                                         resizeMode={'contain'}
                                         style={{ tintColor: "#00c783",marginTop: Scale(14), width: Scale(24), height: Scale(24) }}
                                     />
                                 </Touchable>
                                 <TextView style={{ height: Scale(60), paddingTop: Scale(12), paddingLeft: Scale(8), paddingRight: Scale(8), fontSize: Scale(18), color: "#000000" }}>{props.TotalChild.toString()}</TextView>
                                 <Touchable onPress={props.Childplus}>
                                     <Image
                                         source={getIcon('ic_plus')}
                                         resizeMode={'contain'}
                                         tintColor={"#00c783"}
                                         style={{ tintColor: "#00c783",marginTop: Scale(14), width: Scale(24), height: Scale(24) }}
                                     />
                                 </Touchable>
                             </View>
                         </View>
                     </View>
                 </View>
                 <View style={{ height: 2, borderStyle: "solid", borderWidth: 1, borderColor: "#eeeeee" }} />
                 <View style={{padding : Scale(8)}}>
                     <View style={{ flexDirection: 'row',}}>
                         <View style={{ width: Metrics.screenWidth / 2, justifyContent:'center' }}>
                             <TextView
                                 style={{ fontSize: Scale(16), fontWeight: "500", color: '#000000' }}
                                 text={props.TotalReviews + ' Reviews'}
                             />
                         </View>
                         <Touchable onPress ={props.onPressReview}>
                         <View style={{ width: Metrics.screenWidth / 2, alignItems: 'flex-end', paddingRight: Scale(16) }}>
                             <View style={{ width: Scale(117), height: Scale(40), borderRadius: Scale(19.5), borderStyle: "solid", borderWidth: 1, borderColor: "#00c783", alignItems: 'center', justifyContent: 'center' }}>
                                 <TextView
                                     style={{ fontSize: Scale(14), fontWeight: "500", color: '#00c783' }}
                                     text={'Write a review'}
                                 />
                             </View>
                         </View>
                         </Touchable>
                     </View>
                 </View>
                         {props.ListReview.length !== 0 && props.ListReview.map((item, index)=>(
                             <View
                             key ={index}
                             style ={{padding : Scale(8)}}>
                                 <View style={{ flexDirection: 'row', }}>
 
                                     <View>
                                         <View style={{ width: Scale(45), height: Scale(45), backgroundColor: item.colour, borderRadius: Scale(100), justifyContent: 'center', alignItems: 'center' }}>
                                             <TextView
                                                 style={{ fontSize: Scale(16), fontWeight: "500", color: '#ffffff' }}
                                                 text={item.simboleName}
                                             />
                                         </View>
                                     </View>
 
                                     <View style={{ width: Metrics.screenWidth / 3, marginLeft: Scale(14) }}>
                                         <TextView
                                             ellipsize
                                             style={{ fontSize: Scale(16), fontWeight: "500", color: '#666666' }}
                                             text={item.name}
                                         />
                                         <View style={{ flexDirection: 'row', marginTop: Scale(4) }}>
                                             {
                                                 Array.from({ length: 5 }).map((_, i) =>
                                                     <Image
                                                         key={i}
                                                         source={getIcon('ic_star')}
                                                         style={{ height: Scale(13), width: Scale(13) }}
                                                         resizeMode='contain'
                                                     />)}
                                         </View>
                                     </View>
 
                                     <View style={{ width: Metrics.screenWidth / 2.4, alignItems: 'flex-end', justifyContent: 'flex-start' }}>
                                         <TextView
                                             style={{ fontSize: Scale(12), fontWeight: "500", color: '#aaaaaa' }}
                                             text={Function.FormeteDate(item.dateReview, 'YYYY-MM-DD', 'DD MMM YYYY')}
                                         />
                                     </View>
                                 </View>
 
                                 <TextView
                                     style={{ marginTop: Scale(8), fontSize: Scale(12), fontWeight: "500", color: '#aaaaaa', lineHeight: Scale(22) }}
                                     text={item.description}
                                 />
                                 
 
                             </View>
                         ))}
             </View>
 )

 const Itinerary = props => (
    <View style={{flex : 1, marginTop:Scale(40),marginBottom:Scale(80),backgroundColor: Colors.white, padding: Scale(8)}}>
        {props.Iternery.length !== 0 &&
        props.Iternery.map((item, i) =>
        <View>
        <View style={{backgroundColor: Colors.white}}>
            
                 <View style={{ flexDirection: 'row', alignItems:'center' }}>
                     <View style={{ alignItems: 'center', paddingTop: Scale(3),  }}>
                     {(i!== 0) && <Dash style={{width:1,flex:1, flexDirection:'column'}}/>}
                         <View style={styles.oval} />
                     </View>
                     <TextView
                        style={{ marginLeft: Scale(8), fontSize: Scale(14), color: "#000000" }}
                        text={'day ' +(i+1)}
                    />
                 </View>
                 <View style={{ flexDirection: 'row', marginLeft: Scale(5)}}>
                     <View style={{ alignItems: 'center' }}>
                         {props.Iternery.length !== (i +1) && <Dash style={{width:1,flex:1, flexDirection:'column'}}/>}
                     </View>
                     <View>
                         {item.img && <Image
                             source={{ uri: item.img }}
                             resizeMethod='scale'
                             style={{ marginLeft: Scale(8), borderRadius: Scale(8), width: Metrics.width, height: Scale(160) }}
                         />}
                         <TextView
                             style={{paddingBottom: Scale(8),marginLeft: Scale(8), fontSize: Scale(14), color: "#666666", lineHeight: Scale(22) }}
                             text={item.desriptionItenary} 
                         />
                     </View>
                 </View>
        </View>
        </View>)}
    </View>
)

const Note = props => (
    <View style={{flex : 1, marginTop:Scale(40),backgroundColor: Colors.white , marginBottom:Scale(80)}}>
     {props.TourInclude.length !== 0 && <TextView
                style={{ marginLeft: Scale(8), marginTop: Scale(4), fontSize: Scale(16), color: "#000000" }}
                text={'Included'}
            />}
        {
        props.TourInclude.map((item, i) =>
        <View style={{backgroundColor: Colors.white,flexDirection: 'row', alignItems :'center' }}>
            {/* <TextView
                style={{ marginLeft: Scale(8), fontSize: Scale(16), tecolor: "#00c783" }}
                text={'✔'}
            /> */}

            <Image
            style ={{tintColor: "#00c783",height : Scale(16), width : Scale(16), marginLeft: Scale(8)}}
            source ={getIcon('ic_checked')}/>

            <TextView
                style={{ marginLeft: Scale(8), marginTop: Scale(4), fontSize: Scale(14), color: "#000000" }}
                text={item.incude}
            />
        </View>
        )}

        <View style ={{ marginTop: Scale(16), marginLeft: Scale(8), marginRight : Scale(8), borderStyle: "solid",
  borderWidth: 1,
  borderColor: "#eeeeee"}}/>

       {props.TourExclude.length !== 0 &&<TextView
                style={{ marginLeft: Scale(8), marginRight : Scale(8), marginTop: Scale(16), fontSize: Scale(16), color: "#000000" }}
                text={'Excluded'}
            />}
        {props.TourExclude.length !== 0 &&
        
        props.TourExclude.map((item, i) =><View style={{backgroundColor: Colors.white,flexDirection: 'row', alignItems :'center', marginBottom :Scale(16)  }}>
            {/* <TextView
                style={{ marginLeft: Scale(8), fontSize: Scale(16), color: "#00c783" }}
                text={'✔'}
            /> */}
            <Image
            style ={{tintColor: "#00c783",height : Scale(16), width : Scale(16), marginLeft: Scale(8)}}
            source ={getIcon('ic_checked')}/>
            
            <TextView
                style={{ marginLeft: Scale(8), marginTop: Scale(4), fontSize: Scale(14), color: "#000000" }}
                text={item.exclude}
            />
        </View>)}
    </View>
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
    oval : {
        width: Scale(11),
        height: Scale(11),
        borderStyle: "solid",
        borderWidth: Scale(3),
        borderRadius:Scale(8),
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
        resizeMode:'stretch'
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
    
});