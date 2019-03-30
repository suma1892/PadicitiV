import React, { Component } from 'react'
import { TouchableNativeFeedback, TouchableHighlight, TouchableOpacity, Animated, Dimensions, Text, View, Image, StyleSheet, Easng, Platform, TouchableWithoutFeedback } from 'react-native'
import { Colors, Metrics, Fonts, Mainstyles, getIcon } from '../Assets'
import {Function} from '../Utils'
import PropTypes from 'prop-types'
const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}
export default class ItemListSchedulrFlight extends Component {
    constructor() {
        super();
    }
    _onPress() {
        this.props.onPress();
    }

    Time(flightRspDetailJsons, type){
        var i = 0
        var departTime = 0
        var returnTime = 0
        var Length = flightRspDetailJsons.length 
                departTime = flightRspDetailJsons[0].depDate+flightRspDetailJsons[0].depTime
                returnTime = flightRspDetailJsons[Length-1].arrvDate+ flightRspDetailJsons[Length-1].arrvTime
       
        switch (type){
            case 'DepartTime':
            return Function.SubstringTime(flightRspDetailJsons[0].depTime)
            case 'ReturnTime':
            return Function.SubstringTime(flightRspDetailJsons[Length-1].arrvTime)
            default:
            return Function.CalculateTime(departTime, returnTime)
        }
        
        
    }

    render() {
        const {
            DepartTime,
            OrigCode,
            ReturnTime,
            DestCode,
            PriceStreaked,
            Price,
            FlightName,
            LengthOfJourney,
            Status,
            icon_flight,
            onpress_detil
        } = this.props

        const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
        return (
            <View style={{ backgroundColor: Colors.white, flex: 1 }}>
                <TouchableComponent style={styles.touchable} onPress={() => this._onPress()}>
                    <View>
                        <View style={{ marginRight: Scale(8), marginLeft: Scale(8), paddingBottom: Scale(8), flexDirection: 'row'}}>
                            <View style={styles.View_ic_Flight}>
                                <Image
                                    style={[styles.ic_Flight]}
                                    resizeMode='contain'
                                    source={icon_flight}
                                />
                            </View>


                            <View style={{ marginTop: Scale(5), marginRight: Scale(8) }}>
                                <Text style={[styles.lbl_date, { color: Colors.black, }]} >{this.Time(DepartTime, 'DepartTime')}</Text>
                                <View >
                                    <Text style={[styles.lbl_date, {fontSize: Scale(11),}]} >{OrigCode}</Text>
                                </View>
                            </View>

                            <View style={styles.strip}>
                            </View>

                            <View style={{ marginTop: Scale(5), marginRight: Scale(8),  }}>
                                <Text style={[styles.lbl_date, { color: Colors.black, textAlign: "right", }]} >{this.Time(ReturnTime, 'ReturnTime')}</Text>
                                <View>
                                    <Text style={[styles.lbl_date, { textAlign: "right", fontSize: Scale(11),}]} >{DestCode}</Text>
                                </View>
                            </View>


                            <View style={{ marginTop: Scale(5), flex: 1, }}>
                                <Text style={styles.lbl_price_streaked} >{PriceStreaked}</Text>
                                <View>
                                    <Text style={styles.lbl_price} >{Price}</Text>
                                </View>
                            </View>
                        </View>
                        <View style={{ marginTop: Scale(8), marginLeft: Scale(8), paddingBottom: Scale(8), flexDirection: 'row' }}>
                            <View style={{ width: Scale(60), marginRight: Scale(8), alignItems: 'center' }}>
                                <Text style={[styles.lbl_date, { fontSize: Scale(12), textAlign: 'center' }]} >{FlightName}</Text>
                            </View>

                            <View style={{ width: Metrics.screenWidth / 2.64, flexDirection: 'row' }}>
                                <Text style={[styles.lbl_detail, { color: Colors.black }]} >{this.Time(LengthOfJourney)}</Text>
                                <Text style={[styles.lbl_detail, { color: Colors.warm_grey }]} >{Status}</Text>
                            </View>
                            <View style ={{ width: Metrics.screenWidth / 2.64,}}>
                                <TouchableComponent style={{flex :1, position: 'absolute', alignContent: 'flex-end'} } onPress={onpress_detil}>
                                    <View style={{ height : Scale(20), flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
                                        <Text style={styles.lbl_detail}>Lihat Detail</Text>
                                        <Image
                                            style={[styles.arrowThinRight]}
                                            resizeMethod='scale'
                                            source={getIcon('ic_arrow_thin_right')}
                                        />

                                    </View>
                                </TouchableComponent>
                            </View>

                        </View>
                    </View>
                </TouchableComponent>
            </View>
        )
    }
}


var styles = StyleSheet.create({
    touchable: {
        flex: 1
    },
    ic_Flight: {
        width: Scale(35),
        height: Scale(35),

    },
    View_ic_Flight: {
        width: Scale(60),
        marginTop: Scale(8),
        marginRight: Scale(8),
        alignItems: 'center'

    },
    lbl_maskapai: {
        marginTop: Scale(12),
        height: Scale(16),
       fontSize: Scale(12),
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: Colors.warm_grey
    },
    lbl_date: {
        fontSize: Scale(14),
        letterSpacing: 0,
        textAlign: "left",
        color: Colors.warm_grey
    },
    lbl_price_streaked: {
        fontSize: Scale(14),
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "right",
        textDecorationLine: 'line-through', textDecorationStyle: 'solid',
        color: Colors.warm_grey
    },
    lbl_price: {
        fontSize: Scale(16),
        fontWeight: "500",
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "right",
        color: Colors.tangerine
    },
    strip: {
        top: Scale(32),
        width: Scale(10),
        height: Scale(2),
        marginRight: Scale(8),
        marginLeft: Scale(4),
        backgroundColor: "#204a8b"
    },
    lbl_detail: {
        fontSize: Scale(12),
        fontStyle: "normal",
        letterSpacing: 0,
        textAlign: "left",
        color: "#204a8b"
    },
    arrowThinRight: {
        width: Scale(14),
        height: Scale(7),
        marginLeft: Scale(2)
    },

})