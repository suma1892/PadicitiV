import React, { Component } from 'react'
import { TouchableNativeFeedback, TouchableHighlight, TouchableOpacity, Animated, Dimensions, Text, View, Image, StyleSheet, Easng, Platform, TouchableWithoutFeedback } from 'react-native'
import { Colors, Metrics, Fonts, Mainstyles, getIcon } from '../Assets'
import { TextView, FrameRadiusComponent } from '../Components'
import PropTypes from 'prop-types'
import { STRING } from '../Utils';

const Scale = (value) => {
    const { width } = Dimensions.get('window')
    const guidelineBaseWidth = 350;

    return width / guidelineBaseWidth * value
}

export default class CardComponentReview extends Component {
    constructor() {
        super();
    }
    _onPress() {
        this.props.onPress();
    }

    render() {
        const {
            image,
            city,
            date,
            transport,
            onpress_detil,
            trafic,
            flightNo,
        } = this.props

        const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
        return (
            <View style={{ backgroundColor: Colors.white, flexDirection: 'row', }}>
                <View style={{ backgroundColor: Colors.white, flexDirection: 'row' }}>
                    {image && <View style={{ marginRight: Scale(8) }}>
                        <Image
                            style={{ height: Scale(40), width: Scale(40), marginRight: Scale(8), marginBottom: Scale(4) }}
                            resizeMode='contain'
                            source={image}
                        />
                    </View>}

                    <View style={{ width: this.props.width ? this.props.width :Metrics.screenWidth / 2.3, justifyContent: 'center' }}>
                        <TextView
                            style={{
                                fontSize: Scale(13), fontWeight: "bold", marginBottom: Scale(4)
                            }}
                            ellipsize={'tail'}
                            text={city}
                        />
                        {date && <TextView
                            style={{
                                fontSize: Scale(12), marginBottom: Scale(4)
                            }}
                            text={date}
                        />}

                        {trafic && <TextView
                            style={{
                                fontSize: Scale(12), marginBottom: Scale(4)
                            }}
                            text={trafic}
                        />}

                        {transport && <TextView
                            style={{
                                fontSize: Scale(12), color: Colors.warm_grey, marginBottom: Scale(4)
                            }}
                            text={transport}
                        />}

                        {flightNo && <TextView
                            style={{
                                width: Scale(100), fontSize: Scale(10), color: Colors.warm_grey,
                            }}
                            text={flightNo}
                        />}

                        {transport && <View style={{ flexDirection: 'row', top: Scale(4)}}>

                            <View>

                                <Image style={{ height: Scale(16), width: Scale(16), marginTop: Scale(8) }}
                                    resizeMode='contain'
                                    source={getIcon('ic_bagasi')} />
                                {(this.props.img_food !== 'jt' && this.props.img_food !== 'qz' && this.props.img_food !== 'qg') && <Image style={{ height: Scale(16), width: Scale(16), marginTop: Scale(8) }}
                                    resizeMode='contain'
                                    source={getIcon('ic_cutlery')} />}
                                <Image style={{ height: Scale(16), width: Scale(16), marginTop: Scale(8) }}
                                    resizeMode='contain'
                                    source={getIcon('ic_user')} />
                            </View>

                            <View style={{ marginHorizontal: Scale(16) }}>

                                <TextView
                                    numberOfLines={1}
                                    ellipsize={'tail'}
                                    style={{
                                        fontSize: Scale(13),
                                        color: Colors.blue,
                                        marginTop: Scale(8),
                                        width: Metrics.screenWidth / 2.5
                                    }}
                                    text={STRING.Label_Flight.baggage} />

                                {(this.props.txt_food !== 'jt' && this.props.txt_food !== 'qz' && this.props.txt_food !== 'qg') &&<TextView
                                    numberOfLines={1}
                                    ellipsize={'tail'}
                                    style={{
                                        fontSize: Scale(13),
                                        color: Colors.blue,
                                        marginTop: Scale(8),
                                        width: Metrics.screenWidth / 2.5

                                    }}
                                    text={STRING.Label_Flight.food} />}
                                    {console.log(this.props.txt_food)}

                                <TextView
                                    numberOfLines={1}
                                    ellipsize={'tail'}
                                    style={{
                                        fontSize: Scale(13),
                                        color: Colors.blue,
                                        marginTop: Scale(8),

                                        height: Scale(25)
                                    }}
                                    text={STRING.Label_Flight.passenger} />
                            </View>
                        </View>}


                    </View>

                    {!trafic && <View style={{ width: image ? Metrics.screenWidth / 2 - 66 : Metrics.screenWidth / 2 + 64, justifyContent: 'center', alignItems: 'flex-end' }}>
                        <TouchableComponent style={{ flex: 1, position: 'absolute', alignContent: 'flex-end' }} onPress={onpress_detil}>

                            <View >
                                {/* <FrameRadiusComponent
                                    style={{ height: Scale(20), width: Scale(55), borderColor: Colors.tangerine, alignItems: 'center', marginRight: Scale(25) }}
                                    View={ */}
                                <TextView
                                    style={{
                                        fontSize: Scale(12),
                                        color: Colors.tangerine
                                    }}
                                    text={'DETAIL'}
                                />
                                {/* } */}
                                {/* /> */}
                            </View>
                        </TouchableComponent>

                    </View>}

                    <View>

                    </View>
                </View>

            </View>
        )
    }
}


var styles = StyleSheet.create({
    View: {
        flex: 1
    },
    short_type: {
        fontSize: Fonts.size.regular,
        color: Colors.blumine,
        marginBottom: Scale(8),
    },
    short_route: {
        fontSize: Fonts.size.medium,
        lineHeight: Fonts.size.medium * 1.5,
    },

})