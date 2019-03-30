import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    FlatList,
    ScrollView,
    Image, Text, Dimensions, AppRegistry, AsyncStorage
} from 'react-native'
import { Function, FunctionGetWindow, navigateTo } from '../Utils'
import { TextView, Colors, Metrics, Container, getIcon, Toolbar, CardComponent, RadioButtons, Touchable, CardComponentFilter, Modal, Button } from '../Components'
import Navbar from '../Components/NavigationBottom'
import ArrayMenu from '../Utils/array';
import Slick from 'react-native-slick';
import { TabNavigator, StackNavigator, NavigationActions } from 'react-navigation';
import { Scale, Fonts } from '../Assets/index';
import s from '../Components/Styles';
import { STRING } from '../Utils'
// import { ListProperty } from '../Utils/dummy'
const viewabilityConfig = {
    minimumViewTime: 10,
    viewAreaCoveragePercentThreshold: 100,
    waitForInteraction: true,
};
import moment from 'moment'
import { API, getURL } from '../Services/API'
import { Parameter } from '../Services/Parameter'
import { JSONPostFile } from '../Services/JsonService'

export default class Home extends Component {
    constructor(props) {
        super(props);
        this._onScroll = this._onScroll.bind(this)
        this.state = {
            product: null,
            scroll: true,
            parameterbaner: {
                app: 'newhome'
            },
            parameterTour: {
                app: 'tourpackage'
            },
            parameterpoint: {
                email: null,
                resellerCode: 'padiciti',
                resellerPass: 'padiciti123'
            },
            tourpackage: [],
            point: 0,
            padicash: 0,
            name: null,
            Banner: null,
            titleTime: null

        }
    }
    _shouldItemUpdate = (prev, next) => {
        return prev.item !== next.item;
    }
    componentDidMount() {
       
       console.log(moment().add(2, 'month').startOf('month').format('YYYYMMMDD'))
        this.setState({ titleTime: Function.TimeTitle() })
        AsyncStorage.getItem('Banner', (err, Banner) => {
            if (Banner) {
                if (Function.JsonParse(Banner).time === Function.getTime()) {
                    this.Auth('url_list_headlines')
                } else {
                    this.setState({ Banner: Function.JsonParse(Banner).Banner }, () => {

                    })
                }
            } else {
                this.Auth('url_list_headlines')
            }
        })

        AsyncStorage.getItem('UserData', (err, UserData) => {
            if (UserData) {
                this.setState({ name: Function.JsonParse(UserData).client_name, }, () => {
                    this.state.parameterpoint.email = Function.JsonParse(UserData).client_email
                    this.Auth('url_point')
                })

            } else {
                this.Auth('url_list_headlines', 'tour')
            }
        })
    }

    _onScroll(e) {
        this.setState({
            scroll: Function.onScroll(e)
        });
    }

    Profile() {
        AsyncStorage.getItem('UserData', (err, UserData) => {
            if (UserData) {
                this.props.navigation.navigate('LandingPageProfile')
            } else {
                this.props.navigation.navigate('Login', { slug: 'profile' })
            }
        })
    }

    ClickMenu(value) {
        let { navigate } = this.props.navigation
        switch (value) {
            case 'flight':
                this.props.navigation.navigate('FlightScreen')
                break
            case 'train':
                this.props.navigation.navigate('TrainReservation')
                break
            case 'hotel':
                this.props.navigation.navigate('LandingPageHotel')
                break
            case 'bus':
                this.props.navigation.navigate('BusReservation')
                break
            case 'flight_int':
                this.props.navigation.navigate('FlightScreenINT')
                break
            case 'jetski':
                this.props.navigation.navigate('IJDKReservation')
                break
            case 'myTrip':
                this.props.navigation.navigate('HistoryBooking')
                break
            case 'tours':
                this.props.navigation.navigate('Tour')
                break
            case 'pln':
                this.props.navigation.navigate('PlnReservation')
                break
            case 'more':
                this.setState({ visibleModal: true })
                break
            // case 'pelni':
            //     this.props.navigation.navigate('PelniReservation')
            //     break
        }
    }

