import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    FlatList, BackHandler,
    Dimensions,  ActivityIndicator
} from 'react-native'

import s from '../../Components/Styles'
import {
    Colors,
    Container,
    getIcon,
    ToolbarV2 as Toolbar,
    TextView as Text,
    CardListHotel, Touchable, Fonts, Icon ,  Button,
    Modal,
    CardModalDate,
} from '../../Components/index'
import { Metrics } from '../../Assets'
import { getURL } from '../../Services/API'
import { Parameter } from '../../Services/Parameter'
import { JSONPostFile, JSONPost_ } from '../../Services/JsonService'
import { Function, STRING } from '../../Utils'
import { ListHotel, Datedata } from '../../Utils/dummy';
import moment from 'moment'


const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            Paging: null,
            data: [],
            alldata: [],
            pageCount: null,
            price_range: null,
            backUpprice_range: null,
            page: 1,
            parameter: null,
            sesionid: null,
            refreshing: false,
            optionList: ListHotel.product,
            slug: 'priceAsc',
            starsSlug: 0,
            arr_date: [],
            dataIndex: 0,
            dateIndex : {id : 0}

        });
        this.sortByPriceAsc = this.sortByPriceAsc.bind(this)
        this.sortByPriceDsc = this.sortByPriceDsc.bind(this)
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
        const { params } = this.props.navigation.state;
        this.setState({ parameter: params.param }, () => {
            console.log(params.param)
            this.handleRefresh()
            this.ChangeDate()
        })
    }

    ChangeDate(nextMonth){
        var arr_date = Function.ButtomDate(nextMonth)
        this.setState({ arr_date: arr_date })
    }

    pressChangeDate(item){
        this.setState({visibleModal : false, index: 1, count: 0.05, data: [], alldata: [], dataRetun: [],
            parameter: Function.OnchangesText(this.state.parameter, 3,  Function.FormeteDate(item.fulldate, 'DD MMM YYYY', 'YYYY-MM-DD')),
            parameter: Function.OnchangesText(this.state.parameter, 4,  moment(Function.FormeteDate(item.fulldate, 'DD MMM YYYY', 'YYYY-MM-DD')).add(this.state.parameter[0].durasi, 'day').format('YYYY-MM-DD'))}, () => {
            Function.SaveDataJson('SearchHotel', Function.JsonString(this.state.parameter))
           console.log(item.fulldate)
            this.handleRefresh()
        })
    }
    backAndroid() {
        const { navigation } = this.props;
        navigation.goBack();
        this.props.navigation.state.params.ActivityResult({ slug: 'Reservation' })
        return true
    }

    renderFooter = () => {
        if (!this.state.loading) return null;
        return (
            <View style={{
                paddingVertical: 20,
                borderTopWidth: 1,
                borderColor: "#CED0CE"
            }}>
                <ActivityIndicator animating size='large' />
            </View>
        )
    }

    handleLoadMore = () => {
        switch (this.state.pageCount) {
            case this.state.page:
                this.setState({ loading: false, refreshing: false });
                break
            default:
                this.setState({
                    page: this.state.page + 1,
                    loading: true,
                    // refresh    :  this.state.refresh + 1,
                }, () => {
                    this.Auth('pameter')
                });
                break
        }
    }

    handleRefresh = () => {
        this.setState({
            data: [],
            alldata: [],
            pageCount: null,
            page: 1,
            Paging: null,
            refreshing: true,
            price_range: null,
            backUpprice_range: null,
            starsSlug: 0
        }, () => {
            this.Auth(null)
        })
    }

    Auth = (type) => {
        try {
            // this.setState({ loading: true })
            let url = getURL(type ? 'url_post_inquiry_hotel' : 'url_post_inquiry_paging_hotel')
            let param = Parameter.inqweryPagingHotel(this.state.parameter, type ? this.state.Paging[this.state.page - 1] : null)

            JSONPost_(url, param).then((response) => {
                response = response.data
                switch (response.respCode) {
                    case '0':
                        this.setState({ refreshing: false, loading: false, sesionid: response.sessionId }, () => {
                            if (type) {
                                this.setState({
                                    data: [...this.state.data, ...response.hotelInfo], alldata: [...this.state.alldata, ...response.hotelInfo]
                                }, () => {
                                    var lengtdata = this.state.alldata.length - 1
                                    var dataall = this.state.alldata.sort((a, b) => (a.hotelRoomPriceLst[0].totNetPrice - b.hotelRoomPriceLst[0].totNetPrice))
                                    this.setState({
                                        price_range: [dataall[0].hotelRoomPriceLst[0].totNetPrice, dataall[lengtdata].hotelRoomPriceLst[0].totNetPrice],
                                        backUpprice_range: [dataall[0].hotelRoomPriceLst[0].totNetPrice, dataall[lengtdata].hotelRoomPriceLst[0].totNetPrice]
                                    }, () => {
                                        this.range_price(this.state.price_range, this.state.alldata)
                                    })
                                })
                                this.setState({ page: this.state.page + 1 })
                            } else {
                                this.setState({ refreshing: true, Paging: response.inqPagingLst, pageCount: response.totalCount, page: this.state.page + 1 }, () => {
                                    this.Auth('pameter')
                                })
                            }
                        })
                        break
                    default:
                        if (!this.state.data.length && !this.state.Paging) {
                            this.setState({ page: this.state.page + 1 }, () => {
                                this.Auth('pameter')
                            })
                        }
                        break
                }
            }).catch((error) => {
                this.setState({ refreshing: false, loading: false })
            })
        } catch (error) {
            this.setState({ refreshing: false, loading: false })
            console.log('Error >>> ', error)
        }
    }

    ActivityResult = (data) => {
        var arrayData = this.state.data
        switch (data.slug) {
            case 'priceAsc':
                this.setState({ data: [], slug: 'priceAsc' }, () => {
                    this.setState({ data: arrayData }, () => {
                        this.sortByPriceAsc()
                    })
                })
                break;
            case 'priceDsc':
                this.setState({ data: [], slug: 'priceDsc' }, () => {
                    this.setState({ data: arrayData }, () => {
                        this.sortByPriceDsc()
                    })
                })
                break;
            case 'filter':
                this.setState({ starsSlug: data.slugStars, price_range: data.price_range }, () => {
                    this.range_price(this.state.price_range, this.state.alldata)
                })
                break;
            case 'return_date':
                var range = moment(data.return_date, 'YYYY-MM-DD').diff(moment(this.state.parameter[3].checkInDate, 'YYYY-MM-DD'), 'days')
                this.setState({
                    parameter: Function.OnchangesText(this.state.parameter, 4, data.return_date),
                    parameter: Function.OnchangesText(this.state.parameter, 0, range),
                }, () => {
                    Function.SaveDataJson('SearchHotel', Function.JsonString(this.state.parameter))
                    this.handleRefresh()
                })
                break
        }
    }


    sortByPriceAsc() {
        this.setState((prevState) => {
            this.state.data.sort((a, b) => (a.hotelRoomPriceLst[0].totNetPrice - b.hotelRoomPriceLst[0].totNetPrice))
        });
    }
    sortByPriceDsc() {
        this.setState((prevState) => {
            this.state.data.sort((a, b) => (b.hotelRoomPriceLst[0].totNetPrice - a.hotelRoomPriceLst[0].totNetPrice))
        });
    }

    range_price(range, dataArray) {
        var i = 0
        var arrayRange = []

        while (i < dataArray.length) {
            var Price = dataArray[i].hotelRoomPriceLst[0].totNetPrice
            if (Price >= parseInt(this.state.price_range[0]) && parseInt(this.state.price_range[1]) >= parseInt(Price)) {
                arrayRange.push(dataArray[i])
            }
            // console.log(Price)
            i++
        }

        this.filterStart(this.state.starsSlug, arrayRange)
    }

    filterStart(slug, dataArray) {
        var i = 0
        var SaveArray = []
        while (i < dataArray.length) {
            switch (slug) {
                case 1:
                    if (parseInt(Function.StarsHotel(dataArray[i].categoryCode)) === 1) {
                        SaveArray.push(dataArray[i])
                    }
                    break
                case 2:
                    if (parseInt(Function.StarsHotel(dataArray[i].categoryCode)) === 2) {
                        SaveArray.push(dataArray[i])
                    }
                    break
                case 3:
                    if (parseInt(Function.StarsHotel(dataArray[i].categoryCode)) === 3) {
                        SaveArray.push(dataArray[i])
                    }
                    break
                case 4:
                    if (parseInt(Function.StarsHotel(dataArray[i].categoryCode)) === 4) {
                        SaveArray.push(dataArray[i])
                    }
                    break
                case 5:
                    if (parseInt(Function.StarsHotel(dataArray[i].categoryCode)) === 5) {
                        SaveArray.push(dataArray[i])
                    }
                    break
                default:
                    SaveArray.push(dataArray[i])
                    break
            }
            i++
        }
        this.setState({ data: [] }, () => {
            this.setState({ data: SaveArray }, () => {
                this.ActivityResult({ slug: this.state.slug })
            })
        })
    }

    render() {
        const { params } = this.props.navigation.state;
        const { dispatch, navigate } = this.props.navigation;
        return (
            <Container style={s.container}>

                <Toolbar
                    style={s.toolbar}
                    type={next => this.setState({ next })}
                    title={params.param[2].destination.title}
                    subtitle={'Hotel - ' + Function.FormeteDate(params.param[3].checkInDate, 'YYYY-MM-DD', 'ddd, DD MMM YYYY')}
                    barStyle={s.toolbar}
                    left={[{
                        icon: 'ic_arrow_back',
                        onPress: () => this.backAndroid()
                    }]}
                />
                
                    <Modal
                            type={'more'}
                            active={this.state.visibleModal}
                            onClose={value => this.setState({ visibleModal: value })}
                        >   
                        <View style={{backgroundColor: 'rgba(0,0,0, 0.20)'}}>
                           <View style={nav_style.headerModal}>
                                <Text style={[nav_style.textHeader, {color : Colors.blue}]}>{STRING.Label.anotherDate}</Text>
                           </View>
                            <View>
                                <View style={nav_style.ContainerModal}>
                                <FlatList
                                 onEndReached={() => this.setState({dataIndex : this.state.dataIndex+1}, () => {this.ChangeDate(this.state.dataIndex)})}
                                    horizontal
                                    contentContainerStyle={{ paddingHorizontal: Metrics.padding.small }}
                                    showsHorizontalScrollIndicator={false}
                                    data={this.state.arr_date}
                                    keyExtractor={(item, index) => `key-${index}`}
                                    renderItem   = {({item, index} ) => (
                                        <View style={{justifyContent:'center', paddingHorizontal: Metrics.padding.tiny}}>
                                            <CardModalDate
                                                dayName ={item.dayName}
                                                date ={item.date}
                                                month ={item.month}
                                                price={item.price}
                                                onPress = {() => this.setState({dateIndex : item})}
                                                overlay = {this.state.dateIndex.id === item.id}
                                            />
                                        </View>
                                    )}/>
                                </View>
                                <View style={{backgroundColor :Colors.white}}>
                                <Button 
                                    style ={[s.closebutton,{backgroundColor : Colors.blue}]}
                                    onPress={()=> this.pressChangeDate(this.state.dateIndex)}
                                    text =  {STRING.Label.closeButton}
                                />
                                </View>
                            </View>
                            </View>
                        </Modal>
                <View style={{ flex: 1 }}>
                    <FlatList
                        data={this.state.data}

                        renderItem={({ item }) => (
                            <View style={[{ flex: 1 }]}>
                                <CardListHotel
                                    destination={item.destinationName}
                                    hotel_name={item.hotelName}
                                    stars_count={parseInt(Function.StarsHotel(item.categoryCode))}
                                    // reviews = {item.reviews}
                                    // old_price = {item.old_price}
                                    new_price={"IDR " + Function.convertToPrice(item.hotelRoomPriceLst[0].totNetPrice)}
                                    image={item.imageLst[0].imageUrl}
                                    onPress={() => this.props.navigation.navigate('ReviewHotel', { data: item, Parameter: this.state.parameter, sesionid: this.state.sesionid })}
                                />
                            </View>
                        )}
                        keyExtractor={(item, index) => index}
                        onRefresh={this.handleRefresh}
                        refreshing={this.state.refreshing}
                        onEndReached={this.handleLoadMore}
                        ListFooterComponent={this.renderFooter.bind(this)}
                        maxToRenderPerBatch={5}
                        onEndReachedThreshold={5}
                    />
                </View>

                <View style={nav_style.filter_bar}>
                    <Touchable onPress={() => this.props.navigation.navigate('Urutkan', { ActivityResult: this.ActivityResult, slug: this.state.slug })}>
                        <View style={nav_style.filter_item}>
                            <Icon size='small' style={nav_style.custom_icon} source={getIcon('ic_filter')} />
                            <Text style={[nav_style.filter_item_text]}>{STRING.Function_name.sort}</Text>
                        </View>
                    </Touchable>

                    <View style={nav_style.filter_separator} />

                    {this.state.data && <Touchable onPress={() => this.props.navigation.navigate('FilterHotel', { ActivityResult: this.ActivityResult, starsSlug: this.state.starsSlug, backUpprice_range: this.state.backUpprice_range, price_range: this.state.price_range, max: this.state.alldata.length ? this.state.alldata[this.state.alldata.length - 1].hotelRoomPriceLst[0].totNetPrice : 0 })}>
                        <View style={nav_style.filter_item}>
                            <Icon size='small' style={nav_style.custom_icon} source={getIcon('ic_sort')} />
                            <Text style={[nav_style.filter_item_text]}>{STRING.Function_name.filter}</Text>
                        </View>
                    </Touchable>}

                    <View style={nav_style.filter_separator} />
                    

                    {/* <Touchable onPress={() => this.props.navigation.navigate('HotelCalendar', { ActivityResult: this.ActivityResult, type_trip: 'roundtrip', depart_date: this.state.parameter[3].checkInDate, return_date: this.state.parameter[4].checkOutDate, slug: 'return_date' })}> */}
                    <Touchable  onPress={()=> this.setState({visibleModal: true})}>
                        <View style={nav_style.filter_item}>
                            <Icon
                                size='small' style={nav_style.custom_icon} source={getIcon('ic_calendar_2')} />
                            <Text style={[nav_style.filter_item_text]}>{STRING.Function_name.date_change}</Text>
                        </View>
                    </Touchable>
                </View>
            </Container>
        )
    }
}

// const style = StyleSheet.create({
const nav_style = StyleSheet.create({
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
    filter_bar: {
        backgroundColor: Colors.slate_gray,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filter_item: {
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
    filter_separator: {
        width: StyleSheet.hairlineWidth,
        backgroundColor: Colors.white,
        height: Fonts.size.tiny * 1.5,
    }, custom_icon: {
        tintColor: Colors.white,
        marginRight: Scale(4)
    },
})

