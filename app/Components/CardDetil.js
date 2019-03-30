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

export default class CardDetil extends Component {
    constructor() {
        super();
    }
    _onPress() {
        this.props.onPress();
    }

    render() {
        const {
            icon,
            FlightNo,
            transport_name,
            org_time,
            org,
            detil_org,
            bandara_org,
            dest_time,
            detil_des,
            dest,
            bandara_dest,
            transport_time,
            transit,
            index,
            total_index
            
        } = this.props

        const TouchableComponent = Platform.OS == 'ios' ? TouchableWithoutFeedback : TouchableNativeFeedback
        return (
            <View style={{flex : 1, backgroundColor : Colors.white}}> 
            <View style={{height : Metrics.screenHeight/2.7, backgroundColor: Colors.white, flexDirection: 'row', buttom : Scale(6)}}>
                <View style={{ backgroundColor: Colors.white, width: Scale(80), alignItems: 'center', height : Metrics.screenHeight/2.8 }}>
                    <Image
                        style={{
                            width: Scale(35),
                            height: Scale(35)
                        }}
                        resizeMode='contain'
                        source={icon}
                    />

                    <TextView
                        style={{
                            fontSize: 13, 
                            textAlign: 'center',
                            color: Colors.warm_grey
                        }}
                        numberOfLines = {1}
                        text={FlightNo}
                        ellipsize = 'tail'
                    />

                    <TextView
                        style={{
                            fontSize: 13, 
                            textAlign: 'center',
                            color : Colors.warm_grey,
                        }}
                        numberOfLines = {1}
                        text={transport_name}
                        ellipsize = 'tail'
                    />
                </View>
                <View style={{ flex: 1,backgroundColor: Colors.white, top: Scale(8) }}>

                    <View style={{ flexDirection: 'row' }}>
                        <View style={[styles.dot_img, styles.dot_img_green, { top: Scale(4) }]} />
                        <View style={{ backgroundColor: Colors.white }}>
                            <TextView
                                style={{
                                    fontSize: Scale(13)
                                }}
                                numberOfLines = {1}
                                ellipsize = 'tail'
                                text={org_time} />

                            <TextView
                                style={{
                                    fontSize: Scale(13),
                                    color : Colors.warm_grey
                                }}
                                numberOfLines = {1}
                                ellipsize = 'tail'
                                text={org} />
                        </View>

                        <View style={{ backgroundColor: Colors.white, marginLeft : Scale(16)}}>
                            <TextView
                                style={{
                                    fontSize: Scale(13),
                                    width : Metrics.screenWidth/2
                                }}
                                text={detil_org} 
                                numberOfLines = {1}
                                ellipsize = 'tail'/>

                            <TextView
                                style={{
                                    fontSize: Scale(13),
                                    color : Colors.warm_grey,
                                    width : this.props.widthBandaraAirport ? this.props.widthBandaraAirport : Metrics.screenWidth/2
                                }}
                                numberOfLines = {1}
                                ellipsize = 'tail'
                                text={STRING.Label_Flight.Airport+' '+bandara_org} />
                        </View>
                    </View>

                    <View style={{flexDirection: 'row',position : 'absolute', }}>
                    
                    <View style={[styles.vertical_line, { top : Scale(17),height: Scale(77) }]} />

                    <View style={{backgroundColor: Colors.white, top : Scale(50), left : Scale(40)}}>
                            <TextView
                                style={{
                                    fontSize: Scale(13), color : Colors.blumine
                                }}
                                numberOfLines = {1}
                                ellipsize = 'tail'
                                text={transport_time} />

                        </View>
                    </View>

                        <View style={{ flexDirection: 'row', top: Scale(50)}}>

                            <View style={[styles.dot_img, styles.dot_img_green, { backgroundColor: total_index === index ? Colors.blue : Colors.white }]} />

                            <View style={{ backgroundColor: Colors.white, }}>
                            <View style={{ flexDirection: 'row' }}>
                                <View>
                                <TextView
                                
                                    style={{
                                        fontSize: Scale(13)
                                    }}
                                    numberOfLines = {1}
                                    ellipsize='tail'
                                    text={dest_time} />

                                <TextView
                                    numberOfLines = {1}
                                    style={{
                                        fontSize: Scale(13),
                                        color: Colors.warm_grey
                                    }}
                                    ellipsize='tail'
                                    text={dest} />

                                    </View>

                                           <View style={{ backgroundColor: Colors.white, marginLeft : Scale(16)}}>
                            <TextView
                                numberOfLines = {1}
                                ellipsize = 'tail'
                                style={{
                                    fontSize: Scale(13),
                                    width : Metrics.screenWidth/2
                                }}
                                text={detil_des} />

                                <TextView
                                    numberOfLines = {1}
                                    ellipsize='tail'
                                    style={{
                                        fontSize: Scale(13),
                                        color: Colors.warm_grey,
                                        width : this.props.widthBandara_dest ? this.props.widthBandara_dest : Metrics.screenWidth/2
                                    }}
                                    text={STRING.Label_Flight.Airport+' '+bandara_dest} />

                                
                        </View>

                                    </View>

                                <View style={{ flexDirection: 'row' ,top : Scale(4) }}>

                                    <View>

                                        <Image style={{ height: Scale(16), width: Scale(16), marginTop: Scale(8) }}
                                            resizeMode='contain'
                                            source={getIcon('ic_bagasi')} />
                                        {(this.props.img_food !== 'JT' && this.props.img_food !== 'QZ' && this.props.img_food !== 'QG') && <Image style={{ height: Scale(16), width: Scale(16),marginTop: Scale(8) }}
                                            resizeMode='contain'
                                            source={getIcon('ic_cutlery')} />}
                                        <Image style={{ height: Scale(16), width: Scale(16),marginTop: Scale(8) }}
                                            resizeMode='contain'
                                            source={getIcon('ic_user')} />
                                    </View>

                                    <View style={{ marginHorizontal: Scale(16) }}>

                                        <TextView
                                            numberOfLines = {1}
                                            ellipsize={'tail'}
                                            style={{
                                                fontSize: Scale(13),
                                                color: Colors.blue,
                                                marginTop: Scale(8),
                                                width: Metrics.screenWidth / 2.5
                                            }}
                                            text={STRING.Label_Flight.baggage} />

                                        {(this.props.txt_food !== 'JT' && this.props.txt_food !== 'QZ' && this.props.txt_food !== 'QG') &&<TextView
                                            numberOfLines = {1}
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
                                            numberOfLines = {1}
                                            ellipsize={'tail'}
                                            style={{
                                                fontSize: Scale(13),
                                                color: Colors.blue,
                                                marginTop: Scale(8),
                                                width: Metrics.screenWidth / 2,
                                                height : Scale(25)
                                            }}
                                            text={STRING.Label_Flight.passenger} />
                                    </View>
                                </View>
                        </View>


                 

                        
                    </View>
                </View>
                
            </View>
            
                {total_index !== index && <View style={{ marginBottom: Scale(16), marginHorizontal: Scale(16), backgroundColor: Colors.white }}>
                    <FrameRadiusComponent
                        style={{ borderColor: Colors.blue , padding : Scale(8)}}
                        View={

                            <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white , justifyContent : 'center'}}>

                                <TextView  
                                numberOfLines = {1}
                                ellipsize = 'tail'
                                style ={{color : Colors.blue }}>{STRING.Label_Flight.transit + transit}</TextView>
                            </View>
                        }
                    />
                </View>}
                
            </View>
        )
    }
}


var styles = StyleSheet.create({
    dot_img: {
        height: Metrics.icon.tiny / 1.5,
        width: Metrics.icon.tiny / 1.5,
        borderRadius: Metrics.icon.tiny / 3,
        borderColor: Colors.blue,
        borderWidth: 1,
        backgroundColor: '#c7cfdb',
        marginHorizontal: Metrics.sizePad,
        marginVertical: Metrics.sizePad * .4,
    },
    dot_img_green: {
        backgroundColor: Colors.white
    },
    vertical_line: {
        position: 'absolute',
        left: Metrics.sizePad,
        top: Metrics.icon.tiny / 1,
        bottom: 0,
        minWidth: (Metrics.icon.tiny / 3),
        borderRightWidth: 1,
        borderColor: Colors.blue,
        flex: 1,
    },
})