    Auth(type, tour) {
        try {
            this.setState({ loading: true })
            let url = getURL(type)
            let Parameter = type === 'url_list_headlines' ? tour ? this.state.parameterTour : this.state.parameterbaner : this.state.parameterpoint

            JSONPostFile(url, Parameter).then((Respone) => {

                switch (Respone.resp_code ? Respone.resp_code : Respone.respCode) {

                    case '0':
                        switch (type) {
                            case 'url_list_headlines':

                                var Banner = [];
                                var i = 0;
                                var j = 0;
                                var ResponeOne = Respone.news;

                                if (tour) {
                                    // console.log(ResponeOne)
                                    for (var i = 0; i < ResponeOne.length; i++) {
                                        var ResponeTwo = ResponeOne[i]
                                        if (ResponeTwo[10] === 'Y') {
                                            // console.log(ResponeTwo)
                                            Banner.push({ title: ResponeTwo[6], banner: ResponeTwo[7], page: ResponeTwo[9] });
                                        }
                                    }
                                    this.setState({ loading: false }, () => {
                                        this.setState({ tourpackage: Banner })
                                    })
                                }
                                else {
                                    // console.log(ResponeOne)
                                    for (var i = 0; i < ResponeOne.length; i++) {
                                        var ResponeTwo = ResponeOne[i]
                                        if (ResponeTwo[10] === 'Y') {
                                            // console.log(ResponeTwo)
                                            Banner.push({ title: ResponeTwo[6], banner: ResponeTwo[7], page: ResponeTwo[9] });
                                        }
                                    }


                                    this.setState({ loading: false }, () => {
                                        Function.DeleteAsyncStorage(['Banner'])
                                        Function.SaveDataJson('Banner', Function.JsonString({
                                            Banner: Banner, time: new moment().add(1, 'h').format("hh:mm")
                                        }))
                                        AsyncStorage.getItem('Banner', (err, Banner) => {
                                            if (Banner) {
                                                this.setState({ Banner: Function.JsonParse(Banner).Banner },
                                                    () => {
                                                        // console.log(this.state.Banner)
                                                    })
                                            }
                                        })
                                        this.Auth('url_point')
                                    })

                                }


                                break
                            case 'url_point':
                                this.setState({ point: Respone.saldoPoint }, () => {
                                    this.Auth('url_list_headlines', 'tour')
                                })
                                console.log(Respone)
                                break
                        }

                        break
                    default:
                        this.setState({ loading: false }, () => {

                        })
                        // Alert(Respone.inRespMsg)
                        break
                }

            }).catch((err) => {
                this.setState({ loading: false }, () => {
                    // this.backAndroid()
                })

                console.log('err >>> ' + err)
            })
        } catch (Error) {
            this.setState({ loading: false }, () => {
                // this.backAndroid()
            })
            console.log('Error >>> ', Error)
        }

    }


