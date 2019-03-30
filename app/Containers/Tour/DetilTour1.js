import React, {Component} from "react";
import {StyleSheet, Animated, Dimensions, Platform, Text, TouchableOpacity, View, Image, ScrollView} from "react-native";
import { TabNavigator} from 'react-navigation';
import { Colors, Metrics, Toolbar, TextView, Fonts, Touchable, } from '../../Components'
import {Body, Header, List, ListItem as Item, ScrollableTab, Tab, TabHeading, Tabs, Title} from "native-base";
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
import { _OS} from '../../Assets';
import { JSONGetFile } from '../../Services/JsonService'
import { getURL } from '../../Services/API'
import {getIcon } from '../../Assets';
import {Function} from '../../Utils'
import { ListWrite } from '../../Utils/dummy';

const {width: SCREEN_WIDTH} = Dimensions.get("window");
const IMAGE_HEIGHT = Scale(250);
const HEADER_HEIGHT = Platform.OS === "ios" ? Scale(64) : Scale(50);
const SCROLL_HEIGHT = IMAGE_HEIGHT - HEADER_HEIGHT;
const THEME_COLOR = "#4778fb";
const FADED_THEME_COLOR = "rgba(85,186,255, 0.8)";
import Dash from 'react-native-dash';

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
state = {
  activeTab: 0,
  height: Metrics.screenHeight
};
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
        loading: true
    }
  }

  componentDidMount(){
      this.GetData();
  }

  GetData = () => {
    this.setState({ loading: true })
    let url = getURL('url_get_detil_tour')
    let parameter = null
    let data = []
    let arr_item =[]
    JSONGetFile(url, parameter)
        .then((respone) => {
            console.log(respone.tour[0].countryName)
            switch (respone.respCode) {
                case '0':
                   

                    // respone.tour[0].msItenary.map((item, i) => {
                    //     arr_item.push({org : 'Day ' + (i+1), org_img : respone.tour[0].msTourImage[i].imageName, org_desc : item.desriptionItenary, dest : 'Day ' + (i+2), dest_img : respone.tour[0].msTourImage[i+1].imageName, dest_desc : respone.tour[0].msItenary[i+1].desriptionItenary})
                    // })

                    this.setState({price_adult : respone.tour[0].priceAdult,
                        price_child : respone.tour[0].priceChild,
                        countryName: respone.tour[0].countryName + ' - ',
                        about_desc : respone.tour[0].aboutTour, 
                        TourInclude : respone.tour[0].TourInclude,
                        TourExclude : respone.tour[0].TourExclude,
                        Iternery : respone.tour[0].msItenary})
                    break
                default:

                    this.setState({ loading: false })
                    break}
        }).catch((error) => {
            this.setState({ loading: false })
        })
}

  
  render() {
    return (
      <View>
        <Animated.View style={{position: "absolute", width: "100%", backgroundColor: this.headerBg, zIndex: 1}}>
        <Toolbar
                    arrow_back
                    style={{ backgroundColor: 'transparent' }}
                    onPress={() => this.backAndroid()}
                    View={
                        <View>
                            <TextView
                                style={styles.lableTitle}
                                text={'2 days 1 night Explore Belitung Island'}
                            />
                            <TextView
                                style={{ fontSize: Scale(14), color: Colors.white }}
                                text={'23 September 2019 - 2 Days'}
                            />
                        </View>}
                />
        </Animated.View>
        <Animated.ScrollView
          scrollEventThrottle={5}
          showsVerticalScrollIndicator={false}
          onScroll={Animated.event([{nativeEvent: {contentOffset: {y: this.nScroll}}}], {useNativeDriver: true})}
          style={{zIndex: 0}}>
          <Animated.View style={{
            transform: [{translateY: Animated.multiply(this.nScroll, 0.65)}, {scale: this.imgScale}],
            backgroundColor: THEME_COLOR
          }}>
          <Animated.View style={{height: IMAGE_HEIGHT, width: "100%", opacity: this.imgOpacity, marginTop: Scale(43.5) + _OS(30, 0), backgroundColor: Colors.white}}>
          <CardImage/>
          </Animated.View>
    
          </Animated.View>
          
          <Tabs
            prerenderingSiblingsNumber={4}
            onChangeTab={({i}) => {
              this.setState({height: this.heights[i], activeTab: i})
            }}
            renderTabBar={(props) => <Animated.View
              style={{transform: [{translateY: this.tabY}], zIndex: 1, width: "100%",backgroundColor: "white",}}>
              <ScrollableTab {...props}
                             renderTab={(name, page, active, onPress, onLayout) => (
                               <TouchableOpacity key={page}
                                                 onPress={() => onPress(page)}
                                                 onLayout={onLayout}
                                                 activeOpacity={0.4}>
                                 <Animated.View
                                   style={{
                                    flex : 1,
                                     backgroundColor:  this.tabBg,
                                    
                                   }}>
                                   <TabHeading scrollable
                                               style={{
                                                 backgroundColor: "transparent",
                                                 width: SCREEN_WIDTH / 4,
                                                 alignItems: 'center',
                                                 marginTop : Scale(10)

                                               }}
                                               active={active}>
                                     <Animated.Text style={{
                                       fontWeight: active ? "bold" : "normal",

                                       color: Colors.black,
                                       fontSize: Scale(13),
                                       alignSelf: "center"
                                     }}>
                                       {name}
                                     </Animated.Text>
                                   </TabHeading>
                                 </Animated.View>
                               </TouchableOpacity>
                             )}
                             underlineStyle={{backgroundColor: this.textColor}}/>
            </Animated.View>
            }>
            <Tab heading="Price">
                        <View style={{ flex:1 }}
                         onLayout={({nativeEvent: {layout: {height}}}) => {
                            this.heights[0] = height;
                            if (this.state.activeTab === 0) this.setState({height})
                          }}>
                            <Price
                                Adultminus={() => this.setState({ total_adult: this.state.total_adult != 1 ? this.state.total_adult - 1 : 1 })}
                                Adultplus={() => this.setState({ total_adult: this.state.total_adult + 1 })}
                                PriceAdult={Function.convertToPrice(this.state.price_adult)}
                                TotalAdult={this.state.total_adult}
                                Childminus={() => this.setState({ total_child: this.state.total_child != 0 ? this.state.total_child - 1 : 0 })}
                                Childplus={() => this.setState({ total_child: this.state.total_child + 1 })}
                                PriceChild={Function.convertToPrice(this.state.price_child)}
                                TotalChild={this.state.total_child}
                                ListReview={ListWrite.product}
                                TotalReviews={'20'} />
                        </View>
            </Tab>
            <Tab heading="About"
            >
            <View style={{height: Metrics.screenHeight, backgroundColor : 'black'}}  
            onLayout={({nativeEvent: {layout: {height}}}) => {
                this.heights[1] =  Metrics.screenHeight;
                if (this.state.activeTab === 1) this.setState({height: Metrics.screenHeight})
              }}>
            <About
            city ={this.state.countryName}
            description ={this.state.about_desc}
            arrayHiglight = {[]}
            LatLong ={null}/>
            </View>
            </Tab>
            <Tab heading={'Itinerary'}>
            <View style={{height: Metrics.screenHeight}}  
            >
            <Itinerary
              Iternery= {this.state.Iternery}/>
            </View>
            </Tab>
            <Tab heading="Notes">
            <View style={{height: Metrics.screenHeight}}  
            onLayout={({nativeEvent: {layout: {height}}}) => {
                this.heights[3] =  height;
                if (this.state.activeTab === 3) this.setState({height: Metrics.screenHeight})
              }}>
              <Note
              TourInclude ={this.state.TourInclude}
              TourExclude ={this.state.TourExclude}/>
              </View>
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
                    onPress ={() => this.props.navigation.navigate('BookingTour')}>
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
        
      </View>
    )
  }
}

