import React, { Component } from 'react';
import { Dimensions, AsyncStorage, Text, View, StyleSheet, SectionList, TextInput, Image, TouchableNativeFeedback, TouchableHighlight, TouchableOpacity, Platform, BackHandler, FlatList, ScrollView } from 'react-native';
import { Colors, getIcon, getAirlineLogo } from '../../Assets'
import OriginAirport from '../../Utils/Json'
import { Toolbar, FrameRadiusComponent, CardDetil, TextView, Metrics, LoadingFull } from '../../Components'
import { NavigationActions } from "react-navigation";
import { STRING, Function } from '../../Utils/index';
import { API, getURL } from '../../Services/API'
import { Parameter } from '../../Services/Parameter'
import { JSONPostFile } from '../../Services/JsonService'
const finish = NavigationActions.back({ key: "" });
const TouchableComponent = Platform.OS == 'ios' ? TouchableOpacity : TouchableNativeFeedback
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
export default class detil extends Component {
    constructor(props) {
        super(props);
        this.state = {
            search_param: null,
            loading : false,
            priceTotSales : 0,
        }
    }

    Onpres(item) {
        const { params } = this.props.navigation.state;
        const { navigation } = this.props;
        navigation.goBack();
        this.props.navigation.state.params.ActivityResult({ data: item, slug: params.slug === 'return' ? 'return' : 'depart' })

    }


    componentDidMount() {
        const { params } = this.props.navigation.state;
        // console.log(Function.SubstringTime(params.data.flightRspDetailJsons[0].arrvTime),' - - - ' ,Function.SubstringTime(params.data.flightRspDetailJsons[1].depTime))
        BackHandler.addEventListener('hardwareBackPress', () => this.backAndroid())
        AsyncStorage.getItem('SearchFlight', (err, SearchFlight) => {
            if (SearchFlight !== null) {
                this.setState({ search_param: Function.JsonParse(SearchFlight) })
            }
        })
        // this.Auth()
    }

    backAndroid() {
        this.props.navigation.dispatch(finish)
        return true // Needed so BackHandler knows that you are overriding the default action and that it should not close the app
    }


    Auth = () => {
        const { params } = this.props.navigation.state;
        try {
          this.setState({loading : true})
          let url = getURL('url_post_select_flight_2')
          let param = Parameter.DetilFlight(params.data.logCode)
          JSONPostFile(url, param).then((Respone) => {
          
            this.setState({ loading: false, priceTotSales: Respone.priceTotSales })
              switch (Respone.respCode) {
                  case '0':
                      this.setState({ loading: false, priceTotSales: Respone.priceTotSales })
                      break
                  default:
                  this.setState({ loading: false })
                      break;
              }
              
          }).catch((err) => {
            this.setState({ loading: false })
          })
        }catch(Error) { 
            this.setState({ loading: false })
        }
        
      }


