import React, { Component } from 'react'
import {
    StyleSheet,
    View,Platform,
    FlatList,
    ScrollView,
    Image, Dimensions, AppRegistry, BackHandler,
} from 'react-native'

import s from '../../Components/Styles'
import { Colors, 
    Metrics, 
    Container, 
    getIcon, 
    ToolbarV2 as Toolbar, 
 
    TextView as Text,NearPlace,CardReviewHotel,
    Button, LoadingFull} from '../../Components/index'
    import { API, getURL } from '../../Services/API'
    import { Parameter } from '../../Services/Parameter'
    import { JSONPostFile } from '../../Services/JsonService'
    import {Function, STRING } from '../../Utils'
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import { NearDestination , HotelType } from '../../Utils/dummy'
import Slick from 'react-native-slick';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps'
const backAction = NavigationActions.back({key:''}) 
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            parameter : null,
            hotelRoomPriceLst : null,
            imageLst : [],
            hotelInfoLst : null,
            loading : false, 
            region : {
                latitude: -6.300782155595371,
                longitude: 107.1515793,
                latitudeDelta: 10,
                longitudeDelta: 10,
              },
            listHotelType : HotelType.product,
            listNearPlace : NearDestination.product,
            imgHotel : {uri : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSDzRx7FhXhgzoyHggFnygyzEhm421D9-WUeZ6RZLfSra5DmYpd7w'},
            isImg :{uri: 'https://images.pexels.com/photos/1037999/pexels-photo-1037999.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'},
            hotel_address :'Jalan Sanif No.12 Siborongbrong Tapanuli Utara Medan, Indonesia',
            imgMap :{uri : 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQqQEywCzXSGZgRLyOGKEzwBOBzIW_-3ANZETdo-Pmpnpzjit_5'}
        });
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
        const { params } = this.props.navigation.state;
        // console.log(parrrams)

        this.setState({ region : {
            latitude:  parseFloat(params.data.latitude),
            longitude: parseFloat(params.data.longitude),
            latitudeDelta: 10,
            longitudeDelta: 10,
          }})
        this.Auth()
    }

    backAndroid() {
        this.props.navigation.dispatch(backAction)
        return true // Needed so BackHandler knows that you are overriding the default action and that it should not close the app
    }

    Auth = (type) => {
        const { params } = this.props.navigation.state;
        try {
            this.setState({ loading: true })
            let url = getURL('url_post_hotel_detail')
            let param = Parameter.DetilHotel(params.Parameter, { sesionid: params.sesionid, hotelCode: params.data.hotelCode })
            console.log(param)
            JSONPostFile(url, param).then((Respone) => {
                switch (Respone.respCode) {

                    case '0':
                        this.setState({ loading: false, hotelRoomPriceLst: Respone.availableRoomLst.hotelRoomPriceLst, imageLst: Respone.imageLst, hotelInfoLst: Respone.hotelInfoLst })
                        break
                    default:
                        this.setState({ loading: false }, () => {
                            this.backAndroid()
                        })
                        // Alert(Respone.inRespMsg)
                        break
                }

            }).catch((err) => {
                this.setState({ loading: false }, () => {
                    this.backAndroid()
                })

                console.log('err >>> ' + err)
            })
        } catch (Error) {
            this.setState({ loading: false }, () => {
                this.backAndroid()
            })
            console.log('Error >>> ', Error)
        }

    }
   
    render() {
        const { dispatch, navigate } = this.props.navigation;
        const { params } = this.props.navigation.state;
   
        let { imageLst , loadImage} = this.state
        const star = Array.from({ length: parseInt(Function.StarsHotel(params.data.categoryCode)) })
        return (
            <Container style={s.container}>
                <Toolbar
                    style={s.toolbar}
                    type={next => this.setState({ next })}
                    title={params.data.hotelName}
                    subtitle={params.Parameter[2].destination.title}
                    barStyle={s.toolbar}
                    left={[{
                        icon: 'ic_arrow_back',
                        onPress: () => dispatch(backAction)
                    }]}
                />
                <ScrollView>
                    <View style={{ width: Metrics.screenWidth, height: Metrics.screen.width / 1.7, }}>
                        
                    <Slick
                    dotColor = {Colors.white}
                    activeDotColor ={Colors.white}
                    style={{height : Metrics.screen.width / 1.7}}>
                        {imageLst && imageLst.map((item, i) => (
                                   
                                    <Image
                                    key={i}
                                    resizeMode='stretch'
                                    style={s.img_hotel}
                                    source={{ uri: item.imageUrl }}/>
                                ))}
                        </Slick>
                       
                    </View>
                    <View style={[s.divider, style.address]}>
                        <View style={s.lineHeight}>
                            <View style={{ flexDirection: 'row' }}>
                                {star.map((_, i) =>
                                    <Image
                                        key={i}
                                        source={getIcon('ic_star')}
                                        style={s.star}
                                        resizeMode='contain'
                                    />)}
                            </View>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={s.fontGraytiny}>{params.data.contactAddress}</Text>
                        </View>
                    </View>
                    <View style={[style.section, s.divider]}>
                        <Headertitle
                            title= {STRING.Label.facility}
                        />
                        {this.state.hotelInfoLst && this.state.hotelInfoLst.map((item, i) => (
                            item.groupCode === '70' &&
                            <Facilities
                                data={item.infoItemLst} />
                        ))}

                    </View>
                    <View style={[style.section, s.divider]}>
                        <View style={{ paddingVertical: Metrics.padding.small }}>
                         
                          {Platform.OS === 'ios' ? <Image
                                style={s.img_hotel}
                                source={this.state.imgMap}
                                resizeMode='cover'
                            /> : <MapView
                            provider ={PROVIDER_GOOGLE}
                            style={{height : Scale(200)}}
                            region={this.state.region}
                          >
                          </MapView>}
                            <Headertitle
                            title= {STRING.Label.near_favorite_place}
                        />
                        </View>


                        {this.state.hotelInfoLst && this.state.hotelInfoLst.map((item, i) => (
                            item.groupCode === '100' ?
                                item.infoItemLst.map((hotelInfoLst_item, index) => (
                                    // console.log(hotelInfoLst_item)
                                    <NearPlace
                                        key ={index}
                                        id={index + 1}
                                        destination_name={hotelInfoLst_item.featureName}
                                        distance={hotelInfoLst_item.addInfo}
                                    />
                                ))
                                : null
                        ))}
                    </View>
                    <View style={[style.section, s.divider]}>
                        {this.state.hotelRoomPriceLst && this.state.hotelRoomPriceLst.map((item, i) => {
                            console.log('red', i)
                            let { imageLst } = this.state
                            return (
                            <View key={i} style={[{ flex: 1 }]}>
                                <CardReviewHotel
                                    type={item.GrpRoomDesc}
                                    guest={params.Parameter[1].guest}
                                    //  add= {item.add}
                                    //  old_price= {item.totPriceBeforeDisc}
                                    new_price={'IDR ' + Function.convertToPrice(item.totNetPrice)}
                                    image={ imageLst[i] && imageLst[i].imageUrl}
                                    onPress={() => this.props.navigation.navigate('CheckOutHotel', { data: { guest: params.Parameter[1].guest, destination: params.Parameter[2], hotelName: params.data.hotelName, checkInDate: Function.FormeteDate(params.Parameter[3].checkInDate, 'YYYY-MM-DD', 'DD MMM YYYY'), offerTypeName: item.GrpRoomDesc },
                                     Parameter: { sesionid: params.sesionid, roomIdLst: item.RoomIdLst, dateFrom: Function.FormeteDate(params.Parameter[3].checkInDate, 'YYYY-MM-DD', 'YYYYMMDD'), dateTo: Function.FormeteDate(params.Parameter[4].checkOutDate, 'YYYY-MM-DD', 'YYYYMMDD'), hotelCode: params.data.hotelCode, roomCount: params.Parameter[5].room, deviceType: Platform.OS == 'ios' ? 'IOS' : 'Android', guest: params.Parameter[1].guest,} })}
                                />
                            </View>)
                            }
                        )}
                    </View>

                </ScrollView>
                <LoadingFull
                    visible={this.state.loading}
                    title={STRING.Label.please_wait}
                    sub_title={STRING.Label.page} />

            </Container>
        )
    }
}

