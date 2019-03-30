import React, { Component } from 'react'
import {
    StyleSheet,
    View,
    Image, 
    TouchableOpacity,
    Platform
} from 'react-native'


import { Touchable, Metrics,
        Colors,
        getIcon,
        Scale ,
        Icon, Fonts,
        TextView as Text,
        } from '../index'
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import CustomMaker from './CustomMaker';
import {Function} from '../../Utils'
export class MultiSliderTwo extends Component {
    constructor(props) {
        super(props);
        this.state = ({
            sliderOneChanging: false,
            multiSliderValue: this.props.value,
        })
    }
   

    multiSliderValuesChange = (values) => {
        this.setState({
            multiSliderValue: this.props.values,
        });
        }

    render() {
        const {
            label,
            value,
        } = this.props
        
        return (
            <View style={s.sliders}>
                        <View>
                            {[this.props.value[0], this.props.value[1]]
                                 && <View style={[s.row, s.paddmultislider]}>
                                        <View style={s.containerPrice}>
                                            <Text style={[s.percent]}>IDR  {this.props.value[0] && Function.convertToPrice(this.props.value[0])} </Text>
                                        </View>
                                        <View style={s.line}/>
                                        <View style={s.containerPrice}>
                                            <Text style={[s.percent]}>IDR {this.props.value[1] && Function.convertToPrice(this.props.value[1])}</Text>
                                        </View>
                            </View>}
                        </View>
                        <View style={{paddingTop : Metrics.padding.small}}>
                        <MultiSlider
                            values={[this.props.value[0], this.props.value[1]]}
                            onValuesChange={this.props.onValuesChange}
                            min={this.props.value[0]}
                            max={this.props.max}
                            selectedStyle={{
                                backgroundColor: Colors.tangerine,
                            }}
                            unselectedStyle={{
                                backgroundColor: Colors.warm_grey,
                            }}
                            // containerStyle={{
                            //     height:40,
                            //     backgroundColor :'pink'
                            // }}
                            trackStyle={{
                                height:6,
                                backgroundColor: 'red',
                            }}
                            touchDimensions={{
                                height: 20,
                                width: 40,
                                borderRadius: 20,
                                slipDisplacement: 40,
                                backgroundColor :'pink'
                            }}
                            customMarker={CustomMaker}
                            sliderLength={Metrics.screen.width*0.9}
                            step={2}
                            allowOverlap
                            snapped
                        />
                        </View>
            </View>
        )
    }
}



var s = StyleSheet.create({
    line:{
        borderWidth :1,
        borderColor : Colors.gray,
        width : Metrics.icon.small,
        height : 1
    },
    containerPrice:{
        justifyContent :'center',
        flex:1,
        borderRadius :20,
        borderWidth : Metrics.border,
        paddingHorizontal : Metrics.padding.small,
        paddingVertical : Metrics.padding.tiny
    },
    paddmultislider:{
        marginTop: Metrics.padding.tiny,
        marginBottom        : Metrics.padding.normal,
        justifyContent :'center',
        alignItems :'center',
        width : Metrics.screen.width*0.8
    },
    labelslider:{
        fontSize: Fonts.size.small
    },
    sliders: {
        marginHorizontal: Metrics.padding.normal,
        marginTop: Metrics.padding.small,
      },
    percent:{
        fontSize: Fonts.size.small,
        color : 'black',
    },
    row:{
        flexDirection: 'row',
    },
   
    

})