import React, { Component } from 'react';
import { Dimensions, ProgressBarAndroid, ProgressViewIOS, FlatList, Text, View, StyleSheet, Platform, BackHandler, AsyncStorage } from 'react-native';
import { Toolbar, ItemListSchedulrFlight, Icon, Touchable, Button, Modal, CardModalDate, Loading } from '../../Components'
import { NavigationActions } from "react-navigation";
import { getURL } from '../../Services/API'
import { Parameter } from '../../Services/Parameter'
import { JSONAxioPostFile } from '../../Services/JsonService'
import { getIcon, getAirlineLogo, Colors, Metrics, Fonts } from '../../Assets'
import { Function, STRING } from '../../Utils/index';
import DividerComponent from '../../Components/DeviderComponent'
import { Datedata } from '../../Utils/dummy';
import { DotsLoader } from 'react-native-indicator'
import moment from 'moment'

const finish = NavigationActions.back({ key: "" });


const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}

export default class ScheduleFlight extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
            dataReturn: [],
            parameter: null,
            index: 1,
            count: 0.05,
            slug: 'price_asc',
            groupFlight: null,
            type: 'depart',
            groupFligthFilter: [],
            airLine_value: null,
            time_value: null,
            transit_value: null,
            alldata: [],
            arr_date: [],
            dataIndex: 0,
            nextMonth : 0,
            lowprice : [],
            loading_date : false,
            loading : true
        }
        this.sortByPriceDesc        = this.sortByPriceDesc.bind(this);
        this.sortByPriceAsc         = this.sortByPriceAsc.bind(this)
        this.sortByDepartTimeAsc    = this.sortByDepartTimeAsc.bind(this);
        this.sortByDepartTimeDesc   = this.sortByDepartTimeDesc.bind(this)
        this.sortByReturnTimeAsc    = this.sortByReturnTimeAsc.bind(this);
        this.sortByReturnTimeDesc   = this.sortByReturnTimeDesc.bind(this)
        this.sortByDurationAsc      = this.sortByDurationAsc.bind(this)
        this.sortByDurationDesc     = this.sortByDurationDesc.bind(this)
    }

    componentDidMount() {
        this.mounted = true;
        const { params } = this.props.navigation.state;
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
        console.log('params.parameter')
        console.log(params.parameter)
        this.setState({ parameter: params.parameter }, () => {
            this.GetData()
            this.ChangeDate(this.state.nextMonth)
        })
    }
    
    componentWillUnmount() {
        this.mounted = false;
    }

    backAndroid() {
        this.props.navigation.dispatch(finish)
        this.props.navigation.state.params.ActivityResult({ slug: 'schedule' })
        return true
    }

    ChangeDate(nextMonth){
        this.GetLowPrice(moment().add(nextMonth, 'month').startOf('day').format('MMYYYY'),nextMonth )
    }

    pressChangeDate(item){
        this.setState({visibleModal : false, index: 1, count: 0.05, data: [], alldata: [], dataReturn: [], parameter: Function.OnchangesText(this.state.parameter, 3, item.fulldate)}, () => {
            Function.SaveDataJson('SearchFlightInt', Function.JsonString(this.state.parameter))
            this.GetData()
        })
    }

    GetData = () => {
        var Group = this.state.parameter[5].depart.group_code.replace(/-/gi, ',').split(',')
        this.setState({groupFlight: Group.length,})
        var i = 0;
        while (i < Group.length) {
            this.state.parameter[7].airlineGroup = Group[i]
            this.Auth(this.state.parameter)
            i++
        }
    }

    GetLowPrice = (date, nextMonth) => {
        this.setState({ loading_date: true })
        let url = getURL('url_post_lower_price')
        let parameter = {
            Org: this.state.parameter[5].depart.code,
            Des: this.state.parameter[6].return.code,
            Tgl1: date,
        }

        JSONAxioPostFile(url, parameter)
            .then((respone) => {
                var Respone = respone.data
                this.setState({ loading_date: false })
                var arr_date = Function.ButtomDate(nextMonth);
                switch (Respone.respCode) {
                    case '0':
                        console.log('Case 0')
                        var i = 0;
                        var j = 0;

                        var schedule = Respone.schedule;

                        this.setState({ lowprice: [...this.state.lowprice, ...schedule] }, () => {
                            for (var i = 0; i < this.state.lowprice.length; i++) {
                                for (var j = 0; j < arr_date.length; j++) {
                                    if (Function.FormeteDate(arr_date[j].fulldate, 'DD MMM YYYY', 'YYYY-MM-DD') === this.state.lowprice[i][2]) {
                                        arr_date[j].price = this.state.lowprice[i][3]
                                    }

                                    if (arr_date[j].fulldate === this.state.parameter[3].depart_date) {
                                        this.state.dataIndex = {id : arr_date[j].id}
                                    }
                                }
                            }

                            this.setState({ arr_date: arr_date })
                        })

                        break
                    default:
                        for (var i = 0; i < this.state.lowprice.length; i++) {
                            for (var j = 0; j < arr_date.length; j++) {
                                if (Function.FormeteDate(arr_date[j].fulldate, 'DD MMM YYYY', 'YYYY-MM-DD') === this.state.lowprice[i][2]) {
                                    arr_date[j].price = this.state.lowprice[i][3]
                                }
                                if (arr_date[j].fulldate === this.state.parameter[3].depart_date) {
                                    this.state.dataIndex = {id : arr_date[j].id}
                                }
                            }
                        }

                        this.setState({ arr_date: arr_date })

                        break
                }
            })
            .catch((error) => {
                this.setState({ loading_date: false })

                for (var i = 0; i < this.state.lowprice.length; i++) {
                    for (var j = 0; j < arr_date.length; j++) {
                        if (Function.FormeteDate(arr_date[j].fulldate, 'DD MMM YYYY', 'YYYY-MM-DD') === this.state.lowprice[i][2]) {
                            arr_date[j].price = this.state.lowprice[i][3]
                        }
                        if (arr_date[j].fulldate === this.state.parameter[3].depart_date) {
                            this.state.dataIndex = {id : arr_date[j].id}
                        }
                    }
                }

                this.setState({ arr_date: arr_date })

            })
    }


    Auth = (GroupFlight) => {
        this.setState({ loading: true })
        let url = GroupFlight ? getURL('url_post_get_schedule_by_group_per_type') : getURL('url_post_get_group_flight')
        let parameter = GroupFlight !== undefined ? Parameter.ScheduleFlight(GroupFlight, 'depart') : null
        var count = this.state.groupFlight 
        JSONAxioPostFile(url, parameter)
            .then((respone) => {
                var Respone = respone.data
                
                
                switch (Respone.respCode) {
                    case '0':
                        
                        switch (true) {
                            case GroupFlight !== undefined:
                                var filterGrup = []
                                var schedulesDepart = Function.ObjectNull(Respone, 'schedulesDepart')

                                if (schedulesDepart) {
                                    schedulesDepart.map((item, i) => (
                                        filterGrup.length !== 0
                                            ? schedulesDepart.map((itemGroupFlight, i_) => (
                                                filterGrup.push({ airlineCode: item.airlineCode, airline: item.airline })
                                            )) :
                                            filterGrup.push({ airlineCode: item.airlineCode, airline: item.airline })
                                    ))


                                    this.setState({
                                        count: this.state.count + 0.10,
                                        index: this.state.index + 1,
                                        data: [...this.state.data, ...Respone.schedulesDepart],
                                        groupFligthFilter: [...this.state.groupFligthFilter, ...filterGrup], 
                                        alldata: [...this.state.alldata, ...Respone.schedulesDepart], dataReturn: Function.ObjectNull(Respone, 'schedulesReturn') ? [...this.state.dataReturn, ...Respone.schedulesReturn] :  [...this.state.dataReturn, ...[]]
                                    }, () => {
                                        this.filterschedule()
                                        console.log('Print 1 >> ' + this.state.count)
                                        if (count === this.state.index || count < this.state.index) {
                                            if (this.mounted) { this.setState({ count: 0.0 }) }
                                        }
                                    })
                                }
                                else {
                                    this.setState({ count: this.state.count + 0.10, index: this.state.index + 1, }, () => {
                                        console.log('Print 2 >> ' + this.state.count)
                                        if (count === this.state.index || count < this.state.index) {
                                            if (this.mounted) { this.setState({ count: 0.0 }) }
                                        }
                                    })
                                }
                                break
                            
                            default:
                            this.setState({ count: this.state.count + 0.10, index: this.state.index + 1, }, () => {
                                console.log('Print 3 >> ' + this.state.count)
                                if (count === this.state.index || count < this.state.index) {
                                    if (this.mounted) { this.setState({ count: 0.0 }) }
                                }
                            })
                                break
                        }

                        break
                    default:
                    this.setState({ count: this.state.count + 0.10, index: this.state.index + 1, }, () => {
                        console.log('Print 4 >> ' + this.state.count)
                        if (count === this.state.index || count < this.state.index) {
                            if (this.mounted) { this.setState({ count: 0.0 }) }
                        }
                    })
                        break
                }
            })
            .catch((error) => {
                this.setState({ count: this.state.count + 0.10, index: this.state.index + 1, }, () => {
                    console.log('Print 5 >> ' + this.state.count)
                    if (count === this.state.index || count < this.state.index) {
                        if (this.mounted) { this.setState({ count: 0.0 }) }
                    }
                })

            })
    }

    ActivityResult = (data) => {
        switch (data.slug) {
            case 'price_asc':
                this.setState({ slug: 'price_asc' }, () => {
                    this.MenuNavBottum(this.state.slug)
                })
                break;
            case 'price_dsc':
                this.setState({ slug: 'price_dsc' }, () => {
                    this.MenuNavBottum(this.state.slug)
                })
                break;
            case 'arr_asc':
                this.setState({ slug: 'arr_asc' }, () => {
                    this.MenuNavBottum(this.state.slug)
                })
                break;
            case 'arr_dsc':
                this.setState({ slug: 'arr_dsc' }, () => {
                    this.MenuNavBottum(this.state.slug)
                })
                break;
            case 'dep_asc':
                this.setState({ slug: 'dep_asc' }, () => {
                    this.MenuNavBottum(this.state.slug)
                })
                break;
            case 'dep_dsc':
                this.setState({ slug: 'dep_dsc' }, () => {
                    this.MenuNavBottum(this.state.slug)
                })
                break;
            case 'dur_asc':
                this.setState({ slug: 'dur_asc' }, () => {
                    this.MenuNavBottum(this.state.slug)
                })
                break;
            case 'dur_dsc':
                this.setState({ slug: 'dur_dsc' }, () => {
                    this.MenuNavBottum(this.state.slug)
                })
                break;
            case 'return_data':
                this.setState({ index: 15, count: 0, data: [], dataReturn: [], parameter: data.parameter , alldata:  []}, () => {
                    this.setState({ data: data.dataDepart, dataReturn: data.data, alldata : data.dataDepart}, () => {
                        this.filterschedule()
                    })
                })
                break
            case 'filter_data':
                this.setState({ airLine_value: data.airLine_value, time_value: data.time_value, transit_value: data.transit_value }, () => {
                    this.filterschedule()
                })
                break
        }
    }

    ChangeTheDate = (slug) => {
        this.setState({ index: 1, count: 0.05, data: [], alldata: [], dataReturn: [], parameter: Function.OnchangesText(this.state.parameter, 3, this.state.depart_date) }, () => {
            Function.SaveDataJson('SearchFlightInt', Function.JsonString(this.state.parameter))
            this.GetData()
        })
    }

    MenuNavBottum(data) {
        this.setState({loading :false})
        var arrayData = this.state.data
        switch (data) {
            case 'price_asc':
                this.setState({ slug: 'price_asc', data: [] }, () => {
                    this.setState({ data: arrayData }, () => {
                        this.sortByPriceAsc()
                    })
                })
                break;
            case 'price_dsc':
                this.setState({ slug: 'price_dsc', data: [] }, () => {
                    this.setState({ data: arrayData }, () => {
                        this.sortByPriceDesc()
                    })
                })
                break;
            case 'arr_asc':
                this.setState({ slug: 'arr_asc', data: [] }, () => {
                    this.setState({ data: arrayData }, () => {
                        this.sortByReturnTimeAsc()
                    })
                })
                break;
            case 'arr_dsc':
                this.setState({ slug: 'arr_dsc', data: [] }, () => {
                    this.setState({ data: arrayData }, () => {
                        this.sortByReturnTimeDesc()
                    })
                })
                break;
            case 'dep_asc':
                this.setState({ slug: 'dep_asc', data: [] }, () => {
                    this.setState({ data: arrayData }, () => {
                        this.sortByDepartTimeAsc()
                    })
                })
                break;
            case 'dep_dsc':
                this.setState({ slug: 'dep_dsc', data: [] }, () => {
                    this.setState({ data: arrayData }, () => {
                        this.sortByDepartTimeDesc()
                    })
                })
                break;
            case 'dur_asc':
                this.setState({ slug: 'dur_asc', data: [] }, () => {
                    this.setState({ data: arrayData }, () => {
                        this.sortByDurationAsc()
                    })
                })
                break;
            case 'dur_dsc':
                this.setState({ slug: 'dur_dsc', data: [] }, () => {
                    this.setState({ data: arrayData }, () => {
                        this.sortByDurationDesc()
                    })
                })
                break;
        }
    }


    sortByPriceAsc() {
        this.setState((prevState) => {
            Function.sortByPriceAsc(this.state.data)
        });
    }

    sortByPriceDesc() {
        this.setState((prevState) => {
            Function.sortByPriceDesc(this.state.data)
        });
    }
    sortByDepartTimeAsc() {
        this.setState((prevState) => {
            Function.sortByDepartTimeAsc(this.state.data)
        });
    }
    sortByDepartTimeDesc() {
        this.setState((prevState) => {
            Function.sortByDepartTimeDesc(this.state.data)
        });
    }

    sortByReturnTimeAsc() {
        this.setState((prevState) => {
            Function.sortByReturnTimeAsc(this.state.data)
        });
    }
    sortByReturnTimeDesc() {
        this.setState((prevState) => {
            Function.sortByReturnTimeDesc(this.state.data)
        });
    }
    sortByDurationAsc() {
        this.setState((prevState) => {
            Function.sortByDurationAsc(this.state.data)
        });
    }
    sortByDurationDesc() {
        this.setState((prevState) => {
            Function.sortByDurationDesc(this.state.data)
        });
    }

    filterschedule() {
        if (this.state.airLine_value || this.state.time_value || this.state.transit_value) {
            this.setState({ data: [] }, () => {
                this.setState({ data: Function.filter_Flight(Function.find_duplicate_in_array(this.state.alldata), this.state.airLine_value, this.state.time_value, this.state.transit_value) }, () => {
                    this.MenuNavBottum(this.state.slug)
                })
            })
        } else {
            if (this.state.airLine_value === null && this.state.time_value === null && this.state.transit_value === null) {
                // console.log('masukk data null ', this.state.airLine_value, ' >> ', this.state.time_value, ' >> ', this.state.transit_value)
                this.setState({ data: [] }, () => {
                    this.setState({ data: Function.find_duplicate_in_array(this.state.alldata) }, () => {
                        this.MenuNavBottum(this.state.slug)
                    })
                })
            }
        }
    }

    render() {
        const { params } = this.props.navigation.state;
        return (
            <View style={{ flex: 1, }}>
                <Toolbar
                    arrow_back
                    onPress={() => this.backAndroid()}
                    View={
                        this.state.parameter && <View style={{ flex: 1, paddingTop: Scale(8), paddingRight: Scale(8), paddingBottom: Scale(8), }}>
                            <Text style={{ flex: 1, color: Colors.white, fontSize: Scale(12) }}
                            ellipsizeMode='tail'
                            numberOfLines={1}>{STRING.Label_Flight.lbl_org_flight + ' - '}{Function.FormeteDate(this.state.parameter[3].depart_date, 'DD MMM YYYY', 'dddd, DD MMM YYYY')}</Text>
                            <Text style={{ flex: 1, color: Colors.white, fontSize: Scale(14) }}
                            ellipsizeMode='tail'
                            numberOfLines={1}>{this.state.parameter[5].depart.title}{' - '}{this.state.parameter[6].return.title}</Text>
                        </View>
                    }
                />
                <Modal
                    type={'more'}
                    active={this.state.visibleModal}
                    onClose={value => this.setState({ visibleModal: value })}>
                    <View style={{ backgroundColor: 'rgba(0,0,0, 0.20)' }}>
                        <View style={[s.headerModal, {flexDirection : 'row'}]}>  
                        <Text style ={{color : Colors.blue, fontWeight : 'bold'}}>{STRING.Label.anotherDate}</Text>
                        {this.state.loading_date && <View style ={{flex : 1, alignItems : 'flex-end'}}>
                        <DotsLoader size={10} color={Colors.blue} betweenSpace={5} />
                        </View>}
                        </View>
                        <View>
                            <View style={s.ContainerModal}>
                        
                                <FlatList
                               onEndReached={() => this.setState({nextMonth : this.state.nextMonth+1}, () => {this.ChangeDate(this.state.nextMonth)})}
                                    horizontal
                                    contentContainerStyle={{ paddingHorizontal: Metrics.padding.small }}
                                    showsHorizontalScrollIndicator={false}
                                    data={this.state.arr_date}
                                    keyExtractor={(item, index) => `key-${index}`}
                                    renderItem={({ item, index }) => (
                                        <View style={{ justifyContent: 'center', paddingHorizontal: Metrics.padding.tiny }}>
                                           
                                            <CardModalDate
                                                dayName = {item.dayName}
                                                date    = {item.date}
                                                month   = {item.month}
                                                price   = {item.price !== '-' ? 'IDR '+ Function.convertToPrice(item.price.split('.')[0]) : item.price}
                                                onPress = {() => this.setState({dataIndex : item})}
                                                overlay = {this.state.dataIndex.id === item.id}
                                            />
                                        </View>
                                    )} />
                            </View>
                            <View style={{ backgroundColor: Colors.white }}>
                                <Button
                                    style={s.closebutton}
                                    onPress={() => this.pressChangeDate(this.state.dataIndex)}
                                    text={STRING.Label.closeButton}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>

                <View style={{ flex: 1, backgroundColor: Colors.white }}>
                    { (Platform.OS === 'android') ?
                        (this.state.count !== 0.0 && <ProgressBarAndroid styleAttr='Horizontal' style={{height: Scale(3)}} color={Colors.pizzaz} progress={this.state.count} indeterminate={false} />)
                        : (this.state.count !== 0.0 && <ProgressViewIOS progress={this.state.count} progressTintColor={Colors.pizzaz} />)
                    }
                    <FlatList
                        style={{ backgroundColor: Colors.whitesmoke }}
                        data={this.state.data}
                        renderItem={({ item }) => (
                            <View>
                                <ItemListSchedulrFlight
                                    onPress={() => (this.state.parameter[8].selectedItem === 'round-trip' ? this.props.navigation.navigate('ScheduleReturnINT', {
                                        parameter: this.state.parameter,
                                        airlineGroupDepart: item.airlineCode,
                                        dataDepart: item,
                                        alldata : this.state.alldata,
                                        dataReturn: this.state.dataReturn,
                                        dataAllDepart: this.state.data,
                                        ActivityResult: this.ActivityResult, slug: 'round-trip'
                                    }) : this.props.navigation.navigate('ReviewINT', { dataDepart: item, airlineGroupDepart: item.airlineCode, slug: 'one_way' }))}
                                    onpress_detil   = {() => this.props.navigation.navigate('detilINT', { data: item, airlineGroup: item.airlineCode, slug: this.state.type })}
                                    icon_flight     = {getAirlineLogo(item.airlineCode.toLowerCase())}
                                    DepartTime      = {item.flightRspDetailJsons}
                                    OrigCode        = {'(' + (this.state.parameter[5].depart.code) + ')'}
                                    ReturnTime      = {item.flightRspDetailJsons}
                                    DestCode        = {'(' + (this.state.parameter[6].return.code) + ')'}
                                    PriceStreaked   = {item.priceOld !== 0 ? null : (item.currency + ' ' + item.price)}
                                    Price           = {item.currency + ' ' + Function.convertToPrice(item.price)}
                                    FlightName      = {item.airline}
                                    LengthOfJourney = {item.flightRspDetailJsons}
                                    Status          = {item.infoTransit === '-' ? ', Transit' : ', Langsung'}
                                />
                            </View>
                        )}
                        keyExtractor={(item, index) => String(index)}
                        // onRefresh={this.handleRefresh}
                        // refreshing={this.state.refreshing}
                        ItemSeparatorComponent={() => (<DividerComponent style={{ marginBottom: 2, }} />)}
                        maxToRenderPerBatch={5}
                        onEndReachedThreshold={5}
                    />
                </View>


                <View style={s.filter_bar}>
                    <Touchable onPress={() => this.props.navigation.navigate('FlightSortFilterINT', { ActivityResult: this.ActivityResult, slug: 'sort', sort_value: this.state.slug })}>
                        <View style={s.filter_item}>
                            <Icon size='small' style={s.custom_icon} source={getIcon('ic_filter')} />
                            <Text style={[s.filter_item_text]}>URUTKAN</Text>
                        </View>
                    </Touchable>

                    <View style={s.filter_separator} />

                    <Touchable onPress={() => this.props.navigation.navigate('FlightSortFilterINT', {
                        slug: 'filter', groupFligthFilter: this.state.groupFligthFilter,
                        dataDepart: this.state.alldata, ActivityResult: this.ActivityResult,
                        airLine_value: this.state.airLine_value, time_value: this.state.time_value, transit_value: this.state.transit_value
                    })}>
                        <View style={s.filter_item}>
                            <Icon size='small' style={s.custom_icon} source={getIcon('ic_sort')} />
                            <Text style={[s.filter_item_text]}>FILTER</Text>
                        </View>
                    </Touchable>

                    <View style={s.filter_separator} />

                    <Touchable onPress={() => this.setState({ visibleModal: true })}>
                        <View style={s.filter_item}>
                            <Icon
                                onPress={() => this.setState({ visibleModal: true })}
                                // onPress={() => this.props.navigation.navigate('CalendarScreen', { depart_date: this.state.parameter[3].depart_date, return_date: this.state.parameter[4].return_date, slug: 'depart_date', ActivityResult: this.ActivityResult })}
                                size='small' style={s.custom_icon} source={getIcon('ic_calendar_2')} />
                            <Text style={[s.filter_item_text]}>GANTI TANGGAL</Text>
                        </View>
                    </Touchable>
                </View>
                <Loading
                    text={STRING.Label.waitting_for_Login}
                    visible={this.state.loading} />
            </View>
        );
    }
}

const s = StyleSheet.create({
    closebutton: {
        marginTop: Metrics.padding.normal,
        backgroundColor: Colors.blue,
    },
    textHeader: {
        fontSize: Metrics.font.regular,
        fontFamily: Fonts.bold.fontFamily,
        fontWeight: "500",
        color: Colors.white
    },
    headerModal: {
        backgroundColor: 'transparent',
        paddingHorizontal: Metrics.padding.normal,
        paddingVertical: Metrics.padding.small
    },
    ContainerModal: {
        backgroundColor: '#E0E0E2',
        paddingVertical: Metrics.padding.normal,
    },
    button: {
        backgroundColor: 'pink'
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