const About = props => (
    <ScrollView styles={{flex : 1}}>
            <View style={{ flex: 1, backgroundColor: Colors.white, padding: Scale(8) }}>
                <TextView
                    style={{ fontSize: Scale(14), color: "#666666" }}
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

const CardImage = props =>(
  
    <View style={{flexDirection: 'row', margin: Scale(16), height: Scale(210)}}>
        <Image
            source={{ uri: 'https://www.europegrouptrip.com/images/paris-switzerland-holiday-packages.jpg' }}
            resizeMethod='scale'
            style={{ borderRadius: Scale(8), width: Metrics.screenWidth / 2.5, height: Scale(210) }}
        />
        <View style={{ marginRight: Scale(16), marginLeft: Scale(16) }}>
            <Image
                source={{ uri: 'https://www.europegrouptrip.com/images/paris-switzerland-holiday-packages.jpg' }}
                resizeMethod='scale'
                style={{ borderRadius: Scale(8), width: Metrics.screenWidth / 2.5, height: Scale(140) }}
            />
            <View style={{ paddingTop: Scale(8) }}>
                <Image
                    source={{ uri: 'https://www.europegrouptrip.com/images/paris-switzerland-holiday-packages.jpg' }}
                    resizeMethod='scale'
                    style={{ borderRadius: Scale(8), width: Metrics.screenWidth / 2.5, height: Scale(62) }}
                />
                <View style={{ borderRadius: Scale(8), width: Metrics.screenWidth / 2.5, height: Scale(62), backgroundColor: 'rgba(52, 52, 52, 0.8)', position: 'absolute', alignItems: 'center', justifyContent: 'center', marginTop: Scale(8) }}>
                    <TextView
                        style={{ fontSize: Scale(14), color: '#ffffff' }}
                        text={'+15'}
                    />
                </View>
            </View>
        </View>

    </View>
   
)

const Price = props => (
    <ScrollView style={{flex: 1}}>
             <View style={{flex: 1, backgroundColor: Colors.white}}>
                 <View style={{ padding: Scale(8) }}>
                     <View style={{ flexDirection: 'row' }}>
                         <View style={{ height: Scale(80), width: Metrics.screenWidth / 2, justifyContent: 'center' }}>
                             <TextView
                                 numberOfLines={1}
                                 ellipsize={'tail'}
                                 style={{ fontSize: Scale(14), fontWeight: "500", color: Colors.black }}
                                 text={'Adult - Explore Belitung Tour'}
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
                                         source={getIcon('ic_group_minus')}
                                         resizeMode={'contain'}
                                         style={{ marginTop: Scale(14), width: Scale(24), height: Scale(24) }}
                                     />
                                 </Touchable>
                                 <TextView style={{ height: Scale(60), paddingTop: Scale(12), paddingLeft: Scale(8), paddingRight: Scale(8), fontSize: Scale(18), color: "#000000" }}>{props.TotalAdult.toString()}</TextView>
                                 <Touchable onPress={props.Adultplus}>
                                     <Image
                                         source={getIcon('ic_group_plus')}
                                         resizeMode={'contain'}
                                         style={{ marginTop: Scale(14), width: Scale(24), height: Scale(24) }}
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
                                 text={'Child - Explore Belitung Tour'}
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
                                         source={getIcon('ic_group_minus')}
                                         resizeMode={'contain'}
                                         style={{ marginTop: Scale(14), width: Scale(24), height: Scale(24) }}
                                     />
                                 </Touchable>
                                 <TextView style={{ height: Scale(60), paddingTop: Scale(12), paddingLeft: Scale(8), paddingRight: Scale(8), fontSize: Scale(18), color: "#000000" }}>{props.TotalChild.toString()}</TextView>
                                 <Touchable onPress={props.Childplus}>
                                     <Image
                                         source={getIcon('ic_group_plus')}
                                         resizeMode={'contain'}
                                         style={{ marginTop: Scale(14), width: Scale(24), height: Scale(24) }}
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
                         <View style={{ width: Metrics.screenWidth / 2, alignItems: 'flex-end', paddingRight: Scale(16) }}>
                             <View style={{ width: Scale(117), height: Scale(40), borderRadius: Scale(19.5), borderStyle: "solid", borderWidth: 1, borderColor: "#00c783", alignItems: 'center', justifyContent: 'center' }}>
                                 <TextView
                                     style={{ fontSize: Scale(14), fontWeight: "500", color: '#00c783' }}
                                     text={'Write a review'}
                                 />
                             </View>
                         </View>
                     </View>
                 </View>
                         {props.ListReview && props.ListReview.map((item, index)=>(
                             <View
                             key ={index}
                             style ={{padding : Scale(8)}}>
                                 <View style={{ flexDirection: 'row', }}>
 
                                     <View>
                                         <View style={{ width: Scale(45), height: Scale(45), backgroundColor: "#e386d1", borderRadius: Scale(100), justifyContent: 'center', alignItems: 'center' }}>
                                             <TextView
                                                 style={{ fontSize: Scale(16), fontWeight: "500", color: '#ffffff' }}
                                                 text={'RF'}
                                             />
                                         </View>
                                     </View>
 
                                     <View style={{ width: Metrics.screenWidth / 3, marginLeft: Scale(14) }}>
                                         <TextView
                                             style={{ fontSize: Scale(16), fontWeight: "500", color: '#666666' }}
                                             text={'Rizka Febrian'}
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
 
                                     <View style={{ width: Metrics.screenWidth / 2.4, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                                         <TextView
                                             style={{ fontSize: Scale(12), fontWeight: "500", color: '#aaaaaa' }}
                                             text={'Written on 18 Aug 18'}
                                         />
                                     </View>
                                 </View>
 
                                 <TextView
                                     style={{ marginTop: Scale(8), fontSize: Scale(12), fontWeight: "500", color: '#aaaaaa' }}
                                     text={'This was the most amazing tour I have ever been on! Japan was always on my bucket list but seemed hard to travel around but the One Life team have done a great job of putting this tour together.'}
                                 />
                                 
 
                             </View>
                         ))}
             </View>
             </ScrollView>
        
 )

 const Itinerary = props => (
<ScrollView style={{flex: 1,backgroundColor: Colors.white,}}>
<View>
        {props.Iternery.length !== 0 &&
        props.Iternery.map((item, i) =>
        <View>
        <View style={{backgroundColor: Colors.white}}>
            
                 <View style={{ flexDirection: 'row', alignItems:'center' }}>
                     <View style={{ alignItems: 'center', paddingTop: Scale(3),  }}>
                         <View style={styles.oval} />
                     </View>
                     <TextView
                        style={{ marginLeft: Scale(8), fontSize: Scale(12), color: "#000000" }}
                        text={'day ' +(i+1)}
                    />
                 </View>
                 <View style={{ flexDirection: 'row', marginLeft: Scale(4)}}>
                     <View style={{ alignItems: 'center' }}>
                         {props.Iternery.length !== (i +1) && <Dash style={{width:1,flex:1, flexDirection:'column'}}/>}
                     </View>
                     <View>
                         <Image
                             source={{ uri: item.img }}
                             resizeMethod='scale'
                             style={{ marginLeft: Scale(8), borderRadius: Scale(8), width: Metrics.width, height: Scale(160) }}
                         />
                         <TextView
                             style={{paddingBottom: Scale(8),marginLeft: Scale(8), fontSize: Scale(12), color: "#666666" }}
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
    <ScrollView style={{flex: 1,backgroundColor: Colors.white,}}>
    <View style={{backgroundColor: Colors.white, padding: Scale(8) }}>
     {props.TourInclude.length !== 0 && <TextView
                style={{ marginLeft: Scale(8), marginTop: Scale(4), fontSize: Scale(16), color: "#000000" }}
                text={'Included'}
            />}
        {props.TourInclude.length !== 0 &&
        props.TourInclude.map((item, i) =>
        <View style={{ flex: 1, backgroundColor: Colors.white,flexDirection: 'row', }}>
            <TextView
                style={{ marginLeft: Scale(8), fontSize: Scale(16), color: "#00c783" }}
                text={'✔'}
            />

            <TextView
                style={{ marginLeft: Scale(8), marginTop: Scale(4), fontSize: Scale(12), color: "#000000" }}
                text={item.incude}
            />
        </View>
        )}
       { props.TourExclude.length !== 0 &&<TextView
                style={{ marginLeft: Scale(8), marginTop: Scale(16), fontSize: Scale(16), color: "#000000" }}
                text={'Excluded'}
            />}
        {props.TourExclude.length !== 0 &&
        
        props.TourExclude.map((item, i) =><View style={{ flex: 1, backgroundColor: Colors.white,flexDirection: 'row', }}>
            <TextView
                style={{ marginLeft: Scale(8), fontSize: Scale(16), color: "#00c783" }}
                text={'✔'}
            />
            <TextView
                style={{ marginLeft: Scale(8), marginTop: Scale(4), fontSize: Scale(12), color: "#000000" }}
                text={item.exclude}
            />
        </View>)}
         
    </View>
    </ScrollView>
)


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
      wrapper: {
    },
    slide: {
      flex: 1,
      justifyContent: 'center',
      backgroundColor: 'transparent'
    },
    text: {
      color: '#fff',
      fontSize: 30,
      fontWeight: 'bold'
    },

    image: {
      flex: 1
    }
});