const Headertitle = props => (
    <View style={[style.headertitle, {marginBottom : Metrics.padding.small}]}>
        {props.title && <Text ellipsizeMode='tail' numberOfLines={1} style={s.headerText}>{props.title}</Text>}
    </View>
)


const Facilities = (props) => { 
    const {
        images,
        item,
        label,
       } = props

    
    const Images = props =>(
      <Image 
        source={props.images}
        style={s.imgInput} />
    )

    const TextLabel = props =>(
      <Text style={s.valueNormal}>{props.label}</Text>
    )

    const getImage = (source) => {
        return ( <TextLabel label={ '● '}/>)
    //   switch (source) {
    //       case 'ac':
    //           return ( <Images images={getIcon('ic-hotel-ac')} />)
    //       case 'parkir':
    //           return ( <Images images={getIcon('ic-hotel-parking')} />)
    //       case 'reseption':
    //           return ( <Images images={getIcon('ic-hotel-24hours')} />)
    //       case 'wifi':
    //           return ( <Images images={getIcon('ic-hotel-wifi')} />)
    //   }
    }
    const getLabel = (label) => {
    //   switch (label) {
        //   case 'ac':
              return ( <TextLabel label={label}/>)
    //       case 'parkir':
    //           return ( <TextLabel label='Parkir'/>)
    //       case 'reseption':
    //           return ( <TextLabel label='Res. 24 Jam'/>)
    //        case 'wifi':
    //           return ( <TextLabel label='wifi'/>)
    //   }
    }
    const ImgFac = props => (
      <View style={[{flexDirection:'row', paddingVertical : Metrics.padding.small}]}>
          {props.images && getImage(props.images)}
          {props.label && getLabel(props.label)}
      </View>
    )

    return(
        <FlatList
              data            = {props.data}
              keyExtractor    = {(item, index) => index}
              renderItem      = {({ item }) => (
                <View style={[s.row, {marginHorizontal : Metrics.padding.normal}]}>
                    <ImgFac
                        images  = {item.featureName}
                        label   = {item.featureName}
                     />
                </View>
              )}
              numColumns ={2}
            />
  )
}



const style = StyleSheet.create({
   address:{
    paddingHorizontal : Metrics.padding.normal,
    paddingVertical : Metrics.padding.small
   },
   headertitle:{
       alignItems :'center'
   },
   section :{
    paddingTop: Metrics.padding.small,
    paddingBottom : Metrics.padding.normal
   },

})