    render() {
        let { navigation } = this.props
        return (

            <View style={{ flex: 1, backgroundColor: Colors.white, }} >
                <Toolbar>
                    <View style={{ flex: 1, alignItems: 'center', }}>

                        <Image
                            style={{ width: Scale(90), height: Scale(35) }}
                            resizeMethod='scale'
                            source={getIcon('logo_padiciti')}
                        />
                    </View>

                    <View style={{ justifyContent: 'flex-end' }}>
                        <Touchable
                            onPress={() => this.Profile()}>
                            <Image
                                style={{ width: Scale(20), height: Scale(20) }}
                                resizeMethod='scale'
                                source={getIcon('ic_shape')}
                            />
                        </Touchable>
                    </View>
                </Toolbar>
                <Modal
                    type={'more'}
                    active={this.state.visibleModal}
                    onClose={value => this.setState({ visibleModal: value })}
                >
                    <View style={styles.modal}>
                        <View style={styles.header}>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.moreProduct}>More Product</Text>
                            </View>
                            <View style={s.center}>
                                <Touchable onPress={console.log('')}>
                                    <View style={s.close}>
                                        <Text style={s.itemClose}>Edit Favorite</Text>
                                    </View>
                                </Touchable>
                            </View>
                        </View>
                        <View style={styles.contentModal}>
                            <FlatList
                                scrollEnabled={false}
                                data={ArrayMenu.ArrayMoreProduct()}
                                renderItem={({ item }) => (
                                    <View style={{
                                        marginBottom: Metrics.padding.small,
                                        marginLeft: Scale(8)
                                    }}>
                                        <CardComponentFilter
                                            label={item.title}
                                            icons={item.source}
                                            onChoose={() => this.setState({ visibleModal: false }, () => { this.ClickMenu(item.slug) })}
                                        />
                                    </View>
                                )}
                                keyExtractor={(item, index) => index}
                                numColumns={4} />

                        </View>
                        {/* <View>
                                <Button 
                                        typePadding ='fullsize'
                                        style ={styles.save}
                                        onPress={()=> console.log('')}
                                        text =  {STRING.Label.button_save}
                                    />
                            </View> */}
                    </View>
                </Modal>
                <View style={styles.rectangle9}>

                            <View style={{ flex: 1, marginLeft: Scale(18), marginRight: Scale(8), alignItems: 'center', flexDirection: 'row', }}>

                                <Image
                                    style={[styles.ic_starYellow]}
                                    resizeMethod='scale'
                                    source={getIcon('ic_star_yellow')}
                                />
                                <TextView >PadiPointHome</TextView>
                                <TextView style={{ flex: 1, }} ellipsizeMode='tail'
                                    numberOfLines={1}> {this.state.point}</TextView>
                            </View>


                            <View style={styles.line4}>

                            </View>

                            <Touchable
                            onPress={() => this.props.navigation.navigate('SelectTour', { data: {title : 'PadiPay Deposit', page :'https://www.padipay.com/deposit/'} })}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginLeft: Scale(18), marginRight: Scale(8) }}>
                                <Image
                                    style={[styles.ic_cash]}
                                    resizeMethod='scale'
                                    source={getIcon('ic_cash')}
                                />

                                <TextView>Deposit</TextView>

                                <TextView style={{ flex: 1, }} ellipsizeMode='tail'
                                    numberOfLines={1}
                                >{' Rp ' + this.state.padicash}</TextView>
                            </View>
                            </Touchable>
                        </View>
                <ScrollView ref={'scrollView'}
                    style={{ marginBottom: Metrics.navBot }}
                    onScroll={this._onScroll}>
                    <View >

                        
                       

                        <View style={{ width: Metrics.screenWidth, height: Scale(170), }}>

                            {this.state.Banner && <Slick
                            // autoplay = {true}
                            // autoplayTimeout = {3}
                            // autoplayDirection = {true}
                            >

                                {this.state.Banner && this.state.Banner.map((item, i) => (
                                    // console.log(item.banner)
                                    <Image
                                        key={i}
                                        style={[styles.banner]}
                                        resizeMode='stretch'
                                        source={{ uri: item.banner }}
                                    />
                                ))}


                            </Slick>}
                            <View style={[styles.rectangle6, {position: 'absolute', bottom: 0, justifyContent: 'center', alignItems: 'center'}]}>
                                <TextView style={[styles.allPromos, {justifyContent: 'center', alignSelf: 'center', flex: 0}]} onPress={() => navigateTo('Promos', this.props.dispatch, this.props.navigation, null)}>All Promos</TextView>
                            </View>
                            {/* <View style={{ width: Metrics.screenWidth, height: Scale(170), position: 'absolute', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                
                            </View> */}
                        </View>
                    </View>

                    <View style={{ marginTop: Scale(4) }}>
                        <View style={{ padding: Scale(8) }}>
                            <TextView style={styles.GoodEveningStyle}>{this.state.titleTime}</TextView>
                            <TextView style={styles.NameStyle}>{this.state.name}</TextView>
                        </View>
                        <FlatList
                            contentContainerStyle={{ marginHorizontal: Scale(4) }}
                            scrollEnabled={false}
                            data={ArrayMenu.ArrayDashBoard()}

                            renderItem={({ item }) => (
                                <View style={{ flex: 1, justifyContent: 'center'}}>
                                    <CardComponent
                                        style={{width: 40, height: 40}}
                                        label={item.title}
                                        icons={item.source}
                                        ic_bg ={(item.id === '7') ? 'ic_blank' :'ic_bg_active'}
                                        onPress={() => this.ClickMenu(item.slug)}
                                    />
                                </View>
                            )}
                            keyExtractor={(item, index) => index}
                            numColumns={4} />

                    </View>

                    {/* <View
                        style={{ height: Scale(200), marginTop: Scale(10), padding: Scale(16), backgroundColor: '#f2f2f2' }}>

                        <TextView style={styles.selectYourFavorite}>{'Select Tour Package'}</TextView>


                        <FlatList
                            horizontal
                            // scrollEnabled={false}
                            // numColumns={2}
                            // showsVerticalScrollIndicator={false}
                            data={this.state.tourpackage}
                            keyExtractor={(item, index) => `key-${index}`}
                            renderItem={({ item }) => (
                                <Touchable
                                    onPress={() => this.props.navigation.navigate('SelectTour', { data: item })}>
                                    <View style={[styles.rectangle4]}>
                                        <Image
                                            style={[styles.bitmap]}
                                            resizeMethod='scale'
                                            source={{ uri: item.banner }}
                                        />
                                        <TextView style={styles.label_tour}>{item.title}</TextView>
                                    </View>
                                </Touchable>
                            )} />
                    </View> */}


                </ScrollView>

                {/* {this.state.scroll && <View style={{
                    left: 0,
                    right: 0,
                    bottom: Scale(65),
                    position: 'absolute',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>

                    <View style={{ flex: 1, marginBottom: Scale(4) }}>
                        <Image
                            style={[styles.img_scroll_more]}
                            resizeMethod='scale'
                            source={getIcon('ic_scroll_more')}
                        />
                       
                    </View>
                </View>} */}
                <Navbar active='home'
                    navigation={navigation} />





            </View>
        );
    }
}