    render() {
        const { params } = this.props.navigation.state;
        return (
            <View style={[styles.container]}>
                <Toolbar
                    arrow_back
                    onPress={() => this.backAndroid()}
                    View={
                        <TextView
                            style={{ fontSize: Scale(18), color: Colors.white }}
                            text={STRING.Label.flight_detail}
                        />}
                />

                <ScrollView>
                <View style={{ flex: 1 }}>
                    <View style={{ marginTop: Scale(16), paddingLeft: Scale(16), paddingRight: Scale(16), bottom: Scale(8), }}>
                        <TextView
                            style={{
                                color: Colors.blue, fontSize: Scale(16)
                            }}
                            text={params.slug !== 'return' ? STRING.Label_Flight.lbl_org_flight : STRING.Label_Flight.lbl_dep_flight} />
                        <TextView
                            style={{
                                color: Colors.warm_grey, fontSize: Scale(12)
                            }}
                            text={params.slug !== 'return' ? (this.state.search_param && (this.state.search_param[5].depart.title + ' - ' + this.state.search_param[6].return.title) + ', ' + this.state.search_param[3].depart_date) : (this.state.search_param && (this.state.search_param[6].return.title) + ' - ' + this.state.search_param[5].depart.title + ',' + this.state.search_param[4].return_date)} />

                        <View style={{
                            marginTop: Scale(16),
                            marginBottom: Scale(16),
                            height: Scale(2),
                            backgroundColor: Colors.whitesmoke
                        }} />
                    </View>

                    <View style={{ flex: 1 }}>

                        <FlatList
                            scrollEnabled={false}
                            style={{ backgroundColor: Colors.white }}
                            data={params.data.flightRspDetailJsons}
                            keyExtractor={(item, index) => `key-${index}`}
                            renderItem={({ item, index }) => (
                                <View>
                                    <CardDetil
                                        icon={getAirlineLogo(params.airlineGroup.toLowerCase())}
                                        FlightNo={item.flightNo}
                                        transport_name={params.data.airline}
                                        org_time={Function.SubstringTime(item.depTime)}
                                        org={Function.FormeteDate(item.depDate, 'YYYYMMDD', 'DD MMM')}
                                        detil_org={item.orgCity + ' (' + item.orgCode + ')'}
                                        bandara_org={item.orgAirport}
                                        dest_time={Function.SubstringTime(item.arrvTime)}
                                        dest={Function.FormeteDate(item.arrvDate, 'YYYYMMDD', 'DD MMM')}
                                        transport_time={Function.CalculateTime(item.depDate + item.depTime, item.arrvDate + item.arrvTime)}
                                        detil_des={item.desCity + ' (' + item.desCode + ')'}
                                        bandara_dest={item.desAirport}
                                        txt_food ={params.airlineGroup}
                                        img_food ={params.airlineGroup}
                                        total_index={params.data.flightRspDetailJsons.length}
                                        index={index + 1}
                                        transit={index + 1 !== params.data.flightRspDetailJsons.length ? params.data.flightRspDetailJsons[index + 1].orgCity + ' (' + params.data.flightRspDetailJsons[index + 1].orgCode + ') ' + STRING.Label_Flight.for + Function.CalculateTime(params.data.flightRspDetailJsons[index].arrvDate + params.data.flightRspDetailJsons[index].arrvTime, params.data.flightRspDetailJsons[index + 1].depDate + params.data.flightRspDetailJsons[index + 1].depTime) : null}

                                    />


                                </View>)}
                        />
                    </View>

                    {/* <View style={{
                        marginTop: Scale(16),
                        marginBottom: Scale(16),
                        height: Scale(2),
                        marginLeft: Scale(16),
                        marginRight: Scale(16),
                        backgroundColor: Colors.whitesmoke,
                    }} /> */}

                    {/* <View style={{ flexDirection: 'row', marginBottom: Scale(16),}}>
                    <View style={{ width: Metrics.screenWidth / 2, marginLeft : Scale(16) }}>
                        <Text style ={{color : '#66b445'}}>Refundabel </Text>
                    </View>
                    <View style={{ flex : 1, alignItems: 'flex-end', marginRight: Scale(16) }}>
                        <Text style ={{color : Colors.tangerine}} >INFO </Text>
                    </View>
                </View> */}
                </View>
                </ScrollView>

                <View
                    style={{ padding: Scale(16), height: Scale(60), bottom: 0, backgroundColor: '#f2f2f2', flexDirection: 'row' }}>
                    <View style={{ width: Metrics.screenWidth / 2 }}>
                        <TextView
                            style={{
                                fontSize: Scale(13),
                                color: Colors.black
                            }}
                            ellipsize='tail'
                            text={STRING.Label.price_poeple} />

                        {/* <TextView
                            style={{
                                fontSize: Scale(13),
                                color: Colors.warm_grey
                            }}
                            text={STRING.Label.ppn_title} /> */}
                    </View>

                    <View>

                        <View style={{ flex: 1, paddingRight: Scale(8), width: Metrics.screenWidth / 2 - 20, justifyContent: 'flex-end', flexDirection: 'row' }}>
                            <TextView
                                style={{
                                    fontSize: Scale(16),
                                    color: Colors.tangerine
                                }}
                                ellipsize='tail'
                                text={params.data.currency+' '+ Function.convertToPrice(params.data.price)} />


                        </View>
                    </View>
                </View>
                
                <LoadingFull
                visible={this.state.loading}
                title = {STRING.Label.please_wait}
                sub_title = {STRING.Label.page}/>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    }

});