const styles = StyleSheet.create({
    contentModal: {
        paddingVertical: Metrics.padding.medium
    },
    save: {
        marginTop: Metrics.padding.tiny
    },
    modal: {
        paddingTop: Metrics.padding.normal,
    },
    moreProduct: {
        fontFamily: Fonts.bold.fontFamily,
        fontWeight: Fonts.bold.fontWeight,
        fontSize: Metrics.font.medium,

    },
    header: {
        marginHorizontal: Metrics.padding.medium,
        marginVertical: Metrics.padding.small,
        flexDirection: 'row',
    },
    rectangle9: {
        flexDirection: 'row',
        alignItems: 'center',
        height: Scale(39),
        backgroundColor: "#ffffff"
    },
    banner: {
        width: Metrics.screenWidth,
        height: Scale(170)
    },
    rectangle6: {
        justifyContent: 'center',
        right: Scale(8),
        width: Scale(80),
        height: Scale(22),
        marginBottom: Scale(16),
        borderRadius: Scale(11),
        backgroundColor: Colors.tangerine
    }, allPromos: {
        flex: 1,
        textAlign: 'center',
        fontSize: Metrics.font.tiny,
        color: "#ffffff"
    },
    line4: {
        width: Scale(2),
        height: Scale(22),
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#dddddd"
    }, ic_cash: {
        right: Scale(4),
        width: Scale(14),
        height: Scale(14)
    },
    ic_starYellow: {
        right: Scale(4),
        width: Scale(14),
        height: Scale(14)
    },
    NameStyle: {
        fontSize: Scale(16),
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: "#000000"
    },
    GoodEveningStyle: {
        fontSize: Scale(14),
        fontStyle: "normal",
        textAlign: "left",
        color: Colors.gray
    },
    selectYourFavorite: {
        height: Scale(19),
        marginBottom: Scale(6),
        fontSize: Scale(14),
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: "#000000"
    },
    bitmap: {
        width: Scale(140),
        height: Scale(90),

    },
    rectangle4: {
        width: Scale(140),
        height: Scale(120),
        marginRight: Scale(10),
        borderRadius: Scale(6),
        backgroundColor: "#ffffff"
    },
    label_tour: {
        height: Scale(18),
        fontSize: Scale(13),
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "center",
        marginTop: Scale(4),
        color: "#606060"
    },
    img_scroll_more: {
        width: Scale(70),
        height: Scale(20)
    }, more: {
        flex: 1

    }, slide1: {
        flex: 1,
        backgroundColor: '#9DD6EB',
    },

});

AppRegistry.registerComponent("padiciti", () => Home);
